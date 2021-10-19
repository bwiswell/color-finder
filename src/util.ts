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

export const rgbToHex = (rgb: number[]): string => {
    return ((rgb[0] << 16) | (rgb[1] << 8) | rgb[2]).toString(16).slice(-6);
}