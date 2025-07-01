"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Star,
  Minus,
  Plus,
  Share2,
  Heart,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { ProductCard } from "@/components/product-card";
import { EmptyState } from "@/components/ui/empty-state";

// Product data fetcher
async function fetchProduct(productId) {
  try {
    const response = await fetch(`/api/products/${productId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// Fallback placeholder product data
const placeholderProduct = {
  _id: "placeholder",
  name: "Product not found",
  description: "This product could not be loaded. Please try again later.",
  price: 0,
  mainImage: "/placeholder-product.jpg",
  images: [],
  stock: 0,
  categories: [],
  specifications: [{ name: "Not Available", value: "N/A" }],
  rating: 0,
  numReviews: 0,
  reviews: [],
};

// Mock reviews data
const mockReviews = [
  {
    id: "r1",
    user: "John D.",
    rating: 5,
    date: "2023-05-15",
    title: "Best earbuds I've ever owned",
    content:
      "The sound quality is incredible, and the noise cancellation works better than expected. Battery life is excellent, and they're very comfortable for long periods.",
    helpful: 24,
  },
  {
    id: "r2",
    user: "Sarah M.",
    rating: 4,
    date: "2023-04-22",
    title: "Great sound, slightly bulky case",
    content:
      "Sound quality is amazing and I love the battery life. My only complaint is that the charging case is a bit larger than I'd like, but overall these are fantastic earbuds.",
    helpful: 17,
  },
  {
    id: "r3",
    user: "Michael T.",
    rating: 5,
    date: "2023-03-10",
    title: "Perfect for workouts",
    content:
      "These stay in my ears perfectly during intense workouts. The water resistance is legit - I got caught in the rain and they kept working perfectly.",
    helpful: 32,
  },
];

// Related products - would typically be fetched based on the current product
const relatedProducts = [
  {
    id: "2",
    name: "Smart Watch with Heart Rate Monitor",
    price: 129.99,
    originalPrice: null,
    image: "https://via.placeholder.com/300x300",
    rating: 4.7,
    reviews: 95,
    isNew: true,
    isSale: false,
    inStock: true,
  },
  {
    id: "3",
    name: "Ultra HD 4K Action Camera",
    price: 199.99,
    originalPrice: 249.99,
    image: "https://via.placeholder.com/300x300",
    rating: 4.3,
    reviews: 74,
    isNew: false,
    isSale: true,
    inStock: true,
  },
  {
    id: "4",
    name: "Ergonomic Office Chair",
    price: 189.99,
    originalPrice: null,
    image: "https://via.placeholder.com/300x300",
    rating: 4.8,
    reviews: 215,
    isNew: false,
    isSale: false,
    inStock: true,
  },
];

// Loading component for product details
function ProductDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2">
          <div className="aspect-square bg-secondary/20 animate-pulse rounded-lg"></div>
          <div className="flex gap-2 mt-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-20 h-20 bg-secondary/40 animate-pulse rounded-md"
              ></div>
            ))}
          </div>
        </div>
        <div className="lg:w-1/2 space-y-4">
          <div className="h-8 bg-secondary/40 animate-pulse rounded w-3/4"></div>
          <div className="h-6 bg-secondary/30 animate-pulse rounded w-1/4"></div>
          <div className="h-4 bg-secondary/40 animate-pulse rounded w-2/3"></div>
          <div className="h-4 bg-secondary/40 animate-pulse rounded w-1/2"></div>
          <div className="h-4 bg-secondary/40 animate-pulse rounded w-3/4"></div>
          <div className="h-8 bg-secondary/40 animate-pulse rounded w-1/3 mt-6"></div>
          <div className="h-12 bg-secondary/40 animate-pulse rounded w-full mt-4"></div>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage({ params }) {
  const { productId } = params;
  const { toast } = useToast();

  // Fetch data from our API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productData, setProductData] = useState(null);
  const [product, setProduct] = useState(null);
  const [relatedProductsList, setRelatedProductsList] = useState([]);

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);

  // Fetch product on component mount
  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const data = await fetchProduct(productId);
        if (data && data.success && data.product) {
          setProductData(data);
          setProduct(data.product);
          setRelatedProductsList(data.relatedProducts || []);

          // If images exist, set main image as the first one in the array
          if (data.product.images && data.product.images.length > 0) {
            setActiveImageIndex(0);
          }
        } else {
          setError("Product not found");
          notFound();
        }
      } catch (err) {
        setError(err.message || "Failed to load product");
        console.error("Error loading product:", err);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  // If loading, show loading state
  if (loading) {
    return <ProductDetailLoading />;
  }

  // If error or no product, show 404
  if (error || !product) {
    notFound();
  }

  // Calculate discount percentage
  const discountPercentage = product.discount || 0;

  // Calculate sale price
  const salePrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  // Check if product is on sale
  const isSale = product.discount && product.discount > 0;

  // Ensure we have valid values for rating and reviews
  const rating = product.rating || 4.0; // Default to 4 stars if no rating
  const reviews = product.reviews || 0;
  const stockCount = product.stock || 0;

  // Build a gallery from mainImage and additional images
  const gallery = [product.mainImage, ...(product.images || [])].filter(
    Boolean
  ); // Remove any null/undefined images

  const sku = product._id || "N/A";

  const handleAddToCart = () => {
    toast({
      description: `${quantity} × ${product.name} added to cart`,
    });
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stockCount) {
      setQuantity(newQuantity);
    }
  };

  const handleToggleWishlist = () => {
    setIsInWishlist(!isInWishlist);
    toast({
      description: isInWishlist
        ? `${product.name} removed from wishlist`
        : `${product.name} added to wishlist`,
    });
  };

  return (
    <Suspense fallback={<ProductDetailLoading />}>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-primary">
            Products
          </Link>
          <span className="mx-2">/</span>
          <span>{product.name}</span>
        </div>

        {/* Product Details */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Product Images */}
          <div className="lg:w-1/2">
            <div className="bg-secondary/10 rounded-lg relative aspect-square overflow-hidden">
              {product.gallery && product.gallery[activeImageIndex] ? (
                <Image
                  src={product.gallery[activeImageIndex]}
                  alt={product.name}
                  priority
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <span className="text-muted-foreground">
                    No image available
                  </span>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <Badge className="bg-primary text-white">New</Badge>
                )}
                {product.isSale && product.originalPrice && (
                  <Badge variant="destructive">-{discountPercentage}%</Badge>
                )}
              </div>
            </div>

            {/* Image gallery thumbnails */}
            {product.gallery && product.gallery.length > 0 && (
              <div className="mt-4 flex gap-2 overflow-x-auto">
                {product.gallery.map((image, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`w-20 h-20 relative rounded-md overflow-hidden ${
                      activeImageIndex === i
                        ? "ring-2 ring-primary"
                        : "ring-1 ring-secondary/50"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - Image ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:w-1/2">
            <h1 className="text-3xl font-bold">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center mt-3">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.floor(product.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : star - 0.5 <= product.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2">
                {(product.rating || 0).toFixed(1)} ({product.reviews || 0}{" "}
                reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mt-4 flex items-baseline">
              <span className="text-2xl font-bold">
                ${(product.price || 0).toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="ml-3 text-muted-foreground line-through">
                  ${(product.originalPrice || 0).toFixed(2)}
                </span>
              )}
              {discountPercentage > 0 && (
                <Badge variant="destructive" className="ml-3">
                  {discountPercentage}% OFF
                </Badge>
              )}
            </div>

            {/* Availability */}
            <div className="mt-4 flex items-center">
              <span className="text-sm mr-2">Availability:</span>
              {product.inStock ? (
                <span className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  In Stock ({product.stockCount || 0} available)
                </span>
              ) : (
                <span className="text-red-500">Out of Stock</span>
              )}
            </div>

            {/* SKU */}
            <div className="mt-2 text-sm text-muted-foreground">
              SKU: {product.sku || "N/A"}
            </div>

            {/* Short Description */}
            <p className="mt-6">{product.description}</p>

            {/* Quantity and Add to Cart */}
            <div className="mt-8">
              <div className="flex items-center">
                <span className="mr-4">Quantity:</span>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="h-10 w-10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stockCount}
                    className="h-10 w-10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1"
                  size="lg"
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>

                <Button
                  variant={isInWishlist ? "default" : "outline"}
                  size="icon"
                  className="h-12 w-12"
                  onClick={handleToggleWishlist}
                >
                  <Heart
                    className={`h-5 w-5 ${isInWishlist ? "fill-current" : ""}`}
                  />
                </Button>

                <Button variant="outline" size="icon" className="h-12 w-12">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product tabs: Description, Specifications, Reviews */}
        <div className="mt-16">
          <Tabs defaultValue="description">
            <TabsList className="w-full border-b">
              <TabsTrigger value="description" className="text-lg">
                Description
              </TabsTrigger>
              <TabsTrigger value="specifications" className="text-lg">
                Specifications
              </TabsTrigger>
              <TabsTrigger value="reviews" className="text-lg">
                Reviews ({mockReviews.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="py-6">
              <div className="prose max-w-none">
                <p className="text-lg">{product.description}</p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Vivamus vel bibendum nisl. Duis accumsan, nunc ut tempor
                  lobortis, sem augue auctor tortor, sit amet blandit dolor
                  ipsum vel odio. Praesent sodales justo id nunc vestibulum
                  elementum. Sed venenatis nunc eu odio ullamcorper, at pretium
                  arcu dapibus. Curabitur eu mattis erat, a ullamcorper massa.
                  Fusce vel pretium tortor, a viverra massa. Integer gravida
                  lorem nec libero scelerisque, ut euismod ex auctor.
                </p>
                <p>
                  Sed vel condimentum eros. Nullam efficitur ipsum sed nisl
                  vestibulum, vel sagittis sapien bibendum. Etiam volutpat eros
                  sed ante pellentesque, vel ultricies ex volutpat. Curabitur
                  vitae sodales leo, eget aliquet lectus. Nulla facilisi.
                  Integer pulvinar, enim quis aliquam iaculis, orci mauris
                  ultrices libero, at fermentum mi nibh eget mi.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="py-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <tbody>
                    {product.specifications &&
                    product.specifications.length > 0 ? (
                      product.specifications.map((spec, index) => (
                        <tr
                          key={index}
                          className={index % 2 === 0 ? "bg-secondary/10" : ""}
                        >
                          <td className="py-3 px-4 font-medium w-1/3">
                            {spec.name}
                          </td>
                          <td className="py-3 px-4">{spec.value}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={2}
                          className="py-4 px-4 text-center text-muted-foreground"
                        >
                          No specifications available for this product.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="py-6">
              {/* Reviews summary */}
              <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="md:w-1/3">
                  <div className="text-center">
                    <div className="text-5xl font-bold">
                      {product.rating ? product.rating.toFixed(1) : "0.0"}
                    </div>
                    <div className="flex justify-center mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-5 w-5 ${
                            product.rating && star <= Math.floor(product.rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : product.rating && star - 0.5 <= product.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="mt-2 text-muted-foreground">
                      Based on {product.numReviews || 0} reviews
                    </div>
                  </div>
                </div>

                <div className="md:w-2/3">
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const reviews = product.reviews || [];
                      const count = reviews.filter(
                        (r) => Math.floor(r.rating) === star
                      ).length;
                      const percentage =
                        reviews.length > 0 ? (count / reviews.length) * 100 : 0;

                      return (
                        <div key={star} className="flex items-center">
                          <div className="w-12 font-medium">{star} stars</div>
                          <div className="flex-1 h-2 bg-secondary/20 mx-2 rounded overflow-hidden">
                            <div
                              className="h-full bg-yellow-400"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="w-12 text-right text-muted-foreground text-sm">
                            {count}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-6">
                    <Button>Write a Review</Button>
                  </div>
                </div>
              </div>

              {/* Individual reviews */}
              <div className="space-y-6">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review, index) => (
                    <div key={review._id || index} className="border-b pb-6">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium">{review.user}</h4>
                          <div className="flex items-center mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="text-xs text-muted-foreground ml-2">
                              {review.date
                                ? new Date(review.date).toLocaleDateString()
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <h5 className="font-medium mt-2">{review.title}</h5>
                      <p className="mt-2">{review.content}</p>
                      <div className="mt-3 flex items-center">
                        <Button variant="ghost" size="sm" className="text-xs">
                          Helpful ({review.helpful || 0})
                        </Button>
                        <span className="text-muted-foreground text-sm mx-2">
                          |
                        </span>
                        <Button variant="ghost" size="sm" className="text-xs">
                          Report
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No reviews yet. Be the first to review this product!
                    </p>
                    <Button className="mt-4">Write a Review</Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedProductsList && relatedProductsList.length > 0 ? (
              relatedProductsList.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct._id}
                  product={relatedProduct}
                />
              ))
            ) : (
              <div className="col-span-full">
                <EmptyState
                  icon="🔍"
                  title="No related products"
                  description="We couldn't find any related products at this time."
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Suspense>
  );
}
