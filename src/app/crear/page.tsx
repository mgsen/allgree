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

function numeroALetras(numero: number): string {
  const unidades = [
    "",
    "uno",
    "dos",
    "tres",
    "cuatro",
    "cinco",
    "seis",
    "siete",
    "ocho",
    "nueve",
  ];
  const decenas = [
    "",
    "diez",
    "veinte",
    "treinta",
    "cuarenta",
    "cincuenta",
    "sesenta",
    "setenta",
    "ochenta",
    "noventa",
  ];
  const especiales: Record<number, string> = {
    10: "diez",
    11: "once",
    12: "doce",
    13: "trece",
    14: "catorce",
    15: "quince",
    16: "dieciséis",
    17: "diecisiete",
    18: "dieciocho",
    19: "diecinueve",
    20: "veinte",
    21: "veintiuno",
    22: "veintidós",
    23: "veintitrés",
    24: "veinticuatro",
    25: "veinticinco",
    26: "veintiséis",
    27: "veintisiete",
    28: "veintiocho",
    29: "veintinueve",
  };
  const centenas = [
    "",
    "ciento",
    "doscientos",
    "trescientos",
    "cuatrocientos",
    "quinientos",
    "seiscientos",
    "setecientos",
    "ochocientos",
    "novecientos",
  ];

  function convertirDecenas(n: number): string {
    if (n === 0) return "";
    if (n < 10) return unidades[n];
    if (n < 30) return especiales[n];
    const d = Math.floor(n / 10);
    const u = n % 10;
    return u === 0 ? decenas[d] : `${decenas[d]} y ${unidades[u]}`;
  }

  function convertirCentenas(n: number): string {
    if (n === 0) return "";
    if (n === 100) return "cien";
    if (n < 100) return convertirDecenas(n);
    const c = Math.floor(n / 100);
    const resto = n % 100;
    return resto === 0
      ? centenas[c]
      : `${centenas[c]} ${convertirDecenas(resto)}`;
  }

  function convertirMiles(n: number): string {
    if (n < 1000) return convertirCentenas(n);
    const miles = Math.floor(n / 1000);
    const resto = n % 1000;
    const milesTexto = miles === 1 ? "mil" : `${convertirCentenas(miles)} mil`;
    return resto === 0 ? milesTexto : `${milesTexto} ${convertirCentenas(resto)}`;
  }

  if (numero === 0) return "cero";
  return convertirMiles(numero);
}

function fechaEnLetras(fecha: Date): string {
  const meses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  const dia = fecha.getDate();
  const mes = meses[fecha.getMonth()];
  const anio = fecha.getFullYear();

  if (dia === 1) {
    return `al primer día del mes de ${mes} de ${numeroALetras(anio)}`;
  }
  return `a los ${numeroALetras(dia)} días del mes de ${mes} de ${numeroALetras(anio)}`;
}

