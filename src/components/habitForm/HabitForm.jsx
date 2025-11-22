import { useState } from "react";
import styles from "./habitForm.module.css";

export default function HabitForm({ onClose }) {
  const FREQUENCY = ["Daily", "Weekly"];

  const COLORS = [
    "#60A5FA",
    "#34D399",
    "#A78BFA",
    "#F472B6",
    "#FBBF24",
    "#F87171",
  ];
  const ICONS = ["💪", "🏃", "📚", "🧘", "💧", "🥗", "😴", "✍️", "🎵", "🎨"];

  /*Frequency dropdown */
  const [selectFrequency, setSelectFrequency] = useState(FREQUENCY[0]);

  const [frequencyOpen, setFrequencyOpen] = useState(false);

  // Color + Icon
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  return (
    <div className={styles.formContainer}>
      <div>
        <div>
          <label className={styles.label} htmlFor="name">
            Habit Name
          </label>
          <input
            type="text"
            id="name"
            className={styles.input}
            placeholder="Enter habit name"
            required
          />
        </div>

        <div>
          <label className={styles.label} htmlFor="description">
            Description (Optional)
          </label>
          <textarea
            className={styles.textarea}
            id="description"
            cols="30"
            rows="3"
            placeholder="Add more details about your habit"
          />
        </div>

        <div className={styles.dropdownWrapper}>
          <label className={styles.label} htmlFor="frequency">
            Frequency
          </label>
          <div
            className={styles.dropdown}
            onClick={() => setFrequencyOpen(!frequencyOpen)}
          >
            <span className={styles.dropdownValue}>{selectFrequency}</span>
            <span
              className={`${styles.arrow} ${frequencyOpen ? styles.open : ""}`}
            >
              ▾
            </span>
          </div>

          {/* Frequency Dropdown */}
          {frequencyOpen && (
            <div className={styles.dropdownMenu}>
              {FREQUENCY.map((cat) => (
                <button
                  key={cat}
                  className={styles.dropdownMenu}
                  type="button"
                  onClick={() => {
                    setSelectFrequency(cat);
                    setFrequencyOpen(false);
                  }}
                >
                  <span>{cat}</span>
                  {selectFrequency === cat && (
                    <span className={styles.check}>✔</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        {/* icon picker */}
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

        {/* Color */}

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
            Create Habit
          </button>
        </div>
      </div>
    </div>
  );
}
