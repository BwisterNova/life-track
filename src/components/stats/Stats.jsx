import styles from "./stats.module.css";
import { Target, TrendingUp, Flame, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function Stats({ stats = {} }) {
  const { totalGoals = 0, completionRate = "0%", currentStreak = "0 days", completed = 0 } = stats;

  const statCards = [
    { title: "Total Goals", value: String(totalGoals), icon: Target, colorClass: "blue" },
    { title: "Completion Rate", value: String(completionRate), icon: TrendingUp, colorClass: "green" },
    { title: "Current Streak", value: String(currentStreak), icon: Flame, colorClass: "orange" },
    { title: "Completed", value: String(completed), icon: Award, colorClass: "purple" },
  ];

  return (
    <div className={styles.grid}>
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.3 }}
        >
          <div className={styles.statCard}>
            <div className={styles.statContent}>
              <div className={styles.statInfo}>
                <p>{stat.title}</p>
                <p className={styles.statValue}>{stat.value}</p>
              </div>
              <div className={`${styles.iconBox} ${styles[stat.colorClass]}`}>
                <stat.icon
                  className={`${styles.icon} ${styles[stat.colorClass]}`}
                />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
