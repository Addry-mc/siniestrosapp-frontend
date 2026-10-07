import React, { useState } from 'react';

const LISTA_REPORTES = [
    {
        id: "rep-1",
        titulo: "Reporte de Siniestros",
        descripcion: "Detalle de siniestros por periodo, tipo y estado de resolución.",
        icon: "trending_up",
        iconBg: "bg-blue-50 text-blue-600 border-blue-100",
        categoria: "Operativo",
        camposDefecto: ["Folio / Siniestro", "Fecha / Hora", "Coordinación & Tramo", "Vehículos Involucrados", "Severidad", "Estatus Operativo", "Monto Estimado"]
    },
    {
        id: "rep-2",
        titulo: "Reporte de Facturas",
        descripcion: "Resumen de facturación, pagos, proveedores y estados de cuenta.",
        icon: "receipt_long",
        iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
        categoria: "Financiero",
        camposDefecto: ["No. Factura", "No. Siniestro", "Proveedor / Emisor", "Concepto", "Monto Importe", "Fecha Emisión", "Estatus Operativo"]
    },
    {
        id: "rep-3",
        titulo: "Reporte de Requerimientos",
        descripcion: "Seguimiento de requerimientos, trámites y documentación pendiente.",
        icon: "assignment",
        iconBg: "bg-amber-50 text-amber-600 border-amber-100",
        categoria: "Seguimiento",
        camposDefecto: ["No. Siniestro", "Tipo Requerimiento", "Solicitante", "Trámite", "Fecha", "Observaciones", "Estatus"]
    },
    {
        id: "rep-4",
        titulo: "Siniestralidad Mensual",
        descripcion: "Comportamiento mensual, índice de severidad y comparativa histórica por tramos.",
        icon: "calendar_month",
        iconBg: "bg-violet-50 text-violet-600 border-violet-100",
        categoria: "Análisis",
        camposDefecto: ["Periodo / Mes", "Tramo Carretero", "Total Incidentes", "Lesionados", "Fallecidos", "Índice Severidad"]
    },
    {
        id: "rep-5",
        titulo: "Presentación Directiva",
        descripcion: "Indicadores clave de desempeño, balances generales y resumen para dirección.",
        icon: "slideshow",
        iconBg: "bg-indigo-50 text-indigo-600 border-indigo-100",
        categoria: "Ejecutivo",
        camposDefecto: ["Resumen General", "Total Reclamado", "Monto Indemnizado", "Recuperación Deducible", "Variación Anual"]
    },
    {
        id: "rep-6",
        titulo: "Reporte de Rentabilidad",
        descripcion: "Análisis de costos de operación, márgenes y recuperación financiera.",
        icon: "payments",
        iconBg: "bg-teal-50 text-teal-600 border-teal-100",
        categoria: "Financiero",
        camposDefecto: ["Reserva Total", "Gasto Directo", "Gasto Indirecto", "Deducible", "Salvamento", "Balance Consolidado"]
    },
    {
        id: "rep-7",
        titulo: "Bitácora de Cambios",
        descripcion: "Registro de auditoría de todas las modificaciones realizadas en el sistema.",
        icon: "history",
        iconBg: "bg-rose-50 text-rose-600 border-rose-100",
        categoria: "Auditoría",
        camposDefecto: ["Fecha / Hora", "Usuario", "Módulo", "Acción Realizada", "Registro Afectado", "IP Origen"]
    }
];

