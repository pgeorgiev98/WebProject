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

function filename(path) {
	var a = path.split('/');
	a = a[a.length - 1];
	a = path.split('\\');
	a = a[a.length - 1];
	a = a.split('.');
	a.pop();
	return a.join('.');
}

async function uploadCsv() {
	const separator = document.getElementById("upload-separator-select").value;
	const uploadInput = document.getElementById("file-upload");
	const name = filename(uploadInput.value);
	if (uploadInput.files.length == 1) {
		const formData = new FormData();
		formData.append('name', name);
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
			document.location.href = "index.html?id=" + id;
		})
		.catch((error) => {
			console.log("Error: " + error); // TODO
		});
	}
}
