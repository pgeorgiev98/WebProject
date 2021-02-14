var releasedStyle = 'box-shadow: insert, black; '+
                    'background: linear-gradient(to bottom, #F0EEE2  5%, #99ADB4 100%);'+
                    'background-color: white;';
var pressedStyle = 'background: black;'+
                   'background-color: #99ADB4;'+
                   'top:1px; position: relative;';

bold.addEventListener("click", function() {
    table.onFocus.style ^= 1;
    onStyleButtonClicked();
});
italic.addEventListener("click", function() {
    table.onFocus.style ^= 2;
    onStyleButtonClicked();
});
underline.addEventListener("click", function() {
    table.onFocus.style ^= 4;
    onStyleButtonClicked();
});
strike.addEventListener("click", function() {
    table.onFocus.style ^= 8;
    onStyleButtonClicked();
});

left.addEventListener("click", function() {
    table.onFocus.style |= 16;
    table.onFocus.style &= ~(32);
    onStyleButtonClicked();
});
center.addEventListener("click", function() {
    table.onFocus.style &= ~(16);
    table.onFocus.style &= ~(32);
    onStyleButtonClicked();
});
right.addEventListener("click", function() {
    table.onFocus.style |= 32;
    table.onFocus.style &= ~(16);
    onStyleButtonClicked();
});

cpb.addEventListener("change", function() {
    table.onFocus.background = cpb.value;
    table.update();
    table.onFocus.saveCell();
});

cpf.addEventListener("change", function() {
    table.onFocus.color = cpf.value;
    table.update();
    table.onFocus.saveCell();
});

function decodeStyle(styleVal) {
    var style = "";

    if(styleVal & 1) {
        style += "bold ";
    }
    if(styleVal & 2) {
        style += "italic ";
    }
    if(style.length == 0) {
        style = "";
    }

    return style;
}

function decodeAlign(alignVal) {
    var align = "";

    if(alignVal & 16) {
        align = "left";
    }
    else if(alignVal & 32) {
        align = "right";
    }
    else {
        align = "center";
    }

    return align;
}

function clickOnFocusStyles() {
    var style = table.onFocus.style;
    var cellStyle = decodeStyle(style);
    var cellAlign = decodeAlign(style);

    var styles = ["bold", "italic"];
    var aligns = ["right", "center", "left"];
    styles.map(st => pressStyleButton(cellStyle.split(" ").includes(st), st));
    aligns.map(al => pressStyleButton(cellAlign.split(" ").includes(al), al));

    pressStyleButton((style & 4), "underline");
    pressStyleButton((style & 8), "strike");

    cpb.value = table.onFocus.background;
    cpf.value = table.onFocus.color;
}

function pressStyleButton(press, button) {
    if (button.length != 0) {
        button = eval(button);
    }
    else {
        return;
    }

    button.style = press ? pressedStyle : releasedStyle;
}

function onStyleButtonClicked() {
    document.getElementById("input-value").focus();
    clickOnFocusStyles();
    table.update();
    table.onFocus.saveCell();
}