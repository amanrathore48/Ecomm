import React, { useState, useContext, useEffect } from "react";

// Create a new context object for the cart
export const CartContext = React.createContext();

// Create a custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// Create a provider component that will wrap our application
const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("cart")) || [];
    } else {
      return [];
    }
  });

  const [totalAmount, setTotalAmount] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const incQty = async (id) => {
    setCart((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.id === id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      )
    );
  };
  const decQty = async (id) => {
    const targetItem = cart.find((cartItem) => cartItem.id === id);
    if (targetItem.quantity === 1) {
      removeFromCart(id);
    } else {
      setCart((prevCart) =>
        prevCart.map((cartItem) =>
          cartItem.id === id
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem
        )
      );
    }
  };

  const addToCart = async (item) => {
    // Check if the item is already in the cart
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      // Increase the quantity of the existing item
      setCart((prevCart) =>
        prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        )
      );
    } else {
      // Add the new item to the cart
      setCart((prevCart) => [...prevCart, item]);
    }
    console.log("cart on adding", cart);
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((cartItem) => cartItem.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  useEffect(() => {
    // Calculate the total amount and quantity when the cart changes
    let amount = 0;
    let quantity = 0;

    cart.forEach((item) => {
      amount += item.price * item.quantity;
      quantity += item.quantity;
    });

    setTotalAmount(amount);
    setTotalQuantity(quantity);

    // Update the cart in localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("amount", amount);
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        totalAmount,
        totalQuantity,
        incQty,
        decQty,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
