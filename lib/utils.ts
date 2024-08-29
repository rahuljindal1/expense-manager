import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const truncateString = (str: string, maxLength: number) => {
  return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;
};

export const formatToIndianCurrency = (amount: number) => {
  return amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const debounce = (fn: Function, durationInMilliSeconds = 300) => {
  let timer: NodeJS.Timeout | undefined;
  return function (...args: any[]) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(null, args);
    }, durationInMilliSeconds);
  };
};
