
import { useEffect, useState } from "react";
import {
    getProducts,
    createProduct,
    deleteProduct,
    type Product
} from "./services/productService";
import "./App.css";

function App() {
    const [products, setProducts] = useState<Product[]>([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function loadProducts() {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error(error);
            setMessage("No se pudieron cargar los productos.");
        }
    }

    useEffect(() => {
        loadProducts();
    }, []);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!name.trim() || !description.trim() || price === "") {
            setMessage("Completa todos los campos.");
            return;
        }

        const numericPrice = Number(price);

        if (!Number.isFinite(numericPrice) || numericPrice < 0) {
            setMessage("Ingresa un precio válido.");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            await createProduct({
                name: name.trim(),
                description: description.trim(),
                price: numericPrice
            });

            setName("");
            setDescription("");
            setPrice("");

            setMessage("Producto registrado correctamente.");
            await loadProducts();
        } catch (error) {
            console.error(error);
            setMessage("No se pudo registrar el producto.");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: number) {
        const confirmed = window.confirm(
            "¿Estás seguro de eliminar este producto?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setMessage("");
            await deleteProduct(id);
            setMessage("Producto eliminado correctamente.");
            await loadProducts();
        } catch (error) {
            console.error(error);
            setMessage("No se pudo eliminar el producto.");
        }
    }

    return (
        <main className="container">
            <header className="page-header">
                <h1>Gestión de productos</h1>
            </header>

            <section className="panel">
                <h2>Registrar producto</h2>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="name">Nombre</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Nombre del producto"
                        required
                    />

                    <label htmlFor="description">Descripción</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="Descripción del producto"
                        required
                    />

                    <label htmlFor="price">Precio</label>
                    <input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={price}
                        onChange={(event) => setPrice(event.target.value)}
                        placeholder="$"
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Registrando..." : "Registrar producto"}
                    </button>
                </form>
                <h1></h1>

                {message && <p className="message">{message}</p>}
            </section>

            <section className="panel">
                <h2>Productos registrados</h2>

                {products.length === 0 ? (
                    <p>No hay productos registrados todavía.</p>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th>Precio</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.name}</td>
                                        <td>{product.description}</td>
                                        <td>
                                            {Number(product.price).toLocaleString(
                                                "es-CO",
                                                {
                                                    style: "currency",
                                                    currency: "COP"
                                                }
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="delete-button"
                                                onClick={() =>
                                                    handleDelete(product.id)
                                                }
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </main>
    );
}

export default App;
