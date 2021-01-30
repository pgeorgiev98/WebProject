var username = document.getElementById("username");
var password = document.getElementById("password");
var facultyNumber = document.getElementById("facultyNumber");

const url = "AuthManager.php"
const body = {
    username: username,
    password: password,
    facultyNumber: facultyNumber
}

const params = {
    body: body,
    method: "POST"
}

RegisterUser= function () {
    fetch(url, params)
        .then(response => response.json())
        .then(json => { console.log(json)})
        .catch((error) => {
            console.log("Error: " + error); 
        });
}