import { useState } from "react";
import styles from "./goalForm.module.css";

// GoalForm is the form UI placed inside the modal. It is self-contained and
// focuses on UI only — you will add logic to save data later.
export default function GoalForm({ onClose }) {
  // Example options you asked for
  const CATEGORIES = [
    "Personal",
    "Career",
    "Health",
    "Finance",
    "Learning",
    "Other",
  ];
  const COLORS = [
    "#60A5FA",
    "#34D399",
    "#A78BFA",
    "#F472B6",
    "#FBBF24",
    "#F87171",
  ];
  const ICONS = ["🎯", "💼", "💪", "💰", "📚", "🎨", "🏃", "🧘", "🎵", "✈️"];

  // Local UI state for controlled inputs. These are not saved anywhere yet.
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [deadline, setDeadline] = useState(""); // we'll use type=date so browser helps
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  // Example submit handler stub — you'll replace with real save logic later.
  function handleSubmit(e) {
    e.preventDefault();
    // For now just close the modal; later you'll validate & persist the data
    onClose();
  }

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      {/* Title field */}

      <div>
        <label className={styles.label} htmlFor="goal-title">
          Title
        </label>
        <input
          id="goal-title"
          className={styles.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter goal title"
          required
        />
      </div>

      {/* Description textarea */}
      <div>
        <label className={styles.label} htmlFor="goal-desc">
          Description (Optional)
        </label>
        <textarea
          id="goal-desc"
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Write a short description"
        />
      </div>

      {/* Category + Deadline row */}
      <div className={styles.row}>
        {/* Category dropdown (custom) */}
        <div className={styles.dropdownWrapper}>
          <label className={styles.label}>Category</label>
          <div
            className={styles.dropdown}
            onClick={() => setCategoryOpen(!categoryOpen)}
          >
            <span className={styles.dropdownValue}>{selectedCategory}</span>
            <span
              className={`${styles.arrow} ${categoryOpen ? styles.open : ""}`}
            >
              ▾
            </span>
          </div>

          {/* Dropdown menu (simple) */}
          {categoryOpen && (
            <div className={styles.dropdownMenu}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={styles.dropdownItem}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCategoryOpen(false);
                  }}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && (
                    <span className={styles.check}>✔</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Deadline input */}
        <div className={styles.deadlineWrapper}>
          <label className={styles.label}>Deadline</label>
          <div className={styles.dateInputWrapper}>
            <input
              type="date"
              className={styles.dateInput}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
            {/* <span className={styles.calendarIcon}>📅</span> */}
          </div>
        </div>
      </div>

      {/* Icon + Color pickers */}
      <div>
        <label className={styles.label}>Icon</label>
        <div className={styles.iconGrid}>
          {ICONS.map((ic) => (
            <button
              key={ic}
              type="button"
              className={`${styles.iconBtn} ${
                selectedIcon === ic ? styles.selected : ""
              }`}
              onClick={() => setSelectedIcon(ic)}
              title={`Select ${ic}`}
            >
              <span className={styles.iconEmoji}>{ic}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={styles.label}>Color</label>
        <div className={styles.colorGrid}>
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              className={`${styles.colorSwatch} ${
                selectedColor === c ? styles.selectedColor : ""
              }`}
              onClick={() => setSelectedColor(c)}
              style={{ background: c }}
              aria-label={`Select color ${c}`}
            />
          ))}
        </div>
      </div>

      {/* Action buttons: submit (save) and cancel */}
      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className={styles.createBtn}>
          Create Goal
        </button>
      </div>
    </form>
  );
}
