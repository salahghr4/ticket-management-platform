import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { subMonths, format, addDays } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const fillMissingDates = (data: { date: string; count: number }[]) => {
  const filledData: { date: string; count: number }[] = [];
  const startDate = subMonths(new Date(), 3);
  const endDate = new Date();

  // Create map of existing data
  const dataMap: { [key: string]: number } = {};
  data.forEach((item) => {
    dataMap[item.date] = item.count;
  });

  // Fill in all dates
  let currentDate = startDate;
  while (currentDate <= endDate) {
    const dateStr = format(currentDate, "yyyy-MM-dd");
    filledData.push({
      date: dateStr,
      count: dataMap[dateStr] || 0,
    });
    currentDate = addDays(currentDate, 1);
  }

  return filledData;
};