function generarPDF(acuerdo: Acuerdo, ejemplares: number = 1) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 20;
  const maxWidth = pageWidth - marginX * 2;
  const footerHeight = acuerdo.txHash ? 30 : 22;
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
  y += 6;
  doc.text(
    `Fecha en letras: ${fechaEnLetras(new Date(acuerdo.timestamp))}`,
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
  const lineasProponente = doc.splitTextToSize(
    `Proponente: ${acuerdo.partes.proponente.nombre}, nacionalidad ${acuerdo.partes.proponente.nacionalidad}, DNI ${acuerdo.partes.proponente.dni}, con domicilio en ${acuerdo.partes.proponente.domicilio} (${acuerdo.partes.proponente.email})`,
    maxWidth,
  );
  saltoDePaginaSiHaceFalta(lineasProponente.length * 5 + 2);
  doc.text(lineasProponente, marginX, y);
  y += lineasProponente.length * 5 + 2;

  const lineasAceptante = doc.splitTextToSize(
    `Aceptante: ${acuerdo.partes.aceptante.nombre}, nacionalidad ${acuerdo.partes.aceptante.nacionalidad}, DNI ${acuerdo.partes.aceptante.dni}, con domicilio en ${acuerdo.partes.aceptante.domicilio} (${acuerdo.partes.aceptante.email})`,
    maxWidth,
  );
  saltoDePaginaSiHaceFalta(lineasAceptante.length * 5 + 2);
  doc.text(lineasAceptante, marginX, y);
  y += lineasAceptante.length * 5 + 8;

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
    `El presente acuerdo se extiende y suscribe en ${ejemplares} ${ejemplares === 1 ? "ejemplar" : "ejemplares"} de un mismo tenor y a un solo efecto.`,
  ];
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  declaraciones.forEach((declaracion) => {
    const lineas = doc.splitTextToSize(declaracion, maxWidth);
    saltoDePaginaSiHaceFalta(lineas.length * 5 + 4);
    doc.text(lineas, marginX, y);
    y += lineas.length * 5 + 4;
  });

  // Pie de página al final del documento
  const totalPaginas = doc.getNumberOfPages();
  doc.setPage(totalPaginas);
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
      `Transacción blockchain verificable en: ${acuerdo.txHash}`,
      marginX,
      pageHeight - footerHeight + 13,
      { maxWidth },
    );
    doc.text(
      `https://stellar.expert/explorer/testnet/tx/${acuerdo.txHash}`,
      marginX,
      pageHeight - footerHeight + 18,
      { maxWidth },
    );
  }
  doc.text(
    "Documento generado por Allgree. Hash verificable en allgree.vercel.app/verificar",
    marginX,
    pageHeight - footerHeight + (acuerdo.txHash ? 23 : 14),
  );

  const pdfBase64 = doc.output("datauristring").split(",")[1];
  localStorage.setItem(
    `acuerdo_${acuerdo.id}`,
    JSON.stringify({ ...acuerdo, pdfBase64 }),
  );

  doc.save(`acuerdo-allgree-${acuerdo.id}.pdf`);
}

