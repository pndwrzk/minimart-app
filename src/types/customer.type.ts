export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
};

export type LoginData = {
  access_token: string;
  access_token_expires_at: number;
  refresh_token: string;
  refresh_token_expires_at: number;
  user: {
    id: string;
    email: string;
  };
};

export type RefreshData = {
  access_token: string;
  access_token_expires_at: number;
  refresh_token: string;
  refresh_token_expires_at: number;
};

export type RegisterData = {
  id: string;
  email: string;
  phone: string;
  address: string;
};
