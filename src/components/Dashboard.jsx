import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard({ onOpenTab, onOpenExpediente }) {
  const { user } = useAuth();

  // ESTADO DE PERIODO PARA EL DRILL DOWN DE LA GRÁFICA
  const [periodo, setPeriodo] = useState('Anual');

  // ESTADO DE FECHAS INTERACTIVAS
  const [fechaDesde, setFechaDesde] = useState("2020-01-01");
  const [fechaHasta, setFechaHasta] = useState("2026-12-31");
  const [coordinacionFiltro, setCoordinacionFiltro] = useState("Todas las Coordinaciones");
  const [searchFolio, setSearchFolio] = useState("");

  // ESTADO DE NOTIFICACIONES EN LA CAMPANA
  const [showNotifications, setShowNotifications] = useState(false);

  // ESTADO DE MODAL DE EXPORTACIÓN
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [formatoExport, setFormatoExport] = useState("excel");
  const [alcanceExport, setAlcanceExport] = useState("filtrados");
  const [isExporting, setIsExporting] = useState(false);

  // CONFIGURACIÓN DINÁMICA DE LA GRÁFICA SVG SEGÚN EL DRILL DOWN
  const DATA_GRAFICA = useMemo(() => {
    if (periodo === 'Trimestral') {
      return {
        promedio: "1,560 eventos / Q",
        pathFill: "M 0 100 Q 80 40 160 30 T 330 80 L 500 110 L 500 130 L 0 130 Z",
        pathStroke: "M 0 100 Q 80 40 160 30 T 330 80 L 500 110",
        puntos: [
          { cx: 40, cy: 100, color: "#1a73e8" },
          { cx: 160, cy: 30, color: "#0a192f" },
          { cx: 330, cy: 80, color: "#1a73e8" },
          { cx: 460, cy: 105, color: "#b06000" }
        ],
        ejes: [
          { label: "Q1 2026 (1,842)", bold: false, color: "text-[#5f6368]" },
          { label: "Q2 2026 (Max: 2,105)", bold: true, color: "text-[#0a192f]" },
          { label: "Q3 2026 (1,450)", bold: false, color: "text-[#5f6368]" },
          { label: "Q4 2026* (846)", bold: true, color: "text-[#b06000]" }
        ]
      };
    }

    if (periodo === 'Mensual') {
      return {
        promedio: "520 eventos / Mes",
        pathFill: "M 0 110 Q 40 90 90 60 T 180 40 T 270 70 T 360 30 T 450 85 L 500 120 L 0 130 Z",
        pathStroke: "M 0 110 Q 40 90 90 60 T 180 40 T 270 70 T 360 30 T 450 85 L 500 120",
        puntos: [
          { cx: 90, cy: 60, color: "#1a73e8" },
          { cx: 180, cy: 40, color: "#1a73e8" },
          { cx: 270, cy: 70, color: "#1a73e8" },
          { cx: 360, cy: 30, color: "#0a192f" },
          { cx: 450, cy: 85, color: "#b06000" }
        ],
        ejes: [
          { label: "Ene (480)", bold: false, color: "text-[#5f6368]" },
          { label: "Feb (510)", bold: false, color: "text-[#5f6368]" },
          { label: "Mar (610)", bold: false, color: "text-[#5f6368]" },
          { label: "Abr (540)", bold: false, color: "text-[#5f6368]" },
          { label: "May (Max: 690)", bold: true, color: "text-[#0a192f]" },
          { label: "Jun (420)", bold: false, color: "text-[#5f6368]" },
          { label: "Jul* (280)", bold: true, color: "text-[#b06000]" }
        ]
      };
    }

    return {
      promedio: "38,760 eventos",
      pathFill: "M 0 110 Q 70 80 120 70 T 250 30 T 370 45 T 450 60 L 500 130 L 0 130 Z",
      pathStroke: "M 0 110 Q 70 80 120 70 T 250 30 T 370 45 T 450 60 L 500 130",
      puntos: [
        { cx: 120, cy: 70, color: "#1a73e8" },
        { cx: 250, cy: 30, color: "#0a192f" },
        { cx: 370, cy: 45, color: "#1a73e8" },
        { cx: 450, cy: 60, color: "#b06000" }
      ],
      ejes: [
        { label: "2020 (33.2k)", bold: false, color: "text-[#5f6368]" },
        { label: "2021 (37.8k)", bold: false, color: "text-[#5f6368]" },
        { label: "2022 (40.1k)", bold: false, color: "text-[#5f6368]" },
        { label: "2023 (Max: 43.9k)", bold: true, color: "text-[#0a192f]" },
        { label: "2024 (39.4k)", bold: false, color: "text-[#5f6368]" },
        { label: "2025 (36.1k)", bold: false, color: "text-[#5f6368]" },
        { label: "2026* (6,243)", bold: true, color: "text-[#b06000]" }
      ]
    };
  }, [periodo]);

  // BASE DE DATOS MOCK
  const BASE_REGISTROS = [
    {
      folio: "#146329784",
      fechaIso: "2026-02-26",
      fecha: "26/02/2026",
      hora: "08:42 hrs",
      coordinacion: "U.R. VII Cuernavaca",
      tramo: "Autopista del Sol KM 95+200",
      vehiculo: "Tractocamión (Resp.)",
      vehiculoSub: "vs Automóvil Sedán",
      severidadBadge: "2 Lesionados",
      severidadType: "warning",
      paseMedico: "Emitido (2)",
      paseMedicoActive: true,
      dictamen: "Cobertura RC",
      dictamenType: "warning",
      montoNum: 248500,
      monto: "$248,500"
    },
    {
      folio: "#154290332",
      fechaIso: "2026-02-26",
      fecha: "26/02/2026",
      hora: "07:15 hrs",
      coordinacion: "U.R. VIII Puebla",
      tramo: "México - Puebla KM 74+000",
      vehiculo: "Camioneta Pick-up",
      vehiculoSub: "Responsable Fugado",
      vehiculoSubDanger: true,
      severidadBadge: "Sin Lesionados",
      severidadType: "neutral",
      paseMedico: "No Requirió",
      paseMedicoActive: false,
      dictamen: "En Peritaje",
      dictamenType: "warning",
      montoNum: 82000,
      monto: "$82,000"
    },
    {
      folio: "#136528254",
      fechaIso: "2026-02-25",
      fecha: "25/02/2026",
      hora: "22:30 hrs",
      coordinacion: "U.R. VI Querétaro",
      tramo: "México - Querétaro KM 148",
      vehiculo: "Automóvil Compacto",
      vehiculoSub: "Impacto Barrera Metálica",
      severidadBadge: "1 Fallecido · 1 Les.",
      severidadType: "danger",
      paseMedico: "Emitido (1)",
      paseMedicoActive: true,
      dictamen: "Procedente",
      dictamenType: "success",
      montoNum: 540000,
      monto: "$540,000"
    },
    {
      folio: "#178581989",
      fechaIso: "2026-02-25",
      fecha: "25/02/2026",
      hora: "19:10 hrs",
      coordinacion: "U.R. X Coatzacoalcos",
      tramo: "Córdoba - Veracruz KM 21",
      vehiculo: "Autobús Pasajeros C3",
      vehiculoSub: "vs Camión C2",
      severidadBadge: "4 Lesionados",
      severidadType: "warning",
      paseMedico: "Emitido (4)",
      paseMedicoActive: true,
      dictamen: "Procedente",
      dictamenType: "success",
      montoNum: 310000,
      monto: "$310,000"
    },
    {
      folio: "#171575475",
      fechaIso: "2026-02-24",
      fecha: "24/02/2026",
      hora: "14:05 hrs",
      coordinacion: "U.R. V Mazatlán",
      tramo: "Mazatlán - Culiacán KM 65",
      vehiculo: "Automóvil Particular",
      vehiculoSub: "Salida de Camino",
      severidadBadge: "Sin Lesionados",
      severidadType: "neutral",
      paseMedico: "No Requirió",
      paseMedicoActive: false,
      dictamen: "Improcedente",
      dictamenType: "neutral",
      montoNum: 45000,
      monto: "$45,000"
    }
  ];

  // FILTRADO DINÁMICO
  const registrosFiltrados = useMemo(() => {
    return BASE_REGISTROS.filter(r => {
      const matchFecha = (!fechaDesde || r.fechaIso >= fechaDesde) && (!fechaHasta || r.fechaIso <= fechaHasta);
      const matchCoord = coordinacionFiltro === "Todas las Coordinaciones" || r.coordinacion === coordinacionFiltro;
      const matchFolio = !searchFolio || r.folio.toLowerCase().includes(searchFolio.toLowerCase());
      return matchFecha && matchCoord && matchFolio;
    });
  }, [fechaDesde, fechaHasta, coordinacionFiltro, searchFolio]);

  // EXPORTACIÓN SIMULADA
  const handleConfirmExport = (e) => {
    e.preventDefault();
    setIsExporting(true);

    setTimeout(() => {
      const targetData = alcanceExport === "filtrados" ? registrosFiltrados : BASE_REGISTROS;

      let extension = "csv";
      let mimeType = "text/csv;charset=utf-8;";
      let fileContent = "";

      if (formatoExport === "csv" || formatoExport === "excel") {
        extension = formatoExport === "excel" ? "xlsx" : "csv";
        const headers = ["FOLIO", "FECHA", "HORA", "COORDINACION", "TRAMO", "VEHICULO", "SEVERIDAD", "DICTAMEN", "MONTO"];
        const rowsCsv = targetData.map(r => [
          r.folio, r.fecha, r.hora, `"${r.coordinacion}"`, `"${r.tramo}"`, `"${r.vehiculo}"`, `"${r.severidadBadge}"`, `"${r.dictamen}"`, `"${r.monto}"`
        ].join(","));
        fileContent = [headers.join(","), ...rowsCsv].join("\n");
      } else {
        extension = "pdf";
        mimeType = "application/pdf";
        fileContent = `REPORTE EJECUTIVO GNP/CAPUFE\nPeriodo: ${fechaDesde} al ${fechaHasta}\nTotal Registros: ${targetData.length}\n\n` +
          targetData.map(r => `${r.folio} | ${r.fecha} | ${r.coordinacion} | ${r.monto}`).join("\n");
      }

      const blob = new Blob([fileContent], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Reporte_Resumen_Ejecutivo_${fechaDesde}_al_${fechaHasta}.${extension}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
      setIsExportModalOpen(false);
    }, 1200);
  };

  return (
    <div className="flex-1 min-h-0 h-full overflow-y-auto bg-[#f8fafd] text-xs text-[#202124] font-sans p-6 pb-16 space-y-6">

      {/* BARRA SUPERIOR DE BIENVENIDA Y ACCIONES */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-[#dadce0] p-4 rounded-2xl shadow-2xs relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center font-bold border border-[#d3e3fd]">
            <span className="material-symbols-outlined text-[22px]">person</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#202124] tracking-tight">
              Bienvenido, {user?.nombre || "Adriana Castañeda"}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 relative">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#dadce0] bg-white hover:bg-[#f1f3f4] text-[#3c4043] text-xs font-medium transition cursor-pointer shadow-2xs"
          >
            <span className="material-symbols-outlined text-[#188038] text-[18px]">download</span>
            <span>Exportar</span>
          </button>

          {/* BOTÓN DE CAMPANA DE NOTIFICACIONES */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] rounded-full transition cursor-pointer relative"
              title="Notificaciones"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#d93025] rounded-full"></span>
            </button>

            {/* PANEL DESPLEGABLE DE NOTIFICACIÓN */}
            {showNotifications && (
              <div className="absolute right-0 top-11 z-40 bg-white border border-[#dadce0] rounded-2xl shadow-xl w-80 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-[#f1f3f4] pb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#1a73e8] text-[18px]">notifications_active</span>
                    <span className="font-bold text-[#202124] text-xs">Notificaciones</span>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[#5f6368] hover:text-[#202124] rounded-full p-0.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>

                <div className="p-3 bg-[#fef7e0] border border-[#feefc3] rounded-xl flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[#b06000] text-[20px] shrink-0 mt-0.5">warning</span>
                  <div>
                    <p className="text-xs font-semibold text-[#202124]">
                      Tiene un siniestro pendiente de aprobación:
                    </p>
                    <p className="text-xs font-mono font-bold text-[#0b57d0] mt-1">
                      184920371
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ENCABEZADO CON SELECCIÓN INTERACTIVA DE FECHAS */}
      <section className="bg-white border border-[#dadce0] p-5 rounded-2xl shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0a192f] tracking-tight uppercase">
            GNP/CAPUFE
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center bg-white border border-[#dadce0] rounded-lg px-2.5 py-1 shadow-2xs">
            <span className="material-symbols-outlined text-[#5f6368] text-[16px] mr-1.5">calendar_today</span>
            <div className="flex items-center gap-1">
              <span className="text-[#5f6368] font-medium">Desde:</span>
              <input
                type="date"
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                className="text-xs font-bold text-[#202124] bg-transparent outline-none cursor-pointer"
              />
            </div>
            <span className="mx-2 text-[#dadce0]">|</span>
            <div className="flex items-center gap-1">
              <span className="text-[#5f6368] font-medium">Hasta:</span>
              <input
                type="date"
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                className="text-xs font-bold text-[#202124] bg-transparent outline-none cursor-pointer"
              />
            </div>
          </div>

          <div className="bg-white border border-[#dadce0] rounded-lg shadow-2xs">
            <select
              value={coordinacionFiltro}
              onChange={(e) => setCoordinacionFiltro(e.target.value)}
              className="text-xs font-medium text-[#3c4043] border-none bg-transparent py-1.5 pl-3 pr-8 focus:ring-1 focus:ring-[#1a73e8] cursor-pointer outline-none"
            >
              <option value="Todas las Coordinaciones">Todas las Coordinaciones</option>
              <option value="U.R. VIII Puebla">U.R. VIII Puebla</option>
              <option value="U.R. VII Cuernavaca">U.R. VII Cuernavaca</option>
              <option value="U.R. VI Querétaro">U.R. VI Querétaro</option>
              <option value="U.R. X Coatzacoalcos">U.R. X Coatzacoalcos</option>
              <option value="U.R. V Mazatlán">U.R. V Mazatlán</option>
            </select>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Número de siniestro..."
              value={searchFolio}
              onChange={(e) => setSearchFolio(e.target.value)}
              className="text-xs bg-white border border-[#dadce0] rounded-lg pl-8 pr-3 py-1.5 w-48 focus:ring-1 focus:ring-[#1a73e8] shadow-2xs outline-none placeholder:text-[#5f6368]"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#5f6368] text-[16px]">search</span>
          </div>
        </div>
      </section>

      {/* BLOQUE 1 DE KPIS PRINCIPALES */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white border border-[#dadce0] rounded-xl p-3 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#5f6368]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Siniestralidad Total</span>
            <span className="material-symbols-outlined text-[#1a73e8] text-[20px]">trending_up</span>
          </div>
          <p className="text-2xl font-bold text-[#202124] tracking-tight mt-1">232,560</p>
          <div className="mt-1.5 flex items-center justify-between text-[11px]">
            <span className="px-2 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333] font-medium border border-[#ceead6]">Índice Severidad</span>
            <span className="text-xs font-semibold text-[#137333] bg-[#e6f4ea] px-1.5 py-0.5 rounded border border-[#ceead6]">Vigencia</span>
          </div>
        </div>

        <div className="bg-white border border-[#dadce0] rounded-xl p-3 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#5f6368]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Monto Reclamado CAPUFE</span>
            <span className="material-symbols-outlined text-[#1a73e8] text-[20px]">description</span>
          </div>
          <p className="text-2xl font-bold text-[#202124] tracking-tight mt-1">$4,857.2M</p>
          <div className="mt-1.5 flex items-center justify-between text-[11px]">
            <span className="text-[#1a73e8] font-medium">Importe Siniestro Total</span>
            <span className="text-[#3c4043] font-semibold text-xs">Vigencia</span>
          </div>
        </div>

        <div className="bg-white border border-[#dadce0] rounded-xl p-3 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#b06000]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Lesionados</span>
            <span className="material-symbols-outlined text-[#b06000] text-[20px]">warning</span>
          </div>
          <p className="text-2xl font-bold text-[#b06000] tracking-tight mt-1">10,272</p>
          <div className="mt-1.5 text-[11px] text-[#5f6368]">
            <span className="font-medium text-[#b06000]">11,395</span> Pases Médicos (4.9%)
          </div>
        </div>

        <div className="bg-white border border-[#dadce0] rounded-xl p-3 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#c5221f]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Fallecidos</span>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-[#fce8e6] text-[#c5221f] border border-[#fad2cf] rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c5221f] animate-ping"></span> CRÍTICO
            </span>
          </div>
          <p className="text-2xl font-bold text-[#c5221f] tracking-tight mt-1">1,947</p>
          <div className="mt-1.5 text-[11px]">
            <span className="px-2 py-0.5 rounded-full bg-[#fce8e6] text-[#c5221f] font-medium border border-[#fad2cf]">Mortalidad 0.83%</span>
          </div>
        </div>

        <div className="bg-white border border-[#dadce0] rounded-xl p-3 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#1a73e8]">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Extemporáneos</span>
            <span className="material-symbols-outlined text-[#1a73e8] text-[20px]">schedule</span>
          </div>
          <p className="text-2xl font-bold text-[#202124] tracking-tight mt-1">14,328</p>
          <div className="mt-1.5 flex items-center justify-between text-[11px]">
            <span className="text-[#5f6368]">Fuera de tiempo:</span>
            <span className="text-[#1a73e8] font-bold text-xs bg-[#e8f0fe] px-1.5 py-0.5 rounded border border-[#d3e3fd]">6.16%</span>
          </div>
        </div>
      </section>

      {/* BLOQUE 2: KPIS DE "IMPORTES INGRESOS Y EGRESOS" */}
      <section className="bg-white border border-[#dadce0] p-5 rounded-2xl shadow-2xs space-y-3.5">
        <div className="flex items-center justify-between border-b border-[#f1f3f4] pb-2.5">
          <div>
            <h3 className="text-sm font-bold text-[#202124]">Importes Ingresos y Egresos</h3>
            <p className="text-[11px] text-[#5f6368]">Distribución de reservas técnicas, deducibles y montos recuperados</p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#f1f3f4] text-[#3c4043] font-semibold text-[11px] border border-[#dadce0]">
            Vigencia
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
          <div className="bg-[#f8fafd] border border-[#dadce0] rounded-xl p-2.5 shadow-xs hover:shadow-md transition-shadow">
            <span className="text-[10px] font-semibold text-[#5f6368] uppercase block truncate">Reserva Total</span>
            <p className="text-lg font-bold text-[#202124] mt-1">$432.9M</p>
            <span className="text-[10px] text-[#5f6368] mt-0.5 block truncate">Fondos asignados</span>
          </div>

          <div className="bg-[#f8fafd] border border-[#dadce0] rounded-xl p-2.5 shadow-xs hover:shadow-md transition-shadow">
            <span className="text-[10px] font-semibold text-[#5f6368] uppercase block truncate">Indemnización</span>
            <p className="text-lg font-bold text-[#1a73e8] mt-1">$5,135.8M</p>
            <span className="text-[10px] text-[#5f6368] mt-0.5 block truncate">Compensación</span>
          </div>

          <div className="bg-[#f8fafd] border border-[#dadce0] rounded-xl p-2.5 shadow-xs hover:shadow-md transition-shadow">
            <span className="text-[10px] font-semibold text-[#5f6368] uppercase block truncate">Gasto Directo</span>
            <p className="text-lg font-bold text-[#202124] mt-1">$340.2M</p>
            <span className="text-[10px] text-[#5f6368] mt-0.5 block truncate">Atención en sitio</span>
          </div>

          <div className="bg-[#f8fafd] border border-[#dadce0] rounded-xl p-2.5 shadow-xs hover:shadow-md transition-shadow">
            <span className="text-[10px] font-semibold text-[#5f6368] uppercase block truncate">Gasto Indirecto</span>
            <p className="text-lg font-bold text-[#202124] mt-1">$365.4M</p>
            <span className="text-[10px] text-[#5f6368] mt-0.5 block truncate">Peritajes & Legal</span>
          </div>

          <div className="bg-[#f8fafd] border border-[#dadce0] rounded-xl p-2.5 shadow-xs hover:shadow-md transition-shadow">
            <span className="text-[10px] font-semibold text-[#5f6368] uppercase block truncate">Deducible</span>
            <p className="text-lg font-bold text-[#b06000] mt-1">$53.5M</p>
            <span className="text-[10px] text-[#5f6368] mt-0.5 block truncate">Retención póliza</span>
          </div>

          <div className="bg-[#f8fafd] border border-[#dadce0] rounded-xl p-2.5 shadow-xs hover:shadow-md transition-shadow">
            <span className="text-[10px] font-semibold text-[#5f6368] uppercase block truncate">Salvamento</span>
            <p className="text-lg font-bold text-[#137333] mt-1">$50.4M</p>
            <span className="text-[10px] text-[#5f6368] mt-0.5 block truncate">Recuperación</span>
          </div>

          <div className="bg-[#e8f0fe] border border-[#d3e3fd] rounded-xl p-2.5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <span className="text-[10px] font-bold text-[#041e49] uppercase truncate">Siniestro Total</span>
            <p className="text-lg font-black text-[#0b57d0] mt-1">$4,857.2M</p>
            <span className="text-[10px] text-[#5f6368] font-medium block truncate">Consolidado</span>
          </div>
        </div>
      </section>

      {/* GRÁFICOS INTERACTIVOS CON DRILL DOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white border border-[#dadce0] rounded-2xl p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold text-[#202124]">Siniestralidad por Vigencia</h3>
              <p className="text-[11px] text-[#5f6368]">
                Tendencia {periodo.toLowerCase()} · Promedio: <strong>{DATA_GRAFICA.promedio}</strong>
              </p>
            </div>

            <div className="inline-flex rounded-full p-0.5 bg-[#f1f3f4] border border-[#dadce0] text-xs">
              {['Anual', 'Trimestral', 'Mensual'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriodo(p)}
                  className={`px-3.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${periodo === p ? 'bg-white text-[#0b57d0] shadow-xs' : 'text-[#5f6368] hover:text-[#202124]'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="relative h-52 w-full pt-4">
            <svg className="w-full h-full overflow-visible transition-all duration-500 ease-in-out" viewBox="0 0 500 150" preserveAspectRatio="none">
              <defs>
                <linearGradient id="googleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1a73e8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#1a73e8" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f3f4" strokeWidth="1" />
              <line x1="0" y1="70" x2="500" y2="70" stroke="#f1f3f4" strokeWidth="1" />
              <line x1="0" y1="110" x2="500" y2="110" stroke="#f1f3f4" strokeWidth="1" />

              <path
                d={DATA_GRAFICA.pathFill}
                fill="url(#googleGradient)"
                className="transition-all duration-500 ease-in-out"
              />

              <path
                d={DATA_GRAFICA.pathStroke}
                fill="none"
                stroke="#1a73e8"
                strokeWidth="3"
                strokeLinecap="round"
                className="transition-all duration-500 ease-in-out"
              />

              {DATA_GRAFICA.puntos.map((pt, i) => (
                <circle key={i} cx={pt.cx} cy={pt.cy} r={pt.color === "#0a192f" ? 5 : 4} fill={pt.color} stroke="#ffffff" strokeWidth="2" className="transition-all duration-500 ease-in-out" />
              ))}
            </svg>

            <div className="flex justify-between items-center text-[11px] font-medium pt-2 transition-all">
              {DATA_GRAFICA.ejes.map((eje, idx) => (
                <span key={idx} className={`${eje.color} ${eje.bold ? 'font-bold' : ''}`}>
                  {eje.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RANKING Y TIPOLOGÍA */}
        <div className="space-y-5">
          <div className="bg-white border border-[#dadce0] rounded-2xl p-4 shadow-2xs">
            <h3 className="text-sm font-bold text-[#202124] mb-3">Ranking por Coordinación</h3>
            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between items-center text-[#3c4043] mb-1">
                  <span>U.R. VIII Puebla</span>
                  <span className="font-bold text-[#202124]">14.7% (34,186)</span>
                </div>
                <div className="w-full bg-[#f1f3f4] rounded-full h-2">
                  <div className="bg-[#b06000] h-2 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-[#3c4043] mb-1">
                  <span>U.R. VII Cuernavaca</span>
                  <span className="font-bold text-[#202124]">12.3% (28,604)</span>
                </div>
                <div className="w-full bg-[#f1f3f4] rounded-full h-2">
                  <div className="bg-[#b06000] h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-[#3c4043] mb-1">
                  <span>U.R. VI Querétaro</span>
                  <span className="font-bold text-[#202124]">8.3% (19,302)</span>
                </div>
                <div className="w-full bg-[#f1f3f4] rounded-full h-2">
                  <div className="bg-[#1a73e8] h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#dadce0] rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#202124]">Tipología · Vehículo Responsable</h3>
              <span className="text-[10px] text-[#5f6368]">Dictaminado</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path strokeDasharray="50.9, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3c4043" strokeWidth="4.5" />
                  <path strokeDasharray="13.3, 100" strokeDashoffset="-50.9" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#b06000" strokeWidth="4.5" />
                  <path strokeDasharray="10.1, 100" strokeDashoffset="-64.2" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1a73e8" strokeWidth="4.5" />
                </svg>
              </div>

              <div className="flex-1 space-y-1.5 text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-[#3c4043]">
                    <span className="w-2 h-2 rounded-full bg-[#3c4043]"></span> No Aplica
                  </span>
                  <span className="font-bold text-[#202124]">50.9% (118,373)</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-[#3c4043]">
                    <span className="w-2 h-2 rounded-full bg-[#b06000]"></span> No Reportado
                  </span>
                  <span className="font-bold text-[#202124]">13.3% (30,930)</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-[#3c4043]">
                    <span className="w-2 h-2 rounded-full bg-[#1a73e8]"></span> Automóvil
                  </span>
                  <span className="font-bold text-[#202124]">10.1% (23,488)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABLA RESUMEN COMPLETA */}
      <section className="bg-white border border-[#dadce0] rounded-2xl p-5 shadow-2xs overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-[#dadce0] mb-3">
          <h3 className="text-base font-bold text-[#202124]">Tabla Resumen</h3>
          <span className="text-xs text-[#5f6368] font-medium">
            Mostrando {registrosFiltrados.length} de 232,560 registros
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#f8fafd] border-b border-[#dadce0] text-[#5f6368] uppercase text-[11px] font-semibold">
                <th className="py-3 px-4">FOLIO / SINIESTRO</th>
                <th className="py-3 px-4">FECHA / HORA</th>
                <th className="py-3 px-4">COORDINACIÓN & TRAMO</th>
                <th className="py-3 px-4">VEHÍCULOS INVOLUCRADOS</th>
                <th className="py-3 px-4 text-center">SEVERIDAD</th>
                <th className="py-3 px-4 text-center">PASE MÉDICO</th>
                <th className="py-3 px-4 text-center">DICTAMEN</th>
                <th className="py-3 px-4 text-right">MONTO ESTIMADO</th>
                <th className="py-3 px-4 text-center">ACCIÓN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8eaed]">
              {registrosFiltrados.length > 0 ? (
                registrosFiltrados.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#f8fafd] transition">
                    <td className="py-3 px-4 font-mono font-bold text-[#1a73e8]">{row.folio}</td>
                    <td className="py-3 px-4 text-[#3c4043] font-mono">
                      {row.fecha}<br />
                      <span className="text-[#5f6368] text-[10px]">{row.hora}</span>
                    </td>
                    <td className="py-3 px-4 text-[#202124]">
                      <strong className="block font-bold">{row.coordinacion}</strong>
                      <span className="text-[#5f6368] text-[11px] font-normal">{row.tramo}</span>
                    </td>
                    <td className="py-3 px-4 text-[#202124]">
                      <span className="font-bold block">{row.vehiculo}</span>
                      <span className={`text-[11px] block ${row.vehiculoSubDanger ? 'text-[#c5221f] font-semibold' : 'text-[#5f6368]'}`}>
                        {row.vehiculoSub}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.severidadType === 'danger' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#fce8e6] text-[#c5221f] font-semibold border border-[#fad2cf]">
                          {row.severidadBadge}
                        </span>
                      )}
                      {row.severidadType === 'warning' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#fef7e0] text-[#b06000] font-semibold border border-[#feefc3]">
                          {row.severidadBadge}
                        </span>
                      )}
                      {row.severidadType === 'neutral' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#f1f3f4] text-[#3c4043] font-semibold border border-[#dadce0]">
                          {row.severidadBadge}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.paseMedicoActive ? (
                        <span className="text-[#1a73e8] font-bold">{row.paseMedico}</span>
                      ) : (
                        <span className="text-[#5f6368]">{row.paseMedico}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.dictamenType === 'success' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333] font-semibold border border-[#ceead6]">
                          {row.dictamen}
                        </span>
                      )}
                      {row.dictamenType === 'warning' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#fef7e0] text-[#b06000] font-semibold border border-[#feefc3]">
                          {row.dictamen}
                        </span>
                      )}
                      {row.dictamenType === 'neutral' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#f1f3f4] text-[#3c4043] font-semibold border border-[#dadce0]">
                          {row.dictamen}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#202124]">{row.monto}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => onOpenExpediente({ id: row.folio.replace('#', '') })}
                        className="px-3 py-1 rounded-full border border-[#dadce0] hover:bg-[#f1f3f4] text-[#1a73e8] font-semibold text-xs transition cursor-pointer"
                      >
                        Ver Expediente
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-[#5f6368]">
                    No se encontraron registros para el periodo seleccionado ({fechaDesde} al {fechaHasta}).
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* MODAL SIMULADO DE EXPORTACIÓN */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[#202124]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative bg-white border border-[#dadce0] rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#dadce0] flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#e6f4ea] text-[#137333] flex items-center justify-center border border-[#ceead6]">
                  <span className="material-symbols-outlined text-[22px]">file_download</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#202124]">Exportar Datos</h3>
                  <p className="text-xs text-[#5f6368]">Resumen Ejecutivo GNP/CAPUFE</p>
                </div>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="text-[#5f6368] hover:text-[#202124] p-2 rounded-full hover:bg-[#f1f3f4] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleConfirmExport} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#3c4043] mb-2">Formato de Descarga</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormatoExport("excel")}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition ${formatoExport === "excel" ? "border-[#137333] bg-[#e6f4ea] text-[#137333] font-bold" : "border-[#dadce0] bg-white text-[#5f6368]"}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">grid_on</span>
                    <span className="text-[11px]">Excel (.xlsx)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormatoExport("pdf")}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition ${formatoExport === "pdf" ? "border-[#c5221f] bg-[#fce8e6] text-[#c5221f] font-bold" : "border-[#dadce0] bg-white text-[#5f6368]"}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
                    <span className="text-[11px]">PDF</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormatoExport("csv")}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition ${formatoExport === "csv" ? "border-[#1a73e8] bg-[#e8f0fe] text-[#1a73e8] font-bold" : "border-[#dadce0] bg-white text-[#5f6368]"}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">csv</span>
                    <span className="text-[11px]">CSV</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#3c4043] mb-2">Alcance de los Registros</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-[#dadce0] hover:bg-[#f8fafd] cursor-pointer">
                    <input
                      type="radio"
                      name="alcance"
                      value="filtrados"
                      checked={alcanceExport === "filtrados"}
                      onChange={() => setAlcanceExport("filtrados")}
                      className="text-[#0b57d0] focus:ring-[#0b57d0]"
                    />
                    <div>
                      <span className="block font-bold text-[#202124]">Registros Filtrados Actuales</span>
                      <span className="text-[11px] text-[#5f6368]">
                        Exporta {registrosFiltrados.length} registros que cumplen con las fechas seleccionadas
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 p-2.5 rounded-lg border border-[#dadce0] hover:bg-[#f8fafd] cursor-pointer">
                    <input
                      type="radio"
                      name="alcance"
                      value="todos"
                      checked={alcanceExport === "todos"}
                      onChange={() => setAlcanceExport("todos")}
                      className="text-[#0b57d0] focus:ring-[#0b57d0]"
                    />
                    <div>
                      <span className="block font-bold text-[#202124]">Consolidado Completo</span>
                      <span className="text-[11px] text-[#5f6368]">
                        Exporta el total de 232,560 registros consolidados
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-[#dadce0] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsExportModalOpen(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-[#5f6368] hover:bg-[#f1f3f4] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isExporting}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#188038] hover:bg-[#137333] text-white text-xs font-semibold shadow-md cursor-pointer disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isExporting ? 'sync' : 'download'}
                  </span>
                  <span>{isExporting ? 'Generando descarga...' : 'Confirmar y Descargar'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}