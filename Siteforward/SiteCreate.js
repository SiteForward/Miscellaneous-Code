// Configuration object
const CONFIG = {
    SINGLE_PAGE: {
        SITE_ID: "642338e703a127cc457d7b6b",
        LAYOUT: {
            ENGLISH: [
                { type: "home_alt", name: "Home", id: '6423394f03a127cc457d7c4f' },
                { type: "redirect", name: "Meet the Team", url: "#team" },
                { type: "redirect", name: "Services & Solutions", url: "#services" },
                { type: "redirect", name: "Contact", url: "#contact" },
                { type: "redirect", name: "Client Login", style: "button", url: "https://manulifewealth.ca/clients/en/sign-in" }
            ],
            FRENCH: [
                { type: "home_alt", name: "Accueil", id: '64f0c97c6ffaf8c435fd70c2' },
                { type: "redirect", name: "Notre équipe", url: "#team" },
                { type: "redirect", name: "Services et solutions", url: "#services" },
                { type: "redirect", name: "Contact", url: "#contact" },
                { type: "redirect", name: "Session client", style: "button", url: "https://manulifewealth.ca/clients/fr/sign-in" }
            ]
        }
    },
    MULTI_PAGE: {
        SITE_ID: '5b71917a1cbe736dff66dc27',
        LAYOUT: {
            ENGLISH: [
                { type: "home_alt", name: "Home", id: "5b719261138837295d1d7edf" },
                {
                    type: "standard", name: "About Us", id: "68b8492688f8e60cc8788e8d",
                    children: [
                        { type: "members", name: "Your Team", id: "68b8492688f8e60cc8788e8e" },
                        { type: "standard", name: "Our Process", id: "68b8492688f8e60cc8788e8f" },
                        { type: "standard", name: "Testimonials", id: "68b8492688f8e60cc8788e90" },
                        { type: "standard", name: "Referrals", id: "68b8492788f8e60cc8788e92" }
                    ]
                },
                { type: "standard", name: "Services & Solutions", id: "68b8492788f8e60cc8788e93" },
                { type: "blog", name: "Insights & Articles", id: "68b84cec08b3f0b889c91b37", external_feed: "https://SiteForward.ca/rss-feed/feed.xml" },
                {
                    type: "standard", name: "Client Resources", id: "68b8492788f8e60cc8788e95",
                    children: [
                        { type: "standard", name: "Client Centre", id: "68b8492788f8e60cc8788e97" },
                        { type: "standard", name: "Knowledge Centre", id: "68b8492888f8e60cc8788e98" }
                    ]
                },
                { type: "standard", name: "Contact", id: "68b8492888f8e60cc8788e99" },
                { type: "redirect", name: "Client Login", style: "button", url: "https://manulifewealth.ca/clients/en/sign-in" }
            ],
            FRENCH: [
                { type: "home_alt", name: "Accueil", id: "68b8492988f8e60cc8788ea5" },
                {
                    type: "standard", name: "À Propos", id: "68b8492988f8e60cc8788ea6",
                    children: [
                        { type: "members", name: "Notre équipe", id: "68b8492988f8e60cc8788ea7" },
                        { type: "standard", name: "Nous Processus", id: "68b8492a88f8e60cc8788ea9" },
                        { type: "standard", name: "Témoignages", id: "68b8492a88f8e60cc8788eab" },
                        { type: "standard", name: "Recommandations", id: "68b8492a88f8e60cc8788eac" }
                    ]
                },
                { type: "standard", name: "Services", id: "68b8492a88f8e60cc8788ead" },
                { type: "blog", name: "Articles", id: "68b8566aaec1059ba9e98b15", external_feed: "https://SiteForward.ca/rss-french-feed/feed.xml" },
                {
                    type: "standard", name: "Ressources", id: "68b8492b88f8e60cc8788eaf",
                    children: [
                        { type: "standard", name: "Centre client", id: "68b8492b88f8e60cc8788eb0" },
                        { type: "standard", name: "Centre d'information", id: "68b8492b88f8e60cc8788eb1" }
                    ]
                },
                { type: "standard", name: "Contact", id: "68b8492b88f8e60cc8788eb3" },
                { type: "redirect", name: "Accès du client", style: "button", url: "https://manulifewealth.ca/clients/fr/sign-in" }
            ]
        }
    },
    ONBOARDING: {
        SITE_ID: '69137fa3503e5dbdab03b1e5',
        LAYOUT: {
            ENGLISH: [
                { type: "home", name: "Home", id: '69137fc0503e5dbdab03b200' },
                { type: "members", name: "Your Team", id: '69137fef53b64096afc80cc8' },
                { type: "blog", name: "Insights & Articles", id: '69137ff153b64096afc80cce' },
                { type: "standard", name: "Client Centre", id: '69137ff253b64096afc80cd2' },
                { type: "standard", name: "Contact", id: '69137ff353b64096afc80cd4' },
                { type: "redirect", name: "Client Login", id: '69137ff353b64096afc80cd5', url: "https://manulifewealth.ca/clients/en/sign-in" },
            ],
            FRENCH: [
                { type: "home_alt", name: "Accueil", id: '69137ff653b64096afc80ce0' },
                { type: "members", name: "Notre équipe", id: '69137ff753b64096afc80ce3' },
                { type: "blog", name: "Articles", id: '69137ff853b64096afc80cea' },
                { type: "standard", name: "Centre client", id: '69137ff953b64096afc80ced' },
                { type: "standard", name: "Contact", id: '69137ffa53b64096afc80cf0' },    
                { type: "redirect", name: "Accès du client", style: "button", url: "https://manulifewealth.ca/clients/fr/sign-in" }
            
            ]
        }
    },
    API_BASE: 'https://app.twentyoverten.com'
}
/* ------------------------------------------------------ */

