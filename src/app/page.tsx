import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-black">
      <header className="border-b border-black/[.08] dark:border-white/[.1]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <span className="text-xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Pacto
          </span>
          <Link
            href="/verificar"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Verificar acuerdo
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6">
        <div className="flex max-w-2xl flex-col items-center gap-6 py-24 text-center">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-zinc-950 sm:text-5xl dark:text-zinc-50">
            Formalizá tus acuerdos. Sin escribano. Sin excusas.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Pacto te permite dejar acuerdos extrajudiciales por escrito, con
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
      </main>
    </div>
  );
}
