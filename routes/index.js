var express = require("express");
var router = express.Router();
var promises = require("fs/promises");
var path = require("path");
var fs = require("fs");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

async function getFiles(dirPath, files) {
  const dirFiles = await promises.readdir(dirPath);
  for (const file of dirFiles) {
    const curPath = path.resolve(dirPath, file);
    const stats = fs.statSync(curPath);

    console.log(file, stats.isDirectory());
    console.log(file, stats.isFile());
    if (stats.isFile()) {
      files.push(curPath);
    }
    if (stats.isDirectory()) {
      files = await getFiles(curPath, files);
    }
  }
  return files;
}

router.get("/files", async function (req, res, next) {
  try {
    const dirPath = path.resolve(__dirname, "../public");
    files = await getFiles(dirPath, []);
    console.log(files);

    const rootPath = process.cwd();
    files = files.map((element) => {
      return element.replace(`${rootPath}/public`, "");
    });

    res.render("down", { files: files });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
