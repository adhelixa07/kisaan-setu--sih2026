import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { TrustScoreBadge } from "@/components/TrustScoreBadge";
import { farmers } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/seller/profile")({
  head: () => ({
    meta: [
      { title: "Farmer Profile — Kisaan Setu" },
      {
        name: "description",
        content:
          "Your Kisaan Setu farmer profile: village, e-NAM verification status, trust score breakdown and language settings.",
      },
      { property: "og:title", content: "Farmer Profile — Kisaan Setu" },
      { property: "og:description", content: "Verification status and trust score details." },
    ],
  }),
  component: SellerProfile,
});

function SellerProfile() {
  const { t } = useI18n();
  const farmer = farmers[0];

  return (
    <AppShell role="seller">
      <h1 className="font-display text-2xl font-bold">{t("nav.profile")}</h1>

      <section className="surface-card mt-5 px-4 py-5">
        <h2 className="font-display text-xl font-bold">{farmer.name}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {farmer.village}, {farmer.district}
        </p>
        {farmer.verified && (
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-secondary">
            ✓ {t("listing.verified")} · e-NAM
          </p>
        )}
        <div className="mt-4">
          <TrustScoreBadge trust={farmer.trust} size={64} />
        </div>
      </section>

      <section className="surface-card mt-4 px-4 py-4">
        <h2 className="font-display text-lg font-bold">{t("lang.change")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("role.help")}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link to="/" className="rounded-xl border border-border px-4 py-3 text-sm font-medium tap-target">
            {t("lang.change")}
          </Link>
          <Link to="/select-role" className="rounded-xl border border-border px-4 py-3 text-sm font-medium tap-target">
            {t("role.title")}
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
