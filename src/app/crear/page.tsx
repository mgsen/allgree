"use client";

import { useState } from "react";
import Link from "next/link";
import { jsPDF } from "jspdf";
import type { Acuerdo, Firma } from "@/types/acuerdo";

interface Firmas {
  proponente?: Firma;
  aceptante?: Firma;
}

async function calcularHashSHA256(contenido: string): Promise<string> {
  const data = new TextEncoder().encode(contenido);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function generarPDF(acuerdo: Acuerdo) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 20;
  const maxWidth = pageWidth - marginX * 2;
  const footerHeight = 22;
  let y = 20;

  function saltoDePaginaSiHaceFalta(espacioNecesario: number) {
    if (y + espacioNecesario > pageHeight - footerHeight) {
      doc.addPage();
      y = 20;
    }
  }

  // Encabezado
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("ALLGREE — Acuerdo Extrajudicial", marginX, y);
  y += 6;
  doc.setDrawColor(200);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text(
    `Fecha de creación: ${new Date(acuerdo.timestamp).toLocaleString("es-AR")}`,
    marginX,
    y,
  );
  y += 10;

  // Partes
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Partes del acuerdo", marginX, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(
    `Proponente: ${acuerdo.partes.proponente.nombre} (${acuerdo.partes.proponente.email}) — DNI ${acuerdo.partes.proponente.dni}`,
    marginX,
    y,
  );
  y += 6;
  doc.text(
    `Aceptante: ${acuerdo.partes.aceptante.nombre} (${acuerdo.partes.aceptante.email}) — DNI ${acuerdo.partes.aceptante.dni}`,
    marginX,
    y,
  );
  y += 10;

  // Cláusulas
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  saltoDePaginaSiHaceFalta(10);
  doc.text("Cláusulas", marginX, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  acuerdo.clausulas.forEach((clausula, index) => {
    const lineas = doc.splitTextToSize(`${index + 1}. ${clausula}`, maxWidth);
    saltoDePaginaSiHaceFalta(lineas.length * 5 + 4);
    doc.text(lineas, marginX, y);
    y += lineas.length * 5 + 4;
  });

  y += 4;

  // Firmas
  saltoDePaginaSiHaceFalta(25);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Firmas", marginX, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(
    `Proponente: ${acuerdo.firmas.proponente.nombre} — firmado el ${acuerdo.firmas.proponente.fecha} a las ${acuerdo.firmas.proponente.hora}`,
    marginX,
    y,
  );
  y += 7;
  doc.text(
    `Aceptante: ${acuerdo.firmas.aceptante.nombre} — firmado el ${acuerdo.firmas.aceptante.fecha} a las ${acuerdo.firmas.aceptante.hora}`,
    marginX,
    y,
  );
  y += 10;

  // Declaraciones finales
  const declaraciones = [
    "DECLARACIÓN JURADA DIGITAL: Las partes declaran bajo fe de juramento que los correos electrónicos y datos personales consignados son de su exclusiva propiedad y control, y los consideran medios suficientes de notificación y consentimiento digital.",
    "Las partes han leído el presente acuerdo, están conformes con su contenido y lo suscriben en formato digital en la Ciudad de Mendoza, República Argentina.",
  ];
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  declaraciones.forEach((declaracion) => {
    const lineas = doc.splitTextToSize(declaracion, maxWidth);
    saltoDePaginaSiHaceFalta(lineas.length * 5 + 4);
    doc.text(lineas, marginX, y);
    y += lineas.length * 5 + 4;
  });

  // Pie de página en todas las páginas
  const totalPaginas = doc.getNumberOfPages();
  for (let pagina = 1; pagina <= totalPaginas; pagina++) {
    doc.setPage(pagina);
    doc.setDrawColor(220);
    doc.line(marginX, pageHeight - footerHeight + 2, pageWidth - marginX, pageHeight - footerHeight + 2);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`Hash SHA-256: ${acuerdo.hash}`, marginX, pageHeight - footerHeight + 8, {
      maxWidth,
    });
    if (acuerdo.txHash) {
      doc.text(
        `Tx Stellar Testnet: ${acuerdo.txHash}`,
        marginX,
        pageHeight - footerHeight + 13,
        { maxWidth },
      );
    }
    doc.text(
      "Documento generado por Allgree. Hash verificable en allgree.vercel.app/verificar",
      marginX,
      pageHeight - footerHeight + (acuerdo.txHash ? 18 : 14),
    );
  }

  doc.save(`acuerdo-allgree-${acuerdo.id}.pdf`);
}

