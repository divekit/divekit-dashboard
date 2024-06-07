import { Color } from "./colors";

export const ColorScheme = {
  commit: (amount: number) => [Color.noCommits, ...getGradient(Color.fewCommits, Color.mostCommits, amount)],
  progressBar: [Color.notStarted, ...getGradient(Color.started, Color.ninetyPercent, 3), Color.finished],
  progressLine: [Color.progressLine],
  testBar: [Color.notStarted, Color.finished]
}

export function getGradient(startColor: string, endColor: string, colorAmount: number) {
  const startColorDec = hexToRgb(startColor)
  const endColorDec = hexToRgb(endColor)

  if (startColorDec === null || endColorDec === null || colorAmount < 2) {
    return []
  }

  const rDiff = endColorDec.r - startColorDec.r
  const gDiff = endColorDec.g - startColorDec.g
  const bDiff = endColorDec.b - startColorDec.b

  const gradient: string[] = []

  for (let i = 0; i <= colorAmount - 1; i++) {
    gradient.push(rgbToHex(
      Math.round(startColorDec.r + rDiff * (i / (colorAmount - 1))), 
      Math.round(startColorDec.g + gDiff * (i / (colorAmount - 1))), 
      Math.round(startColorDec.b + bDiff * (i / (colorAmount - 1)))
    ))
  }

  return gradient
}

function hexToRgb(hex: string) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(r: number, g: number, b: number) {
  const hexTriple = [r.toString(16), g.toString(16), b.toString(16)]

  hexTriple.forEach((hex, index) => {
    if (hex.length === 1) {
      hexTriple[index] = "0" + hex
    }
  })

  return "#" + hexTriple.join("");
}