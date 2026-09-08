import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { inr } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useOrders } from "@/lib/store";

export const Route = createFileRoute("/seller/orders")({
  head: () => ({
    meta: [
      { title: "Farm Orders — Kisaan Setu" },
      {
        name: "description",
        content:
          "Confirmed and completed wholesale orders for your produce, with buyer quantities, rates and payment status.",
      },
      { property: "og:title", content: "Farm Orders — Kisaan Setu" },
      { property: "og:description", content: "Every confirmed order for your produce lots." },
    ],
  }),
  component: SellerOrders,
});

function SellerOrders() {
  const { t } = useI18n();
  const orders = useOrders();

  return (
    <AppShell role="seller">
      <h1 className="font-display text-2xl font-bold">{t("nav.orders")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("seller.subtitle")}</p>

      <ul className="mt-5 space-y-3">
        {orders.map((o) => (
          <li key={o.id} className="surface-card px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-display text-lg font-bold">{o.crop}</h2>
              <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-medium text-secondary">
                {t(`order.status.${o.status}`)}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("order.id")} {o.id} · {o.placedAt}
            </p>
            <p className="mt-1 text-sm">
              {o.quantity} {t(`unit.${o.unit}`)} × {inr(o.pricePerUnit)} ={" "}
              <span className="font-semibold">{inr(o.total)}</span>
            </p>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
