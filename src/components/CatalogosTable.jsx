import React, { useState, useMemo } from 'react';

// LISTA DE SUBMÓDULOS DE CATÁLOGOS
const CATALOGO_TABS = [
    { id: "aseguradoras", label: "Aseguradoras", icon: "shield" },
    { id: "beneficiario", label: "Beneficiario de pago", icon: "payments" },
    { id: "casetas", label: "Casetas", icon: "toll" },
    { id: "coordinacion", label: "Coordinación", icon: "map" },
    { id: "tipoAccidente", label: "Tipo de accidente", icon: "warning" },
    { id: "causaAccidente", label: "Causa de accidente", icon: "error" },
    { id: "danosPista", label: "Daños a la pista", icon: "edit_road" },
    { id: "bienDanado", label: "Bien dañado", icon: "domain_disabled" },
    { id: "garantiaRecuperacion", label: "Garantía de recuperación", icon: "savings" },
    { id: "hospitales", label: "Hospitales", icon: "local_hospital" },
    { id: "coberturas", label: "Coberturas", icon: "health_and_safety" },
    { id: "estatusSiniestro", label: "Estatus de siniestro", icon: "flag" },
    { id: "tramosCarreteros", label: "Tramos carreteros", icon: "add_road" },
    { id: "polizas", label: "Pólizas", icon: "description" }
];

// MOCK DATA DE MUESTRA PARA CATÁLOGOS
const MOCK_DATA = {
    aseguradoras: [
        { id: "1", nombre: "ABANDONADO", estado: "ACTIVO", creado: "1/9/2026, 1:11:34 a.m.", actualizado: "1/9/2026, 1:11:34 a.m." },
        { id: "2", nombre: "AFIRME", estado: "ACTIVO", creado: "1/9/2026, 1:11:34 a.m.", actualizado: "1/9/2026, 1:11:34 a.m." },
        { id: "3", nombre: "AIG", estado: "ACTIVO", creado: "1/9/2026, 1:11:34 a.m.", actualizado: "1/9/2026, 1:11:34 a.m." },
        { id: "4", nombre: "ANA", estado: "ACTIVO", creado: "1/9/2026, 1:11:34 a.m.", actualizado: "1/9/2026, 1:11:34 a.m." },
        { id: "5", nombre: "ANA / DEDUCIBLE", estado: "ACTIVO", creado: "1/9/2026, 1:11:34 a.m.", actualizado: "1/9/2026, 1:11:34 a.m." },
        { id: "6", nombre: "ATLAS", estado: "ACTIVO", creado: "1/9/2026, 1:11:34 a.m.", actualizado: "1/9/2026, 1:11:34 a.m." },
        { id: "7", nombre: "AXA", estado: "ACTIVO", creado: "1/9/2026, 1:11:34 a.m.", actualizado: "1/9/2026, 1:11:34 a.m." },
        { id: "8", nombre: "AZTECA", estado: "ACTIVO", creado: "1/9/2026, 1:11:34 a.m.", actualizado: "1/9/2026, 1:11:34 a.m." },
        { id: "9", nombre: "BANORTE", estado: "ACTIVO", creado: "1/9/2026, 1:11:34 a.m.", actualizado: "1/9/2026, 1:11:34 a.m." },
        { id: "10", nombre: "BBVA", estado: "ACTIVO", creado: "1/9/2026, 1:11:34 a.m.", actualizado: "1/9/2026, 1:11:34 a.m." }
    ],
    beneficiario: [
        { id: "1", nombre: "AZTLAN", estado: "ACTIVO", creado: "1/9/2026, 1:55:24 a.m.", actualizado: "1/9/2026, 1:55:24 a.m." },
        { id: "2", nombre: "BANOBRAS", estado: "ACTIVO", creado: "1/9/2026, 1:55:24 a.m.", actualizado: "1/9/2026, 1:55:24 a.m." },
        { id: "3", nombre: "CAPUFE", estado: "ACTIVO", creado: "1/9/2026, 1:55:24 a.m.", actualizado: "1/9/2026, 1:55:24 a.m." },
        { id: "4", nombre: "CIBANCO", estado: "ACTIVO", creado: "1/9/2026, 1:55:24 a.m.", actualizado: "1/9/2026, 1:55:24 a.m." },
        { id: "5", nombre: "CONSORCIO AJ&DT", estado: "ACTIVO", creado: "1/9/2026, 1:55:24 a.m.", actualizado: "1/9/2026, 1:55:24 a.m." }
    ]
};

