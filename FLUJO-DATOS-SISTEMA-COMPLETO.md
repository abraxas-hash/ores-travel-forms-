# 🔄 Análisis del Flujo de Datos Completo
## Sistema de Cotizaciones ORES Travel Perú

**Fecha:** 2025-11-02
**Versión del Procesador:** V7.3-TREN-DIFERENCIADO-FINAL-CORREGIDO
**Última actualización:** Análisis de integración completa

---

## 📊 ARQUITECTURA DEL SISTEMA

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUJO DE DATOS COMPLETO                      │
└─────────────────────────────────────────────────────────────────┘

[1] FORMULARIO HTML
    └─> formulario-tour-personalizado.html
        └─> Captura datos del cliente y configuración del tour
            ├─> Datos personales
            ├─> Selección de actividades
            ├─> Configuración de transporte/hotel
            └─> Cálculos de precios

                    ↓ (POST al webhook)

[2] PROCESADOR N8N
    └─> n8n-procesador-itinerarios.js
        └─> Transforma y enriquece los datos
            ├─> Mapea 26 actividades con descripciones/imágenes
            ├─> Calcula lógica del Boleto 70 soles
            ├─> Procesa información del tren
            ├─> Genera estructura json_estructura.actividades
            ├─> Agrega URLs de imágenes estáticas
            └─> Agrega textos fijos HTML

                    ↓ (Objeto JSON enriquecido)

[3] PLANTILLA HTML
    └─> plantilla-cotizacion-personalizada.html
        └─> Renderiza el PDF final
            ├─> Portada con información del cliente
            ├─> Actividades día por día con imágenes
            ├─> Secciones de incluye/no incluye
            ├─> Circuitos turísticos
            ├─> Hoteles y tours adicionales
            └─> Información financiera

                    ↓ (Puppeteer genera PDF)

[4] GOOGLE DRIVE
    └─> Almacenamiento organizado por año/mes
        └─> Carpetas: 2025/enero, 2025/febrero, etc.
