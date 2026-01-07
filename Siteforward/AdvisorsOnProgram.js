// Constants
const BASE_URL = 'https://app.twentyoverten.com'
const EXCLUSION_TAGS = ['SF - Not On Program', 'SF - Program Site']
const EMAIL_REGEX = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi
const IGNORED_EMAIL_PREFIXES = ['info@', 'contact@', 'support@', 'service@', 'general@', 'headoffice@'
]
const TEAM_PAGE_KEYWORDS = [
    'team', 'about', 'staff', 'people', 'meet', 'advisor', 'advisors', 'contact', 'contact-us',
    'équipe', 'notre équipe', 'à propos', 'personnel', 'rencontrez', 'conseillers', 'contactez-nous'
]
const HOME_PAGE_KEYWORDS = ['home', 'accueil', 'home-en', 'home-fr']
const DOMAIN_GROUPS = [
    ['manulifesecurities.ca', 'manulifewealth.ca', 'placementsmanuvie.ca', 'gestiondepatrimoinemanuvie.ca', 'manulife.ca']
]

let advisors_list = advisor_list // Providence changer extension provides this variable on the page
// Only filter through the last 25 advisors for testing
//advisors_list = advisor_list.slice(-25)

//Filter a specific advisor for testing
//advisors_list =  advisors_list.filter(a => a.display_name === "François Giguere")
    

// Helper function to check if two domains belong to the same group
function areDomainsInSameGroup(domain1, domain2) {
    if (!domain1 || !domain2) return false
    const d1 = domain1.toLowerCase()
    const d2 = domain2.toLowerCase()
    if (d1 === d2) return true
    
    for (const group of DOMAIN_GROUPS) {
        if (group.includes(d1) && group.includes(d2)) {
            return true
        }
    }
    return false
}

// Helper function to get email prefix and domain
function parseEmail(email) {
    if (!email) return { prefix: '', domain: '' }
    const [prefix = '', domain = ''] = email.split('@')
    return {
        prefix: prefix.toLowerCase(),
        domain: domain.toLowerCase()
    }
}

// Helper function to check if two emails have the same prefix and related domains
function areEmailsEquivalent(email1, email2) {
    if (!email1 || !email2) return false
    const parsed1 = parseEmail(email1)
    const parsed2 = parseEmail(email2)
    
    return parsed1.prefix === parsed2.prefix && areDomainsInSameGroup(parsed1.domain, parsed2.domain)
}

// Helper function to check if an email should be ignored
function isEmailIgnored(email) {
    if (!email) return true
    const email_lower = email.toLowerCase()
    return IGNORED_EMAIL_PREFIXES.some(prefix => email_lower.startsWith(prefix))
}

// Helper function to extract emails from text
function extractEmails(text) {
    if (!text) return []
    const all_emails = [...new Set(text.match(EMAIL_REGEX) || [])]
    return all_emails.filter(email => !isEmailIgnored(email))
}

// Helper function to normalize name for email comparison
function normalizeNameForEmail(name) {
    if (!name) return ""
    // Normalize accented characters to their base forms
    const normalized = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    return normalized.toLowerCase().replace(/[^a-z]/g, '') // Remove spaces, dots, hyphens, etc.
}

// Helper function to check if a name is contained in an email
function nameMatchesEmail(name, email) {
    if (!name || !email) return false
    const normalized_name = normalizeNameForEmail(name)
    const email_prefix = parseEmail(email).prefix.toLowerCase().replace(/[^a-z]/g, '')
    return email_prefix.includes(normalized_name) || normalized_name.includes(email_prefix)
}

// Helper function to create member object
function createMember(name = "", title = "", email = "", source = "") {
    if (name.includes(',')) name = name.split(',')[0] // Remove designations
    name = name.replace(/\[.*?\]/g, '').trim() // Remove text in square brackets

    // Replace instances of "1nl1" in name and title
    name = name.replace(/1nl1/g, 'l')
    title = title.replace(/1nl1/g, 'l')
    name = name.trim() // Trim whitespace

    const sourceCounts = {}
    if (source) sourceCounts[source] = 1
    return { name, title, email, sources: source ? [source] : [], sourceCounts, equivalentEmails: [] }
}

