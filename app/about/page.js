"use client";
import React, { useState, useEffect } from "react";
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
  Star,
  CheckCircle,
  Globe,
  Zap,
  ArrowRight,
  Play,
  Quote,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Sparkles,
} from "lucide-react";

const ModernAboutPage = () => {
  const [activeValue, setActiveValue] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const stats = [
    { number: "50K+", label: "Happy Customers", icon: Users },
    { number: "10K+", label: "Products Sold", icon: Package },
    { number: "99.5%", label: "Satisfaction Rate", icon: ThumbsUp },
    { number: "24/7", label: "Customer Support", icon: Headphones },
  ];

  const values = [
    {
      title: "Quality First",
      description:
        "Every product undergoes rigorous testing and quality assurance before reaching our customers.",
      icon: ShieldCheck,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
      features: ["Premium Materials", "Quality Testing", "Certified Products"],
    },
    {
      title: "Customer Obsessed",
      description:
        "Your satisfaction drives everything we do. We listen, adapt, and continuously improve.",
      icon: Heart,
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-500/10",
      features: ["24/7 Support", "Easy Returns", "Personal Service"],
    },
    {
      title: "Lightning Fast",
      description:
        "Quick delivery and seamless shopping experience that saves your valuable time.",
      icon: Zap,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-500/10",
      features: ["Same Day Delivery", "Real-time Tracking", "Express Checkout"],
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Verified Customer",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b6639a87?w=400&h=400&fit=crop&crop=face",
      quote:
        "Exceptional quality and service! Every purchase has exceeded my expectations.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Business Owner",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      quote:
        "Fast delivery and outstanding customer support. Highly recommend!",
      rating: 5,
    },
    {
      name: "Emma Rodriguez",
      role: "Loyal Customer",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      quote:
        "The best shopping experience I've ever had. Quality products at great prices.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900">
          <div className="absolute inset-0">
            {/* Floating particles */}
            <div className="absolute top-20 left-20 w-2 h-2 bg-white/20 rounded-full animate-pulse"></div>
            <div className="absolute top-40 right-32 w-1 h-1 bg-blue-400/30 rounded-full animate-ping"></div>
            <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-purple-400/20 rounded-full animate-bounce"></div>

            {/* Gradient orbs */}
            <div className="absolute top-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-tr from-purple-500/30 to-pink-500/30 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-24 lg:py-36 pb-36">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-8">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="text-white/90 text-sm font-medium">
                Trusted since 2023
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-6 leading-tight">
              About Ecomm
            </h1>

            {/* Subtitle */}
            <p className="text-xl lg:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              Your trusted destination for quality products and exceptional
              shopping experiences.
              <span className="text-blue-300 font-semibold">
                {" "}
                Loved by 50,000+ customers worldwide.
              </span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-semibold text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl">
                <span className="relative z-10 flex items-center gap-2">
                  Start Shopping
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>

              <button className="group flex items-center gap-3 px-6 py-4 text-white/90 hover:text-white font-semibold transition-colors">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Play className="w-5 h-5 ml-0.5" />
                </div>
                <span>Watch Our Story</span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Stats - Now positioned to overlap sections */}
        <div className="relative z-20 container mx-auto px-4 -mt-24 mb-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group relative transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-white/20 dark:border-gray-700/30 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl h-full">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-4 mx-auto transform group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-blue-200 bg-clip-text text-transparent mb-1">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="container mx-auto px-4 pt-8 pb-20 lg:pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full mb-6">
                  <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-blue-700 dark:text-blue-300 font-semibold text-sm">
                    Our Journey
                  </span>
                </div>

                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                  Crafting Excellence Since 2023
                </h2>

                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  What began as a simple vision has evolved into a thriving
                  marketplace trusted by thousands. We started with a commitment
                  to quality, transparency, and exceptional customer service.
                </p>

                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  Today, we're proud to be your go-to destination for carefully
                  curated products that enhance your lifestyle while delivering
                  value that exceeds expectations.
                </p>
              </div>

              {/* Key Achievements */}
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: "Countries Served", value: "25+" },
                  { label: "Years of Excellence", value: "2+" },
                  { label: "Product Categories", value: "100+" },
                  { label: "Team Members", value: "50+" },
                ].map((achievement, index) => (
                  <div
                    key={index}
                    className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {achievement.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                      {achievement.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-700">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
                  alt="Team collaboration"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">
                      Award Winning
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Customer Service
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Values Section */}
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full mb-6">
                <Heart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-blue-700 dark:text-blue-300 font-semibold text-sm">
                  Our Values
                </span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                What Drives Us Forward
              </h2>

              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                These core principles guide every decision we make and every
                interaction we have with our customers.
              </p>
            </div>

            {/* Values Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="group relative cursor-pointer"
                  onMouseEnter={() => setActiveValue(index)}
                >
                  <div
                    className={`absolute -inset-1 bg-gradient-to-r ${value.color} rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-500`}
                  ></div>

                  <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 h-full">
                    {/* Icon */}
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${value.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <value.icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                      {value.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-3">
                      {value.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center gap-3"
                        >
                          <CheckCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-200 font-medium">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Testimonials */}
      <div className="py-20 lg:py-32 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-full mb-6">
                <Quote className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-purple-700 dark:text-purple-300 font-semibold text-sm">
                  Testimonials
                </span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                What Our Customers Say
              </h2>

              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Don't just take our word for it. Here's what real customers have
                to say about their experience.
              </p>
            </div>

            {/* Testimonials Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>

                  <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full">
                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-gray-700 dark:text-gray-200 mb-6 leading-relaxed italic">
                      "{testimonial.quote}"
                    </blockquote>

                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700"
                      />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CTA Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900 py-20 lg:py-32 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>

          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-grid-white/[0.01] bg-[size:20px_20px]"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-8 shadow-lg">
              <ShoppingBag className="w-4 h-4 text-blue-300" />
              <span className="text-white/90 text-sm font-medium">
                Ready to Shop?
              </span>
            </div>

            <h2 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent mb-6 leading-tight">
              Start Your Journey With Us
            </h2>

            <p className="text-xl lg:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of satisfied customers and discover why Ecomm is
              the perfect choice for all your shopping needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href="/products"
                className="group relative inline-flex px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl font-semibold text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Browse Products
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>

              <a
                href="/contact"
                className="group relative inline-flex px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl font-semibold text-white hover:bg-white/20 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <span className="flex items-center gap-2">
                  Contact Us
                  <Mail className="w-5 h-5" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernAboutPage;
