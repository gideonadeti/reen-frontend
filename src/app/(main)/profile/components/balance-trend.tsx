"use client";

import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import formatDate from "../utils/format-date";
import { ChartData } from "../types/chart-data";
import { PeriodType } from "../types/period-type";
import { Balance } from "../../types/user";
import {
  groupBalancesByHour,
  groupBalancesByDay,
  groupBalancesByMonth,
} from "../utils/group-balances";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  amount: {
    label: "Amount",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface BalanceTrendProps {
  periodBalances: Balance[];
  periodDate: Date;
  periodType: PeriodType;
}

const BalanceTrend = ({
  periodType,
  periodDate,
  periodBalances,
}: BalanceTrendProps) => {
  const [chartData, setChartData] = useState<ChartData>([]);

  const getDataKey = () => {
    switch (periodType) {
      case "day":
        return "hour";
      case "month":
        return "day";
      case "year":
        return "month";
    }
  };

  useEffect(() => {
    switch (periodType) {
      case "day":
        setChartData(groupBalancesByHour(periodBalances, periodDate));
        break;
      case "month":
        setChartData(groupBalancesByDay(periodBalances, periodDate));
        break;
      case "year":
        setChartData(groupBalancesByMonth(periodBalances, periodDate));
        break;
      default:
        break;
    }
  }, [periodDate, periodBalances, periodType]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance Trend</CardTitle>
        <CardDescription>
          Showing balance trend for {formatDate(periodType, periodDate)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full max-h-[240px]">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={getDataKey()}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <defs>
              <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-green-500)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-green-500)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="amount"
              type="natural"
              fill="url(#fillAmount)"
              fillOpacity={0.4}
              stroke="var(--color-green-500)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default BalanceTrend;
