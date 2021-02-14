const table = document.getElementById("documents_table");
const url = "../php/used_documents.php";
const basicURL = "index.html?id=";

window.onload = getDocuments();

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
    xhttp.open("GET", url, true); 
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