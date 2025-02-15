import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  price: number | string,
  options: {
    currency?: "USD" | "EUR" | "GBP" | "BDT";
    maximumFractionDigits?: number;
    notation?: Intl.NumberFormatOptions["notation"];
  } = {}
) {
  const {
    currency = "USD",
    notation = "compact",
    maximumFractionDigits = 2,
  } = options;

  const numericPrice = typeof price === "string" ? parseFloat(price) : price;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation,
    maximumFractionDigits,
  }).format(numericPrice);
}

export function getStripeOAuthLink(
  accountType: "agency" | "subaccount",
  state: string
) {
  return `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID}&scope=read_write&redirect_uri=${process.env.NEXT_PUBLIC_URL}/${accountType}&state=${state}`;
}
