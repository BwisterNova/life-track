import styles from "./dashboard.module.css";
import Stats from "../stats/Stats";
import TabContent from "../tabContent/TabContent"

export default function Dashboard() {
  return (
    <div className={styles.dashboardContent}>
      <Stats />
      <TabContent/>
    </div>
  );
}
