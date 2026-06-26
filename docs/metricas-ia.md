# Métricas de Rendimiento de la IA — Allgree

**Proyecto:** Allgree — Plataforma de Acuerdos Extrajudiciales Inmutables
**Autora:** Abril Cortez — Lead Investigación + Documentación IA
**Modelo evaluado:** Llama 3.3 70B (vía Groq)
**Función evaluada:** generación automática de cláusulas legales

> **Cómo se hizo la evaluación:** se generaron cláusulas para 5 casos de uso
> representativos en la versión online de la app (allgree.vercel.app). Para cada
> caso se midió el tiempo de respuesta (F12 → pestaña Red → llamada
> `generar-clausulas`), la cantidad de cláusulas generadas, y se leyó el
> resultado para puntuar su calidad.

---

## 1. Rúbrica de calidad (escala 1 a 5)

| Puntaje | Significado |
|---|---|
| **5** | Cláusulas completas y correctas; cubren todo lo descripto, sin errores ni datos inventados. |
| **4** | Muy buenas; completas, con algún detalle menor mejorable. |
| **3** | Aceptables, pero falta alguna cláusula importante o algo queda poco claro. |
| **2** | Incompletas o con errores que habría que corregir antes de usar. |
| **1** | Malas: errores graves o cláusulas inventadas que no se pidieron. |

---

## 2. Resultados por caso

| # | Caso de uso | Tiempo (s) | N° de cláusulas | Calidad (1-5) | Observaciones |
|---|---|---|---|---|---|
| 1 | Préstamo de dinero entre amigos | 2,96 | 6 | 4 | Completa y clara, pero dejó el interés "a convenir" en vez de fijar el 5% indicado. |
| 2 | Trabajo freelance: diseño de logo | 2,17 | 6 | 5 | Capturó bien el monto ($80.000) y el plazo (7 días); agrega cláusula de daños y perjuicios. |
| 3 | Alquiler de una habitación | 2,17 | 5 | 5 | Bien el canon mensual, la forma y fecha de pago, y el desalojo por incumplimiento. |
| 4 | Préstamo de un objeto (notebook) | 1,77 | 6 | 5 | Adecuó el objeto: devolución en iguales condiciones salvo el desgaste normal. |
| 5 | Servicio de limpieza semanal | 1,70 | 6 | 5 | Capturó bien el monto por servicio y la periodicidad semanal. |

---

## 3. Promedios

- **Tiempo de respuesta promedio:** 2,15 segundos
- **Cantidad de cláusulas promedio:** 5,8
- **Calidad promedio:** 4,8 / 5
- **Caso más rápido / más lento:** 1,70 s / 2,96 s

> El rendimiento es consistente: todas las respuestas llegaron en menos de 3
> segundos y con una estructura legal completa (partes, objeto, obligaciones,
> incumplimiento, domicilio y jurisdicción).

---

## 4. Comparación con texto humano

Las cláusulas generadas por la IA son notablemente más completas de lo que
escribiría una persona sin formación legal. En los 5 casos, la IA incluyó por
su cuenta elementos que un usuario común difícilmente recordaría: la cláusula de
sometimiento a los Tribunales Ordinarios, la fijación de domicilios, el
tratamiento del incumplimiento y la referencia a la legislación argentina.

- **Completitud:** alta. Captura correctamente montos, plazos y forma de pago en
  la mayoría de los casos.
- **Claridad del lenguaje:** usa terminología legal adecuada y bien redactada.
- **Tiempo ahorrado:** una persona tardaría entre 30 y 60 minutos (y muchas veces
  no sabría qué cláusulas incluir); la IA lo resuelve en ~2 segundos.

**Límites detectados (importante para la honestidad del proyecto):**
1. Cuando el usuario especifica un dato puntual (ej. "interés del 5%"), la IA a
   veces lo deja "a convenir" en lugar de fijarlo. Conviene revisar siempre el
   resultado.
2. La IA completa con datos de ejemplo (DNI y domicilios) que no fueron provistos.
   En la versión productiva, esos datos deben venir del usuario verificado (KYC),
   no inventarse.
3. La IA redacta, pero no asesora legalmente: para casos complejos sigue siendo
   necesario un profesional.

---

## 5. Conclusión

En base a los 5 casos evaluados, la generación de cláusulas con IA demostró un
tiempo de respuesta promedio de **2,15 segundos** y una calidad promedio de
**4,8 / 5**, con una estructura legal completa y consistente en todos los casos.
Esto confirma que la herramienta es **rápida y confiable** para formalizar
acuerdos cotidianos simples. La principal recomendación de uso es **revisar el
resultado** antes de firmar, especialmente para confirmar que los datos
específicos (montos, intereses, plazos) quedaron correctamente reflejados.
