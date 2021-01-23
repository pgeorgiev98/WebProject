var div = document.getElementById("table-container");
var canvas = document.getElementById("canvas");
var input = document.getElementById("input-value");
var ctx = canvas.getContext("2d");

var cellHeight = 30;
var cellWidth = 80;

var firstRow = 0;
var firstColumn = 0;

class Cell {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.text = "";
        this.evaluated = "";
    }
}

Cell.prototype.setText = function(text)
{
    this.evaluated = evaluate(text);
    this.text = text;
}

class Table {
    _cells

    constructor() {
        this.clear();
    }
}

Table.prototype.clear = function () {
    this._cells = [];
    this.onFocus = this.getCell(0,0);
    this.rowOnFocus = -1;
    this.colOnFocus = -1;
}

Table.prototype.update = function () {
    ctx.canvas.width = parent.innerWidth;
    ctx.canvas.height = parent.innerHeight;

    tableWidth = Math.round(ctx.canvas.width / cellWidth);
    tableHeight = Math.round(ctx.canvas.height / cellHeight);

    //TODO make crispy
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    drawHeaders(tableWidth, tableHeight);

    for (var row = 0; row < tableHeight; row++) {
        for (var col = 0; col < tableWidth; col++) {
            cell = this.getCell(row+firstRow, col+firstColumn);
            //cell = this.getCell(row, col);
            textToDisplay = cell.evaluated;
            if (col + firstColumn == this.colOnFocus){
                ctx.fillStyle = "lightblue";
                ctx.fillRect(col * cellWidth + cellWidth, row * cellHeight + cellHeight, cellWidth, cellHeight);
            }
            if (row + firstRow == this.rowOnFocus){
                ctx.fillStyle = "lightblue";
                ctx.fillRect(col * cellWidth + cellWidth, row * cellHeight + cellHeight, cellWidth, cellHeight);
            }
            if (col + firstColumn == this.onFocus.col && row + firstRow == this.onFocus.row) {
                ctx.fillStyle = "lightblue";
                ctx.fillRect(col * cellWidth + cellWidth, row * cellHeight + cellHeight, cellWidth, cellHeight);
                textToDisplay = cell.text;
            }
            ctx.strokeRect(col * cellWidth+cellWidth, row * cellHeight+cellHeight, cellWidth, cellHeight);
            ctx.fillStyle = "black";
            ctx.fillText(textToDisplay, col * cellWidth + (cellWidth / 2) + cellWidth, row * cellHeight + (cellHeight / 2)+cellHeight);
        }
    }
}

Table.prototype.getCell = function (row, col) {
    if (row < this._cells.length && this._cells[row].length > col)
        return this._cells[row][col];
    else if (row >= this._cells.length || col >= this._cells[row].length) {
        for (var i = this._cells.length; i <= row; i++) {
            this._cells.push([]);
        }
        for (var i = this._cells[row].length; i <= col; i++) {
            var cell = new Cell(row, i);
            this._cells[row].push(cell);
        }
        return this._cells[row][col];
    }
}

Table.prototype.fromArray = function (data) {
    for (var row in data) {
        var r = parseInt(row);
        for (var col in data[r]) {
            var c = parseInt(col);
            this.getCell(r, c).setText(data[r][c]);
        }
    }
}

var table = new Table();

onMouseClick = function (canvas, event) {
    event.preventDefault();
    rect = canvas.getBoundingClientRect();
    col = event.clientX - rect.left;
    row = event.clientY - rect.top;

    col = Math.floor(col / cellWidth) - 1 + firstColumn;
    row = Math.floor(row / cellHeight) - 1 + firstRow;

    if(col < firstColumn){
        table.rowOnFocus = row;
        table.colOnFocus = -1;
        table.onFocus = table.getCell(row,0);
    }
    else if(row < firstRow){
        table.colOnFocus = col;
        table.rowOnFocus = -1;
        table.onFocus = table.getCell(0,col);
    }
    else {
        table.rowOnFocus = -1;
        table.colOnFocus = -1;

        table.onFocus = table.getCell(row,col);
        cell = table.getCell(row, col);
    }

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
        setCell();

        newRow = table.onFocus.row + 1;
        table.rowOnFocus = -1;
        table.colOnFocus = -1;

        cell = table.getCell(newRow, table.onFocus.col);
        table.onFocus = cell;

        document.getElementById("input-value").value = table.onFocus.text;
        document.getElementById("input-value").focus();
        table.update();
    }
    if (event.key == "Tab") {
        event.preventDefault();
        setCell();

        newCol = table.onFocus.col + 1;
        table.rowOnFocus = -1;
        table.colOnFocus = -1;

        cell = table.getCell(table.onFocus.row, newCol);
        table.onFocus = table.getCell(table.onFocus.row, 0);
        table.onFocus = cell;

        document.getElementById("input-value").value = table.onFocus.text;
        document.getElementById("input-value").focus();
        table.update();
    }
});

