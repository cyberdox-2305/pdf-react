const express = require("express");
const multer = require("multer");
const { PDFDocument } = require("pdf-lib");
const fs = require("fs");
const cors = require("cors");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());

app.post("/convert", upload.array("images"), async (req, res) => {
  try {
    const pdfDoc = await PDFDocument.create();

    for (const file of req.files) {
      const imageBytes = fs.readFileSync(file.path);
      let img;
      if (file.mimetype === "image/jpeg") {
        img = await pdfDoc.embedJpg(imageBytes);
      } else if (file.mimetype === "image/png") {
        img = await pdfDoc.embedPng(imageBytes);
      } else {
        continue;
      }

      const page = pdfDoc.addPage([img.width, img.height]);
      page.drawImage(img, {
        x: 0,
        y: 0,
        width: img.width,
        height: img.height,
      });

      fs.unlinkSync(file.path);
    }

    const pdfBytes = await pdfDoc.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=converted.pdf");
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error(error);
    res.status(500).send("Error converting images to PDF");
  }
});

app.listen(5000, () => {
  console.log("✅ Backend running on http://localhost:5000");
});
