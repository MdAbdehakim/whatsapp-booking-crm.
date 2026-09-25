import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parse, addMinutes, isBefore, isAfter, setHours, setMinutes } from "date-fns";
import { fr } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return "Sur devis";
  return `${price} DH`;
}

export function formatFrenchDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "EEEE d MMMM yyyy", { locale: fr });
}

export function formatFrenchTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "HH:mm");
}

/**
 * Standardize Moroccan phone numbers into international E.164 format (+212...)
 * Examples:
 * 0661234567 -> +212661234567
 * 0712345678 -> +212712345678
 * +212661234567 -> +212661234567
 */
export function sanitizePhoneNumber(phone: string): string {
  let cleaned = phone.replace(/[\s\-\(\)\.]/g, "");
  
  if (cleaned.startsWith("0")) {
    cleaned = "+212" + cleaned.substring(1);
  } else if (cleaned.startsWith("212")) {
    cleaned = "+" + cleaned;
  } else if (!cleaned.startsWith("+")) {
    cleaned = "+212" + cleaned;
  }
  
  return cleaned;
}

/**
 * Generate available time slots for a given day
 */
export interface Slot {
  time: string; // "09:30"
  startTime: Date;
  endTime: Date;
  available: boolean;
  reason?: string;
}

export function generateDailySlots({
  targetDate,
  startTimeStr, // "09:00"
  endTimeStr,   // "18:00"
  serviceDurationMin, // 30
  existingBookings, // Array of { startTime: Date, endTime: Date }
  bufferMin = 5,
}: {
  targetDate: Date;
  startTimeStr: string;
  endTimeStr: string;
  serviceDurationMin: number;
  existingBookings: { startTime: Date; endTime: Date }[];
  bufferMin?: number;
}): Slot[] {
  const slots: Slot[] = [];

  const [startHour, startMin] = startTimeStr.split(":").map(Number);
  const [endHour, endMin] = endTimeStr.split(":").map(Number);

  let currentSlotStart = setMinutes(setHours(targetDate, startHour), startMin);
  currentSlotStart.setSeconds(0, 0);

  const dayEnd = setMinutes(setHours(targetDate, endHour), endMin);
  dayEnd.setSeconds(0, 0);

  const now = new Date();

  while (isBefore(addMinutes(currentSlotStart, serviceDurationMin), dayEnd) || 
         currentSlotStart.getTime() + serviceDurationMin * 60000 <= dayEnd.getTime()) {
    
    const currentSlotEnd = addMinutes(currentSlotStart, serviceDurationMin);

    // Check if slot is in the past (if targetDate is today)
    const isPast = isBefore(currentSlotStart, now);

    // Check if slot overlaps with any existing booking
    const hasOverlap = existingBookings.some((booking) => {
      const bStart = new Date(booking.startTime);
      const bEnd = new Date(booking.endTime);
      
      // Overlap condition: slotStart < bEnd && slotEnd > bStart
      return isBefore(currentSlotStart, bEnd) && isAfter(currentSlotEnd, bStart);
    });

    slots.push({
      time: format(currentSlotStart, "HH:mm"),
      startTime: new Date(currentSlotStart),
      endTime: new Date(currentSlotEnd),
      available: !isPast && !hasOverlap,
      reason: isPast ? "Heure passée" : hasOverlap ? "Créneau déjà réservé" : undefined,
    });

    // Advance by service duration + buffer
    currentSlotStart = addMinutes(currentSlotStart, serviceDurationMin + bufferMin);
  }

  return slots;
}
