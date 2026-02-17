import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const manager = new ProductManager("./src/data/products.json");

router.get("/", async (req, res) => {
    const products = await manager.getProducts();
    res.status(200).json(products);
});

router.get("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    const product = await manager.getProductById(id);

    if (!product)
        return res.status(404).json({ error: "Producto no encontrado" });

    res.json(product);
});

router.post("/", async (req, res) => {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category)
        return res.status(400).json({ error: "Campos incompletos" });

    const newProduct = await manager.addProduct({
        title,
        description,
        code,
        price,
        status: status ?? true,
        stock,
        category,
        thumbnails: thumbnails || []
    });

    res.status(201).json(newProduct);
});

router.put("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    const updated = await manager.updateProduct(id, req.body);

    if (!updated)
        return res.status(404).json({ error: "Producto no encontrado" });

    res.json(updated);
});

router.delete("/:pid", async (req, res) => {
    const id = parseInt(req.params.pid);
    const deleted = await manager.deleteProduct(id);

    if (!deleted)
        return res.status(404).json({ error: "Producto no encontrado" });

    res.json({ message: "Producto eliminado" });
});

export default router;
