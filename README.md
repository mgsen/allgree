# ALLGREE — Plataforma de Acuerdos Extrajudiciales Inmutables

> Formalizá tus acuerdos. Simple, seguro e inmutable.

🌐 **Demo en vivo:** https://allgree.vercel.app  
📁 **Repositorio:** https://github.com/mgsen/allgree  
🎓 **Universidad Champagnat — Mendoza, Argentina — 2026**

---

## ¿Qué es Allgree?

Allgree permite que dos personas lleguen a un acuerdo extrajudicial por escrito, asistido por Inteligencia Artificial, firmado digitalmente y sellado con un hash criptográfico inmutable registrado en blockchain Stellar.

Reemplaza el apretón de manos informal con un documento con validez probatoria bajo el Código Civil y Comercial argentino, sin necesidad de escribano ni abogado para casos cotidianos.

---

## El problema

Millones de argentinos hacen acuerdos de palabra todos los días — préstamos entre amigos, trabajos freelance, alquileres informales. Cuando algo falla, no tienen ningún respaldo. Ir a un escribano o abogado tiene un costo prohibitivo para acuerdos menores.

**Allgree resuelve esto.**

---

## Marco legal validado

Consultado con abogadas especializadas en contratos digitales argentinos:

| Artículo | Descripción |
|---|---|
| Art. 957-959 CCyCN | Los contratos privados entre partes son válidos y vinculantes |
| Art. 284-288 CCyCN | El consentimiento puede manifestarse por medios electrónicos |
| Ley 25.506 | Firma Digital — los contratos digitales tienen el mismo estatus jurídico |
| Art. 1017 CCyCN | Límites: inmuebles y derechos reales requieren escritura pública |

---

## Demo en vivo

🌐 https://allgree.vercel.app

**Flujo completo:**
1. Completá los datos de ambas partes (nombre, DNI, domicilio, nacionalidad)
2. Describí el acuerdo en lenguaje natural
3. La IA genera cláusulas legales en ~3 segundos
4. Ambas partes firman digitalmente
5. El hash SHA-256 se registra en Stellar Testnet
6. Descargá el PDF con hash verificable

---

## Stack tecnológico

| Tecnología | Rol | Justificación de ingeniería |
|---|---|---|
| Next.js 16 + TypeScript | Frontend + API Routes | SSR híbrido, tipado estricto — Unidad I y II |
| Tailwind CSS | Estilos | Utility-first, consistencia visual |
| Groq API (llama-3.3-70b) | Generación de cláusulas IA | ~3s de respuesta, gratuito para MVP |
| Web Crypto API (SubtleCrypto) | Hash SHA-256 | Nativo del browser, sin dependencias — Unidad V |
| Stellar Testnet | Registro blockchain | Transacciones verificables, gas fee ~0.00001 XLM — Unidad V |
| jsPDF | Generación de PDF | Client-side, sin backend |
| localStorage | Persistencia MVP | Diseñado para migrar a PostgreSQL — Unidad IV |

---

## Contenidos de Teoría de la Computación II aplicados

| Unidad | Contenido | Aplicación en Allgree |
|---|---|---|
| I — Lenguajes | Paradigmas, binding, criterios de diseño | TypeScript: tipado estático, binding léxico, alcance estático |
| II — Sistemas de Tipos | Tipos estáticos, polimorfismo, encapsulamiento | Interfaces Acuerdo, Parte y Firma con strict mode |
| III — Compiladores | Análisis léxico, sintáctico, generación de código | Next.js + Turbopack: AST optimizado y bytecode en build |
| IV — Base de Datos | Modelo relacional, entidades, relaciones | Entidades Acuerdo-Parte-Firma diseñadas para PostgreSQL |
| V — Seguridad/Blockchain | Criptografía, blockchain, autenticación | SHA-256 + Stellar Testnet + KYC simulado por cámara |

---

## Equipo

| Integrante | Rol | GitHub |
|---|---|---|
| Morella Gallardo | Lead Developer & Blockchain | @mgsen |
| Abril Cortez | Lead IA & Investigación | @xabrilcortez |
| Guadalupe Montaña | Product Owner & Pitch | @guadalupe276 |

**2.º año — Licenciatura en Sistemas de Información**  
**Universidad Champagnat — Mendoza, Argentina**

---

## Próximos pasos

- [ ] KYC real con foto de DNI + selfie (Truora o MetaMap)
- [ ] Autenticación de usuarios con base de datos PostgreSQL
- [ ] Verificación de hash directamente contra Stellar sin depender de Allgree
- [ ] Integración con escribanos para certificación notarial premium
- [ ] Smart contracts en Solidity para automatizar condiciones

---

## Licencia

© 2026 Morella Gallardo, Abril Cortez y Guadalupe Montaña. Todos los derechos reservados.
Este proyecto es de uso académico. Queda prohibida su reproducción, distribución o uso comercial sin autorización expresa de las autoras.

---

## Hackathon 2026

**Pitch:** 25 de junio de 2026  
**Institución:** Universidad Champagnat — Mendoza, Argentina  
**Materia:** Teoría de la Computación II  
**Docentes:** Ing. Carolina Canessa, Lic. Elisa Galdame

---

*Allgree © 2026 — Mendoza, Argentina*
