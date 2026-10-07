import { useEffect, useMemo, useState } from "react"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { api } from "./lib/api"
import LoginPage from "./pages/LoginPage"
import Sidebar from "./components/Sidebar"
import TabBar from "./components/TabBar"
import Dashboard from "./components/Dashboard"
import SiniestrosTable from "./components/SiniestrosTable"
import RequerimientosTable from "./components/RequerimientosTable"
import ControlFacturasTable from "./components/ControlFacturasTable"
import ReportesTable from "./components/ReportesTable"
import ConfiguracionTable from "./components/ConfiguracionTable"
import CatalogosTable from "./components/CatalogosTable"
import "./App.css"

// --------------------------------------------------
// Inner shell — rendered only when user is logged in
// --------------------------------------------------
function AppShell() {
  const { user } = useAuth()

  // Sidebar state
  const [collapsed, setCollapsed] = useState(false)

  // Tab system
  const defaultTab = { id: "Resumen Ejecutivo", label: "Resumen Ejecutivo", icon: "📊" }
  const [tabs, setTabs] = useState([defaultTab])
  const [activeTab, setActiveTab] = useState(defaultTab.id)

  // Siniestros state
  const [siniestros, setSiniestros] = useState([])
  const [loadingSiniestros, setLoadingSiniestros] = useState(false)
  const [siniestrosError, setSiniestrosError] = useState(null)

  // Requerimientos state
  const [requerimientos, setRequerimientos] = useState([])
  const [loadingReq, setLoadingReq] = useState(false)
  const [reqError, setReqError] = useState(null)

  // Control de Facturas state
  const [facturas, setFacturas] = useState([])
  const [loadingFacturas, setLoadingFacturas] = useState(false)
  const [facturasError, setFacturasError] = useState(null)
  const [facturasFilter, setFacturasFilter] = useState("")

  // Requerimientos quick-filter (from siniestros row)
  const [requerimientosFilter, setRequerimientosFilter] = useState("")

  // Fetch siniestros
  useEffect(() => {
    if (!user) return
    let alive = true
    const ctrl = new AbortController()
    setLoadingSiniestros(true)
    setSiniestrosError(null)
    api("/siniestros", { signal: ctrl.signal })
      .then((r) => { if (!r.ok) throw new Error(`Error ${r.status}`); return r.json() })
      .then((data) => { if (alive && Array.isArray(data)) setSiniestros(data) })
      .catch((e) => { if (alive && e.name !== "AbortError") setSiniestrosError("No se pudo cargar el listado de siniestros.") })
      .finally(() => { if (alive) setLoadingSiniestros(false) })
    return () => { alive = false; ctrl.abort() }
  }, [user])

  // Fetch requerimientos
  useEffect(() => {
    if (!user) return
    let alive = true
    const ctrl = new AbortController()
    setLoadingReq(true)
    setReqError(null)
    api("/requerimientos", { signal: ctrl.signal })
      .then((r) => { if (!r.ok) throw new Error(`Error ${r.status}`); return r.json() })
      .then((data) => { if (alive && Array.isArray(data)) setRequerimientos(data) })
      .catch((e) => { if (alive && e.name !== "AbortError") setReqError("No se pudo cargar requerimientos.") })
      .finally(() => { if (alive) setLoadingReq(false) })
    return () => { alive = false; ctrl.abort() }
  }, [user])

  // Fetch facturas
  useEffect(() => {
    if (!user) return
    let alive = true
    const ctrl = new AbortController()
    setLoadingFacturas(true)
    setFacturasError(null)
    api("/facturas", { signal: ctrl.signal })
      .then((r) => { if (!r.ok) throw new Error(`Error ${r.status}`); return r.json() })
      .then((data) => { if (alive && Array.isArray(data)) setFacturas(data) })
      .catch((e) => { if (alive && e.name !== "AbortError") setFacturasError("No se pudo cargar facturas.") })
      .finally(() => { if (alive) setLoadingFacturas(false) })
    return () => { alive = false; ctrl.abort() }
  }, [user])

  // Tab helpers
  const openTab = (item) => {
    setTabs((prev) => {
      if (prev.some((t) => t.id === item.label)) return prev
      return [...prev, { id: item.label, label: item.label, icon: item.icon }]
    })
    setActiveTab(item.label)
  }

  const openExpediente = (row) => {
    const numSiniestro = row.numero_siniestro || row.id
    const tabId = `expediente-${numSiniestro}`
    setTabs((prev) => {
      if (prev.some((t) => t.id === tabId)) return prev
      return [...prev, { id: tabId, label: String(numSiniestro), icon: "📋" }]
    })
    setActiveTab(tabId)
  }

  const openArchivos = (row) => {
    const numSiniestro = row.numero_siniestro || row.id
    const tabId = `archivos-${numSiniestro}`
    setTabs((prev) => {
      if (prev.some((t) => t.id === tabId)) return prev
      return [...prev, { id: tabId, label: `Archivos-${numSiniestro}`, icon: "📁" }]
    })
    setActiveTab(tabId)
  }

  const openFacturasForRow = (row) => {
    const numSiniestro = row.numero_siniestro || row.id
    setTabs((prev) => {
      if (prev.some((t) => t.id === "Control de Facturas")) return prev
      return [...prev, { id: "Control de Facturas", label: "Control de Facturas", icon: "📄" }]
    })
    setFacturasFilter(String(numSiniestro))
    setActiveTab("Control de Facturas")
  }

  const openRequerimientosForRow = (row) => {
    const numSiniestro = row.numero_siniestro || row.id
    setTabs((prev) => {
      if (prev.some((t) => t.id === "Requerimientos")) return prev
      return [...prev, { id: "Requerimientos", label: "Requerimientos", icon: "📫" }]
    })
    setRequerimientosFilter(String(numSiniestro))
    setActiveTab("Requerimientos")
  }

  const closeTab = (tabId) => {
    setTabs((prev) => prev.filter((t) => t.id !== tabId))
    setActiveTab((curr) => {
      if (curr !== tabId) return curr
      const remaining = tabs.filter((t) => t.id !== tabId)
      return remaining.length > 0 ? remaining[remaining.length - 1].id : "Resumen Ejecutivo"
    })
  }

  const handleSelect = (label) => {
    if (label === "Resumen Ejecutivo" || label === "Inicio") {
      setActiveTab("Resumen Ejecutivo")
    } else {
      setActiveTab(label)
    }
  }

  // Render tab content
  const renderContent = () => {
    // 1. RESUMEN EJECUTIVO (DASHBOARD)
    if (activeTab === "Resumen Ejecutivo" || activeTab === "Inicio") {
      return (
        <Dashboard
          onOpenTab={openTab}
          onOpenExpediente={openExpediente}
          siniestros={siniestros}
          requerimientosCount={requerimientos.length}
        />
      )
    }

    // 2. SINIESTRALIDAD
    if (activeTab === "Siniestralidad" || activeTab === "Siniestros") {
      return (
        <SiniestrosTable
          rows={siniestros}
          loading={loadingSiniestros}
          error={siniestrosError}
          onOpenExpediente={openExpediente}
          onOpenArchivos={openArchivos}
          onOpenFacturas={openFacturasForRow}
          onOpenRequerimientos={openRequerimientosForRow}
        />
      )
    }

    // 3. CONTROL DE FACTURAS
    if (activeTab === "Control de Facturas" || activeTab === "Control de facturas") {
      return (
        <ControlFacturasTable
          rows={facturas}
          loading={loadingFacturas}
          siniestros={siniestros}
          error={facturasError}
          initialFilter={facturasFilter}
        />
      )
    }

    // 4. REQUERIMIENTOS
    if (activeTab === "Requerimientos") {
      return (
        <RequerimientosTable
          rows={requerimientos}
          loading={loadingReq}
          error={reqError}
          initialFilter={requerimientosFilter}
        />
      )
    }

    // 5. REPORTES Y AUDITORÍA
    if (activeTab === "Reportes y Auditoría" || activeTab === "Reportes") {
      return <ReportesTable />
    }

    // 6. CATÁLOGOS
    if (activeTab === "Catálogos" || activeTab === "Catalogos") {
      return <CatalogosTable />
    }

    // 7. CONFIGURACIÓN
    if (activeTab === "Configuración" || activeTab === "Usuarios") {
      return <ConfiguracionTable />
    }

    // Expediente tabs
    if (activeTab.startsWith("expediente-")) {
      const numSiniestro = activeTab.replace("expediente-", "")
      const row = siniestros.find((s) => String(s.numero_siniestro || s.id) === numSiniestro)
      return (
        <div className="placeholder-panel fade-in">
          <div className="placeholder-card glass-strong">
            <div style={{ fontSize: 42 }}>📋</div>
            <h3>Expediente: {numSiniestro}</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>
              {row ? `Siniestro encontrado — ${row.tipo_accidente || "—"}` : "Cargando expediente…"}
            </p>
          </div>
        </div>
      )
    }

    // Archivos tabs
    if (activeTab.startsWith("archivos-")) {
      const numSiniestro = activeTab.replace("archivos-", "")
      return (
        <div className="placeholder-panel fade-in">
          <div className="placeholder-card glass-strong">
            <div style={{ fontSize: 42 }}>📁</div>
            <h3>Archivos: {numSiniestro}</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>
              Visor de archivos adjuntos — conectar con <code>/archivos/{numSiniestro}</code>
            </p>
          </div>
        </div>
      )
    }

    // Catch-all
    return (
      <div className="placeholder-panel fade-in">
        <div className="placeholder-card glass-strong">
          <div style={{ fontSize: 42 }}>🚧</div>
          <h3>{activeTab}</h3>
          <p style={{ color: "var(--text-secondary)", fontSize: 13 }}>Módulo en construcción</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-layout">
      <Sidebar
        activeTab={activeTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        onSelect={handleSelect}
        onOpenTab={openTab}
      />

      <div className="app-main">
        <div className="bg-mesh" />

        <TabBar
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          closeTab={closeTab}
        />

        <main className="app-content">
          {renderContent()}
        </main>
      </div>

      <style>{appStyles}</style>
    </div>
  )
}

function AuthGate() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "100dvh", background: "var(--bg-body)", flexDirection: "column", gap: 16
      }}>
        <div className="spin-ring" />
        <p style={{ color: "var(--text-secondary)", fontSize: 14, margin: 0 }}>Verificando sesión…</p>
        <style>{`.spin-ring{width:40px;height:40px;border:3px solid rgba(0,212,170,.2);border-top-color:var(--accent);border-radius:50%;animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  return user ? <AppShell /> : <LoginPage />
}

export default function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  )
}

const appStyles = `
.app-layout {
  display: flex;
  height: 100dvh;
  width: 100%;
  overflow: hidden;
}

.app-main {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.bg-mesh {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 15% 40%, rgba(108,99,255,0.08) 0%, transparent 55%),
    radial-gradient(ellipse at 85% 20%, rgba(0,212,170,0.07) 0%, transparent 55%),
    radial-gradient(ellipse at 60% 90%, rgba(108,99,255,0.05) 0%, transparent 45%);
  pointer-events: none;
  z-index: 0;
}

.app-content {
  flex: 1 1 auto;
  overflow-y: auto; /* PERMITE SCROLL EN TODAS LAS VISTAS */
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}

.placeholder-panel {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
.placeholder-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 48px 56px;
  border-radius: 20px;
  text-align: center;
}
.placeholder-card h3 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 20px;
  color: var(--text-primary);
}
.placeholder-card code {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  padding: 2px 7px;
  border-radius: 4px;
  font-size: 12px;
  color: var(--accent);
}
`