import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-slate-200">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-[#1B3A6B]"
        >
          Allgree
        </Link>
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
            href="/about"
            className="text-sm font-medium text-slate-600 hover:text-[#1B3A6B]"
          >
            Sobre Allgree
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-slate-600 hover:text-[#1B3A6B]"
          >
            Iniciar sesión
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
  );
}
