import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <header className="border-b border-slate-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <span className="text-xl font-bold tracking-tight text-[#1B3A6B]">
            Allgree
          </span>
          <div className="flex items-center gap-6">
            <Link
              href="/verificar"
              className="text-sm font-medium text-slate-600 hover:text-[#1B3A6B]"
            >
              Verificar acuerdo
            </Link>
            <Link
              href="/mis-acuerdos"
              className="text-sm font-medium text-slate-600 hover:text-[#1B3A6B]"
            >
              Mis acuerdos
            </Link>
            <Link
              href="/crear"
              className="flex h-9 items-center justify-center rounded-full bg-[#1B3A6B] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#142c52]"
            >
              Crear acuerdo
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="px-6 py-20">
          <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="flex flex-col items-start gap-6 text-left">
              <span className="rounded-full border border-[#6366F1]/30 bg-[#6366F1]/10 px-4 py-1.5 text-xs font-semibold text-[#6366F1]">
                Art. 957-959 Código Civil y Comercial
              </span>
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[#1B3A6B] sm:text-5xl">
                Formalizá tus acuerdos. Simple, seguro e inmutable.
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-600">
                Generá contratos con IA, firmá digitalmente y registrá en
                blockchain. Sin escribano. Sin excusas.
              </p>
              <div className="mt-2 flex flex-wrap gap-4">
                <Link
                  href="/crear"
                  className="flex h-12 items-center justify-center rounded-full bg-[#1B3A6B] px-8 text-base font-semibold text-white transition-colors hover:bg-[#142c52]"
                >
                  Crear acuerdo →
                </Link>
                <Link
                  href="https://github.com/mgsen/allgree"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 items-center justify-center rounded-full border-2 border-[#1B3A6B] px-8 text-base font-semibold text-[#1B3A6B] transition-colors hover:bg-[#1B3A6B]/5"
                >
                  Ver en GitHub →
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <Image
                src="/business-deal.svg"
                alt="Dos personas cerrando un acuerdo"
                width={500}
                height={500}
                className="w-full max-w-md"
              />
            </div>
          </div>
        </section>

        {/* Cómo funciona */}
        <section className="bg-[#F8FAFC] px-6 py-20">
          <div className="mx-auto flex max-w-6xl flex-col gap-12">
            <h2 className="text-center text-3xl font-bold tracking-tight text-[#1B3A6B]">
              Tres pasos para formalizar cualquier acuerdo
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {PASOS.map(({ numero, icono, titulo, descripcion }) => (
                <div
                  key={numero}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-8"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-4xl">{icono}</span>
                    <span className="text-sm font-bold text-[#6366F1]">
                      {numero}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1B3A6B]">
                    {titulo}
                  </h3>
                  <p className="text-slate-600">{descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-[#1B3A6B] px-6 py-16 text-white">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 text-center sm:grid-cols-3">
            {STATS.map(({ titulo, descripcion }) => (
              <div key={titulo} className="flex flex-col gap-2">
                <span className="text-3xl font-extrabold text-[#1D9E75]">
                  {titulo}
                </span>
                <span className="text-sm text-white/70">{descripcion}</span>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-slate-200 px-6 py-20">
          <div className="mx-auto flex max-w-3xl flex-col gap-10">
            <h2 className="text-center text-2xl font-bold tracking-tight text-[#1B3A6B]">
              Preguntas frecuentes
            </h2>
            <div className="flex flex-col gap-3">
              {FAQ.map(({ pregunta, respuesta }) => (
                <details
                  key={pregunta}
                  className="group rounded-2xl border border-slate-200 bg-white p-5"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[#1B3A6B]">
                    {pregunta}
                    <span className="shrink-0 text-[#6366F1] transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-slate-600">{respuesta}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-2 text-center text-sm text-slate-500">
          <span>
            Allgree © {new Date().getFullYear()} — Mendoza, Argentina ·{" "}
            github.com/mgsen/allgree
          </span>
        </div>
      </footer>
    </div>
  );
}

const PASOS = [
  {
    numero: "01",
    icono: "📝",
    titulo: "Describí tu acuerdo",
    descripcion:
      "La IA genera cláusulas legales adaptadas al derecho argentino.",
  },
  {
    numero: "02",
    icono: "✍️",
    titulo: "Firmá digitalmente",
    descripcion:
      "Ambas partes firman con consentimiento explícito y fecha/hora.",
  },
  {
    numero: "03",
    icono: "🔗",
    titulo: "Sellado en blockchain",
    descripcion:
      "Hash SHA-256 registrado en Stellar, verificable para siempre.",
  },
];

const STATS = [
  { titulo: "100% Legal", descripcion: "Ley 25.506 de Firma Digital" },
  { titulo: "Blockchain Real", descripcion: "Red Stellar Testnet" },
  { titulo: "Gratis para empezar", descripcion: "Sin tarjeta de crédito" },
];

const FAQ = [
  {
    pregunta: "¿Tiene validez legal un acuerdo digital en Argentina?",
    respuesta:
      "Sí, según el Art. 957-959 del CCyCN los contratos digitales tienen el mismo valor que los escritos a mano.",
  },
  {
    pregunta: "¿Para qué tipo de acuerdos sirve Allgree?",
    respuesta:
      "Préstamos, servicios, alquileres, compraventa de bienes muebles y cualquier acuerdo que no requiera escritura pública.",
  },
  {
    pregunta: "¿Qué es el hash SHA-256?",
    respuesta:
      "Es la huella digital del documento. Cualquier modificación cambia el hash, probando que fue alterado.",
  },
  {
    pregunta: "¿Qué pasa si alguien incumple?",
    respuesta:
      "El documento sirve como prueba ante un juez. Se puede solicitar pericia informática para validar la firma.",
  },
];
