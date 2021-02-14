<!DOCTYPE html>
<html>
    <head>
        <title>MyDocuments</title>
		<meta charset="UTF-8">

        <link rel="stylesheet" href="Auth/styles.css">
        <link href="icons/css/all.css" rel="stylesheet">
        <link rel="stylesheet" href="stylesheet.css">
    </head>

    <body>
        <?php
        session_start();
        
        if(!isset($_SESSION['userID'])) {
            header('Location: Auth/login.html');
            exit();
        }
        ?>

        <a id="create-new-table-button" >
            <button type="button" class="btn-primary wauto hauto" >Създай</button>
        </a>
        <a id="upload-csv-button" >
            <button type="button" class="btn-primary wauto hauto" >Качи</button>
        </a>
        <input id = "documentName" type="text"  class = "Inputs p30 placeholder="Име на файл" required/> 
        <div id="messageHolder">
        <div> 

        </div>
        <div id="documents_holder" class="documents_holder">
            <div class="document" style="text-align: center; background: white; border: 2px solid #2196f3; color: #2196f3; font-weight: bold;">
                Моите документи
            </div>
            <table id="documents_table" style="width: 100%; margin: auto">
            </table>
        </div>

        <div id="footer_container" style="display: flex; align-items: right; justify-content: right">
            <a href="https://learn.fmi.uni-sofia.bg/" target="_blank">
                <img src="img/moodle.jpg" style="height: 50px; width: 100px">
            </a>

            <a href="https://susi.uni-sofia.bg/ISSU/forms/Login.aspx" target="_blank">
                <img src="img/susi.jpg" style="height: 50px; width: 150px">
            </a>

            <a href="http://w15ref.w3c.fmi.uni-sofia.bg/" target="_blank">
                <img src="img/puffin.png" style="height: 50px; width: 100px">
            </a>
            <a id="logout_button">
                <button type="button" class="btn-primary wauto hauto" >Излез</button>
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
        <script type="text/javascript" src="./used_documents.js"></script>
    </body>
</html>