export default function ReportesTable() {
    const [fechaDesde, setFechaDesde] = useState("2024-01-01");
    const [fechaHasta, setFechaHasta] = useState("2026-12-31");
    const [generandoId, setGenerandoId] = useState(null);

    // Modal de Personalizar
    const [modalPersonalizar, setModalPersonalizar] = useState(null); // Reporte seleccionado
    const [camposSeleccionados, setCamposSeleccionados] = useState([]);

    const handleGenerarReporte = (id, titulo) => {
        setGenerandoId(id);
        setTimeout(() => {
            setGenerandoId(null);
            alert(`Reporte "${titulo}" generado exitosamente para el periodo ${fechaDesde} a ${fechaHasta}.`);
        }, 1200);
    };

    const handleAbrirPersonalizar = (reporte) => {
        setModalPersonalizar(reporte);
        setCamposSeleccionados([...reporte.camposDefecto]);
    };

    const toggleCampo = (campo) => {
        setCamposSeleccionados(prev =>
            prev.includes(campo) ? prev.filter(c => c !== campo) : [...prev, campo]
        );
    };

    const handleGuardarPersonalizacion = (e) => {
        e.preventDefault();
        alert(`Configuración personalizada guardada con ${camposSeleccionados.length} campos seleccionados para "${modalPersonalizar.titulo}".`);
        setModalPersonalizar(null);
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#f8fafd] overflow-hidden text-[#202124] font-sans text-xs">

            {/* CABECERA CENTRADA */}
            <section className="px-6 py-5 flex flex-col items-center justify-center gap-4 border-b border-[#dadce0] bg-white text-center">
                <div>
                    <h1 className="text-4xl font-extrabold text-[#0a192f] tracking-tight">
                        Reportes y Auditoría
                    </h1>
                    <p className="text-xs text-[#5f6368] mt-1">
                        Generación de reportes ejecutivos, análisis operativo y auditoría del sistema
                    </p>
                </div>

                {/* LÍNEA DE FILTRO DE FECHAS */}
                <div className="flex flex-wrap items-center justify-center gap-3 text-xs w-full">
                    <div className="flex items-center gap-2 bg-white border border-[#dadce0] rounded-lg px-3 py-1.5 shadow-2xs">
                        <span className="material-symbols-outlined text-[#5f6368] text-[18px]">calendar_today</span>
                        <span className="text-[#5f6368] font-medium">Desde:</span>
                        <input
                            type="date"
                            value={fechaDesde}
                            onChange={(e) => setFechaDesde(e.target.value)}
                            className="border-0 bg-transparent text-xs font-semibold text-[#202124] outline-none cursor-pointer"
                        />
                        <span className="text-[#dadce0] mx-1">|</span>
                        <span className="text-[#5f6368] font-medium">Hasta:</span>
                        <input
                            type="date"
                            value={fechaHasta}
                            onChange={(e) => setFechaHasta(e.target.value)}
                            className="border-0 bg-transparent text-xs font-semibold text-[#202124] outline-none cursor-pointer"
                        />
                    </div>

                    <button className="flex items-center gap-1.5 px-4 py-2 bg-[#0b57d0] hover:bg-[#0842a0] text-white font-semibold rounded-lg shadow-2xs transition cursor-pointer">
                        <span className="material-symbols-outlined text-[16px]">filter_alt</span>
                        <span>Aplicar Filtro</span>
                    </button>
                </div>
            </section>

            {/* GRID DE REPORTES Y TARJETAS */}
            <main className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto">
                    {LISTA_REPORTES.map((reporte) => {
                        const isDownloading = generandoId === reporte.id;
                        return (
                            <div
                                key={reporte.id}
                                className="bg-white border border-[#dadce0] rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${reporte.iconBg}`}>
                                            <span className="material-symbols-outlined text-[22px]">{reporte.icon}</span>
                                        </div>
                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f1f3f4] text-[#5f6368] border border-[#dadce0]">
                                            {reporte.categoria}
                                        </span>
                                    </div>

                                    <h3 className="text-base font-bold text-[#202124] group-hover:text-[#0b57d0] transition-colors">
                                        {reporte.titulo}
                                    </h3>
                                    <p className="text-xs text-[#5f6368] mt-1.5 leading-relaxed">
                                        {reporte.descripcion}
                                    </p>
                                </div>

                                <div className="mt-5 pt-4 border-t border-[#f1f3f4] flex items-center gap-2">
                                    <button
                                        onClick={() => handleAbrirPersonalizar(reporte)}
                                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#dadce0] hover:bg-[#f1f3f4] text-[#3c4043] font-semibold text-xs transition-all cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-[16px] text-[#5f6368]">tune</span>
                                        <span>Personalizar</span>
                                    </button>

                                    <button
                                        onClick={() => handleGenerarReporte(reporte.id, reporte.titulo)}
                                        disabled={isDownloading}
                                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#e8f0fe] hover:bg-[#d3e3fd] text-[#0b57d0] font-semibold text-xs transition-all cursor-pointer disabled:opacity-50"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">
                                            {isDownloading ? 'sync' : 'download'}
                                        </span>
                                        <span>{isDownloading ? 'Generando...' : 'Generar'}</span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

            {/* FOOTER */}
            <footer className="h-12 border-t border-[#dadce0] bg-white px-6 flex items-center justify-between text-xs text-[#5f6368] select-none shrink-0">
                <div className="flex items-center gap-2">
                    <span>Módulo de Reportes:</span>
                    <span className="font-semibold text-[#202124]">7 plantillas disponibles</span>
                </div>
                <div>
                    <span>Exportaciones en formato PDF / Excel / CSV</span>
                </div>
            </footer>

            {/* MODAL PERSONALIZAR CAMPOS DEL REPORTE */}
            {modalPersonalizar && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-[#202124]/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="relative bg-white border border-[#dadce0] rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#dadce0] flex items-center justify-between bg-white">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#e8f0fe] text-[#0b57d0] flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[22px]">tune</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-[#202124]">Personalizar Campos</h3>
                                    <p className="text-xs text-[#5f6368]">{modalPersonalizar.titulo}</p>
                                </div>
                            </div>
                            <button onClick={() => setModalPersonalizar(null)} className="text-[#5f6368] hover:text-[#202124] p-2 rounded-full hover:bg-[#f1f3f4] cursor-pointer">
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleGuardarPersonalizacion} className="p-6 space-y-4">
                            <div>
                                <p className="text-xs font-semibold text-[#3c4043] mb-3">
                                    Selecciona las columnas que deseas incluir al exportar este reporte:
                                </p>
                                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-2">
                                    {modalPersonalizar.camposDefecto.map((campo) => (
                                        <label key={campo} className="flex items-center gap-3 p-2 rounded-lg border border-[#dadce0] hover:bg-[#f8fafd] cursor-pointer transition">
                                            <input
                                                type="checkbox"
                                                checked={camposSeleccionados.includes(campo)}
                                                onChange={() => toggleCampo(campo)}
                                                className="rounded text-[#0b57d0] focus:ring-[#0b57d0] border-[#dadce0] w-4 h-4 cursor-pointer"
                                            />
                                            <span className="text-xs font-medium text-[#202124]">{campo}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-[#dadce0] flex items-center justify-between">
                                <span className="text-[11px] text-[#5f6368]">
                                    {camposSeleccionados.length} campos seleccionados
                                </span>
                                <div className="flex items-center gap-2">
                                    <button type="button" onClick={() => setModalPersonalizar(null)} className="px-4 py-2 rounded-full text-xs font-semibold text-[#5f6368] hover:bg-[#f1f3f4] cursor-pointer">
                                        Cancelar
                                    </button>
                                    <button type="submit" className="px-5 py-2 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white text-xs font-semibold shadow-md cursor-pointer">
                                        Aplicar y Guardar
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}