import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./tabContent.module.css";

// Modal component explained for a beginner:
// - `open` (boolean): show or hide the modal. If false, the component returns null.
// - `title` (string): text shown in the modal header (like "Add Goal").
// - `onClose` (function): called when the user wants to close the modal
//    (clicking backdrop or the close button).
// - `children`: whatever JSX you put inside the <Modal> ... </Modal> tags.
// This version also locks the page scroll while modal is open and animates
// open/close using framer-motion.
export default function Modal({ open, title, onClose, children }) {
  // Lock page scrolling when modal is open so the background doesn't scroll.
  useEffect(() => {
    const previous = document.body.style.overflow;
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = previous || "";
    };
  }, [open]);

  // Animation variants for backdrop and modal
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 10, scale: 0.99 },
  };

  // AnimatePresence makes exit animations work when component unmounts
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.modalBackdrop}
          onClick={onClose}
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          transition={{ duration: 0.18 }}
        >
          <motion.div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            onClick={(e) => e.stopPropagation()}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{title}</h3>
              <button
                className={styles.modalClose}
                onClick={onClose}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
