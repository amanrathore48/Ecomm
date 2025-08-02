import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import dbConnect from "@/config/db";
import User from "@/models/User";

// GET /api/cart
export async function GET(request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email }).populate(
      "cart.product"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Transform cart items to client format with discount calculation
    const items = user.cart.map((item) => {
      const product = item.product;
      const originalPrice = product.price;
      const discount = product.discount || 0;
      const discountedPrice =
        discount > 0
          ? Math.round(originalPrice * (1 - discount / 100))
          : originalPrice;

      return {
        id: product._id.toString(),
        name: product.name,
        price: discountedPrice,
        originalPrice: originalPrice,
        discount: discount,
        image: product.mainImage || (product.images && product.images[0]),
        quantity: item.quantity,
      };
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("GET /api/cart error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

// POST /api/cart
export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { productId, quantity = 1 } = await request.json();
    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if product exists in cart
    const cartItemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (cartItemIndex > -1) {
      // Update quantity if product exists
      user.cart[cartItemIndex].quantity += quantity;
    } else {
      // Add new product to cart
      user.cart.push({
        product: productId,
        quantity,
      });
    }

    await user.save();

    // Fetch updated cart with populated products
    const updatedUser = await User.findById(user._id).populate("cart.product");

    // Transform cart items to client format with discount calculation
    const items = updatedUser.cart.map((item) => {
      const product = item.product;
      const originalPrice = product.price;
      const discount = product.discount || 0;
      const discountedPrice =
        discount > 0
          ? Math.round(originalPrice * (1 - discount / 100))
          : originalPrice;

      return {
        id: product._id.toString(),
        name: product.name,
        price: discountedPrice,
        originalPrice: originalPrice,
        discount: discount,
        image: product.mainImage || (product.images && product.images[0]),
        quantity: item.quantity,
      };
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("POST /api/cart error:", error);
    return NextResponse.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}

// PUT /api/cart
export async function PUT(request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { productId, quantity } = await request.json();
    if (!productId || quantity < 1) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update quantity
    const cartItemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (cartItemIndex === -1) {
      return NextResponse.json(
        { error: "Product not found in cart" },
        { status: 404 }
      );
    }

    user.cart[cartItemIndex].quantity = quantity;
    await user.save();

    // Fetch updated cart with populated products
    const updatedUser = await User.findById(user._id).populate("cart.product");

    // Transform cart items to client format with discount calculation
    const items = updatedUser.cart.map((item) => {
      const product = item.product;
      const originalPrice = product.price;
      const discount = product.discount || 0;
      const discountedPrice =
        discount > 0
          ? Math.round(originalPrice * (1 - discount / 100))
          : originalPrice;

      return {
        id: product._id.toString(),
        name: product.name,
        price: discountedPrice,
        originalPrice: originalPrice,
        discount: discount,
        image: product.mainImage || (product.images && product.images[0]),
        quantity: item.quantity,
      };
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("PUT /api/cart error:", error);
    return NextResponse.json(
      { error: "Failed to update cart" },
      { status: 500 }
    );
  }
}

// DELETE /api/cart
export async function DELETE(request) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    await dbConnect();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (productId) {
      // Remove specific product from cart
      user.cart = user.cart.filter(
        (item) => item.product.toString() !== productId
      );
    } else {
      // Clear entire cart
      user.cart = [];
    }

    await user.save();

    // Fetch updated cart with populated products
    const updatedUser = await User.findById(user._id).populate("cart.product");

    // Transform cart items to client format with discount calculation
    const items = updatedUser.cart.map((item) => {
      const product = item.product;
      const originalPrice = product.price;
      const discount = product.discount || 0;
      const discountedPrice =
        discount > 0
          ? Math.round(originalPrice * (1 - discount / 100))
          : originalPrice;

      return {
        id: product._id.toString(),
        name: product.name,
        price: discountedPrice,
        originalPrice: originalPrice,
        discount: discount,
        image: product.mainImage || (product.images && product.images[0]),
        quantity: item.quantity,
      };
    });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("DELETE /api/cart error:", error);
    return NextResponse.json(
      { error: "Failed to remove item from cart" },
      { status: 500 }
    );
  }
}
