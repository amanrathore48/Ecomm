import { useContext } from "react";
import Link from "next/link";
import { ProductsContext } from "./ProductsContext";

const ProdCard = ({
  _id,
  slug,
  name,
  price,
  description,
  mainImage,
  picture,
}) => {
  // Use mainImage if available, fallback to picture
  const { setSelectedProducts } = useContext(ProductsContext);
  function addProduct() {
    setSelectedProducts((prev) => [...prev, _id]);
  }
  return (
    <Link
      href={`/products/${slug || _id}`}
      className="block w-52 hover:shadow-lg transition"
    >
      <div className="bg-blue-100 p-5 rounded-xl">
        <img
          src={mainImage || picture || "/placeholder-product.jpg"}
          alt={name}
        />
      </div>
      <div className="mt-2">
        <h3 className="font-bold text-lg">{name}</h3>
      </div>
      <p className="text-sm mt-1 leading-4 text-gray-500">{description}</p>
      <div className="flex mt-1">
        <div className="text-2xl font-bold grow">${price}</div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addProduct();
          }}
          className="bg-emerald-400 text-white py-1 px-3 rounded-xl"
        >
          +
        </button>
      </div>
    </Link>
  );
};

export default ProdCard;
