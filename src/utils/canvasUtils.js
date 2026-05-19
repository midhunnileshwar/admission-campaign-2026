import { unicodeToLegacy } from './unicodeToLegacy'

export const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

export async function getCroppedImg(
  imageSrc,
  pixelCrop,
  templateSrc,
  nameConfig = { showName: false, studentName: '', fontSize: 60, nameX: 768, nameY: 1520, textColor: '#000000' }
) {
  const image = await createImage(imageSrc)
  const templateImage = await createImage(templateSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return null
  }

  // The template is our final output size (1536x2572)
  canvas.width = templateImage.width
  canvas.height = templateImage.height

  // 1. Draw the user photo based on the crop data
  // Bounding box of the transparent region in Base.png:
  const holeX = 319
  const holeY = 680
  const holeWidth = 899
  const holeHeight = 796

  // Draw the relevant part of the user image (pixelCrop) into the hole area
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    holeX,
    holeY,
    holeWidth,
    holeHeight
  )

  // 2. Draw the transparent template OVER the user photo
  ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height)

  // 3. Draw the student's name in Malayalam on top of the template
  if (nameConfig.showName && nameConfig.studentName) {
    const asciiName = unicodeToLegacy(nameConfig.studentName)
    
    // Ensure font is ready in browser before drawing to canvas
    // Wait, the font family used is 'ML-KV-Shamitha-H'
    ctx.font = `${nameConfig.fontSize}px 'ML-KV-Shamitha-H'`
    ctx.fillStyle = nameConfig.textColor
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    
    // Draw white stroke outline first for excellent readability on any background
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = nameConfig.fontSize * 0.15
    ctx.lineJoin = 'round'
    ctx.miterLimit = 2
    ctx.strokeText(asciiName, nameConfig.nameX, nameConfig.nameY)
    
    // Draw solid filled text
    ctx.fillText(asciiName, nameConfig.nameX, nameConfig.nameY)
  }

  // As a blob
  return new Promise((resolve, reject) => {
    canvas.toBlob((file) => {
      resolve(URL.createObjectURL(file))
    }, 'image/png')
  })
}
