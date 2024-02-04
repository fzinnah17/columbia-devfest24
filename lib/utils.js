import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { DateTime } from "luxon";

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function postTimeStampDisplay(timestamp) {
  const postTimestamp = DateTime.fromISO(timestamp);
  const nowTimestamp = Date.now();
  const timeDiffInMinutes = Math.ceil(
    (nowTimestamp - postTimestamp) / 1000 / 60,
  );
  if (timeDiffInMinutes < 60) {
    return `${timeDiffInMinutes}m`;
  }
  const timeDiffInHours = Math.ceil(timeDiffInMinutes / 60);
  if (timeDiffInHours < 24) {
    return `${timeDiffInHours}h`;
  }
  const timeDiffInDays = Math.ceil(timeDiffInHours / 24);
  if (timeDiffInDays < 5) {
    return `${timeDiffInDays}d`;
  }
  return DateTime.fromISO(timestamp).toLocaleString(DateTime.DATETIME_SHORT);
}
