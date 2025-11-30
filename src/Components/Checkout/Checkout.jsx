import { useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import PaymentModal from "../PaymentModal/PaymentModal";

import { useNavigate } from "react-router-dom";


export default function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showModal, setShowModal] = useState(false);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const total = cart.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleConfirmPayment = () => {
    clearCart();
    setShowModal(false);
    navigate("/order-success");
  };

  return (
    <section className="container py-5">
      <h2 className="fw-bold mt-5">Checkout</h2>


      <div className="row">
        <div className="col-md-7">
          <div className="card p-4 mb-4">
            <h4 className="fw-semibold mb-3">Customer Details</h4>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="form-control mb-3"
              value={customer.name}
              onChange={handleChange}
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              className="form-control mb-3"
              value={customer.phone}
              onChange={handleChange}
            />

            <textarea
              name="address"
              placeholder="Full Address"
              className="form-control"
              rows="3"
              value={customer.address}
              onChange={handleChange}
            />
          </div>

          <div className="card p-4">
            <h5 className="fw-semibold mb-2">Payment Method</h5>

            <select
              className="form-select mb-3"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="cash">Cash on Delivery</option>
              <option value="online">Online Payment</option>
            </select>

            <button
              className="btn btn-success w-100"
              disabled={!customer.name || !customer.phone || !customer.address}
              onClick={() => setShowModal(true)}
            >
              Proceed to Pay
            </button>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card p-4">
            <h4 className="fw-semibold mb-3">Order Summary</h4>

            {cart.map((item) => (
              <div key={item.id} className="d-flex justify-content-between mb-2">
                <span>{item.title} × {item.quantity || 1}</span>
                <strong>${(item.price * (item.quantity || 1)).toFixed(2)}</strong>
              </div>
            ))}

            <hr />
            <h4 className="fw-bold">Total: ${total.toFixed(2)}</h4>
          </div>
        </div>
      </div>

      <PaymentModal
        show={showModal}
        total={total}
        method={paymentMethod}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmPayment}
      />
    </section>
  );
}

