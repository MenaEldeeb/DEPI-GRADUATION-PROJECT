
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [localCart, setLocalCart] = useState([]);
  const navigate = useNavigate();

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setLocalCart(storedCart);
  }, []);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(localCart));
  }, [localCart]);

  // Update localCart whenever Context cart changes
  useEffect(() => {
    setLocalCart(cart);
  }, [cart]);

  const totalPrice = localCart.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

  const handleCheckout = () => {
    navigate("/checkout", { state: { cart: localCart, totalPrice, paymentMethod } });
  };

  const handleQuantityChange = (id, quantity) => {
    updateQuantity(id, quantity); // update Context
    setLocalCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    ); // update local state & localStorage
  };

  const handleRemove = (id) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      removeFromCart(id);
      setLocalCart((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <section className="h-100">
      <div className="container h-100 py-5">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-10">
            <h3 className="fw-normal mb-4">Shopping Cart</h3>

            {localCart.length === 0 ? (
              <h4 className="text-muted">Your cart is empty.</h4>
            ) : (
              <>
                {localCart.map((item) => (
                  <div className="card rounded-3 mb-4" key={item.id}>
                    <div className="card-body p-4">
                      <div className="row align-items-center">
                        <div className="col-md-2">
                          <img
                            src={item.thumbnail}
                            className="img-fluid rounded-3"
                            alt={item.title}
                          />
                        </div>
                        <div className="col-md-4">
                          <p className="lead mb-2">{item.title}</p>
                        </div>
                        <div className="col-md-3 d-flex align-items-center">
                          <button
                            className="btn btn-link px-2"
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                Math.max(1, (item.quantity || 1) - 1)
                              )
                            }
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          <input
                            min="1"
                            type="number"
                            className="form-control form-control-sm mx-2"
                            value={item.quantity || 1}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.id,
                                Math.max(1, Number(e.target.value))
                              )
                            }
                          />
                          <button
                            className="btn btn-link px-2"
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                (item.quantity || 1) + 1
                              )
                            }
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                        <div className="col-md-2 text-end">
                          <strong>
                            ${(item.price * (item.quantity || 1)).toFixed(2)}
                          </strong>
                        </div>
                        <div className="col-md-1 text-end">
                          <button
                            className="text-danger btn btn-link"
                            onClick={() => handleRemove(item.id)}
                          >
                            <i className="fas fa-trash fa-lg"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Total + Checkout */}
                <div className="card mb-3">
                  <div className="card-body d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2">
                    <h4 className="fw-bold mb-0">Total: ${totalPrice.toFixed(2)}</h4>
                    
                    {/* Payment Method */}
                    <select
                      className="form-select flex-grow-1"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="cash">Cash by hand</option>
                      <option value="online">Online checkout</option>
                    </select>

                    <button
                      className="btn btn-success btn-sm flex-shrink-0"
                      onClick={handleCheckout}
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
