class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export const fetchApi = async (url, method, options = {}, timeout = 10000) => {
  const {
    params,
    body,
    headers: customHeaders,
    requestOptions,
    ignoreError,
  } = options;

  const endpoint = import.meta.env.VITE_API_URL;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value))
          value.forEach((v) => searchParams.append(key, v));
        else searchParams.set(key, value);
      }
    });
  }

  const isFormData = body instanceof FormData;
  const fullUrl = new URL(url, endpoint);
  if (params) fullUrl.search = searchParams.toString();

  try {
    const res = await fetch(fullUrl.toString(), {
      method,
      headers: {
        ...(!isFormData && { "Content-Type": "application/json" }),
        ...customHeaders,
      },
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      credentials: "include",
      ...requestOptions,
    });

    if (!res.ok) {
      const text = await res.text();
      let errorData;
      try {
        errorData = JSON.parse(text);
      } catch {
        errorData = { message: text };
      }

      throw new ApiError(
        errorData.message ||
          errorData.title ||
          "API 요청 중 에러가 발생했습니다.",
        res.status,
        errorData,
      );
    }

    if (res.status === 204) return {};

    const contentType = res.headers.get("content-type");
    const result = contentType?.includes("application/json")
      ? await res.json()
      : await res.text();
    return { data: result };
  } catch (error) {
    if (ignoreError) return {};

    if (error instanceof ApiError) {
      console.error(`[ApiError] ${error.status}: ${error.message}`);
    } else if (error.name === "AbortError") {
      console.error("[TimeoutError] 요청 시간이 초과되었습니다.");
    } else {
      console.error("[NetworkError] 서버와 연결할 수 없습니다.");
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};
