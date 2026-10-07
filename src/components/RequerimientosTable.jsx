import React, { useState, useMemo } from 'react';

// MOCK DATA DE REQUERIMIENTOS CON FECHAS DE OCURRENCIA
const MOCK_REQUERIMIENTOS = [
    {
        id: "165521733",
        reqCount: 1,
        expanded: true,
        fechaOcurrencia: "2025-05-07",
        requerimientos: [
            {
                id: "r1",
                numSiniestro: "165521733",
                tipo: "ENTREGA DE EXPEDIENTE",
                solicitante: "BRENDA",
                tramite: "CAPUFE",
                fecha: "2025-05-07",
                hora: "14:04:00",
                observaciones: "SOLICITAN EXPEDIENTE",
                estatus: "PENDIENTE"
            }
        ]
    },
    {
        id: "168059202",
        reqCount: 1,
        expanded: true,
        fechaOcurrencia: "2025-05-07",
        requerimientos: [
            {
                id: "r2",
                numSiniestro: "168059202",
                tipo: "EXTEMPORÁNEO",
                solicitante: "BRENDA",
                tramite: "CAPUFE",
                fecha: "2025-05-07",
                hora: "20:00:00",
                observaciones: "CHOQUE VS PIEDRA",
                estatus: "PENDIENTE"
            }
        ]
    },
    {
        id: "168059723",
        reqCount: 1,
        expanded: true,
        fechaOcurrencia: "2025-05-08",
        requerimientos: [
            {
                id: "r3",
                numSiniestro: "168059723",
                tipo: "EXTEMPORÁNEO",
                solicitante: "BRENDA",
                tramite: "CAPUFE",
                fecha: "2025-05-08",
                hora: "09:00:00",
                observaciones: "CHOQUE VS OBJETO",
                estatus: "PENDIENTE"
            }
        ]
    },
    {
        id: "167919778",
        reqCount: 2,
        expanded: true,
        fechaOcurrencia: "2025-05-06",
        requerimientos: [
            {
                id: "r4",
                numSiniestro: "167919778",
                tipo: "OFICIO A CAPUFE",
                solicitante: "BRENDA",
                tramite: "CAPUFE",
                fecha: "2025-05-06",
                hora: "11:16:00",
                observaciones: "SOLICITAN CARTA",
                estatus: "EN PROCESO"
            },
            {
                id: "r5",
                numSiniestro: "167919778",
                tipo: "ENTREGA DE EXPEDIENTE",
                solicitante: "BRENDA",
                tramite: "CAPUFE",
                fecha: "2025-05-06",
                hora: "11:11:00",
                observaciones: "SOLICITAN EXPEDIENTE",
                estatus: "PENDIENTE"
            }
        ]
    },
    {
        id: "167742212",
        reqCount: 1,
        expanded: true,
        fechaOcurrencia: "2025-04-30",
        requerimientos: [
            {
                id: "r6",
                numSiniestro: "167742212",
                tipo: "EXTEMPORÁNEO",
                solicitante: "ENRIQUE DURAN",
                tramite: "GNP",
                fecha: "2025-04-30",
                hora: "14:22:00",
                observaciones: "CHOQUE VS PIEDRAS",
                estatus: "ATENDIDO"
            }
        ]
    },
    {
        id: "167912526",
        reqCount: 3,
        expanded: true,
        fechaOcurrencia: "2025-05-08",
        requerimientos: [
            {
                id: "r7",
                numSiniestro: "167912526",
                tipo: "RECONSIDERACIÓN",
                solicitante: "BRENDA",
                tramite: "CAPUFE",
                fecha: "2025-05-08",
                hora: "13:55:00",
                observaciones: "SOLICITAN PROCEDENCIA",
                estatus: "PENDIENTE"
            },
            {
                id: "r8",
                numSiniestro: "167912526",
                tipo: "ENTREGA DE EXPEDIENTE",
                solicitante: "BRENDA",
                tramite: "CAPUFE",
                fecha: "2025-05-06",
                hora: "10:39:00",
                observaciones: "SOLICITUD EXPEDIENTE",
                estatus: "PENDIENTE"
            },
            {
                id: "r9",
                numSiniestro: "167912526",
                tipo: "PENALIZACIÓN",
                solicitante: "BRENDA",
                tramite: "CAPUFE",
                fecha: "2025-05-13",
                hora: "12:48:00",
                observaciones: "SOLICITAN OA",
                estatus: "PENDIENTE"
            }
        ]
    }
];