```

---

## 🔍 MAPEO DETALLADO DE DATOS

### **1️⃣ CAMPOS DEL FORMULARIO → PROCESADOR → PLANTILLA**

| Campo Formulario | Variable Procesador | Variable Plantilla | Estado |
|-----------------|--------------------|--------------------|--------|
| `nombre_cliente` | `NOMBRE_CLIENTE` | `NOMBRE_CLIENTE` | ✅ OK |
| `telefono` | `TELEFONO_CLIENTE` | `TELEFONO_CLIENTE` | ✅ Mapeado |
| `numero_personas` | `NUMERO_PERSONAS` | `NUMERO_PERSONAS` | ✅ OK |
| `tipo_habitacion` | `TIPO_HABITACION` | `TIPO_HABITACION` | ✅ OK |
| `observaciones` | `observaciones` | `observaciones` | ✅ OK |
| `precio_por_persona` | `TARIFA_POR_NACIONAL` | `PRECIO_POR_PERSONA` | ✅ Calculado |
| `precio_total` | `PRECIO_TOTAL` | `PRECIO_TOTAL` | ✅ OK |
| `adelanto_pagado` | `ADELANTO_RESERVA` | `ADELANTO_RESERVA` | ✅ Mapeado |
| `fecha_inicio` | `FECHA_INICIO` | `FECHA_INICIO` | ✅ OK |
| - | `FECHA_FIN` | `FECHA_FIN` | 🔧 Calculado |
| - | `SALDO_PENDIENTE` | `SALDO_PENDIENTE` | 🔧 Calculado |
| `tipo_transporte` | `TIPO_TREN` | `TIPO_TREN` | ✅ Mapeado |
| `precio_total_tren` | `PRECIO_TREN` | `PRECIO_TREN` | ✅ Mapeado |

### **2️⃣ CAMPOS GENERADOS POR EL PROCESADOR**

| Variable | Fuente | Lógica |
|----------|--------|--------|
| `NOMBRE_PROGRAMA` | Actividades seleccionadas | Concatena nombres de actividades principales |
| `DURACION_PROGRAMA` | Conteo de días | `${totalDias} días / ${totalDias - 1} noches` |
| `FECHA_FIN` | fecha_inicio + duración | Suma días del itinerario |
| `SALDO_PENDIENTE` | precio_total - adelanto | Resta automática |
| `TARIFA_POR_NACIONAL` | precio_total / numero_personas | **Precio por persona** (Ej: 6000 ÷ 2 = 3000) |

### **3️⃣ ESTRUCTURA COMPLEJA: `json_estructura.actividades.tarjetas`**

El procesador genera esta estructura para cada día del itinerario:

```javascript
{
  actividades: {
    tarjetas: [
      {
        titulo_dia: "Día 1: LLEGADA AL CUSCO",
        fecha_dia: "lunes, 15 de enero de 2025",
        descripcion: "<h4>Itinerario:</h4><ul><li>Recepción en aeropuerto</li><li>Traslado a hotel</li><li>Bienvenida con mate de coca</li></ul>",
        imagen: "https://nqouocmxfvcpyemxvobm.supabase.co/storage/v1/object/public/ores-travel-pdf/llegada-cusco.jpg"
      },
      {
        titulo_dia: "Día 2: CITY TOUR CUSCO",
        fecha_dia: "martes, 16 de enero de 2025",
        descripcion: "<h4>Itinerario:</h4><ul><li>Visita a Qoricancha</li><li>Catedral del Cusco</li><li>Sacsayhuamán</li>...</ul>",
        imagen: "https://nqouocmxfvcpyemxvobm.supabase.co/storage/v1/object/public/ores-travel-pdf/city-tour.jpg"
      }
      // ... más días
    ]
  }
}
```

#### **Mapeo de 26 Actividades (según procesador n8n)**

El procesador tiene configuradas estas actividades con alias:

| Actividad | Aliases | Descripción Breve |
|-----------|---------|-------------------|
| `LLEGADA` | LLEGADA AL CUSCO, RECEPCION, ARRIBO | Recepción en aeropuerto |
| `LLEGADA+CITY` | LLEGADA CITY TOUR | Recepción + City Tour combinado |
| `CITY` | CITY TOUR, TOUR CITY | City Tour Cusco |
| `LAGUNA` | LAGUNA HUMANTAY, HUMANTAY | Laguna Humantay |
| `MONTAÑA` | MONTAÑA DE COLORES, 7 COLORES | Montaña de 7 Colores |
| `WAQRAPUKARA` | WAQRA | Fortaleza Waqrapukara |
| `7 LAGUNA` | SIETE LAGUNAS, AUSANGATE | 7 Lagunas de Ausangate |
| `VALLE+MAPI` | VALLE SAGRADO MAPI, VALLE VIP | Valle Sagrado + Machu Picchu |
| `MAPI 3 AM` | MACHU PICCHU 3AM | Machu Picchu salida 3 AM |
| `VALLE+PISAC` | PISAC | Valle Sagrado con Pisac |
| `VALLE+OLLANTAY` | OLLANTAYTAMBO | Valle Sagrado con Ollantaytambo |
| `OLLANTAY-IDA` | IDA OLLANTAY | Ida a Ollantaytambo |
| `IDA-CUZ` | IDA A AGUAS CALIENTES | Ida a Aguas Calientes desde Cusco |
| `MAPI` | MACHU PICCHU, MP | Machu Picchu estándar |
| `MONTAÑA+CUATRI` | VINICUNCA CUATRI | Montaña 7 Colores en cuatrimoto |
| `PUENTE` | QESWACHAKA | Puente inca Qeswachaka |
| `MORADA-BUS` | MORADA DIOSES BUS | Morada de los Dioses en bus |
| `MORADA-CUATRI` | MORADA DIOSES CUATRI | Morada de los Dioses en cuatrimoto |
| `MORADA-CUATRI-LAGU` | MORADA PIURAY | Morada + Laguna Piuray cuatrimoto |
| `FULL MAPI` | MAPI FULL | Machu Picchu Full Day |
| `PALCOYO` | MONTANA PALCOYO | Montaña Palcoyo |
| `LIBRE-SIN GUIA` | DIA LIBRE | Día libre sin guía |
| `FOTOGRAFIA` | WALKING TOUR | Tour fotográfico |
| `MISTICO` | TOUR MISTICO | Tour místico |
| `SUR` | TOUR SUR | Tour al Sur del Cusco |
| `SALIDA` | DESPEDIDA, RETORNO | Salida de Cusco |

### **4️⃣ LÓGICA DEL BOLETO 70 SOLES**

El procesador detecta automáticamente si el tour califica para el Boleto Turístico:

```javascript
function verificarBoleto70Soles(actividadesProcesadas) {
  // Cuenta actividades que requieren boleto:
  // - CITY TOUR
  // - VALLE SAGRADO (cualquier variante)
  // - SUR

  if (contadorActivadoras >= 2) {
    return {
      aplica: true,
      precio: 70,
      texto: "Boleto Turístico General (incluye CITY + VALLE + SUR)"
    };
  } else {
    return {
      aplica: false,
      precio: 0,
      texto: "No aplica"
    };
  }
}
```

### **5️⃣ LÓGICA DEL TREN (V7.2 DIFERENCIADO)**

El procesador tiene 3 tipos de tren:

| Tipo | Campo Formulario | Lógica |
|------|------------------|--------|
| **Tren Local** | `tipo_transporte = "Tren Local"` | `tren_pdf_aplica = true` + texto: "Aplica tren local" |
| **Tren Turístico** | `tipo_transporte = "Tren Turístico"` | `tren_pdf_aplica = true` + `tren_pdf_texto` con horarios y precios USD |
| **No aplica** | Actividades sin Machu Picchu | `tren_pdf_aplica = false` + texto: "No Aplica" |

```javascript
function procesarInformacionTren(body, actividadesSeleccionadas) {
  // Detecta si alguna actividad requiere tren
  const requiereTren = actividadesSeleccionadas.some(act =>
    act.includes('MAPI') ||
    act.includes('VALLE') ||
    act.includes('OLLANTAY')
  );

  // Verifica campos específicos del formulario
  if (body.tren_pdf_aplica) {
    if (body.tren_pdf_tipo === 'turistico') {
      return {
        tieneTren: true,
        tipoTren: 'Tren Turístico',
        precioTren: `USD ${body.precio_total_tren}`,
        contenidoTrenPdf: body.tren_pdf_texto,
        tren_separado: true
      };
    }
  }

  return {
    tieneTren: requiereTren,
    tipoTren: body.tipo_transporte || 'Tren Local',
    precioTren: 'Incluido (Tren Local)',
    tren_separado: true
  };
}
```

---

## 📷 IMÁGENES ESTÁTICAS (Configuradas en n8n)

El procesador agrega estas URLs al objeto final:

| Variable | URL (ejemplo) | Uso |
|----------|---------------|-----|
| `IMAGEN_LOGO` | `https://...supabase.../logo-ores.png` | Marca de agua en todas las páginas |
| `IMAGEN_CIRCUITO_1` | `https://...supabase.../circuito-1.jpg` | Página de circuito corto |
| `IMAGEN_CIRCUITO_2` | `https://...supabase.../circuito-2.jpg` | Página de circuito estándar |
| `IMAGEN_CIRCUITO_3` | `https://...supabase.../circuito-3.jpg` | Página de circuito extendido |
| `IMAGEN_HOTELES` | `https://...supabase.../hoteles-cusco.jpg` | Página de hoteles |
| `IMAGEN_CUENTA_BANCARIA` | `https://...supabase.../cuenta-banco.png` | Información de pago |
| `IMAGEN_TOUR_ADICIONAL_1` | `https://...supabase.../tour-1.jpg` | Tours adicionales (lado izquierdo) |
| `IMAGEN_TOUR_ADICIONAL_2` | `https://...supabase.../tour-2.jpg` | Tours adicionales (lado derecho) |

