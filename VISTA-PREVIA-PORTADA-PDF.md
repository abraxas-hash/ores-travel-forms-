# 📄 Vista Previa de la Portada del PDF
## Sistema de Cotizaciones ORES Travel Perú

**Última actualización:** 2025-11-02

---

## 🎨 Visualización de la Portada (Ejemplo con Datos Reales)

```
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║         AGENCIA OPERADORA DE TURISMO SOSTENIBLE                   ║
║                                                                    ║
║             COTIZACIÓN TURÍSTICA PERSONALIZADA                    ║
║                                                                    ║
║                     ORES TRAVEL PERÚ                              ║
║                                                                    ║
║____________________________________________________________________║
║                                                                    ║
║  AGENCIA OPERADORA          : ORES TRAVEL PERÚ                    ║
║  ACTIVIDADES SELECCIONADAS  : CITY TOUR + VALLE SAGRADO + MAPI   ║
║  DURACIÓN                   : 4 días / 3 noches                   ║
║  ASESOR DE VIAJES           : María López Sánchez                 ║
║  EMAIL                      : maria@orestravelperu.com            ║
║  TELÉFONO                   : +51 999 888 777                     ║
║                                                                    ║
║                                                                    ║
║  INFORMACIÓN DEL CLIENTE                                          ║
║                                                                    ║
║  CLIENTE                    : Juan Pérez García                   ║
║  TIPO DE HABITACIÓN         : Matrimonial                         ║
║  NÚMERO DE PERSONAS         : 2                                   ║
║                                                                    ║
║                                                                    ║
║  INFORMACIÓN FINANCIERA                                           ║
║                                                                    ║
║  TARIFA POR PERSONA         : S/. 3000.00                         ║
║  TOTAL A PAGAR              : S/. 6000.00                         ║
║  ADELANTO                   : S/. 2000.00                         ║
║  SALDO                      : S/. 4000.00                         ║
║                                                                    ║
║                                                                    ║
║  INFORMACIÓN DEL TREN                                             ║
║  DETALLES DEL TREN                                                ║
║                                                                    ║
║  N° PERSONAS                : 2                                   ║
║  PRECIO                     : USD 70 por persona                  ║
║  HORA IDA                   : 06:10 AM                            ║
║  HORA RETORNO               : 04:30 PM                            ║
║  TOTAL                      : USD 140.00                          ║
║  TIPO                       : Tren Turístico Vistadome            ║
║                                                                    ║
║                                                                    ║
║  OBSERVACIONES                                                    ║
║                                                                    ║
║  : Cliente es vegetariano. Requiere alimentación especial.       ║
║    Celebración de aniversario el día 3.                          ║
║                                                                    ║
║                                                                    ║
║  INFORMACIÓN DE FECHAS                                            ║
║                                                                    ║
║  FECHA DE INICIO            : 15/01/2025                          ║
║  FECHA DE FIN               : 18/01/2025                          ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝

                         [Marca de agua ORES TRAVEL]
                               (Fondo opaco)

                            [PÁGINA 1 DE ~15]
```

---

## 📋 Mapeo Completo de Variables

### **1. ENCABEZADOS (Fijos)**
- ✅ AGENCIA OPERADORA DE TURISMO SOSTENIBLE
- ✅ COTIZACIÓN TURÍSTICA PERSONALIZADA
- ✅ ORES TRAVEL PERÚ
- ✅ Línea horizontal separadora

### **2. INFORMACIÓN DE LA AGENCIA**

| Campo | Variable n8n | Fuente | Ejemplo |
|-------|--------------|--------|---------|
| AGENCIA OPERADORA | (fijo) | Hardcoded | "ORES TRAVEL PERÚ" |
| ACTIVIDADES SELECCIONADAS | `{{ $json.NOMBRE_PROGRAMA }}` | Procesador calcula | "CITY TOUR + VALLE + MAPI" |
| DURACIÓN | `{{ $json.DURACION_PROGRAMA }}` | Procesador calcula | "4 días / 3 noches" |
| ASESOR DE VIAJES | `{{ $json.NOMBRE_ASESOR }}` | Formulario | "María López" |
| EMAIL | `{{ $json.EMAIL_ASESOR }}` | Formulario | "maria@ores.com" |
| TELÉFONO | `{{ $json.TELEFONO_CLIENTE }}` | Formulario | "+51 999 888 777" |

### **3. INFORMACIÓN DEL CLIENTE**

