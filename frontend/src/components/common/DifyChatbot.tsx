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
    let observer: MutationObserver | null = null;

    const applyDifyChatbotPosition = () => {
      const button = document.getElementById("dify-chatbot-bubble-button");
      const chatWindow = document.getElementById("dify-chatbot-bubble-window");
      const scrollY = window.scrollY || window.pageYOffset;
      const viewportHeight = window.innerHeight;
      const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const chatWindowHeight = 40 * rootFontSize;

      if (button) {
        button.style.setProperty("position", "absolute", "important");
        button.style.setProperty("right", "24px", "important");
        button.style.setProperty("top", `${scrollY + viewportHeight - 72}px`, "important");
        button.style.setProperty("bottom", "auto", "important");
      }

      if (chatWindow) {
        chatWindow.style.setProperty("position", "absolute", "important");
        chatWindow.style.setProperty("right", "24px", "important");
        chatWindow.style.setProperty("top", `${scrollY + viewportHeight - chatWindowHeight - 90}px`, "important");
        chatWindow.style.setProperty("bottom", "auto", "important");
        chatWindow.style.setProperty("width", "24rem", "important");
        chatWindow.style.setProperty("height", "40rem", "important");
      }
    };

    const scheduleDifyChatbotPosition = () => {
      window.requestAnimationFrame(applyDifyChatbotPosition);
    };

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
        position: absolute !important;
        right: 24px !important;
        top: calc(100vh - 72px) !important;
        background-color: #1C64F2 !important;
        z-index: 2147483647 !important;
        display: flex !important;
        opacity: 1 !important;
        visibility: visible !important;
      }

      #dify-chatbot-bubble-window {
        position: absolute !important;
        right: 24px !important;
        top: calc(100vh - 40rem - 90px) !important;
        width: 24rem !important;
        height: 40rem !important;
        z-index: 2147483647 !important;
      }
    `;
      document.head.appendChild(style);
    }

    observer = new MutationObserver(() => {
      scheduleDifyChatbotPosition();
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["style"] });
    window.addEventListener("scroll", scheduleDifyChatbotPosition, { passive: true });
    window.addEventListener("resize", scheduleDifyChatbotPosition);
    scheduleDifyChatbotPosition();

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", scheduleDifyChatbotPosition);
      window.removeEventListener("resize", scheduleDifyChatbotPosition);
    };
  }, []);

  return null;
}
