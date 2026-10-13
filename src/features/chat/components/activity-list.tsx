import type { Activity } from "../types";
import { ActivityItem } from "./activity-item";

export function ActivityList({ activities }: { activities: Activity[] }) {
  return (
    <ol className="space-y-0.5" aria-label="Agent steps">
      {activities.map((activity, index) => (
        <ActivityItem key={`${activity.startedAt}-${activity.tool}-${index}`} activity={activity} />
      ))}
    </ol>
  );
}
