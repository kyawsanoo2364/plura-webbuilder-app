import CircleProgress from "@/components/global/circle-progress";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { AreaChart } from "@tremor/react";
import {
  Clipboard,
  Contact2,
  DollarSign,
  Goal,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { date } from "zod";

export default async function page({
  params,
  searchParams,
}: {
  params: Promise<{ agencyId: string }>;
  searchParams: Promise<{ code: string }>;
}) {
  const agencyId = (await params).agencyId;
  const { code } = await searchParams;
  let currency = "USD";
  let sessions;
  let totalCloseSessions;
  let totalPendingSessions;
  let net = 0;
  let potentialIncome = 0;
  let closingRate = 0;
  const currentYear = new Date().getFullYear();
  const startDate = new Date(`${currentYear}-01-01T00:00:00Z`).getTime() / 1000;
  const endDate = new Date(`${currentYear}-12-31T23:59:59Z`).getTime() / 1000;

  const agencyDetails = await db.agency.findUnique({ where: { id: agencyId } });
  if (!agencyDetails) return;
  const subAccounts = await db.subAccount.findMany({
    where: { agencyId: agencyId },
  });

  if (agencyDetails.connectAccountId) {
    const response = await stripe.accounts.retrieve({
      stripeAccount: agencyDetails.connectAccountId,
    });
    currency = response?.default_currency.toUpperCase() || "USD";
    const checkoutSessions = await stripe.checkout.sessions.list(
      {
        created: { gte: startDate, lte: endDate },
        limit: 100,
      },
      { stripeAccount: agencyDetails.connectAccountId }
    );
    sessions = checkoutSessions.data;
    totalCloseSessions = checkoutSessions.data
      .filter((session) => session.status === "complete")
      .map((session) => ({
        ...session,
        created: new Date(session.created).toLocaleDateString(),
        amount_total: session.amount_total ? session.amount_total / 100 : 0,
      }));
    totalPendingSessions = checkoutSessions.data
      .filter((session) => session.status === "open")
      .map((session) => ({
        ...session,
        created: new Date(session.created).toLocaleDateString(),
        amount_total: session.amount_total ? session.amount_total / 100 : 0,
      }));
    net = +totalCloseSessions
      .reduce((total, session) => total + (session.amount_total || 0), 0)
      .toFixed(2);
    potentialIncome = +totalPendingSessions
      .reduce((total, session) => total + (session.amount_total || 0), 0)
      .toFixed(2);
    closingRate = (
      +(totalCloseSessions.length / checkoutSessions.data.length) * 100
    ).toFixed(2);
  }

  return (
    <div className="relative h-full">
      {!agencyDetails.connectAccountId && (
        <div className="absolute -top-10 -left-10 right-0 bottom-0 z-30 flex items-center justify-center backdrop-blur-md bg-background/50">
          <Card>
            <CardHeader>
              <CardTitle>Connect Your Stripe</CardTitle>
              <CardDescription>
                You need to connect your stripe account to see metrics{" "}
              </CardDescription>
              <Link
                href={`/agency/${agencyDetails.id}/launchpad`}
                className="p-2 w-fit bg-secondary text-white rounded-md flex items-center gap-2"
              >
                <Clipboard />
                Launch Pad
              </Link>
            </CardHeader>
          </Card>
        </div>
      )}
      <h1 className="text-4xl">Dashboard</h1>
      <Separator className="my-6" />
      <div className="flex flex-col gap-4 pb-6">
        <div className="flex flex-col xl:!flex-row gap-4">
          <Card className="flex-1 relative">
            <CardHeader>
              <CardDescription>Income</CardDescription>
              <CardTitle className="text-4xl">
                {net ? `${currency} ${net.toFixed(2)}` : "$0.00"}
              </CardTitle>
              <small className="text-xs text-muted-foreground">
                For the year {currentYear}
              </small>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Total revenue generated as reflected in your stripe dashboard.
            </CardContent>
            <DollarSign className="absolute top-4 right-4 text-muted-foreground" />
          </Card>
          <Card className="flex-1 relative">
            <CardHeader>
              <CardDescription>Potential Income</CardDescription>
              <CardTitle className="text-4xl">
                {potentialIncome
                  ? `${currency} ${potentialIncome.toFixed(2)}`
                  : "$0.00"}
              </CardTitle>
              <small className="text-xs text-muted-foreground">
                For the year {currentYear}
              </small>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              This is how much you can close.
            </CardContent>
            <DollarSign className="absolute top-4 right-4 text-muted-foreground" />
          </Card>
          <Card className="flex-1 relative">
            <CardHeader>
              <CardDescription>Active Client</CardDescription>
              <CardTitle className="text-4xl">{subAccounts.length}</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Reflects the number of sub accounts you own and manage.
            </CardContent>
            <Contact2 className="absolute top-4 right-4 text-muted-foreground" />
          </Card>
          <Card className="flex-1 relative">
            <CardHeader>
              <CardTitle>Agency Goal</CardTitle>
              <CardDescription>
                <p className="mt-2">
                  Reflects the number of sub accounts you want to own and
                  manage.
                </p>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <div className="flex flex-col w-full">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-xs">
                    Current: {subAccounts.length}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    Goal: {agencyDetails.goal}
                  </span>
                </div>
                <Progress
                  value={(subAccounts.length / agencyDetails.goal) * 100}
                />
              </div>
            </CardFooter>
            <Goal className="absolute right-4 top-4 text-muted-foreground" />
          </Card>
        </div>
        <div className="flex gap-4 xl:!flex-row flex-col">
          <Card className="p-4 flex-1">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <AreaChart
              className="text-sm stroke-primary"
              data={[
                ...(totalCloseSessions || []),
                ...(totalPendingSessions || []),
              ]}
              index="created"
              categories={["amount_total"]}
              colors={["primary"]}
              yAxisWidth={30}
              showAnimation
            />
          </Card>
          <Card className="xl:w-[400px] w-full">
            <CardHeader>
              <CardTitle>Conversions</CardTitle>
            </CardHeader>
            <CardContent>
              <CircleProgress
                value={closingRate}
                description={
                  <>
                    {sessions && (
                      <div className="flex flex-col">
                        Abandoned
                        <div className="flex gap-2">
                          <ShoppingCart className="text-rose-700" />
                          {sessions.length}
                        </div>
                      </div>
                    )}
                    {totalCloseSessions && (
                      <div className="flex flex-col">
                        Won Carts
                        <div className="flex gap-2">
                          <ShoppingCart className="text-rose-700" />
                          {totalCloseSessions.length}
                        </div>
                      </div>
                    )}
                  </>
                }
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
