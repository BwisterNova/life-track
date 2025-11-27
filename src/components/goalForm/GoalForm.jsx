import { useState, useRef, useEffect } from "react";
import styles from "./goalForm.module.css";

// GoalForm is the form UI placed inside the modal. It is self-contained and
// focuses on UI only — you will add logic to save data later.
// `onSave` is an optional callback the parent can pass to receive the
// created goal object. We keep `onClose` so the modal can be closed.
// `initialGoal` (optional): when provided the form will be populated and
// submitting will behave like an edit (the same `onSave` callback receives
// the object with the same `id`).
//
// NOTE (responsiveness): inputs and textarea use the CSS rule
// `box-sizing: border-box` (see `goalForm.module.css`) so horizontal padding
// is counted inside `width: 100%`. This prevents padding from causing the
// controls to overflow their parent container when you add left/right
// padding — you can safely tune `padding` in CSS without breaking layout.
export default function GoalForm({ onClose, onSave, initialGoal = null }) {
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
  // Default deadline to today's date (ISO yyyy-mm-dd) so the date input
  // shows the user's current date by default and updates daily when the
  // page is reloaded. This prevents the empty "mm/dd/yyyy" placeholder
  // and gives a sensible default the user can change.
  const [deadline, setDeadline] = useState(() =>
    new Date().toISOString().slice(0, 10)
  ); // yyyy-mm-dd
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  // If `initialGoal` is provided we populate form state with its values so
  // the same form can be used for editing. `useEffect` ensures the form is
  // updated if a different initialGoal is provided later.
  useEffect(() => {
    if (initialGoal) {
      setTitle(initialGoal.title || "");
      setDescription(initialGoal.description || "");
      setSelectedCategory(initialGoal.category || CATEGORIES[0]);
      // If the initial goal has a deadline, try to normalize it to yyyy-mm-dd
      // so the date input displays a proper value. If not provided, keep
      // the default of today's date.
      setDeadline(
        initialGoal.deadline
          ? new Date(initialGoal.deadline).toISOString().slice(0, 10)
          : new Date().toISOString().slice(0, 10)
      );
      setSelectedIcon(initialGoal.icon || ICONS[0]);
      setSelectedColor(initialGoal.color || COLORS[0]);
    }
  }, [initialGoal]);

  // Example submit handler stub — you'll replace with real save logic later.
  function handleSubmit(e) {
    e.preventDefault();
    // Build a simple goal object and send it to the parent via onSave.
    // The parent (TabContent) will keep it in-memory and render a card.
    // Preserve id when editing; otherwise create a new id for new goal
    const newGoal = {
      id: initialGoal && initialGoal.id ? initialGoal.id : Date.now(),
      title: title.trim() || "Untitled Goal",
      description: description.trim(),
      category: selectedCategory,
      icon: selectedIcon,
      color: selectedColor,
      deadline: deadline || null,
      // If editing, preserve existing progress; otherwise start at 0
      progress:
        initialGoal && typeof initialGoal.progress === "number"
          ? initialGoal.progress
          : 0,
      createdAt:
        initialGoal && initialGoal.createdAt
          ? initialGoal.createdAt
          : new Date().toISOString(),
    };

    if (typeof onSave === "function") onSave(newGoal);
    // Close the modal after saving
    onClose();
  }

  // Ref for the category dropdown wrapper so we can detect clicks outside
  // and close the dropdown (backdrop-style behavior).
  const categoryRef = useRef(null);

  useEffect(() => {
    // Handler will close dropdown when clicking/tapping outside it
    function handleOutside(e) {
      if (
        categoryOpen &&
        categoryRef.current &&
        !categoryRef.current.contains(e.target)
      ) {
        setCategoryOpen(false);
      }
    }

    // Support mouse and touch start events
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);

    // Also close with Escape key for accessibility
    function handleKey(e) {
      if (e.key === "Escape") setCategoryOpen(false);
    }
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [categoryOpen]);

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
        {/* Category dropdown (custom)
            - Uses a ref + document listeners to implement backdrop-style
              behavior: clicking anywhere outside will close the open menu.
            - The toggler is keyboard-accessible (role/button + Enter key).
        */}
        <div className={styles.dropdownWrapper} ref={categoryRef}>
          <label className={styles.label}>Category</label>
          <div
            className={styles.dropdown}
            onClick={() => setCategoryOpen(!categoryOpen)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) =>
              e.key === "Enter" && setCategoryOpen(!categoryOpen)
            }
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
