import React, { useState, useMemo } from 'react';

// MOCK DATA DE USUARIOS
const INITIAL_USUARIOS = [
    { id: "1", nombre: "ADMIN PRINCIPAL", email: "admin@siniestrosapp.com", rol: "ADMIN", activo: true, creado: "2026-07-28" },
    { id: "2", nombre: "ADRIANA CASTAÑEDA", email: "luz.martinez@sinestry.com", rol: "ADMIN", activo: true, creado: "2026-08-17" },
    { id: "3", nombre: "CARINA LUNA", email: "carina.luna@sinestry.com", rol: "SUPERVISOR", activo: true, creado: "2026-08-26" },
    { id: "4", nombre: "CARLOS ARREOLA", email: "carlos.arreola@fyfasesores.mx", rol: "ADMIN", activo: true, creado: "2026-07-29" },
    { id: "5", nombre: "DAVID SOTELO", email: "david.sotelo@serviciosgob.mx", rol: "SUPERVISOR", activo: true, creado: "2026-08-26" },
    { id: "6", nombre: "DIANA CARRETO", email: "diana.carreto@serviciosgob.mx", rol: "SUPERVISOR", activo: true, creado: "2026-08-26" },
    { id: "7", nombre: "EDITH GARCÍA", email: "edith.garcia@sinestry.com", rol: "SUPERVISOR", activo: true, creado: "2026-08-26" },
    { id: "8", nombre: "GONZALO BRAVO", email: "gonzalo.bravo@sinestry.com", rol: "ADMIN", activo: true, creado: "2026-08-17" },
    { id: "9", nombre: "GUSTAVO ZUNIGA", email: "gustavo.zuniga@sinestry.com", rol: "ADMIN", activo: true, creado: "2026-08-17" },
    { id: "10", nombre: "HÉCTOR TRUJILLO", email: "hector.trujillo@serviciosgob.mx", rol: "SUPERVISOR", activo: true, creado: "2026-08-26" }
];

// MOCK DATA DE ROLES
const INITIAL_ROLES = [
    { id: "r1", rol: "ADMIN", nombre: "ADMINISTRADOR", descripcion: "ACCESO TOTAL AL SISTEMA", modulosPermitidos: 25 },
    { id: "r2", rol: "CAPTURISTA", nombre: "CAPTURISTA", descripcion: "CAPTURA DE SINIESTROS Y REQUERIMIENTOS", modulosPermitidos: 4 },
    { id: "r3", rol: "DIRECCION", nombre: "DIRECCIÓN", descripcion: "VO.BO. Y CONTROL DE FACTURAS", modulosPermitidos: 4 },
    { id: "r4", rol: "IMPLANT", nombre: "IMPLANT", descripcion: "CONSULTA DE FACTURAS Y REQUERIMIENTOS", modulosPermitidos: 3 },
    { id: "r5", rol: "SUPERVISOR", nombre: "SUPERVISOR", descripcion: "GESTIÓN DE SINIESTROS, FACTURAS Y REQUERIMIENTOS", modulosPermitidos: 5 }
];

