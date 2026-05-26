import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function getWorkingDaysInMonth(year: number, month: number): number {
  let count = 0;
  const date = new Date(year, month - 1, 1);

  while (date.getMonth() === month - 1) {
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
    date.setDate(date.getDate() + 1);
  }

  return count;
}

export function getWorkingDaysInQuarter(year: number, quarter: number): number {
  const startMonth = (quarter - 1) * 3 + 1;
  let count = 0;

  for (let month = startMonth; month < startMonth + 3; month++) {
    count += getWorkingDaysInMonth(year, month);
  }

  return count;
}

export function getDaysInWeek(): number {
  return 5; // Standard 5-day work week (Mon-Fri)
}