export default function RequerimientosTable({
    rows = [],
    loading = false,
    error = null,
    initialFilter = ""
}) {
    // ESTADOS DE BÚSQUEDA Y FILTRADO
    const [searchQuery, setSearchQuery] = useState(initialFilter);
    const [statusFilter, setStatusFilter] = useState("");
    const [groups, setGroups] = useState(MOCK_REQUERIMIENTOS);

    // ESTADOS DE FECHAS (DESDE / HASTA)
    const [fechaDesde, setFechaDesde] = useState("2020-01-01");
    const [fechaHasta, setFechaHasta] = useState("2026-12-31");

    // ESTADOS DE MODALES SIMULADOS
    const [activeModal, setActiveModal] = useState(null); // 'exportar' | 'carga' | 'siniestro' | 'factura' | 'requerimiento' | null
    const [isProcessing, setIsProcessing] = useState(false);

    // ALTERNAR ACORDEÓN
    const toggleGroup = (id) => {
        setGroups(prev => prev.map(g => g.id === id ? { ...g, expanded: !g.expanded } : g));
    };

    // FILTRADO DINÁMICO POR FECHAS Y TEXTO
    const filteredGroups = useMemo(() => {
        return groups.filter(g => {
            const matchFecha = (!fechaDesde || g.fechaOcurrencia >= fechaDesde) && (!fechaHasta || g.fechaOcurrencia <= fechaHasta);
            const matchSearch = !searchQuery ||
                g.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                g.requerimientos.some(r =>
                    r.tipo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    r.solicitante.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    r.observaciones.toLowerCase().includes(searchQuery.toLowerCase())
                );
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
            const headers = ["SINIESTRO", "CANT_REQ", "FECHA_OCURRENCIA"];
            const rowsCsv = filteredGroups.map(g => [
                g.id, g.reqCount, g.fechaOcurrencia
            ].join(","));
            const csvContent = [headers.join(","), ...rowsCsv].join("\n");

            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Reporte_Requerimientos_${fechaDesde}_al_${fechaHasta}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setIsProcessing(false);
            setActiveModal(null);
        }, 1200);
    };

    // SUBMIT GENÉRICO SIMULADO
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

            {/* CABECERA CENTRADA */}
            <section className="px-6 py-5 flex flex-col items-center justify-center gap-4 border-b border-[#dadce0] bg-white text-center">
                <div>
                    <h1 className="text-4xl font-extrabold text-[#0a192f] tracking-tight">
                        Requerimientos
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

                    {/* BOTONES DE ACCIÓN: AGREGAR SINIESTRO, FACTURA Y NUEVO REQUERIMIENTO */}
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => setActiveModal('siniestro')}
                            className="flex items-center gap-1.5 bg-white border border-[#dadce0] text-[#3c4043] hover:bg-[#f1f3f4] font-medium px-2.5 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[#188038] text-[16px]">car_crash</span>
                            <span>Agregar siniestro</span>
                        </button>
                        <button
                            onClick={() => setActiveModal('factura')}
                            className="flex items-center gap-1.5 bg-white border border-[#dadce0] text-[#3c4043] hover:bg-[#f1f3f4] font-medium px-2.5 py-1.5 rounded-lg shadow-2xs transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[#188038] text-[16px]">receipt_long</span>
                            <span>Agregar factura</span>
                        </button>
                        <button
                            onClick={() => setActiveModal('requerimiento')}
                            className="flex items-center gap-1.5 bg-[#0b57d0] hover:bg-[#0842a0] text-white font-semibold px-3 py-1.5 rounded-lg shadow-xs transition-colors cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[16px]">add</span>
                            <span>Nuevo Requerimiento</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* DASHBOARD METRICS BAR */}
            <section className="px-6 py-4 bg-[#f8fafd] border-b border-[#dadce0]/80">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                    <div className="bg-white border border-[#dadce0] rounded-xl p-3 shadow-xs hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between text-[#5f6368]">
                            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Requerimientos</span>
                            <span className="material-symbols-outlined text-[#1a73e8] text-[20px]">assignment</span>
                        </div>
                        <p className="text-2xl font-bold text-[#202124] tracking-tight mt-1">784</p>
                        <div className="text-[11px] text-[#5f6368] mt-1.5">
                            <span className="font-medium text-[#1a73e8]">661</span> siniestros con requerimiento
                        </div>
                    </div>

                    <div className="bg-white border border-[#dadce0] rounded-xl p-3 shadow-xs hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between text-[#b06000]">
                            <span className="text-[11px] font-semibold uppercase tracking-wider">Pendientes de Atención</span>
                            <span className="material-symbols-outlined text-[#b06000] text-[20px]">pending</span>
                        </div>
                        <p className="text-2xl font-bold text-[#b06000] tracking-tight mt-1">142</p>
                        <div className="mt-1.5 text-[11px]">
                            <span className="px-2 py-0.5 rounded-full bg-[#fef7e0] text-[#b06000] font-medium border border-[#feefc3]">Requieren respuesta</span>
                        </div>
                    </div>

                    <div className="bg-white border border-[#dadce0] rounded-xl p-3 shadow-xs hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between text-[#1a73e8]">
                            <span className="text-[11px] font-semibold uppercase tracking-wider">Trámite CAPUFE</span>
                            <span className="material-symbols-outlined text-[#1a73e8] text-[20px]">account_balance</span>
                        </div>
                        <p className="text-2xl font-bold text-[#1a73e8] tracking-tight mt-1">512</p>
                        <div className="mt-1.5 text-[11px] text-[#5f6368]">
                            Entrega de expediente y extemporáneos
                        </div>
                    </div>

                    <div className="bg-white border border-[#dadce0] rounded-xl p-3 shadow-xs hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between text-[#137333]">
                            <span className="text-[11px] font-semibold uppercase tracking-wider">Atendidos & Concluidos</span>
                            <span className="material-symbols-outlined text-[#137333] text-[20px]">task_alt</span>
                        </div>
                        <p className="text-2xl font-bold text-[#137333] tracking-tight mt-1">642</p>
                        <div className="mt-1.5 text-[11px]">
                            <span className="px-2 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333] font-medium border border-[#ceead6]">Concluidos</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* BARRA DE FILTROS */}
            <div className="px-6 py-2.5 bg-white border-b border-[#dadce0] flex flex-wrap items-center justify-between gap-3">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Buscar por siniestro, tipo, solicitante..."
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
                        <option value="">Todos los Tipos</option>
                        <option value="ENTREGA">Entrega de Expediente</option>
                        <option value="EXTEMPORANEO">Extemporáneo</option>
                        <option value="RECONSIDERACION">Reconsideración</option>
                        <option value="OFICIO">Oficio a CAPUFE</option>
                    </select>

                    <button className="flex items-center gap-1 px-3 py-1.5 text-[#0b57d0] hover:bg-[#e8f0fe] rounded-full font-semibold transition-colors cursor-pointer">
                        <span className="material-symbols-outlined text-[16px]">filter_list</span>
                        <span>Más Filtros</span>
                    </button>
                </div>
            </div>

            {/* TABLA PRINCIPAL ACORDEÓN */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="bg-white border border-[#dadce0] rounded-xl overflow-hidden shadow-xs">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-[#f8fafd] border-b border-[#dadce0] text-[#5f6368] uppercase text-[11px] font-semibold tracking-wider">
                                <th className="py-3 px-4 w-60">NÚMERO DE SINIESTRO</th>
                                <th className="py-3 px-4 w-48">TIPO DE REQUERIMIENTO</th>
                                <th className="py-3 px-4 w-36">SOLICITANTE</th>
                                <th className="py-3 px-4 w-28">TRÁMITE</th>
                                <th className="py-3 px-4 w-32">FECHA REQUERIMIENTO</th>
                                <th className="py-3 px-4 w-32">HORA REQUERIMIENTO</th>
                                <th className="py-3 px-4">OBSERVACIONES PETICIÓN</th>
                                <th className="py-3 px-4 w-24 text-center">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e8eaed]">
                            {filteredGroups.length > 0 ? (
                                filteredGroups.map((group) => (
                                    <React.Fragment key={group.id}>
                                        <tr className="bg-[#e8f0fe]/40 hover:bg-[#e8f0fe]/70 transition-colors border-l-4 border-l-[#1a73e8]">
                                            <td className="py-3 px-4" colSpan="8">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => toggleGroup(group.id)}
                                                            className="flex items-center gap-2 text-[#0b57d0] font-bold hover:underline focus:outline-none cursor-pointer"
                                                        >
                                                            <span className="material-symbols-outlined text-[#1a73e8] text-[20px]">
                                                                {group.expanded ? "expand_more" : "chevron_right"}
                                                            </span>
                                                            <span className="font-mono text-sm">{group.id}</span>
                                                        </button>
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#d3e3fd] text-[#041e49]">
                                                            {group.reqCount} REQUERIMIENTO{group.reqCount > 1 ? "S" : ""}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => setActiveModal('requerimiento')}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-[#f1f3f4] text-[#0b57d0] font-semibold rounded-full text-xs border border-[#dadce0] transition cursor-pointer"
                                                    >
                                                        <span className="material-symbols-outlined text-[14px]">add</span>
                                                        <span>Requerimiento</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                        {group.expanded && group.requerimientos.map((req) => (
                                            <tr key={req.id} className="bg-white hover:bg-[#f8fafd] transition-colors">
                                                <td className="py-2.5 px-4 pl-11 font-mono text-[#1a73e8] font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-[#bdc1c6] text-[16px]">subdirectory_arrow_right</span>
                                                        <span>{req.numSiniestro}</span>
                                                    </div>
                                                </td>
                                                <td className="py-2.5 px-4 font-semibold text-[#202124]">{req.tipo}</td>
                                                <td className="py-2.5 px-4 text-[#3c4043] uppercase">{req.solicitante}</td>
                                                <td className="py-2.5 px-4">
                                                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f1f3f4] text-[#3c4043] border border-[#dadce0]">
                                                        {req.tramite}
                                                    </span>
                                                </td>
                                                <td className="py-2.5 px-4 font-mono text-[#3c4043]">{req.fecha}</td>
                                                <td className="py-2.5 px-4 font-mono text-[#3c4043]">{req.hora}</td>
                                                <td className="py-2.5 px-4 text-[#3c4043] uppercase font-medium">{req.observaciones}</td>
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
                                    <td colSpan="8" className="py-8 text-center text-[#5f6368]">
                                        No se encontraron requerimientos entre {fechaDesde} y {fechaHasta}.
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
                            <h3 className="text-base font-bold text-[#202124]">Exportar Requerimientos</h3>
                            <button onClick={() => setActiveModal(null)} className="text-[#5f6368] hover:text-[#202124]"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <p className="text-xs text-[#5f6368]">Se descargará un reporte de requerimientos filtrados ({filteredGroups.length} registros).</p>
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
                            <h3 className="text-base font-bold text-[#202124]">Carga Masiva de Requerimientos</h3>
                            <button onClick={() => setActiveModal(null)} className="text-[#5f6368] hover:text-[#202124]"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <form onSubmit={(e) => handleSimulatedSubmit(e, "Archivo procesado. Se cargaron 24 requerimientos correctamente.")} className="space-y-4">
                            <div className="border-2 border-dashed border-[#dadce0] rounded-2xl p-6 text-center hover:bg-[#f8fafd] transition cursor-pointer">
                                <span className="material-symbols-outlined text-[#1a73e8] text-[32px]">upload_file</span>
                                <p className="text-xs font-semibold text-[#202124] mt-1">Arrastra tu plantilla XLSX o CSV aquí</p>
                                <p className="text-[10px] text-[#5f6368] mt-0.5">Trámites y peticiones de Capufe / Aseguradora</p>
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

            {/* MODAL 3: AGREGAR SINIESTRO */}
            {activeModal === 'siniestro' && (
                <div className="fixed inset-0 z-50 bg-[#202124]/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white border border-[#dadce0] rounded-3xl max-w-md w-full shadow-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-[#dadce0] pb-3">
                            <h3 className="text-base font-bold text-[#202124]">Agregar Siniestro a Requerimientos</h3>
                            <button onClick={() => setActiveModal(null)} className="text-[#5f6368] hover:text-[#202124]"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <form onSubmit={(e) => handleSimulatedSubmit(e, "Siniestro vinculado al módulo de requerimientos.")} className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-[#3c4043] mb-1">No. de Siniestro *</label>
                                <input required type="text" placeholder="ej. 165521733" className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs font-mono outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-[#3c4043] mb-1">Solicitante *</label>
                                <input required type="text" placeholder="ej. BRENDA" className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs outline-none" />
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

            {/* MODAL 4: AGREGAR FACTURA */}
            {activeModal === 'factura' && (
                <div className="fixed inset-0 z-50 bg-[#202124]/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white border border-[#dadce0] rounded-3xl max-w-lg w-full shadow-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-[#dadce0] pb-3">
                            <h3 className="text-base font-bold text-[#202124]">Agregar Factura a Requerimiento</h3>
                            <button onClick={() => setActiveModal(null)} className="text-[#5f6368] hover:text-[#202124]"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <form onSubmit={(e) => handleSimulatedSubmit(e, "Factura vinculada al trámite.")} className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-[#3c4043] mb-1">No. de Siniestro *</label>
                                <input required type="text" placeholder="165521733" className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs font-mono outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-xs font-semibold text-[#3c4043] mb-1">No. Factura *</label>
                                    <input required type="text" placeholder="FAC-1002" className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs font-mono outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-[#3c4043] mb-1">Monto (MXN) *</label>
                                    <input required type="number" step="0.01" placeholder="0.00" className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs font-mono outline-none" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-3 border-t border-[#dadce0]">
                                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full text-xs font-semibold text-[#5f6368]">Cancelar</button>
                                <button type="submit" disabled={isProcessing} className="px-5 py-2 rounded-full bg-[#188038] text-white text-xs font-semibold shadow-md cursor-pointer">
                                    {isProcessing ? 'Guardando...' : 'Guardar Factura'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 5: NUEVO REQUERIMIENTO (BOTÓN AZUL DESTACADO) */}
            {activeModal === 'requerimiento' && (
                <div className="fixed inset-0 z-50 bg-[#202124]/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white border border-[#dadce0] rounded-3xl max-w-xl w-full shadow-2xl p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-[#dadce0] pb-3">
                            <h3 className="text-base font-bold text-[#202124]">Registrar Nuevo Requerimiento</h3>
                            <button onClick={() => setActiveModal(null)} className="text-[#5f6368] hover:text-[#202124]"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <form onSubmit={(e) => handleSimulatedSubmit(e, "Requerimiento registrado correctamente.")} className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-[#3c4043] mb-1">No. Siniestro *</label>
                                    <input required type="text" placeholder="165521733" className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs font-mono outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-[#3c4043] mb-1">Solicitante *</label>
                                    <input required type="text" placeholder="ej. BRENDA" className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs outline-none" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-[#3c4043] mb-1">Tipo de Requerimiento *</label>
                                    <input required type="text" placeholder="ej. ENTREGA DE EXPEDIENTE" className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-[#3c4043] mb-1">Trámite *</label>
                                    <input required type="text" placeholder="ej. CAPUFE" className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-[#3c4043] mb-1">Observaciones / Petición</label>
                                <textarea rows="2" placeholder="Detalle de solicitud..." className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg p-2 text-xs outline-none"></textarea>
                            </div>
                            <div className="flex justify-end gap-2 pt-3 border-t border-[#dadce0]">
                                <button type="button" onClick={() => setActiveModal(null)} className="px-4 py-2 rounded-full text-xs font-semibold text-[#5f6368]">Cancelar</button>
                                <button type="submit" disabled={isProcessing} className="px-6 py-2 rounded-full bg-[#0b57d0] text-white text-xs font-semibold shadow-md cursor-pointer">
                                    {isProcessing ? 'Guardando...' : 'Guardar Requerimiento'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* FOOTER */}
            <footer className="h-12 border-t border-[#dadce0] bg-white px-6 flex items-center justify-between text-xs text-[#5f6368] select-none shrink-0">
                <div className="flex items-center gap-2">
                    <span>Requerimientos:</span>
                    <span className="font-bold text-[#202124]">{filteredGroups.length} siniestros filtrados</span>
                </div>
            </footer>

        </div>
    );
}