export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface RefreshResponse {
    message: string;
    access_token: string;
}