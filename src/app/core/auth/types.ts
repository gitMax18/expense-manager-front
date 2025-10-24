export type AuthRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};

export type User = {
  id: number;
  email: string;
  role: string;
};