/**
 * Helper function to create URL-friendly slugs from page names
 * @param {string} name - The page name to convert to a slug
 * @returns {string} - URL-friendly slug
 */
function parseSlug(name) {
    return name
        .toLowerCase()
        .replace(/&/g, 'and')  // Replace & with 'and'
        .replace(/\s+/g, '-')  // Replace spaces with hyphens
        .replace(/[^a-z0-9-]/g, '') // Remove any other special characters
        .replace(/-+/g, '-')   // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

/**
 * Helper function to generate unique slug, adding language suffix only if there's a conflict
 * @param {string} name - The page name to convert to a slug
 * @param {Set} usedSlugs - Set of already used slugs
 * @param {string} languageSuffix - Language suffix to add if there's a conflict
 * @returns {string} - Unique URL-friendly slug
 */
function generateUniqueSlug(name, usedSlugs, languageSuffix = '') {
    const baseSlug = parseSlug(name)
    
    // If no conflict, use the base slug
    if (!usedSlugs.has(baseSlug)) {
        return baseSlug
    }
    
    // If there's a conflict and we have a language suffix, use it
    if (languageSuffix) {
        const slugWithSuffix = `${baseSlug}-${languageSuffix}`
        return slugWithSuffix
    }
    
    // Fallback (shouldn't happen in our use case)
    return baseSlug
}


/**
 * Fetch site data by site ID
 * @param {string} site_id - The ID of the site to fetch data for
 * @returns {Promise<Object>} - The site data
 */
async function getSiteData(site_id) {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/manage/advisor/notes/${site_id}`)
        
        if (!response.ok) {
            throw new Error(`Failed to fetch site data: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        
        if (!data?.site) {
            throw new Error('Invalid site data structure received')
        }
        
        const { site } = data
        const { settings, content, favicons, styles, code } = site

        return {
            title: settings.title,
            text_logo: settings.text_logo,
            header: settings.header,
            footer: content.footer,
            favicons,
            styles,
            custom_css: code.css,
            header_inject: code.header,
            footer_inject: code.footer,
        }
    } catch (error) {
        console.error('Error fetching site data:', error)
        throw error
    }
}


/**
 * Setup the site with the given configuration
 * @param {string} template - The template type ('SINGLE_PAGE', 'MULTI_PAGE', 'ONBOARDING')
 * @param {string} default_language - The default language for the site
 * @param {boolean} is_bilingual - Whether the site is bilingual
 * @param {boolean} remove_other_pages - Whether to remove existing pages before creating new ones
 * @param {boolean} refresh_after - Whether to refresh the page after completion
 */
