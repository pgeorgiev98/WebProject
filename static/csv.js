document.getElementById("download-csv-button").addEventListener("click", openForm);

function openForm() {
	document.getElementById("csv-download-form").style.display = "block";
}

function closeForm() {
	document.getElementById("csv-download-form").style.display = "none";
}

function downloadCsv() {
	const separator = document.getElementById("separator-select").value;
	const link = document.getElementById("csv-download-link");
    const params = new URLSearchParams(window.location.search)
    if (params.has('id')) {
        id = params.get('id');
		link.href = "/api/download_csv.php?id=" + id + "&sep=" + separator;
		link.download = "download.csv"; // TODO: Some file name
		closeForm();
	}
	// TODO: Error handling
}
