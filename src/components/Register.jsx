import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./styles/Auth.module.css";

export const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.find((u) => u.email === email);
    if (exists) {
      setMsg("Пользователь уже существует");
      return;
    }

    const newUser = { email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("token", JSON.stringify(email));
    navigate("/");
  };

  return (
    <div className={styles.authContainer}>
      <h2 className={styles.authTitle}>Регистрация</h2>
      <form onSubmit={handleRegister} className={styles.authForm}>
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
          Зарегистрироваться
        </button>
      </form>
      {msg && <p className={styles.authMessage}>{msg}</p>}
      <p className={styles.authSwitch}>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
};