async function setupItems(template, default_language, is_bilingual, add_pages = true,remove_other_pages = true, refresh_after = true) {
    let item_structure = {main: [], other: []}
    let usedSlugs = new Set() // Track slugs to detect conflicts
    usedSlugs.add("home") // Home is always present
    logMessage(`🚀 Starting item setup...`, 'info')
    
        const home_page_id = document.querySelector(".dd-item.home").getAttribute("data-id")
        logMessage(`🏠 Found home page ID: ${home_page_id}`, 'info')
        
        // If default language is French, rename the home page to "Accueil"
        if (default_language === 'fr') {
            logMessage(`🇫🇷 Renaming home page to "Accueil" for French site...`, 'progress')
            await renameItem(home_page_id, 'Accueil')
            logMessage(`✅ Home page renamed to "Accueil"`, 'success')
        }
            
        /*
        - Process either the layout of the single page or multi-page as passed
            - If website is bilingual
                - If website is <Language>
                    - Update the existing home page hero_content and content based off the layout
                    - Create items based off the layout; use hero_content, content, background of each item from the page data grabbed through the use of the id; children are needed here;
                    - Create a Navigation page for other language; hidden = true
                    - Add the items that would exist but only create them as links; hidden = true; no children are needed here
                    - Add the items from the layout; use hero_content, content, background of each item from the page data grabbed through the use of the id; hidden = true; children are needed here;
            - If website is not bilingual
                - Update the existing home page hero_content and content based off the layout
                - Create items based off the layout; use hero_content, content, background of each item from the page data grabbed through the use of the id; children are needed here;
        */
        
        // Get the appropriate layout based on template type
        const templateConfig = CONFIG[template]
        if (!templateConfig) {
            throw new Error(`Invalid template: ${template}. Must be SINGLE_PAGE, MULTI_PAGE, or ONBOARDING`)
        }
        const layout = default_language === 'en' ? templateConfig.LAYOUT.ENGLISH : templateConfig.LAYOUT.FRENCH
        
        logMessage(`📖 Selected layout: ${template} ${default_language.toUpperCase()}`, 'info')
               
        // Create items based on the default language layout (skip home page)
        logMessage(`📄 Creating ${default_language.toUpperCase()} items...`, 'progress')
        const layoutItems = layout.slice(1)
        let createdPages = 0
        let createdLinks = 0
        let mainLanguagePageIds = [] // Store main language page IDs for later bilingual updates
        
        // Initialize bilingualData - will be empty if not bilingual, populated later if bilingual
        let bilingualData = {}
        
        for (const item of layoutItems) {
            if (item.type === "redirect") {
                // Create redirect items
                const isExternal = item.url.startsWith('http')
                await createLink(item.name, item.url, true, isExternal, item.style ?? "normal", item_structure)
                createdLinks++
            } else {
                // Create pages with content from page data
                let parent_id = null
                const pageSlug = parseSlug(item.name)
                usedSlugs.add(pageSlug) // Track this slug
                
                if (item.id) {
                    const pageData = await getItemData(item.id)
                    parent_id = await createPage(item.type, item.name, pageSlug, item.name, true, item, item_structure)
                } else {
                    parent_id = await createPage(item.type, item.name, pageSlug, item.name, true, item, item_structure)
                }
                
                if (parent_id) {
                    mainLanguagePageIds.push(parent_id)
                }
                createdPages++
                
                // Create child pages if they exist
                if (item.children) {
                    logMessage(`  ↳ Creating ${item.children.length} child pages for ${item.name}...`, 'progress')
                    for (const child of item.children) {
                        let child_id = null
                        const childSlug = parseSlug(child.name)
                        usedSlugs.add(childSlug) // Track child slug
                        
                        if (child.id) {
                            // const childPageData = await getItemData(child.id)
                            child_id = await createPage(child.type, child.name, childSlug, child.name, false, {
                                ...child.data,
                                ...bilingualData
                            }, item_structure, parent_id)
                        } else {
                            child_id = await createPage(child.type, child.name, childSlug, child.name, false, {
                                ...child.data,
                                ...bilingualData
                            }, item_structure, parent_id)
                        }
                        
                        if (child_id) {
                            mainLanguagePageIds.push(child_id)
                        }
                        createdPages++
                    }
                }
            }
        }
        
        logMessage(`✅ Created ${createdPages} pages and ${createdLinks} links for ${default_language.toUpperCase()} layout`, 'success')
        
        // Check if bilingual setup is needed after creating the first language pages
        if (is_bilingual) {
            logMessage(`🌐 Setting up bilingual site - adding ${default_language === 'en' ? 'French' : 'English'} navigation...`, 'progress')
            
            // Create navigation for the other language
            const otherLanguage = default_language === 'en' ? 'French' : 'English'
            logMessage(`🗂️ Creating ${otherLanguage} navigation structure...`, 'progress')
            
            const otherLanguageLayout = default_language === 'en' 
                ? templateConfig.LAYOUT.FRENCH
                : templateConfig.LAYOUT.ENGLISH
            
            const navName = default_language === 'en' ? "Navigation Française" : "English Navigation"
            const navSlug = default_language === 'en' ? "nav-francaise" : "english-navigation"
            const navTitle = default_language === 'en' ? "Navigation Française" : "English Navigation"
            
            // Set language variables for second language
            const secondLanguage = default_language === 'en' ? 'fr' : 'en'
            const alternativeLogoLink = secondLanguage === 'en' ? '/home-en' : '/accueil'
            
            // Create navigation page for other language (hidden = true)
            logMessage(`📁 Creating navigation parent: ${navName} (hidden = true)`, 'progress')
            
            try {
                // Step 1: Create a Navigation page for other language; hidden = true
                const nav = await createItem("standard", false, item_structure) // hidden = true (in_main_nav = false)
                if (nav.ok) {
                    const nav_data = nav.data
                    const nav_id = nav_data._id
                    await updateItem(nav_id, {
                        name: navName,
                        page_slug: parseSlug(navSlug),
                        title: navTitle
                    })
                    
                    let createdLinks = 0
                    let createdPages = 0
                    const layoutItems = otherLanguageLayout // Don't skip the home page - include all items
                    
                    // Step 2: Add the items that would exist but only create them as links; hidden = true; no children are needed here
                    logMessage(`  🔗 Creating navigation links (hidden = true, no children)...`, 'progress')
                    for (const item of layoutItems) {
                        if (item.type === "redirect") {
                            // Create redirect links (external or internal)
                            const isExternal = item.url.startsWith('http')
                            await createLink(item.name, item.url, false, isExternal, item.style ?? "normal", item_structure, nav_id) // hidden = true (in_main_nav = false)
                        } else {
                            // Create navigation links pointing to pages (with language suffix only if there's a conflict)
                            const pageSlug = generateUniqueSlug(item.name, usedSlugs, secondLanguage)
                            await createLink(item.name, `/${pageSlug}`, false, false, item.style ?? "normal", item_structure, nav_id) // hidden = true (in_main_nav = false)
                        }
                        createdLinks++
                    }
                    
                    // Step 3: Add the items from the layout; use hero_content, content, background; hidden = true; children are needed here
                    logMessage(`  📄 Creating actual pages with content (hidden = true, children included)...`, 'progress')
                    
                    for (const item of layoutItems) {
                        if (item.type !== "redirect") {
                            // Create the actual page with content (hidden from main nav, but not as child of navigation)
                            let parent_id = null
                            
                            // Generate unique slug, adding language suffix only if there's a conflict
                            const pageSlug = generateUniqueSlug(item.name, usedSlugs, secondLanguage)
                            usedSlugs.add(pageSlug) // Track this slug
                            
                            // Add bilingual navigation data pointing to appropriate home page
                            const bilingualData = {
                                alternate_nav: nav_id,
                                alternate_logo_link: alternativeLogoLink
                            }
                            
                            if (item.id) {
                                parent_id = await createPage(item.type, item.name, pageSlug, item.name, false, {
                                    ...item,
                                    ...bilingualData
                                }, item_structure) // Remove nav_id parent - create as standalone hidden page
                            } else {
                                parent_id = await createPage(item.type, item.name, pageSlug, item.name, false, {
                                    ...item,
                                    ...bilingualData
                                }, item_structure) // Remove nav_id parent
                            }
                            createdPages++
                            
                            // Create child pages if they exist (children are needed here)
                            if (item.children) {
                                logMessage(`    ↳ Creating ${item.children.length} child pages for ${item.name} (hidden = true)...`, 'progress')
                                for (const child of item.children) {
                                    
                                    // Generate unique slug for child, adding language suffix only if there's a conflict
                                    const childSlug = generateUniqueSlug(child.name, usedSlugs, secondLanguage)
                                    usedSlugs.add(childSlug) // Track child slug
                                    
                                    if (child.id) {
                                        // const childPageData = await getItemData(child.id)
                                        await createPage(child.type, child.name, childSlug, child.name, false, {
                                            ...child.data,
                                            ...bilingualData
                                        }, item_structure, parent_id)
                                    } else {
                                        await createPage(child.type, child.name, childSlug, child.name, false, {
                                            ...child.data,
                                            ...bilingualData
                                        }, item_structure, parent_id)
                                    }
                                    createdPages++
                                }
                            }
                        }
                    }
                    
                    logMessage(`  ✅ Created ${createdLinks} navigation links and ${createdPages} pages under ${navName}`, 'success')
                } else {
                    throw new Error(`Failed to create navigation parent: ${navName}`)
                }
            } catch (error) {
                logMessage(`❌ Error creating navigation ${navName}: ${error.message}`, 'error')
                throw error
            }
            
            logMessage(`✅ ${otherLanguage} navigation structure created successfully`, 'success')
            
        } else {
            logMessage(`🌍 Single-language site setup complete - no additional language navigation needed`, 'info')
        }

    logMessage(`🔄 Updating page structure...`, 'progress')
    await updatePageStructure(item_structure)
    logMessage(`✅ Page structure updated successfully`, 'success')
}

