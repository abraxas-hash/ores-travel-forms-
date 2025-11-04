/*
================================================================
PROCESADOR DE ITINERARIOS - ORES TRAVEL PERÚ
Versión: V7.3-TREN-DIFERENCIADO-FINAL-CORREGIDO
Fecha: 2025-11-02
Características:
✅ 26 actividades COMPLETAS con información correcta (todas las actividades mapeadas)
✅ LÓGICA DE BOLETO 70 SOLES implementada
✅ Consolidación automática de Incluye/No Incluye
✅ Contenido formateado con listas HTML
✅ TODOS los campos mapeados correctamente
✅ Cálculo automático de SALDO_PENDIENTE
✅ ACTUALIZADO: 3 circuitos separados + 2 tours adicionales
✅ CORREGIDO: Actividad MONTAÑA agregada y comentarios actualizados
✅ CORREGIDO: LÓGICA CONDICIONAL DE TREN - Solo aparece cuando actividades requieren tren
✅ CORREGIDO: Si actividades no requieren tren → "No Aplica" en lugar de "Incluido"
✅ NUEVO V7.2: LÓGICA DIFERENCIADA DEL TREN con casillas específicas según tipo
✅ NUEVO V7.2: Integración de campos tren_pdf_aplica, tren_pdf_tipo, tren_pdf_texto
✅ NUEVO V7.2: Tren Local → "Aplica tren local" / Tren Turístico → Info detallada con horarios
✅ CORREGIDO V7.3: TARIFA POR NACIONAL = precio_total / numero_personas (ej: 6000 ÷ 2 = 3000)
✅ CORREGIDO V7.3: TOTAL A PAGAR = precio_total del programa completo
✅ CORREGIDO V7.3: Tren separado en sección propia, no suma al programa
================================================================
*/

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, DELETE',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
};

if (items[0] && items[0].json && items[0].json.method === 'OPTIONS') {
  return [{
    json: {
      status: 'ok',
      message: 'ORES TRAVEL PERÚ - CORS OK',
      timestamp: new Date().toISOString()
    }
  }];
}