| Campo | Variable n8n | Fuente | Ejemplo |
|-------|--------------|--------|---------|
| CLIENTE | `{{ $json.NOMBRE_CLIENTE }}` | Formulario | "Juan Pérez García" |
| TIPO DE HABITACIÓN | `{{ $json.TIPO_HABITACION }}` | Formulario | "Matrimonial" |
| NÚMERO DE PERSONAS | `{{ $json.NUMERO_PERSONAS }}` | Formulario | "2" |

### **4. INFORMACIÓN FINANCIERA**

| Campo | Variable n8n | Fuente | Ejemplo |
|-------|--------------|--------|---------|
| TARIFA POR PERSONA | `{{ $json.PRECIO_POR_PERSONA }}` | Formulario (precio_por_persona) | "S/. 3000.00" |
| TOTAL A PAGAR | `{{ $json.PRECIO_TOTAL }}` | Formulario (precio_total) | "S/. 6000.00" |
| ADELANTO | `{{ $json.ADELANTO_RESERVA }}` | Formulario (adelanto_pagado) | "S/. 2000.00" |
| SALDO | `{{ $json.SALDO_PENDIENTE }}` | Procesador calcula | "S/. 4000.00" |

**Cálculos automáticos:**
- `SALDO_PENDIENTE = PRECIO_TOTAL - ADELANTO_RESERVA`
- Ejemplo: S/. 6000 - S/. 2000 = **S/. 4000**

### **5. INFORMACIÓN DEL TREN** ⭐ NUEVA SECCIÓN

| Campo | Variable n8n | Fuente | Ejemplo |
|-------|--------------|--------|---------|
| N° PERSONAS | `{{ $json.NUMERO_PERSONAS }}` | Formulario (mismo que cliente) | "2" |
| PRECIO | `{{ $json.PRECIO_TREN }}` | Procesador calcula | "USD 70 por persona" |
| HORA IDA | `{{ $json.HORA_IDA_TREN }}` | **FALTA EN FORMULARIO** | "06:10 AM" |
| HORA RETORNO | `{{ $json.HORA_RETORNO_TREN }}` | **FALTA EN FORMULARIO** | "04:30 PM" |
| TOTAL | `{{ $json.PRECIO_TOTAL_TREN }}` | Formulario (precio_total_tren) | "USD 140.00" |
| TIPO | `{{ $json.TIPO_TREN }}` | Formulario (tipo_transporte) | "Tren Turístico Vistadome" |

**Estados posibles del tren:**

#### **Caso 1: Tren Local (Incluido)**
```
PRECIO      : Incluido en programa
TIPO        : Tren Local
TOTAL       : Incluido
```

#### **Caso 2: Tren Turístico (Con costo)**
```
PRECIO      : USD 70 por persona
TIPO        : Tren Turístico Vistadome
HORA IDA    : 06:10 AM
HORA RETORNO: 04:30 PM
TOTAL       : USD 140.00
```

#### **Caso 3: No Aplica**
```
PRECIO      : No Aplica
TIPO        : No Aplica
TOTAL       : No Aplica
```

### **6. OBSERVACIONES**

| Campo | Variable n8n | Fuente | Ejemplo |
|-------|--------------|--------|---------|
| OBSERVACIONES | `{{ $json.observaciones }}` | Formulario | "Cliente vegetariano. Aniversario día 3." |

### **7. INFORMACIÓN DE FECHAS**

| Campo | Variable n8n | Fuente | Ejemplo |
|-------|--------------|--------|---------|
| FECHA DE INICIO | `{{ $json.FECHA_INICIO }}` | Formulario (fecha_inicio) | "15/01/2025" |
| FECHA DE FIN | `{{ $json.FECHA_FIN }}` | Procesador calcula | "18/01/2025" |

**Cálculo automático:**
- `FECHA_FIN = FECHA_INICIO + duración del itinerario`
- Ejemplo: 15/01/2025 + 3 días = **18/01/2025**

---

## 🔧 Variables que FALTAN en el formulario

### **CRÍTICAS (agregar al formulario):**

1. **`nombre_asesor`** ⚠️ FALTA
   - Campo: Input text
   - Label: "👨‍💼 Nombre del Asesor"
   - Requerido: Sí

2. **`email_asesor`** ⚠️ FALTA
   - Campo: Input email
   - Label: "📧 Email del Asesor"
   - Requerido: Sí

### **OPCIONALES (agregar al formulario si se usa tren turístico):**

