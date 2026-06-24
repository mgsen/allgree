import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <header className="border-b border-black/[.08] dark:border-white/[.1]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <span className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Allgree
          </span>
          <div className="flex items-center gap-6">
            <Link
              href="/verificar"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Verificar acuerdo
            </Link>
            <Link
              href="/mis-acuerdos"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
              Mis acuerdos
            </Link>
            <Link
              href="/crear"
              className="flex h-9 items-center justify-center rounded-full bg-zinc-950 px-5 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              Crear acuerdo
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col items-center justify-center px-6">
          <div className="flex max-w-2xl flex-col items-center gap-6 py-24 text-center">
            <span className="rounded-full border border-black/[.08] bg-white px-4 py-1.5 text-xs font-medium text-zinc-600 dark:border-white/[.1] dark:bg-zinc-950 dark:text-zinc-400">
              Art. 957-959 Código Civil y Comercial de la Nación
            </span>
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-5xl dark:text-zinc-50">
              Formalizá tus acuerdos. Simple, seguro e inmutable.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              Allgree te permite dejar acuerdos extrajudiciales por escrito, con
              validez y trazabilidad, sin depender de trámites lentos ni
              costosos.
            </p>
            <Link
              href="/crear"
              className="mt-2 flex h-12 items-center justify-center rounded-full bg-zinc-950 px-8 text-base font-medium text-zinc-50 transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              Crear acuerdo
            </Link>
          </div>
        </div>

        <section className="border-t border-black/[.08] px-6 py-20 dark:border-white/[.1]">
          <div className="mx-auto flex max-w-3xl flex-col gap-10">
            <h2 className="text-center text-2xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
              Preguntas frecuentes
            </h2>
            <div className="flex flex-col gap-3">
              {FAQ.map(({ pregunta, respuesta }) => (
                <details
                  key={pregunta}
                  className="group rounded-2xl border border-black/[.08] bg-white p-5 dark:border-white/[.1] dark:bg-zinc-950"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-zinc-950 dark:text-zinc-50">
                    {pregunta}
                    <span className="shrink-0 text-zinc-400 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-zinc-600 dark:text-zinc-400">
                    {respuesta}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/[.08] px-6 py-8 dark:border-white/[.1]">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm text-zinc-600 sm:flex-row dark:text-zinc-400">
          <span>Allgree — Acuerdos extrajudiciales con validez legal</span>
          <span>© {new Date().getFullYear()} Allgree</span>
        </div>
      </footer>
    </div>
  );
}

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
