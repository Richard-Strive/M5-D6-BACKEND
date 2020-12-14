const { Router } = require("express");
const { body, validationResult, check } = require("express-validator");
const express = require("express");
const fs = require("fs");
const path = require("path");
const { writeFile, createReadStream } = require("fs-extra");
const uniqid = require("uniqid");
const multer = require("multer");
const { pipeline } = require("stream");

const upload = multer({});

const router = express.Router();

const fileReader = (file) => {
  const myPath = path.join(__dirname, file);
  const myFileAsBuffer = fs.readFileSync(myPath);
  const fileAsString = myFileAsBuffer.toString();
  return JSON.parse(fileAsString);
};

router.get("/", (req, res, next) => {
  try {
    const productsArray = fileReader("products.json");
    res.send(productsArray);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get("/:id", (req, res, next) => {
  try {
    const productsArray = fileReader("products.json");
    const idFromReq = req.params.id;
    const products = productsArray.filter(
      (products) => products.ID === idFromReq
    );

    res.send(products);
    console.log(products);
  } catch (err) {
    console.log(err);
  }
});

// router.post("/", (req, res, next) => {
//   try {
//     const productsArray = fileReader("products.json");
//     const newproduct = { ...req.body, ID: uniqid(), postedAt: new Date() };
//     productsArray.push(newproduct);
//     console.log(productsArray);
//     fs.writeFileSync(
//       path.join(__dirname, "products.json"),
//       JSON.stringify(productsArray)
//     );
//     res.status(201).send();
//   } catch (err) {
//     console.log(err);
//   }
// });
router.post(
  "/",
  [
    check("name").exists().withMessage("Insert a name please!"),
    check("description")
      .exists()
      .withMessage("Serious??? Need a description here"),
    check("brand").exists().withMessage("Need a brand here!"),
    check("price").exists().isInt().withMessage("PRICE!!!"),
  ],
  (req, res, next) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const err = new Error();
        err.message = errors;
        err.httpStatusCode = 400;
        next(err);
      } else {
        const projectsDB = fileReader("products.json");
        const newproject = {
          ...req.body,
          ID: uniqid(),
          createdAt: new Date(),
        };

        projectsDB.push(newproject);

        fs.writeFileSync(
          path.join(__dirname, "products.json"),
          JSON.stringify(projectsDB)
        );

        res.status(201).send({
          id: newproject.ID,
        });
      }
    } catch (error) {
      next(error);
    }
  }
);
router.post(
  "/:id/upload",
  upload.single("productPhoto"),
  async (req, res, next) => {
    try {
      const productfile = fileReader("products.json");
      await writeFile(
        path.join(productFolderPath, req.file.originalname),
        req.file.buffer
      );
      const filteredFile = productfile.filter(
        (product) => product.ID !== req.params.id
      );
      const product = await productfile.filter(
        (product) => product.ID === req.params.id
      );
      product[0].image = `http://localhost:3001/img/products/${req.file.originalname.toString()}`;
      filteredFile.push(product[0]);
      fs.writeFileSync(
        path.join(__dirname, "products.json"),
        JSON.stringify(filteredFile)
      );
      res.send("Image uploaded!");
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

router.put(
  "/:id",
  [
    check("name").exists().withMessage("Insert a name please!"),
    check("description")
      .exists()
      .withMessage("Serious??? Need a description here"),
    check("brand").exists().withMessage("Need a brand here!"),
    check("price").exists().isInt().withMessage("PRICE!!!"),
  ],
  (req, res, next) => {
    const productsArray = fileReader("products.json");

    const newproductArray = productsArray.filter(
      (products) => products.ID !== req.params.id
    );

    const modifiedproducts = req.body;

    modifiedproducts.ID = req.params.id;
    newproductArray.push(modifiedproducts);

    fs.writeFileSync(
      path.join(__dirname, "products.json"),
      JSON.stringify(newproductArray)
    );

    console.log("PUT ID");
    res.status(200).send();
  }
);
router.delete("/:id", (req, res, next) => {
  const productsArray = fileReader("products.json");
  const newproductArray = productsArray.filter(
    (products) => products.ID !== req.params.id
  );

  fs.writeFileSync(
    path.join(__dirname, "products.json"),
    JSON.stringify(newproductArray)
  );
  console.log("DELETE ID");
  res.status(200).send();
});

module.exports = router;