input.addEventListener("input", function(event)
{
   setCell(); 
});

div.addEventListener("wheel", function(event)
{
    firstRow += event.deltaY;
    firstColumn += event.deltaX;
    firstRow = Math.max(0, firstRow);
    firstColumn = Math.max(0, firstColumn);
    table.update();
});

getDocument = function () {
    socket.send('{"command": "get_document_json"}');
}

openDocument = function(id) {
	var params = new URLSearchParams(window.location.search)
	params.set('id', id);
	// Add the id to the url in the address bar
	history.replaceState(null, null, "?"+params.toString());
	connect(id);
}

createNewDocument = function() {
	const params = new URLSearchParams(window.location.search)
	if (params.has('id')) {
		socket.close();
		table.clear();
	}

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
document.getElementById("create-new-table-button").addEventListener("click", createNewDocument);

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
            table.getCell(y,x).setText(value);
            table.update();
        }
    }

    socket.onopen = function () {
        // TODO: The ID here is hardcoded
        socket.send('{"command": "open", "id": "' + id + '"}');
        getDocument();
    }
}

setCell = function () {
    var x = table.onFocus.col;
    var y = table.onFocus.row;

    var value = document.getElementById("input-value").value;

    table.getCell(y, x).setText(value);
    table.update();

    socket.send('{"command": "set_cell", "x": ' + x + ', "y": ' + y + ', "value": "' + value + '"}');
}

drawHeaders = function(tableWidth, tableHeight)
{
    //TODO make crispy
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    //draw top row
    for(var i = 0; i < tableWidth; i++)
    {
        ctx.fillStyle = (table.colOnFocus == i + firstColumn || table.onFocus.col == i + firstColumn) ? "darkgrey" : "lightgrey";

        ctx.fillRect(cellWidth + i * cellWidth, 0, cellWidth, cellHeight);
        ctx.strokeRect(cellWidth + i * cellWidth, 0, cellWidth, cellHeight);

        ctx.fillStyle = "black";
        ctx.fillText(getColName(i+firstColumn), i * cellWidth + 1.5*cellWidth, cellHeight/2);
    }
    //draw left column
    for(var i = 0; i < tableHeight; i++)
    {
        ctx.fillStyle = (table.rowOnFocus == i + firstRow || table.onFocus.row == i + firstRow) ? "darkgrey" : "lightgrey";

        ctx.fillRect(0, i*cellHeight + cellHeight, cellWidth, cellHeight);
        ctx.strokeRect(0, i*cellHeight + cellHeight, cellWidth, cellHeight);

        ctx.fillStyle = "black";
        ctx.fillText(i + 1 + firstRow, cellWidth / 2, i * cellHeight + 1.5 * cellHeight);
    }
}

getColName = function(index)
{
    index += 1;
    var s = "";
    do {
        index -= 1;
        s = String.fromCharCode((index % 26) + 65) + s;
        index = Math.floor(index / 26);
    } while (index > 0);
    return s;
}

evaluate = function(input)
{
    if(input[0] == '=')
    {
        e = function (val) { return Function('return' + val)(); }
        try
        {
            return e('(' + input.slice(1) + ')');
        }
        catch(err)
        {
            return "#ERROR";
        }
    }
    else return input;
}



document.addEventListener('DOMContentLoaded', function () {
	const params = new URLSearchParams(window.location.search)
	if (params.has('id')) {
		openDocument(params.get('id'));
	}
});
