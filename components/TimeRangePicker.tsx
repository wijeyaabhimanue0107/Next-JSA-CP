"use client";

import { durationMinutes, formatCurrency, formatDuration, timeOptions, toMin, overlaps } from "@/lib/time";

export interface TimeRangeValue {
  start: string | null;
  end: string | null;
}

interface TimeRangePickerProps {
  openTime: string;
  closeTime: string;
  stepMinutes?: number;
  minDurationMinutes?: number;
  value: TimeRangeValue;
  onChange: (value: TimeRangeValue) => void;
  unavailableRanges?: { start: string; end: string }[];
  ratePerHour?: number;
  disabled?: boolean;
}

export default function TimeRangePicker({
  openTime,
  closeTime,
  stepMinutes = 30,
  minDurationMinutes = 60,
  value,
  onChange,
  unavailableRanges = [],
  ratePerHour = 0,
  disabled = false,
}: TimeRangePickerProps) {
  const options = timeOptions(openTime, closeTime, stepMinutes);
  const endOptions = value.start
    ? options.filter((option) => toMin(option) >= toMin(value.start as string) + minDurationMinutes)
    : [];
  const invalidDuration = Boolean(value.start && value.end && toMin(value.end) - toMin(value.start) < minDurationMinutes);
  const hasConflict = Boolean(
    value.start &&
      value.end &&
      unavailableRanges.some((range) => overlaps({ start: value.start as string, end: value.end as string }, range)),
  );
  const error = invalidDuration
    ? `Choose at least ${formatDuration(minDurationMinutes)}.`
    : hasConflict
      ? "Selected time overlaps an existing booking"
      : "";
  const minutes = value.start && value.end ? durationMinutes(value.start, value.end) : 0;

  return (
    <div className="range-picker">
      <div className="range-controls">
        <label>
          Start time
          <select
            aria-label="Start time"
            disabled={disabled}
            value={value.start ?? ""}
            onChange={(event) => {
              const start = event.target.value || null;
              const currentEnd = value.end && start && toMin(value.end) >= toMin(start) + minDurationMinutes ? value.end : null;
              onChange({ start, end: currentEnd });
            }}
          >
            <option value="">Select start</option>
            {options.slice(0, -1).map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <span className="range-separator" aria-hidden="true">to</span>
        <label>
          End time
          <select
            aria-label="End time"
            disabled={disabled || !value.start}
            value={value.end ?? ""}
            onChange={(event) => onChange({ ...value, end: event.target.value || null })}
          >
            <option value="">Select end</option>
            {endOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
      </div>
      <div className="range-summary" aria-live="polite">
        {value.start && value.end
          ? `${value.start} – ${value.end} · ${formatDuration(minutes)} · ${formatCurrency((minutes / 60) * ratePerHour)}`
          : "Choose a start and end time"}
      </div>
      {unavailableRanges.length > 0 && (
        <div className="unavailable-ranges">
          Already booked today: {unavailableRanges.map((range) => `${range.start} – ${range.end}`).join(", ")}
        </div>
      )}
      <div className={`range-error ${error ? "" : "empty"}`} aria-live="polite" role={error ? "alert" : undefined}>{error || " "}</div>
    </div>
  );
}