// MOCK DATA DE MÓDULOS
const INITIAL_MODULOS = [
    { id: "m1", modulo: "INICIO", clave: "INICIO", descripcion: "TABLERO PRINCIPAL", orden: 1, activo: true },
    { id: "m2", modulo: "SINIESTROS", clave: "SINIESTROS", descripcion: "GESTIÓN DE SINIESTROS", orden: 2, activo: true },
    { id: "m3", modulo: "CONTROL DE FACTURAS", clave: "FACTURAS", descripcion: "CONTROL DE FACTURAS", orden: 3, activo: true },
    { id: "m4", modulo: "REQUERIMIENTOS", clave: "REQUERIMIENTOS", descripcion: "GESTIÓN DE REQUERIMIENTOS", orden: 4, activo: true },
    { id: "m5", modulo: "VO.BO. SUPERVISOR", clave: "VOBO_SUPERVISOR", descripcion: "VO.BO. DE SUPERVISOR", orden: 5, activo: true },
    { id: "m6", modulo: "VO.BO. DIRECCIÓN", clave: "VOBO_DIRECCION", descripcion: "VO.BO. DE DIRECCIÓN", orden: 6, activo: true },
    { id: "m7", modulo: "USUARIOS", clave: "USUARIOS", descripcion: "ADMINISTRACIÓN DE USUARIOS", orden: 7, activo: true },
    { id: "m8", modulo: "ROLES", clave: "ROLES", descripcion: "CATÁLOGO DE ROLES DEL SISTEMA", orden: 8, activo: true },
    { id: "m9", modulo: "PERMISOS", clave: "PERMISOS", descripcion: "PERMISOS POR ROL", orden: 9, activo: true },
    { id: "m10", modulo: "MÓDULOS", clave: "MODULOS", descripcion: "ACTIVAR O DESACTIVAR MÓDULOS", orden: 10, activo: true }
];

// MOCK DATA DE PERMISOS
const INITIAL_PERMISOS = [
    { rol: "ADMIN", inicio: true, siniestros: "Lectura y escritura", facturas: true, requerimientos: true, voboSup: true, voboDir: true, usuarios: true, roles: true, permisos: true, modulos: true, aseguradoras: true, casetas: true },
    { rol: "SUPERVISOR", inicio: true, siniestros: "Lectura y escritura", facturas: true, requerimientos: true, voboSup: false, voboDir: false, usuarios: false, roles: false, permisos: false, modulos: false, aseguradoras: false, casetas: false },
    { rol: "CAPTURISTA", inicio: true, siniestros: "Lectura y escritura", facturas: true, requerimientos: true, voboSup: false, voboDir: false, usuarios: false, roles: false, permisos: false, modulos: false, aseguradoras: false, casetas: false },
    { rol: "DIRECCION", inicio: true, siniestros: "Solo lectura", facturas: true, requerimientos: false, voboSup: false, voboDir: false, usuarios: false, roles: false, permisos: false, modulos: false, aseguradoras: false, casetas: false },
    { rol: "IMPLANT", inicio: true, siniestros: "Ninguno", facturas: true, requerimientos: true, voboSup: false, voboDir: false, usuarios: false, roles: false, permisos: false, modulos: false, aseguradoras: false, casetas: false }
];

