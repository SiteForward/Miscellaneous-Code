let promises = []
let pixel_count = 0,
    ga_count = 0;
let table_HTML = `
<table><thead>
<th>Site title</th>
<th>Email</th>
<th>Tags</th>
<th>Domains</th>
<th>Last Published Date</th>
<tbody>`

alert( "Creating Table - Please wait, this will take a bit.\nDon't click anywhere else until this is done.\n\n(Click Ok to start.)" )

//Get advisor site info
$('#advisorsList').DataTable().rows().data().each((row, i) => {
    let site = row.site
    if(row.site.status != "taken_down") 
        promises.push(getSiteInfo(row, site))
})
//Wait for all fetches to return

Promise.all(promises).then(res =>{
    //console.log(`Completed | Pixel: ${pixel_count} | GA: ${ga_count} / Total: ${promises.length}`)
    res.forEach(advisor => table_HTML += `
      <tr>
      <td>${advisor.title}</td>
      <td>${advisor.email}</td>
      <td>${advisor.tags.join(", ")}</td>
      <td>${advisor.domains.join(`<br style="mso-data-placement:same-cell;" />`)}</td>
      <td>${advisor.lastPublished}</td>
      </tr>
      `)
    
    //Finish table
    table_HTML += "</tbody></table>"

    //Copy table to clipboard
    setTimeout(function(){
        navigator.clipboard.writeText(table_HTML).then( 
            function () { 
              alert("Copying to clipboard was successful!") 
            }, 
            function (err) { 
              alert("Could not copy text: " + err) 
            } 
          ) 
    },1)
})




//Async fetch all site info based on site id
 async function getSiteInfo(row, site){
    let id = site._id
    let res = await fetch("https://app.twentyoverten.com/manage/advisor/notes/"+id)
    res = await res.json()
    let header_inject = res.site.code.header.toLowerCase()
    let footer_inject = res.site.code.footer.toLowerCase()
    let title = row.display_name
    let email = row.email
    let lastPublished = row.published_date

    //Check for Pixel code
    //if(header_inject.indexOf("pixel") >= 0 || footer_inject.indexOf("pixel") >= 0)
    //    console.log(`Pixel: ${title} | ${pixel_count++}`)
    //Check for Google Analytics code
    //if(header_inject.indexOf("googletagmanager") >= 0 || footer_inject.indexOf("googletagmanager") >= 0 || res.site.settings.analytics != "")
    //    console.log(`GA: ${title} | ${ga_count++}`)

    let domains = res.site.settings.domains
    let tags = row.settings.broker_tags.map(tag => tag.name)
    return new Promise((res, rej)=> res({title,email,tags,domains, lastPublished}))
    //return new Promise((res, rej) => res(true))
}