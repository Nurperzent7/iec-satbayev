import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatUTCDate = (date: string, hl: string = 'kk') => {
  const HL_TO_LOCALE: Record<string, string> = {
    'kk': 'kk-KZ',
    'ru': 'ru-RU',
    'en': 'en-US'
  };
  const locale = HL_TO_LOCALE?.[hl] ?? 'kk-KZ';

  const timeZoneOffset = new Date().getTimezoneOffset();
  return new Date(new Date(date).getTime() + timeZoneOffset * 60000).toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};