**Base URL Supabase:**
`https://nqouocmxfvcpyemxvobm.supabase.co/storage/v1/object/public/ores-travel-pdf/`

---

## 📝 TEXTOS FIJOS HTML (Configurados en n8n)

Estos bloques HTML se agregan automáticamente en el procesador:

### **`PROGRAMA_INCLUYE`**

```html
<h3>El programa incluye</h3>
<ul>
  <li>Traslado aeropuerto - hotel - aeropuerto</li>
  <li>Alojamiento en hoteles categoría seleccionada</li>
  <li>Tours según itinerario con guía profesional</li>
  <li>Boletos de ingreso a los sitios turísticos</li>
  <li>Transporte turístico privado</li>
  <!-- ... más ítems -->
</ul>
```

### **`PROGRAMA_NO_INCLUYE`**

```html
<h3>El programa NO incluye</h3>
<ul>
  <li>Vuelos nacionales o internacionales</li>
  <li>Alimentación (salvo especificado)</li>
  <li>Gastos personales y propinas</li>
  <li>Seguros de viaje</li>
  <!-- ... más ítems -->
</ul>
```

### **`SUGERENCIAS_GENERALES`**

```html
<h3>Sugerencias generales</h3>
<ul>
  <li>Llevar bloqueador solar y repelente de insectos</li>
  <li>Ropa abrigadora para la noche</li>
  <li>Documentos de identidad originales</li>
  <!-- ... más sugerencias -->
</ul>
```

