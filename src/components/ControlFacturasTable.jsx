import React, { useState, useMemo } from "react";

// MOCK DATA DE GRUPOS DE FACTURAS
const MOCK_GROUPS = [
    {
        id: "171753205",
        numFacturas: 5,
        tramo: "Puentes Nacionales",
        caseta: "DOVALI (67)",
        totalSiniestro: 48250.00,
        fechaAccidente: "2026-02-15",
        expanded: true,
        facturas: [
            {
                id: "f1",
                numSiniestro: "171753205",
                fechaCreacion: "2026-07-31",
                folioEscrito: "-",
                numFactura: "-",
                estatus: "PENDIENTE ENVIAR A GNP",
                tipoEstatus: "warning",
                fechaEnvioVo: "-"
            },
            {
                id: "f2",
                numSiniestro: "171753205",
                fechaCreacion: "2026-07-21",
                folioEscrito: "GNP-CAPUFE-RP-00004",
                numFactura: "-",
                estatus: "DETENIDA - SE SOLICITO ACLARACION NO SE APRECIA DAÑO A CABINA COMPLETA",
                tipoEstatus: "danger",
                fechaEnvioVo: "-"
            },
            {
                id: "f3",
                numSiniestro: "171753205",
                fechaCreacion: "2026-07-15",
                folioEscrito: "GNP-CAPUFE-RP-00003",
                numFactura: "-",
                estatus: "DETENIDA - SE SOLICITO EVIDENCIA Y EL PROVEEDOR NO COMPARTIO EVIDENCIA",
                tipoEstatus: "danger",
                fechaEnvioVo: "-"
            },
            {
                id: "f4",
                numSiniestro: "171753205",
                fechaCreacion: "2026-06-10",
                folioEscrito: "GNP-CAPUFE-RP-33440",
                numFactura: "N/A",
                estatus: "RECLAMACIÓN PAGADA",
                tipoEstatus: "success",
                fechaEnvioVo: "2026-06-12"
            },
            {
                id: "f5",
                numSiniestro: "171753205",
                fechaCreacion: "2026-07-01",
                folioEscrito: "GNP-CAPUFE-RP-33904",
                numFactura: "18639",
                estatus: "PENDIENTE ENVIAR A GNP",
                tipoEstatus: "warning",
                fechaEnvioVo: "2026-07-02"
            }
        ]
    },
    {
        id: "171129208",
        numFacturas: 1,
        tramo: "México - Cuernavaca",
        caseta: "TALLER DE LLANTAS ELÉCTRICAS",
        totalSiniestro: 3450.00,
        fechaAccidente: "2026-01-20",
        expanded: false,
        facturas: []
    },
    {
        id: "171249808",
        numFacturas: 1,
        tramo: "Chamapa - Lechería",
        caseta: "Factura: 49201",
        totalSiniestro: 8120.00,
        fechaAccidente: "2025-11-05",
        expanded: false,
        facturas: []
    }
];

