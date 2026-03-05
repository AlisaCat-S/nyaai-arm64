const webpSupported = (function () {
  const elem = document.createElement('canvas')
  return elem.toDataURL('image/webp').indexOf('data:image/webp') === 0
}())

function imageFromFile(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

function encodeFromUint8ClampedArray(
  data: Uint8ClampedArray<ArrayBuffer>,
  width: number,
  height: number,
  quality = 0.8,
) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  canvas.width = width
  canvas.height = height
  const imgData = new ImageData(data, width, height)
  ctx.putImageData(imgData, 0, 0)

  return new Promise<Blob>((resolve) => {
    canvas.toBlob(blob => {
      resolve(blob!)
    }, webpSupported ? 'image/webp' : 'image/jpeg', quality)
  })
}

async function encodeFile(img, name, drawOptions, quality) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  const { sx, sy, sw, sh, dw, dh } = drawOptions
  canvas.width = dw
  canvas.height = dh
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh)
  const type = webpSupported ? 'webp' : 'jpeg'
  return await new Promise<Blob>((resolve) => {
    canvas.toBlob(blob => {
      resolve(blob!)
    }, `image/${type}`, quality)
  }).then(blob => new File([blob], name.replace(/\.\w+$/, `.${type}`), { type: `image/${type}` }))
}

async function scaleImage(imageFile: File, maxPixelNum: number, quality = 0.8) {
  const img = await imageFromFile(imageFile)
  const ratio = img.height / img.width
  const dw = Math.min(img.width, Math.sqrt(maxPixelNum / ratio))
  const dh = dw * ratio
  return encodeFile(img, imageFile.name, { sx: 0, sy: 0, sw: img.width, sh: img.height, dw, dh }, quality)
}

async function cropSquareImage(imageFile: File, dSize: number, quality = 0.8) {
  const img = await imageFromFile(imageFile)
  const sSize = Math.min(img.width, img.height)
  return encodeFile(img, imageFile.name, { sx: 0, sy: 0, sw: sSize, sh: sSize, dw: dSize, dh: dSize }, quality)
}

async function resizeImage(imageFile: File, dw: number, dh: number, quality = 0.8) {
  const img = await imageFromFile(imageFile)
  return encodeFile(img, imageFile.name, { sx: 0, sy: 0, sw: img.width, sh: img.height, dw, dh }, quality)
}

export { webpSupported, cropSquareImage, encodeFromUint8ClampedArray, scaleImage, resizeImage }
