"use strict";
exports.__esModule = true;
var canvas_1 = require("canvas");
var node_vibrant_1 = require("node-vibrant");
var ColorFinder = /** @class */ (function () {
    function ColorFinder(src, canvas, mainColors) {
        this.src = src;
        this.canvas = canvas;
        this.mainColors = mainColors;
        this.pixels = [];
        var context = this.canvas.getContext('2d');
        var x, y, imageData, hex;
        for (x = 0; x < this.canvas.width; x++) {
            var column = [];
            for (y = 0; y < this.canvas.height; y++) {
                imageData = context.getImageData(x, y, 1, 1);
                hex = this._toHex(imageData[0], imageData[1], imageData[2]);
                column.push(hex);
            }
            this.pixels.push(column);
        }
    }
    ColorFinder.prototype._hexDist = function (a, b) {
        return this._rgbDist(this._toRGB(a), this._toRGB(b));
    };
    ColorFinder.prototype._nearestPixel = function (color) {
        var minDist = 10000;
        var nearestPixel = { x: 0, y: 0 };
        var x, y, dist;
        for (x = 0; x < this.canvas.width; x++) {
            for (y = 0; y < this.canvas.height; y++) {
                dist = this._hexDist(color, this.pixels[x][y]);
                if (dist < minDist) {
                    minDist = dist;
                    nearestPixel = { x: x, y: y };
                }
            }
        }
        return nearestPixel;
    };
    ColorFinder.prototype._toDisplayPos = function (px, py, layout) {
        var xScale = this.canvas.width === 0 ? 0 : layout.width / this.canvas.width;
        var yScale = this.canvas.height === 0 ? 0 : layout.height / this.canvas.height;
        var dx = px * xScale;
        var dy = py * yScale;
        return { x: dx, y: dy };
    };
    ColorFinder.prototype._toHex = function (r, g, b) {
        return ((r << 16) | (g << 8) | b).toString(16).slice(-6);
    };
    ColorFinder.prototype._toImgPos = function (dx, dy, layout) {
        var xScale = this.canvas.width === 0 ? 0 : layout.width / this.canvas.width;
        var yScale = this.canvas.height === 0 ? 0 : layout.height / this.canvas.height;
        var px = xScale === 0 ? 0 : (dx - layout.left) / xScale;
        var py = yScale === 0 ? 0 : (dy - layout.top) / yScale;
        return { x: px, y: py };
    };
    ColorFinder.prototype._toRGB = function (hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };
    ColorFinder.prototype._rgbDist = function (a, b) {
        var rDiff = (a.r - b.r);
        var gDiff = (a.g - b.g);
        var bDiff = (a.b - b.b);
        return Math.sqrt(Math.pow(rDiff, 2) + Math.pow(gDiff, 2) + Math.pow(bDiff, 2));
    };
    ColorFinder.prototype.colorAtPos = function (x, y, layout) {
        var _a = this._toImgPos(x, y, layout), px = _a.x, py = _a.y;
        return this.pixels[px][py];
    };
    ColorFinder.prototype.locateColor = function (color, layout) {
        var _a = this._nearestPixel(color), px = _a.x, py = _a.y;
        return this._toDisplayPos(px, py, layout);
    };
    return ColorFinder;
}());
var createColorFinder = function (src, maxColors) {
    if (maxColors === void 0) { maxColors = 5; }
    var canvas = canvas_1.loadImage(src)
        .then(function (image) {
        var canvas = canvas_1.createCanvas(image.width, image.height);
        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        return canvas;
    });
    var mainColors = node_vibrant_1["default"].from(src)
        .maxColorCount(maxColors)
        .getSwatches()
        .then(function (swatches) {
        var colors = [];
        for (var swatch in swatches) {
            colors.push(swatches[swatch].hex);
        }
        return colors;
    });
    return Promise.all([canvas, mainColors])
        .then(function (_a) {
        var canvas = _a[0], mainColors = _a[1];
        return new ColorFinder(src, canvas, mainColors);
    });
};
exports.ColorFinder = ColorFinder;
exports.createColorFinder = createColorFinder;
