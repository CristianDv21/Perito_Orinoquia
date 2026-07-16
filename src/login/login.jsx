import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password, rememberMe });
    // Aquí puedes manejar la lógica de tu API de autenticación
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#020813] px-4 py-12 font-sans selection:bg-cyan-500 selection:text-white">
      {/* Efectos de luces de fondo (Glows) */}
      <div className="absolute top-1/4 left-10 h-72 w-72 rounded-full bg-blue-900/10 blur-[120px]" />
      <div className="absolute bottom-1/4 right-10 h-72 w-72 rounded-full bg-cyan-900/10 blur-[120px]" />

      {/* Tarjeta de Login */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-slate-800/80 bg-[#060e1e]/90 p-8 shadow-2xl backdrop-blur-md">
        
        {/* Header / Logo */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            {/* SVG Nativo (Icono de Fuego) */}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-7 w-7"
            >
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
          </div>
          
          <h1 className="mt-6 text-2xl font-black tracking-wide text-white uppercase">
            Perito <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Orinoquia</span>
          </h1>
          
          <p className="mt-1 text-xs font-medium text-slate-400 uppercase tracking-wider">
            Plataforma de Control e Inspección Vehicular
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          
          {/* Email */}
          <div className="space-y-2">
            <label 
              htmlFor="email" 
              className="block text-xs font-bold text-slate-300 uppercase tracking-widest"
            >
              Correo del Perito / Inspector
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="usuario@perito.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-[#030914] px-4 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all duration-200 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 focus:bg-[#040c1a]"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label 
                htmlFor="password" 
                className="block text-xs font-bold text-slate-300 uppercase tracking-widest"
              >
                Contraseña de Acceso
              </label>
              <a 
                href="#forgot" 
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
              >
                ¿La olvidaste?
              </a>
            </div>
            <input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-[#030914] px-4 py-3 text-sm text-slate-200 placeholder-slate-700 outline-none transition-all duration-200 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 focus:bg-[#040c1a]"
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-slate-800 bg-[#030914] text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <label 
              htmlFor="remember-me" 
              className="ml-2 select-none text-xs text-slate-400 cursor-pointer hover:text-slate-300 transition-colors"
            >
              Mantener sesión activa
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300 hover:scale-[1.01] hover:brightness-110 active:scale-[0.99] active:brightness-95"
          >
            Iniciar Diagnóstico
          </button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-[10px] text-slate-500 tracking-wider">
          Soporte Técnico de Peritajes v1.0
        </p>
      </div>
    </div>
  );
}