import styles from "./habitForm.module.css";

// HabitForm is rendered inside the Modal when the user wants to add/create a habit.
// The `onClose` prop closes the modal — call it after saving or when the user cancels.
export default function HabitForm({ onClose }) {
  return (
    <div className={styles.formContainer}>
      {/*
        TODO: Add habit-specific inputs here. Suggestions:
        - Habit name (text input)
        - Description (textarea)
        - Frequency (daily/weekly) selector
        - Optional reminders or start date
        - A submit button that saves the habit and then calls `onClose()`
      */}

      <h2>Create New Habit</h2>
      <div>
        <span>
          <label>Habit Name</label>
          <input type="text" placeholder="Enter habit name" />
        </span>

        <span>
          <label>Description (Optional)</label>
          <textarea name="" cols="30" rows="4" />
        </span>

        <span>
          <label>Frequency</label>
          {/* Replace this placeholder with a real control (select, radios, etc.) */}
        </span>
      </div>

      {/* Close button helps you test the modal without adding form logic. */}
      <button className={styles.closeBtn} onClick={onClose} type="button">
        Close
      </button>
    </div>
  );
}
