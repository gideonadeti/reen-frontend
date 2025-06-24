export interface HourlyBalances {
  hour: string;
  amount: number;
}

export interface DailyBalances {
  day: string;
  amount: number;
}

export interface MonthlyBalances {
  month: string;
  amount: number;
}

export type ChartData = HourlyBalances[] | DailyBalances[] | MonthlyBalances[];
