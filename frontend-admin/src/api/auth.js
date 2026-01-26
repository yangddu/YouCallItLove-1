import { fetchApi } from "../feature/api/fetchApi";

export const login = async (email, password) => {
  const res = await fetchApi("/auth/login", "POST", {
    body: { email, password },
  });
  return res.data.data;
};

export const getMe = async () => {
  const res = await fetchApi("/admin/me", "GET");
  return res.data.data;
};
