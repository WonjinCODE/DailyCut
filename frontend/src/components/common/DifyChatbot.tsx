import { useEffect } from "react";

declare global {
  interface Window {
    difyChatbotConfig?: {
      token: string;
      inputs?: Record<string, string>;
      systemVariables?: Record<string, string>;
      userVariables?: Record<string, string>;
    };
  }
}

export default function DifyChatbot() {
  useEffect(() => {
    const token = "XWqIgIlkyKNeVRpx";

    window.difyChatbotConfig = {
      token,
      inputs: {},
      systemVariables: {},
      userVariables: {},
    };

    if (!document.getElementById(token)) {
      const script = document.createElement("script");
      script.src = "https://udify.app/embed.min.js";
      script.id = token;
      script.defer = true;

      script.onload = () => {
        console.log("Dify chatbot loaded");
      };

      script.onerror = () => {
        console.error("Dify chatbot failed to load");
      };

      document.body.appendChild(script);
    }

    if (!document.getElementById("dify-chatbot-style")) {
      const style = document.createElement("style");
      style.id = "dify-chatbot-style";
      style.innerHTML = `
        #dify-chatbot-bubble-button {
        position: fixed !important;
        right: 24px !important;
        bottom: 24px !important;
        background-color: #1C64F2 !important;
        z-index: 2147483647 !important;
        display: flex !important;
        opacity: 1 !important;
        visibility: visible !important;
      }

      #dify-chatbot-bubble-window {
        position: fixed !important;
        right: 24px !important;
        bottom: 90px !important;
        width: 24rem !important;
        height: 40rem !important;
        z-index: 2147483647 !important;
      }
    `;
      document.head.appendChild(style);
    }
  }, []);

  return null;
}