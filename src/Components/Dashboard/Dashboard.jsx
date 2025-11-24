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
  const [allProducts, setAllProducts] = useState({
    Handmade: [],
    Kids: [],
    Men: [],
    Women: [],
  });

  const [orders, setOrders] = useState({
    Handmade: [],
    Kids: [],
    Men: [],
    Women: [],
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

        setAllProducts({
          Handmade: handmadeRes.data,
          Kids: kidsRes.data,
          Men: menRes.data,
          Women: womenRes.data,
        });
      } catch (err) {
        console.error("Failed to fetch products", err);
      }
    }

    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    if (!newProduct.title || !newProduct.price || !newProduct.category) return;
    const newProd = { ...newProduct, id: Date.now() };

    setAllProducts({
      ...allProducts,
      [activeTab]: [...allProducts[activeTab], newProd],
    });

    setNewProduct({ title: "", price: "", category: "" });
  };

  const handleDeleteProduct = (id) => {
    setAllProducts({
      ...allProducts,
      [activeTab]: allProducts[activeTab].filter((p) => p.id !== id),
    });

    setOrders({
      ...orders,
      [activeTab]: orders[activeTab].filter((o) => o.productId !== id),
    });
  };

  const handleAddOrder = (productId) => {
    setOrders({
      ...orders,
      [activeTab]: [...orders[activeTab], { productId }],
    });
  };

  const handleDeleteOrder = (index) => {
    setOrders({
      ...orders,
      [activeTab]: orders[activeTab].filter((_, i) => i !== index),
    });
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

      {/* هنا الأزرار المعدلة */}
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
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{order.productId}</td>

              <td>
                <div className="d-flex gap-2 flex-wrap">
                  <button
                    className="btn btn-sm btn-danger w-100 w-sm-auto"
                    onClick={() => handleDeleteOrder(index)}
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
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
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
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
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