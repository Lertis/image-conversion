import heic2any from 'heic2any'
import * as JSZip from 'jszip'
import { saveAs } from 'file-saver'

export async function convertHeicToType (files: File[], toType = 'image/jpeg'): Promise<Blob[]> {
  if (!files.length) return []

  const blobs: Blob[] = []
  for (let i = 0; i < files.length; i++) {
    const converted = await heic2any({ blob: files[i], toType }) as Blob
    blobs.push(converted)
  }
  return blobs
}

export function downloadZip (files: { name: string, blob: Blob }[]) {
  const zip = new JSZip()
  const imgFolder = zip.folder('images')

  const promises: Promise<void>[] = []

  files.forEach(({ blob, name }) => {
    const converted = new Promise<void>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        // Add converted JPG to the zip folder as binary data
        const jpgName = name.replace(/\.[^/.]+$/, '') + '.jpg'
        imgFolder?.file(jpgName, reader.result)
        resolve()
      }
      reader.onerror = (err) => {
        console.error(`Error reading blob for file ${name}:`, err)
        reject(err)
      }
      reader.readAsArrayBuffer(blob)
    })
    promises.push(converted)
  })

  // Once all images are converted and added to the ZIP
  Promise.all(promises)
    .then(() => {
      zip.generateAsync({ type: 'blob' })
        .then(content => { saveAs(content, 'converted-images.zip') })
        .catch(error => { console.error('Error generating ZIP:', error) })
    })
    .catch(error => { console.error('Error processing files:', error) })
}
