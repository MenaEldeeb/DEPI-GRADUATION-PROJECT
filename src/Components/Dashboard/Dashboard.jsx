import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
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

  // Merge arrays and assign UUID for duplicates
  const mergeArrays = (existing, incoming) => {
    const map = new Map(existing.map((p) => [p.id, p]));
    incoming.forEach((p) => {
      if (map.has(p.id)) {
        map.set(uuidv4(), { ...p, id: uuidv4() });
      } else {
        map.set(p.id || uuidv4(), { ...p });
      }
    });
    return Array.from(map.values());
  };

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

  useEffect(() => {
    localStorage.setItem("allProducts", JSON.stringify(allProducts));
  }, [allProducts]);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  const handleAddProduct = () => {
    if (!newProduct.title || !newProduct.price || !newProduct.category) return;
    const prod = { ...newProduct, id: uuidv4() };
    setAllProducts((prev) => ({
      ...prev,
      [activeTab]: [...prev[activeTab], prod],
    }));
    setNewProduct({ title: "", price: "", category: "" });
  };

  const handleDeleteProduct = (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
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
    const order = { id: uuidv4(), productId };
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
    <div className="container my-4">
      <h2 className="text-center mb-4">Dashboard</h2>

      {/* Tabs */}
      <div className="d-flex justify-content-center mb-4 flex-wrap gap-2">
        {sections.map((sec) => (
          <button
            key={sec}
            className={`btn ${
              activeTab === sec ? "btn-success" : "btn-outline-success"
            } btn-sm`}
            onClick={() => setActiveTab(sec)}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* Add Product Form */}
      <div className="mb-4 d-flex flex-column flex-sm-row gap-2">
        <input
          type="text"
          placeholder="Product Title"
          value={newProduct.title}
          onChange={(e) =>
            setNewProduct({ ...newProduct, title: e.target.value })
          }
          className="form-control"
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({
              ...newProduct,
              price: e.target.value ? Number(e.target.value) : "",
            })
          }
          className="form-control"
        />
        <input
          type="text"
          placeholder="Category"
          value={newProduct.category}
          onChange={(e) =>
            setNewProduct({ ...newProduct, category: e.target.value })
          }
          className="form-control"
        />
        <button
          className="btn btn-success flex-shrink-0"
          onClick={handleAddProduct}
        >
          Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="table-responsive mb-4">
        <h4>{activeTab} Products</h4>
        <table className="table table-bordered table-hover">
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
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleAddOrder(prod.id)}
                    >
                      Add Order
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
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
      </div>

      {/* Orders Table */}
      <div className="table-responsive mb-4">
        <h4>{activeTab} Orders</h4>
        <table className="table table-bordered table-hover">
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
                  <div className="d-flex flex-wrap gap-2">
                    <button
                      className="btn btn-sm btn-danger"
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
      </div>

      {/* Charts */}
      <div className="row">
        <div className="col-12 col-md-6 mb-4">
          <h5 className="text-center">Products Bar Chart</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="products">
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="col-12 col-md-6 mb-4">
          <h5 className="text-center">Orders Pie Chart</h5>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="orders"
                nameKey="name"
                outerRadius={100}
                label
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
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