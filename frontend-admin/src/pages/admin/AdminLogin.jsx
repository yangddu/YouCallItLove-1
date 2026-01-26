import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchApi } from "@feature/api/fetchApi";

export default function Login() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetchApi("/auth/login", "POST", {
        body: formData,
      });

      const myInfo = await fetchApi("/admin/me", "GET");

      const user = myInfo.data?.user || myInfo.data;

      if (user) {
        navigate("/admin/posts", {
          replace: true,
        });
      }
    } catch (error) {
      console.log("error", error);

      const errorMessage =
        error.response.data.message || "로그인에 실패했습니다.";
      const remainingAttempts = error.response.data.remainingAttempts;

      setError({
        message: errorMessage,
        remainingAttempts: remainingAttempts,
      });
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          id="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="email"
        />
        <input
          name="password"
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="password"
        />
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}
