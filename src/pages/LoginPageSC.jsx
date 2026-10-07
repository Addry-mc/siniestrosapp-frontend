import { useState } from "react"
import { useAuth } from "../context/AuthContext"

export default function LoginPage() {
    const { login } = useAuth()
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

    return (
        <div className="min-h-screen w-full flex flex-col justify-between items-center px-4 py-8 sm:px-6 md:px-8 text-slate-100 antialiased selection:bg-[#00E59B] selection:text-black relative overflow-x-hidden">

            {/* Fondo de iluminación ambiental (Stitch Ambient Lighting) */}
            <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-0 overflow-hidden -z-10"
                style={{
                    backgroundColor: '#090a0f',
                    backgroundImage: `
                        radial-gradient(circle at 18% 18%, rgba(126, 34, 206, 0.22) 0%, transparent 45%),
                        radial-gradient(circle at 82% 16%, rgba(255, 46, 77, 0.16) 0%, transparent 42%),
                        radial-gradient(circle at 50% 60%, rgba(14, 165, 233, 0.08) 0%, transparent 55%),
                        radial-gradient(circle at 75% 88%, rgba(0, 229, 155, 0.14) 0%, transparent 48%)
                    `,
                    backgroundAttachment: 'fixed'
                }}
            >
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-purple-700/20 via-[#FF2E4D]/10 to-transparent blur-3xl opacity-70" />
            </div>

            {/* Espaciador superior */}
            <div className="hidden sm:block w-full max-w-5xl h-4" />

            {/* CONTENEDOR PRINCIPAL DEL LOGIN */}
            <main className="w-full max-w-[440px] mx-auto flex flex-col items-center my-auto z-10">

                {/* BRAND HEADER */}
                <header className="w-full flex flex-col items-center mb-6 sm:mb-8 text-center">
                    <div className="flex items-center justify-center space-x-1.5">
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase font-sans">
                            SINESTRY<span className="inline-block w-2.5 h-2.5 ml-1 rounded-full bg-[#FF2E4D] shadow-[0_0_10px_#FF2E4D]" />
                        </h1>
                        <span className="text-[11px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#FF2E4D]/25 to-[#7E22CE]/40 border border-[#FF2E4D]/35 text-rose-300 tracking-wider">
                            APP
                        </span>
                    </div>
                </header>

                {/* TARJETA DE AUTENTICACIÓN (GLASSMORPHISM) */}
                <section className="w-full bg-[#161824]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.08)]">

                    <div className="text-center mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                            Inicia sesión
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1">
                            Ingresa con tu cuenta institucional
                        </p>
                    </div>

                    {/* ALERTA DE ERROR */}
                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs text-center flex items-center justify-center gap-2">
                            <span>⚠️ {error}</span>
                        </div>
                    )}

                    {/* FORMULARIO ÚNICO DE ACCESO */}
                    <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
                        {/* CAMPO CORREO */}
                        <div className="space-y-1.5">
                            <label className="block text-[11px] font-bold tracking-wider text-slate-400 uppercase" htmlFor="email">
                                Correo Institucional
                            </label>
                            <div className="relative rounded-xl bg-[#0f1118] border border-white/10 focus-within:border-[#00e59b]/60 focus-within:ring-2 focus-within:ring-[#00e59b]/20 transition duration-150">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                    <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
                                    className="w-full bg-transparent pl-10 sm:pl-11 pr-3.5 py-3 sm:py-3.5 text-sm sm:text-base text-slate-100 placeholder:text-slate-600 focus:outline-none border-none rounded-xl font-medium"
                                />
                            </div>
                        </div>

                        {/* CAMPO CONTRASEÑA */}
                        <div className="space-y-1.5">
                            <label className="block text-[11px] font-bold tracking-wider text-slate-400 uppercase" htmlFor="password">
                                Contraseña
                            </label>
                            <div className="relative rounded-xl bg-[#0f1118] border border-white/10 focus-within:border-[#00e59b]/60 focus-within:ring-2 focus-within:ring-[#00e59b]/20 transition duration-150">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                                    <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
                                    className="w-full bg-transparent pl-10 sm:pl-11 pr-11 py-3 sm:py-3.5 text-sm sm:text-base text-slate-100 placeholder:text-slate-600 focus:outline-none border-none rounded-xl font-medium tracking-widest"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={`absolute inset-y-0 right-0 pr-3.5 flex items-center transition-colors ${showPassword ? 'text-[#00e59b]' : 'text-slate-500 hover:text-slate-300'}`}
                                    aria-label="Mostrar u ocultar contraseña"
                                >
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
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
                                    className="w-4 h-4 rounded bg-[#0f1118] border-white/20 text-[#00e59b] focus:ring-0 focus:ring-offset-0 focus:outline-none cursor-pointer group-hover:border-white/40 transition"
                                />
                                <span className="text-slate-400 group-hover:text-slate-300 transition-colors text-xs sm:text-[13px]">Recordarme</span>
                            </label>
                            <a href="#" className="text-xs sm:text-[13px] text-slate-400 hover:text-[#00e59b] transition-colors duration-150 font-medium">
                                ¿Olvidaste tu clave?
                            </a>
                        </div>

                        {/* BOTÓN SUBMIT */}
                        <div className="pt-3">
                            <button
                                type="submit"
                                disabled={busy}
                                className="w-full py-3.5 sm:py-4 px-4 bg-[#00e59b] hover:bg-[#00f7a7] active:scale-[0.985] text-[#051a12] font-extrabold text-sm sm:text-base rounded-xl shadow-[0_0_25px_-2px_rgba(0,229,155,0.45)] flex items-center justify-center space-x-2 transition-all duration-200 group cursor-pointer disabled:opacity-60"
                            >
                                {busy ? (
                                    <div className="flex items-center space-x-2">
                                        <span className="inline-block w-4 h-4 border-2 border-[#051a12]/30 border-t-[#051a12] rounded-full animate-spin" />
                                        <span>Entrando…</span>
                                    </div>
                                ) : (
                                    <>
                                        <span>Iniciar sesión</span>
                                        <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24">
                                            <line x1="5" x2="19" y1="12" y2="12" />
                                            <polyline points="12 5 19 12 12 19" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {/* FOOTER INTERNO DE LA TARJETA */}
                    <div className="mt-7 pt-5 border-t border-white/5 flex flex-col items-center justify-center text-center gap-2">
                        <div className="flex items-center space-x-2 text-xs text-slate-300 font-medium">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] sm:text-[11px] font-extrabold bg-gradient-to-r from-[#FF2E4D] to-purple-600 text-white tracking-wider shadow-sm">
                                10 AÑOS
                            </span>
                            <span className="tracking-wide text-slate-300 font-semibold">CONTIGO</span>
                        </div>
                        <div className="flex items-center text-xs text-slate-500 gap-1.5 mt-0.5">
                            <svg className="w-3.5 h-3.5 text-emerald-400 inline shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
                <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-400">
                    <button
                        type="button"
                        onClick={() => setModalContenido('privacidad')}
                        className="hover:text-white transition cursor-pointer underline"
                    >
                        Aviso de Privacidad
                    </button>
                    <span className="text-slate-600">|</span>
                    <button
                        type="button"
                        onClick={() => setModalContenido('sgi')}
                        className="hover:text-white transition cursor-pointer underline"
                    >
                        Política SGI
                    </button>
                </div>

                <a
                    href="https://www.sinestry.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm font-semibold tracking-widest text-slate-400 hover:text-white transition duration-150 inline-block uppercase"
                >
                    WWW.SINESTRY.COM
                </a>
                <p className="text-[11px] sm:text-xs text-slate-600">
                    © 2026 Sinestry Technologies. Todos los derechos reservados.
                </p>
            </footer>

            {/* MODAL DESPLEGABLE DE PRIVACIDAD O POLÍTICA SGI */}
            {modalContenido && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-[#141722] border border-white/10 rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl text-left overflow-hidden">

                        {/* ENCABEZADO DEL MODAL */}
                        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#1b1f2e]">
                            <h3 className="text-base sm:text-lg font-bold text-white">
                                {modalContenido === 'privacidad' ? 'Aviso de Privacidad' : 'Política del Sistema de Gestión Integral (SGI)'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setModalContenido(null)}
                                className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 cursor-pointer transition"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <line x1="18" x2="6" y1="6" y2="18" />
                                    <line x1="6" x2="18" y1="6" y2="18" />
                                </svg>
                            </button>
                        </div>

                        {/* CUERPO DEL MODAL */}
                        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
                            {modalContenido === 'privacidad' ? (
                                <>
                                    <p className="font-bold text-white text-sm border-b border-white/10 pb-2">
                                        Aviso de Privacidad
                                    </p>
                                    <p>
                                        <strong>FYF Asesores, S.A. de C.V.</strong>, con domicilio en Insurgentes Sur 1431, Piso 10, Col. Insurgentes Mixcoac, Alcaldía Benito Juárez, Ciudad de México, C.P. 03920 (en lo sucesivo “FYF”), para nosotros, la privacidad y el manejo de la información que usted nos proporciona son de suma importancia. Por ello, protegemos sus datos personales en estricto apego a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (en lo sucesivo “LA LEY”) y demás disposiciones aplicables.
                                    </p>
                                    <p>
                                        Los datos personales, incluyendo aquellos sensibles, de identificación, patrimoniales o financieros, recabados o que se recaben en el futuro, por motivo de la relación jurídica y/o comercial entre usted(es) y FYF, serán utilizados para los siguientes fines:
                                    </p>
                                    <ul className="list-disc pl-5 space-y-1 text-slate-300">
                                        <li>La realización de todas y cada una de las operaciones y la prestación de los servicios de FYF.</li>
                                        <li>La identificación, operación, administración, análisis, ofrecimiento y promoción de bienes, productos y servicios y/o prospección comercial.</li>
                                        <li>La atención de requerimientos de cualquier autoridad competente.</li>
                                        <li>Actividades complementarias que se requieran para la ejecución de los incisos arriba descritos.</li>
                                    </ul>
                                    <p>
                                        Asimismo, hacemos de su conocimiento que cuenta con un plazo de cinco días hábiles para que, de ser el caso, manifieste su negativa para el tratamiento de sus datos personales para aquellas finalidades que no son necesarias ni hayan dado origen a la relación jurídica con FYF. Usted puede revocar en cualquier momento su consentimiento al tratamiento de sus datos personales a través del correo electrónico <a href="mailto:privacidad@fyfasesores.mx" className="text-[#00e59b] underline">privacidad@fyfasesores.mx</a> o en el domicilio referido en párrafos anteriores.
                                    </p>
                                    <p>
                                        Se hace del conocimiento de usted(es) que FYF utiliza mecanismos en medios remotos o locales de comunicación electrónica, óptica y otras tecnologías para el resguardo de datos personales. En caso de vulneración de seguridad de derechos patrimoniales o morales, serán informados de manera inmediata; sin embargo, el uso de “cookies” no manipula ni recaba datos personales.
                                    </p>
                                    <p>
                                        Le informamos que el presente Aviso de Privacidad Integral está disponible en todo momento a través de nuestro portal de Internet:
                                    </p>
                                    <p className="p-2 bg-[#0f1118] rounded-xl border border-white/10 text-center font-mono text-xs">
                                        <a href="https://fyfasesores.mx/avisodeprivacidad/" target="_blank" rel="noopener noreferrer" className="text-[#00e59b] hover:underline">
                                            https://fyfasesores.mx/avisodeprivacidad/
                                        </a>
                                    </p>

                                    {/* INSTRUCCIONES Y DESCARGA DIRECTA DE FORMATOS OFICIALES PDF */}
                                    <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
                                        <h5 className="font-bold text-white text-xs uppercase tracking-wider">
                                            INSTRUCCIONES:
                                        </h5>
                                        <ol className="list-decimal pl-5 space-y-1 text-slate-300 text-xs">
                                            <li>Seleccione y descargue el formato del cual desea hacer su solicitud.</li>
                                            <li>Llene los campos solicitados de manera digital o a mano con letra legible y de molde.</li>
                                            <li>Firme autógrafamente el formato previamente requisitado.</li>
                                            <li>Envíe por correo electrónico el formato firmado con copia de su identificación oficial vigente, así como el documento probatorio que se requiera en su caso.</li>
                                        </ol>

                                        <div className="space-y-2 pt-2">
                                            <a
                                                href="/docs/20251020-FYF-FORMATO-DE-TRANSFERENCIA-DE-DATOS-PERSONALES.pdf"
                                                download="20251020-FYF-FORMATO-DE-TRANSFERENCIA-DE-DATOS-PERSONALES.pdf"
                                                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#1b1f2e] border border-white/10 hover:border-[#00e59b]/50 text-white font-medium transition cursor-pointer group text-left"
                                            >
                                                <span className="text-xs">FORMATO PARA CONSENTIR LA TRANSFERENCIA DE DATOS PERSONALES</span>
                                                <span className="text-xs text-[#00e59b] font-bold group-hover:underline flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                                                    (Descarga aquí)
                                                </span>
                                            </a>

                                            <a
                                                href="/docs/20251020-FYF-FORMATO-DERECHOS-ARCO.pdf"
                                                download="20251020-FYF-FORMATO-DERECHOS-ARCO.pdf"
                                                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#1b1f2e] border border-white/10 hover:border-[#00e59b]/50 text-white font-medium transition cursor-pointer group text-left"
                                            >
                                                <span className="text-xs">FORMATO PARA EJERCER LOS DERECHOS ARCOS</span>
                                                <span className="text-xs text-[#00e59b] font-bold group-hover:underline flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                                                    (Descarga aquí)
                                                </span>
                                            </a>

                                            <a
                                                href="/docs/20251020-FYF-FORMATO-DE-NEGATIVA-1.pdf"
                                                download="20251020-FYF-FORMATO-DE-NEGATIVA-1.pdf"
                                                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#1b1f2e] border border-white/10 hover:border-[#00e59b]/50 text-white font-medium transition cursor-pointer group text-left"
                                            >
                                                <span className="text-xs">FORMATO PARA MANIFESTAR LA NEGATIVA DE TRATAMIENTO DE DATOS PERSONALES</span>
                                                <span className="text-xs text-[#00e59b] font-bold group-hover:underline flex items-center gap-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                                                    (Descarga aquí)
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="font-bold text-white text-sm border-b border-white/10 pb-2">
                                        Política del Sistema de Gestión Integral (SGI)
                                    </p>
                                    <p>
                                        <strong className="text-white">FYF Asesores S.A. de C.V.</strong> desarrolló el sistema <strong className="text-white">SINESTRY</strong> para la prestación de servicios especializados de terciarización de la gestión integral de cuentas de seguro que, por sus requerimientos técnicos, volumen de siniestros, especialización o que por sus características específicas, requieran un manejo separado de la operación rutinaria. Con este sistema brindamos apoyo y orientación a lo largo de todo el proceso, a fin de fortalecer el área de siniestros, comercial y de recuperación de reaseguro, sin interferir o comprometer la operación cotidiana del cliente.
                                    </p>
                                    <p>
                                        Para fortalecer a SINESTRY, la dirección de FYF Asesores S.A. de C.V., comprometida con la satisfacción de sus clientes y la protección de la información, ha decidido implantar un “Sistema de Gestión Integral”, en adelante (SGI), basado en las normas <strong className="text-white">ISO 9001 e ISO 27001</strong>.
                                    </p>
                                    <p>
                                        Nuestro objetivo es garantizar que los servicios que prestamos a nuestros clientes estén organizados en torno a pilares básicos como la calidad de los mismos, la satisfacción del cliente, así como la seguridad de la información, a fin de garantizar la continuidad del negocio, minimizar los potenciales daños, maximizar el retorno de las inversiones y las oportunidades de negocio, todo dentro de una mejora continua.
                                    </p>

                                    <h4 className="font-bold text-white pt-2 text-xs uppercase tracking-wider">
                                        Esta política se basa en los siguientes principios:
                                    </h4>
                                    <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                                        <li>Establecer que la calidad y la seguridad de la información, así como su mejora, son responsabilidad de todos los integrantes de la empresa, empezando desde la alta dirección.</li>
                                        <li>Dejar por sentado que la calidad y seguridad de la información se obtienen planificando, ejecutando, revisando y mejorando el SGI, teniendo presente en todo momento el contexto de la organización, tanto interno como externo.</li>
                                        <li>Establecer y revisar regularmente objetivos y metas acordes con los compromisos asumidos en esta declaración. Para la aplicación efectiva de estos principios, es necesario el apoyo del equipo directivo y colaboradores.</li>
                                        <li>Orientar la calidad hacia la satisfacción de todos nuestros clientes (y partes interesadas), mediante el compromiso de toda la organización en cumplir con sus necesidades, requisitos legales y los propios de los servicios.</li>
                                        <li>Mantener un enfoque hacia la mejora continua, tanto de los procesos productivos como de la eficacia del SGI, en el que prevenir los errores sea un aspecto fundamental.</li>
                                        <li>Fijar el compromiso de la organización a homologar y reevaluar periódicamente a nuestros proveedores bajo nuestros criterios de certificación.</li>
                                        <li>Identificar los riesgos de la organización, de tal manera que establezcamos un enfoque preventivo.</li>
                                        <li>Prestar la máxima atención a la evolución tecnológica y a las posibles mejoras que las nuevas tecnologías ofrezcan.</li>
                                        <li>Difundir a todo el personal de la empresa esta política para su conocimiento y comprensión, puesto que es fundamental la participación y compromiso de todos los colaboradores.</li>
                                        <li>Proteger los datos e información confidencial y sensible de los colaboradores, clientes, proveedores y partes interesadas.</li>
                                        <li>Salvaguardar los registros de la organización y proteger los derechos de propiedad intelectual.</li>
                                        <li>Asignar responsabilidades de seguridad y formar/capacitar para la calidad y seguridad de la información.</li>
                                        <li>Llevar un registro de las incidencias de seguridad y gestionar la continuidad del negocio.</li>
                                        <li>Gestionar los cambios que pudieran darse en la empresa, tanto en aspectos de calidad como relativos a la seguridad.</li>
                                    </ul>

                                    <h4 className="font-bold text-white pt-3 text-xs uppercase tracking-wider">
                                        La Dirección de FYF Asesores S.A. de C.V. adquiere los siguientes compromisos:
                                    </h4>
                                    <ul className="list-disc pl-5 space-y-1 text-slate-300">
                                        <li>Brindar servicios conforme a la normatividad aplicable a las líneas de negocio desarrolladas por la organización e incluidas en el alcance del SGI.</li>
                                        <li>Establecer y dar cumplimiento a los requisitos contractuales con las partes interesadas.</li>
                                        <li>Definir los requisitos de formación en calidad y seguridad, proporcionando planes de capacitación a las partes interesadas.</li>
                                        <li>Desarrollar políticas específicas y establecer acuerdos contractuales con organizaciones especializadas para prevenir y detectar virus y otro software malicioso.</li>
                                        <li>Gestionar la continuidad del negocio, desarrollando planes conforme a las metodologías de prestigio internacional.</li>
                                        <li>Establecer consecuencias de las violaciones de la política de seguridad, las cuales serán reflejadas en los contratos firmados con las partes interesadas, proveedores y subcontratistas.</li>
                                        <li>Actuar en todo momento dentro de la más estricta ética profesional.</li>
                                    </ul>

                                    <div className="mt-4 p-3 bg-[#0f1118] rounded-xl border border-white/10 space-y-1 text-center text-xs">
                                        <p className="font-mono text-[#8a99ad]">POL-DL-01 “Política del Sistema de Gestión Integral”</p>
                                        <p className="font-mono text-[#8a99ad]">Rev. 00, 30/01/2024 · Público</p>
                                        <div className="pt-2 font-bold text-white">
                                            <p>Alta Dirección: Pedro Vergara</p>
                                            <p className="text-[11px] font-normal text-slate-400">Ciudad de México, 30 de enero de 2024.</p>
                                        </div>
                                    </div>

                                    {/* ENLACE DIRECTO PARA DESCARGAR EL PDF REAL DE LA POLÍTICA SGI */}
                                    <div className="pt-2">
                                        <a
                                            href="/docs/Politica_del_Sistema_de_Gestion_Integral_.pdf"
                                            download="Politica_del_Sistema_de_Gestion_Integral_.pdf"
                                            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#1b1f2e] border border-white/10 hover:border-[#00e59b]/50 text-white font-medium transition cursor-pointer group text-left"
                                        >
                                            <span className="text-xs">DESCARGAR DOCUMENTO COMPLETO POLITICA-SGI (PDF)</span>
                                            <span className="text-xs text-[#00e59b] font-bold group-hover:underline flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                                                (Descarga aquí)
                                            </span>
                                        </a>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* PIE DEL MODAL */}
                        <div className="p-4 border-t border-white/10 bg-[#1b1f2e] flex justify-end">
                            <button
                                type="button"
                                onClick={() => setModalContenido(null)}
                                className="px-5 py-2 bg-[#00e59b] hover:bg-[#00f7a7] text-[#051a12] font-extrabold text-xs rounded-xl transition cursor-pointer shadow-md"
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