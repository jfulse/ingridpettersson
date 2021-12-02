type ImagePixels = { height: number; width: number; data: Uint8ClampedArray };

declare module "image-pixels" {
  type GetImagePixels = (src: string) => Promise<ImagePixels>;
  const getImagePixels: GetImagePixels;

  export default getImagePixels;
}

declare module "image-palette" {
  type RGBA = [number, number, number, number];
  type ImagePalette = { ids: number[]; colors: RGBA[]; amount: number[] };
  type GetImagePalette = (pixels: ImagePixels, count = 5) => ImagePalette;
  const getImagePalette: GetImagePalette;

  export type { RGBA };
  export default getImagePalette;
}
