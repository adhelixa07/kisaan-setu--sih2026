import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { inr } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useListings } from "@/lib/store";

type Search = { listed?: string };

export const Route = createFileRoute("/seller/my-listings")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    listed: typeof search.listed === "string" ? search.listed : undefined,
  }),
  head: () => ({
    meta: [
      { title: "My Produce Listings — Kisaan Setu" },
      {
        name: "description",
        content:
          "Track every lot you have listed on Kisaan Setu — active, under negotiation, sold or expired — with prices and quantities.",
      },
      { property: "og:title", content: "My Produce Listings — Kisaan Setu" },
      { property: "og:description", content: "All your produce lots and their current status." },
    ],
  }),
  component: MyListings,
});

const STATUS_STYLE: Record<string, string> = {
  active: "bg-primary/15 text-secondary",
  negotiation: "bg-accent/25 text-secondary",
  sold: "bg-secondary text-secondary-foreground",
  expired: "bg-muted text-muted-foreground",
};

function MyListings() {
  const { t } = useI18n();
  const listings = useListings().filter((l) => l.ownListing);
  const { listed } = Route.useSearch();

  return (
    <AppShell role="seller">
      <h1 className="font-display text-2xl font-bold">{t("nav.listings")}</h1>

      {listed && (
        <p className="mt-3 rounded-xl border border-primary bg-primary/10 px-4 py-3 text-sm font-medium">
          {t("form.listed")}
        </p>
      )}

      {listings.length === 0 ? (
        <div className="surface-card mt-5 px-4 py-10 text-center">
          <svg viewBox="0 0 48 48" fill="none" stroke="var(--color-primary)" strokeWidth="1.6" className="mx-auto h-16 w-16" aria-hidden="true">
            <path d="M24 40V22m0 0c0-8-6-14-14-14 0 8 6 14 14 14Zm0 0c0-8 6-14 14-14 0 8-6 14-14 14Z" />
          </svg>
          <p className="mt-3 text-sm text-muted-foreground">{t("listing.empty")}</p>
          <Link
            to="/seller/sell-produce"
            className="mt-4 inline-block rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground tap-target"
          >
            {t("seller.newListing")}
          </Link>
        </div>
      ) : (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2">
          {listings.map((l) => (
            <li key={l.id} className="surface-card px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-display text-lg font-bold">{l.crop}</h2>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[l.status]}`}>
                  {t(`status.${l.status}`)}
                </span>
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
                <dt className="text-muted-foreground">{t("form.quantity")}</dt>
                <dd className="text-right font-medium">
                  {l.quantity} {t(`unit.${l.unit}`)}
                </dd>
                <dt className="text-muted-foreground">{t("form.price")}</dt>
                <dd className="text-right font-medium">{inr(l.price)}</dd>
                <dt className="text-muted-foreground">{t("form.grade")}</dt>
                <dd className="text-right font-medium">{t(`grade.${l.grade}`)}</dd>
                <dt className="text-muted-foreground">{t("listing.harvested")}</dt>
                <dd className="text-right font-medium">{l.harvestDate}</dd>
              </dl>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
