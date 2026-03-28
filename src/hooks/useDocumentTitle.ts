import { useEffect } from "react";

export function useDocumentTitle(title: string) {
  useEffect(() => {
    const original_title = document.title;

    document.title = ` ${title} | ${original_title}`;

    return () => {
      document.title = original_title;
    };
  }, [title]);
}
