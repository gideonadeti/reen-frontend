export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export type UserRole = "ADMIN" | "NADMIN";