### **`SUGERENCIAS_CAMINATAS`**

```html
<h3>Sugerencias para caminatas</h3>
<ul>
  <li>Zapatos de trekking</li>
  <li>Bastones de caminata</li>
  <li>Ropa deportiva cómoda</li>
  <!-- ... más sugerencias -->
</ul>
```

### **`INFO_TREN_LOCAL`**

```html
<h3>Información sobre tren turístico</h3>
<h4>Tren Local (Expedition)</h4>
<p>Servicio económico con asientos cómodos y ventanas panorámicas...</p>

<h4>Tren Turístico (Vistadome)</h4>
<p>Servicio premium con ventanas panorámicas en el techo, snack incluido...</p>
```

### **`INFO_HOTELES`**

```html
<h3>En hoteles</h3>
<h4>Categoría 2 estrellas</h4>
<p>Hoteles económicos con servicios básicos...</p>

<h4>Categoría 3 estrellas</h4>
<p>Hoteles confortables con habitaciones equipadas...</p>

<h4>Categoría 4 y 5 estrellas</h4>
<p>Hoteles de lujo con todas las comodidades...</p>
```

---

## 🔧 CAMPOS FALTANTES EN EL FORMULARIO

### **CRÍTICOS (Agregar al formulario)**

1. **`nombre_asesor`** - Nombre del asesor de viajes
   - **Solución:** Agregar campo de texto en el formulario
   - **Ubicación sugerida:** Junto a los datos del cliente

2. **`email_asesor`** - Email del asesor
   - **Solución:** Agregar campo email en el formulario
   - **Ubicación sugerida:** Junto a nombre_asesor

### **OPCIONALES (Agregar en backend/n8n)**

3. **Imágenes por actividad** - Cada actividad necesita su imagen
   - **Solución:** Mapeo en el procesador n8n con URLs de Supabase
   - **Ejemplo:**
   ```javascript
   'CITY': {
     imagen: 'https://...supabase.../city-tour.jpg'
   },
   'LAGUNA': {
     imagen: 'https://...supabase.../laguna-humantay.jpg'
   }
   ```

