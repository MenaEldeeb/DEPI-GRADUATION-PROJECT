import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0
  );

  const handlePaymentChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleCheckout = () => {
    alert(`Proceeding to pay $${totalPrice} via ${paymentMethod}`);
    
  };

  return (
    <section className="h-100">
      <div className="container h-100 py-5">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-10">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-normal mb-0">Shopping Cart</h3>
            </div>

            {cart.length === 0 ? (
              <h4 className="text-muted">Your cart is empty.</h4>
            ) : (
              <>
                {cart.map((item) => (
                  <div className="card rounded-3 mb-4" key={item.id}>
                    <div className="card-body p-4">
                      <div className="row d-flex justify-content-between align-items-center">
                        <div className="col-md-2 col-lg-2 col-xl-2">
                          <img
                            src={item.thumbnail}
                            className="img-fluid rounded-3"
                            alt={item.title}
                          />
                        </div>
                        <div className="col-md-3 col-lg-3 col-xl-3">
                          <p className="lead fw-normal mb-2">{item.title}</p>
                        </div>
                        <div className="col-md-3 col-lg-3 col-xl-2 d-flex">
                          <button
                            className="btn btn-link px-2"
                            onClick={() =>
                              updateQuantity(item.id, (item.quantity || 1) - 1)
                            }
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          <input
                            min="1"
                            type="number"
                            className="form-control form-control-sm"
                            value={item.quantity || 1}
                            onChange={(e) =>
                              updateQuantity(item.id, Number(e.target.value))
                            }
                          />
                          <button
                            className="btn btn-link px-2"
                            onClick={() =>
                              updateQuantity(item.id, (item.quantity || 1) + 1)
                            }
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                        <div className="col-md-1 col-lg-1 col-xl-1 text-end">
                          <button
                            className="text-danger btn btn-link"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <i className="fas fa-trash fa-lg"></i>
                          </button>
                        </div>
                      </div>

                     
                      <div className="text-end mt-2">
                        <strong>Total: ${item.price * (item.quantity || 1)}</strong>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Payment Method & Checkout */}
                <div className="card mb-3">
                  <div className="card-body">
                    <label className="form-label fw-semibold">
                      Payment Method:
                    </label>
                    <select
                      className="form-select mb-3"
                      value={paymentMethod}
                      onChange={handlePaymentChange}
                    >
                      <option value="cash">Cash by hand</option>
                      <option value="online">Online checkout</option>
                    </select>
                    <button
                      className="btn btn-success btn-block btn-lg"
                      onClick={handleCheckout}
                    >
                      Proceed to Pay
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

