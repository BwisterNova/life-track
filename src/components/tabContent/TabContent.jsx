import { useState } from "react";
import styles from "./tabContent.module.css";
import Modal from "./Modal";
import GoalForm from "../goalForm/GoalForm";
import HabitForm from "../habitForm/HabitForm";

export default function TabContent() {
  // Which tab is currently selected. We use 'goals' or 'habits'.
  // `activeTab` drives what the UI shows (title, messages, which Add/Create text to show).
  // `setActiveTab` is the function we call to change it.
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

  // Close the modal (hide it). The modal component calls this when backdrop or close
  // button is clicked. You can also call it from inside the form after submission.
  function closeModal() {
    setModalOpen(false);
  }

  return (
    <div className={styles.container}>
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

      {/* Content card for the selected tab */}
      <div className={styles.contentCard}>
        {/* Header: title on left, add button on right */}
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

        {/* Empty state shown when there are no items yet */}
        <div className={styles.emptyState}>
          {/* Empty state helpful message — different text per tab. */}
          <p className={styles.emptyMessage}>
            {activeTab === "goals"
              ? "No goals yet. Create your first goal to get started!"
              : "No habits yet. Create your first habit to start tracking!"}
          </p>

          {/* Create opens the same modal but we set action='create' so you can show
              different labels or behavior inside the form if needed. */}
          <button
            className={styles.primaryButton}
            onClick={() => openModal(activeTab, "create")}
          >
            + Create {activeTab === "goals" ? "Goal" : "Habit"}
          </button>
        </div>
      </div>
      {/* Modal component: re-usable small modal with backdrop */}
      {/* Modal wrapper: renders backdrop and a centered box. We pass a title
          (e.g. "Add Goal" or "Create Habit") so the modal header shows it.
          The modal's children are the specific form components. */}
      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={`${modalAction === "add" ? "Add" : "Create"} ${
          modalFor === "goals" ? "Goal" : "Habit"
        }`}
      >
        {/* Choose the right form based on `modalFor`. Each form gets `onClose`
            so it can close the modal after submit or when user cancels. */}
        {modalFor === "goals" ? (
          <GoalForm onClose={closeModal} />
        ) : (
          <HabitForm onClose={closeModal} />
        )}
      </Modal>
    </div>
  );
}
