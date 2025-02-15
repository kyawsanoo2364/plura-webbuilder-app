import { stripe } from "@/lib/stripe";
import { subscriptionCreated } from "@/lib/stripe/stripe-actions";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeWebhookEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

const webhookSecret =
  process.env.STRIPE_WEBHOOK_SECRET_LIVE || process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  let stripeEvent: Stripe.Event;
  const body = await req.text();
  const sig = (await headers()).get("Stripe-Signature");

  try {
    if (!sig || !webhookSecret) {
      console.log("Error: Stripe webhook secret or signature does not exist.");
      return new NextResponse("Webhook Error: Missing signature or secret", {
        status: 400,
      });
    }
    stripeEvent = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    console.log(`Received event: ${stripeEvent.type}`);
  } catch (error: any) {
    console.log(`🔴 Error constructing event: ${error.message}`);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  try {
    if (stripeEvent.type === "payment_intent.succeeded") {
      console.log("Payment successfully");
    }
    if (stripeWebhookEvents.has(stripeEvent.type)) {
      const subscription = stripeEvent.data.object as Stripe.Subscription;
      console.log(
        `Processing event: ${stripeEvent.type} for subscription: ${subscription.id}`
      );

      if (
        !subscription.metadata.connectAccountPayments &&
        !subscription.metadata.connectAccountSubscriptions
      ) {
        switch (stripeEvent.type) {
          case "customer.subscription.created":
          case "customer.subscription.updated": {
            if (subscription.status === "active") {
              console.log("Creating From webhook for subscription");
              await subscriptionCreated(
                subscription,
                subscription.customer as string
              );
              console.log("Created From Webhook", subscription);
            } else {
              console.log(
                "SKIPPED AT CREATED FROM WEBHOOK because subscription status is not active",
                subscription
              );
              break;
            }
          }
          default: {
            console.log("Unhandled relevant event", stripeEvent.type);
          }
        }
      } else {
        console.log(
          "Skipped from Webhook because subscription was from a connected account not for the application",
          subscription
        );
      }
    } else {
      console.log("Unhandled event type", stripeEvent.type);
    }
  } catch (error) {
    console.log(`🔴 Error processing event: ${error}`);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  return NextResponse.json({ webhookActionReceived: true }, { status: 200 });
}
