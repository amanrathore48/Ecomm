export async function generateMetadata({ params }) {
  // In a real app, you would fetch the product data based on the productId
  // For now, we'll use hard-coded values

  const productName = "Product Details"; // Replace with actual product name when fetching data

  return {
    title: productName,
    description:
      "View detailed product information, specifications, and reviews.",
    openGraph: {
      title: productName,
      description:
        "View detailed product information, specifications, and reviews.",
      type: "product",
    },
  };
}
