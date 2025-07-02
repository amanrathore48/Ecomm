"use client";

import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Heart, Minus, Plus, Share2, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import useCartStore from "@/stores/zustand-cart";
import useWishlistStore from "@/stores/useWishlist";

async function fetchProduct(productId) {
  try {
    const response = await fetch(`/api/products/${productId}`);
    if (!response.ok) throw new Error("Failed to fetch product");
    return response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default function ProductDetailPage({ params }) {
  const { productId } = params;
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isInWishlistLocal, setIsInWishlistLocal] = useState(false);
  const { data: session } = useSession();
  const { addItem: addToCart, loading: cartLoading } = useCartStore();
  const {
    addItem: addToWishlist,
    isInWishlist,
    loading: wishlistLoading,
  } = useWishlistStore();

  useEffect(() => {
    // If user is logged in, check if product is in wishlist
    if (session && product) {
      setIsInWishlistLocal(isInWishlist(product._id));
    }
  }, [session, product, isInWishlist]);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const data = await fetchProduct(productId);
        if (data?.product) {
          setProduct(data.product);
          setRelatedProducts(data.relatedProducts || []);
        } else {
          setError("Product not found");
          notFound();
        }
      } catch (err) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Images */}
        <div className="lg:w-1/2">
          <div className="aspect-square relative rounded-lg overflow-hidden">
            <Image
              src={product.images[activeImageIndex]}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-4 mt-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`relative w-20 h-20 rounded-lg overflow-hidden ${
                    index === activeImageIndex ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="lg:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < product.rating ? "fill-primary" : "fill-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-muted-foreground">
              {product.reviews?.length || 0} reviews
            </span>
          </div>

          <p className="text-2xl font-bold mb-6">${product.price.toFixed(2)}</p>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">
                {product.stock} available
              </span>
            </div>

            <div className="flex gap-4">
              <Button
                className="flex-1"
                size="lg"
                onClick={async () => {
                  try {
                    await addToCart(product, quantity);
                    toast({
                      title: "Added to Cart",
                      description: "Item has been added to your cart",
                    });
                  } catch (error) {
                    toast({
                      variant: "destructive",
                      title: "Error",
                      description:
                        error.message || "Failed to add item to cart",
                    });
                  }
                }}
                disabled={cartLoading}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {cartLoading ? "Adding..." : "Add to Cart"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                className={`h-12 w-12 ${
                  isInWishlistLocal ? "text-primary hover:text-primary" : ""
                }`}
                onClick={async () => {
                  try {
                    if (!session) {
                      toast({
                        title: "Login Required",
                        description:
                          "Please login to add items to your wishlist",
                        variant: "destructive",
                      });
                      return;
                    }
                    await addToWishlist(product);
                    setIsInWishlistLocal(!isInWishlistLocal);
                    toast({
                      title: isInWishlistLocal
                        ? "Removed from Wishlist"
                        : "Added to Wishlist",
                      description: isInWishlistLocal
                        ? "Item has been removed from your wishlist"
                        : "Item has been added to your wishlist",
                    });
                  } catch (error) {
                    toast({
                      variant: "destructive",
                      title: "Error",
                      description: error.message || "Failed to update wishlist",
                    });
                  }
                }}
                disabled={wishlistLoading}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isInWishlistLocal ? "fill-current" : ""
                  }`}
                />
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="description">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({product.reviews?.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <div className="prose max-w-none">
              <p>{product.description}</p>
            </div>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <div className="grid gap-4">
              {product.specifications?.map((spec, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg"
                >
                  <div className="font-medium">{spec.name}</div>
                  <div>{spec.value}</div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div key={review._id} className="border-b pb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{review.user.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "fill-primary" : "fill-muted"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2">{review.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No reviews yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
