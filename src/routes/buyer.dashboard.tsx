import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { TrustRing } from "@/components/TrustScoreBadge";
import { farmerById, inr, trustTotal } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useListings, useOrders } from "@/lib/store";

export const Route = createFileRoute("/buyer/dashboard")({
  head: () => ({
    meta: [
      { title: "Buyer Dashboard — Kisaan Setu" },
      {
        name: "description",
        content:
          "Fresh produce lots from verified farmers, your active orders and quick search — the Kisaan Setu wholesale buyer dashboard.",
      },
      { property: "og:title", content: "Buyer Dashboard — Kisaan Setu" },
      { property: "og:description", content: "Source produce directly from verified farmers." },
    ],
  }),
  component: BuyerDashboard,
});

function BuyerDashboard() {
  const { t } = useI18n();
  const listings = useListings().filter((l) => l.status === "active");
  const orders = useOrders();

  return (
    <AppShell role="buyer">
      <h1 className="font-display text-2xl font-bold">{t("buyer.hello")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("buyer.subtitle")}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Link to="/buyer/browse" className="surface-card block px-4 py-4">
          <span className="block text-xs uppercase tracking-wide text-muted-foreground">{t("buyer.browse")}</span>
          <span className="mt-1 block font-display text-2xl font-bold">
            {listings.length} {t("buyer.results")}
          </span>
        </Link>
        <Link to="/buyer/orders" className="surface-card block px-4 py-4">
          <span className="block text-xs uppercase tracking-wide text-muted-foreground">{t("order.title")}</span>
          <span className="mt-1 block font-display text-2xl font-bold">{orders.length}</span>
        </Link>
      </div>

      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">{t("buyer.browse")}</h2>
          <Link to="/buyer/browse" className="text-sm text-secondary underline">
            {t("buyer.viewDetails")}
          </Link>
        </div>

        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {listings.slice(0, 4).map((l) => {
            const farmer = farmerById(l.farmerId);
            return (
              <li key={l.id} className="surface-card px-4 py-4">
                <Link to="/buyer/listing/$id" params={{ id: l.id }} className="flex items-center justify-between gap-3">
                  <span>
                    <span className="block font-display text-lg font-bold">{l.crop}</span>
                    <span className="block text-sm text-muted-foreground">
                      {farmer?.name} · {farmer?.district}
                    </span>
                    <span className="mt-1 block text-sm font-semibold">
                      {inr(l.price)} / {t(`unit.${l.unit}`)}
                    </span>
                  </span>
                  {farmer && <TrustRing score={trustTotal(farmer.trust)} size={48} />}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </AppShell>
  );
}
