table_data = [];

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var input = document.getElementById("input-value");

var cellHeight = 30;
var cellWidth = 80;
var tableDimension = 10;

var onFocus = [];

updateTable = function () {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    //TODO make crispy
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (var row = 0; row < tableDimension; row++) {
        for (var col = 0; col < tableDimension; col++) {
            if (col == onFocus[0] && row == onFocus[1]) {
                ctx.fillStyle = "lightblue";
                ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
            }
            ctx.strokeRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
            ctx.fillStyle = "black";
            ctx.fillText(getCell(col, row), col * cellWidth + (cellWidth / 2), row * cellHeight + (cellHeight / 2));
        }
    }
}

onMouseClick = function (canvas, event) {
    event.preventDefault();
    rect = canvas.getBoundingClientRect();
    col = event.clientX - rect.left;
    row = event.clientY - rect.top;

    col = Math.floor(col / cellWidth);
    row = Math.floor(row / cellHeight);

    onFocus = [col, row];

    document.getElementById("input-x").value = col;
    document.getElementById("input-y").value = row;
    document.getElementById("input-value").value = getCell(col, row);
    document.getElementById("input-value").focus();

    updateTable();
}

canvas.addEventListener("mousedown", function (event) {
    onMouseClick(canvas, event);
});

input.addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
        event.preventDefault();
        document.getElementById("set").click();
    }
});

getCell = function (col, row) {
    if (row < table_data.length && table_data[row].length > col)
        return table_data[row][col];
    else return "";
}

getDocument = function () {
    socket.send('{"command": "get_document_json"}');
}

connect = function () {
    socket = new WebSocket('ws://localhost:8080');

    socket.onmessage = function (message) {
        //alert( message.data );
        var obj = JSON.parse(message.data);
        var command = obj['command'];
        if (command == 'get_document_json') {
            table_data = obj['data'];
            updateTable();
        } else if (command == 'set_cell') {
            var x = obj['x'];
            var y = obj['y'];
            var value = obj['value'];
            for (var i = table_data.length; i <= y; i++) {
                table_data.push([]);
            }
            for (var i = table_data[y].length; i <= x; i++) {
                table_data[y].push('');
            }
            table_data[y][x] = value;
            updateTable();
        }
    }

    socket.onopen = function () {
        // TODO: The ID here is hardcoded
        socket.send('{"command": "open", "id": "00aaff"}');
        getDocument();
    }
}

setCell = function () {
    var x = document.getElementById("input-x").value;
    var y = document.getElementById("input-y").value;
    var value = document.getElementById("input-value").value;

    for (var i = table_data.length; i <= y; i++) {
        table_data.push([]);
    }
    for (var i = table_data[y].length; i <= x; i++) {
        table_data[y].push('');
    }
    table_data[y][x] = value;
    updateTable();

    socket.send('{"command": "set_cell", "x": ' + x + ', "y": ' + y + ', "value": "' + value + '"}');
}
