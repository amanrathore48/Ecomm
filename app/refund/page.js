import Link from "next/link";

export const metadata = {
  title: "Refund & Return Policy",
  description:
    "Our refund and return policy - details about how to return products and get refunds.",
};

export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Refund & Return Policy</h1>

        <div className="prose max-w-none">
          <p className="lead">Last updated: May 1, 2023</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Returns</h2>
          <p>
            We want you to be completely satisfied with your purchase. If you're
            not entirely happy with your order, we're here to help.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-2">
            1.1 Return Eligibility
          </h3>
          <p>
            You may request a return within 30 days of receiving your order. To
            be eligible for a return, your item must be in the same condition
            that you received it, unworn or unused, with tags, and in its
            original packaging.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-2">
            1.2 Non-Returnable Items
          </h3>
          <p>The following items cannot be returned:</p>
          <ul className="list-disc pl-6 my-4">
            <li>Gift cards</li>
            <li>Downloadable software products</li>
            <li>Personal care items that have been opened or used</li>
            <li>Perishable goods</li>
            <li>Custom products that have been made to your specifications</li>
            <li>Products marked as "non-returnable" at the time of purchase</li>
          </ul>

          <h3 className="text-xl font-medium mt-6 mb-2">1.3 Return Process</h3>
          <p>To initiate a return, please follow these steps:</p>
          <ol className="list-decimal pl-6 my-4">
            <li>
              Contact our customer service at{" "}
              <a
                href="mailto:returns@example.com"
                className="text-primary hover:underline"
              >
                returns@example.com
              </a>{" "}
              or through our{" "}
              <Link href="/contact" className="text-primary hover:underline">
                contact form
              </Link>
            </li>
            <li>Include your order number and the reason for the return</li>
            <li>
              Our team will provide a Return Merchandise Authorization (RMA)
              number and return instructions
            </li>
            <li>
              Package the item securely with all the original packaging and tags
            </li>
            <li>Include the RMA number on the outside of the package</li>
            <li>
              Ship the return to the address provided in the return instructions
            </li>
          </ol>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Refunds</h2>

          <h3 className="text-xl font-medium mt-6 mb-2">2.1 Refund Process</h3>
          <p>
            Once your return is received and inspected, we will send you an
            email to notify you that we have received your returned item. We
            will also notify you of the approval or rejection of your refund.
          </p>
          <p>
            If approved, your refund will be processed, and a credit will
            automatically be applied to your original method of payment within
            10 business days. Please note that depending on your card issuer, it
            may take an additional 2-10 business days for the refund to appear
            in your account.
          </p>

          <h3 className="text-xl font-medium mt-6 mb-2">2.2 Refund Methods</h3>
          <p>
            Refunds will be issued using the same payment method used for the
            original purchase:
          </p>
          <ul className="list-disc pl-6 my-4">
            <li>Credit/Debit Card: Refunded to the original card used</li>
            <li>PayPal: Refunded to your PayPal account</li>
            <li>Store Credit: Issued as additional store credit</li>
            <li>Gift Cards: Refunded as store credit</li>
          </ul>

          <h3 className="text-xl font-medium mt-6 mb-2">2.3 Partial Refunds</h3>
          <p>Partial refunds may be granted in the following cases:</p>
          <ul className="list-disc pl-6 my-4">
            <li>Items returned with obvious signs of use</li>
            <li>Items missing parts or accessories</li>
            <li>Items damaged due to customer mishandling</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. Exchanges</h2>
          <p>
            If you need to exchange an item for the same product in a different
            size or color, please follow the return process above and specify
            your exchange request when contacting our customer service.
          </p>
          <p>
            If the desired exchange item is more expensive than your original
            purchase, you will be responsible for the price difference. If it's
            less expensive, we will refund the difference using your original
            payment method.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            4. Shipping Costs
          </h2>
          <p>
            You are responsible for the cost of returning the item. Shipping
            costs are non-refundable.
          </p>
          <p>
            In cases where an item is received damaged or defective, we will
            reimburse reasonable return shipping costs. Please contact our
            customer service for approval before shipping.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            5. Late or Missing Refunds
          </h2>
          <p>
            If you haven't received your refund within the timeframe specified
            above, please check your bank account again or contact your credit
            card company, as it may take some time for the refund to be
            officially posted.
          </p>
          <p>
            If you've followed these steps and still have not received your
            refund, please contact us at{" "}
            <a
              href="mailto:support@example.com"
              className="text-primary hover:underline"
            >
              support@example.com
            </a>
            .
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. Sale Items</h2>
          <p>
            Regular return policy applies to sale items. Note that items marked
            as "Final Sale" cannot be returned or exchanged.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            7. Defective Items
          </h2>
          <p>
            If you receive a defective item, please contact our customer service
            immediately. We will work with you to resolve the issue and provide
            a replacement or refund as appropriate.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            8. Changes to Refund Policy
          </h2>
          <p>
            We reserve the right to modify this refund policy at any time.
            Changes will be posted on this page with an updated revision date.
          </p>
        </div>

        <div className="mt-12 border-t pt-8">
          <p className="text-sm text-muted-foreground">
            If you have any questions about our Refund Policy, please contact us
            at{" "}
            <a
              href="mailto:support@example.com"
              className="text-primary hover:underline"
            >
              support@example.com
            </a>{" "}
            or call us at 1-800-123-4567.
          </p>
        </div>

        <div className="mt-8">
          <Link
            href="/contact"
            className="text-primary hover:underline font-medium"
          >
            Contact Us
          </Link>
          {" | "}
          <Link
            href="/terms"
            className="text-primary hover:underline font-medium"
          >
            Terms of Service
          </Link>
          {" | "}
          <Link
            href="/privacy"
            className="text-primary hover:underline font-medium"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
