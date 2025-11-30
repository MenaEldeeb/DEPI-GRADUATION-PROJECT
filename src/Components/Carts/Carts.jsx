import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [localCart, setLocalCart] = useState([]);
  const navigate = useNavigate();

  // Sync localCart with Context cart and localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const currentCart = cart.length ? cart : storedCart;
    setLocalCart(currentCart);
    localStorage.setItem("cart", JSON.stringify(currentCart));
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
    );
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
        <div className="row justify-content-center">
          <div className="col-12 col-md-10">
            <h3 
  className="fw-normal text-center my-5" 
  style={{ 
    textShadow: "2px 2px 4px rgba(0,0,0,0.5)" 
  }}
>
  Shopping Cart
</h3>


            {localCart.length === 0 ? (
              <h4 className="text-muted text-center">Your cart is empty.</h4>
            ) : (
              <>
                {localCart.map((item) => (
                  <div className="card rounded-3 mb-4" key={item.id}>
                    <div className="card-body p-3 p-md-4">
                      <div className="row align-items-center">
                        {/* Image */}
                        <div className="col-4 col-sm-3 col-md-2 mb-3 mb-md-0 text-center">
                          <img
                            src={item.thumbnail}
                            className="img-fluid rounded-3"
                            alt={item.title}
                          />
                        </div>

                        {/* Title */}
                        <div className="col-8 col-sm-5 col-md-4 mb-2 mb-md-0">
                          <p className="lead mb-0">{item.title}</p>
                        </div>

                        {/* Quantity */}
                        <div className="col-12 col-sm-4 col-md-3 d-flex align-items-center mb-2 mb-md-0 justify-content-start justify-content-md-center gap-2">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            disabled={item.quantity === 1}
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
                            className="form-control form-control-sm text-center"
                            style={{ width: "50px" }}
                            value={item.quantity || 1}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.id,
                                Math.max(1, Number(e.target.value))
                              )
                            }
                          />
                          <button
                            className="btn btn-outline-secondary btn-sm"
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

                        {/* Price */}
                        <div className="col-6 col-md-2 text-end mb-2 mb-md-0">
                          <strong>${(item.price * (item.quantity || 1)).toFixed(2)}</strong>
                        </div>

                        {/* Remove */}
                        <div className="col-6 col-md-1 text-end">
                          <button
                            className="text-danger btn btn-link p-0"
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
                    <h4 className="fw-bold mb-2 mb-sm-0">
                      Total: ${totalPrice.toFixed(2)}
                    </h4>

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
