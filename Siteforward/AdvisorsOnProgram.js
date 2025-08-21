// Email regex pattern for reuse
const EMAIL_REGEX = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi

// Helper function to extract emails from text
function extractEmails(text) {
    if (!text) return []
    return [...new Set(text.match(EMAIL_REGEX) || [])]
}

// Helper function to add or update member in the list
function addOrUpdateMember(memberMap, member) {
    // If member has an email, check for existing email prefixes
    if (member.email) {
        const emailPrefix = member.email.split('@')[0].toLowerCase()
        
        // Check if any existing member has the same email prefix
        for (const [key, existingMember] of memberMap.entries()) {
            if (existingMember.email) {
                const existingPrefix = existingMember.email.split('@')[0].toLowerCase()
                if (existingPrefix === emailPrefix) {
                    // Don't add if same email prefix exists
                    return
                }
            }
        }
    }
    
    const key = member.name || member.email
    if (memberMap.has(key)) {
        memberMap.get(key).count += 1
    } else {
        memberMap.set(key, { ...member, count: 1 })
    }
}

let output = ""
let count = 0

// Iterate through the first 10 advisors
for (const advisor of advisor_list) {
    count++

    // Check if the website is not taken down, and if the advisor is not on the exclusion list
    if (
        advisor.site.status == "taken_down" ||
        advisor.settings.broker_tags.some((tag) => tag.name == "SF - Not On Program" || tag.name == "SF - Program Site")
    ) {
        console.log(`${count}. Skipping ${advisor.display_name}`)
        continue
    }

    console.log(`${count}. Checking ${advisor.display_name}`)

    // Login to the advisor's site to access member pages
    const id = advisor._id
    try {
        await fetch(`https://app.twentyoverten.com/manage/login/${id}`) // Login so the next calls work
        const pagesResponse = await fetch(`https://app.twentyoverten.com/api/pages`)
        const pages = await pagesResponse.json()

        // Filter for active member pages
        const member_pages = pages.pages.filter((page) => page.type == "members" && page.state == "active")
        if (member_pages.length == 0) {
            output += `\n${advisor.display_name}\tNO MEMBER PAGES`
            continue
        }

        // Track members using Map for better performance
        const memberMap = new Map()

        // Fetch members and page for each member page
        const memberPromises = member_pages.map(async (member_page) => {
            try {
                // Fetch members
                const membersResponse = await fetch(`https://app.twentyoverten.com/api/members?page_id=${member_page._id}`)
                const members = await membersResponse.json()
                
                const activeMembers = members
                    .filter((member) => member.state == "active")
                    .map((member) => ({ 
                        name: member.name, 
                        title: member.title, 
                        bio: member.bio 
                    }))

                if (activeMembers.length == 0) {
                    output += `\n${advisor.display_name}\tNO MEMBERS`
                } else {
                    for (const member of activeMembers) {
                        const emails = extractEmails(member.bio)
                        
                        // Add the member with their name and title
                        addOrUpdateMember(memberMap, {
                            name: member.name,
                            title: member.title,
                            bio: null,
                            email: emails.length > 0 ? emails[0] : "" // Use first email for the named member
                        })
                        
                        // Add additional emails as separate members if more than one email found
                        if (emails.length > 1) {
                            for (let i = 1; i < emails.length; i++) {
                                addOrUpdateMember(memberMap, {
                                    name: "",
                                    title: "",
                                    bio: null,
                                    email: emails[i]
                                })
                            }
                        }
                    }
                }

                // Fetch page content for additional emails
                const pageResponse = await fetch(`https://app.twentyoverten.com/api/pages/${member_page._id}`)
                const page = await pageResponse.json()
                
                const pageEmails = extractEmails(page.content)
                for (const email of pageEmails) {
                    // Check if email already exists for a current member
                    const existingMember = Array.from(memberMap.values()).find(mem => 
                        mem.email && mem.email.includes(email)
                    )
                    
                    if (!existingMember) {
                        addOrUpdateMember(memberMap, {
                            name: "",
                            title: "",
                            bio: null,
                            email: email
                        })
                    }
                }
            } catch (error) {
                console.error(`Error processing member page ${member_page._id}:`, error)
            }
        })

        // Wait for all member and page fetches to complete
        await Promise.all(memberPromises)

        // Convert Map back to array and add to output
        for (const member of memberMap.values()) {
            output += `\n${advisor.display_name}\t${member.name}\t${member.title}\t${member.email}${member.count > 1 ? "\t" + member.count : ""}`
        }

    } catch (error) {
        console.error(`Error processing advisor ${advisor.display_name}:`, error)
        output += `\n${advisor.display_name}\tERROR: ${error.message}`
    }
}

console.log(`Tradename\tAdvisor\tTitle\tEmail${output}`)
