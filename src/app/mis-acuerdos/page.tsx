"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Acuerdo } from "@/types/acuerdo";
import Header from "@/components/Header";

function leerAcuerdos(): Acuerdo[] {
  const acuerdos: Acuerdo[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith("acuerdo_")) continue;

    const raw = localStorage.getItem(key);
    if (!raw) continue;

    try {
      acuerdos.push(JSON.parse(raw) as Acuerdo);
    } catch {
      continue;
    }
  }

  return acuerdos.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
}

function estaFirmado(acuerdo: Acuerdo): boolean {
  return (acuerdo.estado ?? "firmado") === "firmado";
}

function descargarPDF(acuerdo: Acuerdo) {
  if (!acuerdo.pdfBase64) return;

  const link = document.createElement("a");
  link.href = `data:application/pdf;base64,${acuerdo.pdfBase64}`;
  link.download = `acuerdo-allgree-${acuerdo.id}.pdf`;
  link.click();
}

export default function MisAcuerdos() {
  const [acuerdos, setAcuerdos] = useState<Acuerdo[] | null>(null);

  useEffect(() => {
    setAcuerdos(leerAcuerdos());
  }, []);

  const total = acuerdos?.length ?? 0;
  const firmados = acuerdos?.filter(estaFirmado).length ?? 0;
  const borradores = total - firmados;

  return (
    <div className="flex flex-1 flex-col bg-white">
      <Header />

      <main className="flex flex-1 px-4 py-8">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-bold tracking-tight text-[#1B3A6B]">
              Mis acuerdos
            </h1>
            <Link
              href="/crear"
              className="flex h-11 items-center justify-center rounded-full bg-[#1B3A6B] px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Crear nuevo acuerdo
            </Link>
          </div>

          {acuerdos !== null && (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <span className="text-sm text-gray-600">
                    Total de acuerdos
                  </span>
                  <span className="text-3xl font-bold tracking-tight text-[#1B3A6B]">
                    {total}
                  </span>
                </div>
                <div className="flex flex-col gap-1 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <span className="text-sm text-gray-600">Firmados</span>
                  <span className="text-3xl font-bold tracking-tight text-green-600">
                    {firmados}
                  </span>
                </div>
                <div className="flex flex-col gap-1 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <span className="text-sm text-gray-600">En borrador</span>
                  <span className="text-3xl font-bold tracking-tight text-gray-500">
                    {borradores}
                  </span>
                </div>
              </div>

              {total === 0 ? (
                <div className="flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                  <p className="text-gray-600">
                    Todavía no creaste ningún acuerdo
                  </p>
                  <Link
                    href="/crear"
                    className="flex h-12 items-center justify-center rounded-full bg-[#1B3A6B] px-8 text-base font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    Crear tu primer acuerdo
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {acuerdos.map((acuerdo) => {
                    const firmado = estaFirmado(acuerdo);
                    return (
                      <div
                        key={acuerdo.id}
                        className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex flex-col gap-1">
                            <p className="font-medium text-gray-900">
                              {acuerdo.partes.proponente.nombre} y{" "}
                              {acuerdo.partes.aceptante.nombre}
                            </p>
                            <p className="text-sm text-gray-600">
                              Creado el{" "}
                              {new Date(acuerdo.timestamp).toLocaleDateString(
                                "es-AR",
                              )}
                            </p>
                          </div>
                          <span
                            className={
                              firmado
                                ? "rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
                                : "rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                            }
                          >
                            {firmado ? "Firmado" : "Borrador"}
                          </span>
                        </div>

                        <p className="font-mono text-xs text-gray-500">
                          Hash: {acuerdo.hash.slice(0, 16)}...
                        </p>

                        <div className="flex flex-wrap items-center gap-4">
                          {acuerdo.pdfBase64 && (
                            <button
                              type="button"
                              onClick={() => descargarPDF(acuerdo)}
                              className="flex h-9 items-center justify-center rounded-full border border-[#1B3A6B] px-4 text-sm font-medium text-[#1B3A6B] transition-colors hover:bg-[#1B3A6B]/5"
                            >
                              Descargar PDF
                            </button>
                          )}
                          {acuerdo.txHash && (
                            <a
                              href={`https://stellar.expert/explorer/testnet/tx/${acuerdo.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-gray-600 underline hover:text-[#1B3A6B]"
                            >
                              Ver en Stellar Explorer
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
