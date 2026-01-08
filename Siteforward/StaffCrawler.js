// ====================================
// Staff Crawler - Combined Script
// ====================================
// This script crawls advisor websites to extract staff information.
// It can output data in different formats using callback functions.

// Constants
const BASE_URL = 'https://app.twentyoverten.com'
const EXCLUSION_TAGS = ['SF - Not On Program', 'SF - Program Site']
const EMAIL_REGEX = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi
const IGNORED_EMAIL_PREFIXES = ['info@', 'contact@', 'support@', 'service@', 'general@', 'headoffice@']
const TEAM_PAGE_KEYWORDS = [
    'team', 'about', 'staff', 'people', 'meet', 'advisor', 'advisors', 'contact', 'contact-us',
    'équipe', 'notre équipe', 'à propos', 'personnel', 'rencontrez', 'conseillers', 'contactez-nous'
]
const HOME_PAGE_KEYWORDS = ['home', 'accueil', 'home-en', 'home-fr']
const DOMAIN_GROUPS = [
    ['manulifesecurities.ca', 'manulifewealth.ca', 'placementsmanuvie.ca', 'gestiondepatrimoinemanuvie.ca', 'manulife.ca']
]

// ====================================
// Helper Functions
// ====================================

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

function parseEmail(email) {
    if (!email) return { prefix: '', domain: '' }
    const [prefix = '', domain = ''] = email.split('@')
    return {
        prefix: prefix.toLowerCase(),
        domain: domain.toLowerCase()
    }
}

function areEmailsEquivalent(email1, email2) {
    if (!email1 || !email2) return false
    const parsed1 = parseEmail(email1)
    const parsed2 = parseEmail(email2)
    
    return parsed1.prefix === parsed2.prefix && areDomainsInSameGroup(parsed1.domain, parsed2.domain)
}

function isEmailIgnored(email) {
    if (!email) return true
    const email_lower = email.toLowerCase()
    return IGNORED_EMAIL_PREFIXES.some(prefix => email_lower.startsWith(prefix))
}

function extractEmails(text) {
    if (!text) return []
    const all_emails = [...new Set(text.match(EMAIL_REGEX) || [])]
    return all_emails.filter(email => !isEmailIgnored(email))
}

function normalizeName(name) {
    if (!name) return ""
    const normalized = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    return normalized.toLowerCase().replace(/[^a-z]/g, '')
}

function nameMatchesEmail(name, email) {
    if (!name || !email) return false
    const normalized_name = normalizeName(name)
    const email_prefix = parseEmail(email).prefix.toLowerCase().replace(/[^a-z]/g, '')
    return email_prefix.includes(normalized_name) || normalized_name.includes(email_prefix)
}

function cleanName(name) {
    if (!name) return ""
    if (name.includes(',')) name = name.split(',')[0] // Remove designations
    name = name.replace(/\[.*?\]/g, '').trim() // Remove text in square brackets
    name = name.replace(/1nl1/g, 'l').trim()
    return name
}

function cleanTitle(title) {
    if (!title) return ""
    return title.replace(/1nl1/g, 'l')
}

// ====================================
// Staff Member Class
// ====================================

class StaffMember {
    constructor(name = "", title = "", email = "") {
        this.name = cleanName(name)
        this.titles = new Set(title ? [cleanTitle(title)] : [])
        this.email = email
        this.equivalentEmails = new Set()
        this.sites = new Map() // Map of site_name -> Map of source -> count
        this.domains = new Set()
    }
    
    addSite(site_name, source, domains = []) {
        if (!this.sites.has(site_name)) {
            this.sites.set(site_name, new Map())
        }
        const sources = this.sites.get(site_name)
        sources.set(source, (sources.get(source) || 0) + 1)
        
        domains.forEach(domain => this.domains.add(domain))
    }
    
    merge(other, site_name, source, domains = []) {
        // Merge names (prefer non-empty)
        if (!this.name && other.name) {
            this.name = other.name
        }
        
        // Merge titles
        other.titles.forEach(title => this.titles.add(title))
        
        // Merge emails (prefer non-empty)
        if (!this.email && other.email) {
            this.email = other.email
        }
        
        // Track equivalent email if different
        if (other.email && this.email !== other.email) {
            this.equivalentEmails.add(other.email)
        }
        
        // Add site appearance
        this.addSite(site_name, source, domains)
    }
}

// ====================================
// Staff Tracker Class
// ====================================

class StaffTracker {
    constructor() {
        this.staff_map = new Map()
        this.email_map = new Map()
        this.name_map = new Map()
    }
    
    findByEmail(email) {
        if (!email) return null
        
        const email_lower = email.toLowerCase()
        if (this.email_map.has(email_lower)) {
            return this.email_map.get(email_lower)
        }
        
        // Check for equivalent emails
        for (const [existing_email, staff_member] of this.email_map.entries()) {
            if (areEmailsEquivalent(email, existing_email)) {
                return staff_member
            }
        }
        
        return null
    }
    
