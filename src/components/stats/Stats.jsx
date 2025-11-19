import styles from "./stats.module.css";
import { Target, TrendingUp, Flame, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function Stats({ stats }) {
  const statCards = [
    {
      title: "Total Goals",
      // value: stats.totalGoals,
      value: "0",
      icon: Target,
      colorClass: "blue",
    },
    {
      title: "Completion Rate",
      // value: `${stats.completionRate}%`,
      value: "0%",
      icon: TrendingUp,
      colorClass: "green",
    },
    {
      title: "Current Streak",
      // value: `${stats.currentStreak} days`,
      value: "0 days",
      icon: Flame,
      colorClass: "orange",
    },
    {
      title: "Completed",
      // value: stats.completedGoals,
      value: "0",
      icon: Award,
      colorClass: "purple",
    },
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