4. **Descripciones HTML de actividades** - Cada actividad necesita su descripción formateada
   - **Solución:** Mapeo en el procesador n8n
   - **Ejemplo:**
   ```javascript
   'CITY': {
     descripcion: '<h4>Itinerario:</h4><ul><li>Qoricancha</li><li>Catedral</li>...</ul>'
   }
   ```

---

## ✅ FLUJO COMPLETO DE EJEMPLO

### **Entrada del Formulario:**

```json
{
  "nombre_cliente": "Juan Pérez García",
  "telefono": "+51 999 888 777",
  "numero_personas": 2,
  "tipo_habitacion": "Matrimonial",
  "observaciones": "Vegetariano",
  "precio_por_persona": 3000,
  "precio_total": 6000,
  "adelanto_pagado": 2000,
  "fecha_inicio": "15/01/2025",
  "tipo_transporte": "Tren Local",
  "precio_total_tren": 0,
  "itinerario": [
    { "dia": 1, "fecha": "15/01/2025", "actividad": "LLEGADA" },
    { "dia": 2, "fecha": "16/01/2025", "actividad": "CITY TOUR" },
    { "dia": 3, "fecha": "17/01/2025", "actividad": "VALLE+MAPI" },
    { "dia": 4, "fecha": "18/01/2025", "actividad": "SALIDA" }
  ]
}
```

### **Procesamiento n8n (transformaciones):**

1. **Mapea campos:**
   - `TELEFONO_CLIENTE = "+51 999 888 777"`
   - `ADELANTO_RESERVA = 2000`

2. **Calcula automáticamente:**
   - `TARIFA_POR_NACIONAL = 6000 ÷ 2 = 3000`
   - `DURACION_PROGRAMA = "4 días / 3 noches"`
   - `NOMBRE_PROGRAMA = "CITY TOUR + VALLE SAGRADO + MACHU PICCHU"`
   - `FECHA_FIN = "18/01/2025"`
   - `SALDO_PENDIENTE = 6000 - 2000 = 4000`

3. **Genera estructura de actividades:**
   ```javascript
   json_estructura: {
     actividades: {
       tarjetas: [
         {
           titulo_dia: "Día 1: LLEGADA AL CUSCO",
           fecha_dia: "lunes, 15 de enero de 2025",
           descripcion: "<h4>Itinerario:</h4><ul><li>Recepción...</li></ul>",
           imagen: "https://...supabase.../llegada.jpg"
         },
         // ... días 2, 3, 4
       ]
     }
   }
   ```

4. **Aplica lógica del Boleto 70:**
   - Detecta CITY + VALLE → **Boleto 70 soles APLICA**

5. **Aplica lógica del tren:**
   - Detecta actividad VALLE+MAPI → **REQUIERE TREN**
   - `tipo_transporte = "Tren Local"` → **"Incluido (Tren Local)"**

6. **Agrega imágenes estáticas:**
   - `IMAGEN_LOGO`, `IMAGEN_CIRCUITO_1`, `IMAGEN_CIRCUITO_2`, etc.

7. **Agrega textos fijos:**
   - `PROGRAMA_INCLUYE`, `PROGRAMA_NO_INCLUYE`, etc.

### **Salida del Procesador (JSON completo para plantilla):**

