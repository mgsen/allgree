# Métricas de Rendimiento de la IA — Allgree

**Proyecto:** Allgree — Plataforma de Acuerdos Extrajudiciales Inmutables
**Autora:** Abril Cortez — Lead Investigación + Documentación IA
**Modelo evaluado:** Llama 3.3 70B (vía Groq)
**Función evaluada:** generación automática de cláusulas legales

> **Cómo se completó esta evaluación:** se generaron cláusulas para 10 casos de
> uso distintos. Para cada caso se midió el tiempo de respuesta, la cantidad de
> cláusulas generadas y su calidad. El tiempo se midió con las herramientas de
> desarrollador del navegador (F12 → pestaña Red → llamada `generar-clausulas`).

---

## 1. Cómo medir el tiempo de respuesta (paso a paso)

1. Con la app corriendo (`npm run dev`), abrir el navegador en la página `/crear`.
2. Apretar **F12** para abrir las herramientas de desarrollador.
3. Ir a la pestaña **Red** (o **Network**).
4. Completar el formulario y apretar **"Generar cláusulas con IA"**.
5. En la lista de la pestaña Red, buscar la llamada **`generar-clausulas`** y
   leer la columna de **tiempo** (en milisegundos). Dividir por 1000 para pasarlo
   a segundos (ej: 2.800 ms = 2,8 s).

---

## 2. Rúbrica de calidad (escala 1 a 5)

Para puntuar cada caso de forma pareja, usar este criterio:

| Puntaje | Significado |
|---|---|
| **5** | Cláusulas completas y correctas; cubren todo lo descripto, sin errores ni datos inventados. |
| **4** | Muy buenas; completas, con algún detalle menor mejorable. |
| **3** | Aceptables, pero falta alguna cláusula importante o algo queda poco claro. |
| **2** | Incompletas o con errores que habría que corregir antes de usar. |
| **1** | Malas: errores graves o cláusulas inventadas que no se pidieron. |

---

## 3. Tabla de resultados (completar durante la sesión)

| # | Caso de uso | Tiempo (s) | N° de cláusulas | Calidad (1-5) | Observaciones |
|---|---|---|---|---|---|
| 1 | Préstamo de dinero entre amigos ($500.000 a 30 días con interés) | | | | |
| 2 | Trabajo freelance: diseño de logo ($80.000, entrega en 1 semana) | | | | |
| 3 | Alquiler de una habitación ($150.000 por mes) | | | | |
| 4 | Préstamo de un objeto (una notebook por 2 meses) | | | | |
| 5 | Servicio de limpieza semanal ($20.000 por vez) | | | | |
| 6 | Venta de un celular usado en cuotas | | | | |
| 7 | Acuerdo de pago de una deuda vieja en 3 partes | | | | |
| 8 | Cuidado de mascotas durante vacaciones | | | | |
| 9 | Clases particulares de matemática ($10.000 la hora) | | | | |
| 10 | Devolución de dinero compartido en un viaje | | | | |

---

## 4. Promedios (calcular al terminar la tabla)

- **Tiempo de respuesta promedio:** ______ segundos
  *(sumar los 10 tiempos y dividir por 10)*
- **Cantidad de cláusulas promedio:** ______
- **Calidad promedio:** ______ / 5
- **Caso más rápido / más lento:** ______ s / ______ s

---

## 5. Comparación con texto humano

Para esta parte, elegir **1 o 2 casos** de la tabla y comparar las cláusulas que
generó la IA con lo que escribiría una persona (o una plantilla de contrato
tradicional). Comentar en un párrafo corto:

- **Completitud:** ¿la IA incluyó todo lo importante (montos, plazos, partes,
  forma de pago)?
- **Claridad del lenguaje:** ¿se entiende? ¿usa términos legales adecuados?
- **Tiempo ahorrado:** una persona sin conocimientos legales tardaría
  ~30-60 minutos (y muchas veces no sabría qué poner); la IA lo resuelve en
  segundos.
- **Límite:** la IA redacta, pero no asesora legalmente — para casos complejos
  sigue haciendo falta un profesional.

> *(Acá va el párrafo de comparación, escrito después de ver los resultados.)*

---

## 6. Conclusión (completar al final)

En base a los 10 casos evaluados, la generación de cláusulas con IA demostró un
tiempo de respuesta promedio de ______ segundos y una calidad promedio de ______/5,
lo que confirma que la herramienta es **rápida y confiable** para acuerdos
cotidianos simples. *(Ampliar con 1-2 frases según los resultados reales.)*
