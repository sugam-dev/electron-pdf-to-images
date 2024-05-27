const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const poppler = require('pdf-poppler');
const { v4: uuidv4 } = require('uuid');

async function convertPDFPagesToImages(pdfPath) {
  const pdfOutputDir = path.join(process.cwd(), '/public/documents');
  const imageOutputDir = path.join(process.cwd(), '/public/images');

  if (!fs.existsSync(pdfOutputDir)) {
    fs.mkdirSync(pdfOutputDir, { recursive: true });
  }

  const existingPdfBytes = fs.readFileSync(pdfPath);
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

  const pdfName = path.basename(pdfPath, path.extname(pdfPath));
  const pdfImageDir = path.join(imageOutputDir, pdfName);

  if (!fs.existsSync(pdfImageDir)) {
    fs.mkdirSync(pdfImageDir, { recursive: true });
  }

  const imagePaths = []; // Array to store paths of rendered images

  for (let i = 0; i < pdfDoc.getPageCount(); i++) {
    const page = pdfDoc.getPage(i);

    const uniqueName = uuidv4(); // Generate unique string
    const imageName = `${uniqueName}`;
    const imagePath = path.join(pdfImageDir, imageName);

    // Use pdf-poppler to render the page as an image
    await renderPDFPageToImage(pdfPath, i + 1, imagePath);

    imagePaths.push(`${imagePath}-${i+1}.jpg`); // Store the path of the rendered image
  }

  // Move the PDF file to the documents directory
  const pdfDestination = path.join(pdfOutputDir, path.basename(pdfPath));
  fs.copyFileSync(pdfPath, pdfDestination);

  return imagePaths; // Return paths of rendered images
}

async function renderPDFPageToImage(pdfPath, pageNumber, imagePath) {
  const options = {
    format: 'jpeg',
    out_dir: path.dirname(imagePath),
    out_prefix: path.basename(imagePath),
    page: pageNumber,
  };

console.log('options:',options);

  try {
    const result = await poppler.convert(pdfPath, options);
    if (!result) {
      console.log('Image rendered successfully!');
    }
  } catch (error) {
    console.error('Error rendering PDF page:', error);
  }
}

module.exports = convertPDFPagesToImages;
