document.getElementById("download-csv-button").addEventListener("click", openDownloadForm);
document.getElementById("upload-csv-button").addEventListener("click", openUploadForm);

function openDownloadForm() {
	document.getElementById("csv-download-form").style.display = "block";
}

function closeDownloadForm() {
	document.getElementById("csv-download-form").style.display = "none";
}

function openUploadForm() {
	document.getElementById("csv-upload-form").style.display = "block";
}

function closeUploadForm() {
	document.getElementById("csv-upload-form").style.display = "none";
}

function downloadCsv() {
	const separator = document.getElementById("download-separator-select").value;
	const link = document.getElementById("csv-download-link");
    const params = new URLSearchParams(window.location.search)
    if (params.has('id')) {
        id = params.get('id');
		link.href = "/api/download_csv.php?id=" + id + "&sep=" + separator;
		link.download = "download.csv"; // TODO: Some file name
		closeDownloadForm();
	}
	// TODO: Error handling
}

async function uploadCsv() {
	const separator = document.getElementById("upload-separator-select").value;
	const uploadInput = document.getElementById("file-upload");
	if (uploadInput.files.length == 1) {
		const formData = new FormData();
		formData.append('sep', separator);
		formData.append('file', uploadInput.files[0]);
		fetch('/api/upload_csv.php', {
			method: 'POST',
			headers: {
				headers: {
					'Accept': 'application/json',
				},
			},
			body: formData
		})
		.then(response => response.json())
		.then(json => {
			const id = json["id"]; // TODO: error check
			closeUploadForm();
			openDocument(id);
		})
		.catch((error) => {
			console.log("Error: " + error); // TODO
		});
	}
}
