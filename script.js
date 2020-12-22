const Tesseract = require("tesseract.js");
const pdf2pic = require("pdf2pic");

const pdfToImage = async (filePath, filename) => {
  await pdf2pic.fromPath(filePath, {
    density: 300,
    saveFilename: filename,
    savePath: "./output",
    format: "png",
    width: 2480,
    height: 3508,
  })(1);

  return `${process.cwd()}/output/${filename}.1.png`;
};

const processPdf = async (filePath) => {
  const [filename, extension] = filePath.split("/").pop().split(".");
  const isPDF = extension === "pdf";
  let path = filePath;

  if (isPDF) {
    path = await pdfToImage(filePath, filename);
  }

  return new Promise((resolve, reject) => {
    Tesseract.recognize(path, "eng")
      .then(({ data: { text } }) => resolve(text))
      .catch(reject);
  });
};

processPdf("./invoice_2001321.pdf").then((text) => console.log(text));
processPdf("./invoice_2001321.png").then((text) => console.log(text));
