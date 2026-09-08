import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";

const SPEECH_LANG: Record<string, string> = { en: "en-IN", hi: "hi-IN", bn: "bn-IN" };

type Intent = { action: "navigate"; to: string; reply: string } | { action: "none"; reply: string };

/**
 * Maps a spoken phrase to an app action. Kept intentionally simple and
 * keyword-based so it can later be swapped for a server intent endpoint.
 */
function resolveIntent(text: string, role: "buyer" | "seller", t: (k: string) => string): Intent {
  const s = text.toLowerCase();
  const has = (...words: string[]) => words.some((w) => s.includes(w));

  if (has("list", "sell", "बेच", "सूची", "বিক্রি", "তালিকা"))
    return { action: "navigate", to: "/seller/sell-produce", reply: t("nav.sell") };
  if (has("order", "ऑर्डर", "अर्डर", "অর্ডার"))
    return { action: "navigate", to: role === "seller" ? "/seller/orders" : "/buyer/orders", reply: t("nav.orders") };
  if (has("sale", "बिक्री", "বিক্রি"))
    return { action: "navigate", to: "/seller/sales", reply: t("nav.sales") };
  if (has("browse", "find", "search", "खोज", "देख", "খুঁজ", "দেখ"))
    return { action: "navigate", to: "/buyer/browse", reply: t("nav.browse") };
  if (has("profile", "प्रोफ", "প্রোফাইল"))
    return { action: "navigate", to: role === "seller" ? "/seller/profile" : "/buyer/profile", reply: t("nav.profile") };

  return { action: "none", reply: t("buyer.noResults") };
}

export function VoiceAssistant({ role }: { role: "buyer" | "seller" }) {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState("");
  const [reply, setReply] = useState("");

  const speak = (message: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = SPEECH_LANG[locale];
    window.speechSynthesis.speak(utterance);
  };

  const start = () => {
    const Recognition =
      (window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown })
        .SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;

    if (!Recognition) {
      setReply(t("buyer.noResults"));
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new (Recognition as any)();
    recognition.lang = SPEECH_LANG[locale];
    recognition.interimResults = false;
    setListening(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript: string = event.results[0][0].transcript;
      setHeard(transcript);
      const intent = resolveIntent(transcript, role, t);
      setReply(intent.reply);
      speak(intent.reply);
      if (intent.action === "navigate") {
        setOpen(false);
        navigate({ to: intent.to });
      }
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognition.start();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Voice assistant"
        className="fixed bottom-24 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-6 w-6" aria-hidden="true">
          <path d="M12 4a3 3 0 0 1 3 3v4a3 3 0 0 1-6 0V7a3 3 0 0 1 3-3Z" />
          <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/30 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5">
            <h2 className="font-display text-lg font-bold">{t("app.name")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("nav.sell")} · {t("nav.orders")} · {t("nav.browse")}
            </p>

            <button
              type="button"
              onClick={start}
              className="mt-4 w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground tap-target"
            >
              {listening ? t("listing.paying") : t("role.continue")}
            </button>

            {heard && <p className="mt-3 text-sm">“{heard}”</p>}
            {reply && <p className="mt-1 text-sm text-secondary">{reply}</p>}

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 w-full rounded-xl border border-border px-4 py-3 text-sm font-medium tap-target"
            >
              {t("common.close")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
