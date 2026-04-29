import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function formatStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export function toSentenceCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function absoluteEventUrl(slug: string, suffix = "") {
  return `http://localhost:3000/event/${slug}${suffix}`;
}