3. **`hora_ida_tren`** ⚠️ FALTA
   - Campo: Input time o text
   - Label: "⏰ Hora de Salida del Tren"
   - Requerido: No (solo si aplica tren)

4. **`hora_retorno_tren`** ⚠️ FALTA
   - Campo: Input time o text
   - Label: "⏰ Hora de Retorno del Tren"
   - Requerido: No (solo si aplica tren)

---

## 📊 Validación de Datos en Procesador n8n

### **Variables que el procesador DEBE generar:**

```javascript
// En n8n-procesador-itinerarios.js

return {
  // DATOS DEL FORMULARIO (pass-through)
  NOMBRE_CLIENTE: body.nombre_cliente,
  TELEFONO_CLIENTE: body.telefono,
  NUMERO_PERSONAS: body.numero_personas,
  TIPO_HABITACION: body.tipo_habitacion,
  observaciones: body.observaciones,
  PRECIO_POR_PERSONA: body.precio_por_persona,
  PRECIO_TOTAL: body.precio_total,
  ADELANTO_RESERVA: body.adelanto_pagado,
  FECHA_INICIO: body.fecha_inicio,
  NOMBRE_ASESOR: body.nombre_asesor, // ⚠️ FALTA EN FORMULARIO
  EMAIL_ASESOR: body.email_asesor,   // ⚠️ FALTA EN FORMULARIO

  // DATOS CALCULADOS AUTOMÁTICAMENTE
  SALDO_PENDIENTE: body.precio_total - body.adelanto_pagado,
  DURACION_PROGRAMA: `${totalDias} días / ${totalDias - 1} noches`,
  NOMBRE_PROGRAMA: generarNombrePrograma(actividadesSeleccionadas),
  FECHA_FIN: calcularFechaFin(body.fecha_inicio, totalDias),

  // DATOS DEL TREN
  TIPO_TREN: body.tipo_transporte || 'No Aplica',
  PRECIO_TREN: calcularPrecioTren(body),
  PRECIO_TOTAL_TREN: body.precio_total_tren || 'Incluido',
  HORA_IDA_TREN: body.hora_ida_tren || 'No especificado', // ⚠️ FALTA EN FORMULARIO
  HORA_RETORNO_TREN: body.hora_retorno_tren || 'No especificado', // ⚠️ FALTA EN FORMULARIO

  // ESTRUCTURA COMPLEJA
  json_estructura: {
    actividades: {
      tarjetas: [...] // Array de actividades
    }
  },

  // IMÁGENES ESTÁTICAS
  IMAGEN_LOGO: BASE_URL + 'logo-ores.png',
  // ... más imágenes

  // TEXTOS FIJOS
  PROGRAMA_INCLUYE: '<h3>El programa incluye</h3>...',
  // ... más textos
};
```

---

## ✅ Checklist de Implementación

### **TEMPLATE HTML (plantilla-cotizacion-personalizada.html)**
- [x] Encabezados centrados
- [x] Sección de información de la agencia
- [x] Sección de información del cliente
- [x] Sección de información financiera
- [x] Sección de información del tren (NUEVA)
- [x] Sección de observaciones independiente
- [x] Sección de información de fechas
- [x] Todas las variables mapeadas con sintaxis n8n

### **FORMULARIO HTML (formulario-tour-personalizado.html)**
- [ ] ⚠️ Agregar campo `nombre_asesor`
- [ ] ⚠️ Agregar campo `email_asesor`
- [ ] ⚠️ Agregar campo `hora_ida_tren` (opcional)
- [ ] ⚠️ Agregar campo `hora_retorno_tren` (opcional)
- [x] Campo `nombre_cliente` (existe)
- [x] Campo `telefono` (existe)
- [x] Campo `numero_personas` (existe)
- [x] Campo `tipo_habitacion` (existe)
- [x] Campo `observaciones` (existe)
- [x] Campo `precio_por_persona` (existe)
- [x] Campo `precio_total` (existe, calculado automático)
- [x] Campo `adelanto_pagado` (existe)
- [x] Campo `fecha_inicio` (existe)
- [x] Campo `tipo_transporte` (existe)
- [x] Campo `precio_total_tren` (existe)

