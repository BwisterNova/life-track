import styles from "./goalCard.module.css";
import { Edit, Trash2, Calendar } from "lucide-react";
import { motion } from "framer-motion";

// GoalCard is a presentational component that expects a `goal` object
// and optional callbacks: `onDelete(id)`, `onUpdateProgress(id, newProgress)`,
// `onComplete(id)`, and `onEdit(id)`. Making it prop-driven keeps it
// reusable and decoupled from global state.
export default function GoalCard({
  goal,
  onDelete = () => {},
  onUpdateProgress = () => {},
  onComplete = () => {},
  onEdit = () => {},
}) {
  if (!goal) return null;

  // Helpers to compute status text/class based on progress & deadline.
  // Rules:
  // - If progress >= 100 => Completed
  // - Else if deadline exists and is in the past => Overdue
  // - Otherwise => In Progress
  function getStatusText() {
    if (goal.progress >= 100) return "Completed";
    if (goal.deadline && new Date(goal.deadline) < new Date()) return "Overdue";
    return "In Progress";
  }

  function getStatusClass() {
    if (goal.progress >= 100) return "completed";
    if (goal.deadline && new Date(goal.deadline) < new Date()) return "overdue";
    return "inProgress";
  }

  // Use the user's locale to display a numeric date (e.g. 11/27/2025)
  // `toLocaleDateString()` will adapt to the user's region and will show
  // a numeric date format rather than a short-month form.
  const formattedDeadline = goal.deadline
    ? new Date(goal.deadline).toLocaleDateString(undefined)
    : "-";
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardInfo}>
            <div
              className={styles.iconContainer}
              style={{ backgroundColor: `${goal.color || "#60A5FA"}20` }}
            >
              {goal.icon}
            </div>
            <div className={styles.cardTitle}>
              <h3>{goal.title}</h3>

              <span className={styles.badge}>{goal.category}</span>
            </div>
          </div>
          <div className={styles.cardActions}>
            <button
              className={styles.actionButton}
              onClick={() => onEdit(goal.id)}
            >
              <Edit className={styles.headerIcon} />
            </button>
            <button
              onClick={() => onDelete(goal.id)}
              className={`${styles.actionButton} ${styles.deleteButton}`}
            >
              <Trash2 className={styles.headerIcon} />
            </button>
          </div>
        </div>

        {goal.description && (
          <p className={styles.description}>{goal.description}</p>
        )}

        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>Progress</span>
            <span className={styles.progressValue}>{goal.progress}%</span>
          </div>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${goal.progress}%` }}
            />
          </div>

          <div className={styles.cardFooter}>
            <div className={styles.deadline}>
              <Calendar className={styles.footerIcon} />
              <span>{formattedDeadline}</span>
            </div>
            <span className={`${styles.statusBadge} ${getStatusClass()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>

        {getStatusText() !== "Completed" && (
          <div className={styles.buttonGroup}>
            <button
              className={styles.progressButton}
              onClick={() =>
                onUpdateProgress(
                  goal.id,
                  Math.min((goal.progress || 0) + 10, 100)
                )
              }
            >
              +10%
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
