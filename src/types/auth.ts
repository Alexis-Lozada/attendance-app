import type { User } from "@/types/user";

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}
