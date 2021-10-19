import { createCanvas, loadImage } from 'canvas';
import Vibrant from 'node-vibrant';

import type { Canvas } from 'canvas';

type Layout = {
    left: number,
    top: number,
    width: number,
    height: number
};
type Pos = { x: number, y: number };
type RGB = { r: number, g: number, b: number };

class ColorFinder {

    src: string;
    canvas: Canvas;
    mainColors: string[];
    pixels: string[][];

    constructor (src: string, canvas: Canvas, mainColors: string[]) {
        this.src = src;
        this.canvas = canvas;
        this.mainColors = mainColors;

        this.pixels = [];
        const context = this.canvas.getContext('2d');
        let x, y, imageData, hex;
        for (x = 0; x < this.canvas.width; x++) {
            const column: string[] = []
            for (y = 0; y < this.canvas.height; y++) {
                imageData = context.getImageData(x, y, 1, 1);
                hex = this._toHex(imageData[0], imageData[1], imageData[2]);
                column.push(hex);
            }
            this.pixels.push(column);
        }
    }

    _hexDist (a: string, b: string): number {
        return this._rgbDist(this._toRGB(a), this._toRGB(b));
    }

    _nearestPixel (color: string): Pos {
        let minDist = 10000;
        let nearestPixel = { x: 0, y: 0 };
        let x, y, dist;
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
    }

    _toScaledPos (px: number, py: number, layout: Layout): Pos {
        const xScale = this.canvas.width === 0 ? 0 : layout.width / this.canvas.width
        const yScale = this.canvas.height === 0 ? 0 : layout.height / this.canvas.height
        const dx = px * xScale
        const dy = py * yScale
        return { x: dx, y: dy }
    }

    _toHex (r: number, g: number, b: number): string {
        return ((r << 16) | (g << 8) | b).toString(16).slice(-6);
    }

    _toImgPos (dx: number, dy: number, layout: Layout): Pos {
        const xScale = this.canvas.width === 0 ? 0 : layout.width / this.canvas.width
        const yScale = this.canvas.height === 0 ? 0 : layout.height / this.canvas.height
        const px = xScale === 0 ? 0 : (dx - layout.left) / xScale
        const py = yScale === 0 ? 0 : (dy - layout.top) / yScale
        return { x: px, y: py }
    }

    _toRGB (hex: string): RGB {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
    }

    _rgbDist (a: RGB, b: RGB): number {
        const rDiff = (a.r - b.r);
        const gDiff = (a.g - b.g);
        const bDiff = (a.b - b.b);
        return Math.sqrt(rDiff ** 2 + gDiff ** 2 + bDiff ** 2);
    }

    colorAtPos (x: number, y: number, layout: Layout): string {
        const { x: px, y: py } = this._toImgPos(x, y, layout);
        return this.pixels[x][y];
    }

    locateColor (color: string, layout: Layout): Pos {
        const { x: px, y: py } = this._nearestPixel(color);
        return this._toScaledPos(px, py, layout);
    }
}

const createColorFinder = (src: string, maxColors: number = 5): Promise<ColorFinder> => {
    const canvas = loadImage(src)
        .then(image => {
            const canvas = createCanvas(image.width, image.height);
            const context = canvas.getContext('2d');
            context.drawImage(image, 0, 0);
            return canvas;
        })

    const mainColors = Vibrant.from(src)
        .maxColorCount(maxColors)
        .getSwatches()
        .then(swatches => {
            const colors: string[] = [];
            for (let swatch in swatches) {
                colors.push(swatches[swatch].hex);
            }
            return colors;
        })

    return Promise.all([canvas, mainColors])
        .then(([canvas, mainColors]) => {
            return new ColorFinder(src, canvas, mainColors);
        })
}


exports.ColorFinder = ColorFinder;
exports.createColorFinder = createColorFinder;