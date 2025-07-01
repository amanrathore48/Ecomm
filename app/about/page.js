import Image from "next/image";

export const metadata = {
  title: "About Us",
  description: "Learn more about our company and mission",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto">
        {/* Hero section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Ecomm.</h1>
          <p className="text-xl text-muted-foreground">
            Your trusted destination for quality products and exceptional
            shopping experiences.
          </p>
        </div>

        {/* Our story */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-lg mb-4">
              Founded in 2023, Ecomm was born out of a passion to provide
              customers with high-quality products at affordable prices. What
              started as a small online store has grown into a trusted
              e-commerce destination.
            </p>
            <p className="text-lg mb-4">
              We believe that shopping should be easy, enjoyable, and accessible
              to everyone. Our team works tirelessly to curate a selection of
              products that meet our high standards for quality, design, and
              value.
            </p>
            <p className="text-lg">
              As we continue to grow, our commitment to customer satisfaction
              remains our top priority. We're constantly improving our platform
              and expanding our product range to better serve our loyal
              customers.
            </p>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src="/formimg.jpg"
              alt="Team working together"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Our values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Quality",
                description:
                  "We never compromise on quality. Every product on our platform undergoes rigorous quality checks.",
                icon: "🌟",
              },
              {
                title: "Customer First",
                description:
                  "Our customers are at the heart of everything we do. We're committed to providing exceptional service.",
                icon: "💼",
              },
              {
                title: "Transparency",
                description:
                  "We believe in being open and honest with our customers about our products and processes.",
                icon: "🔍",
              },
            ].map((value, index) => (
              <div key={index} className="bg-card rounded-lg p-6 border">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                name: "Alex Johnson",
                role: "CEO & Founder",
                image: "https://via.placeholder.com/150",
              },
              {
                name: "Sarah Williams",
                role: "Chief Operating Officer",
                image: "https://via.placeholder.com/150",
              },
              {
                name: "Michael Chen",
                role: "Head of Product",
                image: "https://via.placeholder.com/150",
              },
              {
                name: "Emma Rodriguez",
                role: "Customer Experience Lead",
                image: "https://via.placeholder.com/150",
              },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 mx-auto relative h-[150px] w-[150px] rounded-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="bg-primary/10 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Join our growing community of satisfied customers
          </h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Start shopping today and experience the difference that quality
            products and exceptional service can make.
          </p>
          <a
            href="/products"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Shop Now
          </a>
        </div>
      </div>
    </div>
  );
}
