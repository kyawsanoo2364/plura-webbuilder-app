import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  //  အလုပ်လုပ်ပုံ အဆင့်ဆင့်:

  // လက်ရှိ subscription ကို ရှာပြီး subscription ID ယူမယ်

  // လက်ရှိ subscription မှာရှိတဲ့ ပထမ item ကို ဖျက်မယ် (ဥပမာ - အဟောင်း plan)

  // အသစ်ထည့်မယ့် price ID နဲ့ item အသစ်ထည့်မယ် (ဥပမာ - အသစ် plan)

  // Update လုပ်ပြီးရင် နောက်ဆုံး invoice နဲ့ payment intent ကို response မှာ ပါလာစေမယ်

  // subscription မရှိရင် အသစ် ဖန်တီးမယ်

  const { customerId, priceId } = await req.json();
  if (!customerId || !priceId)
    return new NextResponse("CustomerId or PriceId is missing", {
      status: 400,
    });

  const subscriptionExists = await db.agency.findFirst({
    where: { customerId },
    include: { Subscription: true },
  });

  try {
    if (
      subscriptionExists?.Subscription?.subscriptionId &&
      subscriptionExists.Subscription.active
    ) {
      if (!subscriptionExists.Subscription.subscriptionId) {
        throw new Error(
          "Could not find the subscription Id to update the subscription"
        );
      }

      console.log("Updating the subscription");
      const currentSubscription = await stripe.subscriptions.retrieve(
        subscriptionExists.Subscription.subscriptionId
      );
      const subscription = await stripe.subscriptions.update(
        subscriptionExists.Subscription.subscriptionId,
        {
          items: [
            {
              id: currentSubscription.items.data[0].id,
              deleted: true,
            },
            {
              price: priceId,
            },
          ],
          expand: ["latest_invoice.payment_intent"],
        }
      );
      return NextResponse.json({
        subscriptionId: subscription.id,
        //@ts-ignore
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      });
    } else {
      console.log("Creating Subscription...");
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: priceId,
          },
        ],
        payment_behavior: "default_incomplete",
        payment_settings: { save_default_payment_method: "on_subscription" },
        expand: ["latest_invoice.payment_intent"],
      });

      return NextResponse.json({
        subscriptionId: subscription.id,
        //@ts-ignore
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      });
    }
  } catch (error) {
    console.log("🔴 Error occured: ", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
