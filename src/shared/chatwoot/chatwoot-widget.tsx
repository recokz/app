"use client";

// Define types for Chatwoot
interface ChatwootSettings {
  hideMessageBubble: boolean;
  position: "left" | "right";
  locale: string;
  type: "standard" | "expanded_bubble";
}

interface ChatwootSDK {
  run: (config: { websiteToken: string; baseUrl: string }) => void;
}

// Extend the Window interface
declare global {
  interface Window {
    chatwootSettings?: ChatwootSettings;
    chatwootSDK?: ChatwootSDK;
  }
}

import { useEffect } from "react";

export const ChatwootWidget = () => {
  useEffect(() => {
    // Add Chatwoot Settings
    window.chatwootSettings = {
      hideMessageBubble: false,
      position: "right", // This can be left or right
      locale: "en", // Language to be set
      type: "standard", // [standard, expanded_bubble]
    };

    // Paste the script from inbox settings except the <script> tag
    (function (d: Document, t: string) {
      const BASE_URL = "https://app.chatwoot.com";
      const g = d.createElement(t) as HTMLScriptElement;
      const s = d.getElementsByTagName(t)[0];
      g.src = `${BASE_URL}/packs/js/sdk.js`;
      g.async = true;
      g.onload = () => {
        window.chatwootSDK?.run({
          websiteToken: process.env.NEXT_PUBLIC_CHATWOOT || "",
          baseUrl: BASE_URL,
        });
      };
      s.parentNode?.insertBefore(g, s);
    })(document, "script");
  }, []);

  return null;
};
