import express from "express";
import cors from "cors";
import { conexion } from "./config/db";

const app = express();
const PUERTO = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend de productos funcionando");
});

app.get("/test-db", async (req, res) => {
    try {
        const [resultado] = await conexion.query("SELECT 1");

        res.json({
            mensaje: "Conexión con MySQL exitosa",
            resultado: resultado
        });
    } catch (error) {
        console.error("Error al conectar con MySQL:", error);

        res.status(500).json({
            mensaje: "Error al conectar con la base de datos"
        });
    }
});


app.get("/products", async (req, res) => {
    try {
        const [productos] = await conexion.query(
            "SELECT * FROM products"
        );

        res.json(productos);
    } catch (error) {
        console.error("Error al consultar productos:", error);

        res.status(500).json({
            mensaje: "Error al obtener los productos"
        });
    }
});


app.post("/products", async (req, res) => {
    try {
        const { name, description, price } = req.body;

        if (!name || !description || price === undefined || price === null || price === "") {
            return res.status(400).json({
                mensaje: "Todos los campos son obligatorios"
            });
        }

        if (typeof name !== "string" || typeof description !== "string") {
            return res.status(400).json({
                mensaje: "El nombre y la descripción deben ser texto"
            });
        }

        if (name.trim() === "" || description.trim() === "") {
            return res.status(400).json({
                mensaje: "El nombre y la descripción no pueden estar vacíos"
            });
        }

        const precio = Number(price);

        if (!Number.isFinite(precio) || precio < 0) {
            return res.status(400).json({
                mensaje: "El precio debe ser un número mayor o igual a cero"
            });
        }

        const [resultado] = await conexion.execute(
            "INSERT INTO products (name, description, price) VALUES (?, ?, ?)",
            [name.trim(), description.trim(), precio]
        );

        res.status(201).json({
            mensaje: "Producto creado correctamente"
        });

    } catch (error) {
        console.error("Error al crear producto:", error);

        res.status(500).json({
            mensaje: "Error al crear el producto"
        });
    }
});


app.delete("/products/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensaje: "El ID debe ser un número entero positivo"
            });
        }

        const [resultado] = await conexion.execute(
            "DELETE FROM products WHERE id = ?",
            [id]
        );

        const eliminacion = resultado as { affectedRows: number };

        if (eliminacion.affectedRows === 0) {
            return res.status(404).json({
                mensaje: "No se encontró el producto"
            });
        }

        res.json({
            mensaje: "Producto eliminado correctamente"
        });

    } catch (error) {
        console.error("Error al eliminar producto:", error);

        res.status(500).json({
            mensaje: "Error al eliminar el producto"
        });
    }
});

app.listen(PUERTO, () => {
    console.log("Servidor iniciado en http://localhost:" + PUERTO);
});