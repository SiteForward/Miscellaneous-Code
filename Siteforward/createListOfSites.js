*!taken, !SF - Program, !SF - Not, published

alert("Creating Table - Click Ok to start.")
let allHTML = ""
document.querySelectorAll(".search-bar table tr").forEach(function(e, i){
	if(i == 0) return;
	let name = e.querySelector(".view-advisor-profile").textContent
	let tags = e.querySelector(".advisor-tags").textContent
	let date = e.querySelector(".has-date").getAttribute("data-date")
	let url = e.querySelector(".liveWebsiteURL").href
	
	let gathered_html = `
	  <tr>
		<td>${name}</td>
		<td>${tags}</td>
		<td>${date}</td>
		<td>${url}</td>
	  </tr>`
	  
	  allHTML += gathered_html
	
}) 
	  
allHTML = `
	<table>
		<thead>
			<tr>
			  <th>Advisor</th>
			  <th>Tags</th>
			  <th>Date</th>
			  <th>URL</th>
			</tr>
		</thead>
		<tbody>
			${allHTML}
		</tbody>
	</table>`
navigator.clipboard.writeText(allHTML).then(function() {
	alert("Copying to clipboard was successful!")
}, function(err) {
	alert('Could not copy text: '+ err)
})
