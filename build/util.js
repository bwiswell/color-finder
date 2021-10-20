"use strict";
exports.__esModule = true;
exports.rgbArrToHex = exports.rgbToHex = exports.rgbDist = exports.hexArrToRGB = exports.hexToRGB = void 0;
var hexToRGB = function (hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
};
exports.hexToRGB = hexToRGB;
var hexArrToRGB = function (hexArr) {
    var rgbArr = [];
    hexArr.forEach(function (hexCol) {
        var rgbCol = [];
        hexCol.forEach(function (hex) { return rgbCol.push(exports.hexToRGB(hex)); });
        rgbArr.push(rgbCol);
    });
    return rgbArr;
};
exports.hexArrToRGB = hexArrToRGB;
var rgbDist = function (a, b) {
    var ar = a[0], ag = a[1], ab = a[2];
    var br = b[0], bg = b[1], bb = b[2];
    var rDiff = (ar - br);
    var gDiff = (ag - bg);
    var bDiff = (ab - bb);
    return Math.sqrt(Math.pow(rDiff, 2) + Math.pow(gDiff, 2) + Math.pow(bDiff, 2));
};
exports.rgbDist = rgbDist;
var componentToHex = function (comp) {
    var hex = comp.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
};
var rgbToHex = function (rgb) {
    return "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
};
exports.rgbToHex = rgbToHex;
var rgbArrToHex = function (rgbArr) {
    var hexArr = [];
    rgbArr.forEach(function (rgbCol) {
        var hexCol = [];
        rgbCol.forEach(function (rgb) { return hexCol.push(exports.rgbToHex(rgb)); });
        hexArr.push(hexCol);
    });
    return hexArr;
};
exports.rgbArrToHex = rgbArrToHex;
