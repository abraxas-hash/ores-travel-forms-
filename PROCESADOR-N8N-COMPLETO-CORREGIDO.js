/*
================================================================
PROCESADOR DE ITINERARIOS - ORES TRAVEL PERÚ
Versión: V7.3-COMPLETO-CORREGIDO
Fecha: 2025-11-02
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
  console.log('=== INICIO PROCESAMIENTO V7.3 COMPLETO ===');
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

  // ================= FUNCIONES AUXILIARES =================
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

  // ================= MAPEO COMPLETO DE 26 ACTIVIDADES =================
  const ACTIVIDADES_MAPPING = {
    'LLEGADA': {
      nombre: 'LLEGADA AL CUSCO',
      descripcion: 'Recepción en el aeropuerto y traslado al hotel. Bienvenida con mate de coca y briefing informativo sobre el programa.',
      incluye: ['Traslado aeropuerto - hotel', 'Mate de coca de bienvenida', 'Briefing del tour'],
      no_incluye: ['Alimentación', 'Actividades extras'],
      imagen: BASE_URL + 'llegada-cusco.jpg'
    },
    'LLEGADA+CITY': {
      nombre: 'LLEGADA + CITY TOUR',
      descripcion: 'Recepción en aeropuerto, traslado a hotel y City Tour por Cusco visitando Qoricancha, Catedral y ruinas incas.',
      incluye: ['Traslado aeropuerto - hotel', 'City Tour Cusco', 'Guía profesional', 'Entradas'],
      no_incluye: ['Alimentación', 'Boleto turístico'],
      imagen: BASE_URL + 'llegada-city.jpg'
    },
    'CITY': {
      nombre: 'CITY TOUR CUSCO',
      descripcion: 'Tour por la ciudad del Cusco visitando Qoricancha, Catedral, Sacsayhuamán, Qenqo, Puka Pukara y Tambomachay.',
      incluye: ['Transporte turístico', 'Guía profesional', 'Entradas a sitios'],
      no_incluye: ['Alimentación', 'Propinas'],
      imagen: BASE_URL + 'city-tour.jpg'
    },
    'LAGUNA': {
      nombre: 'LAGUNA HUMANTAY',
      descripcion: 'Excursión a la hermosa Laguna Humantay. Salida temprano, caminata de 2 horas hasta la laguna turquesa.',
      incluye: ['Transporte', 'Desayuno', 'Almuerzo', 'Guía', 'Entrada'],
      no_incluye: ['Caballo (opcional)', 'Propinas'],
      imagen: BASE_URL + 'laguna-humantay.jpg'
    },
    'MONTAÑA': {
      nombre: 'MONTAÑA DE 7 COLORES',
      descripcion: 'Caminata a Vinicunca, la famosa Montaña de 7 Colores. Salida 3:00 AM, caminata de 3 horas.',
      incluye: ['Transporte', 'Desayuno', 'Almuerzo', 'Guía', 'Entrada'],
      no_incluye: ['Caballo (opcional)', 'Bastones'],
      imagen: BASE_URL + 'montana-colores.jpg'
    },
    'WAQRAPUKARA': {
      nombre: 'WAQRAPUKARA',
      descripcion: 'Fortaleza inca poco visitada. Caminata moderada con vistas espectaculares de los Andes.',
      incluye: ['Transporte', 'Desayuno', 'Almuerzo', 'Guía', 'Entrada'],
      no_incluye: ['Snacks extras', 'Propinas'],
      imagen: BASE_URL + 'waqrapukara.jpg'
    },
    '7 LAGUNA': {
      nombre: '7 LAGUNAS DE AUSANGATE',
      descripcion: 'Caminata completa por las 7 lagunas de colores alrededor del Ausangate. Tour de día completo.',
      incluye: ['Transporte', 'Desayuno', 'Almuerzo', 'Guía', 'Entrada'],
      no_incluye: ['Propinas', 'Bebidas extras'],
      imagen: BASE_URL + '7-lagunas.jpg'
    },
    'VALLE+MAPI': {
      nombre: 'VALLE SAGRADO + MACHU PICCHU',
      descripcion: 'Tour de 2 días: Día 1 Valle Sagrado, tren a Aguas Calientes. Día 2 Machu Picchu y retorno.',
      incluye: ['Transporte', 'Tren', 'Bus', 'Guía', 'Entradas', '1 noche hotel'],
      no_incluye: ['Alimentación', 'Actividades extras'],
      imagen: BASE_URL + 'valle-mapi.jpg'
    },
    'MAPI 3 AM': {
      nombre: 'MACHU PICCHU 3 AM',
      descripcion: 'Machu Picchu con salida 3 AM para ver el amanecer. Incluye tren, bus y tour guiado.',
      incluye: ['Tren', 'Bus', 'Guía', 'Entrada Machu Picchu'],
      no_incluye: ['Alimentación', 'Huayna Picchu'],
      imagen: BASE_URL + 'mapi-3am.jpg'
    },
    'VALLE+PISAC': {
      nombre: 'VALLE SAGRADO + PISAC',
      descripcion: 'Tour por el Valle Sagrado visitando Pisac, su mercado artesanal y sitio arqueológico.',
      incluye: ['Transporte', 'Guía', 'Entradas'],
      no_incluye: ['Almuerzo', 'Compras en mercado'],
      imagen: BASE_URL + 'valle-pisac.jpg'
    },
    'VALLE+OLLANTAY': {
      nombre: 'VALLE SAGRADO + OLLANTAYTAMBO',
      descripcion: 'Valle Sagrado visitando Ollantaytambo, fortaleza inca viva con habitantes originales.',
      incluye: ['Transporte', 'Guía', 'Entradas'],
      no_incluye: ['Almuerzo', 'Actividades extras'],
      imagen: BASE_URL + 'valle-ollantay.jpg'
    },
    'OLLANTAY-IDA': {
      nombre: 'TRASLADO A OLLANTAYTAMBO',
      descripcion: 'Traslado desde Cusco hasta Ollantaytambo para tomar el tren a Aguas Calientes.',
      incluye: ['Transporte privado'],
      no_incluye: ['Tren', 'Alimentación'],
      imagen: BASE_URL + 'ollantay-ida.jpg'
    },
    'IDA-CUZ': {
      nombre: 'TRASLADO A AGUAS CALIENTES',
      descripcion: 'Traslado desde Cusco hasta estación de tren para ir a Aguas Calientes (Machu Picchu Pueblo).',
      incluye: ['Transporte hasta estación'],
      no_incluye: ['Tren', 'Bus'],
      imagen: BASE_URL + 'ida-cuz.jpg'
    },
    'MAPI': {
      nombre: 'MACHU PICCHU',
      descripcion: 'Tour guiado a Machu Picchu, una de las 7 maravillas del mundo. Incluye tren, bus y guía.',
      incluye: ['Tren', 'Bus', 'Guía profesional', 'Entrada'],
      no_incluye: ['Alimentación', 'Huayna Picchu'],
      imagen: BASE_URL + 'machu-picchu.jpg'
    },
    'MONTAÑA+CUATRI': {
      nombre: 'MONTAÑA 7 COLORES EN CUATRIMOTO',
      descripcion: 'Montaña de colores con adrenalina. Incluye cuatrimoto hasta punto cercano y caminata corta.',
      incluye: ['Transporte', 'Cuatrimoto', 'Desayuno', 'Almuerzo', 'Guía', 'Entrada'],
      no_incluye: ['Seguro extra', 'Propinas'],
      imagen: BASE_URL + 'montana-cuatri.jpg'
    },
    'PUENTE': {
      nombre: 'PUENTE INCA QESWACHAKA',
      descripcion: 'Visita al último puente inca de cuerdas, renovado anualmente por comunidades locales.',
      incluye: ['Transporte', 'Guía', 'Entrada'],
      no_incluye: ['Alimentación'],
      imagen: BASE_URL + 'puente-inca.jpg'
    },
    'MORADA-BUS': {
      nombre: 'MORADA DE LOS DIOSES EN BUS',
      descripcion: 'Formaciones rocosas naturales espectaculares. Tour en bus con paradas fotográficas.',
      incluye: ['Transporte', 'Guía', 'Entrada'],
      no_incluye: ['Alimentación', 'Propinas'],
      imagen: BASE_URL + 'morada-bus.jpg'
    },
    'MORADA-CUATRI': {
      nombre: 'MORADA DE LOS DIOSES EN CUATRIMOTO',
      descripcion: 'Morada de los Dioses con aventura en cuatrimoto por paisajes andinos únicos.',
      incluye: ['Transporte', 'Cuatrimoto', 'Guía', 'Entrada'],
      no_incluye: ['Alimentación', 'Seguro'],
      imagen: BASE_URL + 'morada-cuatri.jpg'
    },
    'MORADA-CUATRI-LAGU': {
      nombre: 'MORADA + LAGUNA PIURAY EN CUATRIMOTO',
      descripcion: 'Combo: Morada de los Dioses y Laguna Piuray. Incluye cuatrimoto y visitas guiadas.',
      incluye: ['Transporte', 'Cuatrimoto', 'Guía', 'Entradas'],
      no_incluye: ['Alimentación'],
      imagen: BASE_URL + 'morada-laguna.jpg'
    },
    'FULL MAPI': {
      nombre: 'MACHU PICCHU FULL DAY',
      descripcion: 'Machu Picchu en un día completo. Salida temprano, tour guiado y retorno mismo día.',
      incluye: ['Tren', 'Bus', 'Guía', 'Entrada'],
      no_incluye: ['Alimentación', 'Montañas adicionales'],
      imagen: BASE_URL + 'full-mapi.jpg'
    },
    'PALCOYO': {
      nombre: 'MONTAÑA PALCOYO',
      descripcion: 'Alternativa a Vinicunca con menos caminata. Montaña de colores con bosque de piedras.',
      incluye: ['Transporte', 'Desayuno', 'Almuerzo', 'Guía', 'Entrada'],
      no_incluye: ['Propinas'],
      imagen: BASE_URL + 'palcoyo.jpg'
    },
    'LIBRE-SIN GUIA': {
      nombre: 'DÍA LIBRE',
      descripcion: 'Día libre para actividades por cuenta propia o descanso en el hotel.',
      incluye: ['Alojamiento'],
      no_incluye: ['Actividades', 'Alimentación', 'Transporte'],
      imagen: BASE_URL + 'dia-libre.jpg'
    },
    'FOTOGRAFIA': {
      nombre: 'WALKING TOUR FOTOGRÁFICO',
      descripcion: 'Tour fotográfico por Cusco capturando los mejores ángulos de la ciudad imperial.',
      incluye: ['Guía fotógrafo', 'Recomendaciones'],
      no_incluye: ['Cámara', 'Entradas'],
      imagen: BASE_URL + 'fotografia.jpg'
    },
    'MISTICO': {
      nombre: 'TOUR MÍSTICO',
      descripcion: 'Experiencia espiritual visitando centros energéticos y ceremonias ancestrales.',
      incluye: ['Guía especializado', 'Ceremonia', 'Transporte'],
      no_incluye: ['Ofrendas adicionales'],
      imagen: BASE_URL + 'mistico.jpg'
    },
    'SUR': {
      nombre: 'TOUR AL SUR DE CUSCO',
      descripcion: 'Ruta del Sur: Andahuaylillas (Capilla Sixtina), Raqchi y Laguna Langui Layo.',
      incluye: ['Transporte', 'Almuerzo', 'Guía', 'Entradas'],
      no_incluye: ['Propinas'],
      imagen: BASE_URL + 'sur.jpg'
    },
    'SALIDA': {
      nombre: 'SALIDA DE CUSCO',
      descripcion: 'Traslado del hotel al aeropuerto. Fin de nuestros servicios.',
      incluye: ['Traslado hotel - aeropuerto'],
      no_incluye: ['Vuelos', 'Alimentación'],
      imagen: BASE_URL + 'salida-cusco.jpg'
    }
  };

  // Normalizar nombre de actividad
  function normalizarActividad(nombre) {
    if (!nombre) return 'LLEGADA';
    const normalizado = nombre.trim().toUpperCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ');

    // Buscar coincidencia exacta
    if (ACTIVIDADES_MAPPING[normalizado]) return normalizado;

    // Buscar coincidencia parcial
    for (const key in ACTIVIDADES_MAPPING) {
      if (normalizado.includes(key) || key.includes(normalizado)) {
        return key;
      }
    }

    return 'LLEGADA';
  }

  // ================= PROCESAMIENTO PRINCIPAL =================

  // Generar itinerario
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

  // Procesar cada actividad
  const actividadesProcesadas = itinerario.map((item) => {
    const actividadKey = normalizarActividad(item.actividad);
    const info = ACTIVIDADES_MAPPING[actividadKey] || ACTIVIDADES_MAPPING['LLEGADA'];

    return {
      titulo_dia: `Día ${item.dia}: ${info.nombre}`,
      fecha_dia: formatearFechaCompleta(parsearFecha(item.fecha)),
      descripcion: `<h4>Itinerario:</h4><p>${info.descripcion}</p><h4>Incluye:</h4><ul>${info.incluye.map(i => `<li>${i}</li>`).join('')}</ul><h4>No incluye:</h4><ul>${info.no_incluye.map(i => `<li>${i}</li>`).join('')}</ul>`,
      imagen: info.imagen
    };
  });

  // Calcular fechas
  const fechaInicio = parsearFecha(body.fecha_tour || body.fecha_inicio);
  const totalDias = itinerario.length;
  const fechaFin = new Date(fechaInicio);
  fechaFin.setDate(fechaFin.getDate() + totalDias - 1);

  // Calcular precios
  const precioTotal = parseFloat(body.precio_total) || 0;
  const numeroPersonas = parseInt(body.numero_personas) || 1;
  const adelantoReserva = parseFloat(body.adelanto_pagado) || 0;
  const tarifaPorPersona = numeroPersonas > 0 ? (precioTotal / numeroPersonas) : precioTotal;
  const saldoPendiente = precioTotal - adelantoReserva;

  // ================= OBJETO DE SALIDA =================
  const resultado = {
    // DATOS DEL CLIENTE
    NOMBRE_CLIENTE: body.nombre_cliente || 'Cliente',
    TELEFONO_CLIENTE: body.telefono || 'No especificado',
    NUMERO_PERSONAS: numeroPersonas,
    TIPO_HABITACION: body.tipo_habitacion || 'Matrimonial',
    observaciones: body.observaciones || '',

    // DATOS DEL ASESOR
    NOMBRE_ASESOR: body.nombre_asesor || 'No especificado',
    EMAIL_ASESOR: body.email_asesor || 'info@orestravelperu.com',

    // PROGRAMA
    NOMBRE_PROGRAMA: body.programa || actividadesProcesadas.map(a => a.titulo_dia.replace(/^Día \d+: /, '')).join(' + '),
    DURACION_PROGRAMA: `${totalDias} día${totalDias !== 1 ? 's' : ''} / ${totalDias - 1} noche${totalDias - 1 !== 1 ? 's' : ''}`,
    FECHA_INICIO: formatearFechaSlash(fechaInicio),
    FECHA_FIN: formatearFechaSlash(fechaFin),

    // PRECIOS
    PRECIO_POR_PERSONA: tarifaPorPersona.toFixed(2),
    TARIFA_POR_NACIONAL: tarifaPorPersona.toFixed(2),
    PRECIO_TOTAL: precioTotal.toFixed(2),
    ADELANTO_RESERVA: adelantoReserva.toFixed(2),
    SALDO_PENDIENTE: saldoPendiente.toFixed(2),

    // TREN
    TIPO_TREN: body.tipo_transporte || body.tipo_tren || 'No Aplica',
    PRECIO_TREN: body.precio_tren || 'Incluido',
    PRECIO_TOTAL_TREN: body.precio_total_tren || '0',
    HORA_IDA_TREN: body.hora_ida_tren || body.horario_ida_tren || 'Por confirmar',
    HORA_RETORNO_TREN: body.hora_retorno_tren || body.horario_retorno_tren || 'Por confirmar',

    // ACTIVIDADES
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

    // TEXTOS FIJOS
    PROGRAMA_INCLUYE: `<h3>El programa incluye</h3><ul><li>Traslado aeropuerto - hotel - aeropuerto</li><li>Alojamiento en hoteles según categoría</li><li>Tours con guía profesional</li><li>Entradas a sitios turísticos</li><li>Transporte turístico</li><li>Asistencia permanente</li></ul>`,
    PROGRAMA_NO_INCLUYE: `<h3>El programa NO incluye</h3><ul><li>Vuelos</li><li>Alimentación (salvo especificado)</li><li>Gastos personales</li><li>Propinas</li><li>Seguros</li></ul>`,
    SUGERENCIAS_GENERALES: `<h3>Sugerencias generales</h3><ul><li>Bloqueador solar</li><li>Ropa abrigadora</li><li>Documentos originales</li><li>Medicamentos personales</li><li>Efectivo</li></ul>`,
    SUGERENCIAS_CAMINATAS: `<h3>Para caminatas</h3><ul><li>Zapatos de trekking</li><li>Bastones</li><li>Ropa deportiva</li><li>Gorro y guantes</li><li>Hidratación</li></ul>`,
    INFO_TREN_LOCAL: `<h3>Información de trenes</h3><h4>Tren Local (Expedition)</h4><p>Económico, ventanas panorámicas, snack incluido.</p><h4>Tren Turístico (Vistadome)</h4><p>Premium, techo panorámico, snack gourmet, show cultural.</p>`,
    INFO_HOTELES: `<h3>Categorías de hoteles</h3><h4>2 estrellas</h4><p>Económicos, servicios básicos.</p><h4>3 estrellas</h4><p>Confortables, bien equipados.</p><h4>4-5 estrellas</h4><p>Lujo, servicios completos.</p>`
  };

  console.log("✅ Procesamiento completado");
  console.log("📊 Días:", totalDias);
  console.log("💰 Total:", precioTotal);
  console.log("👤 Cliente:", resultado.NOMBRE_CLIENTE);
  console.log("👨‍💼 Asesor:", resultado.NOMBRE_ASESOR);
  console.log("🖼️ Actividades procesadas:", actividadesProcesadas.length);

  return [{ json: resultado }];

} catch (error) {
  console.error("❌ ERROR:", error);
  return [{ json: { error: error.message, stack: error.stack } }];
}