export default function CrearAcuerdo() {
  const [proponenteNombre, setProponenteNombre] = useState("");
  const [proponenteEmail, setProponenteEmail] = useState("");
  const [proponenteDni, setProponenteDni] = useState("");
  const [proponenteDomicilio, setProponenteDomicilio] = useState("");
  const [proponenteNacionalidad, setProponenteNacionalidad] = useState("");
  const [proponenteCapacidad, setProponenteCapacidad] = useState(false);
  const [aceptanteNombre, setAceptanteNombre] = useState("");
  const [aceptanteEmail, setAceptanteEmail] = useState("");
  const [aceptanteDni, setAceptanteDni] = useState("");
  const [aceptanteDomicilio, setAceptanteDomicilio] = useState("");
  const [aceptanteNacionalidad, setAceptanteNacionalidad] = useState("");
  const [aceptanteCapacidad, setAceptanteCapacidad] = useState(false);
  const [descripcion, setDescripcion] = useState("");
  const [cantidadEjemplares, setCantidadEjemplares] = useState(2);

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
            domicilio: proponenteDomicilio,
            nacionalidad: proponenteNacionalidad,
          },
          aceptante: {
            nombre: aceptanteNombre,
            email: aceptanteEmail,
            dni: aceptanteDni,
            domicilio: aceptanteDomicilio,
            nacionalidad: aceptanteNacionalidad,
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
        domicilio: proponenteDomicilio,
        nacionalidad: proponenteNacionalidad,
      },
      aceptante: {
        nombre: aceptanteNombre,
        email: aceptanteEmail,
        dni: aceptanteDni,
        domicilio: aceptanteDomicilio,
        nacionalidad: aceptanteNacionalidad,
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
      estado: "firmado",
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
    <div className="flex flex-1 flex-col bg-white">
      <header className="border-b border-gray-200">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-[#1B3A6B]"
          >
            Allgree
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/mis-acuerdos"
              className="text-sm font-medium text-gray-600 hover:text-[#1B3A6B]"
            >
              Mis acuerdos
            </Link>
            <Link
              href="/verificar"
              className="text-sm font-medium text-gray-600 hover:text-[#1B3A6B]"
            >
              Verificar acuerdo
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-1 px-4 py-8">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#1B3A6B]">
              Crear acuerdo
            </h1>
            <p className="text-gray-600">
              Completá los datos de las partes y describí el acuerdo en tus
              palabras.
            </p>
          </div>

          <section className="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wide text-[#1B3A6B]">
              Partes del acuerdo
            </h2>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-4">
                <p className="text-sm font-medium text-gray-700">
                  Proponente
                </p>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm text-gray-600">Nombre</span>
                  <input
                    type="text"
                    value={proponenteNombre}
                    onChange={(e) => setProponenteNombre(e.target.value)}
                    placeholder="Ej: Juan Pérez"
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm text-gray-600">Email</span>
                  <input
                    type="email"
                    value={proponenteEmail}
                    onChange={(e) => setProponenteEmail(e.target.value)}
                    placeholder="juan@email.com"
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm text-gray-600">DNI</span>
                  <input
                    type="text"
                    value={proponenteDni}
                    onChange={(e) => setProponenteDni(e.target.value)}
                    placeholder="12345678"
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm text-gray-600">Domicilio</span>
                  <input
                    type="text"
                    value={proponenteDomicilio}
                    onChange={(e) => setProponenteDomicilio(e.target.value)}
                    placeholder="Av. San Martín 1234, Mendoza"
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm text-gray-600">Nacionalidad</span>
                  <input
                    type="text"
                    value={proponenteNacionalidad}
                    onChange={(e) => setProponenteNacionalidad(e.target.value)}
                    placeholder="Argentina"
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>

              <div className="flex flex-col gap-4">
                <p className="text-sm font-medium text-gray-700">
                  Aceptante
                </p>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm text-gray-600">Nombre</span>
                  <input
                    type="text"
                    value={aceptanteNombre}
                    onChange={(e) => setAceptanteNombre(e.target.value)}
                    placeholder="Ej: María Gómez"
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm text-gray-600">Email</span>
                  <input
                    type="email"
                    value={aceptanteEmail}
                    onChange={(e) => setAceptanteEmail(e.target.value)}
                    placeholder="maria@email.com"
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm text-gray-600">DNI</span>
                  <input
                    type="text"
                    value={aceptanteDni}
                    onChange={(e) => setAceptanteDni(e.target.value)}
                    placeholder="12345678"
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm text-gray-600">Domicilio</span>
                  <input
                    type="text"
                    value={aceptanteDomicilio}
                    onChange={(e) => setAceptanteDomicilio(e.target.value)}
                    placeholder="Av. San Martín 1234, Mendoza"
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-sm text-gray-600">Nacionalidad</span>
                  <input
                    type="text"
                    value={aceptanteNacionalidad}
                    onChange={(e) => setAceptanteNacionalidad(e.target.value)}
                    placeholder="Argentina"
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </label>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wide text-[#1B3A6B]">
              Descripción del acuerdo
            </h2>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={5}
              placeholder="Describí el acuerdo en tus palabras (ej: Juan me presta $500 en 30 días con interés del 5%)"
              className="resize-none rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </section>

          <section className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wide text-[#1B3A6B]">
              Capacidad jurídica
            </h2>
            <label className="flex items-start gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={proponenteCapacidad}
                onChange={(e) => setProponenteCapacidad(e.target.checked)}
                className="mt-0.5"
              />
              <span>
                Proponente: Declaro ser mayor de edad y tener plena capacidad
                jurídica para contratar.
              </span>
            </label>
            <label className="flex items-start gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={aceptanteCapacidad}
                onChange={(e) => setAceptanteCapacidad(e.target.checked)}
                className="mt-0.5"
              />
              <span>
                Aceptante: Declaro ser mayor de edad y tener plena capacidad
                jurídica para contratar.
              </span>
            </label>
          </section>

          <button
            type="button"
            disabled={
              generando ||
              !descripcion.trim() ||
              !proponenteNombre.trim() ||
              !proponenteEmail.trim() ||
              !proponenteDni.trim() ||
              !proponenteDomicilio.trim() ||
              !proponenteNacionalidad.trim() ||
              !aceptanteNombre.trim() ||
              !aceptanteEmail.trim() ||
              !aceptanteDni.trim() ||
              !aceptanteDomicilio.trim() ||
              !aceptanteNacionalidad.trim() ||
              !proponenteCapacidad ||
              !aceptanteCapacidad
            }
            onClick={generarClausulas}
            className="flex h-12 items-center justify-center rounded-full bg-[#1B3A6B] px-8 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {generando ? "Generando..." : "Generar cláusulas con IA"}
          </button>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <section className="flex flex-col gap-3 rounded-xl border border-dashed border-gray-300 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wide text-[#1B3A6B]">
              Preview de cláusulas
            </h2>

            {generando ? (
              <div className="flex min-h-32 items-center justify-center rounded-lg bg-gray-50 text-center text-sm text-gray-500">
                La IA está redactando las cláusulas...
              </div>
            ) : clausulas.length === 0 ? (
              <div className="flex min-h-32 items-center justify-center rounded-lg bg-gray-50 text-center text-sm text-gray-400">
                Las cláusulas generadas aparecerán acá.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {clausulas.map((clausula, index) => (
                  <div key={index} className="flex gap-3">
                    <span className="mt-2 text-sm font-medium text-gray-500">
                      {index + 1}.
                    </span>
                    <textarea
                      value={clausula}
                      onChange={(e) =>
                        actualizarClausula(index, e.target.value)
                      }
                      rows={2}
                      className="flex-1 resize-none rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => eliminarClausula(index)}
                      className="self-start rounded-lg px-2 py-1 text-sm text-gray-500 hover:text-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={agregarClausula}
                  className="flex h-9 items-center justify-center self-start rounded-full border border-[#1B3A6B] px-4 text-sm font-medium text-[#1B3A6B] hover:bg-[#1B3A6B]/5"
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
            <section className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-wide text-[#1B3A6B]">
                Firmar acuerdo
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={
                    !!firmas.proponente || !proponenteNombre.trim() || sellando
                  }
                  onClick={() => firmarComo("proponente")}
                  className="flex h-12 flex-col items-center justify-center rounded-full border border-[#1B3A6B] px-4 text-sm font-medium text-[#1B3A6B] transition-colors hover:bg-[#1B3A6B]/5 disabled:cursor-not-allowed disabled:opacity-60"
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
                  className="flex h-12 flex-col items-center justify-center rounded-full border border-[#1B3A6B] px-4 text-sm font-medium text-[#1B3A6B] transition-colors hover:bg-[#1B3A6B]/5 disabled:cursor-not-allowed disabled:opacity-60"
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
                <p className="text-sm text-gray-600">Sellando acuerdo...</p>
              )}

              {sellado && acuerdoSellado && (
                <div className="flex flex-col gap-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
                  <div className="flex flex-col gap-2">
                    <p className="font-medium text-gray-900">
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
                    <p className="text-sm text-gray-600">
                      Registrando en blockchain...
                    </p>
                  )}

                  {errorBlockchain && (
                    <p className="text-sm text-red-600">{errorBlockchain}</p>
                  )}

                  {acuerdoSellado.txHash && (
                    <div className="flex flex-col gap-1">
                      <p className="font-medium text-gray-900">
                        Registrado en Stellar Testnet
                      </p>
                      <a
                        href={`https://stellar.expert/explorer/testnet/tx/${acuerdoSellado.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-all font-mono text-xs text-[#1B3A6B] underline hover:opacity-80"
                      >
                        {acuerdoSellado.txHash}
                      </a>
                    </div>
                  )}

                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    ¿Cuántos ejemplares necesitás?
                    <select
                      value={cantidadEjemplares}
                      onChange={(e) =>
                        setCantidadEjemplares(Number(e.target.value))
                      }
                      className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                    </select>
                  </label>

                  <button
                    type="button"
                    onClick={() =>
                      generarPDF(acuerdoSellado, cantidadEjemplares)
                    }
                    className="flex h-11 items-center justify-center self-start rounded-full bg-[#1B3A6B] px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
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
