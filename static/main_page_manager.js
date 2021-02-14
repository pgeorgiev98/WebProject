const logoutURL = "../api/logout.php"
const basicURL = "index.html?id=";

//MARK:- CREATE
document.getElementById("create-new-table-button").onclick = createNewDocument;

//MARK:- LOGOUT
document.getElementById("logout_button").onclick = Logout;

function Logout() {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", logoutURL, true); 
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function() {
        document.location.href = "Auth/login.html";
    };
    xhttp.send();
}

