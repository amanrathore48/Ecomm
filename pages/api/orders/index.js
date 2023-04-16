import { dbConnect } from "../../../config";
import { Order } from "../../../models";

const handler = async (req, res) => {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const { buyerId } = req.query;
        let orders;
        if (buyerId) {
          orders = await Order.find({ buyerId });
        } else {
          orders = await Order.find({});
        }
        res.status(200).json({ success: true, data: orders });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        console.log("re", req.body);
        const order = await Order.create(req.body);
        res.status(201).json({ success: true, data: order });
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