// Helper function to update existing member with new data
function updateMemberData(existing_member, member) {
    const new_source = member.sources[0]
    if (new_source) {
        if (!existing_member.sources.includes(new_source)) {
            existing_member.sources.push(new_source)
        }
        existing_member.sourceCounts[new_source] = (existing_member.sourceCounts[new_source] || 0) + 1
    }
    if (!existing_member.name && member.name) {
        existing_member.name = member.name
        existing_member.title = member.title
    }
    if (!existing_member.title && member.title) {
        existing_member.title = member.title
    }
}

// Helper function to find existing member by email equivalence
function findEquivalentEmailMember(member, email_to_member_map) {
    for (const [existing_email, existing_member] of email_to_member_map.entries()) {
        if (areEmailsEquivalent(member.email, existing_email)) {
            return { email: existing_email, member: existing_member }
        }
    }
    return null
}

// Helper function to find existing member by name match
function findMemberByNameMatch(member, email_to_member_map, name_to_member_map) {
    // Check email-to-member matches
    if (member.name) {
        for (const [existing_email, existing_member] of email_to_member_map.entries()) {
            if (nameMatchesEmail(member.name, existing_email)) {
                return { type: 'email', key: existing_email, member: existing_member }
            }
        }
    }
    
    // Check name-to-member matches
    if (member.email) {
        for (const [existing_name, existing_member] of name_to_member_map.entries()) {
            if (nameMatchesEmail(existing_name, member.email)) {
                return { type: 'name', key: existing_name, member: existing_member }
            }
        }
    }
    
    return null
}

// Helper function to add member with email
function addMemberWithEmail(member_map, email_set, email_to_member_map, name_set, name_to_member_map, member) {
    const email_lower = member.email.toLowerCase()
    
    // Check exact email match
    if (email_set.has(email_lower)) {
        const existing_member = email_to_member_map.get(email_lower)
        updateMemberData(existing_member, member)
        return
    }
    
    // Check equivalent email match
    const equivalent_match = findEquivalentEmailMember(member, email_to_member_map)
    if (equivalent_match) {
        updateMemberData(equivalent_match.member, member)
        if (!equivalent_match.member.equivalentEmails.includes(member.email)) {
            equivalent_match.member.equivalentEmails.push(member.email)
        }
        return
    }
    
    // Check name-based match
    const name_match = findMemberByNameMatch(member, email_to_member_map, name_to_member_map)
    if (name_match) {
        updateMemberData(name_match.member, member)
        
        // If matched with name-only member, migrate to email tracking
        if (name_match.type === 'name') {
            name_match.member.email = member.email
            member_map.delete(name_match.key)
            name_set.delete(name_match.key.toLowerCase())
            name_to_member_map.delete(name_match.key.toLowerCase())
            
            const key = name_match.member.name || name_match.member.email
            member_map.set(key, name_match.member)
            email_set.add(email_lower)
            email_to_member_map.set(email_lower, name_match.member)
        }
        return
    }
    
    // Add as new member
    const key = member.name || member.email
    member_map.set(key, member)
    email_set.add(email_lower)
    email_to_member_map.set(email_lower, member)
}

// Helper function to add member without email
function addMemberWithoutEmail(member_map, name_set, name_to_member_map, email_to_member_map, member) {
    const name_lower = member.name.toLowerCase().trim()
    
    // Check exact name match
    if (name_set.has(name_lower)) {
        const existing_member = name_to_member_map.get(name_lower)
        updateMemberData(existing_member, member)
        return
    }
    
    // Check if name matches existing email member
    for (const [existing_email, existing_member] of email_to_member_map.entries()) {
        if (existing_member.name && existing_member.name.toLowerCase().trim() === name_lower) {
            updateMemberData(existing_member, member)
            return
        }
        
        if (!existing_member.name && nameMatchesEmail(member.name, existing_email)) {
            existing_member.name = member.name
            existing_member.title = member.title
            updateMemberData(existing_member, member)
            return
        }
    }
    
    // Add as new member
    member_map.set(member.name, member)
    name_set.add(name_lower)
    name_to_member_map.set(name_lower, member)
}

// Helper function to add or update member in the list
function addOrUpdateMember(member_map, email_set, email_to_member_map, name_set, name_to_member_map, member) {
    if (member.email) {
        addMemberWithEmail(member_map, email_set, email_to_member_map, name_set, name_to_member_map, member)
    } else if (member.name) {
        addMemberWithoutEmail(member_map, name_set, name_to_member_map, email_to_member_map, member)
    }
}

let output = ""
let count = 0

