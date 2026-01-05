// Constants
const BASE_URL = 'https://app.twentyoverten.com'
const EXCLUSION_TAGS = ['SF - Not On Program', 'SF - Program Site']
const EMAIL_REGEX = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi
const TEAM_PAGE_KEYWORDS = [
    'team', 'about', 'staff', 'people', 'meet', 'advisor', 'advisors', 'contact', 'contact-us',
    'équipe', 'notre équipe', 'à propos', 'personnel', 'rencontrez', 'conseillers', 'contactez-nous'
]
const HOME_PAGE_KEYWORDS = ['home', 'accueil', 'home-en', 'home-fr']

// Helper function to extract emails from text
function extractEmails(text) {
    if (!text) return []
    return [...new Set(text.match(EMAIL_REGEX) || [])]
}

// Helper function to create member object
function createMember(name = "", title = "", email = "", source = "") {
    if (name.includes(',')) name = name.split(',')[0].trim() // Remove designations
    return { name, title, email, sources: source ? [source] : [], count: 1 }
}

// Helper function to add or update member in the list
function addOrUpdateMember(memberMap, emailSet, emailToMemberMap, member) {
    if (!member.email) {
        return
    }
    
    const emailLower = member.email.toLowerCase()
    
    // If email already exists, update count and sources
    if (emailSet.has(emailLower)) {
        const existingMember = emailToMemberMap.get(emailLower)
        if (existingMember) {
            existingMember.count += 1
            if (member.sources.length > 0 && !existingMember.sources.includes(member.sources[0])) {
                existingMember.sources.push(member.sources[0])
            }
            // If existing member has no name but new one does, update it
            if (!existingMember.name && member.name) {
                existingMember.name = member.name
                existingMember.title = member.title
            }
        }
        return
    }
    
    const key = member.name || member.email
    memberMap.set(key, member)
    emailSet.add(emailLower)
    emailToMemberMap.set(emailLower, member)
}

let output = ""
let count = 0

// Iterate through all advisors
// for (const advisor of advisor_list) {

