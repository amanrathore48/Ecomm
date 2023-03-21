import { createContext } from "react";
import { useState } from "react";

export const ProductsContext = createContext({});

export function ProductsContextProvider({ children }) {
  const [selectedProducts, setSelectedProducts] = useState(
    localStorage.getItem("cart")
  );

  return (
    <ProductsContext.Provider value={{ selectedProducts, setSelectedProducts }}>
      {children}
    </ProductsContext.Provider>
  );
}
