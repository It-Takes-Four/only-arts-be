export interface AuthNonce {
  nonce: string;
  timestamp: number;
  address: string;
}

export interface NonceRequest {
  address: string;
}

export interface VerifyRequest {
  address: string;
  message: string;
  signature: string;
  nonce: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    address: string;
    authenticatedAt: string;
  };
}