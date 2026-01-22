# 📊 Análisis: Plantilla HTML vs Formulario Tour Personalizado

**Fecha:** 2025-11-02
**Plantilla:** `plantilla-cotizacion-personalizada.html`
**Formulario:** `formulario-tour-personalizado.html`

---

## ✅ CAMPOS QUE COINCIDEN (9 campos)

Estos campos ya están en el formulario y coinciden con la plantilla:

| Variable Plantilla | Campo Formulario | Estado |
|-------------------|------------------|--------|
| `NOMBRE_CLIENTE` | `nombre_cliente` | ✅ Perfecto |
| `NUMERO_PERSONAS` | `numero_personas` | ✅ Perfecto |
| `TIPO_HABITACION` | `tipo_habitacion` | ✅ Perfecto |
| `observaciones` | `observaciones` | ✅ Perfecto |
| `PRECIO_POR_PERSONA` | `precio_por_persona` | ✅ Perfecto (nuevo) |
| `PRECIO_TOTAL` | `precio_total` | ✅ Perfecto |
| `FECHA_INICIO` | `fecha_inicio` | ✅ Perfecto |
| `ADELANTO_RESERVA` | `adelanto_pagado` | ⚠️ Mapear |
| `TELEFONO_CLIENTE` | `telefono` | ⚠️ Mapear |

---

## ❌ CAMPOS FALTANTES EN EL FORMULARIO (13 campos)

Estos campos los necesita la plantilla pero **NO están** en el formulario:

### **📋 Datos del Programa:**
1. **`NOMBRE_PROGRAMA`** - Nombre/título del programa
   - Ejemplo: "Cusco Clásico + Machu Picchu"
   - **Solución:** Generar automáticamente desde actividades seleccionadas

2. **`DURACION_PROGRAMA`** - Duración total
   - Ejemplo: "5 días / 4 noches"
   - **Solución:** Calcular desde itinerario

### **👨‍💼 Datos del Asesor:**
3. **`NOMBRE_ASESOR`** - Nombre del asesor de viajes
4. **`EMAIL_ASESOR`** - Email del asesor
   - **Solución:** Agregar campos en el formulario

### **🚂 Datos del Tren:**
5. **`TIPO_TREN`** - Tipo de tren seleccionado
   - Ejemplo: "Expedition (Local)" o "Vistadome (Turístico)"
   - **Solución:** Ya existe `tipo_transporte`, necesita mapeo

6. **`PRECIO_TREN`** - Precio del tren
   - **Solución:** Ya existe `precio_total_tren`, necesita mapeo

### **📅 Fechas:**
7. **`FECHA_FIN`** - Fecha de finalización
   - **Solución:** Calcular desde fecha_inicio + duración

### **💰 Financiero:**
8. **`SALDO_PENDIENTE`** - Saldo restante a pagar
   - Fórmula: `PRECIO_TOTAL - ADELANTO_RESERVA`
   - **Solución:** Calcular automáticamente

### **🖼️ Imágenes (7 campos):**
9. **`IMAGEN_LOGO`** - Logo de ORES Travel
10. **`IMAGEN_CIRCUITO_1`** - Imagen del circuito 1
11. **`IMAGEN_CIRCUITO_2`** - Imagen del circuito 2
12. **`IMAGEN_CIRCUITO_3`** - Imagen del circuito 3
13. **`IMAGEN_HOTELES`** - Imagen de hoteles
14. **`IMAGEN_CUENTA_BANCARIA`** - Imagen con datos bancarios
15. **`IMAGEN_TOUR_ADICIONAL_1`** - Tour adicional 1
16. **`IMAGEN_TOUR_ADICIONAL_2`** - Tour adicional 2

**Solución:** Imágenes estáticas configuradas en el backend/n8n

### **📄 Textos Fijos (5 campos):**
17. **`PROGRAMA_INCLUYE`** - Texto HTML de lo que incluye
18. **`PROGRAMA_NO_INCLUYE`** - Texto HTML de lo que NO incluye
19. **`SUGERENCIAS_GENERALES`** - Sugerencias generales HTML
20. **`SUGERENCIAS_CAMINATAS`** - Sugerencias para caminatas HTML
21. **`INFO_TREN_LOCAL`** - Información sobre tren local HTML
22. **`INFO_HOTELES`** - Información sobre hoteles HTML

**Solución:** Textos estáticos almacenados en el backend/n8n

### **🗓️ Estructura Compleja:**
23. **`json_estructura.actividades.tarjetas`** - Array de actividades con:
   - `titulo_dia` (ej: "DÍA 1")
   - `fecha_dia` (ej: "Lunes 15 de Enero, 2025")
   - `descripcion` (HTML con itinerario del día)
   - `imagen` (URL de imagen de la actividad)

**Solución:** Generar desde el itinerario del formulario

---

## 🔄 CAMPOS DEL FORMULARIO NO USADOS EN PLANTILLA

Estos campos están en el formulario pero NO aparecen en la plantilla:

1. **`actividad_inicial`** - Primera actividad del tour
2. **`personas_tren`** - Cantidad de personas en el tren
3. **`hora_tren`** - Hora del tren
4. **`fecha_tren`** - Fecha específica del tren
5. **`categoria_hotel`** - Categoría del hotel (2/3/4/5 estrellas)
6. **`modalidad_precio`** - Modalidad de precio (paquete/individual)
7. **`noches_por_dia`** - Configuración de noches por día

**Recomendación:** Evaluar si estos datos deberían aparecer en la plantilla

---

## 🎯 PLAN DE ACCIÓN

### **FASE 1: Campos Simples (2-3 horas)**

