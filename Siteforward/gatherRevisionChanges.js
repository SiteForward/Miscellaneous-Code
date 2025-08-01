let gatheredHtml = "";
let gatheredRowsHtml = "";
const gatheredDelay = 7000;

alert("Creating Table - Please wait, this will take a bit.\nDon't click anywhere else until this is done.\n\n(Click Ok to start.)");
gatherRows();

function gatherRows() {
  setTimeout(() => {
    const dataTable = $(".dataTable").DataTable();
    const rowsData = dataTable.data().rows().data();

    rowsData.each((row) => {
      const advisor = row.advisor.display_name;
      const email = row.advisor.email;
      const domain = row.site.settings.domains.join(", ");
      const tags = row.advisor.settings.broker_tags.map(tag => tag.name).join(", ");
      const revisionType = row.location;
      const revisionName = (row?.meta?.name ? `${row.meta.name} - ` : "") + row.title;
      const status = row.state;
      const reviewedBy = row.reviewed_by.display_name;
      const submittedDate = new Date(row.site.submitted_at).toLocaleString().replace(",", "");
      const reviewedDate = new Date(row.created_at).toLocaleString().replace(",", "");
      const note = row.internal_notes?.replace(/<\/*[^>]*>?/gm, " ");
      const rejectionNote = row.notes?.replace(/<\/*[^>]*>?/gm, " ");

      const rowHtml = `
        <tr>
          <td>${advisor}<br style="mso-data-placement:same-cell" />${email}</td>
          <td>${domain}</td>
          <td>${tags}</td>
          <td>${revisionType}</td>
          <td>${revisionName}</td>
          <td>${status}</td>
          <td>${reviewedBy}</td>
          <td>${submittedDate}</td>
          <td>${reviewedDate}</td>
          <td>${note}</td>
          <td>${rejectionNote}</td>
        </tr>`;
      
      gatheredRowsHtml += rowHtml;
    });

    if (rowsData.length > 0) {
      $(".next").click();
      gatherRows();
    } else {
      gatheredHtml = `
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
              <th>Submitted Date</th>
              <th>Reviewed Date</th>
              <th>Notes</th>
              <th>Rejection Notes</th>
            </tr>
          </thead>
          <tbody>
            ${gatheredRowsHtml}
          </tbody>
        </table>`;

      navigator.clipboard.writeText(gatheredHtml).then(
        () => alert("Copying to clipboard was successful!"),
        (err) => alert("Could not copy text: " + err)
      );
    }
  }, gatheredDelay);
}