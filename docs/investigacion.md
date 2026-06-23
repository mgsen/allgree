# Investigación: Validación del Problema

**Proyecto:** Allgree — Plataforma de Acuerdos Extrajudiciales Inmutables
**Autora:** Abril Cortez — Lead Investigación + Documentación IA
**Equipo:** Morella Gallardo, Abril Cortez, Guadalupe Montaña
**Universidad:** Champagnat — Licenciatura en Sistemas de Información
**Fecha:** Junio 2026

---

## 1. El problema que resolvemos

Millones de argentinos cierran acuerdos económicos todos los días sin ningún
respaldo formal: un préstamo entre amigos, un trabajo freelance acordado por
WhatsApp, un alquiler de palabra, una changa, un servicio doméstico sin recibo.

Cuando una de las partes incumple, la otra casi nunca tiene cómo probar qué se
había acordado. Las opciones actuales son caras (escribano, abogado) o no tienen
ningún valor (un chat, un papel firmado a mano que puede modificarse).

**Allgree vive exactamente en ese vacío:** permite generar, firmar y sellar
criptográficamente un acuerdo simple, en minutos y sin intermediarios.

---

## 2. El problema en números

### 2.1 La informalidad económica es masiva

Según el **INDEC** (Encuesta Permanente de Hogares, 4° trimestre de 2025):

- Alrededor del **43% de los trabajadores ocupados** se desempeña en la
  informalidad: sin aportes, sin obra social y sin los derechos del empleo
  registrado. Esto representa **más de 5,8 millones de personas** solo en los
  31 aglomerados urbanos relevados.
- Entre quienes trabajan **por cuenta propia**, el **63,3%** opera fuera del
  marco legal.
- Hay sectores donde la informalidad es la regla:
  - **Servicio doméstico: 78%**
  - **Construcción: 73,8%**
  - **Hoteles y restaurantes: 59,7%**
  - **Comercio: 52,6%**

> **Por qué nos importa:** cada uno de estos trabajadores cierra acuerdos de
> palabra de forma constante. Es el universo natural de usuarios de Allgree.

### 2.2 Los préstamos entre conocidos son enormes

Un estudio basado en datos del **Banco Central (BCRA)** y la EPH mostró que:

- En **2025, los préstamos entre conocidos explicaban el 35,4% de toda la deuda
  no bancaria** de los hogares argentinos.
- En **2023, el 82,6% de los hogares** tenía algún tipo de deuda no bancaria
  (financiamiento informal, préstamos entre particulares, fiado, etc.).

> **Por qué nos importa:** "prestarle plata a un conocido" no es un caso
> marginal: es el corazón del financiamiento informal en Argentina. Es
> exactamente el ejemplo que usamos en la demo de Allgree.

### 2.3 Cómo se resuelven hoy los conflictos

Cuando hay un conflicto entre particulares (cobro de deudas, contratos,
daños), la vía actual es la **mediación prejudicial**:

- En la provincia de Entre Ríos, entre enero de 2024 y mayo de 2025 se
  gestionaron **más de 16.000 mediaciones prejudiciales**, y **más del 80% se
  resolvió sin llegar a juicio**.
- El **acta de acuerdo** que surge de una mediación **tiene valor contractual y
  puede ejecutarse judicialmente** (Ley 26.589 de Mediación).

> **Por qué nos importa (doble lectura):**
> 1. Hay un volumen gigante de conflictos entre particulares que hoy terminan
>    en mediación o juicio.
> 2. Valida que la vía **extrajudicial** funciona: un acuerdo bien documentado
>    evita el juicio. Allgree busca generar ese documento *antes* de que haya
>    conflicto.

---

## 3. Marco legal que respalda a Allgree

(Basado en la consulta con la abogada y escribana Virginia Ranea)

- Un **contrato privado entre partes es válido en Argentina** sin necesidad de
  escribano. El Código Civil y Comercial establece que el contrato "es ley para
  las partes" (Arts. 957 a 959 CCyC).
- El valor de Allgree es **probatorio**: cuanto mejor documentado y más difícil
  de alterar sea el acuerdo, más fuerza tiene como prueba ante un conflicto.
- El **hash SHA-256 + registro en blockchain** aporta justamente eso: una huella
  digital que prueba que el documento existía en una fecha y no fue modificado.

---

## 4. El mercado que atiende Allgree

| Caso de uso | Ejemplo concreto | Hoy se resuelve con... |
|---|---|---|
| Préstamo entre conocidos | "Te presto $500.000, me los devolvés en 30 días" | Nada / un chat |
| Trabajo freelance | Diseño de un logo, un trabajo por encargo, un arreglo | WhatsApp |
| Alquiler informal | Un cuarto, una pieza, un monoambiente sin inmobiliaria | Acuerdo de palabra |
| Servicios | Limpieza, cuidado de personas, fletes | Confianza |

En todos estos casos, las partes **no van a contratar un abogado** por el monto
o la informalidad de la relación, pero **sí necesitan un respaldo**. Ese es el
espacio que ninguna solución actual cubre bien.

---

## 5. Fuentes

1. INDEC — *Mercado de trabajo. Indicadores de informalidad laboral (EPH), 4°
   trimestre 2025.*
   https://www.indec.gob.ar/uploads/informesdeprensa/informalidad_laboral_eph_04_26798CEA49F8.pdf
2. Infobae — *Bajó la informalidad laboral en el cierre de 2025: sectores más
   afectados* (abril 2026).
   https://www.infobae.com/economia/2026/04/13/bajo-la-informalidad-laboral-en-el-cierre-de-2025/
3. Infobae — *Radiografía de la deuda de los argentinos* (abril 2026).
   https://www.infobae.com/opinion/2026/04/12/radiografia-de-la-deuda-de-los-argentinos/
4. Justicia.ar — *Más del 80% de los conflictos iniciados con mediación se
   resuelven sin juicio* (agosto 2025).
   https://justicia.ar/novedades/1290/2025/08/mas-del-80-de-los-conflictos-iniciados-con-mediacion-se-resuelven-sin-juicio
5. Ley 26.589 — Mediación y Conciliación (Argentina).
6. Código Civil y Comercial de la Nación, Arts. 957–959 (fuerza obligatoria de
   los contratos).
