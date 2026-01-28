import { UIKeywords } from "./keywords";

export function getThemeClasses(keywords: UIKeywords) {
  return {
    button: {
      padding:
        keywords.density === "compact"
          ? "px-2 py-1"
          : keywords.density === "spacious"
            ? "px-6 py-3"
            : "px-5 py-3",
      radius: keywords.shape === "rounded" ? "rounded-xl" : "rounded-none",
      border:
        keywords.contrast === "high"
          ? "border-2 border-black"
          : "border border-gray-300",
    },
    input: {
      padding:
        keywords.density === "compact"
          ? "px-2 py-1"
          : keywords.density === "spacious"
            ? "px-6 py-3"
            : "px-5 py-2",
      radius: keywords.shape === "rounded" ? "rounded-xl" : "rounded-none",
      border:
        keywords.contrast === "high"
          ? "border-2 border-black"
          : "border border-gray-300",
    },
    card: {
      shadow:
        keywords.style === "modern"
          ? "shadow-xl"
          : keywords.style === "minimal"
            ? "shadow-none"
            : "shadow-md",
      background: keywords.contrast === "low" ? "bg-gray-50" : "bg-white",
    },
  };
}
