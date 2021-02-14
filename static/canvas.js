function onMouseDown(canvas, event) {
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

        clickOnFocusStyles();

        document.getElementById("input-value").value = cell.text;
        document.getElementById("input-value").focus();
    }

    table.update();
}

function onMouseUp(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;

    hScroll.mouseUp(x, y);
    vScroll.mouseUp(x, y);
    table.update();
}

function onMouseMove(event) {
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

input.addEventListener("keydown", function (event) {
    if (event.key == "Enter") {
        event.preventDefault();

        newRow = table.onFocus.row + 1;
        table.rowOnFocus = -1;
        table.colOnFocus = -1;

        cell = table.getCell(newRow, table.onFocus.col);
        table.onFocus = cell;

        document.getElementById("input-value").value = table.onFocus.text;
        document.getElementById("input-value").focus();

        clickOnFocusStyles();
        table.update();
    }
    if (event.key == "Tab") {
        event.preventDefault();

        newCol = table.onFocus.col + 1;
        table.rowOnFocus = -1;
        table.colOnFocus = -1;

        cell = table.getCell(table.onFocus.row, newCol);
        table.onFocus = table.getCell(table.onFocus.row, 0);
        table.onFocus = cell;

        document.getElementById("input-value").value = table.onFocus.text;
        document.getElementById("input-value").focus();

        clickOnFocusStyles();
        table.update();
    }
    if(event.key == "Delete") {
        table.onFocus.setText("");
        document.getElementById("input-value").value = table.onFocus.text;
        table.update();
    }
});

input.addEventListener("input", function (event) {
    table.onFocus.setText(input.value);
    table.onFocus.saveCell();
    table.update();
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