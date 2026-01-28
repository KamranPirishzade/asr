"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { UIKeywords, defaultKeywords } from "@/lib/design/keywords";

const DesignContext = createContext<{
  keywords: UIKeywords;
  setKeywords: (k: UIKeywords) => void;
}>({
  keywords: defaultKeywords,
  setKeywords: () => {},
});

export function DesignProvider({ children }: { children: ReactNode }) {
  const [keywords, setKeywords] = useState<UIKeywords>(defaultKeywords);

  return (
    <DesignContext.Provider value={{ keywords, setKeywords }}>
      {children}
    </DesignContext.Provider>
  );
}

export const useDesign = () => useContext(DesignContext);
