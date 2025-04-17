import ThemeToggle from "./ThemeToggle";
import styles from "./styles/Header.module.css";

export const Header = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Task Planner</h1>
      <ThemeToggle />
    </header>
  );
};
