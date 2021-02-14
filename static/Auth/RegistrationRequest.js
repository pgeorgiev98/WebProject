var username = document.getElementById("username");
var password = document.getElementById("password");
var facultyNumber = document.getElementById("facultyNumber");
var registerButton = document.getElementById("registerButton");

registerButton.onclick = RegisterUser;

function ValidateInputs() {
    if(!username.value.trim()) {
        console.log("Useranem");
        return false;
    } else if(!facultyNumber.value.trim()) {
        console.log("Fac");
        return false;
    } else if(!password.value.trim()) {
        console.log("Pass");
        return false;
    }
    console.log("ValidateInputs");
    return true;
}

function loadMainWindow() {
    window.location.href = "../main_page.php";
}

function RegisterUser(){
    
    if (!ValidateInputs()) {
        console.log("Invalid");
        document.getElementById("messageHolder").innerText = "Моля попълнете всички полета!" ;
        return;
    } else {
        console.log("Valid");
        document.getElementById("messageHolder").innerText = "" ;
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/api/register.php", true); 
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function() {
        let message = "";
        if (this.status == 200) {
            var response = this.responseText;
            console.log(response);
            message = "Successful";
            loadMainWindow();
        } else if (this.status == 204) { //This user already exist
            message = "Вече съществува потребител с този факултетен номер!";
        }else {
            message = "Проблем със сървъра!";
        }
        document.getElementById("messageHolder").innerText = message;
    };
    
    const body = {
        username: username.value.trim(),
        password: password.value.trim(),
        facultyNumber: facultyNumber.value.trim()
    }
    xhttp.send(JSON.stringify(body));
}


