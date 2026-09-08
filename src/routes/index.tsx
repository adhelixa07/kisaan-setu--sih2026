import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LogoMark } from "@/components/Logo";
import { LOCALE_KEY, useI18n, type Locale } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kisaan Setu — Farmers to Wholesale Buyers, Directly" },
      {
        name: "description",
        content:
          "Kisaan Setu connects verified farmers with wholesale buyers in Hindi, English and Bengali — no middlemen, transparent prices, trusted deals.",
      },
      { property: "og:title", content: "Kisaan Setu — Farmers to Wholesale Buyers, Directly" },
      {
        property: "og:description",
        content: "Choose your language and start buying or selling produce directly.",
      },
    ],
  }),
  component: LanguageSelection,
});

const OPTIONS: Array<{ locale: Locale; key: string }> = [
  { locale: "hi", key: "lang.hi" },
  { locale: "en", key: "lang.en" },
  { locale: "bn", key: "lang.bn" },
];

function LanguageSelection() {
  const { t, setLocale } = useI18n();
  const navigate = useNavigate();

  // A returning visitor already picked a language, so skip straight ahead.
  useEffect(() => {
    if (localStorage.getItem(LOCALE_KEY)) navigate({ to: "/select-role" });
  }, [navigate]);

  const choose = (locale: Locale) => {
    setLocale(locale);
    navigate({ to: "/select-role" });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 py-10">
      <LogoMark className="h-24 w-24" />
      <h1 className="mt-6 text-center font-display text-2xl font-bold">{t("lang.choose")}</h1>

      <div className="mt-8 grid w-full max-w-md gap-4">
        {OPTIONS.map(({ locale, key }) => (
          <button
            key={locale}
            type="button"
            onClick={() => choose(locale)}
            className="surface-card flex min-h-[88px] items-center gap-4 px-5 py-4 text-left transition-colors hover:border-primary"
          >
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/15 font-display text-lg font-bold text-secondary">
              {locale === "en" ? "A" : locale === "hi" ? "अ" : "অ"}
            </span>
            <span className="font-display text-xl font-semibold">{t(key)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
