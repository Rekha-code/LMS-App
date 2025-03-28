import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkwebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBBOOK_SECRET);

    // const payload = JSON.stringify(req.body);
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body
    
    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id, 
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        
        await User.create(userData);
        res.json({});
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };

        
        await User.findByIdAndUpdate(data.id , userData);

        res.json({});
        break;
      }

      case "user.deleted": {
        console.log("Deleting user with Clerk ID:", data.id);
        await User.findByIdAndDelete(data.id);
        console.log("User deleted successfully!");

        res.json({});
        break;
      }

      default:
        break;
    }
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
