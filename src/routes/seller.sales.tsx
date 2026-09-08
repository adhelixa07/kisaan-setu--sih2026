import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { inr } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useOrders } from "@/lib/store";

export const Route = createFileRoute("/seller/sales")({
  head: () => ({
    meta: [
      { title: "Sales Summary — Kisaan Setu" },
      {
        name: "description",
        content:
          "Your running sales total on Kisaan Setu, broken down by crop, so you can see exactly what direct selling earns you.",
      },
      { property: "og:title", content: "Sales Summary — Kisaan Setu" },
      { property: "og:description", content: "Running totals for every crop you have sold." },
    ],
  }),
  component: SellerSales,
});

function SellerSales() {
  const { t } = useI18n();
  const orders = useOrders();
  const total = orders.reduce((sum, o) => sum + o.total, 0);

  const byCrop = orders.reduce<Record<string, number>>((acc, o) => {
    acc[o.crop] = (acc[o.crop] ?? 0) + o.total;
    return acc;
  }, {});
  const max = Math.max(1, ...Object.values(byCrop));

  return (
    <AppShell role="seller">
      <h1 className="font-display text-2xl font-bold">{t("nav.sales")}</h1>

      <div className="surface-card mt-5 px-5 py-6 text-center">
        <span className="text-xs uppercase tracking-wide text-muted-foreground">{t("seller.totalSales")}</span>
        <p className="mt-1 font-display text-4xl font-bold">{inr(total)}</p>
      </div>

      <ul className="mt-5 space-y-4">
        {Object.entries(byCrop).map(([crop, value]) => (
          <li key={crop}>
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium">{crop}</span>
              <span className="tabular-nums">{inr(value)}</span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${(value / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </AppShell>
  );
}
