import { useState } from "react"
import { useAuth } from "../context/AuthContext"

// Módulos planos idénticos a Stitch (sin desplegables/children)
export const menuItems = [
    {
        label: "Resumen Ejecutivo",
        opensTab: true,
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
        )
    },
    {
        label: "Siniestralidad",
        opensTab: true,
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
        )
    },
    {
        label: "Control de Facturas",
        opensTab: true,
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
        )
    },
    {
        label: "Requerimientos",
        opensTab: true,
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
        )
    },
    {
        label: "Reportes y Auditoría",
        opensTab: true,
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
        )
    },
    {
        label: "Catálogos",
        opensTab: true,
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
        )
    },
    {
        label: "Configuración",
        opensTab: true,
        icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
        )
    },
]

// Permisos actualizados con "Catálogos"
export const MENU_POR_ROL = {
    admin: ["Resumen Ejecutivo", "Siniestralidad", "Control de Facturas", "Requerimientos", "Reportes y Auditoría", "Catálogos", "Configuración"],
    supervisor: ["Resumen Ejecutivo", "Siniestralidad", "Control de Facturas", "Requerimientos", "Reportes y Auditoría", "Catálogos", "Configuración"],
    capturista: ["Resumen Ejecutivo", "Siniestralidad", "Control de Facturas", "Requerimientos", "Reportes y Auditoría", "Catálogos", "Configuración"],
    direccion: ["Resumen Ejecutivo", "Siniestralidad", "Control de Facturas", "Reportes y Auditoría", "Catálogos", "Configuración"],
}

export function filtrarMenuPorRol(items, rol) {
    const permitidos = MENU_POR_ROL[rol] || MENU_POR_ROL.capturista
    return items.filter((item) => permitidos.includes(item.label))
}

export default function Sidebar({ activeTab, onSelect, onOpenTab, collapsed, setCollapsed }) {
    const { user, logout } = useAuth()
    const rol = user?.rol || "capturista"
    const filteredItems = filtrarMenuPorRol(menuItems, rol)

    const handleItemClick = (item) => {
        if (onOpenTab) {
            onOpenTab(item)
        } else if (onSelect) {
            onSelect(item.label)
        }
    }

    return (
        <aside className={`bg-white border-r border-[#E5E2D5] flex flex-col justify-between shrink-0 min-h-screen transition-all duration-300 z-20 ${collapsed ? "w-16" : "w-64"}`}>
            {/* MARCA / CABECERA */}
            <div>
                <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[#F0ECE1]">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-9 h-9 rounded-lg bg-[#1b4965] text-white flex items-center justify-center font-black shadow-sm shrink-0">
                            <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            </svg>
                        </div>
                        {!collapsed && (
                            <div className="truncate">
                                <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold leading-tight">
                                    SINIESTROS APP
                                </span>
                                <span className="font-extrabold text-sm tracking-tight text-slate-800">
                                    SINIESTRY APP
                                </span>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition cursor-pointer"
                        title={collapsed ? "Expandir" : "Colapsar"}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d={collapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </svg>
                    </button>
                </div>

                {/* MENÚ DE NAVEGACIÓN */}
                <nav className="p-3 space-y-1.5 text-sm font-medium">
                    {filteredItems.map((item) => {
                        const isActive = activeTab === item.label ||
                            (activeTab === "Inicio" && item.label === "Resumen Ejecutivo") ||
                            (activeTab === "Siniestros" && item.label === "Siniestralidad") ||
                            (activeTab?.startsWith("expediente-") && item.label === "Siniestralidad")

                        return (
                            <button
                                key={item.label}
                                onClick={() => handleItemClick(item)}
                                title={collapsed ? item.label : undefined}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 cursor-pointer ${isActive
                                    ? "bg-[#133E54] text-white font-semibold shadow-sm"
                                    : "text-slate-600 hover:bg-[#F2EFE6] hover:text-slate-900 font-medium"
                                    }`}
                            >
                                <span className={isActive ? "text-sky-300" : "text-slate-500"}>
                                    {item.icon}
                                </span>
                                {!collapsed && <span className="truncate">{item.label}</span>}
                            </button>
                        )
                    })}
                </nav>
            </div>

            {/* STATUS E INFO DE USUARIO */}
            <div className="p-3 border-t border-[#ECE8DC] bg-[#FAF9F5] space-y-3">
                {!collapsed && (
                    <div className="mb-2">
                        <div className="flex justify-between items-center text-[11px] font-bold text-slate-600 mb-1">
                            <span>FONADIN</span>
                            <span className="text-amber-700">CAPUFE</span>
                        </div>
                        <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-200">
                            <div className="bg-[#1b4965] h-full" style={{ width: '96.4%' }} />
                            <div className="bg-amber-600 h-full" style={{ width: '3.6%' }} />
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1 text-center font-mono">
                            96.4% / 3.6% Operatividad
                        </p>
                    </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                    {!collapsed ? (
                        <div className="truncate pr-2">
                            <p className="text-xs font-bold text-slate-800 truncate">{user?.nombre || user?.email || "Usuario"}</p>
                            <p className="text-[10px] text-slate-500 capitalize">{user?.rol || "Capturista"}</p>
                        </div>
                    ) : (
                        <div className="w-7 h-7 rounded-full bg-[#1b4965] text-white flex items-center justify-center font-bold text-xs">
                            {user?.nombre?.[0] || "U"}
                        </div>
                    )}

                    <button
                        onClick={logout}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                        title="Cerrar sesión"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                        </svg>
                    </button>
                </div>
            </div>
        </aside>
    )
}