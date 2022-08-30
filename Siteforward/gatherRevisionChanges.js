let gathered_html = ""
let gathered_rowsHTML = ""
let gathered_delay = 7000
alert("Creating Table - Please wait, this will take a bit.\nDon't click anywhere else until this is done.\n\n(Click Ok to start.)")
gatherRows()

function gatherRows() {
  setTimeout(function() {
    $(".dataTable").DataTable().data().rows().data().each(row => {
      let gathered_advisor = row.advisor.display_name
      let gathered_email = row.advisor.email
      let gathered_domain = row.site.settings.domains.join(", ")
      let gathered_tags = row.advisor.settings.broker_tags.map(tag => tag.name).join(", ")
      let gathered_revisionType = row.location
      let gathered_revisionName = (row?.meta?.name ? row.meta.name + " - " : "") + row.title
      let gathered_status = row.state
      let gathered_reviewedBy = row.reviewed_by.display_name
      let gathered_reviewedDate = new Date(row.created_at).toLocaleString()
      let gathered_note = row.internal_notes?.replace(/<\/*[^>]*>?/gm, ' ')
      let gathered_rejectionNote = row.notes?.replace(/<\/*[^>]*>?/gm, ' ')
      let gathered_rowHTML = `
      <tr>
      	<td>${gathered_advisor}<br style="mso-data-placement:same-cell;" />${gathered_email}</td>
      	<td>${gathered_domain}</td>
        <td>${gathered_tags}</td>
        <td>${gathered_revisionType}</td>
        <td>${gathered_revisionName}</td>
        <td>${gathered_status}</td>
        <td>${gathered_reviewedBy}</td>
        <td>${gathered_reviewedDate}</td>
        <td>${gathered_note}</td>
        <td>${gathered_rejectionNote}</td>
      </tr>`
      gathered_rowsHTML += gathered_rowHTML
    })
    if ($(".dataTable").DataTable().data().rows().data().length > 0) {
      $(".next").click()
      gatherRows()
    } else {
      gathered_html = `
        <table>
        	<thead>
        		<tr>
              <th>Advisor</th>
              <th>Domain</th>
              <th>Tags</th>
              <th>Revision Type</th>
              <th>Revision Title</th>
              <th>Status</th>
              <th>Reviewed By</th>
              <th>Reviewed Date</th>
              <th>Notes</th>
              <th>Rejection Notes</th>
            </tr>
					</thead>
          <tbody>
        		${gathered_rowsHTML}
        	</tbody>
        </table>`
      navigator.clipboard.writeText(gathered_html).then(function() {
  alert("Copying to clipboard was successful!");
}, function(err) {
  alert('Could not copy text: '+ err);
});
    }
  }, gathered_delay)
}
