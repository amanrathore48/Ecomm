"use client";

import React from "react";

export function TypographyShowcase() {
  return (
    <div className="container mx-auto py-12 px-4 space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif font-semibold mb-2">
          Typography Showcase
        </h1>
        <p className="text-lg text-gray-600">
          Demonstrating the new font system
        </p>
      </div>

      <section className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h2 className="text-2xl font-serif border-b pb-2">Font Families</h2>

          <div className="space-y-4">
            <div className="p-4 bg-white shadow rounded">
              <h3 className="text-lg font-medium mb-2">Font Sans (Poppins)</h3>
              <p className="font-sans">
                The quick brown fox jumps over the lazy dog.
                <span className="block mt-2 font-light">Light weight</span>
                <span className="block font-normal">Normal weight</span>
                <span className="block font-medium">Medium weight</span>
                <span className="block font-semibold">Semibold weight</span>
                <span className="block font-bold">Bold weight</span>
              </p>
            </div>

            <div className="p-4 bg-white shadow rounded">
              <h3 className="text-lg font-medium mb-2">
                Font Serif (Playfair Display)
              </h3>
              <p className="font-serif">
                The quick brown fox jumps over the lazy dog.
                <span className="block mt-2 font-normal">Normal weight</span>
                <span className="block font-medium">Medium weight</span>
                <span className="block font-semibold">Semibold weight</span>
                <span className="block font-bold">Bold weight</span>
              </p>
            </div>

            <div className="p-4 bg-white shadow rounded">
              <h3 className="text-lg font-medium mb-2">
                Font Mono (Source Code Pro)
              </h3>
              <p className="font-mono">
                The quick brown fox jumps over the lazy dog.
                <span className="block mt-2 font-normal">Normal weight</span>
                <span className="block font-medium">Medium weight</span>
                <span className="block font-semibold">Semibold weight</span>
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-serif border-b pb-2">Heading Styles</h2>

          <div className="space-y-4">
            <div className="p-4 bg-white shadow rounded">
              <h1 className="font-serif">Heading 1 (h1)</h1>
              <h2 className="font-serif">Heading 2 (h2)</h2>
              <h3 className="font-serif">Heading 3 (h3)</h3>
              <h4 className="font-serif">Heading 4 (h4)</h4>
              <h5 className="font-serif">Heading 5 (h5)</h5>
              <h6 className="font-serif">Heading 6 (h6)</h6>
            </div>

            <div className="p-4 bg-white shadow rounded">
              <h3 className="text-lg font-medium mb-2">Font Size Classes</h3>
              <p className="text-xs">Extra Small Text (text-xs)</p>
              <p className="text-sm">Small Text (text-sm)</p>
              <p className="text-base">Base Text (text-base)</p>
              <p className="text-lg">Large Text (text-lg)</p>
              <p className="text-xl">Extra Large Text (text-xl)</p>
              <p className="text-2xl">2XL Text (text-2xl)</p>
              <p className="text-3xl">3XL Text (text-3xl)</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 p-6 bg-white shadow rounded">
        <h2 className="text-2xl font-serif mb-4">Example Content</h2>

        <div className="prose max-w-none">
          <h2 className="font-serif">Product Title Example</h2>
          <p>
            This is an example of how product descriptions would look using our
            new typography system. The main body text uses{" "}
            <strong className="font-sans">Poppins</strong> for optimal
            readability.
          </p>

          <h3 className="font-serif mt-4">Section Heading</h3>
          <p>
            Features and benefits are clearly presented with proper hierarchy.
            The <strong className="font-serif">Playfair Display</strong> font
            adds an elegant touch to headings and important elements.
          </p>

          <div className="mt-4 p-3 bg-gray-50 rounded-md">
            <code className="font-mono text-sm">Product SKU: 12345-ABCDEF</code>
            <p className="font-mono text-xs mt-2">
              Technical specifications and code references use the monospace
              font.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
