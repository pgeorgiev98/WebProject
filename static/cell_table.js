class Cell {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.text = "";
        this.evaluated = "";
        this.style = 0;
        this.background = "#ffffff";
    }

    setText(text) {
        this.evaluated = evaluate(text);
        this.text = text;
    }

    encode() {
        return '["' + this.text + '", ' + this.style + ', "' + this.background + '"]';
    }

    decode(cellValue) {
        this.text = "";
        this.evaluated = "";
        this.style = 0;
        this.background = "#ffffff";
        if(cellValue.length > 0)
        {
            this.text = cellValue[0];
            this.evaluated = evaluate(this.text);
        }
        if(cellValue.length > 1)
        {
            this.style = cellValue[1];
        }
        if(cellValue.length > 2)
        {
            this.background = cellValue[2];
        }
    }

    saveCell() {
        socket.send('{"command": "set_cell", "x": ' + this.col + ', "y": ' + this.row + ', "value": ' + this.encode() + '}');
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

        ctx.textBaseline = "middle";
        drawHeaders(tableWidth, tableHeight);

        for (var row = 0; row < tableHeight; row++) {
            for (var col = 0; col < tableWidth; col++) {

                var cell = this.getCell(row + firstRow, col + firstColumn);
                var textToDisplay = cell.evaluated;
                var x_pos = col * cellWidth + cellWidth;
                var y_pos = row * cellHeight + cellHeight;

                ctx.fillStyle = cell.background;
                ctx.fillRect(x_pos, y_pos, cellWidth, cellHeight);

                ctx.strokeStyle = "black";
                ctx.strokeRect(x_pos, y_pos, cellWidth, cellHeight);
            }
        }

        for (var row = 0; row < tableHeight; row++) {
            for (var col = 0; col < tableWidth; col++) {

                var cell = this.getCell(row + firstRow, col + firstColumn);
                var textToDisplay = cell.evaluated;
                var x_pos = col * cellWidth + cellWidth;
                var y_pos = row * cellHeight + cellHeight;

                ctx.strokeStyle = blue_accent_color;
                ctx.lineWidth = 2;

                if (col + firstColumn == this.colOnFocus) {
                    ctx.strokeRect(x_pos, y_pos, cellWidth, cellHeight);
                }
                if (row + firstRow == this.rowOnFocus) {
                    ctx.strokeRect(x_pos, y_pos, cellWidth, cellHeight);
                }
                if (col + firstColumn == this.onFocus.col && row + firstRow == this.onFocus.row) {
                    textToDisplay = cell.text;
                    ctx.strokeRect(x_pos, y_pos, cellWidth, cellHeight);
                }
                ctx.strokeWeight = 1;

                ctx.fillStyle = "black";

                var style = cell.style;
                var align = decodeAlign(style);
                ctx.textAlign = align;
                var offset = 0;

                if(align == "center") {
                    offset += cellWidth / 2;
                }
                else if(align == "right") {
                    offset += cellWidth - 3;
                }
                else {
                    offset += 3;
                }

                ctx.font = decodeStyle(style) + "15px Times New Roman";
                ctx.fillText(textToDisplay, x_pos + offset, y_pos + (cellHeight / 2));
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
                this.getCell(r, c).decode(data[r][c]);
            }
        }
    }
}

drawHeaders = function (tableWidth, tableHeight) {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "15px Times New Roman";

    //draw top row
    for (var i = 0; i < tableWidth; i++) {
        ctx.fillStyle = (table.colOnFocus == i + firstColumn || table.onFocus.col == i + firstColumn) ? header_accent_color : header_color;

        var x_pos = cellWidth + i * cellWidth;
        ctx.fillRect(x_pos, 0, cellWidth, cellHeight);
        ctx.strokeRect(x_pos, 0, cellWidth, cellHeight);

        ctx.fillStyle = "black";
        ctx.fillText(getColName(i + firstColumn), i * cellWidth + 1.5 * cellWidth, cellHeight / 2);
    }
    //draw left column
    for (var i = 0; i < tableHeight; i++) {
        ctx.fillStyle = (table.rowOnFocus == i + firstRow || table.onFocus.row == i + firstRow) ? header_accent_color : header_color;

        var y_pos = i * cellHeight + cellHeight;
        ctx.fillRect(0, y_pos, cellWidth, cellHeight);
        ctx.strokeRect(0, y_pos, cellWidth, cellHeight);

        ctx.fillStyle = "black";
        ctx.fillText(i + 1 + firstRow, cellWidth / 2, i * cellHeight + 1.5 * cellHeight);
    }
}

var table = new Table();