/** 
 * Update the site settings 
 * @param {Object} new_data - The new site settings data
 */
async function updateSiteSettings(new_data) {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/api/sites`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(new_data)
        })
        
        if (response.ok) {
            // Remove individual success message - handled by higher level logging
        } else {
            throw new Error(`Failed to update site settings: ${response.status} ${response.statusText}`)
        }
    } catch (error) {
        console.error("Failed to update site settings:", error)
        throw error
    }
}

/** 
 * Gets the items of the logged in user 
 */
async function getItems() {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/api/pages`)
        
        if (!response.ok) {
            throw new Error(`Failed to fetch items: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        return data.pages || []
    } catch (error) {
        console.error("Failed to get items:", error)
        return []
    }
}

/** 
 * Remove all pages except Home 
 */
async function removeAllButHome(pages) {
    logMessage("🗑️ Cleaning up existing pages (keeping only Home page)...", 'progress')
    // Iterate through pages, and remove ones that don't say Home
    const deletePromises = []
    let deletedCount = 0
    
    for (const e of pages) {
        if (e.name != "Home" ) {
            logMessage(`   Deleting page: "${e.name}"`, 'info')
            deletePromises.push(deleteItem(e._id))
            deletedCount++
        }
    }
    
    await Promise.all(deletePromises)
    logMessage(`✅ Cleaned up ${deletedCount} pages (kept Home page)`, 'success')
}

/** 
 * Delete a page by ID 
 * @param {string} item_id - The ID of the item to delete
 */
async function deleteItem(item_id) {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/api/pages/${item_id}`, {
            method: 'DELETE'
        })
        
        if (response.ok) {
            console.info(`Successfully deleted ${item_id}`)
        } else {
            throw new Error(`Failed to delete item: ${response.status} ${response.statusText}`)
        }
    } catch (error) {
        console.error(`Failed to delete ${item_id}:`, error)
    }
}

/** 
 * Gets the data for a single item
 * @param {string} item_id - The ID of the item to retrieve
 */
async function getItemData(item_id) {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/api/pages/${item_id}`)

        if (!response.ok) {
            throw new Error(`Failed to fetch item data: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        return data
    } catch (error) {
        console.error(`Failed to get page data for ${id}:`, error)
        throw error
    }
}

/**
 * Creates a new item
 * @param {string} type - The type of the item to create ['standard', 'redirect', 'members', 'blog']
 * @param {boolean} in_main_nav - Whether the item should be in the main navigation
 * @param {Object} item_structure - Object to track page IDs by category
 */
async function createItem(type, in_main_nav, item_structure = null) {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/api/pages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type, hidden: !in_main_nav })
        })
        
        if (!response.ok) {
            throw new Error(`Failed to create item: ${response.status} ${response.statusText}`)
        }
        
        // Track the created item ID in item_structure if provided
        if (item_structure && response.ok) {
            const data = await response.json()
            const pageId = data._id
            
            if (in_main_nav) {
                // Add to main navigation items
                item_structure.main.push({ id: pageId })
            } else {
                // Add to other (hidden) items
                item_structure.other.push({ id: pageId })
            }
            
            // Return the data instead of the response since we've already read it
            return { ok: true, data }
        }
        
        // If no item_structure tracking, return the response as before
        if (response.ok) {
            const data = await response.json()
            return { ok: true, data }
        } else {
            return { ok: false }
        }
    } catch (error) {
        console.error(`Failed to create item:`, error)
        throw error
    }
}

/**
 * Renames an existing page/item by ID
 * @param {string} item_id - The ID of the item to rename
 * @param {string} new_name - The new name for the item
 * @returns {Promise<Object>} - The update response object
 */
async function renameItem(item_id, new_name) {
    var update = await updateItem(item_id, { name: new_name })
    if (update.ok) {
        console.info(`Renamed item ${item_id} to ${new_name}`)
    }
    return update
}

/** 
 * Updates a page by ID with new data 
 * @param {string} item_id - The ID of the item to update
 * @param {Object} data - The new data to update the item with
 */
