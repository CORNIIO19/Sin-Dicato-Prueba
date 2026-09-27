import Link from "next/link";
import { notFound } from "next/navigation";

import EditBusinessForm from "@/components/edit-business-form";
import { getBusinessByManagementToken } from "@/modules/marketplace/business-repository";

type EditBusinessPageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function EditBusinessPage({
  params,
}: EditBusinessPageProps) {
  const { token } = await params;

  const business =
    await getBusinessByManagementToken(token);

  if (!business) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-5">
          <Link
            href={`/gestionar/${token}`}
            className="text-sm font-medium text-zinc-600"
          >
            ← Volver a {business.name}
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Editar negocio
          </h1>

          <p className="mt-2 text-zinc-600">
            Actualiza la información que verá la
            comunidad.
          </p>
        </div>

        <EditBusinessForm
          token={token}
          business={{
            name: business.name,
            description:
              business.description,
            whatsapp:
              business.whatsapp,
          }}
        />
      </div>
    </main>
  );
}
