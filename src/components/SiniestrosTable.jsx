import React, { useState, useMemo } from "react";

// MOCK DATA PARA SINIESTRALIDAD
const MOCK_SINIESTROS = [
    {
        id: "168614253",
        archivosCount: 4,
        fechaAccidente: "2025-05-02",
        cobertura: "RC AUTOPISTA",
        tramoCaseta: "Puentes Nal. • DOVALI (67)",
        coordinacion: "Coord. VIII Puebla",
        estatus: "RECHAZADO",
        tipoEstatus: "danger",
        discrepancia: "Cabina de peaje dañada",
        facturasCount: 0,
        reqsCount: 1
    },
    {
        id: "175615087",
        archivosCount: 2,
        fechaAccidente: "2025-11-02",
        cobertura: "RC USUARIO",
        tramoCaseta: "México - Puebla KM 72",
        coordinacion: "Coord. VII Cuernavaca",
        estatus: "RECHAZADO",
        tipoEstatus: "danger",
        discrepancia: "Falla mecánica",
        facturasCount: 0,
        reqsCount: 0
    },
    {
        id: "172738817",
        archivosCount: 6,
        fechaAccidente: "2025-08-20",
        cobertura: "RC AUTOPISTA",
        tramoCaseta: "Querétaro - Irapuato KM 45",
        coordinacion: "Coord. VI Querétaro",
        estatus: "EN REVISIÓN EXP.",
        tipoEstatus: "info",
        discrepancia: "Aclaración de peritaje",
        facturasCount: 3,
        reqsCount: 1
    },
    {
        id: "170032262",
        archivosCount: 1,
        fechaAccidente: "2025-06-22",
        cobertura: "RC AUTOPISTA",
        tramoCaseta: "Coatzacoalcos - Salina Cruz",
        coordinacion: "Coord. X Coatzacoalcos",
        estatus: "SIN FORMAL RECLAM.",
        tipoEstatus: "neutral",
        discrepancia: "Sin discrepancia",
        facturasCount: 0,
        reqsCount: 0
    },
    {
        id: "170352272",
        archivosCount: 5,
        fechaAccidente: "2025-06-30",
        cobertura: "RC USUARIO",
        tramoCaseta: "Mazatlán - Culiacán KM 110",
        coordinacion: "Coord. V Mazatlán",
        estatus: "TERMINADO",
        tipoEstatus: "success",
        discrepancia: "Pago indemnizado",
        facturasCount: 5,
        reqsCount: 0
    },
    {
        id: "174446492",
        archivosCount: 8,
        fechaAccidente: "2025-10-06",
        cobertura: "RC AUTOPISTA",
        tramoCaseta: "México - Querétaro KM 89",
        coordinacion: "Coord. XI Edo. Méx",
        estatus: "RECHAZADO",
        tipoEstatus: "danger",
        discrepancia: "Sobreestimación peritaje",
        facturasCount: 0,
        reqsCount: 2
    }
];

