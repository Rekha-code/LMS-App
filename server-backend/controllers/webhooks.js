import { Webhook } from "svix";
import User from "../models/User.js";

export const clerkwebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBBOOK_SECRET);

    const payload = JSON.stringify(req.body);
    await whook.verify(payload, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;
    
    switch (type) {
      case "user.created": {
        const userData = {
          clerkId: data.id, // Store Clerk ID separately
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        };
        
        console.log("Creating user:", userData);
        await User.create(userData);
        console.log("User created successfully!");

        res.json({});
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        };

        console.log("Updating user:", userData);
        await User.findOneAndUpdate({ clerkId: data.id }, userData);
        console.log("User updated successfully!");

        res.json({});
        break;
      }

      case "user.deleted": {
        console.log("Deleting user with Clerk ID:", data.id);
        await User.findOneAndDelete({ clerkId: data.id });
        console.log("User deleted successfully!");

        res.json({});
        break;
      }

      default:
        res.status(400).json({ success: false, message: "Unknown event type" });
        break;
    }
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
