let show = 12; // How many to keep out of draft mode
let keep = 50; // How many to keep in draft mode before deleting the rest

// If the user moves the mouse, stop the automation
let stopExecution = false;
document.addEventListener("mousemove", (event) => {
  if (event.isTrusted) stopExecution = true;
});

// Start the automation
run();

async function run() {
  // Grab all the posts on the page
  const posts = document.querySelectorAll(".post.edit-post");
  console.log("Found", posts.length, "Posts");

  // Loop through all the posts
  for (let i in [...posts]) {
    let post = posts[i];

    // Check if the execution was stopped by user interaction
    if (stopExecution) {
      console.log("Execution stopped by user");
      break;
    }

    // Log the process starting points
    if (i == keep) console.log("\nStarting Removal Process");
    else if (i == show) console.log("\nStarting Drafting Process");

    console.log("\nChecking Post", parseInt(i) + 1, "/", posts.length);
    console.log(post);

    // Remove post if index is greater than or equal to 'keep'
    if (i >= keep) {
      await removePost(post);
    }
    // Move post to draft if index is greater than or equal to 'show'
    else if (i >= show) {
      if (post.classList.contains("is-draft")) console.log("Already drafted");
      else await moveToDraft(post);
    }
  }
}

// Function to remove a post
async function removePost(post) {
  post = document.querySelector(
    ".post.edit-post[data-id='" + post.getAttribute("data-id") + "']"
  );
  console.log("Removing Post");
  post.click(); // Open the post editor
  await waitForEditPaneLoaded();
  console.log("Editor Loaded");
  // Click delete button
  document.querySelector(".edit-post-pane .delete-post").click();
  console.log("Deleting post");
  await sleep(1000); // Wait for the delete confirmation dialog
  if (stopExecution) {
    console.log("Execution stopped by user");
    return;
  }
  // Confirm deletion
  document.querySelector(".btn--danger.vex-dialog-button.vex-last").click();
  await waitForEditPaneUnloaded();
}

// Function to move a post to draft
async function moveToDraft(post) {
  post = document.querySelector(
    ".post.edit-post[data-id='" + post.getAttribute("data-id") + "']"
  );
  console.log("Drafting Post");
  post.click(); // Open the post editor
  await waitForEditPaneLoaded();
  console.log("Editor Loaded");

  const checkbox = document.querySelector(
    ".page-actions.toggle-group .toggle-switch input"
  );
  if (stopExecution) {
    console.log("Execution stopped by user");
    return;
  }
  // If the post is not already drafted, draft it
  if (checkbox.checked) {
    checkbox.click();
    console.log("Moved to draft");
  }
  console.log("Saving post");
  // Save the changes
  document.querySelector(".edit-post-pane .save").click();
  await waitForEditPaneUnloaded();
}

// Helper function to wait for the edit pane to load
function waitForEditPaneLoaded() {
  return new Promise((resolve, reject) => {

    let checkCount = 0;
    const maxChecks = 50;
    const checkInterval = setInterval(() => {
      console.log("Waiting for load", checkCount);

      const editPane = document.querySelector(".edit-post-pane");
      const overlayReady = document
        .querySelector("#page-settings-overlay")
        .classList.contains("ready");

      if (stopExecution) {
        clearInterval(checkInterval);
        reject(new Error("Execution stopped by user"));
      } else if (editPane.style.display === "block" && overlayReady) {
        clearInterval(checkInterval);
        setTimeout(resolve, 2000);
      } else if (checkCount++ >= maxChecks) {
        clearInterval(checkInterval);
        reject(new Error("Failed to load edit pane"));
      }
    }, 100);
  });
}

// Helper function to wait for the edit pane to unload
function waitForEditPaneUnloaded() {
  return new Promise((resolve, reject) => {
    
    let checkCount = 0;
    const maxChecks = 50;
    const checkInterval = setInterval(() => {
      console.log("Waiting for unload", checkCount);
      if (stopExecution) {
        clearInterval(checkInterval);
        reject(new Error("Execution stopped by user"));
      } else if (
        document.querySelector(".edit-post-pane").style.display === "none"
      ) {
        clearInterval(checkInterval);
        setTimeout(resolve, 2000);
      } else if (checkCount++ >= maxChecks) {
        clearInterval(checkInterval);
        reject(new Error("Failed to unload edit pane"));
      }
    }, 100);
  });
}

// Helper function to pause execution for a given time
function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
