"use strict";
exports.__esModule = true;
exports.rgbToHex = exports.rgbDist = exports.hexToRGB = void 0;
var hexToRGB = function (hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
};
exports.hexToRGB = hexToRGB;
var rgbDist = function (a, b) {
    var ar = a[0], ag = a[1], ab = a[2];
    var br = b[0], bg = b[1], bb = b[2];
    var rDiff = (ar - br);
    var gDiff = (ag - bg);
    var bDiff = (ab - bb);
    return Math.sqrt(Math.pow(rDiff, 2) + Math.pow(gDiff, 2) + Math.pow(bDiff, 2));
};
exports.rgbDist = rgbDist;
var rgbToHex = function (rgb) {
    return ((rgb[0] << 16) | (rgb[1] << 8) | rgb[2]).toString(16).slice(-6);
};
exports.rgbToHex = rgbToHex;
