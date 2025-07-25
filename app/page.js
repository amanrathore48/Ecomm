import { Button } from "@/components/ui/button";
import Link from "next/link";
import FeaturedProducts from "@/components/FeaturedProducts";
import ShopByCategory from "@/components/ShopByCategory";
import { HeroSection } from "@/components/Hero";

// Categories for the shop by category section
const categories = [
  {
    id: "electronics",
    name: "Electronics",
    icon: "🖥️",
    image:
      "https://images.unsplash.com/photo-1593344484962-796055d4a3a4?q=80&w=1000&auto=format&fit=crop",
    description: "Latest gadgets and tech essentials",
  },
  {
    id: "clothing",
    name: "Clothing",
    icon: "👕",
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=1000&auto=format&fit=crop",
    description: "Trendy fashion for all seasons",
  },
  {
    id: "books",
    name: "Books",
    icon: "📚",
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=1000&auto=format&fit=crop",
    description: "Bestsellers and literary classics",
  },
  {
    id: "home",
    name: "Home",
    icon: "🏠",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000&auto=format&fit=crop",
    description: "Beautiful decor and essentials",
  },
  {
    id: "beauty",
    name: "Beauty",
    icon: "💄",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1000&auto=format&fit=crop",
    description: "Premium skincare and makeup",
  },
  {
    id: "sports",
    name: "Sports",
    icon: "⚽",
    image:
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=1000&auto=format&fit=crop",
    description: "Equipment for every athlete",
  },
];

// Featured Products Section Component
function FeaturedProductsSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            <span className="relative">
              Featured Products
              <span className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-primary/70 rounded"></span>
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of premium products that represent
            the best in quality and value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Featured products will be displayed here - component will hide itself if empty */}
          <FeaturedProducts hideWhenEmpty={true} />
        </div>
      </div>
    </section>
  );
}

export const metadata = {
  title: "Ecomm. - Shopping made easier",
  description: "Your one-stop shop for all your shopping needs",
};

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      {/* <section className="bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-20 lg:py-32 flex flex-col lg:flex-row items-center">
          <div className="lg:w-1/2 lg:pr-10 mb-10 lg:mb-0">
            <div className="bg-primary/15 text-primary font-medium px-4 py-1 rounded-full text-sm inline-block mb-4 border border-primary/20">
              Premium Quality Products
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground">
              <span className="text-transparent bg-gradient-to-r from-primary to-primary/80 bg-clip-text">
                Find Your Perfect Style at
              </span>
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent inline-block mt-2">
                Ecomm.
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Discover a wide range of products with excellent quality at
              affordable prices. Shop with confidence and enjoy a seamless
              experience.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white font-medium"
                asChild
              >
                <Link href="/products">Shop Now</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary/10"
                asChild
              >
                <Link href="/products">Explore Categories</Link>
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="relative">
              <img
                src="/slide.jpg"
                alt="Hero Image"
                className="rounded-lg shadow-2xl"
                width="600"
                height="400"
              />
              <div className="absolute -bottom-5 -right-5 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
                <p className="font-bold text-lg">Special Offer</p>
                <p className="text-primary">Up to 40% Off</p>
              </div>
            </div>
          </div>
        </div>
      </section> */}
      <HeroSection />

      {/* Featured Products Section - Only shown if there are products */}
      <FeaturedProductsSection />

      {/* Interactive Shop By Category - Always visible */}
      <ShopByCategory categories={categories} />
    </main>
  );
}
