import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./styles/Auth.module.css";

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem("token", JSON.stringify(user.email));
      navigate("/");
    } else {
      setMsg("Неверный email или пароль");
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2 className={styles.authTitle}>Вход</h2>
      <form onSubmit={handleLogin} className={styles.authForm}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className={styles.authButton}>
          Войти
        </button>
      </form>
      {msg && <p className={styles.authMessage}>{msg}</p>}
      <p className={styles.authSwitch}>
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </p>
    </div>
  );
};