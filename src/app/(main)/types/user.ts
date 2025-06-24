export interface User {
  id: string;
  name: string;
  balance: number;
  salesCount: number;
  purchasesCount: number;
  amountGained: number;
  amountSpent: number;
  createdAt: Date;
  updatedAt: Date;

  role: UserRole;
  balances: Balance[];
}

export type UserRole = "ADMIN" | "NADMIN";

export interface Balance {
  id: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}
