export type SignUpInput = {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
};

export type Session = {
  userId: string;
  fullName: string;
  email: string;
  createdAt: string;
};
