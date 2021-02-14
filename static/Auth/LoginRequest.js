var password = document.getElementById("password");
var facultyNumber = document.getElementById("facultyNumber");
var loginButton = document.getElementById("login");

loginButton.onclick = Login;

function ValidateInputs() {
   if(!facultyNumber.value.trim()) {
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

function Login() {

    if (!ValidateInputs()) {
        console.log("Invalid");
        document.getElementById("messageHolder").innerText = "Моля попълнете всички полета!" ;
        return;
    } else {
        console.log("Valid");
        document.getElementById("messageHolder").innerText = "" ;
    }

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/api/login.php", true); 
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function() {
        let message = "";
        if (this.status == 200) {
            var response = this.responseText;
            console.log("Response" . response);
            message = "Successful";
            loadMainWindow();
        } else {
            message = "Въвели сте грешен факултетен номер и парола!";
        }
        document.getElementById("messageHolder").innerText = message;
    };
    
    const body = {
        password: password.value.trim(),
        facultyNumber: facultyNumber.value.trim()
    }
    xhttp.send(JSON.stringify(body));
}


