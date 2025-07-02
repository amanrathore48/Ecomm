import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Users,
  TrendingUp,
  Heart,
  Package,
  ThumbsUp,
  ShieldCheck,
  Truck,
  Headphones,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About Us | Ecomm",
  description:
    "Learn more about our company, mission, and the team behind Ecomm",
};

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <div className="relative bg-blue-600 dark:bg-blue-700 text-white py-24">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-pattern bg-repeat"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Ecomm.
            </h1>
            <p className="text-xl opacity-90">
              Your trusted destination for quality products and exceptional
              shopping experiences since 2023.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <div className="inline-block px-4 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold rounded-full mb-4">
                Our Story
              </div>
              <h2 className="text-3xl font-bold mb-6">
                The journey of excellence
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Founded in 2023, Ecomm was born out of a passion to provide
                customers with high-quality products at affordable prices. What
                started as a small online store has grown into a trusted
                e-commerce destination loved by thousands.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We believe that shopping should be easy, enjoyable, and
                accessible to everyone. Our team works tirelessly to curate a
                selection of products that meet our high standards for quality,
                design, and value.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                As we continue to grow, our commitment to customer satisfaction
                remains our top priority. We're constantly improving our
                platform and expanding our product range to better serve our
                loyal customers.
              </p>
            </div>
            <div className="relative h-[450px] rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/formimg.jpg"
                alt="Team working together"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Our values */}
          <div className="mb-20">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
              <p className="text-muted-foreground">
                These principles guide everything we do to ensure we deliver the
                best possible experience for our customers.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "Quality Assurance",
                  description:
                    "We never compromise on quality. Every product undergoes rigorous quality checks before reaching you.",
                  icon: ShieldCheck,
                  color: "text-blue-500",
                  bgColor: "bg-blue-500/10",
                },
                {
                  title: "Customer First",
                  description:
                    "Your satisfaction is our priority. We're committed to providing exceptional service at every step.",
                  icon: Headphones,
                  color: "text-purple-500",
                  bgColor: "bg-purple-500/10",
                },
                {
                  title: "Fast Delivery",
                  description:
                    "Quick and reliable shipping worldwide. Track your orders in real-time from purchase to delivery.",
                  icon: Truck,
                  color: "text-green-500",
                  bgColor: "bg-green-500/10",
                },
              ].map((value, index) => (
                <div
                  key={index}
                  className="group bg-card hover:bg-accent transition-all duration-300 rounded-xl p-6 border hover:border-accent shadow-sm hover:shadow-md"
                >
                  <div
                    className={`${value.bgColor} ${value.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}
                  >
                    <value.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Team */}
          <div className="mb-20">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
              <p className="text-muted-foreground">
                The passionate individuals behind Ecomm who work tirelessly to
                bring you the best shopping experience.
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  name: "Alex Johnson",
                  role: "CEO & Founder",
                  image: "/images/team/alex.jpg",
                  linkedin: "#",
                },
                {
                  name: "Sarah Williams",
                  role: "Chief Operating Officer",
                  image: "/images/team/sarah.jpg",
                  linkedin: "#",
                },
                {
                  name: "Michael Chen",
                  role: "Head of Product",
                  image: "/images/team/michael.jpg",
                  linkedin: "#",
                },
                {
                  name: "Emma Rodriguez",
                  role: "Customer Experience Lead",
                  image: "/images/team/emma.jpg",
                  linkedin: "#",
                },
              ].map((member, index) => (
                <div
                  key={index}
                  className="group text-center bg-card hover:bg-accent/5 transition-all duration-300 rounded-xl p-6"
                >
                  <div className="mb-6 mx-auto relative h-[180px] w-[180px] rounded-full overflow-hidden ring-2 ring-offset-2 ring-offset-background ring-primary/10 group-hover:ring-primary/30 transition-all duration-300">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                  <p className="text-muted-foreground mb-4">{member.role}</p>
                  <a
                    href={member.linkedin}
                    className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    Connect on LinkedIn
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Call to action */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-12 text-center">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                Ready to Start Shopping?
              </h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto text-white/90">
                Join thousands of satisfied customers and experience the
                difference that quality products and exceptional service can
                make.
              </p>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="font-semibold hover:scale-105 transition-transform"
              >
                <Link href="/products">
                  Browse Our Products
                  <ShoppingBag className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