```json
{
  "NOMBRE_CLIENTE": "Juan Pérez García",
  "TELEFONO_CLIENTE": "+51 999 888 777",
  "NUMERO_PERSONAS": 2,
  "TIPO_HABITACION": "Matrimonial",
  "observaciones": "Vegetariano",
  "PRECIO_POR_PERSONA": 3000,
  "TARIFA_POR_NACIONAL": 3000,
  "PRECIO_TOTAL": 6000,
  "ADELANTO_RESERVA": 2000,
  "SALDO_PENDIENTE": 4000,
  "FECHA_INICIO": "15/01/2025",
  "FECHA_FIN": "18/01/2025",
  "DURACION_PROGRAMA": "4 días / 3 noches",
  "NOMBRE_PROGRAMA": "CITY TOUR + VALLE SAGRADO + MACHU PICCHU",
  "NOMBRE_ASESOR": "María López",
  "EMAIL_ASESOR": "maria@orestravelperu.com",
  "TIPO_TREN": "Tren Local",
  "PRECIO_TREN": "Incluido (Tren Local)",
  "json_estructura": {
    "actividades": {
      "tarjetas": [
        {
          "titulo_dia": "Día 1: LLEGADA AL CUSCO",
          "fecha_dia": "lunes, 15 de enero de 2025",
          "descripcion": "<h4>Itinerario:</h4><ul><li>Recepción en aeropuerto</li><li>Traslado a hotel</li></ul>",
          "imagen": "https://...supabase.../llegada.jpg"
        },
        {
          "titulo_dia": "Día 2: CITY TOUR CUSCO",
          "fecha_dia": "martes, 16 de enero de 2025",
          "descripcion": "<h4>Itinerario:</h4><ul><li>Qoricancha</li><li>Catedral</li><li>Sacsayhuamán</li></ul>",
          "imagen": "https://...supabase.../city-tour.jpg"
        },
        {
          "titulo_dia": "Día 3: VALLE SAGRADO + MACHU PICCHU",
          "fecha_dia": "miércoles, 17 de enero de 2025",
          "descripcion": "<h4>Itinerario:</h4><ul><li>Pisac</li><li>Ollantaytambo</li><li>Tren a Aguas Calientes</li><li>Machu Picchu</li></ul>",
          "imagen": "https://...supabase.../valle-mapi.jpg"
        },
        {
          "titulo_dia": "Día 4: SALIDA DE CUSCO",
          "fecha_dia": "jueves, 18 de enero de 2025",
          "descripcion": "<h4>Itinerario:</h4><ul><li>Traslado al aeropuerto</li></ul>",
          "imagen": "https://...supabase.../salida.jpg"
        }
      ]
    }
  },
  "IMAGEN_LOGO": "https://...supabase.../logo.png",
  "IMAGEN_CIRCUITO_1": "https://...supabase.../circuito-1.jpg",
  "IMAGEN_CIRCUITO_2": "https://...supabase.../circuito-2.jpg",
  "IMAGEN_CIRCUITO_3": "https://...supabase.../circuito-3.jpg",
  "IMAGEN_HOTELES": "https://...supabase.../hoteles.jpg",
  "IMAGEN_CUENTA_BANCARIA": "https://...supabase.../cuenta.png",
  "IMAGEN_TOUR_ADICIONAL_1": "https://...supabase.../tour-1.jpg",
  "IMAGEN_TOUR_ADICIONAL_2": "https://...supabase.../tour-2.jpg",
  "PROGRAMA_INCLUYE": "<h3>El programa incluye</h3><ul><li>Traslados...</li></ul>",
  "PROGRAMA_NO_INCLUYE": "<h3>El programa NO incluye</h3><ul><li>Vuelos...</li></ul>",
  "SUGERENCIAS_GENERALES": "<h3>Sugerencias generales</h3><ul><li>Bloqueador...</li></ul>",
  "SUGERENCIAS_CAMINATAS": "<h3>Sugerencias para caminatas</h3><ul><li>Zapatos...</li></ul>",
  "INFO_TREN_LOCAL": "<h3>Información sobre tren</h3><p>...</p>",
  "INFO_HOTELES": "<h3>En hoteles</h3><p>...</p>"
}
```

### **Renderización en Plantilla:**

La plantilla HTML usa sintaxis Handlebars de n8n:

