<!DOCTYPE html>
<html>
    <head>
        <title>MyDocuments</title>
		<meta charset="UTF-8">
        <style>
            .document {
                text-decoration: underline;
            }
        </style>
        <link rel="stylesheet" href="stylesheet.css">
        <link href="icons/css/all.css" rel="stylesheet">
    </head>

    <body>
        <?php
        session_start();
        
        if(!isset($_SESSION['userID'])) {
            header('Location: Auth/login.html');
            exit();
        }
        ?>

        <div>
        <a id="create-new-table-button" >
            <button type="button" class="btn" >Създай</button>
        </a>

        <a id="upload-csv-button" >
            <button type="button" class="btn" >Качи</button>
        </a>

        </div>
       
        <div id="documents_holder" style="width: 30%; margin: auto; border: 2px solid black">
            <table id="documents_table">
            </table>
        </div>

        <div>
            <a id="logout_button">
                <button type="button" class="btn" >Изглез</button>
            </a>  
        </div>

        <div id="csv-upload-form" class="form-popup">
			<form>
				<h2>Upload CSV</h2>

				<input id="file-upload" type="file" accept=".csv, .txt"></button>

				<div>
					<label for="separator">Column separator:</label>
					<select name="separator" id="upload-separator-select">
						<option value="comma">Comma (,)</option>
						<option value="dot">Dot (.)</option>
						<option value="semicolon">Semicolon (;)</option>
						<option value="colon">Colon (:)</option>
						<option value="tab">Tab</option>
					</select>
				</div>

				<button type="button" class="btn" onclick="uploadCsv()">Upload</button>
				<button type="button" class="btn cancel" onclick="closeUploadForm()">Cancel</button>
			</form>
		</div>

        <script type="text/javascript" src="./main_page_manager.js"></script>
        <script type="text/javascript" src="./csv.js"></script>
        <script type="text/javascript" src="./used_documents"></script>
    </body>
</html>