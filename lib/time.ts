export const toMin = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const overlaps = (
  first: { start: string; end: string },
  second: { start: string; end: string },
) => toMin(first.start) < toMin(second.end) && toMin(second.start) < toMin(first.end);

export const durationMinutes = (start: string, end: string) => Math.max(0, toMin(end) - toMin(start));

export const formatDuration = (minutes: number) => {
  const hours = minutes / 60;
  return Number.isInteger(hours) ? `${hours} hr${hours === 1 ? "" : "s"}` : `${hours.toFixed(1)} hrs`;
};

export const formatCurrency = (amount: number) => `LKR ${amount.toLocaleString("en-LK")}`;

export const timeOptions = (openTime: string, closeTime: string, stepMinutes = 30) => {
  const options: string[] = [];
  for (let value = toMin(openTime); value <= toMin(closeTime); value += stepMinutes) {
    options.push(`${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`);
  }
  return options;
};
