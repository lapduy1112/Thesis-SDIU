const cloudinary = require("cloudinary").v2;
const express = require("express");
const router = express.Router();
const cloud = require("../middlewares/cloudinary");

router.post("/upload", cloud.single("image"), async (req, res) => {
  try {
    const { originalname, mimetype, size, path, filename } = req.file;
    res.status(200).json({
      path,
      filename,
      cloudinary_url: req.file.path,
    });
  } catch (e) {
    res.status(500).json({ error: "Error uploading image." });
  }
});

router.delete("/delete/:public_id", async (req, res) => {
  try {
    const public_id = req.params.public_id;

    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result === "ok") {
      res.json({ message: "Image deleted successfully." });
    } else {
      res.status(500).json({ error: "Error deleting image." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting image." });
  }
});

module.exports = router;
