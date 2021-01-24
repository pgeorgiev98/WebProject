function include(filename)
{
    var js = document.createElement('script');

    js.src = filename;
    js.type = 'text/javascript';

    document.body.appendChild(js);
}

var to_load = ["globals.js", "cell_table.js", "scrollbar.js", "canvas.js", "main.js"];
to_load.forEach(include);