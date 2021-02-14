const table = document.getElementById("documents_table");
const getDocURL = "../php/used_documents.php";
const basicURL = "index.html?id=";

//MARK:- Load documents
window.onload = getDocuments();

// Get Documents
function createNewDocument() {
    fetch("/api/create.php?name=TODO")
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

function addEvents(){
    document.querySelectorAll(".document").forEach((doc) => {
        doc.onclick = function(){
            let newUrl = basicURL + doc.id;
            document.location.href = newUrl;
        }
    } )
}

function fillDocuments(data){
    if(!data){
        return;
    }
    table.innerHTML = '';
    data = JSON.parse(data);
    for(row of data){
        let doc = document.createElement("tr");
        doc.innerText = row.id;
        doc.id = row.id;
        doc.classList.add("document");
        table.appendChild(doc);
    }
    
    addEvents();
}

function getDocuments(){
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", getDocURL, true); 
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.onreadystatechange = function() {
        let message = "";
        if (this.status == 200) {
            // console.log("this: " +this)
            var response = this.responseText;
            //console.log("Response: " + response);
            message = "Successful";
            fillDocuments(response);
        } else {
            message = "no documents";
        }
        // document.getElementById("messageHolder").innerText = message;
        console.log(message);
    };
    
    xhttp.send();
}

