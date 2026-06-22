"use client";

import { useState } from "react";
import Link from "next/link";
import type { Acuerdo } from "@/types/acuerdo";

type Resultado = "idle" | "encontrado" | "no-encontrado";

function buscarAcuerdoPorHash(hash: string): Acuerdo | null {
  const hashBuscado = hash.trim().toLowerCase();

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith("acuerdo_")) continue;

    const raw = localStorage.getItem(key);
    if (!raw) continue;

    try {
      const acuerdo = JSON.parse(raw) as Acuerdo;
      if (acuerdo.hash?.toLowerCase() === hashBuscado) {
        return acuerdo;
      }
    } catch {
      continue;
    }
  }

  return null;
}

export default function VerificarAcuerdo() {
  const [hashInput, setHashInput] = useState("");
  const [resultado, setResultado] = useState<Resultado>("idle");
  const [acuerdo, setAcuerdo] = useState<Acuerdo | null>(null);

  function verificar() {
    if (!hashInput.trim()) return;

    const encontrado = buscarAcuerdoPorHash(hashInput);
    setAcuerdo(encontrado);
    setResultado(encontrado ? "encontrado" : "no-encontrado");
  }

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <header className="border-b border-black/[.08] dark:border-white/[.1]">
        <div className="mx-auto flex max-w-5xl items-center px-6 py-5">
          <Link
            href="/"
            className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
          >
            Allgree
          </Link>
        </div>
      </header>

      <main className="flex flex-1 justify-center px-6 py-12">
        <div className="flex w-full max-w-xl flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              Verificar acuerdo
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Ingresá el hash SHA-256 de un acuerdo para confirmar su
              autenticidad.
            </p>
          </div>

          <section className="flex flex-col gap-4 rounded-2xl border border-black/[.08] bg-white p-6 dark:border-white/[.1] dark:bg-zinc-950">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                Hash SHA-256
              </span>
              <input
                type="text"
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") verificar();
                }}
                placeholder="Pegá el hash del acuerdo acá"
                className="rounded-lg border border-black/[.1] bg-white px-3 py-2 font-mono text-sm text-zinc-950 outline-none focus:border-zinc-950 dark:border-white/[.15] dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50"
              />
            </label>

            <button
              type="button"
              disabled={!hashInput.trim()}
              onClick={verificar}
              className="flex h-12 items-center justify-center self-start rounded-full bg-zinc-950 px-8 text-base font-medium text-zinc-50 transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              Verificar
            </button>
          </section>

          {resultado === "encontrado" && acuerdo && (
            <section className="flex flex-col gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 dark:border-emerald-900 dark:bg-emerald-950">
              <p className="font-medium text-emerald-700 dark:text-emerald-400">
                Acuerdo verificado — el documento es auténtico
              </p>
              <div className="flex flex-col gap-1 text-sm text-emerald-800 dark:text-emerald-300">
                <p>
                  Proponente: {acuerdo.partes.proponente.nombre} (
                  {acuerdo.partes.proponente.email})
                </p>
                <p>
                  Aceptante: {acuerdo.partes.aceptante.nombre} (
                  {acuerdo.partes.aceptante.email})
                </p>
                <p>
                  Fecha: {new Date(acuerdo.timestamp).toLocaleString("es-AR")}
                </p>
                <p>Cláusulas: {acuerdo.clausulas.length}</p>
              </div>
            </section>
          )}

          {resultado === "no-encontrado" && (
            <section className="flex flex-col gap-2 rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
              <p className="font-medium text-red-700 dark:text-red-400">
                Hash no encontrado — el documento puede haber sido alterado
              </p>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
