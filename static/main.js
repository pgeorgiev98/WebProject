table_data = [];

updateTable = function () {
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");

    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    //TODO make crispy
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;

    var tableDimension = 10;
    var cellHeight = 30;
    var cellWidth = 80;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (var i = 0; i < tableDimension; i++) {
        for (var j = 0; j < tableDimension; j++) {
            ctx.strokeRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
            if(i < table_data.length && table_data[i].length > j)
                ctx.fillText(table_data[i][j], j * cellWidth + (cellWidth / 2), i * cellHeight + (cellHeight / 2));
        }
    }
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
