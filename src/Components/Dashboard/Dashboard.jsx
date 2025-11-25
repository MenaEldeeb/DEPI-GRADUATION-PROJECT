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
      return saved ? JSON.parse(saved) : { Handmade: [], Kids: [], Men: [], Women: [] };
    } catch {
      return { Handmade: [], Kids: [], Men: [], Women: [] };
    }
  });

  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem("orders");
      if (saved) {
        const parsed = JSON.parse(saved);
        const fixed = {};
        sections.forEach((sec) => (fixed[sec] = Array.isArray(parsed[sec]) ? parsed[sec] : []));
        return fixed;
      }
      return { Handmade: [], Kids: [], Men: [], Women: [] };
    } catch {
      return { Handmade: [], Kids: [], Men: [], Women: [] };
    }
  });

  const [newProduct, setNewProduct] = useState({ title: "", price: 0, category: "" });

  const mergeArrays = (existing, incoming) => {
    const map = new Map();
    existing.forEach((p) => map.set(`${p.title}-${p.category}`, p));
    incoming.forEach((p) => {
      const key = `${p.title}-${p.category}`;
      if (!map.has(key)) map.set(key, { ...p, id: p.id || uuidv4() });
    });
    return Array.from(map.values());
  };

  const getProductById = (id, section) => allProducts[section]?.find((p) => p.id === id);

  useEffect(() => {
    let mounted = true;
    async function fetchProducts() {
      try {
        const [handmadeRes, kidsRes, menRes, womenRes] = await Promise.all([
          axios.get("/Handmade.json"),
          axios.get("/Kids-products.json"),
          axios.get("/Men.json"),
          axios.get("/Women.json"),
        ]);
        if (mounted) {
          setAllProducts({
            Handmade: mergeArrays([], handmadeRes.data),
            Kids: mergeArrays([], kidsRes.data),
            Men: mergeArrays([], menRes.data),
            Women: mergeArrays([], womenRes.data),
          });
        }
      } catch {
        void 0; // catch فارغ بدون أي warning
      }
    }
    if (!sections.some((sec) => allProducts[sec]?.length > 0)) fetchProducts();
    return () => { mounted = false; };
  }, []);

  useEffect(() => { localStorage.setItem("allProducts", JSON.stringify(allProducts)); }, [allProducts]);
  useEffect(() => { localStorage.setItem("orders", JSON.stringify(orders)); }, [orders]);

  const handleAddProduct = () => {
    if (!newProduct.title || !newProduct.price || !newProduct.category) return;
    const prod = { ...newProduct, id: uuidv4() };
    setAllProducts((prev) => ({ ...prev, [activeTab]: [...prev[activeTab], prod] }));
    setNewProduct({ title: "", price: 0, category: "" });
  };

  const handleDeleteProduct = (id) => {
    setAllProducts((prev) => ({ ...prev, [activeTab]: prev[activeTab].filter((p) => p.id !== id) }));
    setOrders((prev) => ({ ...prev, [activeTab]: prev[activeTab].filter((o) => o.productId !== id) }));
  };

  const handleAddOrder = (productId) => {
    setOrders((prev) => ({ ...prev, [activeTab]: [...prev[activeTab], { id: uuidv4(), productId }] }));
  };

  const handleDeleteOrder = (orderId) => {
    setOrders((prev) => ({ ...prev, [activeTab]: prev[activeTab].filter((o) => o.id !== orderId) }));
  };

  const uniqueProducts = allProducts[activeTab]?.filter(
    (p, i, arr) => arr.findIndex(x => x.title === p.title && x.category === p.category) === i
  ) || [];

  const chartData = sections.map((sec, idx) => ({
    name: sec,
    products: allProducts[sec]?.filter((p, i, arr) => arr.findIndex(x => x.title === p.title && x.category === p.category) === i).length || 0,
    orders: orders[sec]?.length || 0,
    color: colors[idx],
  }));

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Dashboard</h2>

      <div className="d-flex justify-content-center mb-4 flex-wrap gap-2">
        {sections.map((sec) => (
          <button key={sec} className={`btn ${activeTab===sec?"btn-success":"btn-outline-success"} btn-sm`} onClick={()=>setActiveTab(sec)}>{sec}</button>
        ))}
      </div>

      <div className="row g-2 mb-4">
        <div className="col-12 col-sm-4">
          <input type="text" placeholder="Product Title" autoComplete="off" value={newProduct.title} onChange={(e)=>setNewProduct({...newProduct,title:e.target.value})} className="form-control form-control-sm" style={{height:"40px"}} />
        </div>
        <div className="col-12 col-sm-3">
          <input type="number" placeholder="Price" autoComplete="off" value={newProduct.price} onChange={(e)=>setNewProduct({...newProduct,price:e.target.value?Number(e.target.value):0})} className="form-control form-control-sm" style={{height:"40px"}} />
        </div>
        <div className="col-12 col-sm-3">
          <input type="text" placeholder="Category" autoComplete="off" value={newProduct.category} onChange={(e)=>setNewProduct({...newProduct,category:e.target.value})} className="form-control form-control-sm" style={{height:"40px"}} />
        </div>
        <div className="col-12 col-sm-2 d-grid">
          <button className="btn btn-success btn-sm" onClick={handleAddProduct} style={{height:"40px"}}>Add Product</button>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12 col-md-6 mb-4">
          <div className="table-responsive" style={{maxHeight:"250px",overflowY:"auto",border:"1px solid #ddd"}}>
            <h5 className="text-center">{activeTab} Products</h5>
            <p>Total Products: {uniqueProducts.length}</p>
            <table className="table table-bordered table-hover table-sm mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {uniqueProducts.map((p)=>(
                  <tr key={p.id}>
                    <td style={{maxWidth:"100px",overflowX:"auto",whiteSpace:"nowrap"}}>{p.id}</td>
                    <td>{p.title}</td>
                    <td>${p.price}</td>
                    <td>{p.category}</td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        <button className="btn btn-sm btn-success" onClick={()=>handleAddOrder(p.id)}>Add Order</button>
                        <button className="btn btn-sm btn-danger" onClick={()=>handleDeleteProduct(p.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-12 col-md-6 mb-4">
          <div className="table-responsive" style={{maxHeight:"250px",overflowY:"auto",border:"1px solid #ddd"}}>
            <h5 className="text-center">{activeTab} Orders</h5>
            <p>Total Orders: {orders[activeTab]?.length||0}</p>
            <table className="table table-bordered table-hover table-sm mb-0 align-middle">
              <thead className="table-light">
                <tr><th>#</th><th>Product</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {orders[activeTab]?.map((order,i)=>{
                  const product=getProductById(order.productId,activeTab);
                  return(
                    <tr key={order.id}>
                      <td>{i+1}</td>
                      <td>{product?product.title:"Unknown"}</td>
                      <td><button className="btn btn-sm btn-danger" onClick={()=>handleDeleteOrder(order.id)}>Delete</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12 col-md-6 mb-4">
          <h5 className="text-center">Products Bar Chart</h5>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}><XAxis dataKey="name"/><YAxis/><Tooltip/><Legend/><Bar dataKey="products">{chartData.map(e=><Cell key={e.name} fill={e.color}/>)}</Bar></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="col-12 col-md-6 mb-4">
          <h5 className="text-center">Orders Pie Chart</h5>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart><Pie data={chartData} dataKey="orders" nameKey="name" outerRadius={80} label>{chartData.map(e=><Cell key={e.name} fill={e.color}/>)}</Pie><Tooltip/><Legend/></PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}