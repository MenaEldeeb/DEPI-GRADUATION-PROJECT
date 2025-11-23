import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext.jsx";

export default function ProductDetails() {
  const { state } = useLocation();
  const { addToCart } = useContext(CartContext);

  const product = state?.product;

  if (!product) {
    return <h2 className="text-center mt-5">No product data found</h2>;
  }

  const productImage =
    product.images?.length > 0 ? product.images[0] : product.thumbnail;

  return (
    <div className="container my-5">
      <div className="row align-items-center">
        <div className="col-md-5 mb-4 mb-md-0">
          <img
            src={productImage}
            alt={product.title}
            className="w-100 rounded shadow-sm"
          />
        </div>

        <div className="col-md-7">
          <h2 className="fw-bold">{product.title}</h2>
          <p className="text-muted">{product.category}</p>
          <p className="mt-3">{product.description}</p>
          <h3 className="text-success fw-bold mt-4">${product.price}</h3>

          <button
            className="btn btn-success mt-4"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