async function updateItem(item_id, data) {
    try {
        const response = await fetch(`${CONFIG.API_BASE}/api/pages/${item_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
        
        if (!response.ok) {
            throw new Error(`Failed to update item: ${response.status} ${response.statusText}`)
        }
        
        return response
    } catch (error) {
        console.error(`Failed to update item ${item_id}:`, error)
        throw error
    }
}

/**
 * Creates a new link 
 * @param {string} name - The name of the link
 * @param {string} url - The URL of the link
 * @param {boolean} in_main_nav - Whether the link should be in the main navigation
 * @param {boolean} target - Whether the link should open in a new tab
 * @param {string} style - The style of the link
 * @param {Object} item_structure - Object to track page IDs by category
 * @param {string} parent_id - ID of parent page (for tracking children relationships)
 * @returns {Promise<Object>} - The created link data
 */
async function createLink(name, url, in_main_nav = true, target = false, style = "normal", item_structure = null, parent_id = null) {
    try {
        const link_result = await createItem("redirect", in_main_nav, item_structure)

        if (link_result.ok) {
            const link_json = link_result.data
            const link_id = link_json._id

            const link_update = await updateItem(link_id, {
                link_title: name,
                link_url: url,
                link_target: target,
                link_style: style,
            })

            if (link_update.ok) {
                // If this is a child link and we have item_structure tracking
                if (parent_id && item_structure) {
                    // Find the parent in the item_structure and add this child
                    const updateParentWithChild = (items) => {
                        for (let item of items) {
                            if (item.id === parent_id) {
                                if (!item.children) {
                                    item.children = []
                                }
                                item.children.push({ id: link_id })
                                return true
                            }
                            if (item.children && updateParentWithChild(item.children)) {
                                return true
                            }
                        }
                        return false
                    }
                    
                    // Try to find parent in main items, then other items
                    if (!updateParentWithChild(item_structure.main)) {
                        updateParentWithChild(item_structure.other)
                    }
                }
                
                // Remove individual success message - handled by higher level logging
                return link_update
            } else {
                console.error('Failed to update link:', name)
            }
        } else {
            console.error('Failed to create link:', name)
        }
    } catch (error) {
        console.error(`Failed to create link ${name}:`, error)
        throw error
    }
}

/**
 * Creates a new page
 * @param {string} type - The type of the page to create ['standard', 'members', 'blog']
 * @param {string} name - The name of the page
 * @param {string} slug - The slug of the page
 * @param {string} title - The title of the page
 * @param {boolean} in_main_nav - Whether the page should be in the main navigation
 * @param {Object} data - Additional data for the page
 * @param {Object} item_structure - Object to track page IDs by category
 * @param {string} parent_id - ID of parent page (for tracking children relationships)
 * @returns {Promise<string>} - The created page ID
 */
async function createPage(type, name, slug, title, in_main_nav = true, data = {}, item_structure = null, parent_id = null) {
    // Create a copy of the data object to avoid mutating the original
    const dataCopy = { ...data }
    dataCopy.id = null
    dataCopy.type = null
    dataCopy.name = null
        
    try {
        const page_result = await createItem(type, in_main_nav, item_structure)
        if (page_result.ok) {
            const page_json = page_result.data
            const page_id = page_json._id
            // If the page type is `home_alt` we want no hero height
            const heroHeight = type === 'home_alt' ? 0 : 65
            const page_data = {
                ...dataCopy,
                name,
                page_slug: parseSlug(slug),
                title,
                hero_height: heroHeight,
                ...(type === "blog" && {
                    posts_per_page: 6,
                    show_featured: 'yes',
                    sort_direction: 'desc',
                    show_date: 'yes',
                    pagination_type: 'traditional',
                    show_search: 'no',
                    share_facebook: true,
                    share_twitter: true,
                    share_linkedin: true,
                    show_rss_feed: data.external_feed ? 'yes' : 'no',
                    ...(data.external_feed && { external_feed: data.external_feed }), // Include external_feed if provided
                })
            }

            const page_update = await updateItem(page_id, page_data)
            
            if (page_update.ok) {
                // Remove individual success message - handled by higher level logging
                
                // If this is a child page and we have item_structure tracking
                if (parent_id && item_structure) {
                    // Find the parent in the item_structure and add this child
                    const updateParentWithChild = (items) => {
                        for (let item of items) {
                            if (item.id === parent_id) {
                                if (!item.children) {
                                    item.children = []
                                }
                                item.children.push({ id: page_id })
                                return true
                            }
                            if (item.children && updateParentWithChild(item.children)) {
                                return true
                            }
                        }
                        return false
                    }
                    
                    // Try to find parent in main items, then other items
                    if (!updateParentWithChild(item_structure.main)) {
                        updateParentWithChild(item_structure.other)
                    }
                }
                
                return page_id
            } else {
                console.error('Failed to update page:', name)
            }
        } else {
            console.error('Failed to create page:', name)
        }
    } catch (error) {
        console.error(`Failed to create page ${name}:`, error)
        throw error
    }
}

async function updatePageStructure(pages){
    try {
        const response = await fetch(`${CONFIG.API_BASE}/api/pages/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type:'', pages: JSON.stringify(pages) })
        })

        if (!response.ok) {
            throw new Error(`Failed to update page order: ${response.status} ${response.statusText}`)
        }

        return response
    } catch (error) {
        console.error(`Failed to update page order:`, error)
        throw error
    }
}
async function assistWithBuild(template) {

    logMessage(`🛠️ Assist with build mode activated - click on a page in the list to log its data`, 'info')

    document.querySelector(".pages-wrapper").addEventListener("click", async (e)=>{
        // Find the closest .dd-item element (handles clicks on child nodes)
        const ddItem = e.target.closest(".dd-item")
        
        if(ddItem){
            const current_page_name = ddItem.querySelector(".page-title").textContent
            
            // Detect language context by examining other page titles in the same section
            const detected_language = detectLanguageContext(ddItem)
            console.log(`Detected language context: ${detected_language || 'Unknown'} for page "${current_page_name}"`);
            
            // Go through config's layout and find a page that matches the name. Also check children
            const target_page_id = findPageIdByName(
                CONFIG[template], 
                current_page_name, 
                detected_language
            )
            if (!target_page_id) {
                console.error(`Failed to find page ${current_page_name} in the configuration for ${template} template`)
                return
            }
            const target_page_data = await getItemData(target_page_id)
            if (!target_page_data) {
                console.error(`Failed to retrieve data for page ${current_page_name} - ID ${target_page_id}`)
                return
            }
            console.clear()
            console.log(target_page_data)

            console.log(
                `Assisting with build for page ${current_page_name} - ID ${target_page_id}:\n\n`, 
                target_page_data?.content,
                '\n\n--------------------\n\n', 
                target_page_data?.hero_content,
            )
        }
    })
}

