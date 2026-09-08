import logoAsset from "@/assets/kisaan-setu-logo.png.asset.json";

export function LogoMark({ className = "h-16 w-16" }: { className?: string }) {
  return (
    <img
      src={logoAsset.url}
      alt="Kisaan Setu emblem: a farmer and a wholesale buyer shaking hands over a green sapling"
      className={`${className} rounded-full object-cover`}
      loading="eager"
    />
  );
}

export function LogoFull({ className = "h-40" }: { className?: string }) {
  return (
    <img
      src={logoAsset.url}
      alt="Kisaan Setu — connecting farmers with wholesale buyers"
      className={`${className} w-auto object-contain`}
      loading="eager"
    />
  );
}
