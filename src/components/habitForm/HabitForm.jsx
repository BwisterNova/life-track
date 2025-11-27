import { useState, useRef, useEffect } from "react";
import styles from "./habitForm.module.css";

// HabitForm supports an optional `onSave` callback that receives the
// created habit object. `onClose` closes the modal.
// `initialHabit` (optional): if provided the form will be populated and
// submitting will update the existing habit (edit). `onSave` receives the
// created/updated habit object.
export default function HabitForm({ onClose, onSave, initialHabit = null }) {
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

  // If editing, populate form fields from initialHabit
  useEffect(() => {
    if (initialHabit) {
      setName(initialHabit.name || "");
      setDescription(initialHabit.description || "");
      setSelectFrequency(initialHabit.frequency || FREQUENCY[0]);
      setSelectedIcon(initialHabit.icon || ICONS[0]);
      setSelectedColor(initialHabit.color || COLORS[0]);
    }
  }, [initialHabit]);

  // Ref to dropdown wrapper so clicking outside closes it (backdrop behavior)
  const frequencyRef = useRef(null);

  useEffect(() => {
    function handleOutside(e) {
      if (
        frequencyOpen &&
        frequencyRef.current &&
        !frequencyRef.current.contains(e.target)
      ) {
        setFrequencyOpen(false);
      }
    }

    function handleKey(e) {
      if (e.key === "Escape") setFrequencyOpen(false);
    }

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [frequencyOpen]);

  // Controlled inputs for habit name + description so we can submit data
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Submit handler builds a habit object and calls onSave (if provided)
  function handleSubmit(e) {
    e?.preventDefault();
    const newHabit = {
      // preserve id when editing
      id: initialHabit && initialHabit.id ? initialHabit.id : Date.now(),
      name: name.trim() || "Untitled Habit",
      description: description.trim(),
      frequency: selectFrequency,
      icon: selectedIcon,
      color: selectedColor,
      createdAt:
        initialHabit && initialHabit.createdAt
          ? initialHabit.createdAt
          : new Date().toISOString(),
    };
    if (typeof onSave === "function") onSave(newHabit);
    onClose();
  }

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
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
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className={styles.dropdownWrapper} ref={frequencyRef}>
          {/* Frequency label + toggle. Clicking the box opens the menu */}
          <label className={styles.label} htmlFor="frequency">
            Frequency
          </label>
          <div
            className={styles.dropdown}
            onClick={() => setFrequencyOpen(!frequencyOpen)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) =>
              e.key === "Enter" && setFrequencyOpen(!frequencyOpen)
            }
          >
            <span className={styles.dropdownValue}>{selectFrequency}</span>
            <span
              className={`${styles.arrow} ${frequencyOpen ? styles.open : ""}`}
            >
              ▾
            </span>
          </div>

          {/* Frequency Dropdown menu: use dropdownItem for items (previously used dropdownMenu for items). */}
          {frequencyOpen && (
            <div className={styles.dropdownMenu}>
              {FREQUENCY.map((cat) => (
                <button
                  key={cat}
                  className={styles.dropdownItem}
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
    </form>
  );
}
