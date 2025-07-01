import dbConnect from "@/config/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  const { name, email, password } = await request.json();
  try {
    await dbConnect();
    const existing = await User.findOne({ email });
    if (existing) {
      return new Response(JSON.stringify({ error: "Email already in use" }), {
        status: 400,
      });
    }
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed });
    return new Response(JSON.stringify({ ok: true }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
