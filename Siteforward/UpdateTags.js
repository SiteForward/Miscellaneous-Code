// Configuration constants
const BASE_URL = 'https://app.twentyoverten.com'
const HEADERS = {
    'Content-Type': 'application/json'
}

// Tag replacement mappings
const TAG_REPLACEMENTS = {
    'IIROC (MSI)': 'CIRO: Investment',
    'MFDA (MSISI)': 'CIRO: Mutual Fund'
    // Add more replacements here as needed
}

// Helper function to fetch advisor details
async function fetchAdvisorDetails(advisorId) {
    try {
        const response = await fetch(`${BASE_URL}/manage/advisor/one/${advisorId}`)
        if (!response.ok) {
            throw new Error(`Failed to fetch advisor details: ${response.status} ${response.statusText}`)
        }
        return await response.json()
    } catch (error) {
        console.error(`Error fetching advisor ${advisorId}:`, error)
        throw error
    }
}

// Helper function to update advisor tags
async function updateAdvisorTags(advisorId, tags) {
    try {
        const payload = { tags }
        const response = await fetch(`${BASE_URL}/manage/advisor/tags/${advisorId}`, {
            method: 'PUT',
            headers: HEADERS,
            body: JSON.stringify(payload)
        })
        
        if (!response.ok) {
            throw new Error(`Failed to update tags: ${response.status} ${response.statusText}`)
        }
        
        return await response.json()
    } catch (error) {
        console.error(`Error updating tags for advisor ${advisorId}:`, error)
        throw error
    }
}

// Helper function to apply tag replacements
function applyTagReplacements(tags) {
    let updatedTags = tags
    for (const [oldTag, newTag] of Object.entries(TAG_REPLACEMENTS)) {
        updatedTags = updatedTags.replace(oldTag, newTag)
    }
    return updatedTags
}

// Main processing loop
for (const advisor of advisor_list.slice(0, 1)) {
    try {
        console.log(`Processing advisor: ${advisor.display_name || advisor._id}`)
        
        // Fetch current advisor details
        const advisorDetails = await fetchAdvisorDetails(advisor._id)
        
        // Validate required data structure
        if (!advisorDetails.settings?.broker_tags) {
            console.warn(`No broker tags found for advisor ${advisor._id}`)
            continue
        }
        
        // Extract and process tags
        const currentTags = advisorDetails.settings.broker_tags
            .map(tag => tag.name)
            .join(',')
        
        console.log(`Current tags: ${currentTags}`)
        
        // Apply tag replacements
        const updatedTags = applyTagReplacements(currentTags)
        
        // Only update if tags have changed
        if (currentTags !== updatedTags) {
            console.log(`Updated tags: ${updatedTags}`)
            
            const result = await updateAdvisorTags(advisor._id, updatedTags)
            console.log(`✅ Successfully updated tags for advisor ${advisor._id}`)
        } else {
            console.log(`ℹ️  No tag changes needed for advisor ${advisor._id}`)
        }
        
    } catch (error) {
        console.error(`❌ Failed to process advisor ${advisor._id}:`, error.message)
        // Continue with next advisor instead of stopping the entire process
    }
}
