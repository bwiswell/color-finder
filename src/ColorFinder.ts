import { createCanvas, loadImage } from 'canvas';
import type { Canvas } from 'canvas';

import findCentroids from './findCentroids';
import { hexToRGB, rgbDist, rgbToHex } from './util';

type Layout = {
    left: number,
    top: number,
    width: number,
    height: number
};
type Pos = { x: number, y: number };

class ColorFinder {

    src: string;
    canvas: Canvas;
    rgb: number[][][];
    hex: string[][];
    mainColors: string[];

    constructor (canvas: Canvas, maxColors: number = 5) {
        this.canvas = canvas;
        this.rgb = [];
        this.hex = [];
        const context = this.canvas.getContext('2d');
        let x, y, imageData, rgb, hex;
        for (x = 0; x < this.canvas.width; x++) {
            const rgbCol: number[][] = [];
            const hexCol: string[] = []
            for (y = 0; y < this.canvas.height; y++) {
                imageData = context.getImageData(x, y, 1, 1);
                rgb = [imageData[0], imageData[1], imageData[2]];
                rgbCol.push(rgb);
                hex = rgbToHex(rgb);
                hexCol.push(hex);
            }
            this.rgb.push(rgbCol);
            this.hex.push(hexCol);
        }

        this.mainColors = this._mainColors(maxColors);
    }

    _mainColors (maxColors: number): string[] {
        const flatColors: number[][] = [];
        let x, y;
        for (x = 0; x < this.canvas.width; x++) {
            for (y = 0; y < this.canvas.height; y++) {
                flatColors.push(this.rgb[x][y]);
            }
        }
        const centroids = findCentroids(flatColors, maxColors);
        const mainColors: string[] = [];
        for (let i = 0; i < centroids.length; i++) {
            mainColors.push(rgbToHex([
                Math.trunc(centroids[i][0]),
                Math.trunc(centroids[i][1]),
                Math.trunc(centroids[i][2])
            ]));
        }
        return mainColors;
    }

    _nearestPixel (color: string): Pos {
        const rgb = hexToRGB(color);
        let minDist = 10000;
        let nearestPixel = { x: 0, y: 0 };
        let x, y, dist;
        for (x = 0; x < this.canvas.width; x++) {
            for (y = 0; y < this.canvas.height; y++) {
                dist = rgbDist(rgb, this.rgb[x][y]);
                if (dist < minDist) {
                    minDist = dist;
                    nearestPixel = { x: x, y: y };
                }
            }
        }
        return nearestPixel;
    }

    _toDisplayPos (px: number, py: number, layout: Layout): Pos {
        const xScale = this.canvas.width === 0 ? 0 : layout.width / this.canvas.width;
        const yScale = this.canvas.height === 0 ? 0 : layout.height / this.canvas.height;
        const dx = px * xScale;
        const dy = py * yScale;
        return { x: dx, y: dy };
    }

    _toImgPos (dx: number, dy: number, layout: Layout): Pos {
        const xScale = this.canvas.width === 0 ? 0 : layout.width / this.canvas.width;
        const yScale = this.canvas.height === 0 ? 0 : layout.height / this.canvas.height;
        const px = xScale === 0 ? 0 : (dx - layout.left) / xScale;
        const py = yScale === 0 ? 0 : (dy - layout.top) / yScale;
        return { x: px, y: py };
    }

    colorAtPos (x: number, y: number, layout: Layout): string {
        const { x: px, y: py } = this._toImgPos(x, y, layout);
        return this.hex[px][py];
    }

    locateColor (color: string, layout: Layout): Pos {
        const { x: px, y: py } = this._nearestPixel(color);
        return this._toDisplayPos(px, py, layout);
    }
}

export default ColorFinder;