var div = document.getElementById("table-container");
var canvas = document.getElementById("canvas");
var input = document.getElementById("input-value");
var ctx = canvas.getContext("2d");

var bold = document.getElementById("bold-button");
var italic = document.getElementById("italic-button");
var underline = document.getElementById("underline-button");
var strike = document.getElementById("strikethrough-button");

var left = document.getElementById("align-left");
var center = document.getElementById("align-center");
var right = document.getElementById("align-right");

var cpb = document.getElementById("colorPickerBg");
var cpf = document.getElementById("colorPickerFg");

var cellHeight = 30;
var cellWidth = 80;

var firstRow = 0;
var firstColumn = 0;

const blue_accent_color = "#2196f3";
const header_accent_color = "#2196f3";
const header_color = "#eceff1";