### **PROCESADOR N8N (n8n-procesador-itinerarios.js)**
- [ ] ⚠️ Agregar lógica para `NOMBRE_ASESOR`
- [ ] ⚠️ Agregar lógica para `EMAIL_ASESOR`
- [ ] ⚠️ Agregar lógica para `HORA_IDA_TREN`
- [ ] ⚠️ Agregar lógica para `HORA_RETORNO_TREN`
- [x] Cálculo de `SALDO_PENDIENTE` (implementado)
- [x] Cálculo de `DURACION_PROGRAMA` (implementado)
- [x] Cálculo de `NOMBRE_PROGRAMA` (implementado)
- [x] Cálculo de `FECHA_FIN` (implementado)
- [x] Mapeo de 26 actividades (implementado)
- [x] Lógica del Boleto 70 soles (implementado)
- [x] Lógica diferenciada del tren (implementado)

---

## 🎯 Próximos Pasos

### **1. AGREGAR CAMPOS AL FORMULARIO** (Prioridad ALTA)

```html
<!-- Agregar en formulario-tour-personalizado.html -->

<!-- Sección: Datos del Asesor -->
<div class="form-section">
  <h3>👨‍💼 DATOS DEL ASESOR</h3>

  <div class="form-group">
    <label for="nombreAsesor">Nombre del Asesor *</label>
    <input type="text" id="nombreAsesor" name="nombre_asesor"
           class="form-input" required
           placeholder="Nombre completo del asesor">
  </div>

  <div class="form-group">
    <label for="emailAsesor">Email del Asesor *</label>
    <input type="email" id="emailAsesor" name="email_asesor"
           class="form-input" required
           placeholder="asesor@orestravelperu.com">
  </div>
</div>

<!-- Sección: Horarios del Tren (opcional) -->
<div class="form-section" id="seccionHorariosTren" style="display: none;">
  <h3>⏰ HORARIOS DEL TREN</h3>

  <div class="form-group">
    <label for="horaIdaTren">Hora de Salida (Ida)</label>
    <input type="time" id="horaIdaTren" name="hora_ida_tren"
           class="form-input"
           placeholder="Ej: 06:10">
  </div>

  <div class="form-group">
    <label for="horaRetornoTren">Hora de Retorno</label>
    <input type="time" id="horaRetornoTren" name="hora_retorno_tren"
           class="form-input"
           placeholder="Ej: 16:30">
  </div>
</div>

<script>
// Mostrar horarios del tren solo si es Tren Turístico
document.getElementById('tipoTransporte')?.addEventListener('change', function() {
  const seccionHorarios = document.getElementById('seccionHorariosTren');
  if (this.value === 'Tren Turístico') {
    seccionHorarios.style.display = 'block';
  } else {
    seccionHorarios.style.display = 'none';
  }
});
</script>
```

### **2. ACTUALIZAR PROCESADOR N8N** (Prioridad ALTA)

```javascript
// En n8n-procesador-itinerarios.js

// Agregar al objeto de salida:
NOMBRE_ASESOR: body.nombre_asesor || 'No especificado',
EMAIL_ASESOR: body.email_asesor || 'info@orestravelperu.com',
HORA_IDA_TREN: body.hora_ida_tren || 'Por confirmar',
HORA_RETORNO_TREN: body.hora_retorno_tren || 'Por confirmar',
```

### **3. PROBAR EL FLUJO COMPLETO** (Prioridad MEDIA)

1. ✅ Llenar formulario con todos los datos
2. ✅ Enviar al webhook de n8n
3. ✅ Verificar que el PDF se genera correctamente
4. ✅ Confirmar que la portada muestra todos los campos
5. ✅ Validar que los cálculos son correctos

---

## 📞 Resumen Ejecutivo

### **Estado Actual:**

✅ **TEMPLATE HTML:** 100% completado
- Portada rediseñada según especificaciones
- Todas las variables mapeadas correctamente
- Nueva sección de INFORMACIÓN DEL TREN agregada
- Observaciones en sección independiente

⚠️ **FORMULARIO HTML:** 75% completado
- Faltan 2 campos críticos: `nombre_asesor`, `email_asesor`
- Faltan 2 campos opcionales: `hora_ida_tren`, `hora_retorno_tren`

⚠️ **PROCESADOR N8N:** 90% completado
- Falta mapear los 4 campos nuevos del formulario
- Resto de la lógica implementada y funcionando

### **Tiempo estimado para completar:**

- Agregar campos al formulario: **10 minutos**
- Actualizar procesador n8n: **5 minutos**
- Probar flujo completo: **15 minutos**

**TOTAL: ~30 minutos**

---

**FIN DE LA VISTA PREVIA DE LA PORTADA**
