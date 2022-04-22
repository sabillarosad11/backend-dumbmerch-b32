const express = require("express");
const router = express.Router();

// Controller
const { 
  addUsers, 
  getUsers, 
  getUser, 
  updateUser, 
  deleteUser 
} = require("../controllers/user");

const {
  addProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");

const {
  addCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");

const {
  addTransaction,
  getTransactions,
  notification,
} = require("../controllers/transaction");

const {
  addProfile,
  getProfiles,
} = require("../controllers/profile");

const {
  addCategoryProduct,
  getCategoryProducts,
} = require("../controllers/categoryproduct");

const { register, login, checkAuth } = require("../controllers/auth");

const { auth } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/uploadFile");

// Route
router.post("/user", addUsers);
router.get("/users", getUsers);
router.get("/user/:id", getUser);
router.patch("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

router.post("/product", auth, uploadFile("image"), addProduct);
router.get("/products", getProducts);
router.get("/product/:id", getProduct);
router.patch("/product/:id", uploadFile("image"), updateProduct);
router.delete("/product/:id", auth, deleteProduct);

router.post("/category", auth, addCategory);
router.get("/categories", getCategories);
router.get("/category/:id", auth, getCategory);
router.patch("/category/:id", auth, updateCategory);
router.delete("/category/:id", auth, deleteCategory);

router.post("/categoryproduct",  addCategoryProduct);
router.get("/categoryproducts", getCategoryProducts);

router.post("/transaction", auth, addTransaction);
router.get("/transactions", auth, getTransactions);

router.post("/notification", notification);

router.post("/profile", addProfile);
router.get("/profiles", getProfiles);

router.post("/register", register);
router.post("/login", login);
router.get("/check-auth", auth, checkAuth);


module.exports = router;