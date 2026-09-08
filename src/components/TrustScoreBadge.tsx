import { useState } from "react";
import { TRUST_WEIGHTS, trustTotal, type TrustComponents } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

const LABELS: Record<keyof TrustComponents, string> = {
  reviews: "trust.reviews",
  identity: "trust.identity",
  farm: "trust.farm",
  fpo: "trust.fpo",
  transactions: "trust.transactions",
  consistency: "trust.consistency",
  location: "trust.location",
};

export function TrustRing({ score, size = 56 }: { score: number; size?: number }) {
  const stroke = 5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Trust score ${score} of 100`}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--color-border)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - score / 100)}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="52%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize={size * 0.3}
        fontWeight="700"
        fill="var(--color-foreground)"
      >
        {score}
      </text>
    </svg>
  );
}

export function TrustScoreBadge({
  trust,
  size = 56,
  showLabel = true,
}: {
  trust: TrustComponents;
  size?: number;
  showLabel?: boolean;
}) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const total = trustTotal(trust);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-3 rounded-xl px-2 py-1 text-left tap-target transition-colors hover:bg-muted"
      >
        <TrustRing score={total} size={size} />
        {showLabel && (
          <span>
            <span className="block text-sm font-semibold">{t("trust.title")}</span>
            <span className="block text-xs text-muted-foreground underline">{t("trust.breakdown")}</span>
          </span>
        )}
      </button>

      {open && (
        <ul className="mt-3 space-y-2 rounded-xl border border-border bg-background p-3">
          {(Object.keys(LABELS) as Array<keyof TrustComponents>).map((key) => (
            <li key={key}>
              <div className="flex items-baseline justify-between gap-2 text-sm">
                <span>
                  {t(LABELS[key])}{" "}
                  <span className="text-xs text-muted-foreground">
                    {Math.round(TRUST_WEIGHTS[key] * 100)}% {t("trust.weight")}
                  </span>
                </span>
                <span className="font-semibold tabular-nums">{trust[key]}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${trust[key]}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
