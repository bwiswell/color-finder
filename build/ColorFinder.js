"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var findCentroids_1 = __importDefault(require("./findCentroids"));
var util_1 = require("./util");
var ColorFinder = /** @class */ (function () {
    function ColorFinder(pixelData) {
        this.mainColors = this._mainColors.bind(this);
        if (!pixelData.rgb && !pixelData.hex) {
            throw new Error('Invalid pixel data');
        }
        else if (pixelData.rgb && pixelData.hex) {
            this.rgb = pixelData.rgb;
            this.hex = pixelData.hex;
        }
        else if (pixelData.rgb) {
            this.rgb = pixelData.rgb;
            this.hex = util_1.rgbArrToHex(this.rgb);
        }
        else {
            this.hex = pixelData.hex;
            this.rgb = util_1.hexArrToRGB(this.hex);
        }
        this.width = this.rgb.length;
        this.height = this.rgb[0].length;
    }
    ColorFinder.fromCanvas = function (canvas) {
        var rgbArr = [];
        var context = canvas.getContext('2d');
        var x, y, imageData, rgb;
        for (x = 0; x < canvas.width; x++) {
            var rgbCol = [];
            for (y = 0; y < canvas.height; y++) {
                imageData = context.getImageData(x, y, 1, 1);
                rgb = [
                    imageData.data[0],
                    imageData.data[1],
                    imageData.data[2]
                ];
                rgbCol.push(rgb);
            }
            rgbArr.push(rgbCol);
        }
        return new ColorFinder({ rgb: rgbArr });
    };
    ColorFinder.fromHexArray = function (hexArr) {
        return new ColorFinder({ hex: hexArr });
    };
    ColorFinder.fromRGBArray = function (rgbArr) {
        return new ColorFinder({ rgb: rgbArr });
    };
    ColorFinder.prototype.colorAtPos = function (x, y, layout) {
        var _a = this._toImgPos(x, y, layout), px = _a.x, py = _a.y;
        return this.hex[px][py];
    };
    ColorFinder.prototype.colorAtPagePos = function (x, y, layout) {
        var _a = this._toImgPos(x - layout.x, y - layout.y, layout), px = _a.x, py = _a.y;
        return this.hex[px][py];
    };
    ColorFinder.prototype.locateColor = function (color, layout) {
        var _a = this._nearestPixel(color), x = _a.x, y = _a.y;
        return this._toScaledPos(x, y, layout);
    };
    ColorFinder.prototype.locateColorOnPage = function (color, layout) {
        var _a = this._nearestPixel(color), x = _a.x, y = _a.y;
        return this._toPagePos(x, y, layout);
    };
    ColorFinder.prototype._mainColors = function (maxColors) {
        if (maxColors === void 0) { maxColors = 5; }
        var flatColors = [];
        var x, y;
        for (x = 0; x < this.width; x++) {
            for (y = 0; y < this.height; y++) {
                flatColors.push(this.rgb[x][y]);
            }
        }
        var centroids = findCentroids_1["default"](flatColors, maxColors, maxColors, 100);
        var mainColors = [];
        for (var i = 0; i < centroids.length; i++) {
            mainColors.push(util_1.rgbToHex([
                Math.trunc(centroids[i][0]),
                Math.trunc(centroids[i][1]),
                Math.trunc(centroids[i][2])
            ]));
        }
        return mainColors;
    };
    ColorFinder.prototype._nearestPixel = function (color) {
        var rgb = util_1.hexToRGB(color);
        var minDist = 10000;
        var nearestPixel = { x: 0, y: 0 };
        var x, y, dist;
        for (x = 0; x < this.width; x++) {
            for (y = 0; y < this.height; y++) {
                dist = util_1.rgbDist(rgb, this.rgb[x][y]);
                if (dist < minDist) {
                    minDist = dist;
                    nearestPixel = { x: x, y: y };
                }
            }
        }
        return nearestPixel;
    };
    ColorFinder.prototype._toImgPos = function (sx, sy, layout) {
        var xScale = this.width === 0 ? 0 : layout.width / this.width;
        var yScale = this.height === 0 ? 0 : layout.height / this.height;
        var px, py;
        if (xScale === 0 || yScale === 0) {
            px = 0;
            py = 0;
        }
        else {
            px = Math.min(this.width - 1, Math.max(0, Math.round(sx / xScale)));
            py = Math.min(this.height - 1, Math.max(0, Math.round(sy / yScale)));
        }
        return { x: px, y: py };
    };
    ColorFinder.prototype._toPagePos = function (px, py, layout) {
        var _a = this._toScaledPos(px, py, layout), x = _a.x, y = _a.y;
        return { x: x + layout.x, y: y + layout.y };
    };
    ColorFinder.prototype._toScaledPos = function (px, py, layout) {
        var xScale = this.width === 0 ? 0 : layout.width / this.width;
        var yScale = this.height === 0 ? 0 : layout.height / this.height;
        var dx = px * xScale;
        var dy = py * yScale;
        return { x: dx, y: dy };
    };
    return ColorFinder;
}());
exports["default"] = ColorFinder;