**1. Agregar campos al formulario:**
- [ ] Campo "Nombre del Asesor" (texto)
- [ ] Campo "Email del Asesor" (email)

**2. Calcular campos automáticos:**
- [ ] `DURACION_PROGRAMA`: Calcular desde cantidad de días del itinerario
- [ ] `NOMBRE_PROGRAMA`: Generar desde actividades (ej: "City Tour + Valle Sagrado + Machu Picchu")
- [ ] `FECHA_FIN`: Calcular desde fecha_inicio + duración
- [ ] `SALDO_PENDIENTE`: PRECIO_TOTAL - ADELANTO_RESERVA

**3. Mapear campos existentes:**
- [ ] `TELEFONO_CLIENTE` ← `telefono`
- [ ] `ADELANTO_RESERVA` ← `adelanto_pagado`
- [ ] `TIPO_TREN` ← `tipo_transporte`
- [ ] `PRECIO_TREN` ← `precio_total_tren`

### **FASE 2: Estructura de Actividades (4-6 horas)**

**4. Generar estructura `json_estructura.actividades.tarjetas`:**

Transformar el itinerario actual en:
```javascript
{
  actividades: {
    tarjetas: [
      {
        titulo_dia: "DÍA 1",
        fecha_dia: "Lunes 15 de Enero, 2025",
        descripcion: "<h4>Itinerario:</h4><ul><li>Recojo del aeropuerto</li>...</ul>",
        imagen: "https://url-imagen-actividad.jpg"
      },
      // ... más días
    ]
  }
}
```

**Desafío:** Necesitas mapear cada actividad del formulario a:
- Texto descriptivo del itinerario
- URL de imagen correspondiente

### **FASE 3: Configuración Backend (2-3 horas)**

**5. URLs de Imágenes Estáticas:**

Crear configuración en n8n o backend con:
```javascript
{
  IMAGEN_LOGO: "https://...",
  IMAGEN_CIRCUITO_1: "https://...",
  IMAGEN_CIRCUITO_2: "https://...",
  IMAGEN_CIRCUITO_3: "https://...",
  IMAGEN_HOTELES: "https://...",
  IMAGEN_CUENTA_BANCARIA: "https://...",
  IMAGEN_TOUR_ADICIONAL_1: "https://...",
  IMAGEN_TOUR_ADICIONAL_2: "https://..."
}
```

**6. Textos Fijos HTML:**

Crear configuración con:
- `PROGRAMA_INCLUYE` (HTML)
- `PROGRAMA_NO_INCLUYE` (HTML)
- `SUGERENCIAS_GENERALES` (HTML)
- `SUGERENCIAS_CAMINATAS` (HTML)
- `INFO_TREN_LOCAL` (HTML)
- `INFO_HOTELES` (HTML)

---

## 📈 PRIORIZACIÓN

### **🔥 CRÍTICO (Hacer YA):**
1. Agregar campos de asesor (nombre y email)
2. Mapear campos existentes
3. Calcular campos automáticos simples

### **⚠️ IMPORTANTE (Esta Semana):**
4. Configurar URLs de imágenes estáticas
5. Configurar textos fijos

### **💡 OPCIONAL (Cuando tengas tiempo):**
6. Generar estructura compleja de actividades con imágenes
7. Agregar campos adicionales a la plantilla (categoría hotel, etc.)

---

## 🛠️ RECOMENDACIONES TÉCNICAS

### **Para el Webhook n8n:**

Cuando el formulario envíe datos, n8n debe:

1. **Recibir datos del formulario**
2. **Enriquecer con:**
   - URLs de imágenes estáticas
   - Textos fijos HTML
   - Campos calculados
3. **Generar estructura de actividades**
4. **Renderizar plantilla HTML**
5. **Convertir a PDF**
6. **Subir a Google Drive**
7. **Devolver URL del PDF**

### **Estructura del Payload Completo:**

```javascript
{
  // Datos del formulario (ya existen)
  nombre_cliente: "Juan Pérez",
  telefono: "+51 999 999 999",
  // ...

  // Campos mapeados
  TELEFONO_CLIENTE: formulario.telefono,
  ADELANTO_RESERVA: formulario.adelanto_pagado,

  // Campos calculados
  DURACION_PROGRAMA: calcularDuracion(itinerario),
  NOMBRE_PROGRAMA: generarNombrePrograma(actividades),
  FECHA_FIN: calcularFechaFin(fecha_inicio, duracion),
  SALDO_PENDIENTE: precio_total - adelanto_reserva,

  // Imágenes estáticas (configuración)
  IMAGEN_LOGO: config.imagenes.logo,
  IMAGEN_CIRCUITO_1: config.imagenes.circuito_1,
  // ...

  // Textos fijos (configuración)
  PROGRAMA_INCLUYE: config.textos.programa_incluye,
  PROGRAMA_NO_INCLUYE: config.textos.programa_no_incluye,
  // ...

  // Estructura compleja generada
  json_estructura: {
    actividades: {
      tarjetas: generarTarjetasActividades(itinerario)
    }
  }
}
```

---

## 📝 NOTAS IMPORTANTES

- La plantilla usa sintaxis de **n8n/Handlebars** (`{{ $json.VARIABLE }}`)
- Todas las imágenes necesitan URLs públicas accesibles
- Los textos HTML deben estar escapados correctamente
- La estructura de actividades es la más compleja de implementar

---

## ✅ SIGUIENTE PASO

¿Qué quieres hacer primero?

**A)** Agregar campos de asesor al formulario (5 minutos)
**B)** Implementar cálculos automáticos (15 minutos)
**C)** Configurar imágenes y textos estáticos en n8n
**D)** Explicarte cómo generar la estructura de actividades

**Elige una opción (A, B, C o D)**
