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
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <Header />

      <main className="flex flex-1 justify-center px-6 py-12">
        <div className="flex w-full max-w-5xl flex-col gap-8">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              Mis acuerdos
            </h1>
            <Link
              href="/crear"
              className="flex h-11 items-center justify-center rounded-full bg-zinc-950 px-6 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              Crear nuevo acuerdo
            </Link>
          </div>

          {acuerdos !== null && (
            <>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1 rounded-2xl border border-black/[.08] bg-white p-6 dark:border-white/[.1] dark:bg-zinc-950">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Total de acuerdos
                  </span>
                  <span className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
                    {total}
                  </span>
                </div>
                <div className="flex flex-col gap-1 rounded-2xl border border-black/[.08] bg-white p-6 dark:border-white/[.1] dark:bg-zinc-950">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Firmados
                  </span>
                  <span className="text-3xl font-semibold tracking-tight text-emerald-600 dark:text-emerald-400">
                    {firmados}
                  </span>
                </div>
                <div className="flex flex-col gap-1 rounded-2xl border border-black/[.08] bg-white p-6 dark:border-white/[.1] dark:bg-zinc-950">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    En borrador
                  </span>
                  <span className="text-3xl font-semibold tracking-tight text-zinc-500 dark:text-zinc-400">
                    {borradores}
                  </span>
                </div>
              </div>

              {total === 0 ? (
                <div className="flex flex-col items-center gap-4 rounded-2xl border border-black/[.08] bg-white p-12 text-center dark:border-white/[.1] dark:bg-zinc-950">
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Todavía no creaste ningún acuerdo
                  </p>
                  <Link
                    href="/crear"
                    className="flex h-12 items-center justify-center rounded-full bg-zinc-950 px-8 text-base font-medium text-zinc-50 transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
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
                        className="flex flex-col gap-4 rounded-2xl border border-black/[.08] bg-white p-6 dark:border-white/[.1] dark:bg-zinc-950"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex flex-col gap-1">
                            <p className="font-medium text-zinc-950 dark:text-zinc-50">
                              {acuerdo.partes.proponente.nombre} y{" "}
                              {acuerdo.partes.aceptante.nombre}
                            </p>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                              Creado el{" "}
                              {new Date(acuerdo.timestamp).toLocaleDateString(
                                "es-AR",
                              )}
                            </p>
                          </div>
                          <span
                            className={
                              firmado
                                ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                                : "rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400"
                            }
                          >
                            {firmado ? "Firmado" : "Borrador"}
                          </span>
                        </div>

                        <p className="font-mono text-xs text-zinc-500 dark:text-zinc-500">
                          Hash: {acuerdo.hash.slice(0, 16)}...
                        </p>

                        <div className="flex flex-wrap items-center gap-4">
                          {acuerdo.pdfBase64 && (
                            <button
                              type="button"
                              onClick={() => descargarPDF(acuerdo)}
                              className="flex h-9 items-center justify-center rounded-full border border-black/[.1] px-4 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-100 dark:border-white/[.15] dark:text-zinc-50 dark:hover:bg-zinc-900"
                            >
                              Descargar PDF
                            </button>
                          )}
                          {acuerdo.txHash && (
                            <a
                              href={`https://stellar.expert/explorer/testnet/tx/${acuerdo.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-zinc-600 underline hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
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
