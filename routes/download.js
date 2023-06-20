var express = require("express");
var router = express.Router();
var fileURLToPath = require("url").fileURLToPath;
var path = require("path");


router.get("/download", (req, res) => {
    const filePath = path.join(
    __dirname,
    "../public/pdf/language-list.pdf"
    );
    res.download(filePath);
});

module.exports = router;
