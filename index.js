import express from "express";
import mongoose, { Schema } from "mongoose";
import "dotenv/config";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(express.json());
app.use(cors);
app.use(bodyParser.json({ type: "application/*+json" }));
app.use(bodyParser.urlencoded({ extended: false }));

const productSchema = new Schema({
  name: String,
  price: Number,
  category: String,
});
const productModel = mongoose.model("products", productSchema);

app.get("/", async (req, res) => {
  try {
    const products = await productModel.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
});
app.get("/:id", async (req, res) => {
  const { id } = req.params;
  const products = await productModel.findById(id);
  res.send(products);
});

app.post("/", async (req, res) => {
  try {
    const { name, price, category } = req.body;
    const newProduct = new productModel({ name, price, category });
    await newProduct.save();
    res.send("Got a POST request!");
  } catch (error) {
    res.send(error.message);
  }
});

app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const products = await productModel.findByIdAndDelete(id);
  res.send(products);
});

app.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, price, category } = req.body;
  const products = await productModel.findByIdAndUpdate(id, {
    name,
    price,
    category,
  });
  res.send(products);
});

mongoose
  .connect(process.env.DB_SECRET_KEY)
  .then(() => console.log("Connected!"))
  .catch((error) => console.log("Not Connected!"));

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
