export interface JwtPayload {
  sub: string;
  email: string;
  username: string;
}

export interface AuthenticatedRequest {
  user: {
    userId: string;
    email: string;
    username: string;
  };
}
