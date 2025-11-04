# 🔍 Análisis Comparativo de Formularios
## ORES Travel Perú - Sistema de Cotizaciones

**Fecha:** 2025-11-02
**Formularios analizados:**
1. `formulario-programas-fijos.html`
2. `formulario-tour-personalizado.html`

---

## 📊 TABLA COMPARATIVA DE FUNCIONALIDADES

| Funcionalidad | Programas Fijos | Tour Personalizado | Estado |
|---------------|-----------------|-------------------|--------|
| **Protección XSS (DOMPurify)** | ✅ Sí | ✅ Sí | ✅ IGUAL |
| **Campo: nombre_asesor** | ✅ Sí (línea 1024-1026) | ❌ No | ⚠️ FALTA |
| **Campo: email_asesor** | ✅ Sí (línea 1033-1035) | ❌ No | ⚠️ FALTA |
| **Campo: hora_ida_tren** | ❌ No | ❌ No | ⚠️ FALTA EN AMBOS |
| **Campo: hora_retorno_tren** | ❌ No | ❌ No | ⚠️ FALTA EN AMBOS |
| **Cálculo automático de precio total** | ❓ Por verificar | ✅ Sí (línea 1730) | ⚠️ VERIFICAR |
| **Botón de regreso al dashboard** | ✅ Sí | ✅ Sí | ✅ IGUAL |
| **Validación de campos requeridos** | ✅ Sí | ✅ Sí | ✅ IGUAL |
| **Envío a webhook n8n** | ✅ Sí | ✅ Sí | ✅ IGUAL |
| **Modal de confirmación** | ✅ Sí | ✅ Sí | ✅ IGUAL |
| **Manejo de errores** | ✅ Sí | ✅ Sí | ✅ IGUAL |

---

## 🔎 ANÁLISIS DETALLADO

### **1️⃣ FORMULARIO: PROGRAMAS FIJOS**

**Archivo:** `formulario-programas-fijos.html`

#### ✅ **Funcionalidades IMPLEMENTADAS:**

1. **Protección XSS con DOMPurify**
   - Línea 8-9: CDN de DOMPurify 3.0.6
   ```html
   <!-- DOMPurify para protección XSS -->
   <script src="https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js"></script>
   ```

2. **Campo: Nombre del Asesor** ✅
   - Línea 1024-1026
   ```html
   <label class="form-label" for="nombre_asesor">Nombre del Asesor:</label>
   <input type="text" id="nombre_asesor" name="nombre_asesor" class="form-input"
          placeholder="Ingresa el nombre del asesor">
   ```
   - Enviado al webhook (línea 1678)
   - Incluido en vista previa (línea 1921)
   - Incluido en WhatsApp (línea 2337)

3. **Campo: Email del Asesor** ✅
   - Línea 1033-1035
   ```html
   <label class="form-label" for="email_asesor">Email del Asesor:</label>
   <input type="email" id="email_asesor" name="email_asesor" class="form-input"
          placeholder="email@orestravelperu.com">
   ```
   - Enviado al webhook (línea 1679)
   - Incluido en vista previa (línea 1922)
   - Incluido en WhatsApp (línea 2131)

4. **Estructura del formulario:**
   - Datos del cliente
   - Programa seleccionado
   - Fechas de viaje
   - Modalidad de alojamiento
   - Información del asesor (nombre + email) ✅
   - Observaciones

#### ❌ **Funcionalidades FALTANTES:**

1. **Campo: hora_ida_tren** - NO implementado
2. **Campo: hora_retorno_tren** - NO implementado
3. **Cálculo automático de precio total** - Por verificar (no encontré función calcularPrecioTotal)

---

### **2️⃣ FORMULARIO: TOUR PERSONALIZADO**

**Archivo:** `formulario-tour-personalizado.html`

#### ✅ **Funcionalidades IMPLEMENTADAS:**