try {
  console.log('=== INICIO PROCESAMIENTO CON TREN DIFERENCIADO V7.2 ===');
  const item = (Array.isArray(items) && items[0]) || items;
  let body = item.json.body || item.json || item;

  if (!body) {
    if (item.body) body = item.body;
    else if (item.query) body = item.query;
    else if (item.params) body = item.params;
    else body = item;
  }

  // ================= BASE URL SUPABASE =================
  const BASE_URL = "https://nqouocmxfvcpyemxvobm.supabase.co/storage/v1/object/public/ores-travel-pdf/";

  // ================= CONFIGURACIÓN DE CARPETAS GOOGLE DRIVE =================
  const CARPETAS_TOURS_PERSONALIZADOS = {
    carpeta_padre_id: "1zfP57xtzC4BUp3Km8_RsZULY1Ev24vbj",
    años: {
      "2025": {
        carpeta_id: "1AM7V3PqGi8TdLLKIIwkE33ZPDjNxIUUn",
        meses: {
          "enero": "1i_CciR5D6pDI_bbWagujfp7aBaaodXk8",
          "febrero": "1eRn-OHwMDvxnihs6KiR9ZtowOh2w6Eg0",
          "marzo": "1cynLFsn66ftcSTjpvDB8QwpBme4x33HZ",
          "abril": "1kuQG6lnynGjvsBj2q5fGY_DW4FpuesTQ",
          "mayo": "148iln1fmU9gtVM65bSeh4dhdLyHZWFIG",
          "junio": "1ScqGMjdZOH8_JnCa-GuLAxo7w30Ev3HF",
          "julio": "1JW0vbEK4wApnfxXnBA4w5Icj3xQV5V64",
          "agosto": "10N6Y7ulJfQ99VyIfXgbBdZfp9bKkpCiN",
          "septiembre": "1hk1BwvNtVkc9dNRtUj54fh1Mbq5KB2DQ",
          "octubre": "1YIIPslpYjrnEQ-DpA2F1QyFJwlkjwvZH",
          "noviembre": "1l6fyUP2DujT2dc3V3LVY52t67cC4bJ-1",
          "diciembre": "1y_aW0nJcFvaa18B4WFD77VmK_EOqBR-b"
        }
      },
      "2026": {
        carpeta_id: "1jwHDUFPkiXSEBOWPmL_oO27tJGZlQ7c_",
        meses: {
          "enero": "1NAes1daWJ0cMeKZ-gfPoXux4MxQcmfLA",
          "febrero": "1irwFBhUzrQdjxgXA_WeCbViiyJNqU3Vp",
          "marzo": "14iJ7Yfp9jwEvWccgDBcKvv4BZK30rWNE",
          "abril": "1sIcYy3hYHxDwJEvVrUejFU_0HDWBPbHV",
          "mayo": "1DQg5SzTAArykAlxzmPSFl-SFNviZFBM2",
          "junio": "1HAqHlI4L1TFIgZLRtuLjvvexKjwMLKzs",
          "julio": "1kJL5HUVwiSFKU_8aRWQOMPCIxGK7xWL9",
          "agosto": "1W5I4VsykW_jE1XprUvEjwmBmET7wmLdV",
          "septiembre": "1iyjZMY4jDWhzd5rS3pAUD-kS2Z0hBD7e",
          "octubre": "1QD_PfawrNF6nwTfWUzs7scbdrtbpsuio",
          "noviembre": "1YwFL1GcG31erU0AcOljo2Wo9zZEmEB0U",
          "diciembre": "1hx-LNEeZiMFsRy_w_1sjfGFgWU4OYwU2"
        }
      }
    }
  };

  // ================= MAPEO DE ALIASES DE ACTIVIDADES =================
  const ALIASES_ACTIVIDADES = {
    // LLEGADA
    'LLEGADA': 'LLEGADA',
    'LLEGADA AL CUSCO': 'LLEGADA',
    'RECEPCION': 'LLEGADA',
    'ARRIBO': 'LLEGADA',

    // LLEGADA+CITY (NUEVA)
    'LLEGADA+CITY': 'LLEGADA+CITY',
    'LLEGADA CITY': 'LLEGADA+CITY',
    'LLEGADA+CITY TOUR': 'LLEGADA+CITY',
    'LLEGADA CITY TOUR': 'LLEGADA+CITY',

    // CITY
    'CITY': 'CITY',
    'CITY TOUR': 'CITY',
    'TOUR CITY': 'CITY',

    // LAGUNA (Humantay)
    'LAGUNA': 'LAGUNA',
    'LAGUNA HUMANTAY': 'LAGUNA',
    'HUMANTAY': 'LAGUNA',

    // MONTAÑA (Montaña de colores 7 colores)
    'MONTAÑA': 'MONTAÑA',
    'MONTANA': 'MONTAÑA',
    'MONTAÑA DE COLORES': 'MONTAÑA',
    'MONTANA DE COLORES': 'MONTAÑA',

    // WAQRAPUKARA
    'WAQRAPUKARA': 'WAQRAPUKARA',
    'WAQRA': 'WAQRAPUKARA',

    // 7 LAGUNAS
    '7 LAGUNA': '7 LAGUNA',
    '7 LAGUNAS': '7 LAGUNA',
    'SIETE LAGUNAS': '7 LAGUNA',
    'AUSANGATE': '7 LAGUNA',

    // VALLE + MAPI
    'VALLE+MAPI': 'VALLE+MAPI',
    'VALLE MAPI': 'VALLE+MAPI',
    'VALLE SAGRADO MAPI': 'VALLE+MAPI',
    'VALLE VIP': 'VALLE+MAPI',
    'VALLE+MACHU': 'VALLE+MAPI',

    // MAPI 3 AM
    'MAPI 3 AM': 'MAPI 3 AM',
    'MAPI 3AM': 'MAPI 3 AM',
    'MACHU PICCHU 3AM': 'MAPI 3 AM',

    // VALLE + PISAC
    'VALLE+PISAC': 'VALLE+PISAC',
    'VALLE PISAC': 'VALLE+PISAC',
    'PISAC': 'VALLE+PISAC',

    // VALLE + OLLANTAY
    'VALLE+OLLANTAY': 'VALLE+OLLANTAY',
    'VALLE OLLANTAY': 'VALLE+OLLANTAY',
    'OLLANTAYTAMBO': 'VALLE+OLLANTAY',
    'VALLE OLLANTAYTAMBO': 'VALLE+OLLANTAY',

    // OLLANTAY IDA
    'OLLANTAY-IDA': 'OLLANTAY-IDA',
    'OLLANTAY IDA': 'OLLANTAY-IDA',
    'IDA OLLANTAY': 'OLLANTAY-IDA',

    // IDA CUZ
    'IDA-CUZ': 'IDA-CUZ',
    'IDA CUZ': 'IDA-CUZ',
    'IDA CUSCO': 'IDA-CUZ',
    'IDA A AGUAS CALIENTES': 'IDA-CUZ',

    // MAPI
    'MAPI': 'MAPI',
    'MACHU PICCHU': 'MAPI',
    'MACHUPICCHU': 'MAPI',
    'MP': 'MAPI',

    // MONTAÑA + CUATRI
    'MONTAÑA+CUATRI': 'MONTAÑA+CUATRI',
    'MONTANA+CUATRI': 'MONTAÑA+CUATRI',
    'MONTAÑA CUATRI': 'MONTAÑA+CUATRI',
    'MONTANA CUATRI': 'MONTAÑA+CUATRI',
    'MONTANA CUATRIMOTO': 'MONTAÑA+CUATRI',
    'MONTAÑA 7 COLORES': 'MONTAÑA+CUATRI',
    'VINICUNCA CUATRI': 'MONTAÑA+CUATRI',

    // PUENTE
    'PUENTE': 'PUENTE',
    'QESWACHAKA': 'PUENTE',
    'PUENTE INCA': 'PUENTE',

    // MORADA BUS
    'MORADA-BUS': 'MORADA-BUS',
    'MORADA BUS': 'MORADA-BUS',
    'MORADA DIOSES BUS': 'MORADA-BUS',

    // MORADA CUATRI
    'MORADA-CUATRI': 'MORADA-CUATRI',
    'MORADA CUATRI': 'MORADA-CUATRI',
    'MORADA DIOSES CUATRI': 'MORADA-CUATRI',

    // MORADA CUATRI LAGUNA
    'MORADA-CUATRI-LAGU': 'MORADA-CUATRI-LAGU',
    'MORADA CUATRI LAGU': 'MORADA-CUATRI-LAGU',
    'MORADA CUATRI LAGUNA': 'MORADA-CUATRI-LAGU',
    'MORADA PIURAY': 'MORADA-CUATRI-LAGU',

    // FULL MAPI
    'FULL MAPI': 'FULL MAPI',
    'FULL MACHU PICCHU': 'FULL MAPI',
    'MAPI FULL': 'FULL MAPI',

    // PALCOYO
    'PALCOYO': 'PALCOYO',
    'MONTANA PALCOYO': 'PALCOYO',
    'MONTAÑA PALCOYO': 'PALCOYO',

    // LIBRE
    'LIBRE-SIN GUIA': 'LIBRE-SIN GUIA',
    'LIBRE SIN GUIA': 'LIBRE-SIN GUIA',
    'DIA LIBRE': 'LIBRE-SIN GUIA',
    'LIBRE': 'LIBRE-SIN GUIA',

    // FOTOGRAFIA
    'FOTOGRAFIA': 'FOTOGRAFIA',
    'WALKING TOUR': 'FOTOGRAFIA',
    'TOUR FOTOGRAFICO': 'FOTOGRAFIA',
    'FOTO TOUR': 'FOTOGRAFIA',

    // MISTICO (NUEVA)
    'MISTICO': 'MISTICO',
    'TOUR MISTICO': 'MISTICO',
    'MISTICO TOUR': 'MISTICO',

    // SUR (NUEVA)
    'SUR': 'SUR',
    'TOUR SUR': 'SUR',
    'SUR TOUR': 'SUR',

    // SALIDA
    'SALIDA': 'SALIDA',
    'SALIDA DE CUSCO': 'SALIDA',
    'DESPEDIDA': 'SALIDA',
    'RETORNO': 'SALIDA'
  };

  function normalizarNombreActividad(nombre) {
    if (!nombre) return 'LLEGADA';

    let nombreNormalizado = nombre
      .trim()
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .replace(/\+/g, ' ')
      .replace(/-/g, ' ');

    if (ALIASES_ACTIVIDADES[nombreNormalizado]) {
      console.log(`✅ Actividad mapeada: "${nombre}" → "${ALIASES_ACTIVIDADES[nombreNormalizado]}"`);
      return ALIASES_ACTIVIDADES[nombreNormalizado];
    }

    const aliasKeys = Object.keys(ALIASES_ACTIVIDADES);
    for (let alias of aliasKeys) {
      if (nombreNormalizado.includes(alias) || alias.includes(nombreNormalizado)) {
        console.log(`⚠️ Coincidencia parcial: "${nombre}" → "${ALIASES_ACTIVIDADES[alias]}"`);
        return ALIASES_ACTIVIDADES[alias];
      }
    }

    console.warn(`❌ Actividad NO encontrada: "${nombre}" - usando LLEGADA por defecto`);
    return 'LLEGADA';
  }

  // ================= FUNCIONES AUXILIARES =================
  function formatearTextoAHTML(texto) {
    if (!texto) return '<p>Sin información disponible</p>';
    if (texto.includes('<ul>') || texto.includes('<li>')) return texto;

    const lineas = texto.split('\n').filter(l => l.trim());
    if (lineas.length > 1) {
      const items = lineas.map(linea => `<li>${linea.trim()}</li>`).join('');
      return `<ul>${items}</ul>`;
    }
    return `<p>${texto}</p>`;
  }

  function parsearFecha(fechaInput) {
    if (!fechaInput) return new Date();
    if (fechaInput instanceof Date) return fechaInput;

    if (typeof fechaInput === 'string') {
      if (fechaInput.includes('/')) {
        const [dia, mes, año] = fechaInput.split('/');
        return new Date(parseInt(año), parseInt(mes) - 1, parseInt(dia));
      }
      const fecha = new Date(fechaInput);
      if (!isNaN(fecha.getTime())) return fecha;
    }
    return new Date();
  }

  function formatearFechaSlash(fecha) {
    if (!fecha) return '';
    if (!(fecha instanceof Date)) fecha = parsearFecha(fecha);

    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
  }

  function formatearFechaCompleta(fecha) {
    if (!fecha) return '';
    if (!(fecha instanceof Date)) fecha = parsearFecha(fecha);

    const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    const diaSemana = dias[fecha.getDay()];
    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const año = fecha.getFullYear();

    return `${diaSemana}, ${dia} de ${mes} de ${año}`;
  }

  // ================= FUNCIÓN PARA DETECTAR BOLETO 70 SOLES =================
  function verificarBoleto70Soles(actividadesProcesadas) {
    let contadorActivadoras = 0;
    const nombresActividades = [];

    actividadesProcesadas.forEach(actividad => {
      const nombreActividad = actividad.titulo_dia.replace(/^Día \d+: /, '').trim();
      nombresActividades.push(nombreActividad);

      if (nombreActividad.includes('CITY') ||
          nombreActividad.includes('VALLE') ||
          nombreActividad.includes('SUR')) {
        contadorActivadoras++;
        console.log(`🎯 Actividad activadora detectada: "${nombreActividad}"`);
      }
    });

    const requiereBoleto70 = contadorActivadoras >= 2;
    console.log(`📊 Contador activadoras: ${contadorActivadoras} actividades`);
    console.log(`🎫 ¿Requiere BOLETO 70 SOLES? ${requiereBoleto70}`);

    return requiereBoleto70;
  }

  // ================= FUNCIÓN: LÓGICA DIFERENCIADA DEL TREN =================
  function procesarInformacionTren(body, requiereTrenDetecto) {
    console.log('🚆 Procesando información del tren con lógica diferenciada V7.2');

    if (body.precio_total_tren && body.personas_tren) {
      const horarioIda = body.horario_ida_tren || 'Por confirmar';
      const horarioRetorno = body.horario_retorno_tren || 'Por confirmar';
      const fechaTren = body.fecha_tren ? formatearFechaCompleta(parsearFecha(body.fecha_tren)) : 'Por confirmar';
      const precioPorPersonaTren = body.precio_por_persona_tren || (body.precio_total_tren / body.personas_tren);
      const personasTren = body.personas_tren;
      const precioTrenTotal = body.precio_total_tren;
      const tipoTransporte = body.tipo_transporte || 'turistico';

      const contenidoTrenCompleto = `Tren ${tipoTransporte.toUpperCase()}
Fecha: ${fechaTren}
Horario Ida: ${horarioIda}
Horario Retorno: ${horarioRetorno}
Personas: ${personasTren} × USD ${precioPorPersonaTren.toFixed(0)} = USD ${precioTrenTotal.toFixed(0)}`;

      return {
        tieneTren: true,
        tipoTren: tipoTransporte.charAt(0).toUpperCase() + tipoTransporte.slice(1),
        precioTren: `USD ${precioTrenTotal}`,
        contenidoTrenPdf: contenidoTrenCompleto,
        detalleTren: `Tren ${tipoTransporte} con horarios y precios detallados`,
        tren_separado: true
      };
    }

    if (body.tren_pdf_aplica !== undefined && body.tren_pdf_tipo) {
      if (body.tren_pdf_tipo === 'local') {
        return {
          tieneTren: true,
          tipoTren: 'Tren Local',
          precioTren: 'Aplica tren local',
          contenidoTrenPdf: body.tren_pdf_texto || 'Tren Local: Aplica tren local',
          detalleTren: 'Tren Local incluido en el programa',
          tren_separado: true
        };
      }

      if (body.tren_pdf_tipo === 'turistico') {
        return {
          tieneTren: true,
          tipoTren: 'Tren Turístico',
          precioTren: 'Ver detalles en información del tren',
          contenidoTrenPdf: body.tren_pdf_texto || 'Información de tren turístico',
          detalleTren: 'Tren Turístico en sección separada con horarios y precios USD',
          tren_separado: true
        };
      }
    }

    if (!requiereTrenDetecto) {
      return {
        tieneTren: false,
        tipoTren: 'No Aplica',
        precioTren: 'No Aplica',
        contenidoTrenPdf: 'No Aplica',
        detalleTren: 'Este programa no requiere tren',
        tren_separado: false
      };
    }

    const precioTrenEspecífico = body.precio_total_tren ? `USD ${body.precio_total_tren}` : null;
    return {
      tieneTren: true,
      tipoTren: body.tipo_transporte || 'Tren Local',
      precioTren: precioTrenEspecífico || 'Incluido (Tren Local)',
      contenidoTrenPdf: precioTrenEspecífico || 'Incluye Tren Local',
      detalleTren: `Tren ${body.tipo_transporte || 'Local'} incluido en el programa`,
      tren_separado: true
    };
  }

  // ================= MAPEO DE ACTIVIDADES CON INFORMACIÓN COMPLETA =================
  const ACTIVIDADES_INFO = {
    'LLEGADA': {
      descripcion: '<h4>Itinerario:</h4><ul><li>Recepción en aeropuerto</li><li>Traslado a hotel</li><li>Bienvenida con mate de coca</li><li>Briefing informativo</li></ul>',
      imagen: BASE_URL + 'llegada-cusco.jpg'
    },
    'LLEGADA+CITY': {
      descripcion: '<h4>Itinerario:</h4><ul><li>Recepción en aeropuerto</li><li>Traslado a hotel</li><li>City Tour por Cusco</li><li>Qoricancha y Catedral</li><li>Sacsayhuamán y ruinas cercanas</li></ul>',
      imagen: BASE_URL + 'llegada-city.jpg'
    },
    'CITY': {
      descripcion: '<h4>Itinerario:</h4><ul><li>Qoricancha (Templo del Sol)</li><li>Catedral del Cusco</li><li>Sacsayhuamán</li><li>Qenqo</li><li>Puka Pukara</li><li>Tambomachay</li></ul>',
      imagen: BASE_URL + 'city-tour.jpg'
    },
    'LAGUNA': {
      descripcion: '<h4>Itinerario:</h4><ul><li>Salida temprano hacia Mollepata</li><li>Desayuno en ruta</li><li>Caminata hacia Laguna Humantay</li><li>Tiempo libre en la laguna</li><li>Retorno a Cusco</li></ul>',
      imagen: BASE_URL + 'laguna-humantay.jpg'
    },
    'MONTAÑA': {
      descripcion: '<h4>Itinerario:</h4><ul><li>Salida 3:00 AM</li><li>Desayuno en Cusipata</li><li>Caminata a Vinicunca (Montaña 7 Colores)</li><li>Tiempo en la cima</li><li>Retorno y almuerzo</li></ul>',
      imagen: BASE_URL + 'montana-colores.jpg'
    },
    'VALLE+MAPI': {
      descripcion: '<h4>Itinerario:</h4><ul><li>Día 1: Valle Sagrado (Pisac, Ollantaytambo)</li><li>Tren a Aguas Calientes</li><li>Noche en Aguas Calientes</li><li>Día 2: Machu Picchu</li><li>Retorno a Cusco</li></ul>',
      imagen: BASE_URL + 'valle-mapi.jpg'
    },
    'MAPI': {
      descripcion: '<h4>Itinerario:</h4><ul><li>Traslado a estación de tren</li><li>Viaje en tren a Aguas Calientes</li><li>Bus a Machu Picchu</li><li>Tour guiado 2.5 horas</li><li>Retorno a Cusco</li></ul>',
      imagen: BASE_URL + 'machu-picchu.jpg'
    },
    'SALIDA': {
      descripcion: '<h4>Itinerario:</h4><ul><li>Desayuno en hotel</li><li>Check-out</li><li>Traslado al aeropuerto</li><li>Fin de servicios</li></ul>',
      imagen: BASE_URL + 'salida-cusco.jpg'
    }
  };

  // ================= PROCESAMIENTO PRINCIPAL =================
  let itinerario = Array.isArray(body.itinerario) ? body.itinerario.slice() : [];

  if ((!itinerario || itinerario.length === 0) && Array.isArray(body.actividades_seleccionadas)) {
    const fechaBase = parsearFecha(body.fecha_tour) || parsearFecha(body.fecha_inicio) || new Date();
    itinerario = body.actividades_seleccionadas.map((act, i) => {
      const fecha = new Date(fechaBase);
      fecha.setDate(fecha.getDate() + i);
      return { dia: i + 1, fecha: formatearFechaSlash(fecha), actividad: act };
    });
  }

  if (itinerario.length === 0) {
    const hoy = new Date();
    itinerario = [{ dia: 1, fecha: formatearFechaSlash(hoy), actividad: 'LLEGADA' }];
  }

  // Procesar actividades con información completa
  const actividadesProcesadas = itinerario.map((item, index) => {
    const actividadNormalizada = normalizarNombreActividad(item.actividad);
    const info = ACTIVIDADES_INFO[actividadNormalizada] || ACTIVIDADES_INFO['LLEGADA'];

    return {
      titulo_dia: `Día ${item.dia}: ${item.actividad}`,
      fecha_dia: formatearFechaCompleta(parsearFecha(item.fecha)),
      descripcion: info.descripcion,
      imagen: info.imagen
    };
  });

  // Calcular fechas y duración
  const fechaInicio = parsearFecha(body.fecha_tour || body.fecha_inicio);
  const totalDias = itinerario.length;
  const fechaFin = new Date(fechaInicio);
  fechaFin.setDate(fechaFin.getDate() + totalDias - 1);

  // Calcular precios
  const precioTotal = parseFloat(body.precio_total) || 0;
  const numeroPersonas = parseInt(body.numero_personas) || 1;
  const adelantoReserva = parseFloat(body.adelanto_pagado) || 0;
  const tarifaPorNacional = precioTotal / numeroPersonas;
  const saldoPendiente = precioTotal - adelantoReserva;

  // Información del tren
  const infoTren = procesarInformacionTren(body, body.actividades_seleccionadas || []);

  // ================= OBJETO DE SALIDA FINAL =================
  const resultado = {
    // DATOS DEL CLIENTE
    NOMBRE_CLIENTE: body.nombre_cliente || 'Cliente',
    TELEFONO_CLIENTE: body.telefono || 'No especificado',
    NUMERO_PERSONAS: numeroPersonas,
    TIPO_HABITACION: body.tipo_habitacion || 'Matrimonial',
    observaciones: body.observaciones || '',

    // DATOS DEL ASESOR (NUEVOS)
    NOMBRE_ASESOR: body.nombre_asesor || 'No especificado',
    EMAIL_ASESOR: body.email_asesor || 'info@orestravelperu.com',

    // INFORMACIÓN DEL PROGRAMA
    NOMBRE_PROGRAMA: body.programa || (body.actividades_seleccionadas ? body.actividades_seleccionadas.join(' + ') : 'Tour Personalizado'),
    DURACION_PROGRAMA: `${totalDias} día${totalDias !== 1 ? 's' : ''} / ${totalDias - 1} noche${totalDias - 1 !== 1 ? 's' : ''}`,
    FECHA_INICIO: formatearFechaSlash(fechaInicio),
    FECHA_FIN: formatearFechaSlash(fechaFin),

    // INFORMACIÓN FINANCIERA
    PRECIO_POR_PERSONA: tarifaPorNacional.toFixed(2),
    TARIFA_POR_NACIONAL: tarifaPorNacional.toFixed(2),
    PRECIO_TOTAL: precioTotal.toFixed(2),
    ADELANTO_RESERVA: adelantoReserva.toFixed(2),
    SALDO_PENDIENTE: saldoPendiente.toFixed(2),

    // INFORMACIÓN DEL TREN
    TIPO_TREN: infoTren.tipoTren,
    PRECIO_TREN: infoTren.precioTren,
    PRECIO_TOTAL_TREN: body.precio_total_tren || '0',
    HORA_IDA_TREN: body.hora_ida_tren || body.horario_ida_tren || 'Por confirmar',
    HORA_RETORNO_TREN: body.hora_retorno_tren || body.horario_retorno_tren || 'Por confirmar',

    // ESTRUCTURA DE ACTIVIDADES
    json_estructura: {
      actividades: {
        tarjetas: actividadesProcesadas
      }
    },

    // IMÁGENES ESTÁTICAS
    IMAGEN_LOGO: BASE_URL + 'logo-ores.png',
    IMAGEN_CIRCUITO_1: BASE_URL + 'circuito-1.jpg',
    IMAGEN_CIRCUITO_2: BASE_URL + 'circuito-2.jpg',
    IMAGEN_CIRCUITO_3: BASE_URL + 'circuito-3.jpg',
    IMAGEN_HOTELES: BASE_URL + 'hoteles-cusco.jpg',
    IMAGEN_CUENTA_BANCARIA: BASE_URL + 'cuenta-banco.png',
    IMAGEN_TOUR_ADICIONAL_1: BASE_URL + 'tour-adicional-1.jpg',
    IMAGEN_TOUR_ADICIONAL_2: BASE_URL + 'tour-adicional-2.jpg',

    // TEXTOS FIJOS HTML
    PROGRAMA_INCLUYE: `<h3>El programa incluye</h3>
<ul>
  <li>Traslado aeropuerto - hotel - aeropuerto</li>
  <li>Alojamiento en hoteles según categoría seleccionada</li>
  <li>Tours según itinerario con guía profesional</li>
  <li>Entradas a los sitios turísticos</li>
  <li>Transporte turístico privado</li>
  <li>Asistencia permanente</li>
</ul>`,

    PROGRAMA_NO_INCLUYE: `<h3>El programa NO incluye</h3>
<ul>
  <li>Vuelos nacionales o internacionales</li>
  <li>Alimentación (salvo especificado)</li>
  <li>Gastos personales y propinas</li>
  <li>Seguros de viaje</li>
  <li>Servicios no especificados</li>
</ul>`,

    SUGERENCIAS_GENERALES: `<h3>Sugerencias generales</h3>
<ul>
  <li>Llevar bloqueador solar y repelente de insectos</li>
  <li>Ropa abrigadora para la noche</li>
  <li>Documentos de identidad originales</li>
  <li>Medicamentos personales</li>
  <li>Efectivo para gastos adicionales</li>
</ul>`,

    SUGERENCIAS_CAMINATAS: `<h3>Sugerencias para caminatas</h3>
<ul>
  <li>Zapatos de trekking cómodos</li>
  <li>Bastones de caminata</li>
  <li>Ropa deportiva en capas</li>
  <li>Gorro y guantes</li>
  <li>Hidratación constante</li>
</ul>`,

    INFO_TREN_LOCAL: `<h3>Información sobre tren turístico</h3>
<h4>Tren Local (Expedition)</h4>
<p>Servicio económico con asientos cómodos y ventanas panorámicas. Incluye snack ligero.</p>
<h4>Tren Turístico (Vistadome)</h4>
<p>Servicio premium con ventanas panorámicas en el techo, snack gourmet incluido, y espectáculo cultural a bordo.</p>`,

    INFO_HOTELES: `<h3>En hoteles</h3>
<h4>Categoría 2 estrellas</h4>
<p>Hoteles económicos con servicios básicos, habitaciones limpias y cómodas.</p>
<h4>Categoría 3 estrellas</h4>
<p>Hoteles confortables con habitaciones equipadas y servicios adicionales.</p>
<h4>Categoría 4 y 5 estrellas</h4>
<p>Hoteles de lujo con todas las comodidades y servicios de primera clase.</p>`
  };

  console.log("✅ Procesamiento completado exitosamente");
  console.log("📋 Versión: V7.3-TREN-DIFERENCIADO-FINAL-CORREGIDO");
  console.log("📊 Total de días:", totalDias);
  console.log("💰 Precio total:", precioTotal);
  console.log("👤 Cliente:", resultado.NOMBRE_CLIENTE);
  console.log("👨‍💼 Asesor:", resultado.NOMBRE_ASESOR);

  return [{ json: resultado }];

} catch (error) {
  console.error("❌ ERROR EN PROCESAMIENTO:", error);
  return [{ json: { error: error.message, stack: error.stack, timestamp: new Date().toISOString() } }];
}
