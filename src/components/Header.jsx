import ThemeToggle from "./ThemeToggle";
import styles from "./styles/Header.module.css";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const userEmail = JSON.parse(localStorage.getItem("token"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Task Planner</h1>
      <div className={styles.userControls}>
        <ThemeToggle />
        {userEmail && (
          <div className={styles.userInfo}>
            <span className={styles.userEmail}>{userEmail}</span>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Выйти
            </button>
          </div>
        )}
      </div>
    </header>
  );
};