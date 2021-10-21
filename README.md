# color-finder

## Setup

### Installation

- **With Yarn**

    ```yarn add bwiswell/color-finder```

- **With NPM**

    ```npm install bwiswell/color-finder```

### Import `ColorFinder`

```js
import ColorFinder from 'color-finder'
```

## Usage

### Creating the `ColorFinder`

- **React Web**

    Draw the image onto a canvas and use the `fromCanvas` method to create the `ColorFinder`.

    ```js
    const [colorFinder, setColorFinder] = useState(null);

    const createColorFinder = () => {
        const image = document.getElementById('my-image'); // get your image element
        image.crossOrigin = 'anonymous'; // this might help with some images
        image.onload = () => { // wait until the image is loaded to draw
            const canvas = createCanvas(image.width, image.height);
            canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
            const colorFinder = ColorFinder.fromCanvas(canvas);
            setColorFinder(colorFinder);
        }
    ```

- **React Native**

    The `Canvas` object is not available in React Native. There are two alternative ways to create the `ColorFinder` object in React Native:

    - Array of RGB values

        The `fromRGBArray` method can be used to create the `ColorFinder` object with 3D array of RGB color values. The type of the JavaScript array should be `number[][][]`, where `rgbArray[x][y][c]` is the value of color channel *c* at pixel (*x*, *y*) in the image.

        ```js
        const [colorFinder, setColorFinder] = useState(null);

        const createColorFinder = () => {
            const rgbArray = ...; // get your RGB array from the image
            const colorFinder = ColorFinder.fromRGBArray(rgbArray);
            setColorFinder(colorFinder);
        }
        ```

    - Array of hex values

        The `fromHexArray` method can be used in the same way as the `fromRGBArray` method, except with hex color values instead of RGB values. The hex array should be a 2D array of type `string[][]`, where `hexArray[x][y]` is the hex color value at pixel (*x*, *y*) in the image.

A new `ColorFinder` object should be created for each new image.

### Getting the `Layout`

Several methods require a `layout` parameter. The layout type is defined as:

```js
type Layout = {
    x: number,
    y: number,
    width: number,
    height: number
}
```

For React Web use `getBoundingClientRect`, and for React Native use the `onLayout` prop.

- **React Web**

    ```js
    const img = document.getElementById('my-image');
    const layout = img.getBoundingClientRect();
    ```

- **React Native**

    ```js
    const [layout, setLayout] = useState({});
    ...
    return (
        ...
            <Image onLayout={e => setLayout(e.nativeEvent.layout)}>
        ...
    )

### `ColorFinder` API Reference
---
`colorAtPos(x: number, y: number, layout: Layout) => string`

Returns the color of the pixel at (*x*, *y*) as a hex color string. *x* and *y* are relative to the image element (`clientX`/`clientY` in a web `MouseEvent` or `locationX`/`locationY` in a React Native `PressEvent`).

---
`colorAtPagePos(x: number, y: number, layout: Layout) => string`

Returns the color of the pixel at (*x*, *y*) as a hex color string. *x* and *y* are relative to the entire page (`pageX`/`pageY` in a web `MouseEvent` or a React Native `PressEvent`).

---
`locateColor(color: string, layout: Layout) => { x: number, y: number }`

Returns the location of the closest matching pixel to the provided hex color. The returned location is relative to the image element.

---
`locateColorOnPage(color: string, layout: Layout) => { x: number, y: number }`

Returns the location of the closest matching pixel to the provided hex color. The returned location is relative to the entire page.

---
`mainColors(maxColors: number = 5) => string[]`

Returns the main colors found in the image as an array of hex strings. The `maxColors` parameter controls how many colors will be extracted; the default value is 5.