export default function CrearAcuerdo() {
  const [proponenteNombre, setProponenteNombre] = useState("");
  const [proponenteEmail, setProponenteEmail] = useState("");
  const [proponenteDni, setProponenteDni] = useState("");
  const [aceptanteNombre, setAceptanteNombre] = useState("");
  const [aceptanteEmail, setAceptanteEmail] = useState("");
  const [aceptanteDni, setAceptanteDni] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [clausulas, setClausulas] = useState<string[]>([]);
  const [generando, setGenerando] = useState(false);
  const [error, setError] = useState("");

  async function generarClausulas() {
    setError("");
    setGenerando(true);
    try {
      const res = await fetch("/api/generar-clausulas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          descripcion,
          proponente: {
            nombre: proponenteNombre,
            email: proponenteEmail,
            dni: proponenteDni,
          },
          aceptante: {
            nombre: aceptanteNombre,
            email: aceptanteEmail,
            dni: aceptanteDni,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudieron generar las cláusulas");
      }

      setClausulas(data.clausulas);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado",
      );
    } finally {
      setGenerando(false);
    }
  }

  function actualizarClausula(index: number, texto: string) {
    setClausulas((prev) => prev.map((c, i) => (i === index ? texto : c)));
  }

  function eliminarClausula(index: number) {
    setClausulas((prev) => prev.filter((_, i) => i !== index));
  }

  function agregarClausula() {
    setClausulas((prev) => [...prev, ""]);
  }

  const [firmas, setFirmas] = useState<Firmas>({});
  const [acuerdoSellado, setAcuerdoSellado] = useState<Acuerdo | null>(null);
  const [sellando, setSellando] = useState(false);
  const [registrandoBlockchain, setRegistrandoBlockchain] = useState(false);
  const [errorBlockchain, setErrorBlockchain] = useState("");

  function firmarComo(rol: "proponente" | "aceptante") {
    const nombre = rol === "proponente" ? proponenteNombre : aceptanteNombre;
    if (!nombre.trim() || firmas[rol]) return;

    const ahora = new Date();
    const firma: Firma = {
      nombre: nombre.trim(),
      fecha: ahora.toLocaleDateString("es-AR"),
      hora: ahora.toLocaleTimeString("es-AR"),
    };

    const nuevasFirmas: Firmas = { ...firmas, [rol]: firma };
    setFirmas(nuevasFirmas);

    if (nuevasFirmas.proponente && nuevasFirmas.aceptante) {
      sellarAcuerdo(nuevasFirmas.proponente, nuevasFirmas.aceptante);
    }
  }

  async function sellarAcuerdo(firmaProponente: Firma, firmaAceptante: Firma) {
    setSellando(true);

    const partes = {
      proponente: {
        nombre: proponenteNombre,
        email: proponenteEmail,
        dni: proponenteDni,
      },
      aceptante: {
        nombre: aceptanteNombre,
        email: aceptanteEmail,
        dni: aceptanteDni,
      },
    };
    const firmasCompletas = {
      proponente: firmaProponente,
      aceptante: firmaAceptante,
    };

    const contenido = JSON.stringify({
      clausulas,
      partes,
      firmas: firmasCompletas,
    });
    const hashCalculado = await calcularHashSHA256(contenido);
    const timestamp = new Date().toISOString();

    const acuerdo: Acuerdo = {
      id: Date.now(),
      clausulas,
      partes,
      firmas: firmasCompletas,
      hash: hashCalculado,
      timestamp,
    };

    localStorage.setItem(`acuerdo_${acuerdo.id}`, JSON.stringify(acuerdo));

    setAcuerdoSellado(acuerdo);
    setSellando(false);

    registrarEnBlockchain(acuerdo);
  }

  async function registrarEnBlockchain(acuerdo: Acuerdo) {
    setErrorBlockchain("");
    setRegistrandoBlockchain(true);
    try {
      const res = await fetch("/api/registrar-blockchain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hash: acuerdo.hash }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo registrar en blockchain");
      }

      const acuerdoConTx: Acuerdo = { ...acuerdo, txHash: data.txHash };
      localStorage.setItem(
        `acuerdo_${acuerdoConTx.id}`,
        JSON.stringify(acuerdoConTx),
      );
      setAcuerdoSellado(acuerdoConTx);
    } catch (err) {
      setErrorBlockchain(
        err instanceof Error ? err.message : "Ocurrió un error inesperado",
      );
    } finally {
      setRegistrandoBlockchain(false);
    }
  }

  const sellado = acuerdoSellado !== null;

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <header className="border-b border-black/[.08] dark:border-white/[.1]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50"
          >
            Allgree
          </Link>
          <Link
            href="/verificar"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Verificar acuerdo
          </Link>
        </div>
      </header>

      <main className="flex flex-1 justify-center px-6 py-12">
        <div className="flex w-full max-w-2xl flex-col gap-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              Crear acuerdo
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Completá los datos de las partes y describí el acuerdo en tus
              palabras.
            </p>
          </div>

          <section className="flex flex-col gap-6 rounded-2xl border border-black/[.08] bg-white p-6 dark:border-white/[.1] dark:bg-zinc-950">
            <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Partes del acuerdo
            </h2>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-4">
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Proponente
                </p>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Nombre
                  </span>
                  <input
                    type="text"
                    value={proponenteNombre}
                    onChange={(e) => setProponenteNombre(e.target.value)}
                    placeholder="Ej: Juan Pérez"
                    className="rounded-lg border border-black/[.1] bg-white px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-950 dark:border-white/[.15] dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Email
                  </span>
                  <input
                    type="email"
                    value={proponenteEmail}
                    onChange={(e) => setProponenteEmail(e.target.value)}
                    placeholder="juan@email.com"
                    className="rounded-lg border border-black/[.1] bg-white px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-950 dark:border-white/[.15] dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    DNI
                  </span>
                  <input
                    type="text"
                    value={proponenteDni}
                    onChange={(e) => setProponenteDni(e.target.value)}
                    placeholder="12345678"
                    className="rounded-lg border border-black/[.1] bg-white px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-950 dark:border-white/[.15] dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50"
                  />
                </label>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Aceptante
                </p>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Nombre
                  </span>
                  <input
                    type="text"
                    value={aceptanteNombre}
                    onChange={(e) => setAceptanteNombre(e.target.value)}
                    placeholder="Ej: María Gómez"
                    className="rounded-lg border border-black/[.1] bg-white px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-950 dark:border-white/[.15] dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    Email
                  </span>
                  <input
                    type="email"
                    value={aceptanteEmail}
                    onChange={(e) => setAceptanteEmail(e.target.value)}
                    placeholder="maria@email.com"
                    className="rounded-lg border border-black/[.1] bg-white px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-950 dark:border-white/[.15] dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    DNI
                  </span>
                  <input
                    type="text"
                    value={aceptanteDni}
                    onChange={(e) => setAceptanteDni(e.target.value)}
                    placeholder="12345678"
                    className="rounded-lg border border-black/[.1] bg-white px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-950 dark:border-white/[.15] dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50"
                  />
                </label>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-3 rounded-2xl border border-black/[.08] bg-white p-6 dark:border-white/[.1] dark:bg-zinc-950">
            <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Descripción del acuerdo
            </h2>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={5}
              placeholder="Describí el acuerdo en tus palabras (ej: Juan me presta $500 en 30 días con interés del 5%)"
              className="resize-none rounded-lg border border-black/[.1] bg-white px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-950 dark:border-white/[.15] dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50"
            />
          </section>

          <button
            type="button"
            disabled={
              generando ||
              !descripcion.trim() ||
              !proponenteNombre.trim() ||
              !proponenteEmail.trim() ||
              !proponenteDni.trim() ||
              !aceptanteNombre.trim() ||
              !aceptanteEmail.trim() ||
              !aceptanteDni.trim()
            }
            onClick={generarClausulas}
            className="flex h-12 items-center justify-center rounded-full bg-zinc-950 px-8 text-base font-medium text-zinc-50 transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            {generando ? "Generando..." : "Generar cláusulas con IA"}
          </button>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}

          <section className="flex flex-col gap-3 rounded-2xl border border-dashed border-black/[.15] bg-white p-6 dark:border-white/[.2] dark:bg-zinc-950">
            <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Preview de cláusulas
            </h2>

            {generando ? (
              <div className="flex min-h-32 items-center justify-center rounded-lg bg-zinc-50 text-center text-sm text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                La IA está redactando las cláusulas...
              </div>
            ) : clausulas.length === 0 ? (
              <div className="flex min-h-32 items-center justify-center rounded-lg bg-zinc-50 text-center text-sm text-zinc-400 dark:bg-zinc-900 dark:text-zinc-500">
                Las cláusulas generadas aparecerán acá.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {clausulas.map((clausula, index) => (
                  <div key={index} className="flex gap-3">
                    <span className="mt-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                      {index + 1}.
                    </span>
                    <textarea
                      value={clausula}
                      onChange={(e) =>
                        actualizarClausula(index, e.target.value)
                      }
                      rows={2}
                      className="flex-1 resize-none rounded-lg border border-black/[.1] bg-white px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-950 dark:border-white/[.15] dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50"
                    />
                    <button
                      type="button"
                      onClick={() => eliminarClausula(index)}
                      className="self-start rounded-lg px-2 py-1 text-sm text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={agregarClausula}
                  className="self-start rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                >
                  + Agregar cláusula
                </button>
              </div>
            )}
          </section>

          {clausulas.length > 0 && (
            <div className="flex items-start gap-3 rounded-xl border border-orange-300 bg-yellow-50 p-4 text-sm text-zinc-800 dark:border-orange-700 dark:bg-yellow-950/30 dark:text-zinc-200">
              <span aria-hidden="true">⚠️</span>
              <p>
                Documento con firma electrónica (Ley 25.506). En caso de
                desconocimiento de firma, la parte demandante deberá probar
                autoría mediante pericia informática. NO válido para:
                inmuebles, derechos reales, actos de derecho de familia ni
                testamentos (Art. 1017 CCyCN).
              </p>
            </div>
          )}

          {clausulas.length > 0 && (
            <section className="flex flex-col gap-4 rounded-2xl border border-black/[.08] bg-white p-6 dark:border-white/[.1] dark:bg-zinc-950">
              <h2 className="text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                Firmar acuerdo
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={
                    !!firmas.proponente || !proponenteNombre.trim() || sellando
                  }
                  onClick={() => firmarComo("proponente")}
                  className="flex h-12 flex-col items-center justify-center rounded-xl border border-black/[.1] px-4 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/[.15] dark:text-zinc-50 dark:hover:bg-zinc-900"
                >
                  {firmas.proponente ? (
                    <span className="text-center text-xs leading-tight">
                      Firmado por {firmas.proponente.nombre}
                      <br />
                      {firmas.proponente.fecha} {firmas.proponente.hora}
                    </span>
                  ) : (
                    "Firmar como proponente"
                  )}
                </button>

                <button
                  type="button"
                  disabled={
                    !!firmas.aceptante || !aceptanteNombre.trim() || sellando
                  }
                  onClick={() => firmarComo("aceptante")}
                  className="flex h-12 flex-col items-center justify-center rounded-xl border border-black/[.1] px-4 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/[.15] dark:text-zinc-50 dark:hover:bg-zinc-900"
                >
                  {firmas.aceptante ? (
                    <span className="text-center text-xs leading-tight">
                      Firmado por {firmas.aceptante.nombre}
                      <br />
                      {firmas.aceptante.fecha} {firmas.aceptante.hora}
                    </span>
                  ) : (
                    "Firmar como aceptante"
                  )}
                </button>
              </div>

              {sellando && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Sellando acuerdo...
                </p>
              )}

              {sellado && acuerdoSellado && (
                <div className="flex flex-col gap-4 rounded-xl bg-zinc-50 p-4 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                  <div className="flex flex-col gap-2">
                    <p className="font-medium text-zinc-950 dark:text-zinc-50">
                      Acuerdo sellado — Hash SHA-256:{" "}
                      <span className="break-all font-mono text-xs">
                        {acuerdoSellado.hash}
                      </span>
                    </p>
                    <p>
                      Este hash es la huella digital inmutable de tu acuerdo.
                    </p>
                    <p>Cualquier modificación al documento cambia el hash.</p>
                  </div>

                  {registrandoBlockchain && (
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Registrando en blockchain...
                    </p>
                  )}

                  {errorBlockchain && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {errorBlockchain}
                    </p>
                  )}

                  {acuerdoSellado.txHash && (
                    <div className="flex flex-col gap-1">
                      <p className="font-medium text-zinc-950 dark:text-zinc-50">
                        Registrado en Stellar Testnet
                      </p>
                      <a
                        href={`https://stellar.expert/explorer/testnet/tx/${acuerdoSellado.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all font-mono text-xs text-blue-600 underline hover:text-blue-500 dark:text-blue-400"
                      >
                        {acuerdoSellado.txHash}
                      </a>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => generarPDF(acuerdoSellado)}
                    className="flex h-11 items-center justify-center self-start rounded-full bg-zinc-950 px-6 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
                  >
                    Descargar PDF
                  </button>
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
