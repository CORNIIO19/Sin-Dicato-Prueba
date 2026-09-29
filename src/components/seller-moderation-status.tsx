type ModerationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

type SellerModerationStatusProps = {
  status: ModerationStatus;
  type?: "business" | "product";
};

export default function SellerModerationStatus({
  status,
  type = "product",
}: SellerModerationStatusProps) {
  if (status === "APPROVED") {
    return (
      <div className="mt-4 rounded-xl bg-emerald-50 p-4">
        <p className="text-sm font-semibold text-emerald-700">
          ✓ Aprobado
        </p>

        <p className="mt-1 text-sm text-emerald-700">
          {type === "business"
            ? "Tu negocio fue aprobado por Sin Dicato."
            : "Este producto fue aprobado y puede mostrarse públicamente."}
        </p>
      </div>
    );
  }

  if (status === "REJECTED") {
    return (
      <div className="mt-4 rounded-xl bg-red-50 p-4">
        <p className="text-sm font-semibold text-red-700">
          No aprobado por moderación
        </p>

        <p className="mt-1 text-sm text-red-700">
          {type === "business"
            ? "Tu negocio fue desactivado por moderación y no aparece públicamente."
            : "Este producto fue rechazado o desactivado por moderación y no aparece públicamente."}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 rounded-xl bg-amber-50 p-4">
      <p className="text-sm font-semibold text-amber-700">
        Pendiente de revisión
      </p>

      <p className="mt-1 text-sm text-amber-700">
        {type === "business"
          ? "Estamos revisando tu negocio antes de publicarlo."
          : "Estamos revisando este producto antes de publicarlo."}
      </p>
    </div>
  );
}
