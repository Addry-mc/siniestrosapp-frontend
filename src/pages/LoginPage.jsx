import { useState } from "react"
import { useAuth } from "../context/AuthContext"

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth()
  const [mode, setMode] = useState("password")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  // ESTADO PARA CONTROLAR EL MODAL DE PRIVACIDAD / SGI
  const [modalContenido, setModalContenido] = useState(null) // 'privacidad' | 'sgi' | null

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    setBusy(true)
    try {
      await login(email.trim(), password)
    } catch (err) {
      setError(err.message || "Error al iniciar sesión")
    } finally {
      setBusy(false)
    }
  }

  const handleGoogle = async () => {
    setError("")
    setBusy(true)
    try {
      await loginWithGoogle()
    } catch (err) {
      setError(err.message || "Error al iniciar sesión con Google")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col justify-between items-center px-4 py-8 sm:px-6 md:px-8 bg-[#f8fafd] text-[#202124] antialiased selection:bg-[#e8f0fe] selection:text-[#1a73e8] relative font-sans">

      {/* FONDO LIMPIO CON SUTIL RESPLANDOR GOOGLE STYLE */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden -z-10"
        style={{
          backgroundColor: '#f8fafd',
          backgroundImage: `
            radial-gradient(circle at 10% 20%, rgba(26, 115, 232, 0.05) 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(24, 128, 56, 0.04) 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(234, 67, 53, 0.03) 0%, transparent 50%)
          `
        }}
      />

      {/* ESPACIADOR SUPERIOR */}
      <div className="hidden sm:block w-full max-w-5xl h-4" />

      {/* CONTENEDOR PRINCIPAL DEL LOGIN */}
      <main className="w-full max-w-[420px] mx-auto flex flex-col items-center my-auto z-10">

        {/* BRAND HEADER SIN LA ETIQUETA APP */}
        <header className="w-full flex flex-col items-center mb-6 sm:mb-8 text-center">
          <div className="flex items-center justify-center">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#202124] uppercase font-sans flex items-baseline">
              SINESTRY
              <span className="inline-block w-2.5 h-2.5 ml-0.5 rounded-full bg-[#ea4335] shrink-0" />
            </h1>
          </div>
        </header>

        {/* TARJETA DE AUTENTICACIÓN ESTILO GOOGLE */}
        <section className="w-full bg-white border border-[#dadce0] rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-shadow">

          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#202124] tracking-tight">
              Inicia sesión
            </h2>
            <p className="text-xs sm:text-sm text-[#5f6368] mt-1">
              Ingresa con tu cuenta institucional
            </p>
          </div>

          {/* TABS DE SELECCIÓN DE MÉTODO */}
          <div className="grid grid-cols-2 p-1 bg-[#f1f3f4] rounded-xl border border-[#dadce0] mb-6">
            <button
              type="button"
              onClick={() => setMode("password")}
              className={`flex items-center justify-center gap-2 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${mode === "password"
                  ? "text-[#1a73e8] bg-white shadow-xs"
                  : "text-[#5f6368] hover:text-[#202124]"
                }`}
            >
              <svg className="w-4 h-4 text-[#1a73e8]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <rect height="16" rx="2" width="20" x="2" y="4" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span>Correo</span>
            </button>

            <button
              type="button"
              onClick={() => setMode("google")}
              className={`flex items-center justify-center gap-2 py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${mode === "google"
                  ? "text-[#1a73e8] bg-white shadow-xs"
                  : "text-[#5f6368] hover:text-[#202124]"
                }`}
            >
              <GoogleIcon />
              <span>Google</span>
            </button>
          </div>

          {/* ALERTA DE ERROR */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-[#fce8e6] border border-[#fad2cf] text-[#c5221f] text-xs text-center flex items-center justify-center gap-2 font-medium">
              <span>⚠️ {error}</span>
            </div>
          )}

          {/* FORMULARIO */}
          {mode === "password" ? (
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">

              {/* CAMPO CORREO */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold tracking-wider text-[#5f6368] uppercase" htmlFor="email">
                  Correo Institucional
                </label>
                <div className="relative rounded-xl bg-[#f8fafd] border border-[#dadce0] focus-within:border-[#1a73e8] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#e8f0fe] transition duration-150">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5f6368]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="usuario@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full bg-transparent pl-10 pr-3.5 py-3 text-sm text-[#202124] placeholder-[#80868b] focus:outline-none border-none rounded-xl font-medium"
                  />
                </div>
              </div>

              {/* CAMPO CONTRASEÑA */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold tracking-wider text-[#5f6368] uppercase" htmlFor="password">
                  Contraseña
                </label>
                <div className="relative rounded-xl bg-[#f8fafd] border border-[#dadce0] focus-within:border-[#1a73e8] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#e8f0fe] transition duration-150">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5f6368]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full bg-transparent pl-10 pr-11 py-3 text-sm text-[#202124] placeholder-[#80868b] focus:outline-none border-none rounded-xl font-medium tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute inset-y-0 right-0 pr-3.5 flex items-center transition-colors cursor-pointer ${showPassword ? 'text-[#1a73e8]' : 'text-[#5f6368] hover:text-[#202124]'}`}
                    aria-label="Mostrar u ocultar contraseña"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                      {showPassword ? (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {/* RECORDARME Y ¿OLVIDASTE TU CLAVE? */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center space-x-2 cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded border-[#dadce0] text-[#1a73e8] focus:ring-0 focus:ring-offset-0 focus:outline-none cursor-pointer"
                  />
                  <span className="text-[#5f6368] group-hover:text-[#202124] transition-colors text-xs font-medium">Recordarme</span>
                </label>
                <a href="#" className="text-xs text-[#1a73e8] hover:underline transition-colors font-semibold">
                  ¿Olvidaste tu clave?
                </a>
              </div>

              {/* BOTÓN SUBMIT TIPO GOOGLE */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full py-3 px-4 bg-[#0b57d0] hover:bg-[#0842a0] active:scale-[0.985] text-white font-bold text-sm sm:text-base rounded-xl shadow-xs transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
                >
                  {busy ? (
                    <div className="flex items-center space-x-2">
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Entrando…</span>
                    </div>
                  ) : (
                    <>
                      <span>Iniciar sesión</span>
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
                        <line x1="5" x2="19" y1="12" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGoogle}
                disabled={busy}
                className="w-full py-3 px-4 bg-white border border-[#dadce0] hover:bg-[#f8fafd] active:scale-[0.985] text-[#3c4043] font-bold text-sm sm:text-base rounded-xl shadow-xs flex items-center justify-center space-x-3 transition-all duration-200 cursor-pointer disabled:opacity-60"
              >
                <GoogleIcon />
                <span>{busy ? "Entrando…" : "Continuar con Google"}</span>
              </button>
            </div>
          )}

          {/* FOOTER INTERNO DE LA TARJETA */}
          <div className="mt-7 pt-5 border-t border-[#f1f3f4] flex flex-col items-center justify-center text-center gap-2">
            <div className="flex items-center space-x-2 text-xs text-[#5f6368] font-medium">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-[#e8f0fe] text-[#1a73e8] border border-[#d3e3fd] tracking-wider">
                10 AÑOS
              </span>
              <span className="tracking-wide text-[#3c4043] font-semibold">CONTIGO</span>
            </div>
            <div className="flex items-center text-xs text-[#5f6368] gap-1.5 mt-0.5">
              <svg className="w-3.5 h-3.5 text-[#188038] inline shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect height="11" rx="2" ry="2" width="18" x="3" y="11" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Conexión cifrada de alta seguridad SSL</span>
            </div>
          </div>

        </section>
      </main>

      {/* SYSTEM FOOTER CON LOS ENLACES A AVISO DE PRIVACIDAD Y POLÍTICA SGI */}
      <footer className="w-full max-w-md mx-auto mt-8 mb-2 text-center space-y-2 z-10">
        <div className="flex items-center justify-center gap-4 text-xs font-semibold text-[#5f6368]">
          <button
            type="button"
            onClick={() => setModalContenido('privacidad')}
            className="hover:text-[#1a73e8] transition cursor-pointer underline"
          >
            Aviso de Privacidad
          </button>
          <span className="text-[#dadce0]">|</span>
          <button
            type="button"
            onClick={() => setModalContenido('sgi')}
            className="hover:text-[#1a73e8] transition cursor-pointer underline"
          >
            Política SGI
          </button>
        </div>

        <a
          href="https://www.sinestry.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold tracking-widest text-[#5f6368] hover:text-[#202124] transition duration-150 inline-block uppercase"
        >
          WWW.SINESTRY.COM
        </a>
        <p className="text-[11px] text-[#80868b]">
          © 2026 Sinestry Technologies. Todos los derechos reservados.
        </p>
      </footer>

      {/* MODAL DESPLEGABLE TIPO GOOGLE MATERIAL */}
      {modalContenido && (
        <div className="fixed inset-0 z-50 bg-[#202124]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#dadce0] rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl text-left overflow-hidden">

            {/* ENCABEZADO DEL MODAL */}
            <div className="p-6 border-b border-[#dadce0] flex items-center justify-between bg-white">
              <h3 className="text-base sm:text-lg font-bold text-[#202124]">
                {modalContenido === 'privacidad' ? 'Aviso de Privacidad' : 'Política del Sistema de Gestión Integral (SGI)'}
              </h3>
              <button
                type="button"
                onClick={() => setModalContenido(null)}
                className="text-[#5f6368] hover:text-[#202124] p-1.5 rounded-full hover:bg-[#f1f3f4] cursor-pointer transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="18" x2="6" y1="6" y2="18" />
                  <line x1="6" x2="18" y1="6" y2="18" />
                </svg>
              </button>
            </div>

            {/* CUERPO DEL MODAL */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-[#3c4043] leading-relaxed">
              {modalContenido === 'privacidad' ? (
                <>
                  <p className="font-bold text-[#202124] text-sm border-b border-[#f1f3f4] pb-2">
                    Aviso de Privacidad
                  </p>
                  <p>
                    <strong>FYF Asesores, S.A. de C.V.</strong>, con domicilio en Insurgentes Sur 1431, Piso 10, Col. Insurgentes Mixcoac, Alcaldía Benito Juárez, Ciudad de México, C.P. 03920 (en lo sucesivo “FYF”), para nosotros, la privacidad y el manejo de la información que usted nos proporciona son de suma importancia. Por ello, protegemos sus datos personales en estricto apego a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (en lo sucesivo “LA LEY”) y demás disposiciones aplicables[cite: 1].
                  </p>
                  <p>
                    Los datos personales, incluyendo aquellos sensibles, de identificación, patrimoniales o financieros, recabados o que se recaben en el futuro, por motivo de la relación jurídica y/o comercial entre usted(es) y FYF, serán utilizados para los siguientes fines:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-[#3c4043]">
                    <li>La realización de todas y cada una de las operaciones y la prestación de los servicios de FYF.</li>
                    <li>La identificación, operación, administración, análisis, ofrecimiento y promoción de bienes, productos y servicios y/o prospección comercial.</li>
                    <li>La atención de requerimientos de cualquier autoridad competente.</li>
                    <li>Actividades complementarias que se requieran para la ejecución de los incisos arriba descritos.</li>
                  </ul>
                  <p>
                    Asimismo, hacemos de su conocimiento que cuenta con un plazo de cinco días hábiles para que, de ser el caso, manifieste su negativa para el tratamiento de sus datos personales para aquellas finalidades que no son necesarias ni hayan dado origen a la relación jurídica con FYF. Usted puede revocar en cualquier momento su consentimiento al tratamiento de sus datos personales a través del correo electrónico <a href="mailto:privacidad@fyfasesores.mx" className="text-[#1a73e8] underline">privacidad@fyfasesores.mx</a> o en el domicilio referido en párrafos anteriores.
                  </p>
                  <p>
                    Se hace del conocimiento de usted(es) que FYF utiliza mecanismos en medios remotos o locales de comunicación electrónica, óptica y otras tecnologías para el resguardo de datos personales. En caso de vulneración de seguridad de derechos patrimoniales o morales, serán informados de manera inmediata; sin embargo, el uso de “cookies” no manipula ni recaba datos personales.
                  </p>
                  <p>
                    Le informamos que el presente Aviso de Privacidad Integral está disponible en todo momento a través de nuestro portal de Internet:
                  </p>
                  <p className="p-2 bg-[#f8fafd] rounded-xl border border-[#dadce0] text-center font-mono text-xs">
                    <a href="https://fyfasesores.mx/avisodeprivacidad/" target="_blank" rel="noopener noreferrer" className="text-[#1a73e8] hover:underline">
                      https://fyfasesores.mx/avisodeprivacidad/
                    </a>
                  </p>

                  {/* INSTRUCCIONES Y DESCARGA DIRECTA DE FORMATOS OFICIALES PDF */}
                  <div className="mt-6 pt-4 border-t border-[#f1f3f4] space-y-3">
                    <h5 className="font-bold text-[#202124] text-xs uppercase tracking-wider">
                      INSTRUCCIONES:
                    </h5>
                    <ol className="list-decimal pl-5 space-y-1 text-[#3c4043] text-xs">
                      <li>Seleccione y descargue el formato del cual desea hacer su solicitud.</li>
                      <li>Llene los campos solicitados de manera digital o a mano con letra legible y de molde.</li>
                      <li>Firme autógrafamente el formato previamente requisitado.</li>
                      <li>Envíe por correo electrónico el formato firmado con copia de su identificación oficial vigente, así como el documento probatorio que se requiera en su caso.</li>
                    </ol>

                    <div className="space-y-2 pt-2">
                      <a
                        href="/docs/20251020-FYF-FORMATO-DE-TRANSFERENCIA-DE-DATOS-PERSONALES.pdf"
                        download="20251020-FYF-FORMATO-DE-TRANSFERENCIA-DE-DATOS-PERSONALES.pdf"
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-[#f8fafd] border border-[#dadce0] hover:border-[#1a73e8] text-[#202124] font-medium transition cursor-pointer group text-left"
                      >
                        <span className="text-xs">FORMATO PARA CONSENTIR LA TRANSFERENCIA DE DATOS PERSONALES</span>
                        <span className="text-xs text-[#1a73e8] font-bold group-hover:underline flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                          (Descarga aquí)
                        </span>
                      </a>

                      <a
                        href="/docs/20251020-FYF-FORMATO-DERECHOS-ARCO.pdf"
                        download="20251020-FYF-FORMATO-DERECHOS-ARCO.pdf"
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-[#f8fafd] border border-[#dadce0] hover:border-[#1a73e8] text-[#202124] font-medium transition cursor-pointer group text-left"
                      >
                        <span className="text-xs">FORMATO PARA EJERCER LOS DERECHOS ARCOS</span>
                        <span className="text-xs text-[#1a73e8] font-bold group-hover:underline flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                          (Descarga aquí)
                        </span>
                      </a>

                      <a
                        href="/docs/20251020-FYF-FORMATO-DE-NEGATIVA-1.pdf"
                        download="20251020-FYF-FORMATO-DE-NEGATIVA-1.pdf"
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-[#f8fafd] border border-[#dadce0] hover:border-[#1a73e8] text-[#202124] font-medium transition cursor-pointer group text-left"
                      >
                        <span className="text-xs">FORMATO PARA MANIFESTAR LA NEGATIVA DE TRATAMIENTO DE DATOS PERSONALES</span>
                        <span className="text-xs text-[#1a73e8] font-bold group-hover:underline flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                          (Descarga aquí)
                        </span>
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="font-bold text-[#202124] text-sm border-b border-[#f1f3f4] pb-2">
                    Política del Sistema de Gestión Integral (SGI)
                  </p>
                  <p>
                    <strong className="text-[#202124]">FYF Asesores S.A. de C.V.</strong> desarrolló el sistema <strong className="text-[#202124]">SINESTRY</strong> para la prestación de servicios especializados de terciarización de la gestión integral de cuentas de seguro que, por sus requerimientos técnicos, volumen de siniestros, especialización o que por sus características específicas, requieran un manejo separado de la operación rutinaria. Con este sistema brindamos apoyo y orientación a lo largo de todo el proceso, a fin de fortalecer el área de siniestros, comercial y de recuperación de reaseguro, sin interferir o comprometer la operación cotidiana del cliente[cite: 4].
                  </p>
                  <p>
                    Para fortalecer a SINESTRY, la dirección de FYF Asesores S.A. de C.V., comprometida con la satisfacción de sus clientes y la protección de la información, ha decidido implantar un “Sistema de Gestión Integral”, en adelante (SGI), basado en las normas <strong className="text-[#202124]">ISO 9001 e ISO 27001</strong>[cite: 4].
                  </p>
                  <p>
                    Nuestro objetivo es garantizar que los servicios que prestamos a nuestros clientes estén organizados en torno a pilares básicos como la calidad de los mismos, la satisfacción del cliente, así como la seguridad de la información, a fin de garantizar la continuidad del negocio, minimizar los potenciales daños, maximizar el retorno de las inversiones y las oportunidades de negocio, todo dentro de una mejora continua[cite: 4].
                  </p>

                  <h4 className="font-bold text-[#202124] pt-2 text-xs uppercase tracking-wider">
                    Esta política se basa en los siguientes principios:
                  </h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-[#3c4043]">
                    <li>Establecer que la calidad y la seguridad de la información, así como su mejora, son responsabilidad de todos los integrantes de la empresa, empezando desde la alta dirección[cite: 4].</li>
                    <li>Dejar por sentado que la calidad y seguridad de la información se obtienen planificando, ejecutando, revisando y mejorando el SGI, teniendo presente en todo momento el contexto de la organización, tanto interno como externo[cite: 4].</li>
                    <li>Establecer y revisar regularmente objetivos y metas acordes con los compromisos asumidos en esta declaración. Para la aplicación efectiva de estos principios, es necesario el apoyo del equipo directivo y colaboradores[cite: 4].</li>
                    <li>Orientar la calidad hacia la satisfacción de todos nuestros clientes (y partes interesadas), mediante el compromiso de toda la organización en cumplir con sus necesidades, requisitos legales y los propios de los servicios[cite: 4].</li>
                    <li>Mantener un enfoque hacia la mejora continua, tanto de los procesos productivos como de la eficacia del SGI, en el que prevenir los errores sea un aspecto fundamental[cite: 4].</li>
                    <li>Fijar el compromiso de la organización a homologar y reevaluar periódicamente a nuestros proveedores bajo nuestros criterios de certificación[cite: 4].</li>
                    <li>Identificar los riesgos de la organización, de tal manera que establezcamos un enfoque preventivo[cite: 4].</li>
                    <li>Prestar la máxima atención a la evolución tecnológica y a las posibles mejoras que las nuevas tecnologías ofrezcan[cite: 4].</li>
                    <li>Difundir a todo el personal de la empresa esta política para su conocimiento y comprensión, puesto que es fundamental la participación y compromiso de todos los colaboradores[cite: 4].</li>
                    <li>Proteger los datos e información confidencial y sensible de los colaboradores, clientes, proveedores y partes interesadas[cite: 4].</li>
                    <li>Salvaguardar los registros de la organización y proteger los derechos de propiedad intelectual[cite: 4].</li>
                    <li>Asignar responsabilidades de seguridad y formar/capacitar para la calidad y seguridad de la información[cite: 4].</li>
                    <li>Llevar un registro de las incidencias de seguridad y gestionar la continuidad del negocio[cite: 4].</li>
                    <li>Gestionar los cambios que pudieran darse en la empresa, tanto en aspectos de calidad como relativos a la seguridad[cite: 4].</li>
                  </ul>

                  <h4 className="font-bold text-[#202124] pt-3 text-xs uppercase tracking-wider">
                    La Dirección de FYF Asesores S.A. de C.V. adquiere los siguientes compromisos:
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-[#3c4043]">
                    <li>Brindar servicios conforme a la normatividad aplicable a las líneas de negocio desarrolladas por la organización e incluidas en el alcance del SGI[cite: 4].</li>
                    <li>Establecer y dar cumplimiento a los requisitos contractuales con las partes interesadas[cite: 4].</li>
                    <li>Definir los requisitos de formación en calidad y seguridad, proporcionando planes de capacitación a las partes interesadas[cite: 4].</li>
                    <li>Desarrollar políticas específicas y establecer acuerdos contractuales con organizaciones especializadas para prevenir y detectar virus y otro software malicioso[cite: 4].</li>
                    <li>Gestionar la continuidad del negocio, desarrollando planes conforme a las metodologías de prestigio internacional[cite: 4].</li>
                    <li>Establecer consecuencias de las violaciones de la política de seguridad, las cuales serán reflejadas en los contratos firmados con las partes interesadas, proveedores y subcontratistas[cite: 4].</li>
                    <li>Actuar en todo momento dentro de la más estricta ética profesional[cite: 4].</li>
                  </ul>

                  <div className="mt-4 p-3 bg-[#f8fafd] rounded-xl border border-[#dadce0] space-y-1 text-center text-xs">
                    <p className="font-mono text-[#5f6368]">POL-DL-01 “Política del Sistema de Gestión Integral”[cite: 4]</p>
                    <p className="font-mono text-[#5f6368]">Rev. 00, 30/01/2024 · Público[cite: 4]</p>
                    <div className="pt-2 font-bold text-[#202124]">
                      <p>Alta Dirección: Pedro Vergara[cite: 4]</p>
                      <p className="text-[11px] font-normal text-[#5f6368]">Ciudad de México, 30 de enero de 2024.[cite: 4]</p>
                    </div>
                  </div>

                  {/* ENLACE DIRECTO PARA DESCARGAR EL PDF REAL DE LA POLÍTICA SGI */}
                  <div className="pt-2">
                    <a
                      href="/docs/Politica_del_Sistema_de_Gestion_Integral_.pdf"
                      download="Politica_del_Sistema_de_Gestion_Integral_.pdf"
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-[#f8fafd] border border-[#dadce0] hover:border-[#1a73e8] text-[#202124] font-medium transition cursor-pointer group text-left"
                    >
                      <span className="text-xs">DESCARGAR DOCUMENTO COMPLETO POLITICA-SGI (PDF)</span>
                      <span className="text-xs text-[#1a73e8] font-bold group-hover:underline flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                        (Descarga aquí)
                      </span>
                    </a>
                  </div>
                </>
              )}
            </div>

            {/* PIE DEL MODAL */}
            <div className="p-4 border-t border-[#dadce0] bg-[#f8fafd] flex justify-end">
              <button
                type="button"
                onClick={() => setModalContenido(null)}
                className="px-5 py-2 bg-[#0b57d0] hover:bg-[#0842a0] text-white font-bold text-xs rounded-full transition cursor-pointer shadow-xs"
              >
                Entendido
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
    </svg>
  )
}