var canvas = document.getElementById("canvas");
var input = document.getElementById("input-value");
var ctx = canvas.getContext("2d");

var cellHeight = 30;
var cellWidth = 80;
var tableDimension = 10;

class Cell {
    constructor(col, row) {
        this.col = col;
        this.row = row;
        this.text = "";
    }
}

class Table {
    constructor(dimension) {
        this.dimension = dimension;
        this.cells = [];
        for (var row = 0; row < dimension; row++) {
            this.cells.push([]);
        }
        for (var row = 0; row < dimension; row++) {
            for (var col = 0; col < dimension; col++) {
                var cell = new Cell(col, row);
                this.cells[row].push(cell);
            }
        }
        this.onFocus = this.cells[0][0];
    }
}

Table.prototype.update = function () {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    //TODO make crispy
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (var row = 0; row < this.dimension; row++) {
        for (var col = 0; col < this.dimension; col++) {
            if (col == this.onFocus.col && row == this.onFocus.row) {
                ctx.fillStyle = "lightblue";
                ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
            }
            ctx.strokeRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
            ctx.fillStyle = "black";
            cell = this.getCell(row, col);
            ctx.fillText(cell.text, col * cellWidth + (cellWidth / 2), row * cellHeight + (cellHeight / 2));
        }
    }
}

Table.prototype.getCell = function (row, col) {
    if (row < this.dimension && this.dimension > col)
        return this.cells[row][col];
    else return "";
}

Table.prototype.fromArray = function (data) {
    for (var row in data) {
        for (var col in data[row]) {
            //TODO
            if (row < this.dimension && col < this.dimension)
                this.cells[row][col].text = data[row][col];
        }
    }
}

var table = new Table(tableDimension);

onMouseClick = function (canvas, event) {
    event.preventDefault();
    rect = canvas.getBoundingClientRect();
    col = event.clientX - rect.left;
    row = event.clientY - rect.top;

    col = Math.floor(col / cellWidth);
    row = Math.floor(row / cellHeight);

    table.onFocus = table.cells[row][col];
    cell = table.getCell(row, col);

    document.getElementById("input-x").value = table.onFocus.col;
    document.getElementById("input-y").value = table.onFocus.row;
    document.getElementById("input-value").value = cell.text;
    document.getElementById("input-value").focus();

    table.update();
}

canvas.addEventListener("mousedown", function (event) {
    onMouseClick(canvas, event);
});

input.addEventListener("keydown", function (event) {
    if (event.key == "Enter") {
        event.preventDefault();
        document.getElementById("set").click();

        newRow = table.onFocus.row + 1;
        cell = table.getCell(newRow, table.onFocus.col);
        if (cell == "") {
            table.onFocus = table.cells[0][table.onFocus.col];
        }
        else {
            table.onFocus = cell;
        }

        document.getElementById("input-x").value = table.onFocus.col;
        document.getElementById("input-y").value = table.onFocus.row;
        document.getElementById("input-value").value = table.onFocus.text;
        document.getElementById("input-value").focus();
        table.update();
    }
    if (event.key == "Tab") {
        event.preventDefault();
        document.getElementById("set").click();

        newCol = table.onFocus.col + 1;
        cell = table.getCell(table.onFocus.row, newCol);
        if (cell == "") {
            table.onFocus = table.cells[table.onFocus.row][0];
        }
        else {
            table.onFocus = cell;
        }

        document.getElementById("input-x").value = table.onFocus.col;
        document.getElementById("input-y").value = table.onFocus.row;
        document.getElementById("input-value").value = table.onFocus.text;
        document.getElementById("input-value").focus();
        table.update();
    }
});

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
            table.fromArray(obj['data']);
            table.update();
        } else if (command == 'set_cell') {
            var x = obj['x'];
            var y = obj['y'];
            var value = obj['value'];
            if (y < table.dimension && x < table.dimension)
                table.cells[y][x].text = value;
            table.update();
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

    if (y < table.dimension && x < table.dimension)
        table.cells[y][x].text = value;
    table.update();

    socket.send('{"command": "set_cell", "x": ' + x + ', "y": ' + y + ', "value": "' + value + '"}');
}
