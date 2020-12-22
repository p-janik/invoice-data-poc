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

const regex = /ust|Steuernummer/gi;

const extractVatId = (text) => {
  return text
    .split("\n")
    .filter((line) => line.match(regex))
    .map((line) => {
      const index = line.match(regex).index;
      return line.substr(index).match(/\d+/)[0];
    });
};

processPdf("./4854976e-a1a6-4171-b975-a97b537afd54.pdf").then((text) =>
  console.log(extractVatId(text))
);
// processPdf("./invoice_2001321.png").then((text) =>
//   console.log(extractVatId(text))
// );