    findByName(name) {
        if (!name) return null
        
        const name_normalized = normalizeName(name)
        if (this.name_map.has(name_normalized)) {
            return this.name_map.get(name_normalized)
        }
        
        return null
    }
    
    findByNameEmailMatch(name, email) {
        // Check if name matches any existing email
        if (name) {
            for (const [existing_email, staff_member] of this.email_map.entries()) {
                if (nameMatchesEmail(name, existing_email)) {
                    return staff_member
                }
            }
        }
        
        // Check if email matches any existing name
        if (email) {
            for (const [existing_name, staff_member] of this.name_map.entries()) {
                if (nameMatchesEmail(staff_member.name, email)) {
                    return staff_member
                }
            }
        }
        
        return null
    }
    
    addOrUpdate(name, title, email, site_name, source, domains = []) {
        const new_staff = new StaffMember(name, title, email)
        let existing_staff = null
        
        // Try to find by email first
        if (email) {
            existing_staff = this.findByEmail(email)
            
            if (!existing_staff) {
                existing_staff = this.findByNameEmailMatch(name, email)
            }
        }
        
        // If not found by email, try by name
        if (!existing_staff && name) {
            existing_staff = this.findByName(name)
            
            if (!existing_staff) {
                existing_staff = this.findByNameEmailMatch(name, email)
            }
        }
        
        if (existing_staff) {
            // Merge with existing staff member
            existing_staff.merge(new_staff, site_name, source, domains)
            
            // Update maps if new identifiers added
            if (email && !existing_staff.email) {
                existing_staff.email = email
                this.email_map.set(email.toLowerCase(), existing_staff)
            }
            if (name && !existing_staff.name) {
                existing_staff.name = name
                this.name_map.set(normalizeName(name), existing_staff)
            }
            
            // If we matched by name-email but staff was tracked differently, update maps
            if (email && existing_staff.email && email.toLowerCase() !== existing_staff.email.toLowerCase()) {
                if (!this.email_map.has(email.toLowerCase())) {
                    this.email_map.set(email.toLowerCase(), existing_staff)
                }
            }
        } else {
            // Create new staff member
            new_staff.addSite(site_name, source, domains)
            
            // Generate unique key for global map
            const key = email || name || `unknown_${this.staff_map.size}`
            this.staff_map.set(key, new_staff)
            
            // Add to lookup maps
            if (email) {
                this.email_map.set(email.toLowerCase(), new_staff)
            }
            if (name) {
                this.name_map.set(normalizeName(name), new_staff)
            }
        }
    }
    
    getAllStaff() {
        return Array.from(this.staff_map.values())
    }
}

// ====================================
// Site Crawler
// ====================================

async function crawlSites(advisors_list, options = {}) {
    const {
        include_unpublished = false,
        on_site_start = null,
        on_site_complete = null,
        on_error = null
    } = options
    
    const site_data = []
    let count = 0
    
    for (const advisor of advisors_list) {
        count++
        
        // Check if the website is not taken down and not on the exclusion list
        if (
            advisor.site.status === "taken_down" ||
            advisor.settings.broker_tags.some((tag) => EXCLUSION_TAGS.includes(tag.name)) ||
            (!include_unpublished && advisor.published_date === "NA")
        ) {
            console.log(`${count}. Skipping ${advisor.display_name}`)
            continue
        }
        
        console.log(`${count}. Checking ${advisor.display_name}`)
        
        if (on_site_start) {
            on_site_start(advisor, count)
        }
        
        const site_name = advisor.display_name || "N/A"
        const tags = advisor.settings.broker_tags.map(tag => tag.name).join(', ') || "N/A"
        
        const id = advisor._id
        
        try {
            const login_response = await fetch(`${BASE_URL}/manage/login/${id}`)
            await login_response.text()
            
            await new Promise(resolve => setTimeout(resolve, 100))
            
            // Fetch site settings and pages in parallel
            const [site_settings, pages_response] = await Promise.all([
                fetch(`${BASE_URL}/api/sites/`),
                fetch(`${BASE_URL}/api/pages`)
            ])
            
            const [site_settings_data, pages] = await Promise.all([
                site_settings.json(),
                pages_response.json()
            ])
            
            const domains = site_settings_data.settings.domains || []
            const domain_list = domains.length > 0 ? domains.join(', ') : "N/A"
            
            // Filter for active pages
            const member_pages = pages.pages.filter((page) => page.type === "members" && page.state === "active")
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
            
            // Store site metadata
            const site_info = {
                name: site_name,
                tags,
                domains,
                domain_list,
                staff: []
            }
            
            // Helper function to process page and extract emails
            async function processPageForEmails(page_id, source_label) {
                try {
                    const page_response = await fetch(`${BASE_URL}/api/pages/${page_id}`)
                    const page = await page_response.json()
                    
                    const page_emails = extractEmails(page.content)
                    for (const email of page_emails) {
                        site_info.staff.push({ name: "", title: "", email, source: source_label })
                    }
                } catch (error) {
                    console.error(`Error processing page ${page_id}:`, error)
                }
            }
            
            // Fetch members and page for each member page
            const member_promises = member_pages.map(async (member_page) => {
                try {
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
                            // Add member with first email
                            site_info.staff.push({ name: member.name, title: member.title, email: emails[0], source: "Member Page" })
                            
                            // Add additional emails
                            for (let i = 1; i < emails.length; i++) {
                                site_info.staff.push({ name: "", title: "", email: emails[i], source: "Member Page" })
                            }
                        } else if (member.name) {
                            // Add member without email
                            site_info.staff.push({ name: member.name, title: member.title, email: "", source: "Member Page" })
                        }
                    }
                    
                    // Extract emails from page content
                    const page_emails = extractEmails(page.content)
                    for (const email of page_emails) {
                        site_info.staff.push({ name: "", title: "", email, source: "Member Page" })
                    }
                } catch (error) {
                    console.error(`Error processing member page ${member_page._id}:`, error)
                }
            })
            
            // Process standard and home pages
            const standard_promises = standard_pages.map(page => processPageForEmails(page._id, "Standard Page"))
            const home_promises = home_pages.map(page => processPageForEmails(page._id, "Home Page"))
            
            await Promise.all([...member_promises, ...standard_promises, ...home_promises])
            
            site_data.push(site_info)
            
            if (on_site_complete) {
                on_site_complete(site_info, count)
            }
            
        } catch (error) {
            console.error(`Error processing advisor ${advisor.display_name}:`, error)
            if (on_error) {
                on_error(advisor, error, count)
            }
        }
    }
    
    return {
        site_data,
        total_sites: count
    }
}

