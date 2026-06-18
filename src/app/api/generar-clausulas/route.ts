import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Groq();

const SYSTEM_PROMPT = `Sos un asistente que redacta cláusulas para acuerdos extrajudiciales en español.
A partir de los datos del proponente, el aceptante y la descripción del acuerdo que te da el usuario, generá entre 4 y 6 cláusulas legales claras y concretas que reflejen ese acuerdo.
Cada cláusula es un string independiente del array de salida, sin numeración (la numeración se agrega en la interfaz).
Basate estrictamente en lo que describe el usuario, sin inventar condiciones, montos o plazos adicionales que no haya mencionado.
Usá un lenguaje formal pero entendible para alguien sin formación legal, evitando jerga innecesaria.
Respondé únicamente con un objeto JSON válido con la forma {"clausulas": ["...", "..."]}, sin texto adicional antes ni después.`;

interface Persona {
  nombre?: string;
  email?: string;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const descripcion: string | undefined = body?.descripcion;
  const proponente: Persona = body?.proponente ?? {};
  const aceptante: Persona = body?.aceptante ?? {};

  if (!descripcion || !descripcion.trim()) {
    return NextResponse.json(
      { error: "descripcion es requerida" },
      { status: 400 },
    );
  }

  const userContent = `Proponente: ${proponente.nombre || "(sin nombre)"} (${proponente.email || "sin email"})
Aceptante: ${aceptante.nombre || "(sin nombre)"} (${aceptante.email || "sin email"})

Descripción del acuerdo:
${descripcion}`;

  try {
    const response = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 2048,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "Respuesta inesperada de la IA" },
        { status: 502 },
      );
    }

    const parsed = JSON.parse(content) as { clausulas: string[] };
    return NextResponse.json({ clausulas: parsed.clausulas });
  } catch (error) {
    console.error("Error generando cláusulas:", error);
    return NextResponse.json(
      { error: "No se pudieron generar las cláusulas" },
      { status: 500 },
    );
  }
}
