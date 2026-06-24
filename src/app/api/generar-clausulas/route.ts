import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Groq();

const SYSTEM_PROMPT = `Sos un asistente legal especializado en redactar acuerdos extrajudiciales válidos bajo el Código Civil y Comercial de la Nación Argentina (CCyCN).

A partir de los datos del proponente, el aceptante y la descripción del acuerdo, generá entre 5 y 7 cláusulas legales claras, concretas y válidas bajo la ley argentina.

REGLAS OBLIGATORIAS:

1. IDENTIFICACIÓN DE PARTES: En la primera cláusula identificá completamente a cada parte con nombre completo y DNI. Ejemplo: "El Sr. Juan Pérez, DNI 12345678, en adelante 'el Prestamista'..."

2. OBJETO DEL CONTRATO: La segunda cláusula debe describir claramente el objeto — qué se acuerda, qué se obliga cada parte.

3. CONDICIONES ESPECÍFICAS: Incluí todas las condiciones mencionadas por el usuario — montos, plazos, intereses, formas de pago — sin inventar nada que no se haya mencionado.

4. INCUMPLIMIENTO: Siempre incluí una cláusula que establezca qué sucede si alguna de las partes no cumple con lo acordado.

5. DOMICILIO Y JURISDICCIÓN: Incluí una cláusula donde las partes fijan domicilio y se someten a los Tribunales Ordinarios de la Ciudad de Mendoza, Provincia de Mendoza, República Argentina.

6. LIMITACIONES: Este sistema NO genera cláusulas para: compraventa de inmuebles, derechos reales, actos de derecho de familia ni testamentos (Art. 1017 CCyCN). Si el usuario describe alguno de estos casos, generá una sola cláusula indicando que ese tipo de acuerdo requiere escritura pública ante escribano.

7. LENGUAJE: Usá lenguaje jurídico formal pero comprensible. Evitá jerga innecesaria. Cada cláusula debe ser un párrafo completo y autónomo.

8. FORMATO: Cada cláusula es un string independiente del array de salida, sin numeración. Respondé únicamente con un objeto JSON válido con la forma {"clausulas": ["...", "..."]}, sin texto adicional antes ni después.`;

interface Persona {
  nombre?: string;
  email?: string;
  dni?: string;
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

  const userContent = `Proponente: ${proponente.nombre || "(sin nombre)"} (${proponente.email || "sin email"}), DNI ${proponente.dni || "(sin DNI)"}
Aceptante: ${aceptante.nombre || "(sin nombre)"} (${aceptante.email || "sin email"}), DNI ${aceptante.dni || "(sin DNI)"}

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
