import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { TrustRing } from "@/components/TrustScoreBadge";
import { CROPS, farmerById, inr, trustTotal } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { useListings } from "@/lib/store";

export const Route = createFileRoute("/buyer/browse")({
  head: () => ({
    meta: [
      { title: "Browse Produce Lots — Kisaan Setu" },
      {
        name: "description",
        content:
          "Search and filter farmer-listed produce by crop, village, price ceiling and farmer trust score, then order directly.",
      },
      { property: "og:title", content: "Browse Produce Lots — Kisaan Setu" },
      { property: "og:description", content: "Filter by crop, price and farmer trust score." },
    ],
  }),
  component: BrowseListings,
});

const field =
  "mt-1 w-full rounded-xl border border-border bg-background px-3 py-3 text-base tap-target focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40";

function BrowseListings() {
  const { t } = useI18n();
  const listings = useListings();
  const [query, setQuery] = useState("");
  const [crop, setCrop] = useState("all");
  const [maxPrice, setMaxPrice] = useState(8000);
  const [minTrust, setMinTrust] = useState(0);

  const results = useMemo(
    () =>
      listings.filter((l) => {
        if (l.status !== "active") return false;
        const farmer = farmerById(l.farmerId);
        const score = farmer ? trustTotal(farmer.trust) : 0;
        const haystack = `${l.crop} ${farmer?.name ?? ""} ${farmer?.village ?? ""} ${farmer?.district ?? ""}`.toLowerCase();
        if (query && !haystack.includes(query.toLowerCase())) return false;
        if (crop !== "all" && l.crop !== crop) return false;
        if (l.price > maxPrice) return false;
        if (score < minTrust) return false;
        return true;
      }),
    [listings, query, crop, maxPrice, minTrust],
  );

  return (
    <AppShell role="buyer">
      <h1 className="font-display text-2xl font-bold">{t("buyer.browse")}</h1>

      <section className="surface-card mt-4 space-y-4 px-4 py-4">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{t("buyer.filters")}</h2>

        <div>
          <label className="block text-sm font-medium" htmlFor="q">
            {t("buyer.search")}
          </label>
          <input id="q" className={field} value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm font-medium" htmlFor="crop">
            {t("buyer.crop")}
          </label>
          <select id="crop" className={field} value={crop} onChange={(e) => setCrop(e.target.value)}>
            <option value="all">{t("buyer.all")}</option>
            {CROPS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium" htmlFor="price">
            {t("buyer.maxPrice")}: {inr(maxPrice)}
          </label>
          <input
            id="price"
            type="range"
            min={500}
            max={8000}
            step={50}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="mt-2 w-full accent-[var(--color-primary)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium" htmlFor="trust">
            {t("buyer.minTrust")}: {minTrust}
          </label>
          <input
            id="trust"
            type="range"
            min={0}
            max={100}
            step={5}
            value={minTrust}
            onChange={(e) => setMinTrust(Number(e.target.value))}
            className="mt-2 w-full accent-[var(--color-primary)]"
          />
        </div>
      </section>

      <p className="mt-4 text-sm text-muted-foreground">
        {results.length} {t("buyer.results")}
      </p>

      {results.length === 0 ? (
        <div className="surface-card mt-3 px-4 py-10 text-center">
          <svg viewBox="0 0 48 48" fill="none" stroke="var(--color-primary)" strokeWidth="1.6" className="mx-auto h-16 w-16" aria-hidden="true">
            <circle cx="21" cy="21" r="13" />
            <path d="M31 31l10 10" />
          </svg>
          <p className="mt-3 text-sm text-muted-foreground">{t("buyer.noResults")}</p>
        </div>
      ) : (
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {results.map((l) => {
            const farmer = farmerById(l.farmerId);
            return (
              <li key={l.id} className="surface-card px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-lg font-bold">{l.crop}</h2>
                    <p className="text-sm text-muted-foreground">
                      {farmer?.name} · {farmer?.village}, {farmer?.district}
                    </p>
                    <p className="mt-2 text-sm">
                      <span className="font-semibold">{inr(l.price)}</span> / {t(`unit.${l.unit}`)} ·{" "}
                      {t("listing.available")} {l.quantity} {t(`unit.${l.unit}`)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {t(`grade.${l.grade}`)} · {t("listing.harvested")} {l.harvestDate}
                    </p>
                  </div>
                  {farmer && <TrustRing score={trustTotal(farmer.trust)} size={52} />}
                </div>
                <Link
                  to="/buyer/listing/$id"
                  params={{ id: l.id }}
                  className="mt-3 block rounded-xl bg-primary px-4 py-3 text-center font-semibold text-primary-foreground tap-target"
                >
                  {t("buyer.viewDetails")}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </AppShell>
  );
}
