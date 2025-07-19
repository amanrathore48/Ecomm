"use client";

import React from "react";
import { Helmet } from "react-helmet";

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Helmet>
        <title>Terms of Service - Ecomm</title>
        <meta
          name="description"
          content="Terms of Service for Ecomm - The agreement between you and us when using our online store."
        />
      </Helmet>

      <h1 className="text-3xl font-bold mb-8 text-center">Terms of Service</h1>

      <div className="prose prose-blue dark:prose-invert max-w-none">
        <p className="text-lg mb-6">Last updated: July 19, 2025</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Introduction</h2>
        <p>
          These Terms of Service ("Terms") govern your use of the Ecomm website
          and services (the "Service") operated by Ecomm Inc. ("us", "we", or
          "our").
        </p>
        <p>
          By accessing or using the Service, you agree to be bound by these
          Terms. If you disagree with any part of the Terms, you may not access
          the Service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Account Registration
        </h2>
        <p>
          When you create an account with us, you must provide accurate,
          complete, and up-to-date information. You are solely responsible for
          safeguarding your password and for all activities that occur under
          your account.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Products and Purchases
        </h2>
        <p>
          All products are subject to availability. We reserve the right to
          limit quantities, discontinue products, or modify product
          specifications at any time without notice.
        </p>
        <p>
          Product prices are subject to change without notice. We are not
          responsible for typographical errors in prices or product
          descriptions.
        </p>
        <p>
          By placing an order, you represent that you are authorized to use the
          chosen payment method, and the billing information you provide is
          accurate.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Shipping and Delivery
        </h2>
        <p>
          Delivery times are estimates and are not guaranteed. We are not
          responsible for delays caused by carriers, customs, or other factors
          outside our control.
        </p>
        <p>
          Risk of loss and title for items purchased pass to you upon delivery
          to the carrier. You are responsible for filing any claims with
          carriers for damaged or lost shipments.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Returns and Refunds
        </h2>
        <p>
          Our return policy allows returns within 30 days of receipt for most
          items. Some products are not eligible for return, as specified in our
          Return Policy.
        </p>
        <p>
          To be eligible for a return, your item must be unused, in the same
          condition you received it, and in the original packaging.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Intellectual Property
        </h2>
        <p>
          The Service and its original content, features, and functionality are
          and will remain the exclusive property of Ecomm Inc. and its
          licensors. The Service is protected by copyright, trademark, and other
          laws.
        </p>
        <p>
          You may not copy, modify, distribute, sell, or lease any part of the
          Service without our express written permission.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">User Content</h2>
        <p>
          When you submit content to our Service (such as product reviews or
          comments), you grant us a non-exclusive, worldwide, royalty-free
          license to use, reproduce, modify, adapt, publish, translate, and
          distribute it.
        </p>
        <p>
          You are solely responsible for any content you post and its legality,
          reliability, and appropriateness.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Prohibited Uses</h2>
        <p>
          You may not use our Service for any illegal or unauthorized purpose,
          including but not limited to:
        </p>
        <ul>
          <li>Violating any laws or regulations</li>
          <li>Infringing on intellectual property rights</li>
          <li>Transmitting harmful code or malware</li>
          <li>Attempting to gain unauthorized access to our systems</li>
          <li>Interfering with other users' enjoyment of the Service</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Disclaimer of Warranties
        </h2>
        <p>
          The Service is provided "as is" and "as available" without warranties
          of any kind, either express or implied. We do not guarantee that the
          Service will be uninterrupted, secure, or error-free.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Limitation of Liability
        </h2>
        <p>
          In no event shall Ecomm Inc., its directors, employees, partners,
          agents, suppliers, or affiliates be liable for any indirect,
          incidental, special, consequential, or punitive damages resulting from
          your use of the Service.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Governing Law</h2>
        <p>
          These Terms shall be governed by the laws of the United States,
          without regard to its conflict of law provisions.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to Terms</h2>
        <p>
          We reserve the right to modify or replace these Terms at any time. We
          will provide notice of significant changes by posting the new Terms on
          our website.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at:
        </p>
        <address className="not-italic">
          <p>Email: legal@ecomm.com</p>
          <p>Phone: +1 (234) 567-8900</p>
          <p>Address: 123 Commerce St, Shopping City, SC 12345</p>
        </address>
      </div>
    </div>
  );
}
