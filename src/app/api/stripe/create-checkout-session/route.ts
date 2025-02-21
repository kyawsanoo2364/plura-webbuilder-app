import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const {
    subaccountId,
    prices,
    subaccountConnectAccId,
  }: {
    subaccountId: string;
    prices: { recurring: boolean; productId: string }[];
    subaccountConnectAccId: string;
  } = await req.json();
  const origin = req.headers.get("origin");
  if (!subaccountConnectAccId || !prices.length) {
    return new NextResponse("Stripe Account Id or Price Id is missing", {
      status: 400,
    });
  }
  if (
    !process.env.NEXT_PUBLIC_PLATFORM_SUBSCRIPTION_PERCENT ||
    !process.env.NEXT_PUBLIC_PLATFORM_ONETIME_FEE ||
    !process.env.NEXT_PUBLIC_PLATFORM_AGENY_PERCENT
  )
    return NextResponse.json({ error: "Fees is not exists." }, { status: 400 });

  const agencyIdConnectAccId = await db.subAccount.findUnique({
    where: { id: subaccountId },
    include: { Agency: true },
  });
  const subscriptionPriceExists = prices.find((price) => price.recurring);
  if (!agencyIdConnectAccId?.Agency.connectAccountId)
    return NextResponse.json(
      { error: "Agency account is not connected" },
      { status: 400 }
    );
  try {
    const session = await stripe.checkout.sessions.create(
      {
        line_items: prices.map((p) => ({
          price: p.productId,
          quantity: 1,
        })),
        ...(subscriptionPriceExists && {
          subscription_data: {
            metadata: { connectAccountSubscription: "true" },
            application_fee_percent:
              +process.env.NEXT_PUBLIC_PLATFORM_SUBSCRIPTION_PERCENT,
          },
        }),
        ...(!subscriptionPriceExists && {
          payment_intent_data: {
            metadata: { connectAccountPayments: "true" },
            application_fee_amount:
              +process.env.NEXT_PUBLIC_PLATFORM_ONETIME_FEE * 100,
          },
        }),
        mode: subscriptionPriceExists ? "subscription" : "payment",
        ui_mode: "embedded",
        redirect_on_completion: "never",
      },
      { stripeAccount: subaccountConnectAccId }
    );
    return NextResponse.json(
      { clientSecret: session.client_secret },
      {
        headers: {
          "Access-Control-Allow-Origin": origin || "*",
          "Access-Control-Allow-Methods": "GET,OPTIONS,POST,DELETE,PUT,PATCH",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message });
  }
}

export async function OPTIONS(request: Request) {
  const allowedOrigin = request.headers.get("origin");

  const response = new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": allowedOrigin || "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Date, X-Api-Version",
      "Access-Control-Max-Age": "86400",
    },
  });

  return response;
}
