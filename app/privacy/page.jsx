"use client";

import React from "react";
import { Helmet } from "react-helmet";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <Helmet>
        <title>Privacy Policy - Ecomm</title>
        <meta
          name="description"
          content="Privacy Policy for Ecomm - Learn how we collect, use, and protect your personal information."
        />
      </Helmet>

      <h1 className="text-3xl font-bold mb-8 text-center">Privacy Policy</h1>

      <div className="prose prose-blue dark:prose-invert max-w-none">
        <p className="text-lg mb-6">Last updated: July 19, 2025</p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Introduction</h2>
        <p>
          At Ecomm ("we," "us," or "our"), we respect your privacy and are
          committed to protecting your personal information. This Privacy Policy
          explains how we collect, use, disclose, and safeguard your information
          when you visit our website or make a purchase.
        </p>
        <p>
          Please read this Privacy Policy carefully. If you do not agree with
          the terms of this Privacy Policy, please do not access the site.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Information We Collect
        </h2>
        <p>We may collect the following types of information:</p>
        <ul>
          <li>
            <strong>Personal Information:</strong> Name, email address, shipping
            address, billing address, phone number, and payment information.
          </li>
          <li>
            <strong>Transaction Information:</strong> Products purchased, dates,
            and payment methods.
          </li>
          <li>
            <strong>Usage Information:</strong> How you interact with our
            website, including pages visited, time spent, and clicks.
          </li>
          <li>
            <strong>Technical Information:</strong> IP address, browser type,
            operating system, and device information.
          </li>
          <li>
            <strong>Marketing Preferences:</strong> Your preferences for
            receiving marketing communications.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          How We Use Your Information
        </h2>
        <p>We may use your information for the following purposes:</p>
        <ul>
          <li>Process and fulfill your orders</li>
          <li>Manage your account</li>
          <li>Send transactional emails</li>
          <li>Provide customer support</li>
          <li>Improve our website and products</li>
          <li>Personalize your shopping experience</li>
          <li>Send marketing communications (with consent)</li>
          <li>Comply with legal obligations</li>
          <li>Prevent fraud and enhance security</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Information Sharing
        </h2>
        <p>We may share your information with:</p>
        <ul>
          <li>
            <strong>Service Providers:</strong> Payment processors, shipping
            companies, marketing services, etc.
          </li>
          <li>
            <strong>Business Partners:</strong> When necessary to provide
            services you've requested.
          </li>
          <li>
            <strong>Legal Requirements:</strong> To comply with law, regulation,
            or legal process.
          </li>
          <li>
            <strong>Business Transfers:</strong> In connection with a merger,
            acquisition, or sale of assets.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Cookies and Tracking Technologies
        </h2>
        <p>
          We use cookies and similar tracking technologies to track activity on
          our website and hold certain information. Cookies are files with a
          small amount of data that may include an anonymous unique identifier.
          You can instruct your browser to refuse all cookies or to indicate
          when a cookie is being sent.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to
          protect the security of your personal information. However, please be
          aware that no security measures are perfect or impenetrable.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
        <p>Depending on your location, you may have the following rights:</p>
        <ul>
          <li>Access to your personal information</li>
          <li>Correction of inaccurate information</li>
          <li>Deletion of your information</li>
          <li>Restriction or objection to processing</li>
          <li>Data portability</li>
          <li>Withdrawal of consent</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Children's Privacy</h2>
        <p>
          Our website is not intended for children under 16 years of age. We do
          not knowingly collect personal information from children.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">
          Changes to This Privacy Policy
        </h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page and
          updating the "Last updated" date.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us
          at:
        </p>
        <address className="not-italic">
          <p>Email: privacy@ecomm.com</p>
          <p>Phone: +1 (234) 567-8900</p>
          <p>Address: 123 Commerce St, Shopping City, SC 12345</p>
        </address>
      </div>
    </div>
  );
}
