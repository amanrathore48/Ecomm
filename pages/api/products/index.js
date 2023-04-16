import { dbConnect } from "../../../config";
import { Product } from "../../../models";

const handler = async (req, res) => {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const products = await Product.find({});
        res.status(200).json({ success: true, data: products });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        console.log("re", req.body);
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
};

export default handler;
