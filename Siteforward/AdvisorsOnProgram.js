// Constants
const BASE_URL = 'https://app.twentyoverten.com'
const EXCLUSION_TAGS = ['SF - Not On Program', 'SF - Program Site']
const EMAIL_REGEX = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi

// Helper function to extract emails from text
function extractEmails(text) {
    if (!text) return []
    return [...new Set(text.match(EMAIL_REGEX) || [])]
}

// Helper function to create member object
function createMember(name = "", title = "", email = "") {
    return { name, title, email }
}

// Helper function to add or update member in the list
function addOrUpdateMember(memberMap, emailSet, member) {
    // Skip if email already exists
    if (member.email && emailSet.has(member.email.toLowerCase())) {
        return
    }
    
    const key = member.name || member.email
    if (!memberMap.has(key)) {
        memberMap.set(key, member)
        if (member.email) {
            emailSet.add(member.email.toLowerCase())
        }
    }
}

let output = ""
let count = 0

// Iterate through all advisors
// Only filter through the first 10 advisors for testing
for (const advisor of advisor_list.slice(0, 10)) {
    count++

    // Check if the website is not taken down, and if the advisor is not on the exclusion list
    if (
        advisor.site.status === "taken_down" ||
        advisor.settings.broker_tags.some((tag) => EXCLUSION_TAGS.includes(tag.name))
    ) {
        console.log(`${count}. Skipping ${advisor.display_name}`)
        continue
    }

    console.log(`${count}. Checking ${advisor.display_name}`)

    // Login to the advisor's site to access member pages
    const id = advisor._id
    try {
        await fetch(`${BASE_URL}/manage/login/${id}`) // Login so the next calls work
        
        // Fetch site settings and pages in parallel
        const [site_settings, pagesResponse] = await Promise.all([
            fetch(`${BASE_URL}/api/sites/`),
            fetch(`${BASE_URL}/api/pages`)
        ])
        
        const [siteData, pages] = await Promise.all([
            site_settings.json(),
            pagesResponse.json()
        ])
        
        const urls = siteData.settings.domains

        // Filter for active member pages
        const member_pages = pages.pages.filter((page) => page.type === "members" && page.state === "active")
        if (member_pages.length === 0) {
            output += `\n${advisor.display_name}\t${urls.join(', ')}\tNO MEMBER PAGES`
            continue
        }

        // Track members using Map for better performance
        const memberMap = new Map()
        const emailSet = new Set()

        // Fetch members and page for each member page
        const memberPromises = member_pages.map(async (member_page) => {
            try {
                // Fetch members
                const membersResponse = await fetch(`${BASE_URL}/api/members?page_id=${member_page._id}`)
                const members = await membersResponse.json()
                
                const activeMembers = members
                    .filter((member) => member.state === "active")
                    .map((member) => ({ 
                        name: member.name, 
                        title: member.title, 
                        bio: member.bio 
                    }))

                for (const member of activeMembers) {
                    const emails = extractEmails(member.bio)
                    
                    // Add the member with their name and title
                    addOrUpdateMember(memberMap, emailSet, createMember(
                        member.name,
                        member.title,
                        emails.length > 0 ? emails[0] : ""
                    ))
                    
                    // Add additional emails as separate members if more than one email found
                    for (let i = 1; i < emails.length; i++) {
                        addOrUpdateMember(memberMap, emailSet, createMember("", "", emails[i]))
                    }
                }

                // Fetch page content for additional emails
                const pageResponse = await fetch(`${BASE_URL}/api/pages/${member_page._id}`)
                const page = await pageResponse.json()
                
                const pageEmails = extractEmails(page.content)
                for (const email of pageEmails) {
                    addOrUpdateMember(memberMap, emailSet, createMember("", "", email))
                }
            } catch (error) {
                console.error(`Error processing member page ${member_page._id}:`, error)
            }
        })

        // Wait for all member and page fetches to complete
        await Promise.all(memberPromises)

        // Convert Map to output
        for (const member of memberMap.values()) {
            output += `\n${advisor.display_name}\t${urls.join(', ')}\t${member.name}\t${member.title}\t${member.email}`
        }

    } catch (error) {
        console.error(`Error processing advisor ${advisor.display_name}:`, error)
        output += `\n${advisor.display_name}\t${urls || 'N/A'}\tERROR: ${error.message}`
    }
}

console.log(`Tradename\tDomain\tAdvisor\tTitle\tEmail${output}`)