1. **Protección XSS con DOMPurify**
   - Línea 8-9: CDN de DOMPurify 3.0.6
   ```html
   <!-- DOMPurify para protección XSS -->
   <script src="https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js"></script>
   ```

2. **Cálculo automático de precio total** ✅
   - Línea 1730-1753: Función `calcularPrecioTotal()`
   ```javascript
   function calcularPrecioTotal() {
       const precioPorPersona = parseFloat(document.getElementById('precioPorPersona')?.value) || 0;
       const numeroPersonas = parseInt(document.getElementById('numeroPersonas')?.value) || 0;
       const total = precioPorPersona * numeroPersonas;

       displayTotal.textContent = `S/. ${total.toFixed(2)}`;
       inputTotal.value = total.toFixed(2);

       if (precioPorPersona > 0 && numeroPersonas > 0) {
           detalleCalculo.textContent = `S/. ${precioPorPersona.toFixed(2)} × ${numeroPersonas} persona${numeroPersonas !== 1 ? 's' : ''} = S/. ${total.toFixed(2)}`;
       }
   }
   ```
   - Vinculado a inputs con `oninput="calcularPrecioTotal()"`
   - Línea 1173: precio_por_persona
   - Línea 1234: numero_personas

3. **Cálculo del precio del tren** ✅
   - Línea 1647-1667: Función `calcularPrecioTotalTren()`
   ```javascript
   function calcularPrecioTotalTren() {
       const tipoTren = document.getElementById('tipoTren')?.value;
       const precioTren = parseFloat(document.getElementById('precioTren')?.value) || 0;
       const numeroPersonas = parseInt(document.getElementById('numeroPersonas')?.value) || 0;

       if (tipoTren === 'No aplica' || precioTren === 0) {
           return 0;
       }

       return precioTren * numeroPersonas;
   }
   ```

4. **Estructura del formulario:**
   - Datos del cliente (nombre, teléfono)
   - Selección de actividades
   - Configuración de fechas
   - Tipo de habitación
   - Número de personas
   - Modalidad de precios (precio_por_persona con cálculo automático) ✅
   - Información del transporte/tren
   - Adelanto de pago
   - Observaciones

#### ❌ **Funcionalidades FALTANTES:**

1. **Campo: nombre_asesor** - NO implementado ⚠️
2. **Campo: email_asesor** - NO implementado ⚠️
3. **Campo: hora_ida_tren** - NO implementado
4. **Campo: hora_retorno_tren** - NO implementado

---

## 📋 RESUMEN DE DIFERENCIAS

### **🟢 PROGRAMAS FIJOS tiene pero TOUR PERSONALIZADO NO:**
1. ✅ Campo `nombre_asesor` (línea 1024-1026)
2. ✅ Campo `email_asesor` (línea 1033-1035)

### **🔵 TOUR PERSONALIZADO tiene pero PROGRAMAS FIJOS NO:**
1. ✅ Función `calcularPrecioTotal()` (línea 1730-1753)
2. ✅ Función `calcularPrecioTotalTren()` (línea 1647-1667)
3. ✅ Cálculo dinámico mostrado al usuario

### **🔴 AMBOS FORMULARIOS FALTAN:**
1. ❌ Campo `hora_ida_tren`
2. ❌ Campo `hora_retorno_tren`

---

## 🎯 RECOMENDACIONES

### **1️⃣ PRIORIDAD ALTA - Agregar a TOUR PERSONALIZADO**

**A. Campos del Asesor (CRÍTICO)**

Agregar estos campos después del "PASO 1: DATOS DEL CLIENTE":