// Iterate through all advisors
for (const advisor of advisors_list) {

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
        const loginResponse = await fetch(`${BASE_URL}/manage/login/${id}`)
        await loginResponse.text() // Ensure login completes before continuing
        
        // Add small delay to ensure session is established
        await new Promise(resolve => setTimeout(resolve, 100))
        
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
        const member_map = new Map()
        const email_set = new Set()
        const email_to_member_map = new Map() // For O(1) email lookups
        const name_set = new Set() // For tracking members without emails
        const name_to_member_map = new Map() // For O(1) name lookups

        // Helper function to process page and extract emails
        async function processPageForEmails(page_id, source_label) {
            try {
                const page_response = await fetch(`${BASE_URL}/api/pages/${page_id}`)
                const page = await page_response.json()
                
                const page_emails = extractEmails(page.content)
                for (const email of page_emails) {
                    addOrUpdateMember(member_map, email_set, email_to_member_map, name_set, name_to_member_map, 
                        createMember("", "", email, source_label))
                }
            } catch (error) {
                console.error(`Error processing page ${page_id}:`, error)
            }
        }

        // Fetch members and page for each member page
        const member_promises = member_pages.map(async (member_page) => {
            try {
                // Fetch members and page content in parallel
                const [members_response, page_response] = await Promise.all([
                    fetch(`${BASE_URL}/api/members?page_id=${member_page._id}`),
                    fetch(`${BASE_URL}/api/pages/${member_page._id}`)
                ])
                
                const [members, page] = await Promise.all([
                    members_response.json(),
                    page_response.json()
                ])
                
                const active_members = members
                    .filter((member) => member.state === "active")
                    .map((member) => ({ 
                        name: member.name, 
                        title: member.title, 
                        bio: member.bio 
                    }))

                for (const member of active_members) {
                    const emails = extractEmails(member.bio)
                    
                    if (emails.length > 0) {
                        // Add the member with their name, title, and first email
                        addOrUpdateMember(member_map, email_set, email_to_member_map, name_set, name_to_member_map, createMember(
                            member.name,
                            member.title,
                            emails[0],
                            "Member Page"
                        ))
                        
                        // Add additional emails as separate members if more than one email found
                        for (let i = 1; i < emails.length; i++) {
                            addOrUpdateMember(member_map, email_set, email_to_member_map, name_set, name_to_member_map, 
                                createMember("", "", emails[i], "Member Page"))
                        }
                    } else if (member.name && !name_set.has(member.name.toLowerCase().trim())) {
                        // Capture member without email if they have a name
                        addOrUpdateMember(member_map, email_set, email_to_member_map, name_set, name_to_member_map, createMember(
                            member.name,
                            member.title,
                            "",
                            "Member Page"
                        ))
                    }
                }

                // Extract emails from page content
                const page_emails = extractEmails(page.content)
                for (const email of page_emails) {
                    addOrUpdateMember(member_map, email_set, email_to_member_map, name_set, name_to_member_map, 
                        createMember("", "", email, "Member Page"))
                }
            } catch (error) {
                console.error(`Error processing member page ${member_page._id}:`, error)
            }
        })

        // Process standard and home pages for additional emails
        const standard_promises = standard_pages.map(page => processPageForEmails(page._id, "Standard Page"))
        const home_promises = home_pages.map(page => processPageForEmails(page._id, "Home Page"))
        
        // Wait for all member and standard page fetches to complete in parallel
        await Promise.all([...member_promises, ...standard_promises, ...home_promises])


        // Convert Map to output
        if (member_map.size === 0) {
            output += `\n${display_name}\t${is_published}\t${tags}\t${domain_list}\tNO MEMBERS FOUND`
        } else {
            for (const member of member_map.values()) {
                const source_text = member.sources.map(s => `${s} (${member.sourceCounts[s] || 0})`).join(', ') || 'Unknown'
                const equivalent_emails_list = member.equivalentEmails.length > 0 ? member.equivalentEmails.join(', ') : ''
                output += `\n${display_name}\t${is_published}\t${tags}\t${domain_list}\t${source_text}\t${member.name}\t${member.title}\t${member.email}\t${equivalent_emails_list}`
            }
        }

    } catch (error) {
        console.error(`Error processing advisor ${advisor.display_name}:`, error)
        output += `\n${advisor.display_name}\tN/A\tN/A\tN/A\tN/A\tERROR: ${error.message}`
    }
}

console.log(`Tradename\tPublished\tTags\tDomains\tSource\tAdvisor\tTitle\tEmail\tEquivalent Emails${output}`)
