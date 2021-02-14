window.onmouseup = function (event) {
    onMouseUp(event);
}

window.onmousemove = function (event) {
    onMouseMove(event);
}

getDocument = function () {
    socket.send('{"command": "get_document_json"}');
}

openDocument = function (id) {
    var params = new URLSearchParams(window.location.search)
    params.set('id', id);
    // Add the id to the url in the address bar
    history.replaceState(null, null, "?" + params.toString());
    connect(id);
}

createNewDocument = function () {
    fetch("/api/create.php?name=TODO")
        .then(response => response.json())
        .then(json => {
            const id = json["id"]; // TODO: error check
            openDocument(id);
        })
        .catch((error) => {
            console.log("Error: " + error); // TODO
        });
}

document.getElementById("create-new-table-button").addEventListener("click", function () {
    const params = new URLSearchParams(window.location.search)
    if (params.has('id')) {
        window.open(window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + window.location.pathname + '?createnew=true', '_blank');
    } else {
        createNewDocument();
    }
});

connect = function (id) {
    const hostname = window.location.hostname;
    socket = new WebSocket('ws://' + hostname + ':8080');

    socket.onmessage = function (message) {
        //alert( message.data );
        var obj = JSON.parse(message.data);
        var command = obj['command'];
        if (command == 'get_document_json') {
            table.fromArray(obj['data']);
            table.update();
        } else if (command == 'set_cell') {
            var x = obj['x'];
            var y = obj['y'];
            var value = obj['value'];
            table.getCell(y, x).decode(value);
            table.update();
        }
    }

    socket.onopen = function () {
        // TODO: The ID here is hardcoded
        socket.send('{"command": "open", "id": "' + id + '"}');
        getDocument();
    }
}

drawScrollbars = function () {
    hScroll.draw();
    vScroll.draw();
}

getColName = function (index) {
    index += 1;
    var s = "";
    do {
        index -= 1;
        s = String.fromCharCode((index % 26) + 65) + s;
        index = Math.floor(index / 26);
    } while (index > 0);
    return s;
}

evaluate = function (input) {
    if (input[0] == '=') {
        e = function (val) { return Function('return' + val)(); }
        try {
            return e('(' + input.slice(1) + ')');
        }
        catch (err) {
            return "#ERROR";
        }
    }
    else return input;
}


onWindowResize = function () {
    div.style.height = (window.innerHeight - div.offsetTop - 16) + "px";
    ctx.canvas.width = div.offsetWidth;
    ctx.canvas.height = div.offsetHeight;
    tableWidth = Math.round(ctx.canvas.width / cellWidth);
    tableHeight = Math.round(ctx.canvas.height / cellHeight);
    const params = new URLSearchParams(window.location.search)
    if (params.has('id')) {
        table.update();
    }
}

onDocumentLoaded = function () {
    const params = new URLSearchParams(window.location.search)
    if (params.has('id')) {
        openDocument(params.get('id'));
    } else if (params.has('createnew') && params.get('createnew')) {
        history.replaceState(null, null, '?');
        createNewDocument();
    }
    onWindowResize();
}

if (document.readyState === "complete" || document.readyState === "loaded" || document.readyState === "interactive") {
    onDocumentLoaded();
}
else {
    document.addEventListener('DOMContentLoaded', onDocumentLoaded);
}

document.body.onresize = function () {
    onWindowResize();
};
