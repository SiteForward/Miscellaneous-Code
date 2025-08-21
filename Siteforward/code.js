fetch("https://app.twentyoverten.com/manage/advisor/one/5d4c7ae9196e8802bfb1e84d");                     // Get advisor info (advisor id)
fetch("https://app.twentyoverten.com/manage/advisor/notes/5d4c7ae7196e8802bfb1e84c");                   // Get Site info (site id)

fetch("https://app.twentyoverten.com/api/content/broker");                                              // Get broker custom content
fetch("https://app.twentyoverten.com/api/content");                                                     // Get 20/10 Provided content
fetch("https://app.twentyoverten.com/api/officers");                                                    // Get Officers

fetch("https://app.twentyoverten.com/api/revisions/66e336fa24e250865d558cdb");                          // Get Revision info (revision id)
fetch("https://app.twentyoverten.com/api/content/5d4c7ae9196e8802bfb1e84d/5d4c7b1f196e8802bfb1e850");   // Get Page content (advisor id & page id)
fetch("https://app.twentyoverten.com/api/pages/[pageid]");                                              // Gets page info from id   

fetch('https://app.twentyoverten.com/api/members?page_id=5b719261138837295d1d7ee1')                     // Get the team members from a page id
fetch('https://app.twentyoverten.com/api/members/5b719261138837295d1d7ee3')                             // Get the team member info

// Requires login
fetch("https://app.twentyoverten.com/api/sites");                   // Get current advisor site     - depends who is logged in editor
fetch("https://app.twentyoverten.com/api/users/site");              // Get current advisor user     - depends who is logged in editor
fetch("https://app.twentyoverten.com/api/objects");                 // Get uploads library items    - depends who is logged in editor
fetch("https://app.twentyoverten.com/api/pages");                   // All pages on website         - depends who is logged in editor


/* ---------------------------------------------  
// Update page content, not working. The update API only accepts certain options 

  //Only the the following if using the Single Page Framework
  if(site_id == '642338e703a127cc457d7b6b'){
    //Update Home page content
    let home = pages.find(page => page.name == "Home")
    let single_page_home_data = await getSinglePageHomeData()
    let new_data= {content: single_page_home_data.content}
    updatePage(home._id, new_data)
  }

//Function to update a page
function updatePage(page_id, new_data){
    $.ajax({
        method: 'PUT',
        cache: false,
        data: new_data,
        url: 'https://app.twentyoverten.com/api/pages/' + page_id,
        success: () => console.info("Successfully updated " + page_id),
        error: () => console.info("Failed to update " + page_id),
    });
}

// Function to get the Single Page Framework's Home content
async function getSinglePageHomeData(){
    let data = await fetch('https://app.twentyoverten.com/api/pages/6423394f03a127cc457d7c4f')
    data = await data.json()
    return data
}


*//* 

------------------------------------------------- 
// Print out code for single pagers

let english_data = await getPageData('6423394f03a127cc457d7c4f')
let french_data = await getPageData('64f0c97c6ffaf8c435fd70c2')
console.log("========== English ==========")
console.log(english_data.hero_content)
console.log(english_data.content)
console.log("\n========== French ==========")
console.log(french_data.hero_content)
console.log(french_data.content)


// Function to get the Single Page Framework's Home content
async function getPageData(id){
    let data = await fetch('https://app.twentyoverten.com/api/pages/'+id)
    data = await data.json()
    return data
}





*/



