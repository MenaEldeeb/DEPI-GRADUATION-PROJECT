import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

const sections = ["Handmade", "Kids", "Men", "Women"];
const colors = ["#28a745", "#ffc107", "#17a2b8", "#dc3545"];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Handmade");

  const [allProducts, setAllProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("allProducts");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Error parsing products from localStorage", e);
    }
    return { Handmade: [], Kids: [], Men: [], Women: [] };
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem("orders");
      if (saved) {
        const parsed = JSON.parse(saved);
        const fixed = {};
        sections.forEach((sec) => (fixed[sec] = parsed[sec] || []));
        return fixed;
      }
    } catch (e) {
      console.error("Error parsing orders from localStorage", e);
    }
    const empty = {};
    sections.forEach((sec) => (empty[sec] = []));
    return empty;
  });

  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "",
    category: "",
  });

  useEffect(() => {
    async function fetchProducts() {
      try {
        const [handmadeRes, kidsRes, menRes, womenRes] = await Promise.all([
          axios.get("/Handmade.json"),
          axios.get("/Kids-products.json"),
          axios.get("/Men.json"),
          axios.get("/Women.json"),
        ]);

        setAllProducts((prev) => ({
          Handmade: mergeArrays(prev.Handmade, handmadeRes.data),
          Kids: mergeArrays(prev.Kids, kidsRes.data),
          Men: mergeArrays(prev.Men, menRes.data),
          Women: mergeArrays(prev.Women, womenRes.data),
        }));
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    }
    fetchProducts();
  }, []);

  const mergeArrays = (existing, incoming) => {
    const ids = new Set(existing.map((p) => p.id));
    return [
      ...existing,
      ...incoming.map((p) =>
        ids.has(p.id) ? { ...p, id: Date.now() + Math.random() } : p
      ),
    ];
  };

  useEffect(() => {
    localStorage.setItem("allProducts", JSON.stringify(allProducts));
  }, [allProducts]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const handleAddProduct = () => {
    if (!newProduct.title || !newProduct.price || !newProduct.category) return;
    const prod = { ...newProduct, id: Date.now() };
    setAllProducts((prev) => ({
      ...prev,
      [activeTab]: [...prev[activeTab], prod],
    }));
    setNewProduct({ title: "", price: "", category: "" });
  };

  const handleDeleteProduct = (id) => {
    setAllProducts((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].filter((p) => p.id !== id),
    }));
    setOrders((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].filter((o) => o.productId !== id),
    }));
  };

  const handleAddOrder = (productId) => {
    const order = { id: Date.now() + Math.random(), productId };
    setOrders((prev) => ({
      ...prev,
      [activeTab]: [...prev[activeTab], order],
    }));
  };

  const handleDeleteOrder = (orderId) => {
    setOrders((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].filter((o) => o.id !== orderId),
    }));
  };

  const chartData = sections.map((sec, idx) => ({
    name: sec,
    products: allProducts[sec].length,
    orders: orders[sec].length,
    color: colors[idx],
  }));

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Dashboard</h2>

      <div className="d-flex justify-content-center mb-4 flex-wrap gap-2">
        {sections.map((sec) => (
          <button
            key={sec}
            className={`btn ${
              activeTab === sec ? "btn-success" : "btn-outline-success"
            } btn-sm px-3`}
            onClick={() => setActiveTab(sec)}
          >
            {sec}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Product Title"
          value={newProduct.title}
          onChange={(e) =>
            setNewProduct({ ...newProduct, title: e.target.value })
          }
          className="form-control mb-2"
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: Number(e.target.value) })
          }
          className="form-control mb-2"
        />
        <input
          type="text"
          placeholder="Category"
          value={newProduct.category}
          onChange={(e) =>
            setNewProduct({ ...newProduct, category: e.target.value })
          }
          className="form-control mb-2"
        />
        <button className="btn btn-success" onClick={handleAddProduct}>
          Add Product
        </button>
      </div>

      <h4>{activeTab} Products</h4>
      <table className="table table-bordered mb-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Price</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {allProducts[activeTab].map((prod) => (
            <tr key={prod.id}>
              <td>{prod.id}</td>
              <td>{prod.title}</td>
              <td>${prod.price}</td>
              <td>{prod.category}</td>
              <td>
                <div className="d-flex gap-2 flex-wrap">
                  <button
                    className="btn btn-sm btn-success w-100 w-sm-auto"
                    onClick={() => handleAddOrder(prod.id)}
                  >
                    Add Order
                  </button>
                  <button
                    className="btn btn-sm btn-danger w-100 w-sm-auto"
                    onClick={() => handleDeleteProduct(prod.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>{activeTab} Orders</h4>
      <table className="table table-bordered mb-4">
        <thead>
          <tr>
            <th>#</th>
            <th>Product ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders[activeTab].map((order, index) => (
            <tr key={order.id}>
              <td>{index + 1}</td>
              <td>{order.productId}</td>
              <td>
                <div className="d-flex gap-2 flex-wrap">
                  <button
                    className="btn btn-sm btn-danger w-100 w-sm-auto"
                    onClick={() => handleDeleteOrder(order.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="row">
        <div className="col-md-6 mb-4">
          <h5>Products Bar Chart</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="products">
                {chartData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="col-md-6 mb-4">
          <h5>Orders Pie Chart</h5>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="orders"
                nameKey="name"
                outerRadius={100}
                label
              >
                {chartData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}