# 🦉 Fake Duolingo

Tutor personal de inglés académico y preparación para **TOEFL iBT (formato 2026)**, **Cambridge C1 Advanced**, **Cambridge C2 Proficiency** e **IELTS Academic**. App de uso personal: sin anuncios, sin corazones, sin vidas, sin pagos, sin límites de sesión.

- **Android**: APK instalable (generado automáticamente por GitHub).
- **Laptop / tablet**: la misma app como aplicación web instalable (PWA) en GitHub Pages.
- **Offline-first**: todo funciona sin internet excepto la IA opcional.

> No está afiliada a Duolingo, ETS, Cambridge English ni IELTS. Las simulaciones usan material **original** con formatos basados en las descripciones públicas de cada examen; las puntuaciones son **estimaciones aproximadas**, no oficiales.

---

## Instalación paso a paso (sin terminal)

### 1. Crear el repositorio
1. Entra a <https://github.com> e inicia sesión (o crea una cuenta gratuita).
2. Arriba a la derecha: **+ → New repository**.
3. Nombre sugerido: `fake-duolingo` (o algo neutro como `strix-english`). Marca **Public** (necesario para GitHub Pages gratis). **No** marques "Add a README". Pulsa **Create repository**.

### 2. Subir los archivos (dos tandas, porque la web acepta máximo 100 archivos por vez)
En la página del repositorio vacío, pulsa el enlace **uploading an existing file**.

- **Tanda 1**: arrastra a la ventana las carpetas `src`, `scripts`, `keystore` y los archivos `package.json`, `capacitor.config.json`, `README.md`. Abajo pulsa **Commit changes**.
- **Tanda 2**: vuelve a **Add file → Upload files** y arrastra las carpetas `public` y `android-res`. **Commit changes**.

### 3. Activar GitHub Pages (para la versión de laptop/tablet)
**Settings → Pages → Build and deployment → Source: GitHub Actions**.

### 4. Crear el archivo que compila la app
1. En el repositorio: **Add file → Create new file**.
2. En el nombre escribe exactamente: `.github/workflows/build.yml` (al escribir las `/` se crean las carpetas).
3. Copia y pega el contenido del archivo `.github/workflows/build.yml` de esta carpeta (también está en `INSTALAR-workflow.txt`).
4. **Commit changes**. Esto inicia la compilación automáticamente.

### 5. Esperar la compilación (~8–12 minutos)
Pestaña **Actions**: verás "Construir app" en amarillo y luego verde ✓. Si sale en rojo, abre el registro y comparte el mensaje de error.

### 6. Instalar en el celular (Motorola Edge 50 Fusion / Android 16)
1. En el celular abre: `https://github.com/TU-USUARIO/fake-duolingo/releases/latest`
2. Descarga **FakeDuolingo.apk**.
3. Ábrelo. Android pedirá permitir "instalar apps desconocidas" para tu navegador o el gestor de archivos: actívalo solo para esa app.
4. Si Play Protect avisa que la app es desconocida: **Más detalles → Instalar de todas formas** (es tu propia app, sin publicar en Play Store).
5. La primera vez que uses Speaking, Android pedirá permiso de micrófono; para recordatorios, permiso de notificaciones.

**Voces sin internet (Listening):** Ajustes del teléfono → *Texto a voz* (o Accesibilidad → Texto a voz) → motor de Google → instala los datos de voz en inglés (EE. UU., Reino Unido, Australia, India). Así tendrás varios acentos offline.

### 7. Laptop y tablet
Abre `https://TU-USUARIO.github.io/fake-duolingo/` en Chrome o Edge y pulsa el ícono **Instalar** de la barra de direcciones (en Android/iPad: menú → *Añadir a pantalla de inicio*).

### Actualizaciones
Cada vez que subas archivos modificados al repositorio, GitHub genera un APK nuevo en **Releases**. Instálalo encima del anterior: **no se pierde el progreso** (la firma es siempre la misma).

