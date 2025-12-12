import styles from "./dashboard.module.css";
import TabContent from "../tabContent/TabContent";

export default function Dashboard() {
  return (
    <div className={styles.dashboardContent}>
      <TabContent />
    </div>
  );
}
