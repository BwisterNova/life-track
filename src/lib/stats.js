// Compute lightweight stats from goals and habits for the Stats component.
export function computeStats(goals = [], habits = []) {
  const totalGoals = Array.isArray(goals) ? goals.length : 0;
  const completedGoals = Array.isArray(goals)
    ? goals.filter((g) => (g.progress || 0) >= 100).length
    : 0;
  const completionRate =
    totalGoals === 0 ? 0 : Math.round((completedGoals / totalGoals) * 100);

  // For streak we pick the maximum habit.streak value (simple heuristic).
  const currentStreak = Array.isArray(habits)
    ? Math.max(0, ...habits.map((h) => h.streak || 0))
    : 0;

  return {
    totalGoals,
    completedGoals,
    completionRate: `${completionRate}%`,
    currentStreak: `${currentStreak} days`,
    completed: completedGoals,
  };
}
