"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";

type Paso =
  | "formulario"
  | "instrucciones"
  | "camara"
  | "camara-no-disponible"
  | "procesando"
  | "verificado";

export default function Login() {
  const [paso, setPaso] = useState<Paso>("formulario");
  const [email, setEmail] = useState("");
  const [nombre, setNombre] = useState("");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  function detenerCamara() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  async function activarCamara() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setPaso("camara-no-disponible");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      streamRef.current = stream;
      setPaso("camara");
    } catch {
      setPaso("camara-no-disponible");
    }
  }

  useEffect(() => {
    if (paso === "camara" && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [paso]);

  function tomarSelfie() {
    detenerCamara();
    setPaso("procesando");
  }

  function continuarSinVerificacion() {
    setPaso("procesando");
  }

  useEffect(() => {
    if (paso !== "procesando") return;

    const timeout = setTimeout(() => setPaso("verificado"), 2000);
    return () => clearTimeout(timeout);
  }, [paso]);

  useEffect(() => {
    return () => detenerCamara();
  }, []);

  return (
    <div className="flex flex-1 flex-col bg-white">
      <Header />

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="flex w-full max-w-md flex-col gap-8 rounded-2xl border border-slate-200 bg-white p-8">
          {paso === "formulario" && (
            <form
              className="flex flex-col gap-6"
              onSubmit={(e) => {
                e.preventDefault();
                setPaso("instrucciones");
              }}
            >
              <div className="flex flex-col gap-2 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-[#1B3A6B]">
                  Bienvenida a Allgree
                </h1>
                <p className="text-sm text-slate-600">
                  Registrate o iniciá sesión para gestionar tus acuerdos
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="nombre"
                  className="text-sm font-medium text-slate-700"
                >
                  Nombre completo
                </label>
                <input
                  id="nombre"
                  type="text"
                  required
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="h-11 rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-[#1B3A6B]"
                  placeholder="Tu nombre y apellido"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-lg border border-slate-200 px-4 text-sm outline-none focus:border-[#1B3A6B]"
                  placeholder="tu@email.com"
                />
              </div>

              <button
                type="submit"
                className="flex h-11 items-center justify-center rounded-full bg-[#1B3A6B] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#142c52]"
              >
                Continuar con verificación de identidad
              </button>
            </form>
          )}

          {paso === "instrucciones" && (
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="text-6xl">📷</span>
              <h2 className="text-xl font-bold text-[#1B3A6B]">
                Verificación de identidad
              </h2>
              <p className="text-sm text-slate-600">
                Para registrarte necesitamos verificar tu identidad. Vamos a
                usar tu cámara para una selfie rápida.
              </p>
              <button
                type="button"
                onClick={activarCamara}
                className="mt-2 flex h-11 items-center justify-center rounded-full bg-[#1B3A6B] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#142c52]"
              >
                Activar cámara
              </button>
            </div>
          )}

          {paso === "camara" && (
            <div className="flex flex-col items-center gap-4 text-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="aspect-square w-full rounded-2xl bg-black object-cover"
              />
              <p className="text-sm text-slate-600">
                Mirá a la cámara y sonreí
              </p>
              <button
                type="button"
                onClick={tomarSelfie}
                className="flex h-11 items-center justify-center rounded-full bg-[#1B3A6B] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#142c52]"
              >
                Tomar selfie
              </button>
            </div>
          )}

          {paso === "camara-no-disponible" && (
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="text-6xl">📷</span>
              <p className="text-sm font-medium text-slate-600">
                Cámara no disponible
              </p>
              <button
                type="button"
                onClick={continuarSinVerificacion}
                className="flex h-11 items-center justify-center rounded-full bg-[#1B3A6B] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#142c52]"
              >
                Continuar sin verificación
              </button>
            </div>
          )}

          {paso === "procesando" && (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#1B3A6B]/20 border-t-[#1B3A6B]" />
              <p className="text-sm font-medium text-slate-600">
                Verificando identidad...
              </p>
            </div>
          )}

          {paso === "verificado" && (
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="text-6xl text-[#1D9E75]">✅</span>
              <h2 className="text-xl font-bold text-[#1B3A6B]">
                ¡Identidad verificada!
              </h2>
              <p className="text-sm text-slate-600">
                Bienvenida, {nombre || "usuaria"}
              </p>
              <Link
                href="/mis-acuerdos"
                className="mt-2 flex h-11 items-center justify-center rounded-full bg-[#1B3A6B] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#142c52]"
              >
                Ir a mis acuerdos
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
