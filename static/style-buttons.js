var releasedStyle = 'box-shadow: insert, black; '+
                    'background: linear-gradient(to bottom, #F0EEE2  5%, #99ADB4 100%);'+
                    'background-color: white;';
var pressedStyle = 'background: black;'+
                   'background-color: #99ADB4;'+
                   'top:1px; position: relative;';
bold.addEventListener("click", function(event) {
    bold.style = (bold.style.top == '1px') ? releasedStyle : pressedStyle;
    currentStyle += currentStyle & 1 == true ? -1: 1;
});
italic.addEventListener("click", function(event) {
    italic.style = (italic.style.top == '1px') ? releasedStyle : pressedStyle;
    currentStyle += currentStyle & 2 == true ? -2: 2;
});
underline.addEventListener("click", function(event) {
    underline.style = (underline.style.top == '1px') ? releasedStyle : pressedStyle;
    currentStyle += 4;
});
strike.addEventListener("click", function(event) {
    strike.style = (strike.style.top == '1px') ? releasedStyle : pressedStyle;
    currentStyle += 8;
});

function decodeStyle(styleVal) {
    var style = "";

    if(styleVal & 1) {
        style += "bold ";
    }
    if(styleVal & 2) {
        style += "italic ";
    }
    if(styleVal == 0) {
        style = "normal ";
    }

    return style;
}