### Pasar tu progreso entre dispositivos
Los datos viven en cada dispositivo (privacidad total). Usa **Ajustes → Datos → Exportar respaldo** y luego **Importar respaldo** en el otro dispositivo. Haz respaldos de vez en cuando.

---

## IA opcional y gratuita (Google Gemini)
La app funciona completa sin IA. Si quieres corrección profunda de writing/speaking, Professor Mode conversacional, roleplays del modo doctorado y ejercicios ilimitados:

1. Entra a <https://aistudio.google.com> con tu cuenta de Google → **Get API key → Create API key** (no pide tarjeta).
2. En la app: **Ajustes → IA opcional → pega la clave → Probar y guardar**.

Notas honestas: en el nivel gratuito Google puede usar lo que envías para mejorar sus productos y hay límites diarios. La clave se guarda solo en tu dispositivo.

---

## Qué incluye (v1)
| Módulo | Contenido |
|---|---|
| Diagnóstico inicial | Gramática/Use of English adaptativo, tamaño de vocabulario (palabras + pseudopalabras), vocabulario académico, reading, listening, bloque bajo presión, writing, speaking, pronunciación opcional, detección de cambios de respuesta. Perfil por habilidad con rangos (p. ej. B2+/C1) y verificación posterior de resultados extraños. |
| Motor adaptativo | Modelo tipo Rasch/Elo por habilidad (con y sin tiempo), estado por tema, repaso espaciado de temas y de vocabulario, clasificación de errores: *no lo sabía* vs. *lo sabía pero falló* (presión, sobreanálisis, distracción, lectura errónea, trampa conocida). |
| Gramática / Use of English | 32 lecciones (B2+ → C2): tense & aspect, articles, determiners, prepositions, modality, passive, reported speech, conditionals, inversion, relatives, participial clauses, complex NPs, coordination/subordination, embedding, nominalization, information structure, cohesion, punctuation, agreement, word order, complementation, hedging, stance, formal register, academic choices, KWT, word formation, collocations, phrasal verbs, idioms, open cloze, lexical nuance. Cada error explica **por qué** tu opción falla; ítems "¿gramatical?" vs. "¿apropiada en contexto académico?". |
| Academic English | 12 lecciones: hedging, reporting verbs, argumentation, paraphrase, summary, synthesis, methodology, results, limitations, (dis)agreement & politeness, precision/concision, academic emails. |
| Vocabulario | Diccionario offline de ~76 000 entradas (definiciones, IPA GB/US, frecuencia, CEFR aproximado, sinónimos, antónimos, familia léxica, equivalentes en español), 164 entradas curadas con colocaciones, ejemplos académicos, falsos amigos y errores frecuentes. **Add to Vocabulary** tocando cualquier palabra de cualquier texto. Dos tarjetas por palabra (reconocer / producir), estados New → Learning → Recognized → Familiar → Active → Mastered, retirar y recuperar, filtros por categoría y "Words I should probably know". |
| Reading | 12 textos originales (lingüística, fonología, arqueología, astronomía, psicología, economía, geología, biología, historia, medicina, literatura, tecnología) con 97 preguntas etiquetadas por tipo y por trampa, y modo **Read like a researcher** (claims, evidencia, hedging, contraargumentos, limitaciones, postura). |
| Listening | Clases, conversaciones, seminario, entrevista, anuncios, podcast, choose-a-response; voces en varios acentos; velocidad 0.75x–2x; solo audio / audio + transcript / transcript + explicación (las ayudas desaparecen en simulaciones). |
| Writing (prioridad) | 27 tareas (párrafos, síntesis, crítica, abstract, literature review, methodology, discussion, research proposal, emails académicos, tareas de TOEFL, IELTS, C1 y C2). Ciclo **diagnóstico → reescritura → alternativas**: primero ves el problema y por qué, luego intentas de nuevo, al final ves alternativas. Analizador offline con ~45 reglas de errores típicos (incluidos calcos del español), métricas de cohesión, hedging, registro, nominalización, diversidad léxica. |
| Speaking | 23 tareas (académicas, doctorado, examen, Listen & Repeat); transcripción en vivo o grabación; métricas de fluidez, pausas, muletillas, variedad léxica; no penaliza el acento (mide inteligibilidad). |
| Pronunciación | Módulo opcional (desactivado por defecto en sesiones): inteligibilidad, vocales, consonantes, acento de palabra, ritmo y formas débiles, entonación, habla conectada. |
| Modo Doctorado | 12 escenarios: supervisor, defensa metodológica, seminario, preguntas en congresos, respuesta a revisores, viva, networking… con roleplay por IA opcional. |
| Estrategia de examen | Lecciones sobre distractores, "posible ≠ correcto", gramática vs. significado, inferencia vs. especulación, sobreanálisis (con lo que dice la investigación), tiempos, trampas de listening; estadísticas personales de cambios correcto→incorrecto, trampas que más te engañan y brecha de rendimiento con reloj; entrenamiento de primera respuesta. |
| Simulaciones | TOEFL iBT 2026 (Reading multietapa adaptativo, Listening, Writing, Speaking), C1 Advanced (8 + 2 + 4 + 4 partes), C2 Proficiency (7 + 2 + 4 + 3 partes), IELTS Academic (40 + 40 preguntas, 2 tareas de writing, 3 partes de speaking). Temporizador por sección, diccionario y transcript bloqueados, audio sin pausa (dos escuchas en Cambridge, una en IELTS/TOEFL), estimación de puntaje y análisis por parte. |
| Gamificación | XP, niveles con títulos, 30 logros, misiones semanales y reto diario **opcionales**, racha solo informativa, desbloqueos cosméticos del búho. Nada bloquea el estudio. |
| Strix (el búho) | Búho villano, sarcástico y diva; reacciona a tu desempeño, se burla de errores básicos, se pone serio cuando sobreanalizas, te consuela en malas sesiones y te enseña palabras en sus comentarios. Sarcasmo y groserías ocasionales configurables. |
| Otros | Sesiones por tiempo (5, 10, 20, 30, 60 min o sin límite), 5 niveles de dificultad que cambian parámetros reales, dashboard con gráficas, recordatorios configurables, audio por canales, interfaz en español con opción de inglés, respaldo/restauración. |

