// Revision Stats Exporter - Extracts DataTable to HTML clipboard
let html = "",
  rows = "",
  first = 1;
const cfg = {
  warning: {
    i: "⚠️",
    c: "#ffc107",
  },
  error: {
    i: "❌",
    c: "#dc3545",
  },
  confirm: {
    i: "❓",
    c: "#28a745",
  },
  success: {
    i: "✅",
    c: "#28a745",
  },
};
function dialog(title, msg, type = "warning", onOk, onNo) {
  const d = document.getElementById("d");
  d && d.remove();
  const c = cfg[type] || cfg.warning;
  const dialogEl = document.createElement("div");
  dialogEl.id = "d";
  dialogEl.innerHTML = `<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;justify-content:center;align-items:center;z-index:10000;font-family:-apple-system,sans-serif"> 
            <div style="background:white;padding:30px;border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,0.2);min-width:400px;max-width:600px;text-align:center"> 
                <div style="font-size:48px;margin-bottom:20px">${c.i}</div> 
                <h2 style="margin:0 0 15px 0;color:${
                  c.c
                };font-size:24px">${title}</h2> 
                <p style="margin:0 0 25px 0;color:#666;font-size:16px;line-height:1.5;white-space:pre-line">${msg}</p> 
                <div style="display:flex;gap:15px;justify-content:center"> 
                    ${
                      type === "confirm"
                        ? `<button id="cancelBtn" style="padding:12px 24px;border:2px solid #ddd;background:white;border-radius:8px;cursor:pointer;font-size:16px;font-weight:600;color:#666">Cancel</button> 
                         <button id="okBtn" style="padding:12px 24px;border:none;background:${c.c};color:white;border-radius:8px;cursor:pointer;font-size:16px;font-weight:600">OK</button>`
                        : `<button id="okBtn" style="padding:12px 24px;border:none;background:${c.c};color:white;border-radius:8px;cursor:pointer;font-size:16px;font-weight:600">OK</button>`
                    } 
                </div> 
            </div> 
        </div>`;
  document.body.appendChild(dialogEl);
  // Add proper event listeners (no global variables needed)
  const okBtn = document.getElementById("okBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  okBtn.onclick = () => {
    closeD();
    onOk && onOk();
  };
  if (cancelBtn)
    cancelBtn.onclick = () => {
      closeD();
      onNo && onNo();
    };
}
function closeD() {
  const d = document.getElementById("d");
  d && d.remove();
}
function start() {
  dialog(
    "Export Revision Statistics",
    "Ready to create your revision statistics table!\n\nClick OK to start.",
    "confirm",
    gather
  );
}
function makeRow(r) {
  try {
    const a = r.advisor?.display_name || "N/A",
      e = r.advisor?.email || "N/A",
      d = r.site?.settings?.domains?.join(", ") || "N/A",
      t =
        r.advisor?.settings?.broker_tags?.map((x) => x.name)?.join(", ") ||
        "N/A",
      rt = r.location || "N/A",
      rn = (r?.meta?.name ? r.meta.name + " - " : "") + r.title || "N/A",
      s = r.state || "N/A",
      rb = r.reviewed_by?.display_name || "N/A",
      sd = r.site?.submitted_at
        ? new Date(r.site.submitted_at).toLocaleString().replace(",", "")
        : "N/A",
      rd = r.created_at
        ? new Date(r.created_at).toLocaleString().replace(",", "")
        : "N/A",
      ni = r.internal_notes?.replace(/<\/*[^>]*>?/gm, " ") || "",
      rj = r.notes?.replace(/<\/*[^>]*>?/gm, " ") || "";
    return `<tr><td>${a}<br style="mso-data-placement:same-cell"/>${e}</td><td>${d}</td><td>${t}</td><td>${rt}</td><td>${rn}</td><td>${s}</td><td>${rb}</td><td>${sd}</td><td>${rd}</td><td>${ni}</td><td>${rj}</td></tr>`;
  } catch (e) {
    return "";
  }
}
function makeTable() {
  return `<table border="1" style="border-collapse:collapse;width:100%"> 
        <thead> 
            <tr style="background-color:#f2f2f2"> 
                <th>Advisor</th><th>Domain</th><th>Tags</th><th>Revision Type</th><th>Revision Title</th> 
                <th>Status</th><th>Reviewed By</th><th>Submitted Date</th><th>Reviewed Date</th><th>Notes</th><th>Rejection Notes</th> 
            </tr> 
        </thead> 
        <tbody>${rows}</tbody> 
    </table>`;
}
async function copy(h) {
  try {
    await navigator.clipboard.writeText(h);
    dialog(
      "Export Complete!",
      "Table copied to clipboard!\n\nPaste into Excel, Word, etc.",
      "success"
    );
  } catch (e) {
    const t = document.createElement("textarea");
    Object.assign(t.style, {
      position: "fixed",
      top: "10%",
      left: "10%",
      width: "80%",
      height: "70%",
      zIndex: "10001",
      background: "white",
      border: "2px solid #333",
      borderRadius: "8px",
      padding: "10px",
      fontFamily: "monospace",
      fontSize: "12px",
    });
    t.value = h;
    document.body.appendChild(t);
    t.select();
    dialog(
      "Manual Copy Required",
      "Auto-copy failed.\n\nHTML selected in textarea.\nPress Ctrl+C, then OK.",
      "warning",
      () => document.body.removeChild(t)
    );
  }
}
function loaded() {
  const p = document.getElementById("revisions-list_processing");
  return !p || getComputedStyle(p).display === "none";
}
function wait() {
  return new Promise((resolve) => {
    const check = () => (loaded() ? resolve() : setTimeout(check, 100));
    first ? ((first = 0), resolve()) : check();
  });
}
async function gather() {
  try {
    await wait();
    const dt = $(".dataTable").DataTable(),
      d = dt.data();
    if (!d || !d.length) return done();
    d.each((r) => {
      const rh = makeRow(r);
      rh && (rows += rh);
    });
    const n = $(".next");
    n.length && !n.hasClass("disabled") ? (n.click(), gather()) : done();
  } catch (e) {
    dialog("Processing Error", "Error: " + e.message, "error");
  }
}
function done() {
  if (!rows.trim())
    return dialog(
      "No Data",
      "No data found.\n\nCheck DataTable has data.",
      "warning"
    );
  html = makeTable();
  copy(html);
}
// Start the export process
start();