// Function to detect language context by checking the first page title in the navigation
function detectLanguageContext(ddItem) {
    const wrapper = ddItem.closest('.pages-wrapper')
    const firstPageTitle = wrapper.querySelector('.dd-item .page-title')
    var is_french = firstPageTitle?.textContent.includes('Accueil') || firstPageTitle?.textContent.includes('Navigation Française')
    if(!is_french) // If not french, check this as a just in case
        is_french = ddItem.querySelector("button").getAttribute("data-url")?.includes("-fr")
    return is_french ? 'FRENCH' : 'ENGLISH'
}

// Recursive function to find a page ID by name. Go through the whole config
function findPageIdByName(tree, name, preferredLanguage = null) {
    // Check if tree and tree.LAYOUT exist
    if (!tree || !tree.LAYOUT) {
        console.warn('findPageIdByName: tree or tree.LAYOUT is undefined', tree);
        return null;
    }
    
    // If we have a preferred language, search that first
    if (preferredLanguage && tree.LAYOUT[preferredLanguage]) {
        console.log(`Searching for "${name}" in ${preferredLanguage} first`);
        const result = searchItemsForName(tree.LAYOUT[preferredLanguage], name);
        if (result) {
            console.log(`Found "${name}" in ${preferredLanguage} layout with ID: ${result}`);
            return result;
        }
    }
    
    // Fallback: search through all languages (original behavior)
    for (const lang of ['ENGLISH', 'FRENCH']) {
        // Skip the preferred language if we already searched it
        if (preferredLanguage === lang) continue;
        
        // Check if the language layout exists and is iterable
        if (!tree.LAYOUT[lang] || !Array.isArray(tree.LAYOUT[lang])) {
            console.warn(`findPageIdByName: tree.LAYOUT[${lang}] is not an array`, tree.LAYOUT[lang]);
            continue;
        }
        
        // Search through items in this language
        const result = searchItemsForName(tree.LAYOUT[lang], name);
        if (result) {
            console.log(`Found "${name}" in ${lang} layout with ID: ${result}`);
            return result;
        }
    }
    return null;
}

// Helper function to recursively search through an array of items
function searchItemsForName(items, name) {
    if (!Array.isArray(items)) {
        return null;
    }
    
    for (const item of items) {
        if (item.name === name) {
            return item.id;
        }
        
        // If this item has children, search recursively
        if (item.children && Array.isArray(item.children)) {
            const childResult = searchItemsForName(item.children, name);
            if (childResult) {
                return childResult;
            }
        }
    }
    return null;
}

/** 
 * Main function to run the site setup 
 * @param {string} template - The template type ('SINGLE_PAGE', 'MULTI_PAGE', 'ONBOARDING')
 * @param {boolean} update_settings - Flag indicating if site settings should be updated
 * @param {boolean} add_pages - Flag indicating if pages should be added
 * @param {string} default_language - The default language for the site [en|fr]
 * @param {boolean} is_bilingual - Flag indicating if the site is bilingual
 * @param {boolean} remove_other_pages - Flag indicating if other pages should be removed
 * @param {boolean} refresh_after - Flag indicating if page should refresh after completion
 */
async function run(template = 'SINGLE_PAGE', update_settings = true, add_pages = true, default_language = 'en', is_bilingual = true, remove_other_pages = true, refresh_after = true) {

    logMessage(`🎯 Initializing site setup automation...`, 'info')
    logMessage(`📋 Parameters: ${template} | ${default_language.toUpperCase()} | ${is_bilingual ? 'Bilingual' : 'Single language'}`, 'info')
    try {
        logMessage(`📡 Fetching site data...`, 'progress')
        const templateConfig = CONFIG[template]
        if (!templateConfig) {
            throw new Error(`Invalid template: ${template}. Must be SINGLE_PAGE, MULTI_PAGE, or ONBOARDING`)
        }
        const site_data = await getSiteData(templateConfig.SITE_ID)
        logMessage(`✅ Site data retrieved successfully`, 'success')

        if (update_settings) {
            logMessage(`⚙️ Updating site settings...`, 'progress')
            updateSiteSettings({
                settings: {
                    title: site_data.title,
                    text_logo: site_data.text_logo,
                    header: site_data.header
                },
                content: {
                    footer: site_data.footer
                },
                favicons: {
                    footer: site_data.favicons
                },
                styles: site_data.styles,
                code: {
                    css: site_data.custom_css,
                    header: site_data.header_inject,
                    footer: site_data.footer_inject
                }
            })
            logMessage(`✅ Site settings updated successfully`, 'success')
        }
       
        if (remove_other_pages) {
            let pages = await getItems()
            await removeAllButHome(pages)
        }

        if(add_pages)
            await setupItems(template, default_language, add_pages, is_bilingual, remove_other_pages, refresh_after)
           

        logMessage(`🏆 ${template} site setup completed successfully!`, 'success')
             

        // Show custom refresh confirmation dialog
        if (refresh_after) {
            logMessage(`🔄 Site creation completed - refresh confirmation will appear shortly...`, 'info')
            setTimeout(() => {
                showRefreshDialog()
            }, 1000)
        }
        
    } catch (error) {
        logMessage(`❌ Site setup failed: ${error.message}`, 'error')
    }
}

