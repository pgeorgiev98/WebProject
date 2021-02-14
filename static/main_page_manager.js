const logoutURL = "../api/logout.php"
var basicURL = "index.html?id=";
var docName = document.getElementById("documentName")

//MARK:- CREATE
document.getElementById("create-new-table-button").onclick = createNewDocument;

//MARK:- LOGOUT
document.getElementById("logout_button").onclick = Logout;

function Logout() {
    console.log("Logout")
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", logoutURL, true); 
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function() {
        document.location.href = "Auth/login.html";
    };
    xhttp.send();
}

function createNewDocument() {
    if(!docName.value.trim()) {
        document.getElementById("messageHolder").innerText = "Моля въведете име на файла" ;
        return;
    }

    fetch("../api/create.php?name=" + docName.value.trim())
        .then(response => response.json())
        .then(json => {
           const id = json["id"]; // TODO: error check
           console.log("URL:" + basicURL + id )
           let newUrl = basicURL + id;
           document.location.href = newUrl;
        })
        .catch((error) => {
            console.log("Error: " + error); // TODO
        });
}
