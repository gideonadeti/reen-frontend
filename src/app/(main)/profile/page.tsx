"use client";

import Link from "next/link";
import { useState } from "react";
import { TrendingUp, TrendingDown, Crown } from "lucide-react";

import useUser from "../hooks/use-user";
import useProducts from "../products/hooks/use-products";
import usePeriodBalances from "../hooks/use-period-balances";
import formatMoney from "../utils/format-money";
import Loading from "@/app/loading";
import PeriodSelector from "./components/period-selector";
import BalanceTrend from "./components/balance-trend";
import { PeriodType } from "./types/period-type";
import { H2 } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Page = () => {
  const [periodDate, setPeriodDate] = useState(new Date());
  const [periodType, setPeriodType] = useState<PeriodType>("day");
  const { userQuery } = useUser();
  const { productsQuery } = useProducts();
  const user = userQuery.data;
  const periodBalances = usePeriodBalances(user?.id, periodDate, periodType);
  const products = productsQuery.data || [];
  const productsCount = products.filter((p) => p.adminId === user?.id).length;
  const isAdmin = user?.role === "ADMIN";

  if (userQuery.isPending || productsQuery.isPending) {
    return <Loading />;
  }

  return (
    <div className="px-4 pb-4 space-y-4">
      <section>
        <div className="flex justify-between">
          <span className="text-muted-foreground mb-2">
            Welcome back, <span className="font-semibold">{user?.name}</span>
          </span>
          <span>
            {isAdmin ? (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-600 font-semibold shadow-md hover:from-yellow-600 hover:to-orange-800 transition-all duration-200">
                <Crown className="w-3 h-3" />
                ADMIN
              </Badge>
            ) : (
              <Badge className=" font-medium">NADMIN</Badge>
            )}
          </span>
        </div>
        <H2>Your Profile</H2>
      </section>
      <section
        aria-label="User profile summary"
        className="grid grid-cols-2 gap-4"
      >
        <Card>
          <CardHeader>
            <CardTitle>Balance</CardTitle>
            <CardDescription>Amount left in your account</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="font-semibold text-2xl">
              {formatMoney(user?.balance || 0)}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sales Count</CardTitle>
            <CardDescription>Number of sales you have made</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="font-semibold text-2xl">
              {user?.salesCount || 0}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Amount Spent</CardTitle>
            <CardDescription>Amount spent on products and fees</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <span className="font-semibold text-2xl">
              {formatMoney(user?.amountSpent || 0)}
            </span>
            <span className="text-red-600">
              <TrendingDown />
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Purchases Count</CardTitle>
            <CardDescription>Number of purchases you have made</CardDescription>
          </CardHeader>
          <CardContent>
            <span className="font-semibold text-2xl">
              {user?.purchasesCount || 0}
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Amount Gained</CardTitle>
            <CardDescription>Amount you have made from sales</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <span className="font-semibold text-2xl">
              {formatMoney(user?.amountGained || 0)}
            </span>
            <span className="text-green-600">
              <TrendingUp />
            </span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Products Count</CardTitle>
            <CardAction>
              <Button variant="link" asChild>
                <Link href="/products?mine=true">See all</Link>
              </Button>
            </CardAction>
            <CardDescription>
              Number of products you have created
            </CardDescription>
          </CardHeader>
          <CardContent>
            <span className="font-semibold text-2xl">{productsCount || 0}</span>
          </CardContent>
        </Card>
      </section>
      <section className="space-y-4">
        <PeriodSelector
          periodType={periodType}
          periodDate={periodDate}
          setPeriodDate={setPeriodDate}
          setPeriodType={setPeriodType}
        />
        <BalanceTrend
          periodBalances={periodBalances}
          periodDate={periodDate}
          periodType={periodType}
        />
      </section>
    </div>
  );
};

export default Page;