```html
<!-- ========================================
     NUEVO: PASO 1.5 - DATOS DEL ASESOR
======================================== -->
<div class="form-section">
    <div class="section-header">
        <span class="section-number">1.5</span>
        <h2 class="section-title">👨‍💼 DATOS DEL ASESOR</h2>
    </div>

    <div class="form-grid">
        <!-- Nombre del Asesor -->
        <div class="form-group full-width">
            <label class="form-label" for="nombreAsesor">
                <span class="label-icon">👤</span>
                Nombre del Asesor
                <span class="required">*</span>
            </label>
            <input
                type="text"
                id="nombreAsesor"
                name="nombre_asesor"
                class="form-input"
                required
                placeholder="Ingresa el nombre completo del asesor"
            >
        </div>

        <!-- Email del Asesor -->
        <div class="form-group full-width">
            <label class="form-label" for="emailAsesor">
                <span class="label-icon">📧</span>
                Email del Asesor
                <span class="required">*</span>
            </label>
            <input
                type="email"
                id="emailAsesor"
                name="email_asesor"
                class="form-input"
                required
                placeholder="email@orestravelperu.com"
            >
        </div>
    </div>
</div>
```

**B. Actualizar el objeto de envío al webhook:**

```javascript
// En la función enviarFormulario(), agregar:
const formDataToSend = {
    // ... datos existentes ...
    nombre_asesor: document.getElementById('nombreAsesor')?.value,
    email_asesor: document.getElementById('emailAsesor')?.value,
    // ... resto de datos ...
};
```

---

### **2️⃣ PRIORIDAD MEDIA - Agregar a PROGRAMAS FIJOS**

**A. Función de cálculo automático de precio**

Agregar después de las funciones existentes:

```javascript
function calcularPrecioTotal() {
    const precioPorPersona = parseFloat(document.getElementById('precioPorPersona')?.value) || 0;
    const numeroPersonas = parseInt(document.getElementById('numeroPersonas')?.value) || 0;
    const total = precioPorPersona * numeroPersonas;

    const displayTotal = document.getElementById('precioTotalDisplay');
    const inputTotal = document.getElementById('precioTotal');
    const detalleCalculo = document.getElementById('detalleCalculo');

    if (displayTotal && inputTotal) {
        displayTotal.textContent = `S/. ${total.toFixed(2)}`;
        inputTotal.value = total.toFixed(2);
    }

    if (detalleCalculo && precioPorPersona > 0 && numeroPersonas > 0) {
        detalleCalculo.textContent = `S/. ${precioPorPersona.toFixed(2)} × ${numeroPersonas} persona${numeroPersonas !== 1 ? 's' : ''} = S/. ${total.toFixed(2)}`;
    }
}
```

**B. Vincular inputs con la función:**

```html
<input type="number" id="precioPorPersona" name="precio_por_persona"
       oninput="calcularPrecioTotal()">

<input type="number" id="numeroPersonas" name="numero_personas"
       oninput="calcularPrecioTotal()">
```

---

### **3️⃣ PRIORIDAD BAJA - Agregar a AMBOS FORMULARIOS**

**A. Campos de horarios del tren (opcional)**

Agregar en la sección de información del transporte:

```html
<!-- Horarios del Tren (solo si aplica Tren Turístico) -->
<div class="form-group" id="seccionHorariosTren" style="display: none;">
    <h4 style="margin-bottom: 12px;">⏰ Horarios del Tren</h4>

    <div class="form-grid">
        <div class="form-group">
            <label class="form-label" for="horaIdaTren">Hora de Salida (Ida)</label>
            <input
                type="time"
                id="horaIdaTren"
                name="hora_ida_tren"
                class="form-input"
            >
        </div>

        <div class="form-group">
            <label class="form-label" for="horaRetornoTren">Hora de Retorno</label>
            <input
                type="time"
                id="horaRetornoTren"
                name="hora_retorno_tren"
                class="form-input"
            >
        </div>
    </div>
</div>

<script>
// Mostrar horarios solo si es Tren Turístico
document.getElementById('tipoTren')?.addEventListener('change', function() {
    const seccionHorarios = document.getElementById('seccionHorariosTren');
    if (this.value === 'Tren Turístico' || this.value === 'Tren turístico') {
        seccionHorarios.style.display = 'block';
    } else {
        seccionHorarios.style.display = 'none';
    }
});
</script>
```

