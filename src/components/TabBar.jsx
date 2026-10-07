export default function TabBar({ tabs, activeTab, setActiveTab, closeTab }) {
    return (
        <div className="tabbar">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                    onClick={() => setActiveTab(tab.id)}
                    title={tab.label}
                >
                    {tab.icon && <span className="tab-icon">{tab.icon}</span>}
                    <span className="tab-label">{tab.label}</span>
                    {tab.id !== "Inicio" && (
                        <span
                            className="tab-close"
                            onClick={(e) => { e.stopPropagation(); closeTab(tab.id) }}
                            title="Cerrar"
                        >
                            ×
                        </span>
                    )}
                </button>
            ))}

            <style>{tabStyles}</style>
        </div>
    )
}

const tabStyles = `
.tabbar {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 0 12px;
  background: rgba(8,12,24,0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-glass);
  height: 44px;
  overflow-x: auto;
  flex-shrink: 0;
}
.tabbar::-webkit-scrollbar { height: 2px; }

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 14px;
  height: 36px;
  border-radius: 8px 8px 0 0;
  border: none;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: var(--text-secondary);
  font-size: 12.5px;
  font-weight: 500;
  font-family: var(--font-sans);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
}
.tab-btn:hover { color: var(--text-primary); background: var(--glass-bg); }
.tab-btn.active {
  color: var(--accent);
  border-bottom-color: var(--accent);
  background: var(--accent-dim);
}

.tab-icon { font-size: 14px; }
.tab-label { max-width: 130px; overflow: hidden; text-overflow: ellipsis; }

.tab-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px; height: 18px;
  border-radius: 4px;
  font-size: 15px;
  color: var(--text-secondary);
  transition: background 0.15s, color 0.15s;
  line-height: 1;
  margin-left: 2px;
}
.tab-close:hover { background: rgba(255,77,109,0.2); color: var(--danger); }
`
