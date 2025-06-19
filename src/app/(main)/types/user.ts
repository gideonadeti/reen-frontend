export interface User {
  id: string;
  name: string;
  role: UserRole;
  balance: number;
}

export type UserRole = "ADMIN" | "NADMIN";