---

## 📊 MATRIZ DE IMPLEMENTACIÓN

| Tarea | Formulario | Prioridad | Tiempo Estimado | Impacto |
|-------|-----------|-----------|-----------------|---------|
| Agregar nombre_asesor | Tour Personalizado | 🔴 ALTA | 5 min | CRÍTICO |
| Agregar email_asesor | Tour Personalizado | 🔴 ALTA | 5 min | CRÍTICO |
| Agregar calcularPrecioTotal() | Programas Fijos | 🟡 MEDIA | 15 min | MEDIO |
| Agregar hora_ida_tren | Ambos | 🟢 BAJA | 10 min | BAJO |
| Agregar hora_retorno_tren | Ambos | 🟢 BAJA | 10 min | BAJO |
| Actualizar envío al webhook | Tour Personalizado | 🔴 ALTA | 3 min | CRÍTICO |

**Tiempo total estimado:** ~48 minutos

---

## ✅ CHECKLIST DE VALIDACIÓN

### **Formulario: PROGRAMAS FIJOS**
- [x] DOMPurify implementado
- [x] Campo nombre_asesor
- [x] Campo email_asesor
- [x] Envío al webhook incluye asesor
- [ ] Cálculo automático de precio total
- [ ] Campo hora_ida_tren
- [ ] Campo hora_retorno_tren

### **Formulario: TOUR PERSONALIZADO**
- [x] DOMPurify implementado
- [ ] Campo nombre_asesor ⚠️ FALTA
- [ ] Campo email_asesor ⚠️ FALTA
- [ ] Envío al webhook incluye asesor ⚠️ FALTA
- [x] Cálculo automático de precio total
- [x] Cálculo automático de precio del tren
- [ ] Campo hora_ida_tren
- [ ] Campo hora_retorno_tren

---

## 🎯 PRÓXIMOS PASOS RECOMENDADOS

### **Paso 1: Igualar funcionalidades críticas (15 minutos)**

1. **Tour Personalizado:** Agregar campos del asesor (10 min)
2. **Programas Fijos:** Agregar cálculo automático de precio (5 min)

### **Paso 2: Agregar funcionalidades opcionales (20 minutos)**

3. **Ambos formularios:** Agregar campos de horarios del tren (20 min)

### **Paso 3: Pruebas (15 minutos)**

4. Probar ambos formularios end-to-end
5. Verificar que todos los datos lleguen al webhook
6. Validar que el PDF se genere correctamente

---

## 📞 RESUMEN EJECUTIVO

### **Estado Actual:**

| Formulario | Completitud | Campos Faltantes |
|-----------|-------------|------------------|
| **Programas Fijos** | 🟡 85% | cálculo automático, horarios tren |
| **Tour Personalizado** | 🟡 85% | nombre/email asesor, horarios tren |

### **Incompatibilidad con Template PDF:**

⚠️ **PROBLEMA CRÍTICO:**
- El template PDF requiere `NOMBRE_ASESOR` y `EMAIL_ASESOR`
- **Programas Fijos:** ✅ Envía estos datos
- **Tour Personalizado:** ❌ NO envía estos datos

**Impacto:** Los PDFs generados desde Tour Personalizado mostrarán valores vacíos o "No especificado" en la portada.

### **Acción inmediata requerida:**

```
PRIORIDAD 1 (CRÍTICA):
└─ Agregar nombre_asesor y email_asesor al formulario Tour Personalizado

PRIORIDAD 2 (MEJORA):
└─ Agregar calcularPrecioTotal() al formulario Programas Fijos

PRIORIDAD 3 (OPCIONAL):
└─ Agregar horarios del tren a ambos formularios
```

---

**FIN DEL ANÁLISIS COMPARATIVO**
