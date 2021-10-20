export const hexToRGB = (hex: string): number[] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null;
}

export const rgbDist = (a: number[], b: number[]): number => {
    const [ar, ag, ab] = a;
    const [br, bg, bb] = b;
    const rDiff = (ar - br);
    const gDiff = (ag - bg);
    const bDiff = (ab - bb);
    return Math.sqrt(rDiff ** 2 + gDiff ** 2 + bDiff ** 2);
}

const componentToHex = (comp: number): string => {
    const hex = comp.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  
export const rgbToHex = (rgb: number[]): string => {
    return "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
}