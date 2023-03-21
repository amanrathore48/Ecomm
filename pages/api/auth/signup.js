import { dbConnect } from "../../../config";
import { User } from "../../../models";
import { hash } from "bcryptjs";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  if (method === "POST") {
    if (!req.body)
      return res.status(404).json({ error: "Don't have from data...!" });

    try {
      // destructuring req
      const { name, email, password } = req.body;
      // checking if already a user with same email
      const isUser = await User.findOne({ email });

      if (isUser)
        return res
          .status(422)
          .json({ sucess: false, message: "Already a user!" });

      // hash password
      const user = new User({
        name,
        email,
        password: await hash(password, 12),
      });
      await user.save();
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      res.status(400).json({ success: false });
    }
  } else {
    res.status(500).json({ message: "Only POST Accepted" });
  }
}
