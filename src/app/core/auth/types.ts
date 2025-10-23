export type AuthRequest = {
  email: string;
  password: string;
};

export type User = {
  email: string;
  role: string;
  token: string;
};