## Limitaciones honestas
- El banco de contenido es amplio pero **finito**; con la clave gratuita de Gemini puedes generar ejercicios y lecturas nuevas a tu nivel.
- La evaluación **automática** de writing y speaking (sin IA) mide rasgos observables (errores típicos, cohesión, léxico, fluidez) y tiene confianza baja; por eso se combina con autoevaluación y, si quieres, con IA.
- El audio de Listening se genera con las voces del sistema (texto a voz): claro y con varios acentos, pero sin titubeos ni solapamientos del habla real.
- Las equivalencias con escalas de examen son aproximadas.

## Estructura del código (para futuras versiones)
```
src/
  content/        contenido (lecciones, lecturas, audios, tareas, simulaciones, vocabulario)
  engine/         modelo adaptativo, SRS, sesiones, análisis de texto, gamificación, puntajes
  services/       diccionario, voz (TTS/ASR), IA opcional, notificaciones, sonido
  components/     vistas de ejercicios, lectores, writing, speaking, búho
  pages/          pantallas
scripts/          compilación web, diccionario, recursos Android
public/dict/      diccionario offline (JSON por letra)
.github/workflows compilación automática del APK y publicación web
```
Tecnología: React + TypeScript (compilado con esbuild), IndexedDB, Capacitor 7 para Android, PWA para web.

## Créditos de datos
- **Open English WordNet** (CC BY 4.0), derivado de **Princeton WordNet** (licencia WordNet).
- **CMU Pronouncing Dictionary** (licencia BSD).
- **wordfreq** de Robyn Speer (datos CC BY-SA 4.0).
- **Multilingual Central Repository 3.0** vía Open Multilingual Wordnet (CC BY 3.0) — equivalentes en español.
