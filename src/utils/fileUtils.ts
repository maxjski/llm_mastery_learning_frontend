import * as pdfjsLib from 'pdfjs-dist'
import type { TextItem } from 'pdfjs-dist/types/src/display/api'

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.mjs'

export async function extractTextFromFile(file: File): Promise<string> {
  const fileType = file.type

  switch (fileType) {
    case 'application/pdf':
      return extractTextFromPDF(file)
    case 'text/plain':
    case 'text/markdown':
      return extractTextFromTextFile(file)
    default:
      throw new Error(`Unsupported file type: ${fileType}`)
  }
}

async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer()

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

    let fullText = ''

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .filter((item): item is TextItem => 'str' in item)
        .map(item => item.str)
        .join(' ')

      fullText += pageText + '\n'
    }

    return fullText.trim()
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error extracting text from PDF: ${error.message}`)
    }
    throw new Error('Error extracting text from PDF: Unknown error occurred')
  }
}

async function extractTextFromTextFile(file: File): Promise<string> {
  try {
    return await file.text()
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error reading text file: ${error.message}`)
    }
    throw new Error('Error reading text file: Unknown error occurred')
  }
}