// ====================================
// Data Aggregation
// ====================================

// Build StaffTracker from raw site data
function buildStaffTracker(site_data) {
    const tracker = new StaffTracker()
    
    for (const site of site_data) {
        for (const staff of site.staff) {
            tracker.addOrUpdate(
                staff.name,
                staff.title,
                staff.email,
                site.name,
                staff.source,
                site.domains
            )
        }
    }
    
    return tracker
}

// ====================================
// Output Formatters
// ====================================

// Format 1: List all sites and who's on them (like AdvisorsOnProgram.js)
function formatBySite(site_data) {
    let output = "Tradename\tTags\tDomains\tSource\tStaff Name\tTitle\tEmail\tEquivalent Emails"
    
    for (const site of site_data) {
        if (site.staff.length === 0) {
            output += `\n${site.name}\t${site.tags}\t${site.domain_list}\tNO MEMBERS FOUND`
        } else {
            for (const member of site.staff) {
                output += `\n${site.name}\t${site.tags}\t${site.domain_list}\t${member.source}\t${member.name}\t${member.title}\t${member.email}\t`
            }
        }
    }
    
    return output
}

// Format 2: List all staff and what sites they're on (like StaffAcrossSites.js)
function formatByStaff(site_data) {
    const tracker = buildStaffTracker(site_data)
    let output = "Staff Name\tEmail\tTitle(s)\t# of Sites\tSites\tDomains\tEquivalent Emails"
    
    for (const staff_member of tracker.getAllStaff()) {
        const name = staff_member.name || ""
        const email = staff_member.email || ""
        const titles = Array.from(staff_member.titles).join('; ') || ""
        const site_count = staff_member.sites.size
        const sites = Array.from(staff_member.sites.keys()).join(', ')
        const equivalent_emails = Array.from(staff_member.equivalentEmails).join(', ')
        const domain_list = Array.from(staff_member.domains).join(', ')
        
        output += `\n${name}\t${email}\t${titles}\t${site_count}\t${sites}\t${domain_list}\t${equivalent_emails}`
    }
    
    return output
}

// ====================================
// Main Execution
// ====================================

// Get advisors list from Providence changer extension
let advisors_list = advisor_list

// Filter for testing (uncomment as needed)
//advisors_list = advisor_list.slice(-25)
//advisors_list = advisors_list.filter(a => a.display_name === "François Giguere")

// Choose output format:
// 'by-site' - List all sites and who's on them
// 'by-staff' - List all staff and what sites they're on
const OUTPUT_FORMAT = 'by-staff' // Change to 'by-staff' or 'by-site' for the other formats

// Crawl all sites
const { site_data } = await crawlSites(advisors_list, {
    include_unpublished: false
})

// Format and output results based on selected format
let output = ""
if (OUTPUT_FORMAT === 'by-site') {
    output = formatBySite(site_data)
} else if (OUTPUT_FORMAT === 'by-staff') {
    output = formatByStaff(site_data)
}

console.log(output)
