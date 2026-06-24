import Link from "next/link";
import Header from "@/components/Header";

export default function About() {
  return (
    <div className="flex flex-1 flex-col bg-white">
      <Header />

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="px-6 py-20">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[#1B3A6B] sm:text-5xl">
              Nuestra misión
            </h1>
            <p className="max-w-xl text-lg leading-8 text-slate-600">
              Democratizar el acceso a acuerdos legales formales para todos
              los argentinos, sin barreras económicas ni tecnicismos.
            </p>
          </div>
        </section>

        {/* El problema */}
        <section className="bg-[#F8FAFC] px-6 py-20">
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            <h2 className="text-center text-3xl font-bold tracking-tight text-[#1B3A6B]">
              ¿Por qué existe Allgree?
            </h2>
            <p className="text-lg leading-8 text-slate-600">
              Millones de argentinos hacen acuerdos verbales todos los días:
              préstamos entre amigos, alquileres informales, ventas de bienes
              usados, acuerdos de servicios. Sin respaldo escrito, cuando algo
              falla no tienen pruebas para defenderse. Y para acuerdos
              cotidianos, ir a un escribano o abogado tiene un costo
              prohibitivo en relación al valor del acuerdo.
            </p>
            <p className="text-lg leading-8 text-slate-600">
              Sin embargo, el{" "}
              <span className="font-semibold text-[#1B3A6B]">
                Art. 957-959 del Código Civil y Comercial de la Nación
              </span>{" "}
              establece que los contratos privados entre partes son válidos y
              vinculantes sin necesidad de escribano. Allgree existe para que
              esa validez legal sea fácil de ejercer.
            </p>
          </div>
        </section>

        {/* La tecnología */}
        <section className="px-6 py-20">
          <div className="mx-auto flex max-w-6xl flex-col gap-12">
            <h2 className="text-center text-3xl font-bold tracking-tight text-[#1B3A6B]">
              La tecnología
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {TECNOLOGIAS.map(({ icono, titulo, descripcion }) => (
                <div
                  key={titulo}
                  className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-8"
                >
                  <span className="text-4xl">{icono}</span>
                  <h3 className="text-lg font-bold text-[#1B3A6B]">
                    {titulo}
                  </h3>
                  <p className="text-slate-600">{descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* El equipo */}
        <section className="bg-[#F8FAFC] px-6 py-20">
          <div className="mx-auto flex max-w-6xl flex-col gap-4">
            <h2 className="text-center text-3xl font-bold tracking-tight text-[#1B3A6B]">
              El equipo
            </h2>
            <p className="text-center text-sm text-slate-500">
              2.º año — Universidad Champagnat — Mendoza, Argentina
            </p>
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              {EQUIPO.map(({ nombre, rol, carrera }) => (
                <div
                  key={nombre}
                  className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-8 text-center"
                >
                  <h3 className="text-lg font-bold text-[#1B3A6B]">
                    {nombre}
                  </h3>
                  <span className="text-sm font-semibold text-[#6366F1]">
                    {rol}
                  </span>
                  <p className="text-sm text-slate-600">{carrera}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fundamento académico */}
        <section className="px-6 py-20">
          <div className="mx-auto flex max-w-3xl flex-col gap-8">
            <h2 className="text-center text-3xl font-bold tracking-tight text-[#1B3A6B]">
              Líneas teóricas aplicadas
            </h2>
            <p className="text-center text-sm text-slate-500">
              Materia: Teoría de la Computación II
            </p>
            <div className="flex flex-col gap-4">
              {LINEAS.map(({ titulo, descripcion }) => (
                <div
                  key={titulo}
                  className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <h3 className="font-bold text-[#1B3A6B]">{titulo}</h3>
                  <p className="text-slate-600">{descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Validación legal */}
        <section className="bg-[#1B3A6B] px-6 py-20 text-white">
          <div className="mx-auto flex max-w-3xl flex-col gap-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Respaldado por profesionales del derecho
            </h2>
            <p className="text-lg leading-8 text-white/80">
              Allgree fue consultado con abogadas especializadas en contratos
              digitales argentinos, quienes validaron su marco legal bajo el
              Código Civil y Comercial de la Nación y la Ley 25.506 de Firma
              Digital.
            </p>
            <p className="text-sm font-semibold text-[#1D9E75]">
              Art. 284, 288, 957, 958, 959, 969, 1017 CCyCN
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-2 text-center text-sm text-slate-500">
          <Link href="/" className="font-medium text-[#1B3A6B] hover:underline">
            ← Volver a la homepage
          </Link>
        </div>
      </footer>
    </div>
  );
}

const TECNOLOGIAS = [
  {
    icono: "🤖",
    titulo: "Inteligencia Artificial",
    descripcion:
      "Groq + Llama 3.3 genera cláusulas legales adaptadas al derecho argentino en segundos.",
  },
  {
    icono: "🔐",
    titulo: "Criptografía SHA-256",
    descripcion:
      "Hash inmutable que prueba que el documento no fue alterado.",
  },
  {
    icono: "⛓️",
    titulo: "Blockchain Stellar",
    descripcion:
      "Registro permanente en red pública, verificable por cualquier persona en el mundo.",
  },
  {
    icono: "📄",
    titulo: "TypeScript Estricto",
    descripcion:
      "Tipos estáticos que garantizan integridad de datos en todo el sistema.",
  },
];

const EQUIPO = [
  {
    nombre: "Morella Gallardo",
    rol: "Lead Developer & Blockchain",
    carrera: "Licenciatura en Sistemas de Información",
  },
  {
    nombre: "Abril Cortez",
    rol: "Lead IA & Investigación",
    carrera: "Licenciatura en Sistemas de Información",
  },
  {
    nombre: "Guadalupe Montaña",
    rol: "Product Owner & Pitch",
    carrera: "Licenciatura en Sistemas de Información",
  },
];

const LINEAS = [
  {
    titulo: "Línea 1 (Lenguajes)",
    descripcion:
      "TypeScript — paradigma tipado estático, interfaces y tipos estrictos.",
  },
  {
    titulo: "Línea 2 (Sistemas de Tipos)",
    descripcion:
      "Strict mode en TypeScript previene errores en tiempo de compilación.",
  },
  {
    titulo: "Línea 3 (Compiladores)",
    descripcion:
      "Next.js + Turbopack genera AST optimizado y bytecode en cada build.",
  },
  {
    titulo: "Línea 4 (Seguridad/Blockchain)",
    descripcion:
      "SHA-256 + Stellar Testnet — hash criptográfico con registro inmutable.",
  },
];