export default function SiniestrosTable({
    rows = [],
    loading = false,
    error = null,
    onOpenExpediente = () => { },
    onOpenArchivos = () => { },
    onOpenFacturas = () => { },
    onOpenRequerimientos = () => { }
}) {
    // ESTADOS DE FILTRADO
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [selectedCoord, setSelectedCoord] = useState("Todas");
    const [selectedCobertura, setSelectedCobertura] = useState("Todas");
    const [showMoreFilters, setShowMoreFilters] = useState(false);

    // ESTADOS DE FECHAS (DESDE / HASTA)
    const [fechaDesde, setFechaDesde] = useState("2020-01-01");
    const [fechaHasta, setFechaHasta] = useState("2026-12-31");

    // ESTADOS DE MODALES SIMULADOS DE LA BARRA SUPERIOR
    const [activeModal, setActiveModal] = useState(null); // 'exportar' | 'carga' | 'factura' | 'requerimiento' | 'nuevo' | null
    const [isProcessing, setIsProcessing] = useState(false);

    // PESTAÑA ACTIVA EN MODAL DE AGREGAR FACTURA
    const [activeFacturaTab, setActiveFacturaTab] = useState("general"); // 'general' | 'seguimiento'

    // ESTADO DEL FORMULARIO DE AGREGAR FACTURA
    const [formFactura, setFormFactura] = useState({
        // GENERAL
        fechaCreacion: new Date().toISOString().split('T')[0],
        folioEscrito: "GNP-CAPUFE-RP-" + Math.floor(10000 + Math.random() * 90000),
        noSiniestro: "",
        fechaAccidente: "",
        coordinacionRegional: "",
        tramoCarretero: "",
        caseta: "",
        numeroCaseta: "",
        conceptosPago: "",
        beneficiarioPago: "",
        proveedorBeneficiario: "",
        referenciaUtilizar: "",
        categoriaPago: "",
        aseguradoraResponsable: "",
        numeroFactura: "",
        montoReclamado: "",
        montoMN: "",

        // SEGUIMIENTO
        fechaFormalReclamacion: "",
        fechaRecepcionGarantia: "",
        fechaExpedienteCompleto: "",
        fechaCorreoConfirmacion: "",
        estatusReclamacion: "PENDIENTE ENVIAR A GNP",
        observaciones: "",
        comentarios: "",
        fechaEnvioVoboSupervisor: "",
        fechaEnvioVoboDireccion: "",
        voboRecomendacionPago: "",
        fechaRecomendacionPago: "",
        fechaVoboGnp: "",
        fechaPagoGnp: "",
        referenciaGnp: "",
        tiempoReparacion: "",
        diasAtrasoReparacion: "",
        diasReparacionJustificados: "",
        tabuladorReparacion: "",
        montoAhorrado: "",
        kpiIndemnizacionGnp: "",
        importePenalizacion: ""
    });

    // CÁLCULOS AUTOMÁTICOS DE IMPORTES (IVA 16% Y MONTO CON IVA)
    const importesCalculados = useMemo(() => {
        const montoBase = parseFloat(formFactura.montoMN) || 0;
        const iva = montoBase * 0.16;
        const montoConIva = montoBase + iva;
        return {
            iva: iva.toFixed(2),
            montoConIva: montoConIva.toFixed(2)
        };
    }, [formFactura.montoMN]);

    const handleFormFacturaChange = (field, value) => {
        setFormFactura(prev => ({ ...prev, [field]: value }));
    };

    // FILTRADO DINÁMICO
    const filteredRows = useMemo(() => {
        return MOCK_SINIESTROS.filter((row) => {
            const matchStatus = !statusFilter || row.estatus.toLowerCase().includes(statusFilter.toLowerCase());
            const matchCoord = selectedCoord === "Todas" || row.coordinacion.includes(selectedCoord);
            const matchCobertura = selectedCobertura === "Todas" || row.cobertura.includes(selectedCobertura);
            const matchSearch =
                !searchQuery ||
                row.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                row.tramoCaseta.toLowerCase().includes(searchQuery.toLowerCase()) ||
                row.discrepancia.toLowerCase().includes(searchQuery.toLowerCase());

            const matchFecha = (!fechaDesde || row.fechaAccidente >= fechaDesde) && (!fechaHasta || row.fechaAccidente <= fechaHasta);

            return matchStatus && matchCoord && matchCobertura && matchSearch && matchFecha;
        });
    }, [searchQuery, statusFilter, selectedCoord, selectedCobertura, fechaDesde, fechaHasta]);

    // ACCIÓN: IMPRIMIR
    const handleImprimir = () => {
        window.print();
    };

    // ACCIÓN: EXPORTAR
    const handleConfirmExport = (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setTimeout(() => {
            const headers = ["ID", "FECHA", "COBERTURA", "TRAMO", "COORDINACION", "ESTATUS", "DISCREPANCIA"];
            const rowsCsv = filteredRows.map(r => [
                r.id, r.fechaAccidente, r.cobertura, `"${r.tramoCaseta}"`, `"${r.coordinacion}"`, r.estatus, `"${r.discrepancia}"`
            ].join(","));
            const csvContent = [headers.join(","), ...rowsCsv].join("\n");

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Reporte_Siniestralidad_${fechaDesde}_al_${fechaHasta}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setIsProcessing(false);
            setActiveModal(null);
        }, 1200);
    };

    // ACCIONES GENERALES DE FORMULARIOS SIMULADOS
    const handleSimulatedSubmit = (e, mensaje) => {
        e.preventDefault();
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setActiveModal(null);
            alert(mensaje);
        }, 1000);
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#f8fafd] overflow-hidden text-xs text-[#202124] font-sans">

            {/* CABECERA CENTRADA CON TÍTULO Y ACCIONES */}
            <section className="px-6 py-5 flex flex-col items-center justify-center gap-4 border-b border-[#dadce0] bg-white text-center">
                <div>
                    <h1 className="text-4xl font-extrabold text-[#0a192f] tracking-tight">
                        Siniestralidad
                    </h1>
                </div>

                {/* LÍNEA DE ACCIONES Y FECHAS UNIFICADA */}
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs w-full">

                    {/* SELECTOR DESDE / HASTA */}
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

                    {/* BOTONES SECUNDARIOS */}
                    <div className="flex items-center gap-1.5 bg-white border border-[#dadce0] p-0.5 rounded-lg shadow-2xs">
                        <button
                            onClick={handleImprimir}
                            className="flex items-center gap-1.5 px-2.5 py-1 text-[#3c4043] hover:text-[#202124] hover:bg-[#f1f3f4] rounded-md font-medium transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[#5f6368] text-[16px]">print</span>
                            <span>Imprimir</span>
                        </button>
                        <button
                            onClick={() => setActiveModal('exportar')}
                            className="flex items-center gap-1.5 px-2.5 py-1 text-[#3c4043] hover:text-[#202124] hover:bg-[#f1f3f4] rounded-md font-medium transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[#188038] text-[16px]">download</span>
                            <span>Exportar</span>
                        </button>
                        <button
                            onClick={() => setActiveModal('carga')}
                            className="flex items-center gap-1.5 px-2.5 py-1 text-[#3c4043] hover:text-[#202124] hover:bg-[#f1f3f4] rounded-md font-medium transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[#1a73e8] text-[16px]">upload</span>
                            <span>Carga masiva</span>
                        </button>
                    </div>

                    {/* BOTONES PRIMARIOS Y DE ALTA */}
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => setActiveModal('factura')}
                            className="flex items-center gap-1.5 bg-white border border-[#dadce0] text-[#3c4043] hover:bg-[#f1f3f4] font-medium px-2.5 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[#188038] text-[16px]">receipt_long</span>
                            <span>Agregar factura</span>
                        </button>
                        <button
                            onClick={() => setActiveModal('requerimiento')}
                            className="flex items-center gap-1.5 bg-white border border-[#dadce0] text-[#3c4043] hover:bg-[#f1f3f4] font-medium px-2.5 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[#1a73e8] text-[16px]">assignment_turned_in</span>
                            <span>Agregar requerimiento</span>
                        </button>
                        <button
                            onClick={() => setActiveModal('nuevo')}
                            className="flex items-center gap-1.5 bg-[#0b57d0] hover:bg-[#0842a0] text-white font-semibold px-3 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[16px]">add</span>
                            <span>Nuevo siniestro</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* DASHBOARD METRICS BAR */}
            <section className="px-6 py-4 bg-[#f8fafd] border-b border-[#dadce0]/80">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
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
                            <span className="text-[11px] font-semibold uppercase tracking-wider">Siniestros Reclamados</span>
                            <span className="material-symbols-outlined text-[#1a73e8] text-[20px]">description</span>
                        </div>
                        <p className="text-2xl font-bold text-[#202124] tracking-tight mt-1">$4,857.2M</p>
                        <div className="mt-1.5 flex items-center justify-between text-[11px]">
                            <span className="text-[#1a73e8] font-medium">Importe Siniestro Total</span>
                            <span className="text-[#3c4043] font-semibold text-xs">Vigencia</span>
                        </div>
                    </div>

                    <div className="bg-white border border-[#dadce0] rounded-xl p-3 shadow-xs hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between text-[#1a73e8]">
                            <span className="text-[11px] font-semibold uppercase tracking-wider">Indemniz. & Recup.</span>
                            <span className="material-symbols-outlined text-[#1a73e8] text-[20px]">payments</span>
                        </div>
                        <p className="text-2xl font-bold text-[#202124] tracking-tight mt-1">$5,135.8M</p>
                        <div className="mt-1.5 flex items-center justify-between text-[11px]">
                            <span className="px-2 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333] font-medium border border-[#ceead6]">Recuperación $1,083.5M</span>
                            <span className="text-xs font-bold text-[#137333] bg-[#e6f4ea] px-1.5 py-0.5 rounded border border-[#ceead6]">21.1%</span>
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
                            <span className="text-[11px] font-semibold uppercase tracking-wider">Fallecidos en Sitio</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-[#fce8e6] text-[#c5221f] border border-[#fad2cf] rounded-full flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#c5221f] animate-ping"></span> CRÍTICO
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-[#c5221f] tracking-tight mt-1">1,947</p>
                        <div className="mt-1.5 text-[11px]">
                            <span className="px-2 py-0.5 rounded-full bg-[#fce8e6] text-[#c5221f] font-medium border border-[#fad2cf]">Mortalidad 0.83%</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* BARRA DE FILTROS DE BÚSQUEDA */}
            <div className="px-6 py-2.5 bg-white border-b border-[#dadce0] flex flex-wrap items-center justify-between gap-3 relative">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar por siniestro, folio, tramo..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="text-xs bg-white border border-[#dadce0] rounded-full pl-8 pr-3 py-1.5 w-64 text-[#202124] focus:ring-1 focus:ring-[#1a73e8] outline-none"
                    />
                    <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#5f6368] text-[16px]">search</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="appearance-none bg-white border border-[#dadce0] hover:border-[#bdc1c6] text-xs font-medium text-[#3c4043] rounded-full pl-3 pr-8 py-1.5 focus:ring-1 focus:ring-[#1a73e8] cursor-pointer shadow-xs outline-none"
                    >
                        <option value="">Todos los Estatus</option>
                        <option value="RECHAZADO">Rechazado</option>
                        <option value="EN REVISIÓN">En Revisión Exp.</option>
                        <option value="SIN FORMAL">Sin Formal Reclam.</option>
                        <option value="TERMINADO">Terminado</option>
                    </select>

                    <button
                        onClick={() => setShowMoreFilters(!showMoreFilters)}
                        className="flex items-center gap-1 px-3 py-1.5 text-[#0b57d0] hover:bg-[#e8f0fe] rounded-full font-semibold transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[16px]">filter_list</span>
                        <span>Más Filtros</span>
                    </button>
                </div>
            </div>

            {/* TABLA PRINCIPAL */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="bg-white rounded-xl border border-[#dadce0] shadow-xs overflow-hidden flex flex-col flex-1">
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-[#f8fafd] border-b border-[#dadce0] text-[11px] font-semibold uppercase tracking-wider text-[#5f6368]">
                                    <th className="py-3 px-4 w-12 text-center" scope="col">
                                        <input type="checkbox" className="rounded text-[#0b57d0] focus:ring-[#0b57d0] border-[#dadce0] w-4 h-4 cursor-pointer" />
                                    </th>
                                    <th className="py-3 px-3">Archivos Adjuntos</th>
                                    <th className="py-3 px-3">Número de Siniestro</th>
                                    <th className="py-3 px-3">Fecha Accidente</th>
                                    <th className="py-3 px-3">Cobertura</th>
                                    <th className="py-3 px-3">Tramo / Plaza de Cobro</th>
                                    <th className="py-3 px-3">Estatus Operativo</th>
                                    <th className="py-3 px-3">Discrepancia / Causa</th>
                                    <th className="py-3 px-3 text-center">Facturas</th>
                                    <th className="py-3 px-3 text-center">Reqs.</th>
                                    <th className="py-3 px-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e8eaed] text-[#3c4043]">
                                {filteredRows.length > 0 ? (
                                    filteredRows.map((row) => (
                                        <tr key={row.id} className="hover:bg-[#f8fafd] transition-colors group">
                                            <td className="py-2.5 px-4 text-center">
                                                <input type="checkbox" className="rounded text-[#0b57d0] focus:ring-[#0b57d0] border-[#dadce0] w-4 h-4 cursor-pointer" />
                                            </td>
                                            <td className="py-2.5 px-3">
                                                <button
                                                    onClick={() => onOpenArchivos(row)}
                                                    className="inline-flex items-center gap-1.5 text-[#1a73e8] hover:text-[#0b57d0] font-medium bg-[#e8f0fe] hover:bg-[#d3e3fd] px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-[16px] text-[#b06000]">folder</span>
                                                    <span>Ver Archivos ({row.archivosCount})</span>
                                                </button>
                                            </td>
                                            <td className="py-2.5 px-3 font-mono font-bold text-[#1a73e8]">
                                                <button
                                                    onClick={() => onOpenExpediente(row)}
                                                    className="hover:underline flex items-center gap-1 cursor-pointer"
                                                >
                                                    {row.id}
                                                </button>
                                            </td>
                                            <td className="py-2.5 px-3 text-[#5f6368] font-mono text-[11px]">{row.fechaAccidente}</td>
                                            <td className="py-2.5 px-3">
                                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${row.cobertura === 'RC USUARIO' ? 'bg-[#c2e7ff] text-[#001d35] border border-[#7fcfff]' : 'bg-[#f1f3f4] text-[#3c4043] border border-[#dadce0]'}`}>
                                                    {row.cobertura}
                                                </span>
                                            </td>
                                            <td className="py-2.5 px-3 font-medium text-[#202124]">
                                                <div className="truncate max-w-[200px]">{row.tramoCaseta}</div>
                                                <span className="text-[10px] text-[#5f6368] font-normal block">{row.coordinacion}</span>
                                            </td>
                                            <td className="py-2.5 px-3">
                                                {row.tipoEstatus === 'danger' && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#fce8e6] text-[#c5221f] border border-[#fad2cf]">
                                                        {row.estatus}
                                                    </span>
                                                )}
                                                {row.tipoEstatus === 'info' && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e8f0fe] text-[#1a73e8] border border-[#d3e3fd]">
                                                        {row.estatus}
                                                    </span>
                                                )}
                                                {row.tipoEstatus === 'neutral' && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f1f3f4] text-[#3c4043] border border-[#dadce0]">
                                                        {row.estatus}
                                                    </span>
                                                )}
                                                {row.tipoEstatus === 'success' && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e6f4ea] text-[#137333] border border-[#ceead6]">
                                                        {row.estatus}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-2.5 px-3 text-[#3c4043]">
                                                <span className="truncate max-w-[160px] inline-block font-medium">
                                                    {row.discrepancia}
                                                </span>
                                            </td>
                                            <td className="py-2.5 px-3 text-center">
                                                <button onClick={() => onOpenFacturas(row)} className="cursor-pointer">
                                                    {row.facturasCount > 0 ? (
                                                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#e6f4ea] text-[#137333]">
                                                            {row.facturasCount} Facs
                                                        </span>
                                                    ) : (
                                                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#f1f3f4] text-[#5f6368]">0</span>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="py-2.5 px-3 text-center font-bold text-[#0b57d0]">
                                                <button onClick={() => onOpenRequerimientos(row)} className="cursor-pointer hover:underline">
                                                    {row.reqsCount}
                                                </button>
                                            </td>
                                            <td className="py-2.5 px-4 text-right">
                                                <button onClick={() => onOpenExpediente(row)} className="p-1 rounded hover:bg-[#f1f3f4] text-[#5f6368] cursor-pointer">
                                                    <span className="material-symbols-outlined text-[17px]">edit</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="11" className="py-8 text-center text-[#5f6368]">
                                            No se encontraron siniestros registrados entre {fechaDesde} y {fechaHasta}.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* MODAL 1: EXPORTAR */}
            {activeModal === 'exportar' && (
                <div className="fixed inset-0 z-50 bg-[#202124]/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white border border-[#dadce0] rounded-3xl max-w-md w-full shadow-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-[#dadce0] pb-3">
                            <h3 className="text-base font-bold text-[#202124]">Exportar Siniestralidad</h3>
                            <button onClick={() => setActiveModal(null)} className="text-[#5f6368] hover:text-[#202124]"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <p className="text-xs text-[#5f6368]">Se descargará un consolidado de {filteredRows.length} registros filtrados por rango de fechas.</p>
                        <form onSubmit={handleConfirmExport} className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-xs font-semibold text-[#3c4043]">Formato:</label>
                                <select className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs text-[#202124] outline-none">
                                    <option value="csv">CSV / Excel Coma Separado</option>
                                    <option value="xlsx">Excel Libro de Trabajo (.xlsx)</option>
                                    <option value="pdf">Documento PDF</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full text-xs font-semibold text-[#5f6368]">Cancelar</button>
                                <button type="submit" disabled={isProcessing} className="px-5 py-2 rounded-full bg-[#188038] text-white text-xs font-semibold shadow-md flex items-center gap-1.5 cursor-pointer">
                                    <span className="material-symbols-outlined text-[18px]">{isProcessing ? 'sync' : 'download'}</span>
                                    <span>{isProcessing ? 'Generando...' : 'Descargar'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 2: CARGA MASIVA */}
            {activeModal === 'carga' && (
                <div className="fixed inset-0 z-50 bg-[#202124]/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white border border-[#dadce0] rounded-3xl max-w-md w-full shadow-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-[#dadce0] pb-3">
                            <h3 className="text-base font-bold text-[#202124]">Carga Masiva de Siniestros</h3>
                            <button onClick={() => setActiveModal(null)} className="text-[#5f6368] hover:text-[#202124]"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <form onSubmit={(e) => handleSimulatedSubmit(e, "Archivo procesado. Se cargaron 42 registros exitosamente.")} className="space-y-4">
                            <div className="border-2 border-dashed border-[#dadce0] rounded-2xl p-6 text-center hover:bg-[#f8fafd] transition cursor-pointer">
                                <span className="material-symbols-outlined text-[#1a73e8] text-[32px]">upload_file</span>
                                <p className="text-xs font-semibold text-[#202124] mt-1">Arrastra tu archivo plantilla aquí</p>
                                <p className="text-[10px] text-[#5f6368] mt-0.5">Soporta formatos .XLSX o .CSV (máx. 10MB)</p>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full text-xs font-semibold text-[#5f6368]">Cancelar</button>
                                <button type="submit" disabled={isProcessing} className="px-5 py-2 rounded-full bg-[#1a73e8] text-white text-xs font-semibold shadow-md cursor-pointer">
                                    {isProcessing ? 'Procesando...' : 'Subir Archivo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 3: AGREGAR FACTURA COMPLETO (SEGMENTADO EN PESTAÑAS GENERAL Y SEGUIMIENTO) */}
            {activeModal === 'factura' && (
                <div className="fixed inset-0 z-50 bg-[#202124]/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white border border-[#dadce0] rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-left">

                        {/* HEADER DEL MODAL */}
                        <div className="px-6 py-4 border-b border-[#dadce0] flex items-center justify-between bg-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[22px]">receipt_long</span>
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-[#202124]">Agregar Comprobante Fiscal</h3>
                                    <p className="text-[11px] text-[#5f6368]">Asociación de factura y seguimiento técnico del siniestro</p>
                                </div>
                            </div>
                            <button onClick={() => setActiveModal(null)} className="text-[#5f6368] hover:text-[#202124] p-1.5 rounded-full hover:bg-[#f1f3f4] cursor-pointer">
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        {/* PESTAÑAS GENERAL Y SEGUIMIENTO */}
                        <div className="px-6 border-b border-[#dadce0] bg-[#f8fafd] flex gap-2 shrink-0">
                            <button
                                type="button"
                                onClick={() => setActiveFacturaTab("general")}
                                className={`py-3 px-4 font-bold text-xs border-b-2 transition-all cursor-pointer flex items-center gap-2 ${activeFacturaTab === "general" ? "border-[#0b57d0] text-[#0b57d0] bg-white" : "border-transparent text-[#5f6368] hover:text-[#202124]"}`}
                            >
                                <span className="material-symbols-outlined text-[18px]">info</span>
                                <span>GENERAL</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveFacturaTab("seguimiento")}
                                className={`py-3 px-4 font-bold text-xs border-b-2 transition-all cursor-pointer flex items-center gap-2 ${activeFacturaTab === "seguimiento" ? "border-[#0b57d0] text-[#0b57d0] bg-white" : "border-transparent text-[#5f6368] hover:text-[#202124]"}`}
                            >
                                <span className="material-symbols-outlined text-[18px]">analytics</span>
                                <span>SEGUIMIENTO</span>
                            </button>
                        </div>

                        {/* FORMULARIO PESTAÑAS */}
                        <form onSubmit={(e) => handleSimulatedSubmit(e, "Factura agregada y vinculada exitosamente al siniestro.")} className="p-6 overflow-y-auto flex-1 space-y-5">

                            {/* CONTENIDOS DE LA PESTAÑA 1: GENERAL */}
                            {activeFacturaTab === "general" && (
                                <div className="space-y-4">

                                    {/* BLOQUE: DATOS DE INICIO */}
                                    <div>
                                        <h4 className="text-xs font-bold text-[#0b57d0] uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-[#e8eaed] pb-1">
                                            <span className="material-symbols-outlined text-[16px]">article</span>
                                            <span>Registro Inicial & Siniestro</span>
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Fecha de Creación (Auto)</label>
                                                <input type="date" value={formFactura.fechaCreacion} disabled className="w-full bg-[#f1f3f4] border border-[#dadce0] rounded-lg p-2 text-xs font-mono text-[#5f6368]" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Folio Escrito (Auto)</label>
                                                <input type="text" value={formFactura.folioEscrito} disabled className="w-full bg-[#f1f3f4] border border-[#dadce0] rounded-lg p-2 text-xs font-mono font-bold text-[#0b57d0]" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">No. de Siniestro (SIN) *</label>
                                                <input required type="number" placeholder="172738817" value={formFactura.noSiniestro} onChange={(e) => handleFormFacturaChange("noSiniestro", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs font-mono outline-none focus:ring-1 focus:ring-[#1a73e8]" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Fecha de Accidente (SIN)</label>
                                                <input type="date" value={formFactura.fechaAccidente} onChange={(e) => handleFormFacturaChange("fechaAccidente", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-[#1a73e8]" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* BLOQUE: UBICACIÓN */}
                                    <div>
                                        <h4 className="text-xs font-bold text-[#0b57d0] uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-[#e8eaed] pb-1">
                                            <span className="material-symbols-outlined text-[16px]">location_on</span>
                                            <span>Ubicación Geográfica de Infraestructura</span>
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Coordinación Regional (SIN)</label>
                                                <input type="text" placeholder="Coord. VIII Puebla" value={formFactura.coordinacionRegional} onChange={(e) => handleFormFacturaChange("coordinacionRegional", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-[#1a73e8]" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Tramo Carretero (SIN)</label>
                                                <input type="text" placeholder="México - Puebla KM 74" value={formFactura.tramoCarretero} onChange={(e) => handleFormFacturaChange("tramoCarretero", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-[#1a73e8]" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Caseta (SIN)</label>
                                                <input type="text" placeholder="San Martín" value={formFactura.caseta} onChange={(e) => handleFormFacturaChange("caseta", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-[#1a73e8]" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Número de Caseta (SIN)</label>
                                                <input type="text" placeholder="67" value={formFactura.numeroCaseta} onChange={(e) => handleFormFacturaChange("numeroCaseta", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs font-mono outline-none focus:ring-1 focus:ring-[#1a73e8]" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* BLOQUE: GESTIÓN DE PAGO */}
                                    <div>
                                        <h4 className="text-xs font-bold text-[#0b57d0] uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-[#e8eaed] pb-1">
                                            <span className="material-symbols-outlined text-[16px]">payments</span>
                                            <span>Gestión de Pago & Comprobante Fiscal</span>
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Conceptos para Pago</label>
                                                <input type="text" placeholder="Reparación barrera metálica" value={formFactura.conceptosPago} onChange={(e) => handleFormFacturaChange("conceptosPago", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-[#1a73e8]" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Beneficiario del Pago (SIN)</label>
                                                <input type="text" placeholder="CAPUFE FONADIN" value={formFactura.beneficiarioPago} onChange={(e) => handleFormFacturaChange("beneficiarioPago", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-[#1a73e8]" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Proveedor / Beneficiario (Catálogo)</label>
                                                <select value={formFactura.proveedorBeneficiario} onChange={(e) => handleFormFacturaChange("proveedorBeneficiario", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs text-[#202124] outline-none">
                                                    <option value="">Seleccionar Proveedor</option>
                                                    <option value="constructora">CONSTRUCTORA DE CARRETERAS S.A.</option>
                                                    <option value="mantenimiento">MANTENIMIENTO VIAL DEL CENTRO</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Referencia a Utilizar</label>
                                                <input type="text" placeholder="REF-2026-991" value={formFactura.referenciaUtilizar} onChange={(e) => handleFormFacturaChange("referenciaUtilizar", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs font-mono outline-none focus:ring-1 focus:ring-[#1a73e8]" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Categoría de Pago</label>
                                                <input type="text" placeholder="Infraestructura Dañada" value={formFactura.categoriaPago} onChange={(e) => handleFormFacturaChange("categoriaPago", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-[#1a73e8]" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Aseguradora Responsable (SIN)</label>
                                                <input type="text" placeholder="GNP SEGUROS" value={formFactura.aseguradoraResponsable} onChange={(e) => handleFormFacturaChange("aseguradoraResponsable", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs outline-none focus:ring-1 focus:ring-[#1a73e8]" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Número de Factura *</label>
                                                <input required type="number" placeholder="18639" value={formFactura.numeroFactura} onChange={(e) => handleFormFacturaChange("numeroFactura", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs font-mono font-bold text-[#137333] outline-none focus:ring-1 focus:ring-[#1a73e8]" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* BLOQUE: IMPORTES CON IVA 16% CALCULADO */}
                                    <div>
                                        <h4 className="text-xs font-bold text-[#0b57d0] uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-[#e8eaed] pb-1">
                                            <span className="material-symbols-outlined text-[16px]">calculate</span>
                                            <span>Importes & Desglose de IVA</span>
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-[#f8fafd] p-3 rounded-xl border border-[#dadce0]">
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Monto Reclamado</label>
                                                <input type="number" step="0.01" placeholder="$0.00" value={formFactura.montoReclamado} onChange={(e) => handleFormFacturaChange("montoReclamado", e.target.value)} className="w-full bg-white border border-[#dadce0] rounded-lg p-2 text-xs font-mono outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Monto M.N. (sin IVA) *</label>
                                                <input required type="number" step="0.01" placeholder="$0.00" value={formFactura.montoMN} onChange={(e) => handleFormFacturaChange("montoMN", e.target.value)} className="w-full bg-white border border-[#dadce0] rounded-lg p-2 text-xs font-mono font-bold text-[#202124] outline-none focus:ring-1 focus:ring-[#1a73e8]" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">IVA 16% (Calculado)</label>
                                                <input type="text" value={`$${importesCalculados.iva}`} disabled className="w-full bg-[#f1f3f4] border border-[#dadce0] rounded-lg p-2 text-xs font-mono text-[#b06000] font-semibold" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Monto con IVA (Calculado)</label>
                                                <input type="text" value={`$${importesCalculados.montoConIva}`} disabled className="w-full bg-[#e8f0fe] border border-[#d3e3fd] rounded-lg p-2 text-xs font-mono text-[#0b57d0] font-bold" />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            )}

                            {/* CONTENIDOS DE LA PESTAÑA 2: SEGUIMIENTO */}
                            {activeFacturaTab === "seguimiento" && (
                                <div className="space-y-4">

                                    {/* HITOS CRONOLÓGICOS */}
                                    <div>
                                        <h4 className="text-xs font-bold text-[#0b57d0] uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-[#e8eaed] pb-1">
                                            <span className="material-symbols-outlined text-[16px]">event_repeat</span>
                                            <span>Hitos Cronológicos de la Reclamación</span>
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Fecha Formal Reclamación (SIN)</label>
                                                <input type="date" value={formFactura.fechaFormalReclamacion} onChange={(e) => handleFormFacturaChange("fechaFormalReclamacion", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Fecha Recepción Garantía</label>
                                                <input type="date" value={formFactura.fechaRecepcionGarantia} onChange={(e) => handleFormFacturaChange("fechaRecepcionGarantia", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Fecha Expediente Completo</label>
                                                <input type="date" value={formFactura.fechaExpedienteCompleto} onChange={(e) => handleFormFacturaChange("fechaExpedienteCompleto", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Fecha Correo Confirmación</label>
                                                <input type="date" value={formFactura.fechaCorreoConfirmacion} onChange={(e) => handleFormFacturaChange("fechaCorreoConfirmacion", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs outline-none" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* ESTATUS Y OBSERVACIONES */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-[11px] font-semibold text-[#444746] mb-1">Estatus Reclamación *</label>
                                            <select value={formFactura.estatusReclamacion} onChange={(e) => handleFormFacturaChange("estatusReclamacion", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs text-[#202124] font-semibold outline-none">
                                                <option value="PENDIENTE ENVIAR A GNP">PENDIENTE ENVIAR A GNP</option>
                                                <option value="DETENIDA - ACLARACIÓN">DETENIDA - EN ACLARACIÓN</option>
                                                <option value="RECLAMACIÓN PAGADA">RECLAMACIÓN PAGADA</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-[#444746] mb-1">Observaciones</label>
                                            <input type="text" placeholder="Observaciones generales..." value={formFactura.observaciones} onChange={(e) => handleFormFacturaChange("observaciones", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-semibold text-[#444746] mb-1">Comentarios</label>
                                            <input type="text" placeholder="Comentarios de dictamen..." value={formFactura.comentarios} onChange={(e) => handleFormFacturaChange("comentarios", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs outline-none" />
                                        </div>
                                    </div>

                                    {/* APROBACIONES */}
                                    <div>
                                        <h4 className="text-xs font-bold text-[#0b57d0] uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-[#e8eaed] pb-1">
                                            <span className="material-symbols-outlined text-[16px]">approval</span>
                                            <span>Aprobaciones & Vo.Bo. Internos</span>
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Fecha Envío Vo.Bo. Supervisor</label>
                                                <input type="date" value={formFactura.fechaEnvioVoboSupervisor} onChange={(e) => handleFormFacturaChange("fechaEnvioVoboSupervisor", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Fecha Envío Vo.Bo. Dirección</label>
                                                <input type="date" value={formFactura.fechaEnvioVoboDireccion} onChange={(e) => handleFormFacturaChange("fechaEnvioVoboDireccion", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Vo.Bo. Recomendación de Pago</label>
                                                <input type="date" value={formFactura.voboRecomendacionPago} onChange={(e) => handleFormFacturaChange("voboRecomendacionPago", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs outline-none" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* GESTIÓN DE PAGO CON GNP */}
                                    <div>
                                        <h4 className="text-xs font-bold text-[#0b57d0] uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-[#e8eaed] pb-1">
                                            <span className="material-symbols-outlined text-[16px]">published_with_changes</span>
                                            <span>Gestión de Pago con Aseguradora GNP</span>
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Fecha Recomendación de Pago</label>
                                                <input type="date" value={formFactura.fechaRecomendacionPago} onChange={(e) => handleFormFacturaChange("fechaRecomendacionPago", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Fecha Vo.Bo. GNP</label>
                                                <input type="date" value={formFactura.fechaVoboGnp} onChange={(e) => handleFormFacturaChange("fechaVoboGnp", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Fecha de Pago de GNP</label>
                                                <input type="date" value={formFactura.fechaPagoGnp} onChange={(e) => handleFormFacturaChange("fechaPagoGnp", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Referencia GNP</label>
                                                <input type="text" placeholder="GNP-PAY-881" value={formFactura.referenciaGnp} onChange={(e) => handleFormFacturaChange("referenciaGnp", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs font-mono outline-none" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* MÉTRICAS & INDICADORES */}
                                    <div>
                                        <h4 className="text-xs font-bold text-[#0b57d0] uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-[#e8eaed] pb-1">
                                            <span className="material-symbols-outlined text-[16px]">speed</span>
                                            <span>Métricas de Reparación & KPIS</span>
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Tiempo de Reparación</label>
                                                <input type="text" placeholder="15 días" value={formFactura.tiempoReparacion} onChange={(e) => handleFormFacturaChange("tiempoReparacion", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Días Atraso en Reparación</label>
                                                <input type="number" placeholder="2" value={formFactura.diasAtrasoReparacion} onChange={(e) => handleFormFacturaChange("diasAtrasoReparacion", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs font-mono outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Días Reparación Justificados</label>
                                                <input type="number" placeholder="13" value={formFactura.diasReparacionJustificados} onChange={(e) => handleFormFacturaChange("diasReparacionJustificados", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs font-mono outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Tabulador de Reparación</label>
                                                <input type="text" placeholder="TAB-2026-A" value={formFactura.tabuladorReparacion} onChange={(e) => handleFormFacturaChange("tabuladorReparacion", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Monto Ahorrado (FLOAT)</label>
                                                <input type="number" step="0.01" placeholder="$0.00" value={formFactura.montoAhorrado} onChange={(e) => handleFormFacturaChange("montoAhorrado", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs font-mono outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">KPI Indemnización - GNP</label>
                                                <input type="number" placeholder="98" value={formFactura.kpiIndemnizacionGnp} onChange={(e) => handleFormFacturaChange("kpiIndemnizacionGnp", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs font-mono outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Importe Penalización</label>
                                                <input type="number" step="0.01" placeholder="$0.00" value={formFactura.importePenalizacion} onChange={(e) => handleFormFacturaChange("importePenalizacion", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs font-mono text-[#c5221f] outline-none" />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            )}

                            {/* FOOTER ACCIONES DEL MODAL */}
                            <div className="flex items-center justify-between pt-4 border-t border-[#dadce0]">
                                <div className="text-[11px] text-[#5f6368]">
                                    Pestaña activa: <strong className="uppercase text-[#0b57d0]">{activeFacturaTab}</strong>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full text-xs font-semibold text-[#5f6368] hover:bg-[#f1f3f4] cursor-pointer">
                                        Cancelar
                                    </button>
                                    <button type="submit" disabled={isProcessing} className="px-6 py-2 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white text-xs font-semibold shadow-md cursor-pointer flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[18px]">{isProcessing ? 'sync' : 'save'}</span>
                                        <span>{isProcessing ? 'Guardando Registro...' : 'Guardar Factura Completa'}</span>
                                    </button>
                                </div>
                            </div>
                        </form>

                    </div>
                </div>
            )}

            {/* MODAL 4: AGREGAR REQUERIMIENTO */}
            {activeModal === 'requerimiento' && (
                <div className="fixed inset-0 z-50 bg-[#202124]/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white border border-[#dadce0] rounded-3xl max-w-lg w-full shadow-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-[#dadce0] pb-3">
                            <h3 className="text-base font-bold text-[#202124]">Agregar Requerimiento</h3>
                            <button onClick={() => setActiveModal(null)} className="text-[#5f6368] hover:text-[#202124]"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <form onSubmit={(e) => handleSimulatedSubmit(e, "Requerimiento asignado al siniestro.")} className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-[#3c4043] mb-1">No. de Siniestro *</label>
                                <input required type="text" placeholder="ej. 172738817" className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs font-mono outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-[#3c4043] mb-1">Tipo Requerimiento *</label>
                                <select className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs text-[#202124] outline-none">
                                    <option value="EXPEDIENTE">ENTREGA DE EXPEDIENTE</option>
                                    <option value="EXTEMPORANEO">EXTEMPORÁNEO</option>
                                    <option value="OFICIO">OFICIO A CAPUFE</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-[#3c4043] mb-1">Observaciones</label>
                                <textarea rows="2" placeholder="Detalle de solicitud..." className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs outline-none"></textarea>
                            </div>
                            <div className="flex justify-end gap-2 pt-3 border-t border-[#dadce0]">
                                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full text-xs font-semibold text-[#5f6368]">Cancelar</button>
                                <button type="submit" disabled={isProcessing} className="px-5 py-2 rounded-full bg-[#1a73e8] text-white text-xs font-semibold shadow-md cursor-pointer">
                                    {isProcessing ? 'Asignando...' : 'Guardar Requerimiento'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 5: NUEVO SINIESTRO */}
            {activeModal === 'nuevo' && (
                <div className="fixed inset-0 z-50 bg-[#202124]/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white border border-[#dadce0] rounded-3xl max-w-xl w-full shadow-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-[#dadce0] pb-3">
                            <h3 className="text-base font-bold text-[#202124]">Registrar Nuevo Siniestro</h3>
                            <button onClick={() => setActiveModal(null)} className="text-[#5f6368] hover:text-[#202124]"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <form onSubmit={(e) => handleSimulatedSubmit(e, "Siniestro registrado exitosamente en el sistema.")} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-[#3c4043] mb-1">No. Siniestro *</label>
                                    <input required type="text" placeholder="178920193" className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs font-mono outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-[#3c4043] mb-1">Fecha Ocurrencia *</label>
                                    <input required type="date" className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs outline-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-[#3c4043] mb-1">Cobertura *</label>
                                    <select className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs text-[#202124] outline-none">
                                        <option value="RC AUTOPISTA">RC AUTOPISTA</option>
                                        <option value="RC USUARIO">RC USUARIO</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-[#3c4043] mb-1">Coordinación Regional *</label>
                                    <select className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs text-[#202124] outline-none">
                                        <option value="Puebla">Coord. VIII Puebla</option>
                                        <option value="Cuernavaca">Coord. VII Cuernavaca</option>
                                        <option value="Querétaro">Coord. VI Querétaro</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-[#3c4043] mb-1">Tramo Carretero / Plaza de Cobro *</label>
                                <input required type="text" placeholder="ej. México - Puebla KM 74" className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs outline-none" />
                            </div>
                            <div className="flex justify-end gap-2 pt-3 border-t border-[#dadce0]">
                                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full text-xs font-semibold text-[#5f6368]">Cancelar</button>
                                <button type="submit" disabled={isProcessing} className="px-6 py-2 rounded-full bg-[#0b57d0] text-white text-xs font-semibold shadow-md cursor-pointer">
                                    {isProcessing ? 'Registrando...' : 'Alta de Siniestro'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* FOOTER */}
            <footer className="h-12 border-t border-[#dadce0] bg-white px-6 flex items-center justify-between text-xs text-[#5f6368] select-none shrink-0">
                <div className="flex items-center gap-2">
                    <span>Módulo Siniestralidad:</span>
                    <span className="font-bold text-[#202124]">{filteredRows.length} registros en vista</span>
                </div>
                <div>
                    <span>Consolidado CAPUFE / GNP</span>
                </div>
            </footer>

        </div>
    );
}