```html
<!-- Portada -->
<h1>{{ $json.NOMBRE_CLIENTE }}</h1>
<p>Teléfono: {{ $json.TELEFONO_CLIENTE }}</p>
<p>Duración: {{ $json.DURACION_PROGRAMA }}</p>
<p>Precio por persona: S/. {{ $json.PRECIO_POR_PERSONA }}</p>
<p>Total: S/. {{ $json.PRECIO_TOTAL }}</p>

<!-- Actividades (loop) -->
{{ $json.json_estructura.actividades.tarjetas.map(function(actividad) {
  return `
    <div class="actividad-compacta">
      <h3>${actividad.titulo_dia}</h3>
      <p>${actividad.fecha_dia}</p>
      ${actividad.descripcion}
      <img src="${actividad.imagen}" alt="${actividad.titulo_dia}">
    </div>
  `;
}).join('') }}

<!-- Secciones fijas -->
{{ $json.PROGRAMA_INCLUYE }}
{{ $json.PROGRAMA_NO_INCLUYE }}

<!-- Imágenes de circuitos -->
<img src="{{ $json.IMAGEN_CIRCUITO_1 }}" alt="Circuito 1">
```

---

## 📋 PRÓXIMOS PASOS

### **1️⃣ COMPLETAR EL FORMULARIO (URGENTE)**

**Agregar estos 2 campos:**

```html
<!-- En formulario-tour-personalizado.html -->

<div class="form-group">
  <label for="nombreAsesor">👨‍💼 Nombre del Asesor *</label>
  <input type="text" id="nombreAsesor" name="nombre_asesor"
         class="form-input" required
         placeholder="Nombre completo del asesor">
</div>

<div class="form-group">
  <label for="emailAsesor">📧 Email del Asesor *</label>
  <input type="email" id="emailAsesor" name="email_asesor"
         class="form-input" required
         placeholder="email@orestravelperu.com">
</div>
```

### **2️⃣ VERIFICAR PROCESADOR N8N**

**Confirmar que el procesador tiene:**

- ✅ Mapeo completo de 26 actividades con descripciones e imágenes
- ✅ Cálculo de `TARIFA_POR_NACIONAL = precio_total / numero_personas`
- ✅ Cálculo de `SALDO_PENDIENTE = precio_total - adelanto`
- ✅ Generación de `FECHA_FIN` desde fecha_inicio + duración
- ✅ Generación de `NOMBRE_PROGRAMA` desde actividades
- ✅ Lógica del Boleto 70 soles
- ✅ Lógica diferenciada del tren (Local vs Turístico)
- ✅ URLs de las 8 imágenes estáticas
- ✅ Textos HTML de las 6 secciones fijas

### **3️⃣ PROBAR EL FLUJO COMPLETO**

1. Llenar el formulario con datos de prueba
2. Enviar al webhook de n8n
3. Verificar que el PDF se genera correctamente
4. Confirmar que todas las variables aparecen en el PDF
5. Verificar que las imágenes se cargan
6. Confirmar que los cálculos son correctos

---

## 🔍 CHECKLIST DE VALIDACIÓN

### **Datos del Cliente**
- [ ] NOMBRE_CLIENTE aparece en portada
- [ ] TELEFONO_CLIENTE aparece en portada
- [ ] NUMERO_PERSONAS aparece correctamente
- [ ] TIPO_HABITACION aparece correctamente
- [ ] observaciones aparece en portada

### **Datos Financieros**
- [ ] PRECIO_POR_PERSONA = TARIFA_POR_NACIONAL
- [ ] PRECIO_TOTAL aparece correctamente
- [ ] ADELANTO_RESERVA aparece correctamente
- [ ] SALDO_PENDIENTE = PRECIO_TOTAL - ADELANTO_RESERVA
- [ ] Cálculo es correcto

### **Datos del Programa**
- [ ] NOMBRE_PROGRAMA generado automáticamente
- [ ] DURACION_PROGRAMA calculada correctamente
- [ ] FECHA_INICIO aparece en formato DD/MM/YYYY
- [ ] FECHA_FIN calculada correctamente