export default function ControlFacturasTable({ rows = [], siniestros = [], loading = false, error = null, initialFilter = "" }) {
    // ESTADOS DE VISTA Y FILTRADO
    const [searchQuery, setSearchQuery] = useState(initialFilter);
    const [statusFilter, setStatusFilter] = useState("");
    const [groups, setGroups] = useState(MOCK_GROUPS);

    // ESTADOS DE FECHAS (DESDE / HASTA)
    const [fechaDesde, setFechaDesde] = useState("2020-01-01");
    const [fechaHasta, setFechaHasta] = useState("2026-12-31");

    // ESTADOS DE MODALES SIMULADOS
    const [activeModal, setActiveModal] = useState(null); // 'exportar' | 'carga' | 'siniestro' | 'requerimiento' | 'factura' | null
    const [isProcessing, setIsProcessing] = useState(false);

    // PESTAÑA ACTIVA EN MODAL DE REGISTRAR FACTURA
    const [activeFacturaTab, setActiveFacturaTab] = useState("general"); // 'general' | 'seguimiento'

    // ESTADO DEL FORMULARIO REGISTRAR FACTURA (CAMPOS ESPECIFICADOS)
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

    // ALTERNAR GRUPO ACORDEÓN
    const toggleGroup = (siniestroId) => {
        setGroups((prev) => prev.map(g => g.id === siniestroId ? { ...g, expanded: !g.expanded } : g));
    };

    // FILTRADO DINÁMICO POR FECHAS Y BÚSQUEDA
    const filteredGroups = useMemo(() => {
        return groups.filter(g => {
            const matchFecha = (!fechaDesde || g.fechaAccidente >= fechaDesde) && (!fechaHasta || g.fechaAccidente <= fechaHasta);
            const matchSearch = !searchQuery ||
                g.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                g.tramo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                g.caseta.toLowerCase().includes(searchQuery.toLowerCase());

            return matchFecha && matchSearch;
        });
    }, [groups, fechaDesde, fechaHasta, searchQuery]);

    // ACCIÓN: IMPRIMIR
    const handleImprimir = () => {
        window.print();
    };

    // ACCIÓN: EXPORTAR
    const handleConfirmExport = (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setTimeout(() => {
            const headers = ["SINIESTRO", "CANT_FACTURAS", "TRAMO", "CASETA", "TOTAL_SINIESTRO"];
            const rowsCsv = filteredGroups.map(g => [
                g.id, g.numFacturas, `"${g.tramo}"`, `"${g.caseta}"`, g.totalSiniestro
            ].join(","));
            const csvContent = [headers.join(","), ...rowsCsv].join("\n");

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Control_Facturas_${fechaDesde}_al_${fechaHasta}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setIsProcessing(false);
            setActiveModal(null);
        }, 1200);
    };

    // SUBMIT GENÉRICO DE MODALES SIMULADOS
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
        <div className="flex-1 flex flex-col h-full bg-[#f8fafd] overflow-hidden text-[#202124] font-sans text-xs">

            {/* CABECERA CENTRADA HOMOLOGADA */}
            <section className="px-6 py-5 flex flex-col items-center justify-center gap-4 border-b border-[#dadce0] bg-white text-center">
                <div>
                    <h1 className="text-4xl font-extrabold text-[#0a192f] tracking-tight">
                        Control de Facturas
                    </h1>
                </div>

                {/* ACCIONES Y FECHAS UNIFICADAS */}
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

                    {/* BOTONES DE ACCIÓN: AGREGAR SINIESTRO, REQUERIMIENTO Y REGISTRAR FACTURA */}
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => setActiveModal('siniestro')}
                            className="flex items-center gap-1.5 bg-white border border-[#dadce0] text-[#3c4043] hover:bg-[#f1f3f4] font-medium px-2.5 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[#188038] text-[16px]">car_crash</span>
                            <span>Agregar siniestro</span>
                        </button>
                        <button
                            onClick={() => setActiveModal('requerimiento')}
                            className="flex items-center gap-1.5 bg-white border border-[#dadce0] text-[#3c4043] hover:bg-[#f1f3f4] font-medium px-2.5 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[#1a73e8] text-[16px]">assignment_turned_in</span>
                            <span>Agregar requerimiento</span>
                        </button>
                        <button
                            onClick={() => setActiveModal('factura')}
                            className="flex items-center gap-1.5 bg-[#0b57d0] hover:bg-[#0842a0] text-white font-semibold px-3 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[16px]">add</span>
                            <span>Registrar Factura</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* DASHBOARD METRICS BAR */}
            <section className="px-6 py-4 bg-[#f8fafd] border-b border-[#dadce0]/80">
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
                    <div className="bg-white border border-[#dadce0] rounded-xl p-3 shadow-xs hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between text-[#5f6368]">
                            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Facturas</span>
                            <span className="material-symbols-outlined text-[#1a73e8] text-[20px]">receipt</span>
                        </div>
                        <p className="text-2xl font-bold text-[#202124] tracking-tight mt-1">1,482</p>
                        <div className="text-[11px] text-[#5f6368] mt-1.5">
                            <span className="font-medium text-[#1a73e8]">632</span> siniestros únicos
                        </div>
                    </div>

                    <div className="bg-white border border-[#dadce0] rounded-xl p-3 shadow-xs hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between text-[#b06000]">
                            <span className="text-[11px] font-semibold uppercase tracking-wider">Pendientes Envío</span>
                            <span className="material-symbols-outlined text-[#b06000] text-[20px]">pending_actions</span>
                        </div>
                        <p className="text-2xl font-bold text-[#b06000] tracking-tight mt-1">184</p>
                        <div className="mt-1.5 text-[11px]">
                            <span className="px-2 py-0.5 rounded-full bg-[#fef7e0] text-[#b06000] font-medium border border-[#feefc3]">Aseguradora GNP</span>
                        </div>
                    </div>

                    <div className="bg-white border border-[#dadce0] rounded-xl p-3 shadow-xs hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between text-[#c5221f]">
                            <span className="text-[11px] font-semibold uppercase tracking-wider">Detenidas / Aclaración</span>
                            <span className="material-symbols-outlined text-[#c5221f] text-[20px]">error_outline</span>
                        </div>
                        <p className="text-2xl font-bold text-[#c5221f] tracking-tight mt-1">27</p>
                        <div className="mt-1.5 text-[11px]">
                            <span className="px-2 py-0.5 rounded-full bg-[#fce8e6] text-[#c5221f] font-medium border border-[#fad2cf]">Requiere evidencia</span>
                        </div>
                    </div>

                    <div className="bg-white border border-[#dadce0] rounded-xl p-3 shadow-xs hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between text-[#137333]">
                            <span className="text-[11px] font-semibold uppercase tracking-wider">Reclamaciones Pagadas</span>
                            <span className="material-symbols-outlined text-[#137333] text-[20px]">check_circle</span>
                        </div>
                        <p className="text-2xl font-bold text-[#137333] tracking-tight mt-1">1,271</p>
                        <div className="mt-1.5 text-[11px]">
                            <span className="px-2 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333] font-medium border border-[#ceead6]">Conciliadas CAPUFE</span>
                        </div>
                    </div>

                    <div className="bg-white border border-[#dadce0] rounded-xl p-3 shadow-xs hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between text-[#1a73e8]">
                            <span className="text-[11px] font-semibold uppercase tracking-wider">Importe Facturado</span>
                            <span className="material-symbols-outlined text-[#1a73e8] text-[20px]">payments</span>
                        </div>
                        <p className="text-2xl font-bold text-[#202124] tracking-tight mt-1">
                            $3,842,500.00
                        </p>
                        <div className="text-[11px] text-[#5f6368] mt-1.5">
                            <span className="font-medium text-[#1a73e8]">MXN</span> Mes en curso
                        </div>
                    </div>
                </div>
            </section>

            {/* BARRA DE FILTROS */}
            <div className="px-6 py-2.5 bg-white border-b border-[#dadce0] flex flex-wrap items-center justify-between gap-3 relative">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar por factura, siniestro, proveedor..."
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
                        <option value="">Todos los Estados</option>
                        <option value="pendiente">Pendiente Enviar a GNP</option>
                        <option value="detenida">Detenida / Aclaración</option>
                        <option value="pagada">Reclamación Pagada</option>
                    </select>

                    <button className="flex items-center gap-1 px-3 py-1.5 text-[#0b57d0] hover:bg-[#e8f0fe] rounded-full font-semibold transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-[16px]">filter_list</span>
                        <span>Más Filtros</span>
                    </button>
                </div>
            </div>

            {/* TABLA PRINCIPAL DE FACTURAS */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="bg-white border border-[#dadce0] rounded-xl overflow-hidden shadow-xs">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-[#f8fafd] border-b border-[#dadce0] text-[#5f6368] uppercase text-[11px] font-semibold tracking-wider">
                                <th className="py-3 px-4 w-64">No. de Siniestro</th>
                                <th className="py-3 px-4 w-32">Fecha Creación</th>
                                <th className="py-3 px-4 w-44">Folio Escrito</th>
                                <th className="py-3 px-4 w-36">Número Factura</th>
                                <th className="py-3 px-4">Observaciones & Estatus</th>
                                <th className="py-3 px-4 w-36">Fecha Envío VO</th>
                                <th className="py-3 px-4 w-28 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e8eaed]">
                            {filteredGroups.length > 0 ? (
                                filteredGroups.map((grupo) => (
                                    <React.Fragment key={grupo.id}>
                                        <tr className="bg-[#e8f0fe]/40 hover:bg-[#e8f0fe]/70 transition-colors border-l-4 border-l-[#1a73e8]">
                                            <td className="py-3 px-4" colSpan="7">
                                                <div className="flex items-center justify-between flex-wrap gap-2">
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => toggleGroup(grupo.id)}
                                                            className="flex items-center gap-2 text-[#0b57d0] font-bold hover:underline focus:outline-none cursor-pointer"
                                                        >
                                                            <span className="material-symbols-outlined text-[#1a73e8] text-[20px]">
                                                                {grupo.expanded ? "expand_more" : "chevron_right"}
                                                            </span>
                                                            <span className="font-mono text-sm">{grupo.id}</span>
                                                        </button>
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#d3e3fd] text-[#041e49]">
                                                            {grupo.numFacturas} FACTURAS
                                                        </span>
                                                        <span className="text-[#5f6368] text-xs">
                                                            Tramo: <strong className="text-[#3c4043] font-medium">{grupo.tramo}</strong> | Caseta: <strong className="text-[#3c4043] font-medium">{grupo.caseta}</strong>
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-xs text-[#5f6368]">
                                                            Total Siniestro: <strong className="text-[#202124] font-bold text-sm">${grupo.totalSiniestro.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN</strong>
                                                        </span>
                                                        <button
                                                            onClick={() => setActiveModal('factura')}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-[#f1f3f4] text-[#0b57d0] font-semibold rounded-full text-xs border border-[#dadce0] transition cursor-pointer"
                                                        >
                                                            <span className="material-symbols-outlined text-[14px]">add</span>
                                                            <span>Factura</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>

                                        {grupo.expanded && grupo.facturas.map((f) => (
                                            <tr key={f.id} className="bg-white hover:bg-[#f8fafd] transition-colors">
                                                <td className="py-2.5 px-4 pl-11 font-mono text-[#1a73e8] font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-[#bdc1c6] text-[16px]">subdirectory_arrow_right</span>
                                                        <span>{f.numSiniestro}</span>
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-4 text-[#3c4043] font-mono">{f.fechaCreacion}</td>
                                                <td className="py-2.5 px-4 text-[#202124] font-mono font-medium">{f.folioEscrito}</td>
                                                <td className="py-2.5 px-4 text-[#137333] font-mono font-bold">{f.numFactura}</td>
                                                <td className="py-2.5 px-4">
                                                    {f.tipoEstatus === 'warning' && (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#fef7e0] text-[#b06000] border border-[#feefc3]">
                                                            {f.estatus}
                                                        </span>
                                                    )}
                                                    {f.tipoEstatus === 'danger' && (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#fce8e6] text-[#c5221f] border border-[#fad2cf]">
                                                            {f.estatus}
                                                        </span>
                                                    )}
                                                    {f.tipoEstatus === 'success' && (
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#e6f4ea] text-[#137333] border border-[#ceead6]">
                                                            {f.estatus}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-2.5 px-4 text-[#3c4043] font-mono">{f.fechaEnvioVo}</td>
                                                <td className="py-2.5 px-4 text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <button className="p-1 text-[#5f6368] hover:text-[#1a73e8] rounded-full hover:bg-[#f1f3f4] cursor-pointer" title="Editar"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="py-8 text-center text-[#5f6368]">
                                        No se encontraron registros de facturas entre {fechaDesde} y {fechaHasta}.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL 1: EXPORTAR */}
            {activeModal === 'exportar' && (
                <div className="fixed inset-0 z-50 bg-[#202124]/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white border border-[#dadce0] rounded-3xl max-w-md w-full shadow-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-[#dadce0] pb-3">
                            <h3 className="text-base font-bold text-[#202124]">Exportar Facturas</h3>
                            <button onClick={() => setActiveModal(null)} className="text-[#5f6368] hover:text-[#202124]"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <p className="text-xs text-[#5f6368]">Se descargará un reporte del control de facturas filtrado ({filteredGroups.length} siniestros).</p>
                        <form onSubmit={handleConfirmExport} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-[#3c4043] mb-1">Formato:</label>
                                <select className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs text-[#202124] outline-none">
                                    <option value="csv">CSV / Excel Coma Separado</option>
                                    <option value="xlsx">Excel Libro de Trabajo (.xlsx)</option>
                                    <option value="pdf">Documento PDF</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full text-xs font-semibold text-[#5f6368]">Cancelar</button>
                                <button type="submit" disabled={isProcessing} className="px-5 py-2 rounded-full bg-[#188038] text-white text-xs font-semibold shadow-md cursor-pointer flex items-center gap-1.5">
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
                            <h3 className="text-base font-bold text-[#202124]">Carga Masiva de Facturas</h3>
                            <button onClick={() => setActiveModal(null)} className="text-[#5f6368] hover:text-[#202124]"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <form onSubmit={(e) => handleSimulatedSubmit(e, "Archivo procesado. Se cargaron 18 facturas correctamente.")} className="space-y-4">
                            <div className="border-2 border-dashed border-[#dadce0] rounded-2xl p-6 text-center hover:bg-[#f8fafd] transition cursor-pointer">
                                <span className="material-symbols-outlined text-[#1a73e8] text-[32px]">upload_file</span>
                                <p className="text-xs font-semibold text-[#202124] mt-1">Arrastra tu archivo XML / CSV / XLSX aquí</p>
                                <p className="text-[10px] text-[#5f6368] mt-0.5">Comprobantes fiscales digitales (máx. 10MB)</p>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full text-xs font-semibold text-[#5f6368]">Cancelar</button>
                                <button type="submit" disabled={isProcessing} className="px-5 py-2 rounded-full bg-[#1a73e8] text-white text-xs font-semibold shadow-md cursor-pointer">
                                    {isProcessing ? 'Procesando...' : 'Subir Facturas'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 3: AGREGAR SINIESTRO */}
            {activeModal === 'siniestro' && (
                <div className="fixed inset-0 z-50 bg-[#202124]/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white border border-[#dadce0] rounded-3xl max-w-md w-full shadow-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-[#dadce0] pb-3">
                            <h3 className="text-base font-bold text-[#202124]">Agregar Siniestro a Control de Facturas</h3>
                            <button onClick={() => setActiveModal(null)} className="text-[#5f6368] hover:text-[#202124]"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <form onSubmit={(e) => handleSimulatedSubmit(e, "Siniestro vinculado al módulo de facturación.")} className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-[#3c4043] mb-1">No. de Siniestro *</label>
                                <input required type="text" placeholder="171992011" className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs font-mono outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-[#3c4043] mb-1">Tramo Carretero / Caseta *</label>
                                <input required type="text" placeholder="México - Puebla / Caseta San Martín" className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs outline-none" />
                            </div>
                            <div className="flex justify-end gap-2 pt-3 border-t border-[#dadce0]">
                                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full text-xs font-semibold text-[#5f6368]">Cancelar</button>
                                <button type="submit" disabled={isProcessing} className="px-5 py-2 rounded-full bg-[#188038] text-white text-xs font-semibold shadow-md cursor-pointer">
                                    {isProcessing ? 'Guardando...' : 'Asignar Siniestro'}
                                </button>
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
                        <form onSubmit={(e) => handleSimulatedSubmit(e, "Requerimiento registrado.")} className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-[#3c4043] mb-1">No. de Siniestro *</label>
                                <input required type="text" placeholder="171753205" className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs font-mono outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-[#3c4043] mb-1">Detalle del Requerimiento</label>
                                <textarea rows="2" placeholder="Solicitar aclaración o comprobantes faltantes..." className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs outline-none"></textarea>
                            </div>
                            <div className="flex justify-end gap-2 pt-3 border-t border-[#dadce0]">
                                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full text-xs font-semibold text-[#5f6368]">Cancelar</button>
                                <button type="submit" disabled={isProcessing} className="px-5 py-2 rounded-full bg-[#1a73e8] text-white text-xs font-semibold shadow-md cursor-pointer">
                                    {isProcessing ? 'Guardando...' : 'Guardar Requerimiento'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 5: REGISTRAR NUEVA FACTURA SEGMENTADO CON PESTAÑAS GENERAL Y SEGUIMIENTO */}
            {activeModal === 'factura' && (
                <div className="fixed inset-0 z-50 bg-[#202124]/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white border border-[#dadce0] rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">

                        {/* HEADER DEL MODAL */}
                        <div className="px-6 py-4 border-b border-[#dadce0] flex items-center justify-between bg-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[22px]">receipt_long</span>
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-[#202124]">Registrar Nueva Factura</h3>
                                    <p className="text-[11px] text-[#5f6368]">Alta y control operativo de comprobantes fiscales</p>
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
                        <form onSubmit={(e) => handleSimulatedSubmit(e, "Factura registrada exitosamente con toda la información técnica y de seguimiento.")} className="p-6 overflow-y-auto flex-1 space-y-5">

                            {/* CONTENIDAS DE LA PESTAÑA 1: GENERAL */}
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
                                                <input required type="number" placeholder="171753205" value={formFactura.noSiniestro} onChange={(e) => handleFormFacturaChange("noSiniestro", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs font-mono outline-none focus:ring-1 focus:ring-[#1a73e8]" />
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

            {/* FOOTER */}
            <footer className="h-12 border-t border-[#dadce0] bg-white px-6 flex items-center justify-between text-xs text-[#5f6368] select-none shrink-0">
                <div className="flex items-center gap-2">
                    <span>Control de Facturas:</span>
                    <span className="font-bold text-[#202124]">{filteredGroups.length} siniestros filtrados</span>
                </div>
            </footer>

        </div>
    );
}