export const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api/v1';

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  phone?: string;
  referralCode?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UserDto {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: 'USER' | 'ADMIN';
  referralCode: string;
  avatar?: string | null;
  createdAt: string;
}

export interface AuthResponseData {
  user: UserDto;
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

// Token storage helpers
export const TOKEN_KEYS = {
  ACCESS: 'shopee_cashback_access_token',
  REFRESH: 'shopee_cashback_refresh_token',
};

export const getAccessToken = () => localStorage.getItem(TOKEN_KEYS.ACCESS);
export const getRefreshToken = () => localStorage.getItem(TOKEN_KEYS.REFRESH);

export const setAuthTokens = (access: string, refresh: string) => {
  localStorage.setItem(TOKEN_KEYS.ACCESS, access);
  localStorage.setItem(TOKEN_KEYS.REFRESH, refresh);
};

export const clearAuthTokens = () => {
  localStorage.removeItem(TOKEN_KEYS.ACCESS);
  localStorage.removeItem(TOKEN_KEYS.REFRESH);
};

export const isAuthenticated = (): boolean => !!getAccessToken();

export class ApiError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

export interface RefreshResponseData {
  accessToken: string;
  refreshToken: string;
}

// Single-flight promise để tránh gọi /auth/refresh nhiều lần đồng thời
let refreshPromise: Promise<RefreshResponseData> | null = null;

const isAuthEndpoint = (endpoint: string) =>
  endpoint.startsWith('/auth/login') ||
  endpoint.startsWith('/auth/register') ||
  endpoint.startsWith('/auth/refresh');

async function doRefresh(): Promise<RefreshResponseData> {
  if (refreshPromise) return refreshPromise;

  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new ApiError('Phiên đăng nhập đã hết hạn (401)', 401, 'NO_REFRESH_TOKEN');
  }

  refreshPromise = (async () => {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const resJson: ApiResponse<RefreshResponseData> = await res.json().catch(() => ({
      success: false,
      error: { code: 'NETWORK_ERROR', message: 'Không thể kết nối đến máy chủ Backend' },
    }));

    if (!res.ok || !resJson.success || !resJson.data) {
      throw new ApiError(
        resJson.error?.message || `Refresh token thất bại: ${res.status} (401)`,
        401,
        resJson.error?.code || 'REFRESH_FAILED'
      );
    }

    const { accessToken, refreshToken: newRefreshToken } = resJson.data;
    setAuthTokens(accessToken, newRefreshToken);
    return { accessToken, refreshToken: newRefreshToken };
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

function handleUnauthorized() {
  clearAuthTokens();
  // Thông báo cho UI (Header, HomePage...) biết để mở modal đăng nhập
  window.dispatchEvent(new CustomEvent('auth:unauthorized'));
}

async function request<T>(endpoint: string, options: RequestInit = {}, _retry = true): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAccessToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const resJson: ApiResponse<T> = await response.json().catch(() => ({
    success: false,
    error: {
      code: 'NETWORK_ERROR',
      message: 'Không thể kết nối đến máy chủ Backend',
    },
  }));

  const withStatusSuffix = (msg: string, status: number) =>
    msg.includes(`(${status})`) ? msg : `${msg} (${status})`;

  // 401 -> thử refresh token 1 lần rồi retry request gốc (trừ chính các endpoint auth)
  if (response.status === 401 && _retry && !isAuthEndpoint(endpoint)) {
    try {
      await doRefresh();
    } catch {
      handleUnauthorized();
      const raw = resJson.error?.message || 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại';
      throw new ApiError(withStatusSuffix(raw, 401), 401, resJson.error?.code || 'UNAUTHORIZED');
    }
    // Refresh OK -> retry với access token mới
    return request<T>(endpoint, options, false);
  }

  if (!response.ok || !resJson.success) {
    const raw =
      resJson.error?.message ||
      (response.status === 401
        ? 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại'
        : `Lỗi yêu cầu: ${response.status}`);
    throw new ApiError(withStatusSuffix(raw, response.status), response.status, resJson.error?.code);
  }

  return resJson.data as T;
}

// Auth API Service
export const authApi = {
  register: async (payload: RegisterPayload): Promise<AuthResponseData> => {
    const data = await request<AuthResponseData>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setAuthTokens(data.accessToken, data.refreshToken);
    return data;
  },

  login: async (payload: LoginPayload): Promise<AuthResponseData> => {
    const data = await request<AuthResponseData>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setAuthTokens(data.accessToken, data.refreshToken);
    return data;
  },

  getMe: async (): Promise<UserDto> => {
    return request<UserDto>('/auth/me');
  },

  refresh: async (): Promise<RefreshResponseData> => {
    return doRefresh();
  },

  logout: () => {
    clearAuthTokens();
  },
};

// Affiliate 2026 an_redir API Service
export interface GenerateAnRedirLinkPayload {
  url: string;
  affiliateId?: string;
  country?: 'vn' | 'th' | 'my' | 'sg' | 'id' | 'ph';
  sub1?: string; // Publisher / KOL
  sub2?: string; // Campaign
  sub3?: string; // Source (fb, tiktok, web…)
  sub4?: string; // Post / Video ID
  sub5?: string; // Custom / Remark
  subIds?: string[];
  sub_id?: string;
}

export interface GenerateAnRedirLinkResponse {
  affiliateUrl: string;
  originLink: string;
  encodedOriginLink: string;
  affiliateId: string;
  subId: string;
  subComponents: {
    sub1?: string;
    sub2?: string;
    sub3?: string;
    sub4?: string;
    sub5?: string;
  };
  shopId?: string;
  itemId?: string;
  format: 'slug-i' | 'product';
  countryDomain: string;
  validation: {
    isCleanLanding: boolean;
    hasAffiliateId: boolean;
    subIdFormatValid: boolean;
    warnings: string[];
  };
  product?: {
    id: string;
    itemId?: string;
    name: string;
    imageUrl?: string | null;
    price: number;
    originalPrice?: number;
    commissionRate: number;
    shopName?: string;
    rating?: number;
    soldCount?: number;
  };
}

export const affiliateApi = {
  /**
   * Tạo link Sàn Cam Affiliate chuẩn 2026 (cơ chế an_redir)
   */
  generateAnRedirLink: async (payload: GenerateAnRedirLinkPayload): Promise<GenerateAnRedirLinkResponse> => {
    return request<GenerateAnRedirLinkResponse>('/affiliate/generate-link', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Convert link Shopee gắn mã affiliate / hoàn tiền
   */
  convertLink: async (payload: GenerateAnRedirLinkPayload): Promise<GenerateAnRedirLinkResponse> => {
    return request<GenerateAnRedirLinkResponse>('/affiliate/convert', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * Lấy lịch sử link affiliate đã tạo
   */
  getHistory: async (page = 1, limit = 20) => {
    return request<any>(`/affiliate/history?page=${page}&limit=${limit}`);
  },
};
