import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { LogoMark } from "@/components/Logo";
import { useI18n } from "@/lib/i18n";
import { setRole, type Role } from "@/lib/store";

export const Route = createFileRoute("/select-role")({
  head: () => ({
    meta: [
      { title: "Buyer or Seller? — Kisaan Setu" },
      {
        name: "description",
        content:
          "Tell Kisaan Setu whether you sell produce as a farmer or buy in bulk as a wholesale buyer, and get a dashboard built for you.",
      },
      { property: "og:title", content: "Buyer or Seller? — Kisaan Setu" },
      { property: "og:description", content: "Pick your role to open the right dashboard." },
    ],
  }),
  component: RoleSelection,
});

function RoleSelection() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Role | null>(null);

  const cards: Array<{ role: Role; title: string; desc: string; art: string }> = [
    {
      role: "seller",
      title: "role.seller",
      desc: "role.seller.desc",
      art: "M12 21v-9m0 0C12 8 9 5 4 5c0 4 3 7 8 7Zm0 0c0-4 3-7 8-7 0 4-3 7-8 7Z",
    },
    {
      role: "buyer",
      title: "role.buyer",
      desc: "role.buyer.desc",
      art: "M4 7h13l2 8H6L4 7Zm0 0L3 4M8 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm9 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
    },
  ];

  const proceed = () => {
    if (!selected) return;
    setRole(selected);
    navigate({ to: selected === "seller" ? "/seller/dashboard" : "/buyer/dashboard" });
  };

  return (
    <div className="min-h-screen px-5 py-6">
      <header className="mx-auto flex max-w-md items-center justify-between">
        <LogoMark className="h-11 w-11" />
        <Link to="/" className="rounded-xl border border-border px-3 py-2 text-sm tap-target">
          {t("lang.change")}
        </Link>
      </header>

      <div className="mx-auto mt-10 max-w-md">
        <h1 className="font-display text-2xl font-bold">{t("role.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("role.help")}</p>

        <div className="mt-6 grid gap-4">
          {cards.map((card) => {
            const active = selected === card.role;
            return (
              <button
                key={card.role}
                type="button"
                aria-pressed={active}
                onClick={() => setSelected(card.role)}
                className={`surface-card flex min-h-[110px] items-center gap-4 px-5 py-4 text-left transition-colors ${
                  active ? "border-primary ring-2 ring-primary" : "hover:border-primary"
                }`}
              >
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary/15 text-secondary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8" aria-hidden="true">
                    <path d={card.art} />
                  </svg>
                </span>
                <span>
                  <span className="block font-display text-xl font-semibold">{t(card.title)}</span>
                  <span className="mt-1 block text-sm text-muted-foreground">{t(card.desc)}</span>
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={proceed}
          disabled={!selected}
          className="mt-7 w-full rounded-xl bg-primary px-4 py-4 font-semibold text-primary-foreground tap-target disabled:opacity-45"
        >
          {t("role.continue")}
        </button>
      </div>
    </div>
  );
}
