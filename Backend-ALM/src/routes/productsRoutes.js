const express = require("express");
const {
  getProductPrice,
  suggestProducts,
  patchProductPrice,
  postProduct,
  removeProduct
} = require("../controllers/productsController");

const router = express.Router();

router.get("/products/price", getProductPrice);
router.patch("/products/price", patchProductPrice);
router.get("/products/suggest", suggestProducts);
router.post("/products", postProduct);
router.delete("/products", removeProduct);

module.exports = router;
