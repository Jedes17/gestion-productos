
import axios from "axios";

const API_URL = "http://localhost:3000/products";

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
}

export async function getProducts(): Promise<Product[]> {
    const response = await axios.get<Product[]>(API_URL);
    return response.data;
}

export async function createProduct(product: Omit<Product, "id">) {
    const response = await axios.post(API_URL, product);
    return response.data;
}

export async function deleteProduct(id: number) {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
}
