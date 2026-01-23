# Sistema de Diseño Torus AC v1.0
Este documento define los estilos visuales actuales de la aplicación para asegurar consistencia entre Diseño (Figma/Sketch) y Desarrollo.

---

## 🎨 Paleta de Colores

Basada en un estilo "Apple/Nike Minimalist" con acentos naturales.

### Colores Principales (Fondos y Bases)
| Nombre Token | Hex | Uso |
| :--- | :--- | :--- |
| **Blanco Puro** | `#FFFFFF` | Fondo principal, Tarjetas, Modales |
| **Gris Apple** | `#F5F5F7` | Fondo secundario, secciones alternas (bg-tertiary) |
| **Gris Borde** | `#D2D2D7` | Líneas divisorias, bordes de inputs sutiles |

### Acentos de Marca (Brand Colors)
| Nombre Token | Hex | Uso |
| :--- | :--- | :--- |
| **Verde Torus** | `#34C759` | Botones primarios, iconos activos, "éxito" |
| **Verde Hover** | `#30D158` | Estado hover de botones primarios |
| **Verde Profundo** | `#047857` | (Tailwind `emerald-700`) Textos de marca, degradados |
| **Rojo Alerta** | `#FF3B30` | Errores, botones destructivos, cancelar |

### Tipografía y Textos
| Nombre Token | Hex | Uso |
| :--- | :--- | :--- |
| **Negro Apple** | `#1D1D1F` | Títulos, texto principal (Alto contraste) |
| **Gris Texto** | `#424245` | Párrafos secundarios |
| **Gris Muted** | `#86868B` | Placeholders, leyendas, metadatos |

---

## 🔠 Tipografía

**Fuente Principal:** `Inter` (Google Fonts)
Fallback: Sans-serif del sistema (SF Pro en Mac, Roboto en Android).

### Escala Tipográfica
*   **H1 (Héroe):** `text-5xl` a `text-7xl` | **Bold / ExtraBold**
*   **H2 (Títulos Sección):** `text-3xl` a `text-4xl` | **Bold**
*   **H3 (Subtítulos):** `text-xl` a `text-2xl` | **SemiBold**
*   **Cuerpo (Body):** `text-base` (16px) | **Regular**
*   **Botones:** `text-sm` o `text-base` | **Medium**

---

## 🧩 Componentes Base

### Botones (Buttons)
*   **Radio (Border Radius):** `rounded-full` (Píldora completa)
*   **Sombra:** `shadow-lg` suave, aumenta a `shadow-xl` en hover.
*   **Padding:** Generoso (`px-6 py-3` estándar).
*   **Transición:** `transition-all duration-300` (Suave).

### Tarjetas (Cards)
*   **Fondo:** `#FFFFFF` (Blanco) o `#FFFFFF/10` (Glassmorphism en fondos oscuros).
*   **Borde:** `border border-gray-100` (Muy sutil).
*   **Radio:** `rounded-2xl` (Bordes muy redondeados, 16px).
*   **Sombra:** `shadow-sm` en reposo, `shadow-md` en hover.

### Inputs (Formularios)
*   **Fondo:** `#F5F5F7` (Gris Apple) o Blanco con borde borde.
*   **Radio:** `rounded-md` o `rounded-lg`.
*   **Focus:** Anillo de color `#34C759` (Verde Torus).

---

## ✨ Efectos Especiales

### Glassmorphism (Vidrio)
Usado en Navbar y Tarjetas flotantes sobre video.
*   `bg-white/90` o `bg-black/10`
*   `backdrop-blur-md` (Desenfoque de fondo)

### Degradados (Gradients)
*   **Hero:** `from-emerald-600 to-teal-500` (Para textos con `bg-clip-text`).
*   **Fondos sutiles:** `from-emerald-50 to-teal-100`.
