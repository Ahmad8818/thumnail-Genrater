import { Request,Response } from "express"
import { verifyWebhook } from '@clerk/express/webhooks'
import ClerkUser from "../models/ClerkUser.js";
import * as Sentry from "@sentry/node"

  const clerkWebhook = async (req: Request, res: Response) => {
   try {
     const evt: any = await verifyWebhook(req);
     const {  data, type } = evt;
 
     switch (type) {
 
       // ✅ USER CREATED
       case "user.created":{ 
         await ClerkUser.create({
           clerkId: data.id,
           email: data.email_addresses?.[0]?.email_address,
           name: `${data.first_name || ""} ${data.last_name || ""}`,
           image: data.image_url,
           credits: 20,
         });
        
         break;
  }
       // ✅ USER UPDATED
       case "user.updated":{
         await ClerkUser.findOneAndUpdate(
           { clerkId: data.id },
           {
             email: data.email_addresses?.[0]?.email_address,
             name: `${data.first_name || ""} ${data.last_name || ""}`,
             image: data.image_url,
           }
         );
         
         break;
  }
       // ✅ USER DELETED
       case "user.deleted":{ 
         await ClerkUser.findOneAndDelete({ clerkId: data.id });
        
         break;
  }
       // 💳 BILLING / CREDITS
       case "paymentAttempt.updated": {
         if (
           (data.charge_type === "recurring" ||
             data.charge_type === "checkout") &&
           data.status === "paid"
         ) {
           // 🎯 Credit mapping
           const creditsMap = {
            free:20,
             pro: 80,
             premium: 240,
           } as const;
 
           const clerkUserId = data?.payer?.user_id;
           const planSlug : keyof typeof creditsMap = data?.subscription_items?.
           [0]?.plan?.slug;
           if ( planSlug !== 'pro' && planSlug !== 'premium')   {
             return res
               .status(400)
               .json({ message: "Invalid billing payload" });
           }
           console.log(planSlug)
                   
          //  const planSlug = data?.subscription_items?.[0]?.plan?.slug as
          //    | keyof typeof creditsMap
          //    | undefined;
 
          //  if (!clerkUserId || !planSlug || !(planSlug in creditsMap)) {
          //    return res
          //      .status(400)
          //      .json({ message: "Invalid billing payload" });
          //  }
 
           //🔄 Update credits atomically
           const updatedUser = await ClerkUser.findOneAndUpdate(
             { clerkId: clerkUserId },
             {
               $inc: { credits: creditsMap[planSlug] },
               plan: planSlug, // optional but recommended
             },
             { new: true }
           );
 
           if (!updatedUser) {
             return res
               .status(404)
               .json({ message: "User not found" });
           }
         }
         break;
       }
 
       default:
         break;
     }
 
     res.status(200).json({
       success: true,
       message: "Webhook received: " + type,
     });
   } catch (err:any) {
    Sentry.captureException(err)
     console.error("Webhook Error:", err);
     res.status(400).json({ success: false });
   }
 };

export default clerkWebhook

 
 




