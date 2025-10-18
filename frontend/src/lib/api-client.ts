const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

interface RequestOptions extends RequestInit {
  auth?: boolean;
}

const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("essay-tutor-token");
};

export async function apiFetch<T>(path: string, options: RequestOptions = {}) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (options.auth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const error = new Error(errorBody.message || "系統發生錯誤");
    throw error;
  }

  return response.json() as Promise<T>;
}
