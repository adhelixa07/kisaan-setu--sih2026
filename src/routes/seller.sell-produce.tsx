import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { CROPS, type Grade, type Unit } from "@/lib/data";
import { useI18n } from "@/lib/i18n";
import { addListing } from "@/lib/store";

export const Route = createFileRoute("/seller/sell-produce")({
  head: () => ({
    meta: [
      { title: "List Your Produce — Kisaan Setu" },
      {
        name: "description",
        content:
          "Add your harvest to Kisaan Setu: crop, quantity, quality grade, harvest date and expected price — visible to wholesale buyers instantly.",
      },
      { property: "og:title", content: "List Your Produce — Kisaan Setu" },
      { property: "og:description", content: "Publish a produce lot for wholesale buyers." },
    ],
  }),
  component: SellProduce,
});

const label = "block text-sm font-medium";
const field =
  "mt-1 w-full rounded-xl border border-border bg-background px-3 py-3 text-base tap-target focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40";

function SellProduce() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [crop, setCrop] = useState(CROPS[0]);
  const [otherCrop, setOtherCrop] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState<Unit>("quintal");
  const [grade, setGrade] = useState<Grade>("a");
  const [harvestDate, setHarvestDate] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const cropName = crop === "other" ? otherCrop.trim() : crop;
    if (!cropName || !quantity || !price || !harvestDate) {
      setError(t("form.required"));
      return;
    }
    addListing({
      id: `l${Date.now()}`,
      crop: cropName,
      farmerId: "f1",
      quantity: Number(quantity),
      unit,
      grade,
      harvestDate,
      price: Number(price),
      status: "active",
      ownListing: true,
    });
    navigate({ to: "/seller/my-listings", search: { listed: "1" } });
  };

  return (
    <AppShell role="seller">
      <h1 className="font-display text-2xl font-bold">{t("nav.sell")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{t("seller.subtitle")}</p>

      <form onSubmit={submit} className="surface-card mt-5 space-y-4 px-4 py-5">
        <div>
          <label className={label} htmlFor="crop">
            {t("form.crop")}
          </label>
          <select id="crop" className={field} value={crop} onChange={(e) => setCrop(e.target.value)}>
            {CROPS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
            <option value="other">{t("form.cropOther")}</option>
          </select>
        </div>

        {crop === "other" && (
          <div>
            <label className={label} htmlFor="otherCrop">
              {t("form.cropOther")}
            </label>
            <input id="otherCrop" className={field} value={otherCrop} onChange={(e) => setOtherCrop(e.target.value)} />
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label} htmlFor="quantity">
              {t("form.quantity")}
            </label>
            <input
              id="quantity"
              type="number"
              min="1"
              inputMode="numeric"
              className={field}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div>
            <label className={label} htmlFor="unit">
              {t("form.unit")}
            </label>
            <select id="unit" className={field} value={unit} onChange={(e) => setUnit(e.target.value as Unit)}>
              <option value="quintal">{t("unit.quintal")}</option>
              <option value="kg">{t("unit.kg")}</option>
              <option value="ton">{t("unit.ton")}</option>
            </select>
          </div>
        </div>

        <div>
          <label className={label} htmlFor="grade">
            {t("form.grade")}
          </label>
          <select id="grade" className={field} value={grade} onChange={(e) => setGrade(e.target.value as Grade)}>
            <option value="a">{t("grade.a")}</option>
            <option value="b">{t("grade.b")}</option>
            <option value="c">{t("grade.c")}</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={label} htmlFor="harvest">
              {t("form.harvest")}
            </label>
            <input
              id="harvest"
              type="date"
              className={field}
              value={harvestDate}
              onChange={(e) => setHarvestDate(e.target.value)}
            />
          </div>
          <div>
            <label className={label} htmlFor="price">
              {t("form.price")}
            </label>
            <input
              id="price"
              type="number"
              min="1"
              inputMode="numeric"
              className={field}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className={label} htmlFor="photo">
            {t("form.photo")}
          </label>
          <input id="photo" type="file" accept="image/*" className={field} />
        </div>

        {error && <p className="text-sm font-medium text-destructive">{error}</p>}

        <button type="submit" className="w-full rounded-xl bg-primary px-4 py-4 font-semibold text-primary-foreground tap-target">
          {t("form.submit")}
        </button>
      </form>
    </AppShell>
  );
}
