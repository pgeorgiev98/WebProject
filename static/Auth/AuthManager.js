var username = document.getElementById("username");
var password = document.getElementById("password");
var registerButton = document.getElementById("registerButton");
var facultyNumber = document.getElementById("facultyNumber");

registerButton.onclick = RegisterUser;

//console.log(registerButton.onclick);

const url = "../../api/register.php"
const body = {
    username: username,
    password: password,
    facultyNumber: facultyNumber
}

const params = {
    body: body,
    method: "POST"
}


function RegisterUser(){
    console.log("here");
    fetch(url, params)
        .then(response => response.json())
        .then(json => { console.log(json) })
        .catch((error) => {
            console.log("Error: " + error); 
        });
}
