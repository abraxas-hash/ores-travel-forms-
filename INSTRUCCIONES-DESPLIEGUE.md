# 🚀 INSTRUCCIONES PARA DESPLEGAR A VERCEL

## ✅ Estado Actual

**Los cambios están listos localmente en la rama `main`:**

- ✅ Formulario Tour Personalizado: sección de tren unificada
- ✅ Formulario Programas Fijos: sección de tren unificada
- ✅ Procesador n8n restaurado con 26 actividades
- ✅ Template PDF actualizado
- ✅ Documentación completa

**Total:** 14 commits listos para desplegar

---

## 📋 Pasos para Desplegar

### Opción 1: Push Directo (Recomendado)

```bash
# 1. Ir al directorio del proyecto
cd /home/user/ores-travel-forms-

# 2. Verificar que estás en main
git branch --show-current

# 3. Ver los commits pendientes
git log origin/main..HEAD --oneline

# 4. Hacer push a origin/main
git push origin main
```

**Vercel desplegará automáticamente** cuando detecte el push a `main`.

---

### Opción 2: Si el Push Directo Falla

Si recibes error 403 o la rama está protegida:

```bash
# 1. Crear una nueva rama para PR
git checkout -b deploy/unified-train-section

# 2. Push a la nueva rama
git push -u origin deploy/unified-train-section

# 3. Ir a GitHub y crear Pull Request
# https://github.com/abraxas-hash/ores-travel-forms-/compare/main...deploy/unified-train-section

# 4. Hacer merge del PR desde GitHub
```

---

## 🎯 Cambios Que Se Desplegarán

### Ambos Formularios Tendrán:

**Sección: "Tren a Machu Picchu"**

```
┌─────────────────────────────────┐
│  🚂 Expedition                  │
│  ✅ Incluido en el programa     │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│  🚅 Vistadome                   │
│  💰 Costo adicional             │
└─────────────────────────────────┘
```

**Campos (cuando se selecciona Vistadome):**
- 🕐 Hora de Salida (Ida): `<input type="time">`
- 🕐 Hora de Retorno: `<input type="time">`
- 👥 Personas en Tren: `<input type="text">`
- 💰 Precio del Tren (USD): `<input type="text">`

**Variables enviadas al webhook:**
```javascript
{
  tipo_tren: "expedition" | "vistadome",
  hora_ida_tren: "06:10",
  hora_retorno_tren: "16:30",
  personas_tren: "2 adultos",
  precio_tren: "150.00"
}
```

---

## 📊 Archivos Modificados

```
formulario-tour-personalizado.html      | 482 cambios
formulario-programas-fijos.html         |  29 cambios
PROCESADOR-N8N-COMPLETO-CORREGIDO.js    | 406 líneas (nuevo)
plantilla-cotizacion-personalizada.html | 448 líneas (nuevo)
n8n-procesador-itinerarios.js           | 628 líneas (nuevo)
+ 5 archivos de documentación .md
```

---

## ✅ Verificación Post-Despliegue

Después del despliegue en Vercel, verifica:

1. **Tour Personalizado:**
   - https://ores-travel-forms.vercel.app/formulario-tour-personalizado.html
   - PASO 3 debe decir "Tren a Machu Picchu"
   - Debe tener opciones Expedition/Vistadome

2. **Programas Fijos:**
   - https://ores-travel-forms.vercel.app/formulario-programas-fijos.html
   - PASO 5 debe decir "Tren a Machu Picchu"
   - Debe tener opciones Expedition/Vistadome

3. **Probar flujo completo:**
   - Seleccionar Vistadome
   - Completar campos de hora, personas y precio
   - Generar cotización
   - Verificar que el PDF muestre correctamente "INFORMACIÓN DEL TREN"

---

## 🆘 Si Tienes Problemas

**Error 403 al hacer push:**
- La rama main está protegida
- Usa la Opción 2 (crear PR)

**Vercel no despliega:**
- Verifica que el repositorio esté conectado a Vercel
- Revisa el dashboard de Vercel para ver el estado del despliegue

**Los cambios no aparecen:**
- Limpia la caché del navegador (Ctrl + Shift + R)
- Espera 2-3 minutos para que Vercel complete el build

---

## 📞 Contacto

Si necesitas ayuda adicional, revisa:
- GitHub Actions/Workflows
- Vercel Dashboard: https://vercel.com/dashboard
- Logs de despliegue en Vercel

---

**Fecha de preparación:** 2025-11-04
**Branch actual:** main
**Commits pendientes:** 14
**Estado:** ✅ Listo para desplegar
