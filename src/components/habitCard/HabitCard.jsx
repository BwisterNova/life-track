import styles from "../goalCard/goalCard.module.css";
import { Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

// Simple HabitCard implementation mirroring the GoalCard header.
export default function HabitCard({
  habit,
  onDelete = () => {},
  onEdit = () => {},
}) {
  if (!habit) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.18 }}
    >
      <div className={styles.card} style={{ background: "var(--color-white)" }}>
        <div className={styles.cardHeader}>
          <div className={styles.cardInfo}>
            <div
              className={styles.iconContainer}
              style={{ backgroundColor: `${habit.color || "#60A5FA"}20` }}
            >
              {habit.icon}
            </div>
            <div className={styles.cardTitle}>
              <h3>{habit.name}</h3>
              <span className={styles.badge}>{habit.frequency}</span>
            </div>
          </div>

          <div className={styles.cardActions}>
            <button
              className={styles.actionButton}
              onClick={() => onEdit(habit.id)}
            >
              <Edit className={styles.headerIcon} />
            </button>
            <button
              className={`${styles.actionButton} ${styles.deleteButton}`}
              onClick={() => onDelete(habit.id)}
            >
              <Trash2 className={styles.headerIcon} />
            </button>
          </div>
        </div>

        {habit.description && (
          <p className={styles.description}>{habit.description}</p>
        )}
      </div>
    </motion.div>
  );
}
