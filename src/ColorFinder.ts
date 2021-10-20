import { createCanvas, loadImage } from 'canvas';
import type { Canvas } from 'canvas';

import findCentroids from './findCentroids';
import { hexToRGB, hexArrToRGB, rgbDist, rgbToHex, rgbArrToHex } from './util';

type Layout = {
    x: number,
    y: number,
    width: number,
    height: number
};
type PixelData = { rgb?: number[][][], hex?: string[][] };
type Pos = { x: number, y: number };
class ColorFinder {

    rgb: number[][][];
    hex: string[][];
    width: number;
    height: number;

    constructor (pixelData: PixelData) {
        if (!pixelData.rgb && !pixelData.hex) {
            throw new Error('Invalid pixel data');
        } else if (pixelData.rgb && pixelData.hex) {
            this.rgb = pixelData.rgb;
            this.hex = pixelData.hex;
        } else if (pixelData.rgb) {
            this.rgb = pixelData.rgb;
            this.hex = rgbArrToHex(this.rgb);
        } else {
            this.hex = pixelData.hex;
            this.rgb = hexArrToRGB(this.hex);
        }
        this.width = this.rgb.length;
        this.height = this.rgb[0].length;    
    }

    static fromCanvas (canvas: Canvas): ColorFinder {
        const rgbArr: number[][][] = [];
        const context = canvas.getContext('2d');
        let x, y, imageData: ImageData, rgb: number[];
        for (x = 0; x < canvas.width; x++) {
            const rgbCol: number[][] = [];
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
    }

    static fromHexArray (hexArr: string[][]) {
        return new ColorFinder({ hex: hexArr });
    }

    static fromRGBArray (rgbArr: number[][][]) {
        return new ColorFinder({ rgb: rgbArr });
    }

    colorAtPos (x: number, y: number, layout: Layout): string {
        const { x: px, y: py } = this._toImgPos(x, y, layout);
        return this.hex[px][py];
    }

    colorAtPagePos (x: number, y: number, layout: Layout): string {
        const { x: px, y: py } = this._toImgPos(
            x - layout.x, 
            y - layout.y, 
            layout
        );
        return this.hex[px][py];
    }

    locateColor (color: string, layout: Layout): Pos {
        const { x, y } = this._nearestPixel(color);
        return this._toScaledPos(x, y, layout);
    }

    locateColorOnPage (color: string, layout: Layout): Pos {
        const { x, y } = this._nearestPixel(color);
        return this._toPagePos(x, y, layout);
    }

    mainColors (maxColors: number = 5): string[] {
        const flatColors: number[][] = [];
        let x, y;
        for (x = 0; x < this.width; x++) {
            for (y = 0; y < this.height; y++) {
                flatColors.push(this.rgb[x][y]);
            }
        }
        const centroids = findCentroids(
            flatColors, 
            maxColors * 2,
            maxColors,
            100
        );
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
        for (x = 0; x < this.width; x++) {
            for (y = 0; y < this.height; y++) {
                dist = rgbDist(rgb, this.rgb[x][y]);
                if (dist < minDist) {
                    minDist = dist;
                    nearestPixel = { x: x, y: y };
                }
            }
        }
        return nearestPixel;
    }

    _toImgPos (sx: number, sy: number, layout: Layout): Pos {
        const xScale = this.width === 0 ? 0 : layout.width / this.width;
        const yScale = this.height === 0 ? 0 : layout.height / this.height;
        let px, py;
        if (xScale === 0 || yScale === 0) {
            px = 0;
            py = 0;
        } else {
            px = Math.min(
                this.width - 1, 
                Math.max(
                    0,
                    Math.round(sx / xScale)
                ));
            py = Math.min(
                this.height - 1, 
                Math.max(
                    0,
                    Math.round(sy / yScale)
                ));
        }
        return { x: px, y: py };
    }

    _toPagePos (px: number, py: number, layout: Layout): Pos {
        const { x, y } = this._toScaledPos(px, py, layout);
        return { x: x + layout.x, y: y + layout.y };
    }

    _toScaledPos (px: number, py: number, layout: Layout): Pos {
        const xScale = this.width === 0 ? 0 : layout.width / this.width;
        const yScale = this.height === 0 ? 0 : layout.height / this.height;
        const dx = px * xScale;
        const dy = py * yScale;
        return { x: dx, y: dy };
    }
}

export default ColorFinder;