### **Datos del Asesor**
- [ ] NOMBRE_ASESOR aparece en portada
- [ ] EMAIL_ASESOR aparece en portada

### **Información del Tren**
- [ ] TIPO_TREN detectado correctamente
- [ ] PRECIO_TREN aparece según lógica
- [ ] Si no requiere tren → "No Aplica"
- [ ] Si es Tren Local → "Incluido (Tren Local)"
- [ ] Si es Tren Turístico → Precio en USD

### **Actividades Día por Día**
- [ ] json_estructura.actividades.tarjetas generado
- [ ] Cada actividad tiene titulo_dia
- [ ] Cada actividad tiene fecha_dia formateada
- [ ] Cada actividad tiene descripcion en HTML
- [ ] Cada actividad tiene imagen (URL válida)
- [ ] Total de días coincide con itinerario

### **Imágenes Estáticas**
- [ ] IMAGEN_LOGO aparece como marca de agua
- [ ] IMAGEN_CIRCUITO_1 aparece en página dedicada
- [ ] IMAGEN_CIRCUITO_2 aparece en página dedicada
- [ ] IMAGEN_CIRCUITO_3 aparece en página dedicada
- [ ] IMAGEN_HOTELES aparece en página dedicada
- [ ] IMAGEN_CUENTA_BANCARIA aparece en sección hoteles
- [ ] IMAGEN_TOUR_ADICIONAL_1 aparece lado a lado
- [ ] IMAGEN_TOUR_ADICIONAL_2 aparece lado a lado

### **Textos Fijos**
- [ ] PROGRAMA_INCLUYE aparece en página dedicada
- [ ] PROGRAMA_NO_INCLUYE aparece correctamente
- [ ] SUGERENCIAS_GENERALES aparece correctamente
- [ ] SUGERENCIAS_CAMINATAS aparece correctamente
- [ ] INFO_TREN_LOCAL aparece correctamente
- [ ] INFO_HOTELES aparece correctamente

### **Lógica Especial**
- [ ] Boleto 70 soles detectado correctamente
- [ ] Si CITY + VALLE → Boleto aplica
- [ ] Si solo 1 actividad → Boleto no aplica

---

## 🎯 RESUMEN EJECUTIVO

### **Estado Actual del Sistema:**

✅ **FUNCIONANDO:**
- Formulario captura datos básicos del cliente
- Cálculo automático de precio total (precio_por_persona × numero_personas)
- Protección XSS implementada
- Estructura del procesador n8n configurada
- Plantilla HTML lista para renderizar

⚠️ **FALTA IMPLEMENTAR:**
- **2 campos en formulario:** nombre_asesor, email_asesor
- **Completar procesador n8n** con las 26 actividades (descripcion + imagen)
- **Configurar URLs de imágenes** estáticas en Supabase
- **Configurar textos fijos** HTML en procesador

🔧 **PRÓXIMA ACCIÓN RECOMENDADA:**
1. Agregar los 2 campos faltantes al formulario (5 minutos)
2. Completar el mapeo de actividades en el procesador n8n (2-3 horas)
3. Subir las 8 imágenes estáticas a Supabase (30 minutos)
4. Configurar los 6 textos fijos HTML en el procesador (1 hora)
5. Probar el flujo completo end-to-end (30 minutos)

**Tiempo total estimado:** 4-5 horas de trabajo

---

## 📞 CONTACTO Y SOPORTE

**Proyecto:** ORES Travel Perú - Sistema de Cotizaciones
**Repositorio:** abraxas-hash/ores-travel-forms-
**Branch:** claude/check-last-repo-011CUVGJwcR63Qx8LwbkRFsY
**Última actualización:** 2025-11-02

---

**FIN DEL ANÁLISIS DE FLUJO DE DATOS**
