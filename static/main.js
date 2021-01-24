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

    setText(text) {
        this.evaluated = evaluate(text);
        this.text = text;
    }
}

class Table {
    _cells

    constructor() {
        this.clear();
    }

    clear() {
        this._cells = [];
        this.onFocus = this.getCell(0, 0);
        this.rowOnFocus = -1;
        this.colOnFocus = -1;
    }

    update() {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        drawHeaders(tableWidth, tableHeight);

        for (var row = 0; row < tableHeight; row++) {
            for (var col = 0; col < tableWidth; col++) {
                var cell = this.getCell(row + firstRow, col + firstColumn);
                var textToDisplay = cell.evaluated;
                var x = col * cellWidth + cellWidth;
                var y = row * cellHeight + cellHeight;
                if (col + firstColumn == this.colOnFocus) {
                    ctx.fillStyle = "lightblue";
                    ctx.fillRect(x, y, cellWidth, cellHeight);
                }
                if (row + firstRow == this.rowOnFocus) {
                    ctx.fillStyle = "lightblue";
                    ctx.fillRect(x, y, cellWidth, cellHeight);
                }
                if (col + firstColumn == this.onFocus.col && row + firstRow == this.onFocus.row) {
                    ctx.fillStyle = "lightblue";
                    ctx.fillRect(x, y, cellWidth, cellHeight);
                    textToDisplay = cell.text;
                }
                ctx.strokeRect(x, y, cellWidth, cellHeight);
                ctx.fillStyle = "black";
                ctx.fillText(textToDisplay, x + (cellWidth / 2), y + (cellHeight / 2));
            }
        }

        drawScrollbars();
    }

    getCell(row, col) {
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

    fromArray(data) {
        for (var row in data) {
            var r = parseInt(row);
            for (var col in data[r]) {
                var c = parseInt(col);
                this.getCell(r, c).setText(data[r][c]);
            }
        }
    }
}

var table = new Table();

class Scrollbar {
    constructor(orientation) {
        this.orientation = orientation;
        this.max = 50;
        this.thickness = 15;
        this.active = false;
        this.dragStartPos = 0;
    }

    getPositionLength() {
        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;
        const minLength = 30;

        const verticalCells = Math.ceil(ctx.canvas.height / cellHeight);
        const horizonalCells = Math.ceil(ctx.canvas.width / cellWidth);

        var position = 0;
        var length = 0;
        var max = 0;

        if (this.orientation == 'horizontal') {
            max = this.max + horizonalCells;
            const maxLength = ctx.canvas.width / 2;
            length = Math.max(minLength, maxLength * 50 / max);
            position = Math.min(1, firstColumn / max) * (canvasWidth - this.thickness - length);
        } else {
            max = this.max + verticalCells;
            const maxLength = ctx.canvas.height / 2;
            length = Math.max(minLength, maxLength * 50 / max);
            position = Math.min(1, firstRow / max) * (canvasHeight - this.thickness - length);
        }

        return [position, length, max];
    }

    getNewPosition(coord) {
        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;
        var plm = this.getPositionLength();
        var length = plm[1];
        var max = plm[2];
        var ret = 0;
        if (this.orientation == 'horizontal') {
            ret = max * coord / (canvasWidth - this.thickness - length);
        } else {
            ret = max * coord / (canvasHeight - this.thickness - length);
        }
        return Math.max(0, Math.round(ret));
    }

    draw() {
        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;

        const backColor = '#eeeeee';
        const inactiveColor = '#bbbbbb';
        const activeColor = '#555555';

        const color = this.active ? activeColor : inactiveColor;

        var pl = this.getPositionLength();
        var position = pl[0];
        var length = pl[1];

        if (this.orientation == 'horizontal') {
            ctx.fillStyle = backColor;
            ctx.fillRect(0, canvasHeight - this.thickness, canvasWidth - this.thickness, this.thickness);

            ctx.fillStyle = color;
            ctx.fillRect(position, canvasHeight - this.thickness, length, this.thickness);
        } else {
            ctx.fillStyle = backColor;
            ctx.fillRect(canvasWidth - this.thickness, 0, this.thickness, canvasHeight - this.thickness);

            ctx.fillStyle = color;
            ctx.fillRect(canvasWidth - this.thickness, position, this.thickness, length);
        }
    }

    mouseDown(x, y) {
        var pl = this.getPositionLength();
        var position = pl[0];
        var length = pl[1];

        if (this.orientation == 'horizontal') {
            if (y < ctx.canvas.height - this.thickness)
                return false;
            if (x >= position && x <= position + length) {
                this.dragStartPos = x - position;
                this.active = true;
            }
        } else {
            if (x < ctx.canvas.width - this.thickness)
                return false;
            if (y >= position && y <= position + length) {
                this.dragStartPos = y - position;
                this.active = true;
            }
        }
        return true;
    }