// Only filter through the last 50 advisors for testing
for (const advisor of advisor_list.slice(-50)) {
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
        
        const display_name = advisor.display_name || "N/A"
        const tags = advisor.settings.broker_tags.map(tag => tag.name).join(', ') || "N/A"
        const urls = siteData.settings.domains
        const domain_list = urls.length > 0 ? urls.join(', ') : "N/A"
        const is_published = advisor.published_date === "NA" ? "No" : "Yes"

        // Filter for active member pages
        const member_pages = pages.pages.filter((page) => page.type === "members" && page.state === "active")
        
        // Filter for active standard pages with relevant keywords
        const standard_pages = pages.pages.filter((page) => 
            page.type === "standard" && 
            page.state === "active" &&
            TEAM_PAGE_KEYWORDS.some(keyword => 
                (page.title && page.title.toLowerCase().includes(keyword)) ||
                (page.slug && page.slug.toLowerCase().includes(keyword))
            )
        )
        const home_pages = pages.pages.filter((page) =>
            page.state === "active" &&
            HOME_PAGE_KEYWORDS.some(keyword => 
                (page.slug && page.slug.toLowerCase() === keyword) ||
                (page.title && page.title.toLowerCase() === keyword)
            )
        )
        
        // If no relevant pages found, check home and accueil pages as fallback
        if (member_pages.length === 0 && standard_pages.length === 0) { 
            if (home_pages.length === 0) {
                output += `\n${display_name}\t${is_published}\t${tags}\t${domain_list}\tNO RELEVANT PAGES`
                continue
            }
        }

        // Track members using Map for better performance
        const memberMap = new Map()
        const emailSet = new Set()
        const emailToMemberMap = new Map() // For O(1) email lookups

        // Fetch members and page for each member page
        const memberPromises = member_pages.map(async (member_page) => {
            try {
                // Fetch members and page content in parallel
                const [membersResponse, pageResponse] = await Promise.all([
                    fetch(`${BASE_URL}/api/members?page_id=${member_page._id}`),
                    fetch(`${BASE_URL}/api/pages/${member_page._id}`)
                ])
                
                const [members, page] = await Promise.all([
                    membersResponse.json(),
                    pageResponse.json()
                ])
                
                const activeMembers = members
                    .filter((member) => member.state === "active")
                    .map((member) => ({ 
                        name: member.name, 
                        title: member.title, 
                        bio: member.bio 
                    }))

                for (const member of activeMembers) {
                    const emails = extractEmails(member.bio)
                    
                    // Early deduplication check
                    if (emails.length > 0 && !emailSet.has(emails[0].toLowerCase())) {
                        // Add the member with their name and title
                        addOrUpdateMember(memberMap, emailSet, emailToMemberMap, createMember(
                            member.name,
                            member.title,
                            emails[0],
                            "Member Page"
                        ))
                    }
                    
                    // Add additional emails as separate members if more than one email found
                    for (let i = 1; i < emails.length; i++) {
                        if (!emailSet.has(emails[i].toLowerCase())) {
                            addOrUpdateMember(memberMap, emailSet, emailToMemberMap, createMember("", "", emails[i], "Member Page"))
                        }
                    }
                }

                // Extract emails from page content
                const pageEmails = extractEmails(page.content)
                for (const email of pageEmails) {
                    // Early deduplication check
                    if (!emailSet.has(email.toLowerCase())) {
                        addOrUpdateMember(memberMap, emailSet, emailToMemberMap, createMember("", "", email, "Member Page"))
                    }
                }
            } catch (error) {
                console.error(`Error processing member page ${member_page._id}:`, error)
            }
        })

        // Process standard pages for additional emails
        const standardPromises = standard_pages.map(async (standard_page) => {
            try {
                const pageResponse = await fetch(`${BASE_URL}/api/pages/${standard_page._id}`)
                const page = await pageResponse.json()
                
                const pageEmails = extractEmails(page.content)
                for (const email of pageEmails) {
                    // Early deduplication check
                    if (!emailSet.has(email.toLowerCase())) {
                        addOrUpdateMember(memberMap, emailSet, emailToMemberMap, createMember("", "", email, "Standard Page"))
                    }
                }
            } catch (error) {
                console.error(`Error processing standard page ${standard_page._id}:`, error)
            }
        })
        
        // Process home pages if they're being used as fallback
        const homePromises = home_pages.map(async (home_page) => {
            try {
                const pageResponse = await fetch(`${BASE_URL}/api/pages/${home_page._id}`)
                const page = await pageResponse.json()
                
                const pageEmails = extractEmails(page.content)
                for (const email of pageEmails) {
                    // Early deduplication check
                    if (!emailSet.has(email.toLowerCase())) {
                        addOrUpdateMember(memberMap, emailSet, emailToMemberMap, createMember("", "", email, "Home Page"))
                    }
                }
            } catch (error) {
                console.error(`Error processing home page ${home_page._id}:`, error)
            }
        })
        
        // Wait for all member and standard page fetches to complete in parallel
        await Promise.all([...memberPromises, ...standardPromises, ...homePromises])


        // Convert Map to output
        if (memberMap.size === 0) {
            output += `\n${display_name}\t${is_published}\t${tags}\t${domain_list}\tNO MEMBERS FOUND`
        } else {
            for (const member of memberMap.values()) {
                const sourceText = member.sources.map(s => `${s} (${member.count})`).join(', ') || 'Unknown'
                output += `\n${display_name}\t${is_published}\t${tags}\t${domain_list}\t${sourceText}\t${member.name}\t${member.title}\t${member.email}`
            }
        }

    } catch (error) {
        console.error(`Error processing advisor ${advisor.display_name}:`, error)
        output += `\n${advisor.display_name}\tN/A\tN/A\tN/A\tN/A\tERROR: ${error.message}`
    }
}

console.log(`Tradename\tPublished\tTags\tDomains\tSource\tAdvisor\tTitle\tEmail${output}`)
