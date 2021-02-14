const table = document.getElementById("documents_table");
const getDocURL = "../php/used_documents.php";
var basicURL = "index.html?id=";

//MARK:- Load documents
window.onload = getDocuments;

// Get Documents

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
        if(!row.name){
            continue;
        }
        let tr = document.createElement("tr");
        let doc = document.createElement("div");
        doc.innerText = row.name;
        doc.id = row.id;
        doc.classList.add("document");
        tr.appendChild(doc)
        table.appendChild(tr);
    }
    
    addEvents();
}

function getDocuments(){
    console.log("Get Documents")
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