    mouseUp(x, y) {
        var pl = this.getPositionLength();
        var position = pl[0];
        var length = pl[1];

        if (this.active) {
            if (this.orientation == 'horizontal') {
                firstColumn = this.getNewPosition(x - this.dragStartPos);
            } else {
                firstRow = this.getNewPosition(y - this.dragStartPos);
            }
            this.active = false;
        }
        this.autoSize();
    }

    mouseMove(x, y) {
        var pl = this.getPositionLength();
        var position = pl[0];
        var length = pl[1];

        if (this.active) {
            if (this.orientation == 'horizontal') {
                firstColumn = this.getNewPosition(x - this.dragStartPos);
            } else {
                firstRow = this.getNewPosition(y - this.dragStartPos);
            }
        }
    }

    autoSize() {
        if (this.orientation == 'horizontal')
            this.max = Math.max(this.max, firstColumn);
        else
            this.max = Math.max(this.max, firstRow);
    }
}

var hScroll = new Scrollbar('horizontal');
var vScroll = new Scrollbar('vertical');

onMouseDown = function (canvas, event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    if (hScroll.mouseDown(x, y)) {
    } else if (vScroll.mouseDown(x, y)) {
    } else {
        event.preventDefault();
        col = x;
        row = y;

        col = Math.floor(col / cellWidth) - 1 + firstColumn;
        row = Math.floor(row / cellHeight) - 1 + firstRow;

        if (col < firstColumn) {
            table.rowOnFocus = row;
            table.colOnFocus = -1;
            table.onFocus = table.getCell(row, 0);
        }
        else if (row < firstRow) {
            table.colOnFocus = col;
            table.rowOnFocus = -1;
            table.onFocus = table.getCell(0, col);
        }
        else {
            table.rowOnFocus = -1;
            table.colOnFocus = -1;

            table.onFocus = table.getCell(row, col);
            cell = table.getCell(row, col);
        }

        document.getElementById("input-value").value = cell.text;
        document.getElementById("input-value").focus();
    }

    table.update();
}

onMouseUp = function (event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    hScroll.mouseUp(x, y);
    vScroll.mouseUp(x, y);
    table.update();
}

onMouseMove = function (event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    oldFirstColumn = firstColumn;
    oldFirstRow = firstRow;
    hScroll.mouseMove(x, y);
    vScroll.mouseMove(x, y);
    if (oldFirstColumn != firstColumn || oldFirstRow != firstRow)
        table.update();
}

canvas.onmousedown = function (event) {
    onMouseDown(canvas, event);
}

window.onmouseup = function (event) {
    onMouseUp(event);
}

window.onmousemove = function (event) {
    onMouseMove(event);
}

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

input.addEventListener("input", function (event) {
    setCell();
});

div.addEventListener("wheel", function (event) {
    firstRow += event.deltaY;
    firstColumn += event.deltaX;
    firstRow = Math.max(0, firstRow);
    firstColumn = Math.max(0, firstColumn);

    hScroll.autoSize();
    vScroll.autoSize();
    table.update();
});

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
            table.getCell(y, x).setText(value);
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

drawHeaders = function (tableWidth, tableHeight) {
    //TODO make crispy
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    //draw top row
    for (var i = 0; i < tableWidth; i++) {
        ctx.fillStyle = (table.colOnFocus == i + firstColumn || table.onFocus.col == i + firstColumn) ? "darkgrey" : "lightgrey";

        ctx.fillRect(cellWidth + i * cellWidth, 0, cellWidth, cellHeight);
        ctx.strokeRect(cellWidth + i * cellWidth, 0, cellWidth, cellHeight);

        ctx.fillStyle = "black";
        ctx.fillText(getColName(i + firstColumn), i * cellWidth + 1.5 * cellWidth, cellHeight / 2);
    }
    //draw left column
    for (var i = 0; i < tableHeight; i++) {
        ctx.fillStyle = (table.rowOnFocus == i + firstRow || table.onFocus.row == i + firstRow) ? "darkgrey" : "lightgrey";

        ctx.fillRect(0, i * cellHeight + cellHeight, cellWidth, cellHeight);
        ctx.strokeRect(0, i * cellHeight + cellHeight, cellWidth, cellHeight);

        ctx.fillStyle = "black";
        ctx.fillText(i + 1 + firstRow, cellWidth / 2, i * cellHeight + 1.5 * cellHeight);
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
    table.update();
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

if (document.readyState === "complete" || document.readyState === "loaded") {
    onDocumentLoaded();
}
else {
    document.addEventListener('DOMContentLoaded', onDocumentLoaded);
}

document.body.onresize = function () {
    onWindowResize();
};
