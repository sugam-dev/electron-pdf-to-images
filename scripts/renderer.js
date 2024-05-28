const $form = $("#upload-form");
const $folderInput = $("#folderInput");
const $folderError = $("#folder-error");
const $fileInput = $("#fileInput");
const $fileError = $("#file-error");
const $imageContainer = $("#imageContainer");

$form.on("submit", async function (event) {
  event.preventDefault(); // Prevent default form submission

  const file = $fileInput[0].files[0];
  const filePath = $fileInput[0].files[0].path;
  const folderPath = $folderInput.val();

  const result = await window.electron.checkFolderExists(folderPath);

  // Check if the folder exists
  if (result.success) {
    if (!result.IsExist) {
      showToast("Warning:", "Folder does not exist", "warning");
      return;
    }
  }

  // Check if file is selected and is a PDF
  if (!file || file.type !== "application/pdf") {
    showToast("Warning:", "Please select a PDF file", "warning");
    return;
  }

  try {
    const result = await window.electron.extractImages(filePath, folderPath);
    if (result.success) {
      showCustonToast(folderPath, "Images extracted successfully!", "success");
    } else {
      showToast("Error:", `${result.error}`, "danger");
    }
  } catch (error) {
    showToast("Error:", `${error}`, "danger");
  }
});

function showToast(title, message, type) {
  let toastHTML = `
      <div class="toast align-items-center text-bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">
            <strong>${title}</strong> ${message}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;
  $("#toast-container").append(toastHTML);
  let toast = new bootstrap.Toast($("#toast-container .toast").last()[0]);
  toast.show();
}

function showCustonToast(outputDir, message, type) {
  console.log('outputDir:', outputDir);
  let toastHTML = `
      <div class="toast text-bg-${type}" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-body">
          ${message}.
          <div class="mt-2 pt-2 border-top">
          <button type="button" class="btn btn-light btn-sm" onclick="openFolder('${outputDir}')">Open Folder</button>
            <button type="button" class="btn btn-secondary btn-sm" data-bs-dismiss="toast">Close</button>
          </div>
        </div>
      </div>
    `;
  $("#toast-container").append(toastHTML);
  let toast = new bootstrap.Toast($("#toast-container .toast").last()[0]);
  toast.show();
}

async function openFolder(outputDir) {
  console.log('outputDir in openFolder:', outputDir);
  await window.electron.openFolderInOS(outputDir);
}
