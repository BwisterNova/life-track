import styles from "./habitCard.module.css";
import { Edit, Trash2, Flame, Check } from "lucide-react";
import { motion } from "framer-motion";

// Simple HabitCard implementation mirroring the GoalCard header.
export default function HabitCard({
  habit,
  onDelete = () => {},
  onEdit = () => {},
  onToggleComplete = () => {},
}) {
  if (!habit) return null;

  // Small date helpers so this component doesn't depend on an external
  // date library. We format the weekday and day number and compare ISO
  // dates (YYYY-MM-DD) for completed dates.
  function toISO(d) {
    return d.toISOString().slice(0, 10);
  }

  function isToday(d) {
    const today = new Date();
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  }

  function shortWeekday(d) {
    return d.toLocaleDateString(undefined, { weekday: "short" });
  }

  function dayNumber(d) {
    return d.getDate();
  }

  function getLastSevenDays() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(new Date(date));
    }
    return days;
  }

  const completedDates = Array.isArray(habit.completedDates)
    ? habit.completedDates
    : [];

  const todayISO = toISO(new Date());
  const isCompletedToday = completedDates.includes(todayISO);

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
              aria-label="Edit habit"
            >
              <Edit className={styles.headerIcon} />
            </button>
            <button
              className={`${styles.actionButton} ${styles.deleteButton}`}
              onClick={() => onDelete(habit.id)}
              aria-label="Delete habit"
            >
              <Trash2 className={styles.headerIcon} />
            </button>
          </div>
        </div>

        {habit.description && (
          <p className={styles.description}>{habit.description}</p>
        )}

        <div className={styles.streakContainer}>
          <Flame className={`${styles.flameIcon} ${styles.streakIcon}`} />
          <span className={styles.streakNumber}>{habit.streak || 0}</span>
          <span className={styles.streakText}>day streak</span>
        </div>

        <div className={styles.daysGrid}>
          {getLastSevenDays().map((date) => {
            const dateStr = toISO(date);
            const isCompleted = completedDates.includes(dateStr);
            const isTodayDate = isToday(date);

            const cellClass = isCompleted
              ? styles.completed
              : isTodayDate
              ? styles.today
              : styles.default;

            return (
              <div key={dateStr} className={`${styles.dayCell} ${cellClass}`}>
                <div className={styles.dayName}>{shortWeekday(date)}</div>
                <div className={styles.dayNumber}>{dayNumber(date)}</div>
                {isCompleted && <Check className={styles.checkIcon} />}
              </div>
            );
          })}
        </div>

        <button
          className={`${styles.completeButton} ${
            isCompletedToday ? styles.outline : styles.primary
          }`}
          onClick={() => onToggleComplete(habit.id, todayISO)}
        >
          {isCompletedToday ? "Undo Today" : "Complete Today"}
        </button>
      </div>
    </motion.div>
  );
}
