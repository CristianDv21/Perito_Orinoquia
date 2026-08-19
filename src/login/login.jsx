import { useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../useAuth';
import api from '../api/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const mostrarErrorLogin = (error) => {
    const status = error.response?.status;
    const data = error.response?.data;

    if (status === 403 && data?.error === 'Este usuario se encuentra inactivo.') {
      Swal.fire({
        icon: 'warning',
        title: 'Usuario inactivo',
        text: 'Este usuario se encuentra inactivo. Contacta al administrador para obtener acceso.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#06b6d4',
        background: '#060e1e',
        color: '#e2e8f0',
        customClass: {
          popup: 'rounded-2xl border border-slate-700',
          title: 'text-white',
          confirmButton: 'rounded-xl px-6 py-3 font-bold'
        }
      });
      return;
    }

    if (status === 422) {
      Swal.fire({
        icon: 'error',
        title: 'Datos incorrectos',
        text: data?.message || 'Verifica el correo y la contraseña ingresados.',
        confirmButtonText: 'Intentar nuevamente',
        confirmButtonColor: '#06b6d4',
        background: '#060e1e',
        color: '#e2e8f0',
        customClass: {
          popup: 'rounded-2xl border border-slate-700',
          title: 'text-white',
          confirmButton: 'rounded-xl px-6 py-3 font-bold'
        }
      });
      return;
    }

    if (status === 401) {
      Swal.fire({
        icon: 'error',
        title: 'Inicio de sesión rechazado',
        text: 'El correo o la contraseña son incorrectos.',
        confirmButtonText: 'Intentar nuevamente',
        confirmButtonColor: '#06b6d4',
        background: '#060e1e',
        color: '#e2e8f0',
        customClass: {
          popup: 'rounded-2xl border border-slate-700',
          title: 'text-white',
          confirmButton: 'rounded-xl px-6 py-3 font-bold'
        }
      });
      return;
    }

    if (!error.response) {
      Swal.fire({
        icon: 'error',
        title: 'Sin conexión',
        text: 'No fue posible comunicarse con el servidor. Verifica tu conexión e inténtalo nuevamente.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#06b6d4',
        background: '#060e1e',
        color: '#e2e8f0',
        customClass: {
          popup: 'rounded-2xl border border-slate-700',
          title: 'text-white',
          confirmButton: 'rounded-xl px-6 py-3 font-bold'
        }
      });
      return;
    }

    Swal.fire({
      icon: 'error',
      title: 'No fue posible ingresar',
      text:
        data?.message ||
        data?.error ||
        'Ocurrió un error al intentar iniciar sesión.',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#06b6d4',
      background: '#060e1e',
      color: '#e2e8f0',
      customClass: {
        popup: 'rounded-2xl border border-slate-700',
        title: 'text-white',
        confirmButton: 'rounded-xl px-6 py-3 font-bold'
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!email.trim() || !password.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Ingresa tu correo electrónico y contraseña para continuar.',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#06b6d4',
        background: '#060e1e',
        color: '#e2e8f0',
        customClass: {
          popup: 'rounded-2xl border border-slate-700',
          title: 'text-white',
          confirmButton: 'rounded-xl px-6 py-3 font-bold'
        }
      });
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('login', {
        email,
        password
      });

      const token =
        response.data?.token ||
        response.data?.access_token;

      const userData = response.data?.usuario;

      if (!token || !userData) {
        throw new Error(
          'La respuesta del servidor no contiene los datos de autenticación.'
        );
      }

      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      if (rememberMe) {
        localStorage.setItem('remember_me', 'true');
      } else {
        localStorage.removeItem('remember_me');
      }

      login(userData, token);
    } catch (error) {
      console.error(
        'Error al iniciar sesión:',
        error.response?.data || error
      );

      setLoading(false);
      mostrarErrorLogin(error);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#020813]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(6,182,212,0.12),transparent_35%),radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.10),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.08),transparent_30%)]" />

        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(56,189,248,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.8)_1px,transparent_1px)] [background-size:50px_50px]" />

        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-blue-700/10 blur-[120px]" />

        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative flex h-32 w-32 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full border border-cyan-400/10" />

            <div className="absolute inset-2 rounded-full border border-blue-500/20" />

            <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-r-cyan-400 border-t-blue-500" />

            <div className="absolute inset-4 rounded-full border border-cyan-400/10" />

            <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-400/30 bg-[#060e1e] text-cyan-400 shadow-[0_0_40px_rgba(6,182,212,0.2)]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-11 w-11 animate-pulse"
              >
                <path d="m14.7 6.3 3 3" />
                <path d="m10.3 17.7-3-3" />
                <path d="M15.5 4.5a4.24 4.24 0 0 0-6 6l-5 5a2.12 2.12 0 0 0 3 3l5-5a4.24 4.24 0 0 0 6-6l-2.5 2.5-3-3z" />
                <path d="m18 2 4 4" />
              </svg>
            </div>
          </div>

          <h1 className="mt-8 text-2xl font-black tracking-wide text-white">
            SERVI CENTRO <span className="text-cyan-400">CDA</span>
          </h1>

          <div className="mt-3 flex items-center gap-3">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-cyan-400" />

            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />

              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
                Preparando perfil
              </span>

              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
            </div>

            <span className="h-px w-8 bg-gradient-to-l from-transparent to-cyan-400" />
          </div>

          <div className="mt-7 h-1 w-52 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-1/2 animate-[loading_1.4s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.5)]" />
          </div>

          <p className="mt-5 text-[9px] font-medium uppercase tracking-[0.2em] text-slate-600">
            Cargando información del usuario
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#020813] px-4 py-12 font-sans selection:bg-cyan-500 selection:text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.18),transparent_32%),radial-gradient(circle_at_80%_80%,rgba(6,182,212,0.16),transparent_32%),radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.05),transparent_45%)]" />

      <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(56,189,248,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(56,189,248,0.8)_1px,transparent_1px)] [background-size:55px_55px]" />

      <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-blue-700/20 blur-[120px]" />

      <div className="absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-cyan-500/20 blur-[120px]" />

      <div className="absolute left-[8%] top-[18%] h-2 w-2 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_18px_5px_rgba(34,211,238,0.35)]" />

      <div className="absolute right-[12%] top-[28%] h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400 shadow-[0_0_15px_4px_rgba(59,130,246,0.35)]" />

      <div className="absolute bottom-[22%] left-[16%] h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_15px_4px_rgba(34,211,238,0.3)]" />

      <div className="absolute bottom-[15%] right-[18%] h-2 w-2 animate-pulse rounded-full bg-blue-400 shadow-[0_0_18px_5px_rgba(59,130,246,0.3)]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="absolute -inset-[1px] rounded-[26px] bg-gradient-to-r from-blue-600/40 via-cyan-400/30 to-blue-600/40 opacity-80" />

        <div className="relative overflow-hidden rounded-[24px] border border-slate-700/70 bg-[#060e1e]/95 p-8 shadow-[0_25px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl">
          <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />

          <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />

          <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-blue-600/10 blur-3xl" />

          <div className="relative flex flex-col items-center text-center">
            <div className="relative">
              <div className="absolute -inset-3 rounded-2xl bg-cyan-400/10 blur-xl" />

              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/30 bg-gradient-to-br from-blue-600/20 to-cyan-400/10 text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.18)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-8 w-8"
                >
                  <path d="M3 17l2-5h14l2 5" />
                  <path d="M5 12l2-5h10l2 5" />
                  <path d="M5 17h.01" />
                  <path d="M19 17h.01" />
                  <path d="M6 17v2" />
                  <path d="M18 17v2" />
                </svg>
              </div>
            </div>

            <h1 className="mt-6 text-3xl font-black tracking-tight text-white">
              Servi Centro{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                CDA
              </span>
            </h1>

            <div className="mt-3 flex items-center gap-2">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-cyan-400/70" />

              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400/80">
                Centro de Diagnóstico Automotor
              </p>

              <span className="h-px w-8 bg-gradient-to-l from-transparent to-cyan-400/70" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="relative mt-9 space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-widest text-slate-300"
              >
                Correo Electrónico
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>

                <input
                  id="email"
                  type="email"
                  required
                  placeholder="usuario@servicentro.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-[#030914] py-3.5 pl-11 pr-4 text-sm text-slate-200 outline-none transition-all duration-200 placeholder:text-slate-600 focus:border-cyan-500/60 focus:bg-[#040c1a] focus:ring-2 focus:ring-cyan-500/10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-bold uppercase tracking-widest text-slate-300"
                >
                  Contraseña
                </label>

                <a
                  href="#forgot"
                  className="text-[11px] font-semibold text-cyan-400 transition-colors hover:text-cyan-300 hover:underline"
                >
                  ¿La olvidaste?
                </a>
              </div>

              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>

                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-[#030914] py-3.5 pl-11 pr-12 text-sm text-slate-200 outline-none transition-all duration-200 placeholder:text-slate-700 focus:border-cyan-500/60 focus:bg-[#040c1a] focus:ring-2 focus:ring-cyan-500/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-cyan-400 focus:outline-none"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                      <line x1="2" y1="2" x2="22" y2="22" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 cursor-pointer rounded border-slate-800 bg-[#030914] text-cyan-500 focus:ring-0 focus:ring-offset-0"
              />

              <label
                htmlFor="remember-me"
                className="ml-2 cursor-pointer select-none text-xs text-slate-400 transition-colors hover:text-slate-300"
              >
                Mantener sesión activa
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full cursor-pointer overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-[0_0_25px_rgba(59,130,246,0.28)] transition-all duration-300 hover:scale-[1.01] hover:brightness-110 active:scale-[0.99] active:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

              <span className="relative flex items-center justify-center gap-2">
                Ingresar al Sistema

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </span>
            </button>
          </form>

          <div className="relative mt-8 flex items-center justify-center gap-3">
            <span className="h-px flex-1 bg-slate-800" />

            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
              Sistema Seguro
            </span>

            <span className="h-px flex-1 bg-slate-800" />
          </div>

          <p className="mt-5 text-center text-[10px] tracking-wider text-slate-600">
            Plataforma de Gestión e Inspección Vehicular
          </p>
        </div>
      </div>

      <style>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
      `}</style>
    </div>
  );
}