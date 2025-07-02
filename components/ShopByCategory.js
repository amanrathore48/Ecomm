"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const ShopByCategory = ({ categories }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Shop By Category
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our collections across different categories and find exactly
            what you need
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              className="relative h-64 rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              whileHover={{ scale: 1.02 }}
            >
              {/* Background Image */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              </div>

              {/* Category Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <div className="flex items-center mb-1">
                  <span className="text-3xl mr-3">{category.icon}</span>
                  <h3 className="text-2xl font-bold">{category.name}</h3>
                </div>
                <p className="text-gray-200 text-sm mb-4 opacity-80">
                  {category.description}
                </p>
                <Link href={`/products?category=${category.id}`}>
                  <motion.div
                    className="inline-flex items-center py-2 px-4 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium hover:bg-white/30 transition-all"
                    whileHover={{ x: 5 }}
                    animate={{ x: hoveredIndex === index ? 5 : 0 }}
                  >
                    Browse Collection <ChevronRight className="ml-1 w-4 h-4" />
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
            >
              View All Categories
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
