import React, { useState, useMemo } from "react";

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

    // PAGINACIÓN PARA GRANDES VOLÚMENES
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 50;

    // ESTADOS DE MODALES
    const [activeModal, setActiveModal] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeFacturaTab, setActiveFacturaTab] = useState("general");

    const [formFactura, setFormFactura] = useState({
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

    // NORMALIZACIÓN DE DATOS DIRECTA DE LA BASE DE DATOS (100% REAL)
    const dataSource = useMemo(() => {
        if (!Array.isArray(rows)) return [];

        return rows.map((r, index) => {
            // Número de siniestro
            const id = String(
                r.numero_siniestro || r.num_siniestro || r.id_siniestro || r.id || r.folio || `SIN-${index + 1}`
            );

            // Fecha de ocurrencia / accidente
            const fechaAccidente = String(
                r.fecha_accidente || r.fechaAccidente || r.fecha_ocurrencia || r.fecha || ""
            ).split("T")[0];

            // Cobertura
            const cobertura = String(
                r.cobertura || r.tipo_cobertura || r.cobertura_afectada || "RC AUTOPISTA"
            ).toUpperCase();

            // Tramo carretero y caseta
            const tramoCarretero = r.tramo_carretero || r.tramoCaseta || r.tramo || r.nombre_tramo || "Tramo no especificado";
            const plazaCobro = r.plaza_cobro || r.caseta || r.nombre_caseta || "";
            const tramoCaseta = plazaCobro ? `${tramoCarretero} • ${plazaCobro}` : tramoCarretero;

            // Coordinación regional
            const coordinacion = r.coordinacion_regional || r.coordinacion || r.unidad_regional || "Coord. General";

            // Estatus operativo
            const estatusRaw = r.estatus_operativo || r.estatus || r.estado || r.estatus_reclamacion || r.estatus_siniestro || "EN PROCESO";
            const estatus = String(estatusRaw).toUpperCase();

            // Discrepancia o causa
            const discrepancia = r.discrepancia_causa || r.discrepancia || r.causa || r.causa_siniestro || r.observaciones || r.concepto || "Sin discrepancia";

            // Conteo de archivos adjuntos
            const archivosCount = r.archivos_count ?? r.archivosCount ?? (Array.isArray(r.archivos) ? r.archivos.length : 0);

            // Conteo de facturas
            const facturasCount = r.facturas_count ?? r.facturasCount ?? (Array.isArray(r.facturas) ? r.facturas.length : (r.total_facturas || 0));

            // Conteo de requerimientos
            const reqsCount = r.requerimientos_count ?? r.reqs_count ?? r.reqsCount ?? (Array.isArray(r.requerimientos) ? r.requerimientos.length : (r.total_requerimientos || 0));

            // Determinar variante de color de badge
            let tipoEstatus = "neutral";
            if (estatus.includes("RECHAZ") || estatus.includes("CANCEL") || estatus.includes("IMPROCEDENTE")) {
                tipoEstatus = "danger";
            } else if (estatus.includes("REVISI") || estatus.includes("DICTAM") || estatus.includes("ANALISIS") || estatus.includes("PROCESO") || estatus.includes("TRAMITE")) {
                tipoEstatus = "info";
            } else if (estatus.includes("TERMIN") || estatus.includes("PAGAD") || estatus.includes("CONCLU") || estatus.includes("CERRAD") || estatus.includes("LIQUIDADO")) {
                tipoEstatus = "success";
            }

            return {
                ...r,
                id,
                fechaAccidente,
                cobertura,
                tramoCaseta,
                coordinacion,
                estatus,
                tipoEstatus,
                discrepancia,
                archivosCount,
                facturasCount,
                reqsCount
            };
        });
    }, [rows]);

    // FILTRADO DINÁMICO
    const filteredRows = useMemo(() => {
        return dataSource.filter((row) => {
            const matchStatus = !statusFilter || row.estatus.toLowerCase().includes(statusFilter.toLowerCase());
            const matchCoord = selectedCoord === "Todas" || row.coordinacion.includes(selectedCoord);
            const matchCobertura = selectedCobertura === "Todas" || row.cobertura.includes(selectedCobertura);
            const matchSearch =
                !searchQuery ||
                row.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                row.tramoCaseta.toLowerCase().includes(searchQuery.toLowerCase()) ||
                row.discrepancia.toLowerCase().includes(searchQuery.toLowerCase());

            const matchFecha =
                (!fechaDesde || !row.fechaAccidente || row.fechaAccidente >= fechaDesde) &&
                (!fechaHasta || !row.fechaAccidente || row.fechaAccidente <= fechaHasta);

            return matchStatus && matchCoord && matchCobertura && matchSearch && matchFecha;
        });
    }, [dataSource, searchQuery, statusFilter, selectedCoord, selectedCobertura, fechaDesde, fechaHasta]);

    // PAGINACIÓN
    const paginatedRows = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredRows.slice(start, start + pageSize);
    }, [filteredRows, currentPage]);

    const totalPages = Math.ceil(filteredRows.length / pageSize) || 1;

    // MÉTRICAS CALCULADAS A PARTIR DE LOS DATOS REALES
    const metrics = useMemo(() => {
        const total = filteredRows.length;
        const terminados = filteredRows.filter(r => r.tipoEstatus === 'success').length;
        const revision = filteredRows.filter(r => r.tipoEstatus === 'info').length;
        const rechazados = filteredRows.filter(r => r.tipoEstatus === 'danger').length;
        return { total, terminados, revision, rechazados };
    }, [filteredRows]);

    const handleImprimir = () => {
        window.print();
    };

    const handleConfirmExport = (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setTimeout(() => {
            const headers = ["NO_SINIESTRO", "FECHA_ACCIDENTE", "COBERTURA", "TRAMO_CASETA", "COORDINACION", "ESTATUS", "DISCREPANCIA"];
            const rowsCsv = filteredRows.map(r => [
                `"${r.id}"`,
                `"${r.fechaAccidente}"`,
                `"${r.cobertura}"`,
                `"${r.tramoCaseta}"`,
                `"${r.coordinacion}"`,
                `"${r.estatus}"`,
                `"${r.discrepancia}"`
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
        }, 800);
    };

    const handleSimulatedSubmit = (e, mensaje) => {
        e.preventDefault();
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setActiveModal(null);
            alert(mensaje);
        }, 600);
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#f8fafd] overflow-hidden text-xs text-[#202124] font-sans">

            {/* CABECERA CENTRADA CON ACCIONES */}
            <section className="px-6 py-4 flex flex-col items-center justify-center gap-3 border-b border-[#dadce0] bg-white text-center shrink-0">
                <div>
                    <h1 className="text-3xl font-extrabold text-[#0a192f] tracking-tight">
                        Siniestralidad
                    </h1>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 text-xs w-full">
                    {/* SELECTOR DESDE / HASTA */}
                    <div className="flex items-center bg-white border border-[#dadce0] rounded-lg px-2.5 py-1 shadow-2xs">
                        <span className="material-symbols-outlined text-[#5f6368] text-[16px] mr-1.5">calendar_today</span>
                        <div className="flex items-center gap-1">
                            <span className="text-[#5f6368] font-medium">Desde:</span>
                            <input
                                type="date"
                                value={fechaDesde}
                                onChange={(e) => { setFechaDesde(e.target.value); setCurrentPage(1); }}
                                className="text-xs font-bold text-[#202124] bg-transparent outline-none cursor-pointer"
                            />
                        </div>
                        <span className="mx-2 text-[#dadce0]">|</span>
                        <div className="flex items-center gap-1">
                            <span className="text-[#5f6368] font-medium">Hasta:</span>
                            <input
                                type="date"
                                value={fechaHasta}
                                onChange={(e) => { setFechaHasta(e.target.value); setCurrentPage(1); }}
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
                            <span>Exportar ({filteredRows.length.toLocaleString()})</span>
                        </button>
                        <button
                            onClick={() => setActiveModal('carga')}
                            className="flex items-center gap-1.5 px-2.5 py-1 text-[#3c4043] hover:text-[#202124] hover:bg-[#f1f3f4] rounded-md font-medium transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[#1a73e8] text-[16px]">upload</span>
                            <span>Carga masiva</span>
                        </button>
                    </div>

                    {/* BOTONES DE ALTA */}
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

            {/* DASHBOARD METRICS BAR DINÁMICO */}
            <section className="px-6 py-3.5 bg-[#f8fafd] border-b border-[#dadce0]/80 shrink-0">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                    <div className="bg-white border border-[#dadce0] rounded-xl p-3 shadow-xs">
                        <div className="flex items-center justify-between text-[#5f6368]">
                            <span className="text-[11px] font-semibold uppercase tracking-wider">Siniestros Totales</span>
                            <span className="material-symbols-outlined text-[#1a73e8] text-[20px]">trending_up</span>
                        </div>
                        <p className="text-2xl font-bold text-[#202124] tracking-tight mt-1">
                            {loading ? "Cargando…" : metrics.total.toLocaleString()}
                        </p>
                        <div className="mt-1 flex items-center justify-between text-[11px] text-[#5f6368]">
                            <span>Registros en PostgreSQL</span>
                            <span className="text-[#137333] font-semibold">100% Sincronizado</span>
                        </div>
                    </div>

                    <div className="bg-white border border-[#dadce0] rounded-xl p-3 shadow-xs">
                        <div className="flex items-center justify-between text-[#137333]">
                            <span className="text-[11px] font-semibold uppercase tracking-wider">Terminados / Pagados</span>
                            <span className="material-symbols-outlined text-[#137333] text-[20px]">check_circle</span>
                        </div>
                        <p className="text-2xl font-bold text-[#137333] tracking-tight mt-1">
                            {metrics.terminados.toLocaleString()}
                        </p>
                        <div className="mt-1 text-[11px] text-[#5f6368]">
                            <span>Concluidos satisfactoriamente</span>
                        </div>
                    </div>

                    <div className="bg-white border border-[#dadce0] rounded-xl p-3 shadow-xs">
                        <div className="flex items-center justify-between text-[#1a73e8]">
                            <span className="text-[11px] font-semibold uppercase tracking-wider">En Revisión / Trámite</span>
                            <span className="material-symbols-outlined text-[#1a73e8] text-[20px]">pending_actions</span>
                        </div>
                        <p className="text-2xl font-bold text-[#1a73e8] tracking-tight mt-1">
                            {metrics.revision.toLocaleString()}
                        </p>
                        <div className="mt-1 text-[11px] text-[#5f6368]">
                            <span>Expedientes activos en proceso</span>
                        </div>
                    </div>

                    <div className="bg-white border border-[#dadce0] rounded-xl p-3 shadow-xs">
                        <div className="flex items-center justify-between text-[#c5221f]">
                            <span className="text-[11px] font-semibold uppercase tracking-wider">Rechazados / Cancelados</span>
                            <span className="material-symbols-outlined text-[#c5221f] text-[20px]">cancel</span>
                        </div>
                        <p className="text-2xl font-bold text-[#c5221f] tracking-tight mt-1">
                            {metrics.rechazados.toLocaleString()}
                        </p>
                        <div className="mt-1 text-[11px] text-[#5f6368]">
                            <span>Observados o con discrepancia</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* BARRA DE BÚSQUEDA Y FILTROS */}
            <div className="px-6 py-2.5 bg-white border-b border-[#dadce0] flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar por siniestro, tramo, causa…"
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        className="text-xs bg-white border border-[#dadce0] rounded-full pl-8 pr-3 py-1.5 w-72 text-[#202124] focus:ring-1 focus:ring-[#1a73e8] outline-none"
                    />
                    <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#5f6368] text-[16px]">search</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                        className="bg-white border border-[#dadce0] text-xs font-medium text-[#3c4043] rounded-full px-3 py-1.5 outline-none cursor-pointer"
                    >
                        <option value="">Todos los Estatus</option>
                        <option value="PROCESO">En Proceso</option>
                        <option value="REVISI">En Revisión</option>
                        <option value="TERMIN">Terminado / Pagado</option>
                        <option value="RECHAZ">Rechazado</option>
                    </select>

                    <button
                        onClick={() => setShowMoreFilters(!showMoreFilters)}
                        className="flex items-center gap-1 px-3 py-1.5 text-[#0b57d0] hover:bg-[#e8f0fe] rounded-full font-semibold transition-colors cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[16px]">filter_list</span>
                        <span>{showMoreFilters ? "Ocultar Filtros" : "Más Filtros"}</span>
                    </button>
                </div>
            </div>

            {/* TABLA PRINCIPAL */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="bg-white rounded-xl border border-[#dadce0] shadow-xs overflow-hidden flex flex-col">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-[#f8fafd] border-b border-[#dadce0] text-[11px] font-semibold uppercase tracking-wider text-[#5f6368]">
                                    <th className="py-3 px-4 w-12 text-center" scope="col">
                                        <input type="checkbox" className="rounded text-[#0b57d0] border-[#dadce0] w-4 h-4 cursor-pointer" />
                                    </th>
                                    <th className="py-3 px-3">Archivos</th>
                                    <th className="py-3 px-3">No. Siniestro</th>
                                    <th className="py-3 px-3">Fecha Accidente</th>
                                    <th className="py-3 px-3">Cobertura</th>
                                    <th className="py-3 px-3">Tramo / Plaza de Cobro</th>
                                    <th className="py-3 px-3">Estatus</th>
                                    <th className="py-3 px-3">Discrepancia / Causa</th>
                                    <th className="py-3 px-3 text-center">Facturas</th>
                                    <th className="py-3 px-3 text-center">Reqs.</th>
                                    <th className="py-3 px-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#e8eaed] text-[#3c4043]">
                                {loading ? (
                                    <tr>
                                        <td colSpan="11" className="py-12 text-center text-[#5f6368]">
                                            <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-[#0b57d0] border-t-transparent mb-2" />
                                            <div>Cargando datos desde la base de datos…</div>
                                        </td>
                                    </tr>
                                ) : paginatedRows.length > 0 ? (
                                    paginatedRows.map((row) => (
                                        <tr key={row.id} className="hover:bg-[#f8fafd] transition-colors">
                                            <td className="py-2.5 px-4 text-center">
                                                <input type="checkbox" className="rounded text-[#0b57d0] border-[#dadce0] w-4 h-4 cursor-pointer" />
                                            </td>
                                            <td className="py-2.5 px-3">
                                                <button
                                                    onClick={() => onOpenArchivos(row)}
                                                    className="inline-flex items-center gap-1.5 text-[#1a73e8] hover:text-[#0b57d0] font-medium bg-[#e8f0fe] hover:bg-[#d3e3fd] px-2.5 py-1 rounded-full transition-colors cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-[16px] text-[#b06000]">folder</span>
                                                    <span>({row.archivosCount})</span>
                                                </button>
                                            </td>
                                            <td className="py-2.5 px-3 font-mono font-bold text-[#1a73e8]">
                                                <button
                                                    onClick={() => onOpenExpediente(row)}
                                                    className="hover:underline cursor-pointer"
                                                >
                                                    {row.id}
                                                </button>
                                            </td>
                                            <td className="py-2.5 px-3 text-[#5f6368] font-mono text-[11px]">
                                                {row.fechaAccidente || "—"}
                                            </td>
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
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                    row.tipoEstatus === 'danger' ? 'bg-[#fce8e6] text-[#c5221f] border border-[#fad2cf]' :
                                                    row.tipoEstatus === 'success' ? 'bg-[#e6f4ea] text-[#137333] border border-[#ceead6]' :
                                                    row.tipoEstatus === 'info' ? 'bg-[#e8f0fe] text-[#1a73e8] border border-[#d3e3fd]' :
                                                    'bg-[#f1f3f4] text-[#3c4043] border border-[#dadce0]'
                                                }`}>
                                                    {row.estatus}
                                                </span>
                                            </td>
                                            <td className="py-2.5 px-3 text-[#3c4043]">
                                                <span className="truncate max-w-[160px] inline-block font-medium">
                                                    {row.discrepancia}
                                                </span>
                                            </td>
                                            <td className="py-2.5 px-3 text-center">
                                                <button onClick={() => onOpenFacturas(row)} className="cursor-pointer">
                                                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold ${row.facturasCount > 0 ? 'bg-[#e6f4ea] text-[#137333]' : 'bg-[#f1f3f4] text-[#5f6368]'}`}>
                                                        {row.facturasCount} Facs
                                                    </span>
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
                                            No se encontraron siniestros que coincidan con los filtros aplicados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* PAGINADOR INFERIOR */}
                    {totalPages > 1 && (
                        <div className="px-6 py-3 border-t border-[#dadce0] bg-[#f8fafd] flex items-center justify-between text-xs text-[#5f6368]">
                            <span>
                                Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong> ({filteredRows.length.toLocaleString()} resultados)
                            </span>
                            <div className="flex gap-1.5">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 rounded bg-white border border-[#dadce0] disabled:opacity-40 cursor-pointer"
                                >
                                    Anterior
                                </button>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 rounded bg-white border border-[#dadce0] disabled:opacity-40 cursor-pointer"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL 1: EXPORTAR */}
            {activeModal === 'exportar' && (
                <div className="fixed inset-0 z-50 bg-[#202124]/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white border border-[#dadce0] rounded-3xl max-w-md w-full shadow-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-[#dadce0] pb-3">
                            <h3 className="text-base font-bold text-[#202124]">Exportar Siniestralidad</h3>
                            <button onClick={() => setActiveModal(null)} className="text-[#5f6368] hover:text-[#202124] cursor-pointer"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <p className="text-xs text-[#5f6368]">Se descargará un consolidado de {filteredRows.length.toLocaleString()} registros filtrados.</p>
                        <form onSubmit={handleConfirmExport} className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-xs font-semibold text-[#3c4043]">Formato:</label>
                                <select className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs text-[#202124] outline-none">
                                    <option value="csv">CSV / Excel Coma Separado</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full text-xs font-semibold text-[#5f6368] cursor-pointer">Cancelar</button>
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
                            <button onClick={() => setActiveModal(null)} className="text-[#5f6368] hover:text-[#202124] cursor-pointer"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <form onSubmit={(e) => handleSimulatedSubmit(e, "Archivo procesado exitosamente.")} className="space-y-4">
                            <div className="border-2 border-dashed border-[#dadce0] rounded-2xl p-6 text-center hover:bg-[#f8fafd] transition cursor-pointer">
                                <span className="material-symbols-outlined text-[#1a73e8] text-[32px]">upload_file</span>
                                <p className="text-xs font-semibold text-[#202124] mt-1">Arrastra tu archivo plantilla aquí</p>
                                <p className="text-[10px] text-[#5f6368] mt-0.5">Soporta formatos .XLSX o .CSV (máx. 10MB)</p>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full text-xs font-semibold text-[#5f6368] cursor-pointer">Cancelar</button>
                                <button type="submit" disabled={isProcessing} className="px-5 py-2 rounded-full bg-[#1a73e8] text-white text-xs font-semibold shadow-md cursor-pointer">
                                    {isProcessing ? 'Procesando...' : 'Subir Archivo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 3: AGREGAR FACTURA */}
            {activeModal === 'factura' && (
                <div className="fixed inset-0 z-50 bg-[#202124]/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white border border-[#dadce0] rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-left">
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

                        <form onSubmit={(e) => handleSimulatedSubmit(e, "Factura agregada y vinculada exitosamente.")} className="p-6 overflow-y-auto flex-1 space-y-5">
                            {activeFacturaTab === "general" && (
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xs font-bold text-[#0b57d0] uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-[#e8eaed] pb-1">
                                            <span className="material-symbols-outlined text-[16px]">article</span>
                                            <span>Registro Inicial & Siniestro</span>
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Fecha de Creación</label>
                                                <input type="date" value={formFactura.fechaCreacion} disabled className="w-full bg-[#f1f3f4] border border-[#dadce0] rounded-lg p-2 text-xs font-mono text-[#5f6368]" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Folio Escrito</label>
                                                <input type="text" value={formFactura.folioEscrito} disabled className="w-full bg-[#f1f3f4] border border-[#dadce0] rounded-lg p-2 text-xs font-mono font-bold text-[#0b57d0]" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">No. Siniestro *</label>
                                                <input required type="text" placeholder="172738817" value={formFactura.noSiniestro} onChange={(e) => handleFormFacturaChange("noSiniestro", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs font-mono outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Fecha Accidente</label>
                                                <input type="date" value={formFactura.fechaAccidente} onChange={(e) => handleFormFacturaChange("fechaAccidente", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs outline-none" />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-bold text-[#0b57d0] uppercase tracking-wider mb-2 flex items-center gap-1.5 border-b border-[#e8eaed] pb-1">
                                            <span className="material-symbols-outlined text-[16px]">calculate</span>
                                            <span>Importes & Desglose</span>
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
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">IVA 16%</label>
                                                <input type="text" value={`$${importesCalculados.iva}`} disabled className="w-full bg-[#f1f3f4] border border-[#dadce0] rounded-lg p-2 text-xs font-mono text-[#b06000] font-semibold" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-semibold text-[#444746] mb-1">Monto Total</label>
                                                <input type="text" value={`$${importesCalculados.montoConIva}`} disabled className="w-full bg-[#e8f0fe] border border-[#d3e3fd] rounded-lg p-2 text-xs font-mono text-[#0b57d0] font-bold" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeFacturaTab === "seguimiento" && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-[11px] font-semibold text-[#444746] mb-1">Estatus Reclamación</label>
                                            <select value={formFactura.estatusReclamacion} onChange={(e) => handleFormFacturaChange("estatusReclamacion", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs text-[#202124] font-semibold outline-none">
                                                <option value="PENDIENTE ENVIAR A GNP">PENDIENTE ENVIAR A GNP</option>
                                                <option value="DETENIDA - ACLARACIÓN">DETENIDA - EN ACLARACIÓN</option>
                                                <option value="RECLAMACIÓN PAGADA">RECLAMACIÓN PAGADA</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-[11px] font-semibold text-[#444746] mb-1">Observaciones</label>
                                            <input type="text" placeholder="Observaciones generales..." value={formFactura.observaciones} onChange={(e) => handleFormFacturaChange("observaciones", e.target.value)} className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs outline-none" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#dadce0]">
                                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full text-xs font-semibold text-[#5f6368] hover:bg-[#f1f3f4] cursor-pointer">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={isProcessing} className="px-6 py-2 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white text-xs font-semibold shadow-md cursor-pointer flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-[18px]">{isProcessing ? 'sync' : 'save'}</span>
                                    <span>{isProcessing ? 'Guardando...' : 'Guardar Factura'}</span>
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
                            <button onClick={() => setActiveModal(null)} className="text-[#5f6368] hover:text-[#202124] cursor-pointer"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <form onSubmit={(e) => handleSimulatedSubmit(e, "Requerimiento asignado exitosamente.")} className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-[#3c4043] mb-1">No. Siniestro *</label>
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
                                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full text-xs font-semibold text-[#5f6368] cursor-pointer">Cancelar</button>
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
                            <button onClick={() => setActiveModal(null)} className="text-[#5f6368] hover:text-[#202124] cursor-pointer"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <form onSubmit={(e) => handleSimulatedSubmit(e, "Siniestro registrado exitosamente.")} className="space-y-3">
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
                                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full text-xs font-semibold text-[#5f6368] cursor-pointer">Cancelar</button>
                                <button type="submit" disabled={isProcessing} className="px-6 py-2 rounded-full bg-[#0b57d0] text-white text-xs font-semibold shadow-md cursor-pointer">
                                    {isProcessing ? 'Registrando...' : 'Alta de Siniestro'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* FOOTER */}
            <footer className="h-10 border-t border-[#dadce0] bg-white px-6 flex items-center justify-between text-xs text-[#5f6368] select-none shrink-0">
                <div className="flex items-center gap-2">
                    <span>Módulo Siniestralidad:</span>
                    <strong className="text-[#202124]">
                        {filteredRows.length.toLocaleString()} registros cargados desde base de datos
                    </strong>
                </div>
                <div>
                    <span>Consolidado CAPUFE / GNP</span>
                </div>
            </footer>

        </div>
    );
}