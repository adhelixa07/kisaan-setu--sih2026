import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { LogoMark } from "./Logo";
import { useI18n, type Locale } from "@/lib/i18n";
import { VoiceAssistant } from "./VoiceAssistant";

type Tab = { to: string; label: string; icon: ReactNode };

const icon = (path: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
    <path d={path} />
  </svg>
);

const ICONS = {
  sprout: "M12 20v-8m0 0C12 8 9 5 5 5c0 4 3 7 7 7Zm0 0c0-4 3-7 7-7 0 4-3 7-7 7Z",
  list: "M4 6h16M4 12h16M4 18h10",
  box: "M3 8l9-4 9 4-9 4-9-4Zm0 0v8l9 4 9-4V8",
  rupee: "M7 5h10M7 9h10M7 19l7-7c2-2 1-3-2-3H7",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-8 8a8 8 0 0 1 16 0",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.5-4.5",
};

const SELLER_TABS: Tab[] = [
  { to: "/seller/sell-produce", label: "nav.sell", icon: icon(ICONS.sprout) },
  { to: "/seller/my-listings", label: "nav.listings", icon: icon(ICONS.list) },
  { to: "/seller/orders", label: "nav.orders", icon: icon(ICONS.box) },
  { to: "/seller/sales", label: "nav.sales", icon: icon(ICONS.rupee) },
  { to: "/seller/profile", label: "nav.profile", icon: icon(ICONS.user) },
];

const BUYER_TABS: Tab[] = [
  { to: "/buyer/browse", label: "nav.browse", icon: icon(ICONS.search) },
  { to: "/buyer/dashboard", label: "nav.dashboard", icon: icon(ICONS.list) },
  { to: "/buyer/orders", label: "nav.orders", icon: icon(ICONS.box) },
  { to: "/buyer/profile", label: "nav.profile", icon: icon(ICONS.user) },
];

export function AppShell({ role, children }: { role: "buyer" | "seller"; children: ReactNode }) {
  const { t, locale, setLocale } = useI18n();
  const navigate = useNavigate();
  const [langOpen, setLangOpen] = useState(false);
  const tabs = role === "seller" ? SELLER_TABS : BUYER_TABS;
  const home = role === "seller" ? "/seller/dashboard" : "/buyer/dashboard";

  const pick = (l: Locale) => {
    setLocale(l);
    setLangOpen(false);
  };

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <Link to={home} className="flex items-center gap-2">
            <LogoMark className="h-10 w-10" />
            <span className="font-display text-lg font-bold leading-none">{t("app.name")}</span>
          </Link>

          <div className="relative flex items-center gap-1">
            <button
              type="button"
              onClick={() => setLangOpen((v) => !v)}
              aria-expanded={langOpen}
              className="rounded-xl border border-border px-3 py-2 text-sm font-medium tap-target hover:bg-card"
            >
              {locale === "en" ? "EN" : locale === "hi" ? "हिं" : "বাং"}
              <span className="sr-only"> — {t("lang.change")}</span>
            </button>
            <button
              type="button"
              onClick={() => navigate({ to: role === "seller" ? "/seller/profile" : "/buyer/profile" })}
              className="rounded-xl border border-border p-2 tap-target hover:bg-card"
              aria-label={t("nav.profile")}
            >
              {icon(ICONS.user)}
            </button>

            {langOpen && (
              <div className="absolute right-0 top-12 w-44 overflow-hidden rounded-xl border border-border bg-card">
                {(["en", "hi", "bn"] as Locale[]).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => pick(l)}
                    className={`block w-full px-4 py-3 text-left text-sm tap-target hover:bg-muted ${l === locale ? "font-semibold text-primary" : ""}`}
                  >
                    {t(`lang.${l}`)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-5">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background">
        <ul className="mx-auto flex max-w-5xl">
          {tabs.map((tab) => (
            <li key={tab.to} className="flex-1">
              <Link
                to={tab.to}
                activeProps={{ className: "text-primary font-semibold" }}
                className="flex flex-col items-center gap-1 px-1 py-2 text-[11px] text-secondary tap-target"
              >
                {tab.icon}
                <span className="text-center leading-tight">{t(tab.label)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <VoiceAssistant role={role} />
    </div>
  );
}
