import { stripe } from "@/lib/stripe";
import { StripeCustomerType } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, address, shipping, name }: StripeCustomerType =
    await req.json();

  if (!email || !address || !shipping || !name) {
    return new NextResponse("Missing Data", { status: 400 });
  }

  try {
    const customer = await stripe.customers.create({
      email,
      name,
      address,
      shipping,
    });
    return NextResponse.json({ customerId: customer.id });
  } catch (error) {
    console.log("Error", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
