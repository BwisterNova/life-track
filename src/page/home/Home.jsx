import styles from "./home.module.css";
import { useState } from "react";
import { motion } from "framer-motion";

import { Bell, Crown, Settings, Sun, Moon } from "lucide-react";

import Dashboard from "../../components/dashboard/Dashboard";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  function toggleDarkmode() {
    setDarkMode(!darkMode);
  }
  return (
    <div className={styles.mainContent}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={styles.header}
      >
        <div className={styles.headerTitle}>
          <h1>Life Goals & Habits</h1>
          <p>Track your progress and build better habits</p>
        </div>

        <div className={styles.headerIcons}>
          <button className={`${styles.iconButton} ${styles.premiumButton}`}>
            <Crown />
          </button>

          <button className={styles.iconButton}>
            <Bell />
            <span className={styles.notificationDot}></span>
          </button>

          {/* <button className={styles.iconButton}>
            <Settings />
          </button>

          <button className={styles.iconButton} onClick={toggleDarkmode}>
            {darkMode ? <Sun /> : <Moon />}
          </button> */}
        </div>
      </motion.div>

      {/* Dashboard */}

      <Dashboard />
    </div>
  );
}
