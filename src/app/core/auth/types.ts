export type AuthRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  email: string;
  role: string;
  token: string;
};
