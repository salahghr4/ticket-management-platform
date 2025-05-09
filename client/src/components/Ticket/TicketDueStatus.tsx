import { differenceInCalendarDays, isPast, isToday } from "date-fns";

const TicketDueStatus = ({dueDate}: {dueDate: Date}) => {
  const getDueDateStatus = (dueDate: Date) => {
    const today = new Date();
    const daysDiff = differenceInCalendarDays(dueDate, today);

    if (!dueDate) return { color: "", text: "No due date" };
    // Overdue
    if (isPast(dueDate) && !isToday(dueDate)) {
      const overdueDays = Math.abs(daysDiff);

      if (overdueDays === 1) {
        return { color: "text-red-500", text: "Overdue by 1 day" };
      }
      if (overdueDays < 7) {
        return {
          color: "text-red-500",
          text: `Overdue by ${overdueDays} days`,
        };
      }
      if (overdueDays < 30) {
        const weeks = Math.floor(overdueDays / 7);
        return {
          color: "text-red-500",
          text: `Overdue by ${weeks} ${weeks === 1 ? "week" : "weeks"}`,
        };
      }
      const months = Math.floor(overdueDays / 30);
      return {
        color: "text-red-500",
        text: `Overdue by ${months} ${months === 1 ? "month" : "months"}`,
      };
    }

    // Due today
    if (isToday(dueDate)) {
      return { color: "text-orange-500", text: "Due today" };
    }

    // Upcoming
    if (daysDiff === 1) {
      return { color: "text-orange-500", text: "Due tomorrow" };
    }
    if (daysDiff <= 3) {
      return { color: "text-orange-500", text: `Due in ${daysDiff} days` };
    }

    if (daysDiff < 7) {
      return { color: "text-yellow-500", text: `Due in ${daysDiff} days` };
    }

    if (daysDiff === 7) {
      return { color: "text-yellow-500", text: "Due in 1 week" };
    }
    if (daysDiff < 30) {
      const weeks = Math.floor(daysDiff / 7);
      return {
        color: "text-yellow-500",
        text: `Due in ${weeks} ${weeks === 1 ? "week" : "weeks"} ${
          daysDiff % 7 === 0 ? "" : "and " + (daysDiff % 7) + " days"
        }`,
      };
    }
    if (daysDiff === 30) {
      return { color: "text-green-500", text: "Due in 1 month" };
    }
    if (daysDiff > 30) {
      const months = Math.ceil(daysDiff / 30);
      return {
        color: "text-green-500",
        text: `Due in ${months} ${months === 1 ? "month" : "months"} ${
          daysDiff % 30 === 0 ? "" : "and " + (daysDiff % 30) + " days"
        }`,
      };
    }

    const months = Math.ceil(daysDiff / 30);
    return {
      color: "text-green-500",
      text: `Due in ${months} ${months === 1 ? "month" : "months"}`,
    };
  };

  return (
    <p className={`text-sm ${getDueDateStatus(dueDate).color}`}>
      {getDueDateStatus(dueDate).text}
    </p>
  );
};

export default TicketDueStatus;
