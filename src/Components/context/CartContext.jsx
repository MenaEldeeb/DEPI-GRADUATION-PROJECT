import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const CartContext = createContext();

export default function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const exist = prevCart.find((i) => i.id === item.id);
      if (exist) {
      
        const updated = prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i
        );
     
        setTimeout(() => {
          toast.info(`${item.title} quantity increased ✅`);
        }, 0);
        return updated;
      } else {
        const updated = [...prevCart, { ...item, quantity: 1 }];
        setTimeout(() => {
          toast.success(`${item.title} added to cart ✅`);
        }, 0);
        return updated;
      }
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setTimeout(() => {
      toast.warning("Cart cleared ⚠️");
    }, 0);
  };

  const cartCount = cart.reduce((total, item) => total + (item.quantity ?? 1), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