// Log Dialog Functions
function createLogDialog() {
    // Remove existing dialog if present
    const existingDialog = document.getElementById('siteCreateLogDialog');
    if (existingDialog) {
        existingDialog.remove();
    }

    // Create log dialog HTML
    const logDialogHTML = `
        <div id="siteCreateLogDialog" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10001;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
            <div style="
                background: white;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                width: 80%;
                max-width: 800px;
                height: 70%;
                display: flex;
                flex-direction: column;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #333; font-size: 24px;">📋 Site Creation Progress</h2>
                    <button onclick="closeLogDialog()" style="
                        padding: 8px 16px;
                        border: 2px solid #ddd;
                        background: white;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 600;
                        color: #666;
                    ">✖️ Close</button>
                </div>
                
                <div id="logContent" style="
                    flex: 1;
                    background: #f8f9fa;
                    border: 2px solid #e9ecef;
                    border-radius: 8px;
                    padding: 15px;
                    overflow-y: auto;
                    font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                    font-size: 13px;
                    line-height: 1.4;
                    white-space: pre-wrap;
                "></div>
            </div>
        </div>
    `;

    // Add dialog to page
    document.body.insertAdjacentHTML('beforeend', logDialogHTML);
}

function logMessage(message, type = 'info') {
    const logContent = document.getElementById('logContent');
    if (!logContent) return;
    
    const timestamp = new Date().toLocaleTimeString();
    
    const logEntry = `[${timestamp}] ${message}\n`;
    logContent.textContent += logEntry;
    
    // Auto-scroll to bottom
    logContent.scrollTop = logContent.scrollHeight;
    
    // Also log to console for debugging
    console.log(message);
}

function closeLogDialog() {
    const dialog = document.getElementById('siteCreateLogDialog');
    if (dialog) {
        dialog.remove();
    }
}

// Refresh Confirmation Dialog
function showRefreshDialog() {
    // Remove existing refresh dialog if present
    const existingDialog = document.getElementById('refreshConfirmDialog');
    if (existingDialog) {
        existingDialog.remove();
    }

    // Create refresh confirmation dialog HTML
    const refreshDialogHTML = `
        <div id="refreshConfirmDialog" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10002;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
            <div style="
                background: white;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                min-width: 400px;
                max-width: 500px;
                text-align: center;
            ">
                <div style="font-size: 48px; margin-bottom: 20px;">🎉</div>
                <h2 style="margin: 0 0 15px 0; color: #28a745; font-size: 24px;">Site Creation Completed!</h2>
                <p style="margin: 0 0 25px 0; color: #666; font-size: 16px; line-height: 1.5;">
                    Your site has been successfully created and configured.<br>
                    Would you like to refresh the page to see the changes?
                </p>
                
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button onclick="declineRefresh()" style="
                        padding: 12px 24px;
                        border: 2px solid #ddd;
                        background: white;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 600;
                        color: #666;
                        transition: all 0.2s;
                    " onmouseover="this.style.borderColor='#999'" onmouseout="this.style.borderColor='#ddd'">
                        📋 View Log Only
                    </button>
                    
                    <button onclick="confirmRefresh()" style="
                        padding: 12px 24px;
                        border: none;
                        background: #28a745;
                        color: white;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 600;
                        transition: all 0.2s;
                    " onmouseover="this.style.background='#218838'" onmouseout="this.style.background='#28a745'">
                        🔄 Refresh Page
                    </button>
                </div>
            </div>
        </div>
    `;

    // Add dialog to page
    document.body.insertAdjacentHTML('beforeend', refreshDialogHTML);
}

function confirmRefresh() {
    logMessage(`🔄 User confirmed - refreshing page...`, 'info');
    
    // Close refresh dialog
    const refreshDialog = document.getElementById('refreshConfirmDialog');
    if (refreshDialog) {
        refreshDialog.remove();
    }
    
    // Brief delay to show the log message before refresh
    setTimeout(() => {
        window.location.reload();
    }, 500);
}

function declineRefresh() {
    logMessage(`ℹ️ User declined page refresh - staying on current page`, 'info');
    
    // Close refresh dialog
    const refreshDialog = document.getElementById('refreshConfirmDialog');
    if (refreshDialog) {
        refreshDialog.remove();
    }
}

// Configuration Dialog Functions
function createConfigDialog() {
    // Remove existing dialog if present
    const existingDialog = document.getElementById('siteCreateDialog');
    if (existingDialog) {
        existingDialog.remove();
    }

    // Create dialog HTML
    const dialogHTML = `
        <div id="siteCreateDialog" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
            <div style="
                background: white;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                min-width: 400px;
                max-width: 500px;
            ">
                <h2 style="margin: 0 0 20px 0; color: #333; font-size: 24px;">🚀 Site Creation Configuration</h2>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #555;">
                        🎯 Execution Mode:
                    </label>
                    <select id="executionMode" style="width: 100%; padding: 8px; border: 2px solid #ddd; border-radius: 6px; font-size: 14px;" onchange="toggleModeOptions()">
                        <option value="run">Site Creation</option>
                        <option value="assistWithBuild">Assist With Build</option>
                    </select>
                </div>

                <div id="runOptions" style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                    <h4 style="margin: 0 0 12px 0; color: #333;">⭐ Full Run Options:</h4>
                    
                    <label style="display: flex; align-items: center; margin-bottom: 8px; cursor: pointer;">
                        <input type="checkbox" id="updateSettings" checked style="margin-right: 8px; transform: scale(1.1);" onchange="toggleDependentOptions()">
                        <span style="color: #555;">🔧 Update Settings</span>
                    </label>
                    
                    <label style="display: flex; align-items: center; margin-bottom: 8px; cursor: pointer;">
                        <input type="checkbox" id="addPages" checked style="margin-right: 8px; transform: scale(1.1);" onchange="toggleDependentOptions()">
                        <span style="color: #555;">📄 Add Pages</span>
                    </label>
                    
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" id="removeOtherPages" checked style="margin-right: 8px; transform: scale(1.1);">
                        <span style="color: #555;">🗑️ Remove Other Pages</span>
                    </label>
                </div>

                <div id="siteTypeOptions" style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #555;">
                        📄 Template:
                    </label>
                    <select id="siteTemplate" style="width: 100%; padding: 8px; border: 2px solid #ddd; border-radius: 6px; font-size: 14px;">
                        <option value="SINGLE_PAGE">Single Page Site</option>
                        <option value="MULTI_PAGE">Multi Page Site</option>
                        <option value="ONBOARDING">Onboarding</option>
                    </select>
                </div>

                <div id="languageOptions" style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #555;">
                        🌐 Default Language:
                    </label>
                    <select id="defaultLanguage" style="width: 100%; padding: 8px; border: 2px solid #ddd; border-radius: 6px; font-size: 14px;">
                        <option value="en">English</option>
                        <option value="fr">French</option>
                    </select>
                </div>

                <div id="bilingualOptions" style="margin-bottom: 20px;">
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" id="isBilingual" checked style="margin-right: 8px; transform: scale(1.2);">
                        <span style="font-weight: 600; color: #555;">🗣️ Bilingual Site</span>
                    </label>
                </div>
                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button onclick="closeConfigDialog()" style="
                        padding: 10px 20px;
                        border: 2px solid #ddd;
                        background: white;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 600;
                        color: #666;
                    ">❌ Cancel</button>
                    
                    <button onclick="executeWithConfig()" style="
                        padding: 10px 20px;
                        border: none;
                        background: #007bff;
                        color: white;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 600;
                    ">🚀 Execute</button>
                </div>
            </div>
        </div>
    `;

    // Add dialog to page
    document.body.insertAdjacentHTML('beforeend', dialogHTML);
}

