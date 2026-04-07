import {
  faArrowUp,
  faArrowDown,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import type { SortOptionItem } from "./Header.types";

export const SORT_OPTIONS: SortOptionItem[] = [
  { value: "nameAZ",     label: "A to Z",       icon: faArrowUp,   group: "name" },
  { value: "nameZA",     label: "Z to A",        icon: faArrowDown, group: "name" },
  { value: "dateNewest", label: "Newest first",  icon: faClock,     group: "date" },
  { value: "dateOldest", label: "Oldest first",  icon: faClock,     group: "date" },
];
