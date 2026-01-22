export type HttpErrorPayload = {
  status: number;
  message: string;
  raw?: unknown;
};

export class HttpError extends Error {
  status: number;
  raw?: unknown;

  constructor({ status, message, raw }: HttpErrorPayload) {
    super(message);
    this.status = status;
    this.raw = raw;
  }
}

type HttpClientConfig = {
  baseURL?: string;
  credentials?: RequestCredentials;
  defaultHeaders?: HeadersInit;
};

export class HttpClient {
  private baseURL: string;
  private credentials?: RequestCredentials;
  private defaultHeaders: HeadersInit;

  constructor(config: HttpClientConfig = {}) {
    this.baseURL = config.baseURL ?? "";
    this.credentials = config.credentials;
    this.defaultHeaders = config.defaultHeaders ?? {};
  }

  private buildUrl(path: string) {
    if (!path) return this.baseURL;
    if (path.startsWith("http")) return path;
    return `${this.baseURL}${path.startsWith("/") ? "" : "/"}${path}`;
  }

  private async request<T>(
    method: string,
    path: string,
    init?: RequestInit,
  ): Promise<T> {
    let res: Response;

    try {
      res = await fetch(this.buildUrl(path), {
        method,
        credentials: this.credentials,
        headers: {
          "Content-Type": "application/json",
          ...this.defaultHeaders,
          ...init?.headers,
        },
        ...init,
      });
    } catch (error) {
      throw new HttpError({
        status: 0,
        message: "NETWORK_ERROR",
        raw: error,
      });
    }

    let data: any = null;
    try {
      data = await res.json();
    } catch {
      // response không có body
    }

    if (!res.ok) {
      throw new HttpError({
        status: res.status,
        message: data?.error?.message || res.statusText,
        raw: data,
      });
    }
    return data as T;
  }

  async get<T>(path: string, init?: RequestInit): Promise<T> {
    return this.request<T>("GET", path, init);
  }

  async post<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    return this.request<T>("POST", path, {
      ...init,
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    return this.request<T>("PUT", path, {
      ...init,
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(path: string, init?: RequestInit): Promise<T> {
    return this.request<T>("DELETE", path, init);
  }
}
export const http = new HttpClient({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
  credentials: "include",
});