export default function ConfiguracionTable() {
    const [subTab, setSubTab] = useState('usuarios'); // 'usuarios' | 'roles' | 'permisos' | 'modulos'

    // Estados de datos
    const [usuarios, setUsuarios] = useState(INITIAL_USUARIOS);
    const [roles] = useState(INITIAL_ROLES);
    const [modulos, setModulos] = useState(INITIAL_MODULOS);
    const [permisos, setPermisos] = useState(INITIAL_PERMISOS);

    // Filtros
    const [searchQuery, setSearchQuery] = useState("");
    const [mostrarInactivos, setMostrarInactivos] = useState(true);

    // Modales
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [userForm, setUserForm] = useState({ nombre: "", email: "", rol: "CAPTURISTA" });

    // Filtrado de usuarios
    const filteredUsers = useMemo(() => {
        return usuarios.filter(u => {
            const matchInactivo = mostrarInactivos ? true : u.activo;
            const matchSearch = !searchQuery ||
                u.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                u.rol.toLowerCase().includes(searchQuery.toLowerCase());
            return matchInactivo && matchSearch;
        });
    }, [usuarios, searchQuery, mostrarInactivos]);

    // Handlers para usuarios
    const toggleUserActivo = (id) => {
        setUsuarios(prev => prev.map(u => u.id === id ? { ...u, activo: !u.activo } : u));
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setUserForm({ nombre: user.nombre, email: user.email, rol: user.rol });
        setIsUserModalOpen(true);
    };

    const handleNewUser = () => {
        setEditingUser(null);
        setUserForm({ nombre: "", email: "", rol: "CAPTURISTA" });
        setIsUserModalOpen(true);
    };

    const handleSaveUser = (e) => {
        e.preventDefault();
        if (editingUser) {
            setUsuarios(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...userForm } : u));
        } else {
            const nuevo = {
                id: String(Date.now()),
                ...userForm,
                activo: true,
                creado: new Date().toISOString().split('T')[0]
            };
            setUsuarios(prev => [nuevo, ...prev]);
        }
        setIsUserModalOpen(false);
    };

    // Handler Módulos Activos
    const toggleModuloActivo = (id) => {
        setModulos(prev => prev.map(m => m.id === id ? { ...m, activo: !m.activo } : m));
    };

    // Handler Permisos Checkboxes
    const togglePermisoCheckbox = (rolName, key) => {
        setPermisos(prev => prev.map(p => p.rol === rolName ? { ...p, [key]: !p[key] } : p));
    };

    // Handler Permisos Select
    const changeSiniestrosPermiso = (rolName, value) => {
        setPermisos(prev => prev.map(p => p.rol === rolName ? { ...p, siniestros: value } : p));
    };

    const getRolBadge = (rol) => {
        switch (rol) {
            case "ADMIN":
                return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#d3e3fd] text-[#041e49]">ADMIN</span>;
            case "SUPERVISOR":
                return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#c2e7ff] text-[#001d35]">SUPERVISOR</span>;
            case "DIRECCION":
                return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#feefc3] text-[#b06000]">DIRECCION</span>;
            case "IMPLANT":
                return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#e6f4ea] text-[#137333]">IMPLANT</span>;
            default:
                return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f1f3f4] text-[#3c4043]">CAPTURISTA</span>;
        }
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#f8fafd] overflow-hidden text-[#202124] font-sans text-xs">

            {/* CABECERA CENTRADA PRINCIPAL */}
            <section className="px-6 py-5 flex flex-col items-center justify-center gap-4 border-b border-[#dadce0] bg-white text-center">
                <div>
                    <h1 className="text-4xl font-extrabold text-[#0a192f] tracking-tight">
                        Configuración del Sistema
                    </h1>
                </div>

                {/* NAVEGACIÓN ENTRE SUBMÓDULOS (PILL TABS) */}
                <div className="inline-flex items-center rounded-full p-1 bg-[#f1f3f4] border border-[#dadce0]">
                    <button
                        onClick={() => setSubTab('usuarios')}
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${subTab === 'usuarios' ? 'bg-white text-[#0b57d0] shadow-xs' : 'text-[#5f6368] hover:text-[#202124]'}`}
                    >
                        <span className="material-symbols-outlined text-[18px]">group</span>
                        <span>Usuarios</span>
                    </button>

                    <button
                        onClick={() => setSubTab('roles')}
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${subTab === 'roles' ? 'bg-white text-[#0b57d0] shadow-xs' : 'text-[#5f6368] hover:text-[#202124]'}`}
                    >
                        <span className="material-symbols-outlined text-[18px]">badge</span>
                        <span>Roles</span>
                    </button>

                    <button
                        onClick={() => setSubTab('permisos')}
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${subTab === 'permisos' ? 'bg-white text-[#0b57d0] shadow-xs' : 'text-[#5f6368] hover:text-[#202124]'}`}
                    >
                        <span className="material-symbols-outlined text-[18px]">key</span>
                        <span>Permisos</span>
                    </button>

                    <button
                        onClick={() => setSubTab('modulos')}
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${subTab === 'modulos' ? 'bg-white text-[#0b57d0] shadow-xs' : 'text-[#5f6368] hover:text-[#202124]'}`}
                    >
                        <span className="material-symbols-outlined text-[18px]">widgets</span>
                        <span>Módulos</span>
                    </button>
                </div>
            </section>

            {/* ========================================================================= */}
            {/* SUBMÓDULO 1: USUARIOS */}
            {/* ========================================================================= */}
            {subTab === 'usuarios' && (
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* BARRA DE FILTROS USUARIOS */}
                    <div className="px-6 py-2.5 bg-white border-b border-[#dadce0] flex flex-wrap items-center justify-between gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar en todas las columnas..."
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
                                    checked={mostrarInactivos}
                                    onChange={(e) => setMostrarInactivos(e.target.checked)}
                                    className="rounded text-[#0b57d0] focus:ring-[#0b57d0] border-[#dadce0] w-4 h-4 cursor-pointer"
                                />
                                <span>Mostrar inactivos</span>
                            </label>

                            <button
                                onClick={handleNewUser}
                                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#0b57d0] hover:bg-[#0842a0] text-white font-semibold rounded-full shadow-xs transition cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[16px]">person_add</span>
                                <span>Nuevo usuario</span>
                            </button>
                        </div>
                    </div>

                    {/* TABLA USUARIOS */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="bg-white border border-[#dadce0] rounded-xl overflow-hidden shadow-xs">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="bg-[#f8fafd] border-b border-[#dadce0] text-[#5f6368] uppercase text-[11px] font-semibold tracking-wider">
                                        <th className="py-3 px-4">NOMBRE ▲</th>
                                        <th className="py-3 px-4">EMAIL</th>
                                        <th className="py-3 px-4 text-center">ROL</th>
                                        <th className="py-3 px-4 text-center">ACTIVO</th>
                                        <th className="py-3 px-4 text-center">CREADO</th>
                                        <th className="py-3 px-4 text-center">ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#e8eaed]">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-[#f8fafd] transition-colors">
                                            <td className="py-3 px-4 font-bold text-[#202124]">{user.nombre}</td>
                                            <td className="py-3 px-4 text-[#3c4043] font-mono">{user.email}</td>
                                            <td className="py-3 px-4 text-center">{getRolBadge(user.rol)}</td>
                                            <td className="py-3 px-4 text-center">
                                                <button
                                                    onClick={() => toggleUserActivo(user.id)}
                                                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${user.activo ? 'bg-teal-600' : 'bg-slate-300'}`}
                                                >
                                                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${user.activo ? 'translate-x-4' : 'translate-x-0'}`} />
                                                </button>
                                            </td>
                                            <td className="py-3 px-4 text-center font-mono text-[#5f6368]">{user.creado}</td>
                                            <td className="py-3 px-4 text-center">
                                                <button
                                                    onClick={() => handleEditUser(user)}
                                                    className="p-1 text-[#5f6368] hover:text-[#1a73e8] hover:bg-[#f1f3f4] rounded-full transition cursor-pointer"
                                                    title="Editar usuario"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* SUBMÓDULO 2: ROLES */}
            {/* ========================================================================= */}
            {subTab === 'roles' && (
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-6 py-2.5 bg-white border-b border-[#dadce0] flex items-center justify-between">
                        <h2 className="text-base font-bold text-[#202124]">Roles del Sistema</h2>
                        <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0b57d0] hover:bg-[#0842a0] text-white font-semibold rounded-full text-xs transition cursor-pointer">
                            <span className="material-symbols-outlined text-[16px]">refresh</span>
                            <span>Recargar</span>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="bg-white border border-[#dadce0] rounded-xl overflow-hidden shadow-xs">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="bg-[#f8fafd] border-b border-[#dadce0] text-[#5f6368] uppercase text-[11px] font-semibold tracking-wider">
                                        <th className="py-3 px-4 w-32">ROL</th>
                                        <th className="py-3 px-4 w-48">NOMBRE</th>
                                        <th className="py-3 px-4">DESCRIPCIÓN</th>
                                        <th className="py-3 px-4 text-center w-40">MÓDULOS PERMITIDOS</th>
                                        <th className="py-3 px-4 text-center w-28">ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#e8eaed]">
                                    {roles.map((r) => (
                                        <tr key={r.id} className="hover:bg-[#f8fafd] transition-colors">
                                            <td className="py-3 px-4">{getRolBadge(r.rol)}</td>
                                            <td className="py-3 px-4 font-bold text-[#202124]">{r.nombre}</td>
                                            <td className="py-3 px-4 text-[#3c4043] font-medium uppercase">{r.descripcion}</td>
                                            <td className="py-3 px-4 text-center font-bold text-[#0b57d0] font-mono">{r.modulosPermitidos}</td>
                                            <td className="py-3 px-4 text-center">
                                                <button className="p-1 text-[#5f6368] hover:text-[#1a73e8] hover:bg-[#f1f3f4] rounded-full transition cursor-pointer">
                                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* SUBMÓDULO 3: PERMISOS POR ROL */}
            {/* ========================================================================= */}
            {subTab === 'permisos' && (
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-6 py-2.5 bg-white border-b border-[#dadce0] flex items-center justify-between">
                        <h2 className="text-base font-bold text-[#202124]">Permisos por Rol</h2>
                        <div className="flex items-center gap-2">
                            <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-[#dadce0] bg-white hover:bg-[#f1f3f4] text-[#3c4043] font-medium rounded-full text-xs transition cursor-pointer">
                                <span className="material-symbols-outlined text-[16px]">refresh</span>
                                <span>Recargar</span>
                            </button>
                            <button className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#0b57d0] hover:bg-[#0842a0] text-white font-semibold rounded-full text-xs transition cursor-pointer">
                                <span className="material-symbols-outlined text-[16px]">save</span>
                                <span>Guardar permisos</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="bg-white border border-[#dadce0] rounded-xl overflow-hidden shadow-xs">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="bg-[#f8fafd] border-b border-[#dadce0] text-[#5f6368] uppercase text-[11px] font-semibold tracking-wider">
                                        <th className="py-3 px-4">ROL</th>
                                        <th className="py-3 px-3 text-center">INICIO</th>
                                        <th className="py-3 px-3">SINIESTROS</th>
                                        <th className="py-3 px-3 text-center">CONTROL DE FACTURAS</th>
                                        <th className="py-3 px-3 text-center">REQUERIMIENTOS</th>
                                        <th className="py-3 px-3 text-center">VO.BO. SUPERVISOR</th>
                                        <th className="py-3 px-3 text-center">VO.BO. DIRECCIÓN</th>
                                        <th className="py-3 px-3 text-center">USUARIOS</th>
                                        <th className="py-3 px-3 text-center">ROLES</th>
                                        <th className="py-3 px-3 text-center">PERMISOS</th>
                                        <th className="py-3 px-3 text-center">MÓDULOS</th>
                                        <th className="py-3 px-3 text-center">ASEGURADORAS</th>
                                        <th className="py-3 px-3 text-center">CASETAS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#e8eaed]">
                                    {permisos.map((p) => (
                                        <tr key={p.rol} className="hover:bg-[#f8fafd] transition-colors">
                                            <td className="py-3 px-4">{getRolBadge(p.rol)}</td>
                                            <td className="py-3 px-3 text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={p.inicio}
                                                    onChange={() => togglePermisoCheckbox(p.rol, 'inicio')}
                                                    className="rounded text-[#0b57d0] focus:ring-[#0b57d0] border-[#dadce0] w-4 h-4 cursor-pointer"
                                                />
                                            </td>
                                            <td className="py-3 px-3">
                                                <select
                                                    value={p.siniestros}
                                                    onChange={(e) => changeSiniestrosPermiso(p.rol, e.target.value)}
                                                    className="bg-white border border-[#dadce0] rounded-md px-2 py-1 text-xs text-[#202124] focus:ring-1 focus:ring-[#1a73e8] outline-none cursor-pointer"
                                                >
                                                    <option value="Lectura y escritura">Lectura y escritura</option>
                                                    <option value="Solo lectura">Solo lectura</option>
                                                    <option value="Ninguno">Ninguno</option>
                                                </select>
                                            </td>
                                            <td className="py-3 px-3 text-center">
                                                <input type="checkbox" checked={p.facturas} onChange={() => togglePermisoCheckbox(p.rol, 'facturas')} className="rounded text-[#0b57d0] border-[#dadce0] w-4 h-4 cursor-pointer" />
                                            </td>
                                            <td className="py-3 px-3 text-center">
                                                <input type="checkbox" checked={p.requerimientos} onChange={() => togglePermisoCheckbox(p.rol, 'requerimientos')} className="rounded text-[#0b57d0] border-[#dadce0] w-4 h-4 cursor-pointer" />
                                            </td>
                                            <td className="py-3 px-3 text-center">
                                                <input type="checkbox" checked={p.voboSup} onChange={() => togglePermisoCheckbox(p.rol, 'voboSup')} className="rounded text-[#0b57d0] border-[#dadce0] w-4 h-4 cursor-pointer" />
                                            </td>
                                            <td className="py-3 px-3 text-center">
                                                <input type="checkbox" checked={p.voboDir} onChange={() => togglePermisoCheckbox(p.rol, 'voboDir')} className="rounded text-[#0b57d0] border-[#dadce0] w-4 h-4 cursor-pointer" />
                                            </td>
                                            <td className="py-3 px-3 text-center">
                                                <input type="checkbox" checked={p.usuarios} onChange={() => togglePermisoCheckbox(p.rol, 'usuarios')} className="rounded text-[#0b57d0] border-[#dadce0] w-4 h-4 cursor-pointer" />
                                            </td>
                                            <td className="py-3 px-3 text-center">
                                                <input type="checkbox" checked={p.roles} onChange={() => togglePermisoCheckbox(p.rol, 'roles')} className="rounded text-[#0b57d0] border-[#dadce0] w-4 h-4 cursor-pointer" />
                                            </td>
                                            <td className="py-3 px-3 text-center">
                                                <input type="checkbox" checked={p.permisos} onChange={() => togglePermisoCheckbox(p.rol, 'permisos')} className="rounded text-[#0b57d0] border-[#dadce0] w-4 h-4 cursor-pointer" />
                                            </td>
                                            <td className="py-3 px-3 text-center">
                                                <input type="checkbox" checked={p.modulos} onChange={() => togglePermisoCheckbox(p.rol, 'modulos')} className="rounded text-[#0b57d0] border-[#dadce0] w-4 h-4 cursor-pointer" />
                                            </td>
                                            <td className="py-3 px-3 text-center">
                                                <input type="checkbox" checked={p.aseguradoras} onChange={() => togglePermisoCheckbox(p.rol, 'aseguradoras')} className="rounded text-[#0b57d0] border-[#dadce0] w-4 h-4 cursor-pointer" />
                                            </td>
                                            <td className="py-3 px-3 text-center">
                                                <input type="checkbox" checked={p.casetas} onChange={() => togglePermisoCheckbox(p.rol, 'casetas')} className="rounded text-[#0b57d0] border-[#dadce0] w-4 h-4 cursor-pointer" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ========================================================================= */}
            {/* SUBMÓDULO 4: MÓDULOS DEL SISTEMA */}
            {/* ========================================================================= */}
            {subTab === 'modulos' && (
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-6 py-2.5 bg-white border-b border-[#dadce0] flex items-center justify-between">
                        <h2 className="text-base font-bold text-[#202124]">Módulos del Sistema</h2>
                        <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0b57d0] hover:bg-[#0842a0] text-white font-semibold rounded-full text-xs transition cursor-pointer">
                            <span className="material-symbols-outlined text-[16px]">refresh</span>
                            <span>Recargar</span>
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="bg-white border border-[#dadce0] rounded-xl overflow-hidden shadow-xs">
                            <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                    <tr className="bg-[#f8fafd] border-b border-[#dadce0] text-[#5f6368] uppercase text-[11px] font-semibold tracking-wider">
                                        <th className="py-3 px-4">MÓDULO</th>
                                        <th className="py-3 px-4">CLAVE</th>
                                        <th className="py-3 px-4">DESCRIPCIÓN</th>
                                        <th className="py-3 px-4 text-center w-24">ORDEN</th>
                                        <th className="py-3 px-4 text-center w-24">ACTIVO</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#e8eaed]">
                                    {modulos.map((m) => (
                                        <tr key={m.id} className="hover:bg-[#f8fafd] transition-colors">
                                            <td className="py-3 px-4 font-bold text-[#202124]">{m.modulo}</td>
                                            <td className="py-3 px-4 text-[#3c4043] font-mono font-medium">{m.clave}</td>
                                            <td className="py-3 px-4 text-[#3c4043] uppercase font-medium">{m.descripcion}</td>
                                            <td className="py-3 px-4 text-center font-mono font-bold text-[#5f6368]">{m.orden}</td>
                                            <td className="py-3 px-4 text-center">
                                                <button
                                                    onClick={() => toggleModuloActivo(m.id)}
                                                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${m.activo ? 'bg-teal-600' : 'bg-slate-300'}`}
                                                >
                                                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${m.activo ? 'translate-x-4' : 'translate-x-0'}`} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* FOOTER GENERAL */}
            <footer className="h-12 border-t border-[#dadce0] bg-white px-6 flex items-center justify-between text-xs text-[#5f6368] select-none shrink-0">
                <div className="flex items-center gap-2">
                    <span>Configuración:</span>
                    <span className="font-semibold text-[#202124]">Módulo de Administración de Accesos</span>
                </div>
            </footer>

            {/* MODAL USUARIO */}
            {isUserModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-[#202124]/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="relative bg-white border border-[#dadce0] rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-[#dadce0] flex items-center justify-between bg-white">
                            <h3 className="text-lg font-bold text-[#202124]">
                                {editingUser ? "Editar Usuario" : "Nuevo Usuario"}
                            </h3>
                            <button onClick={() => setIsUserModalOpen(false)} className="text-[#5f6368] hover:text-[#202124] p-1 rounded-full hover:bg-[#f1f3f4] cursor-pointer">
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSaveUser} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-[#444746] mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="ejemplo@sinestry.com"
                                    value={userForm.email}
                                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                                    className="w-full bg-[#f1f3f4] border border-[#dadce0] rounded-lg px-3 py-2 text-xs text-[#202124] outline-none focus:ring-1 focus:ring-[#1a73e8]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#444746] mb-1">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Nombre Apellido"
                                    value={userForm.nombre}
                                    onChange={(e) => setUserForm({ ...userForm, nombre: e.target.value })}
                                    className="w-full bg-[#f1f3f4] border border-[#dadce0] rounded-lg px-3 py-2 text-xs text-[#202124] outline-none focus:ring-1 focus:ring-[#1a73e8]"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-[#444746] mb-1">Rol</label>
                                <select
                                    value={userForm.rol}
                                    onChange={(e) => setUserForm({ ...userForm, rol: e.target.value })}
                                    className="w-full bg-white border border-[#dadce0] rounded-lg px-3 py-2 text-xs text-[#202124] outline-none focus:ring-1 focus:ring-[#1a73e8] cursor-pointer"
                                >
                                    <option value="ADMIN">admin</option>
                                    <option value="SUPERVISOR">supervisor</option>
                                    <option value="CAPTURISTA">capturista</option>
                                    <option value="DIRECCION">direccion</option>
                                    <option value="IMPLANT">implant</option>
                                </select>
                            </div>

                            <div className="pt-4 border-t border-[#dadce0] flex items-center justify-between">
                                <span className="text-[11px] text-[#5f6368]">Edita los campos y guarda.</span>
                                <div className="flex items-center gap-2">
                                    <button type="button" onClick={() => setIsUserModalOpen(false)} className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#e8eaed] text-[#3c4043] hover:bg-[#dadce0] cursor-pointer">
                                        Cancelar
                                    </button>
                                    <button type="submit" className="px-5 py-2 rounded-lg bg-[#0b57d0] hover:bg-[#0842a0] text-white text-xs font-semibold shadow-md cursor-pointer">
                                        {editingUser ? "Actualizar" : "Guardar"}
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