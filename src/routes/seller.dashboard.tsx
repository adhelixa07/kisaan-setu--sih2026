import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { TrustScoreBadge } from "@/components/TrustScoreBadge";
import { farmers, inr } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useListings, useOrders } from "@/lib/store";

export const Route = createFileRoute("/seller/dashboard")({
  head: () => ({
    meta: [
      { title: "Farmer Dashboard — Kisaan Setu" },
      {
        name: "description",
        content:
          "See your active produce lots, buyer requests, total sales and trust score in one place as a Kisaan Setu farmer.",
      },
      { property: "og:title", content: "Farmer Dashboard — Kisaan Setu" },
      { property: "og:description", content: "Your listings, orders and trust score at a glance." },
    ],
  }),
  component: SellerDashboard,
});

function SellerDashboard() {
  const { t } = useI18n();
  const listings = useListings();
  const orders = useOrders();
  const farmer = farmers[0];

  const own = listings.filter((l) => l.ownListing);
  const active = own.filter((l) => l.status === "active").length;
  const salesTotal = orders.reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: t("seller.activeListings"), value: String(active), to: "/seller/my-listings" },
    { label: t("seller.openRequests"), value: "4", to: "/seller/orders" },
    { label: t("seller.totalSales"), value: inr(salesTotal), to: "/seller/sales" },
  ];

  return (
    <AppShell role="seller">
      <h1 className="font-display text-2xl font-bold">{t("seller.hello")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("seller.subtitle")}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="surface-card block px-4 py-4">
            <span className="block text-xs uppercase tracking-wide text-muted-foreground">{s.label}</span>
            <span className="mt-1 block font-display text-2xl font-bold">{s.value}</span>
          </Link>
        ))}
      </div>

      <Link
        to="/seller/sell-produce"
        className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-4 font-semibold text-primary-foreground tap-target"
      >
        + {t("seller.newListing")}
      </Link>

      <section className="surface-card mt-5 px-4 py-4">
        <h2 className="font-display text-lg font-bold">{t("seller.trust")}</h2>
        <div className="mt-3">
          <TrustScoreBadge trust={farmer.trust} size={64} />
        </div>
      </section>

      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">{t("nav.listings")}</h2>
          <Link to="/seller/my-listings" className="text-sm text-secondary underline">
            {t("buyer.viewDetails")}
          </Link>
        </div>
        <ul className="mt-3 space-y-3">
          {own.slice(0, 3).map((l) => (
            <li key={l.id} className="surface-card flex items-center justify-between gap-3 px-4 py-3">
              <span>
                <span className="block font-semibold">{l.crop}</span>
                <span className="block text-xs text-muted-foreground">
                  {l.quantity} {t(`unit.${l.unit}`)} · {inr(l.price)} / {t(`unit.${l.unit}`)}
                </span>
              </span>
              <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-secondary">
                {t(`status.${l.status}`)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </AppShell>
  );
}
