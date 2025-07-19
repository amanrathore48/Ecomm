"use client";

import React from "react";
import { Helmet } from "react-helmet";

export default function RefundPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Helmet>
        <title>Refund Policy - Ecomm</title>
        <meta
          name="description"
          content="Refund Policy for Ecomm - Learn about our returns, exchanges, and refund process."
        />
      </Helmet>

      <h1 className="text-3xl font-bold mb-8 text-center">Refund Policy</h1>

      <div className="prose prose-blue dark:prose-invert max-w-none">
        <p className="text-lg mb-6">Last updated: July 19, 2025</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Return Policy</h2>
        <p>
          At Ecomm, we want you to be completely satisfied with your purchase.
          If you're not entirely happy with your order, we're here to help.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Return Eligibility</h2>
        <p>
          You may return most items purchased from Ecomm within 30 days of
          delivery for a full refund, provided that:
        </p>
        <ul>
          <li>The item is in its original condition</li>
          <li>The item is in its original packaging</li>
          <li>All tags, labels, and accessories are included</li>
          <li>You have proof of purchase (order number or receipt)</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Non-Returnable Items
        </h2>
        <p>The following items cannot be returned:</p>
        <ul>
          <li>Gift cards</li>
          <li>Downloadable software or digital products</li>
          <li>Personalized or custom-made items</li>
          <li>
            Intimate apparel and hygiene products (for health and hygiene
            reasons)
          </li>
          <li>Perishable goods</li>
          <li>Items marked as "final sale" or "non-returnable"</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Return Process</h2>
        <p>To initiate a return, please follow these steps:</p>
        <ol>
          <li>Log in to your account and go to your order history</li>
          <li>Select the order containing the item(s) you wish to return</li>
          <li>Click "Return Items" and follow the instructions</li>
          <li>
            Print the return shipping label (if provided) and affix it to your
            package
          </li>
          <li>
            Ship the package using the carrier specified in the return
            instructions
          </li>
        </ol>
        <p>
          Alternatively, you can contact our customer service team at
          returns@ecomm.com or call +1 (234) 567-8900 for assistance with your
          return.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Return Shipping</h2>
        <p>
          For standard returns, you are responsible for return shipping costs,
          unless the return is due to our error (you received an incorrect or
          defective item).
        </p>
        <p>
          We recommend using a trackable shipping service and purchasing
          shipping insurance for items of value, as we cannot be responsible for
          items lost or damaged in transit.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Exchanges</h2>
        <p>
          If you need to exchange an item for a different size, color, or
          product, please return the original item and place a new order for the
          desired item. This ensures faster processing.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Refund Processing</h2>
        <p>
          Once we receive and inspect your return, we will notify you about the
          status of your refund.
        </p>
        <p>
          If approved, your refund will be processed within 3-5 business days,
          and a credit will automatically be applied to your original payment
          method.
        </p>
        <p>
          Please note that it may take an additional 5-10 business days for the
          refund to appear in your account, depending on your payment provider's
          policies.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Late or Missing Refunds
        </h2>
        <p>
          If you haven't received your refund within two weeks of our
          confirmation email, please check your bank account again, then contact
          your credit card company or bank, as it may take some time for the
          refund to be officially posted.
        </p>
        <p>
          If you've done all of this and still haven't received your refund,
          please contact our customer service team.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Damaged or Defective Items
        </h2>
        <p>
          If you receive a damaged or defective item, please contact us
          immediately at support@ecomm.com with photos of the damaged item. We
          will provide a prepaid return shipping label and process a replacement
          or refund as soon as possible.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Sale Items</h2>
        <p>
          Only regularly priced items may be refunded. Sale items can only be
          exchanged for the same item in a different size or color, subject to
          availability.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Changes to this Policy
        </h2>
        <p>
          We may update this Refund Policy from time to time to reflect changes
          in our practices or for other operational, legal, or regulatory
          reasons.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p>
          If you have any questions about our Refund Policy, please contact us
          at:
        </p>
        <address className="not-italic">
          <p>Email: returns@ecomm.com</p>
          <p>Phone: +1 (234) 567-8900</p>
          <p>Address: 123 Commerce St, Shopping City, SC 12345</p>
        </address>
      </div>
    </div>
  );
}
