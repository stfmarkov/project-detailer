import { PDFParse } from 'pdf-parse'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { pdfBase64 } = body

  if (!pdfBase64) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required field: pdfBase64'
    })
  }

  try {
    // Decode base64 to buffer
    const pdfBuffer = Buffer.from(pdfBase64, 'base64')
    
    // Parse PDF using pdf-parse v2 API
    const parser = new PDFParse({ data: pdfBuffer })
    const result = await parser.getText()

    return {
      success: true,
      text: result.text,
      numPages: result.total
    }
  } catch (error: any) {
    console.error('PDF parsing error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to parse PDF'
    })
  }
})