function toggleModeOptions() {
    const executionMode = document.getElementById('executionMode').value;
    const runOptions = document.getElementById('runOptions');
    const siteTypeOptions = document.getElementById('siteTypeOptions');
    const languageOptions = document.getElementById('languageOptions');
    const bilingualOptions = document.getElementById('bilingualOptions');
    
    if (executionMode === 'run') {
        runOptions.style.display = 'block';
        // Show/hide dependent options based on checkbox states
        toggleDependentOptions();
    } else {
        runOptions.style.display = 'none';
        siteTypeOptions.style.display = 'block'; // Always show site type for assist mode
        languageOptions.style.display = 'none';
        bilingualOptions.style.display = 'none';
    }
}

function toggleDependentOptions() {
    const executionMode = document.getElementById('executionMode').value;
    
    // Only apply these rules in 'run' mode
    if (executionMode !== 'run') return;
    
    const updateSettings = document.getElementById('updateSettings').checked;
    const addPages = document.getElementById('addPages').checked;
    
    const siteTypeOptions = document.getElementById('siteTypeOptions');
    const languageOptions = document.getElementById('languageOptions');
    const bilingualOptions = document.getElementById('bilingualOptions');
    
    // Show Site Type if either Update Settings or Add Pages is selected
    if (updateSettings || addPages) {
        siteTypeOptions.style.display = 'block';
    } else {
        siteTypeOptions.style.display = 'none';
    }
    
    // Show Language and Bilingual options only if Add Pages is selected
    if (addPages) {
        languageOptions.style.display = 'block';
        bilingualOptions.style.display = 'block';
    } else {
        languageOptions.style.display = 'none';
        bilingualOptions.style.display = 'none';
    }
}

function closeConfigDialog() {
    const dialog = document.getElementById('siteCreateDialog');
    if (dialog) {
        dialog.remove();
    }
}

async function executeWithConfig() {
    try {
        // Get configuration values BEFORE closing the dialog
        const template = document.getElementById('siteTemplate').value;
        const defaultLanguage = document.getElementById('defaultLanguage').value;
        const isBilingual = document.getElementById('isBilingual').checked;
        const executionMode = document.getElementById('executionMode').value;
        
        // Get run-specific options before closing dialog
        const updateSettings = document.getElementById('updateSettings').checked;
        const addPages = document.getElementById('addPages').checked;
        const removeOtherPages = document.getElementById('removeOtherPages').checked;
        
        // Close dialog AFTER collecting all values
        closeConfigDialog();
        
        // Create and show log dialog
        createLogDialog();
        
        logMessage('🎯 Starting execution with configuration:', 'info');
        logMessage(`   📄 Template: ${template}`, 'info');
        logMessage(`   🌐 Language: ${defaultLanguage.toUpperCase()}`, 'info');
        logMessage(`   🗣️ Bilingual: ${isBilingual ? 'Yes' : 'No'}`, 'info');
        logMessage(`   🎯 Mode: ${executionMode}`, 'info');
        
        if (executionMode === 'run') {
            logMessage(`   🔧 Update Settings: ${updateSettings ? 'Yes' : 'No'}`, 'info');
            logMessage(`   📄 Add Pages: ${addPages ? 'Yes' : 'No'}`, 'info');
            logMessage(`   🗑️ Remove Other Pages: ${removeOtherPages ? 'Yes' : 'No'}`, 'info');
            logMessage(`   🔄 Refresh Confirmation: Will show completion dialog`, 'info');
            
            await run(template, updateSettings, addPages, defaultLanguage, isBilingual, removeOtherPages, true);
        } else {
            await assistWithBuild(template);
        }
        
    } catch (error) {
        logMessage(`❌ Error during execution: ${error.message}`, 'error');
        logMessage(`Stack trace: ${error.stack}`, 'error');
    }
}

// Initialize the configuration dialog
function showConfigDialog() {
    createConfigDialog();
}

// Auto-show dialog when script loads or call showConfigDialog() manually
console.log('🎛️ Site Creation Tool Loaded!');
console.log('📋 Call showConfigDialog() to open configuration dialog');

// Uncomment the line below to auto-show the dialog when the script loads
showConfigDialog();
