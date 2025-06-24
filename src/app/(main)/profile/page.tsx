"use client";

import Link from "next/link";
import { TrendingUp, TrendingDown } from "lucide-react";

import Loading from "@/app/loading";
import useUser from "../hooks/use-user";
import useProducts from "../products/hooks/use-products";
import formatMoney from "../utils/format-money";
import { H2 } from "@/components/ui/typography";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Page = () => {
  const { userQuery } = useUser();
  const { productsQuery } = useProducts();
  const user = userQuery.data;
  const products = productsQuery.data || [];
  const productsCount = products.filter((p) => p.adminId === user?.id).length;

  if (userQuery.isPending || productsQuery.isPending) {
    return <Loading />;
  }

  return (
    <div className="px-4">
      <span className="text-muted-foreground mb-2">
        Welcome back, <span className="font-semibold">{user?.name}</span>
      </span>
      <H2>Your Profile</H2>
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
    </div>
  );
};

export default Page;
