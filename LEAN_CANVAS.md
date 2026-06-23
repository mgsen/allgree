# Lean Canvas — Allgree

**Proyecto:** Allgree — Plataforma de Acuerdos Extrajudiciales Inmutables
**Equipo:** Morella Gallardo, Abril Cortez, Guadalupe Montaña
**Universidad:** Champagnat — Licenciatura en Sistemas de Información
**Tagline:** *Formalizá tus acuerdos. Simple, seguro e inmutable.*

> **Mirada de impacto social:** Allgree democratiza el acceso a un respaldo legal
> que hoy está reservado a quien puede pagar un escribano o un abogado. Le da a
> la persona común una herramienta para protegerse en los acuerdos económicos de
> todos los días.

---

## 1. Problema

Los tres problemas principales que resolvemos:

1. **Los acuerdos de palabra no se pueden probar.** Cuando alguien presta plata,
   contrata un freelance o alquila de palabra y la otra parte incumple, no hay
   forma de demostrar qué se había acordado.
2. **Redactar un contrato es difícil y caro.** La persona común no sabe cómo
   escribir cláusulas legales, y pagar un abogado por un acuerdo chico no tiene
   sentido económico.
3. **Un documento se puede alterar.** Un papel o un Word firmado puede
   modificarse después, y no hay forma de probar cuál era la versión original.

**Alternativas que existen hoy:**
- Acuerdo verbal o por WhatsApp → sin valor probatorio sólido.
- Papel firmado a mano → fácil de modificar o perder.
- Escribano / abogado → válido pero caro y lento para montos chicos.

---

## 2. Segmentos de clientes

**Usuarios objetivo:**
- Personas que prestan o piden dinero a conocidos (familia, amigos).
- Freelancers y trabajadores independientes que acuerdan trabajos sin contrato.
- Inquilinos y propietarios de alquileres informales.
- Monotributistas y microempresas que cierran acuerdos simples.

**Early adopters (primeros usuarios a conquistar):**
- Jóvenes freelancers digitales, ya acostumbrados a usar apps y fintech, que
  necesitan respaldar trabajos con clientes y aún no pueden pagar un abogado.

> **Contexto del mercado (ver `docs/investigacion.md`):** alrededor del 43% de
> los trabajadores en Argentina están en la informalidad, y los préstamos entre
> conocidos explican el 35,4% de la deuda no bancaria. El segmento es enorme.

---

## 3. Propuesta de valor única

**Un acuerdo con respaldo legal en minutos, sin abogado y sin escribano.**

Allgree convierte una explicación en lenguaje común ("le presto $500 a Juan, me
los devuelve en 30 días") en un acuerdo con cláusulas claras, firmado por ambas
partes y sellado de forma imposible de alterar.

---

## 4. Solución

Para cada problema, una pieza de la solución:

1. **IA que redacta las cláusulas** → la persona describe el acuerdo en sus
   palabras y la IA genera cláusulas legales claras y numeradas.
2. **Firma digital de ambas partes** → cada parte firma con registro de fecha y
   hora.
3. **Sellado criptográfico (hash SHA-256 + blockchain)** → se calcula una huella
   digital única del acuerdo y se registra en la blockchain (Stellar), probando
   que el documento existió en esa fecha y no fue modificado.
4. **PDF descargable + verificador público** → el acuerdo queda en un PDF
   profesional, y cualquiera puede verificar su autenticidad ingresando el hash.

---

## 5. Canales

- **Aplicación web** (allgree.vercel.app), accesible desde cualquier celular.
- **Redes sociales** (Instagram, TikTok) mostrando casos reales y cotidianos:
  "cómo dejar por escrito un préstamo a un amigo".
- **Alianzas** con comunidades de freelancers, espacios de coworking y cámaras
  de microempresas.
- **Boca a boca y referidos**: cada acuerdo involucra a dos personas, lo que
  hace que el producto se difunda solo entre las partes.

---

## 6. Flujos de ingreso

- **Modelo freemium:** crear y generar cláusulas es gratis; se cobra un
  micro-pago por **sellar y registrar** el acuerdo en blockchain.
- **Suscripción** para usuarios frecuentes (freelancers, microempresas) con
  acuerdos ilimitados.
- **Servicio premium:** para casos complejos o conflictivos, derivación a un
  profesional o certificación notarial del acuerdo (alianza con abogados y
  escribanos).

---

## 7. Estructura de costos

**Costos bajos y escalables** (clave del modelo):
- Hosting y dominio (Vercel) → bajo / gratuito en etapa inicial.
- API de IA (Groq) → muy bajo costo por acuerdo generado.
- Registro en blockchain (Stellar) → fracciones de centavo por transacción.
- Desarrollo y mantenimiento → principal costo en etapa inicial (el equipo).
- A futuro: proveedor de KYC (verificación de identidad) → costo variable por
  verificación.

---

## 8. Métricas clave

- **Acuerdos creados** por mes.
- **Tasa de conversión:** creados → firmados por ambas partes → sellados.
- **Usuarios activos** mensuales.
- **Acuerdos sellados en blockchain** (uso real de la función central).
- **Uso del verificador** (cuántos acuerdos se verifican).
- **Retención:** cuántos usuarios vuelven a crear un segundo acuerdo.

---

## 9. Ventaja especial (difícil de copiar)

- **Combinación única para este segmento:** IA + criptografía + blockchain
  puesta al servicio de la persona común. Las soluciones legales actuales son
  caras y los chats no tienen validez; nadie ocupa bien ese espacio del medio.
- **Validación legal real:** el producto fue revisado con una abogada y escribana,
  y se apoya en el marco del Código Civil argentino (un contrato privado es
  válido entre las partes).
- **Efecto de red y confianza:** a medida que crece la base de acuerdos
  verificables, Allgree se vuelve un estándar de confianza difícil de replicar
  para un competidor nuevo.

---

## Impacto social (síntesis)

Allgree no reemplaza a la justicia ni a los profesionales: **previene
conflictos** dándole a la gente común una forma accesible de dejar las cosas por
escrito antes de que haya un problema. Protege especialmente a quienes hoy
quedan más desprotegidos en la economía informal: trabajadores sin contrato,
inquilinos informales y personas que prestan dinero por confianza.
