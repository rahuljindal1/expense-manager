import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const truncateString = (str: string, maxLength: number) => {
  return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;
};
