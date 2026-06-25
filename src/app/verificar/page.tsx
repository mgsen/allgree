"use client";

import { useState } from "react";
import type { Acuerdo } from "@/types/acuerdo";
import Header from "@/components/Header";

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
    <div className="flex flex-1 flex-col bg-white">
      <Header />

      <main className="flex flex-1 px-4 py-8">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#1B3A6B]">
              Verificar acuerdo
            </h1>
            <p className="text-gray-600">
              Ingresá el hash SHA-256 de un acuerdo para confirmar su
              autenticidad.
            </p>
          </div>

          <section className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-gray-600">Hash SHA-256</span>
              <input
                type="text"
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") verificar();
                }}
                placeholder="Pegá el hash del acuerdo acá"
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-mono text-sm text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </label>

            <button
              type="button"
              disabled={!hashInput.trim()}
              onClick={verificar}
              className="flex h-12 items-center justify-center self-start rounded-full bg-[#1B3A6B] px-8 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Verificar
            </button>
          </section>

          {resultado === "encontrado" && acuerdo && (
            <section className="flex flex-col gap-3 rounded-xl border border-green-200 bg-green-50 p-6 shadow-sm">
              <p className="font-medium text-green-700">
                Acuerdo verificado — el documento es auténtico
              </p>
              <div className="flex flex-col gap-1 text-sm text-green-800">
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
            <section className="flex flex-col gap-2 rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
              <p className="font-medium text-red-700">
                Hash no encontrado — el documento puede haber sido alterado
              </p>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
