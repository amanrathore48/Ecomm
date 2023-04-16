import { dbConnect } from "../../../config";
import { Product } from "../../../models";

const handler = async (req, res) => {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const product = await Product.findById(req.query.prodId);
        if (!product) {
          return res.status(404).json({ success: false });
        }
        res.status(200).json({ success: true, data: product });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "PUT":
      try {
        const product = await Product.findByIdAndUpdate(
          req.query.prodId,
          req.body,
          {
            new: true,
            runValidators: true,
          }
        );
        if (!product) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: product });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "DELETE":
      try {
        const deletedProduct = await Product.findByIdAndRemove(
          req.query.prodId
        );
        if (!deletedProduct) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: {} });
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
