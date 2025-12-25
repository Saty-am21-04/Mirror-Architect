import { useEffect } from "react";// src/hooks/useVsCodeMessages.ts
export function useVsCodeMessages(onHintReceived: (text: string) => void) {
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data.command === 'receiveHint') {
        onHintReceived(event.data.text);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onHintReceived]);
}