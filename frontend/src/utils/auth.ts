import { AuthTokens } from "@/types/auth";

export const parseHashTokens = (hash: string): AuthTokens | null => {
    if (!hash) return null;

    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (!accessToken || !refreshToken) return null;

    return { accessToken, refreshToken };
};