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
}

export type UserRole = "ADMIN" | "NADMIN";
