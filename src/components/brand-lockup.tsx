import Image from "next/image";
import Link from "next/link";

type BrandLockupProps = {
  compact?: boolean;
  showSlogan?: boolean;
};

export default function BrandLockup({
  compact = false,
  showSlogan = true,
}: BrandLockupProps) {
  return (
    <Link
      href="/"
      className="flex w-fit items-center gap-3"
      aria-label="Ir al inicio de Sin Dicato"
    >
      <div
        className={`relative shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 ${
          compact ? "h-10 w-10" : "h-11 w-11"
        }`}
      >
        <Image
          src="/branding/icon-sin-dicato.png"
          alt=""
          fill
          sizes={compact ? "40px" : "44px"}
          className="object-cover"
        />
      </div>

      <div>
        <div
          className={`font-black uppercase leading-[0.78] tracking-[-0.06em] ${
            compact
              ? "text-[16px]"
              : "text-[18px]"
          }`}
        >
          <span className="block">SIN</span>
          <span className="block">DICATO</span>
        </div>

        {showSlogan && (
          <p className="mt-1 text-[10px] leading-4 text-zinc-500 sm:text-[11px]">
            <strong className="font-bold text-zinc-800">
              SIN
            </strong>{" "}
            intermediarios.{" "}
            <strong className="font-bold text-zinc-800">
              SIN
            </strong>{" "}
            complicaciones.{" "}
            <strong className="font-bold text-zinc-800">
              SIN DICATO.
            </strong>
          </p>
        )}
      </div>
    </Link>
  );
}