export default function CatalogosTable() {
    const [activeTab, setActiveTab] = useState("aseguradoras");
    const [searchQuery, setSearchQuery] = useState("");
    const [mostrarActivos, setMostrarActivos] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newItemName, setNewItemName] = useState("");

    const tabActualObj = CATALOGO_TABS.find(t => t.id === activeTab);

    // Obtener lista según tab activo o plantilla base
    const listData = useMemo(() => {
        const rawList = MOCK_DATA[activeTab] || [
            { id: "1", nombre: "REGISTRO DE MUESTRA 1", estado: "ACTIVO", creado: "1/9/2026, 2:00:00 a.m.", actualizado: "1/9/2026, 2:00:00 a.m." },
            { id: "2", nombre: "REGISTRO DE MUESTRA 2", estado: "ACTIVO", creado: "1/9/2026, 2:00:00 a.m.", actualizado: "1/9/2026, 2:00:00 a.m." }
        ];

        return rawList.filter(item => {
            const matchSearch = !searchQuery || item.nombre.toLowerCase().includes(searchQuery.toLowerCase());
            return matchSearch;
        });
    }, [activeTab, searchQuery]);

    return (
        <div className="flex-1 flex flex-col h-full bg-[#f8fafd] overflow-hidden text-[#202124] font-sans text-xs">

            {/* CABECERA CENTRADA PRINCIPAL */}
            <section className="px-6 py-5 flex flex-col items-center justify-center gap-4 border-b border-[#dadce0] bg-white text-center">
                <div>
                    <h1 className="text-4xl font-extrabold text-[#0a192f] tracking-tight">
                        Catálogos del Sistema
                    </h1>
                    <p className="text-xs text-[#5f6368] mt-1">
                        Administración de tablas maestras de consulta y configuración operativa
                    </p>
                </div>

                {/* PILL TABS DE CATÁLOGOS */}
                <div className="flex items-center gap-1.5 overflow-x-auto max-w-full p-1.5 bg-[#f1f3f4] border border-[#dadce0] rounded-full shadow-2xs no-scrollbar">
                    {CATALOGO_TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setSearchQuery(""); }}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${activeTab === tab.id ? 'bg-white text-[#0b57d0] shadow-xs' : 'text-[#5f6368] hover:text-[#202124]'}`}
                        >
                            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* BARRA DE FILTROS Y BÚSQUEDA */}
            <div className="px-6 py-2.5 bg-white border-b border-[#dadce0] flex flex-wrap items-center justify-between gap-3">
                <div className="relative">
                    <input
                        type="text"
                        placeholder={`Buscar por ${tabActualObj?.label.toLowerCase()}...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="text-xs bg-white border border-[#dadce0] rounded-full pl-8 pr-3 py-1.5 w-64 text-[#202124] focus:ring-1 focus:ring-[#1a73e8] outline-none"
                    />
                    <span className="material-symbols-outlined absolute left-2.5 top-2 text-[#5f6368] text-[16px]">search</span>
                </div>

                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#3c4043] select-none">
                        <input
                            type="checkbox"
                            checked={mostrarActivos}
                            onChange={(e) => setMostrarActivos(e.target.checked)}
                            className="rounded text-[#0b57d0] focus:ring-[#0b57d0] border-[#dadce0] w-4 h-4 cursor-pointer"
                        />
                        <span>Mostrar solo los activos</span>
                    </label>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#0b57d0] hover:bg-[#0842a0] text-white font-semibold rounded-full shadow-xs transition cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        <span>Agregar</span>
                    </button>
                </div>
            </div>

            {/* TABLA PRINCIPAL DEL CATÁLOGO ACTIVO */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="bg-white border border-[#dadce0] rounded-xl overflow-hidden shadow-xs">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="bg-[#f8fafd] border-b border-[#dadce0] text-[#5f6368] uppercase text-[11px] font-semibold tracking-wider">
                                <th className="py-3 px-4">{tabActualObj?.label.toUpperCase()} ▲</th>
                                <th className="py-3 px-4 text-center w-28">ESTADO</th>
                                <th className="py-3 px-4 text-center w-48">FECHA CREACIÓN</th>
                                <th className="py-3 px-4 text-center w-48">FECHA ACTUALIZACIÓN</th>
                                <th className="py-3 px-4 text-center w-28">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e8eaed]">
                            {listData.map((item) => (
                                <tr key={item.id} className="hover:bg-[#f8fafd] transition-colors">
                                    <td className="py-3 px-4 font-bold text-[#202124]">{item.nombre}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e6f4ea] text-[#137333] border border-[#ceead6]">
                                            {item.estado}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-center font-mono text-[#5f6368]">{item.creado}</td>
                                    <td className="py-3 px-4 text-center font-mono text-[#5f6368]">{item.actualizado}</td>
                                    <td className="py-3 px-4 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <button className="p-1 text-[#5f6368] hover:text-[#1a73e8] hover:bg-[#f1f3f4] rounded-full transition cursor-pointer" title="Editar"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                                            <button className="p-1 text-[#5f6368] hover:text-[#d93025] hover:bg-[#fce8e6] rounded-full transition cursor-pointer" title="Eliminar"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* FOOTER */}
            <footer className="h-12 border-t border-[#dadce0] bg-white px-6 flex items-center justify-between text-xs text-[#5f6368] select-none shrink-0">
                <div className="flex items-center gap-2">
                    <span>Catálogo ({tabActualObj?.label}):</span>
                    <span className="font-semibold text-[#202124]">{listData.length} registros</span>
                </div>
            </footer>

            {/* MODAL AGREGAR ELEM. CATÁLOGO */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-[#202124]/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="relative bg-white border border-[#dadce0] rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#dadce0] flex items-center justify-between bg-white">
                            <h3 className="text-lg font-bold text-[#202124]">
                                Agregar en {tabActualObj?.label}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-[#5f6368] hover:text-[#202124] p-1 rounded-full hover:bg-[#f1f3f4] cursor-pointer">
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-[#444746] mb-1">Nombre / Descripción *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder={`Ingrese ${tabActualObj?.label.toLowerCase()}...`}
                                    value={newItemName}
                                    onChange={(e) => setNewItemName(e.target.value)}
                                    className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-lg px-3 py-2 text-xs text-[#202124] outline-none focus:ring-1 focus:ring-[#1a73e8]"
                                />
                            </div>

                            <div className="pt-4 border-t border-[#dadce0] flex items-center justify-end gap-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#e8eaed] text-[#3c4043] hover:bg-[#dadce0] cursor-pointer">
                                    Cancelar
                                </button>
                                <button type="submit" className="px-5 py-2 rounded-lg bg-[#0b57d0] hover:bg-[#0842a0] text-white text-xs font-semibold shadow-md cursor-pointer">
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}