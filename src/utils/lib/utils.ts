import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDominantColor(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve("#e0e0e0");
        return;
      }

      ctx.drawImage(img, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Get average color
      let r = 0,
        g = 0,
        b = 0;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }

      const pixelCount = data.length / 4;
      r = Math.round(r / pixelCount);
      g = Math.round(g / pixelCount);
      b = Math.round(b / pixelCount);

      // Convert to hex
      const toHex = (n: number) => {
        const hex = n.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      };

      const color = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
      resolve(color);
    };

    img.onerror = () => resolve("#e0e0e0");
    img.src = imageUrl;
  });
}

export function lightenColor(hex: string, percent: number = 50): string {
  hex = hex.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const lighten = (value: number) => {
    return Math.round(value + (255 - value) * (percent / 100));
  };

  const toHex = (value: number) => {
    const hex = value.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(lighten(r))}${toHex(lighten(g))}${toHex(lighten(b))}`;
}

import { useState, useEffect } from "react";

export function useImageColor(imageUrl: string) {
  const [color, setColor] = useState("#e0e0e0");

  useEffect(() => {
    getDominantColor(imageUrl).then((dominantColor) => {
      const lightColor = lightenColor(dominantColor, 90);
      setColor(lightColor);
    });
  }, [imageUrl]);

  return color;
}
