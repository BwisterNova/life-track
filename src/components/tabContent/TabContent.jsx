import { useState, useEffect } from "react";
import styles from "./tabContent.module.css";
import Modal from "./Modal";
import GoalForm from "../goalForm/GoalForm";
import HabitForm from "../habitForm/HabitForm";
import GoalCard from "../goalCard/GoalCard";
import HabitCard from "../habitCard/HabitCard";
import Stats from "../stats/Stats";
import { getJSON, setJSON } from "../../lib/storage";
import { computeStats } from "../../lib/stats";

export default function TabContent() {
  // Which tab is currently selected. We use 'goals' or 'habits'.
  // `activeTab` drives what the UI shows (title, messages, which Add/Create text to show).
  const [activeTab, setActiveTab] = useState("goals");

  /* Modal state explained in simple terms:
    - modalOpen (true/false): is the modal visible?
    - modalFor ('goals'|'habits'): which form should be shown inside the modal
    - modalAction ('add'|'create'): whether user clicked an "Add" or "Create" button
    These three values together tell the modal what to show and when. */
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFor, setModalFor] = useState("goals");
  const [modalAction, setModalAction] = useState("add"); // 'add' or 'create'

  // Helper to open the modal. We set what type (tab) and action it is, then show it.
  // Example: openModal('habits', 'create') will open the modal to create a habit.
  function openModal(tab, action = "add") {
    setModalFor(tab);
    setModalAction(action);
    setModalOpen(true);
  }

  // Close the modal (hide it).

  function closeModal() {
    setModalOpen(false);
  }

  // In-memory storage for created goals and habits. This is a simple demo
  // implementation so created items show up immediately in the UI.
  // Initialize from localStorage so data persists across refreshes.
  const [goals, setGoals] = useState(() => getJSON("lt_goals", []));
  const [habits, setHabits] = useState(() => getJSON("lt_habits", []));
  // Temporary holder for the goal being edited (passed to GoalForm as initialGoal)
  const [editingGoal, setEditingGoal] = useState(null);
  // Temporary holder for habit being edited
  const [editingHabit, setEditingHabit] = useState(null);

  // Handlers passed to the forms via `onSave`.
  function handleSaveGoal(newGoal) {
    // If the incoming goal id already exists, update that goal (edit flow),
    // otherwise treat this as a new goal and prepend it to the list.
    setGoals((s) => {
      const exists = s.find((g) => g.id === newGoal.id);
      if (exists) {
        return s.map((g) => (g.id === newGoal.id ? { ...g, ...newGoal } : g));
      }
      return [newGoal, ...s];
    });
    setActiveTab("goals");
    closeModal();
  }

  function handleSaveHabit(newHabit) {
    // If habit exists (edit), update it; otherwise prepend as new.
    setHabits((s) => {
      const exists = s.find((h) => h.id === newHabit.id);
      if (exists) {
        return s.map((h) => (h.id === newHabit.id ? { ...h, ...newHabit } : h));
      }
      // ensure new habit has completedDates and streak fields
      return [{ completedDates: [], streak: 0, ...newHabit }, ...s];
    });
    setActiveTab("habits");
    closeModal();
  }

  // Toggle completion for a specific habit on a given ISO date (YYYY-MM-DD).
  // If the date exists in `completedDates` it will be removed (undo), otherwise added.
  // We also recompute a simple `streak` value: consecutive days up to today.
  function handleToggleHabitComplete(id, dateISO) {
    function computeStreak(completedSet) {
      let count = 0;
      const today = new Date();
      // walk backward from today while dates exist in the set
      for (let offset = 0; ; offset++) {
        const d = new Date();
        d.setDate(today.getDate() - offset);
        const k = d.toISOString().slice(0, 10);
        if (completedSet.has(k)) count++;
        else break;
      }
      return count;
    }

    setHabits((s) =>
      s.map((h) => {
        if (h.id !== id) return h;
        const prev = Array.isArray(h.completedDates)
          ? [...h.completedDates]
          : [];
        const set = new Set(prev);
        if (set.has(dateISO)) set.delete(dateISO);
        else set.add(dateISO);
        const updatedDates = Array.from(set).sort();
        const streak = computeStreak(new Set(updatedDates));
        return { ...h, completedDates: updatedDates, streak };
      })
    );
  }

  // Persist whenever goals or habits change.
  useEffect(() => {
    setJSON("lt_goals", goals);
  }, [goals]);

  useEffect(() => {
    setJSON("lt_habits", habits);
  }, [habits]);

  // Confirm-delete modal state
  const [confirmDelete, setConfirmDelete] = useState(null);

  function requestDeleteGoal(id) {
    const g = goals.find((x) => x.id === id);
    setConfirmDelete({
      type: "goal",
      id,
      title: g?.title || g?.name || "this goal",
    });
  }

  function requestDeleteHabit(id) {
    const h = habits.find((x) => x.id === id);
    setConfirmDelete({ type: "habit", id, title: h?.name || "this habit" });
  }

  // Card action handlers (delete / update progress / complete)
  function handleDeleteGoal(id) {
    setGoals((s) => s.filter((g) => g.id !== id));
  }

  function handleUpdateGoalProgress(id, newProgress) {
    setGoals((s) =>
      s.map((g) => (g.id === id ? { ...g, progress: newProgress } : g))
    );
  }

  function handleCompleteGoal(id) {
    setGoals((s) => s.map((g) => (g.id === id ? { ...g, progress: 100 } : g)));
  }

  function handleDeleteHabit(id) {
    setHabits((s) => s.filter((h) => h.id !== id));
  }

  function handleEditHabit(id) {
    const h = habits.find((x) => x.id === id);
    if (!h) return;
    setModalFor("habits");
    setModalAction("edit");
    setModalOpen(true);
    setEditingHabit(h);
  }

  // Open the modal to edit an existing goal. We find the goal and pass it
  // into `GoalForm` via `initialGoal` so the form is pre-populated.
  function handleEditGoal(id) {
    const g = goals.find((x) => x.id === id);
    if (!g) return;
    // Open modal for editing with that goal
    setModalFor("goals");
    setModalAction("edit");
    setModalOpen(true);
    // store the goal to be edited in a temporary ref state (we'll pass it to the form)
    setEditingGoal(g);
  }

  const stats = computeStats(goals, habits);

  return (
    <div className={styles.container}>
      <Stats stats={stats} />
      {/* Tab row: left-aligned rectangular tab with two options */}
      <div
        className={styles.tabWrapper}
        role="tablist"
        aria-label="Goals and Habits"
      >
        <button
          className={`${styles.tab} ${
            activeTab === "goals" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("goals")}
          role="tab"
          aria-selected={activeTab === "goals"}
        >
          Goals
        </button>

        <button
          className={`${styles.tab} ${
            activeTab === "habits" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("habits")}
          role="tab"
          aria-selected={activeTab === "habits"}
        >
          Habits
        </button>
      </div>

      {/* Content for tab selected*/}
      <div className={styles.contentCard}>
        <div className={styles.contentHeader}>
          {/* The title changes depending on which tab is active. */}
          <h2 className={styles.title}>
            {activeTab === "goals" ? "Your Goals" : "Your Habits"}
          </h2>

          {/* When Add is clicked we open the modal. We pass the current tab so the modal
              knows whether to render GoalForm or HabitForm. */}
          <button
            className={styles.addButton}
            onClick={() => openModal(activeTab, "add")}
          >
            + Add {activeTab === "goals" ? "Goal" : "Habit"}
          </button>
        </div>

        {/* If the active tab has created items, render cards; otherwise show empty state */}
        {activeTab === "goals" ? (
          goals.length > 0 ? (
            <div className={styles.cardsGrid}>
              {goals.map((g) => (
                <GoalCard
                  key={g.id}
                  goal={g}
                  onDelete={requestDeleteGoal}
                  onUpdateProgress={handleUpdateGoalProgress}
                  onComplete={handleCompleteGoal}
                  onEdit={handleEditGoal}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyMessage}>
                No goals yet. Create your first goal to get started!
              </p>
              <button
                className={styles.primaryButton}
                onClick={() => openModal(activeTab, "create")}
              >
                + Create Goal
              </button>
            </div>
          )
          ) : habits.length > 0 ? (
          <div className={styles.cardsGrid}>
            {habits.map((h) => (
              <HabitCard
                key={h.id}
                habit={h}
                onDelete={requestDeleteHabit}
                onEdit={handleEditHabit}
                onToggleComplete={handleToggleHabitComplete}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyMessage}>
              No habits yet. Create your first habit to start tracking!
            </p>
            <button
              className={styles.primaryButton}
              onClick={() => openModal(activeTab, "create")}
            >
              + Create Habit
            </button>
          </div>
        )}
      </div>
      {/* Modal component pop modal for both habits and goals*/}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={
          modalAction === "edit"
            ? `Edit ${modalFor === "goals" ? "Goal" : "Habit"}`
            : `Create New ${modalFor === "goals" ? "Goal" : "Habit"}`
        }
      >
        {/* Choose the right form based on `modalFor`. Each form gets `onClose`
            so it can close the modal after submit or when user cancels. */}
        {modalFor === "goals" ? (
          <GoalForm
            onClose={closeModal}
            onSave={handleSaveGoal}
            initialGoal={modalAction === "edit" ? editingGoal : null}
          />
        ) : (
          <HabitForm
            onClose={closeModal}
            onSave={handleSaveHabit}
            initialHabit={modalAction === "edit" ? editingHabit : null}
          />
        )}
      </Modal>
      {/* Confirm delete modal */}
      <Modal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title={
          confirmDelete
            ? `Delete ${confirmDelete.type === "goal" ? "Goal" : "Habit"}?`
            : ""
        }
      >
        {confirmDelete && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <p>
              Are you sure you want to delete "{confirmDelete.title}"? This
              action cannot be undone.
            </p>
            <div
              style={{
                display: "flex",
                gap: ".5rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                className={styles.cancelBtn}
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button
                className={styles.createBtn}
                onClick={() => {
                  if (confirmDelete.type === "goal")
                    handleDeleteGoal(confirmDelete.id);
                  else handleDeleteHabit(confirmDelete.id);
                  setConfirmDelete(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
