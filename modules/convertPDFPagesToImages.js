const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');
const poppler = require('pdf-poppler');
const { v4: uuidv4 } = require('uuid');

async function convertPDFPagesToImages(pdfPath, outputDir) {
  const pdfDoc = await PDFDocument.load(fs.readFileSync(pdfPath));

  const pdfName = path.basename(pdfPath, path.extname(pdfPath));
  console.log('pdfName: ', pdfName);
  console.log('outputDir: ', outputDir);
  const pdfImageDir = path.join(outputDir, pdfName);
  console.log('pdfImageDir: ', pdfImageDir);

  if (!fs.existsSync(pdfImageDir)) {
    fs.mkdirSync(pdfImageDir, { recursive: true });
  }

  const imagePaths = []; // Array to store paths of rendered images

  for (let i = 0; i < pdfDoc.getPageCount(); i++) {
    const uniqueName = uuidv4(); // Generate unique string
    const imageName = `${uniqueName}.jpg`;
    const imagePath = path.join(pdfImageDir, imageName);
    const pageNumber = i + 1;

    // Pass pdfImageDir as outputDir to renderPDFPageToImage
    await renderPDFPageToImage(pdfPath, pageNumber, imagePath);

    imagePaths.push(imagePath); // Store the path of the rendered image
  }

  return imagePaths; // Return paths of rendered images
}

async function renderPDFPageToImage(pdfPath, pageNumber, imagePath) {
  const options = {
    format: 'jpeg',
    out_dir: path.dirname(imagePath),
    out_prefix: path.basename(imagePath, path.extname(imagePath)),
    page: pageNumber,
  };

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
