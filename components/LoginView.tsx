import React, { useState, useEffect } from 'react';

import { Button } from './common/Button';
import { Icon } from './common/Icon';
import { User } from '../types';
import { Modal } from './common/Modal';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');

  const [recoveryMessage, setRecoveryMessage] = useState<string | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);

  // Sign Up State
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToBottom = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Sign Up Logic
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await sendEmailVerification(user);

        // Create user profile in Firestore
        // Using email as ID for consistency with existing admin panel logic
        await setDoc(doc(db, 'users', email), {
          name: name,
          email: email,
          role: 'member',
          nito: `NITO-${Date.now().toString().slice(-6)}`, // Temporary simple NITO generation
          createdAt: new Date().toISOString()
        });

        setVerificationSent(true);
        setIsSignUp(false); // Switch back to login view or stay to show message?
        // Let's stay in current view but show success message replacing form or above it.
      } else {
        // Login Logic
        await signInWithEmailAndPassword(auth, email, password);

        // Fetch user data from Firestore
        const userDocRef = doc(db, 'users', email);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          onLoginSuccess(userData);
        } else {
          setError('No se encontró el perfil de usuario. Contacta al administrador.');
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      if (isSignUp) {
        if (err.code === 'auth/email-already-in-use') {
          setError('Este correo ya está registrado.');
        } else if (err.code === 'auth/weak-password') {
          setError('La contraseña es muy débil (mínimo 6 caracteres).');
        } else {
          setError('Error al registrarse: ' + err.message);
        }
      } else {
        if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
          setError('Correo o contraseña incorrectos. Inténtalo de nuevo.');
        } else {
          setError('Ocurrió un error al iniciar sesión. Por favor intenta más tarde.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryMessage(null);
    setIsRecovering(true);

    try {
      await sendPasswordResetEmail(auth, recoveryEmail);
      setRecoveryMessage(`Si existe una cuenta para ${recoveryEmail}, se ha enviado un enlace para restablecer la contraseña.`);
    } catch (error: any) {
      console.error("Password reset error:", error);
      // Security: don't reveal if email exists or not, or handle specific errors if needed
      setRecoveryMessage(`Si existe una cuenta para ${recoveryEmail}, se ha enviado un enlace para restablecer la contraseña.`);
    } finally {
      setIsRecovering(false);
    }
  };

  const openForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(true);
    setRecoveryEmail('');
    setRecoveryMessage(null);
    setError(null);
  };

  const closeForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(false);
  };


  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4 font-sans bg-slate-900 relative overflow-hidden">

        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px]"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        </div>

        <div className="max-w-md w-full relative z-10 animate-in fade-in zoom-in-95 duration-500">
          <div className="text-center mb-10 flex flex-col items-center">
            <div className="p-4 bg-white/5 rounded-3xl backdrop-blur-md border border-white/10 mb-6 shadow-2xl">
              <img
                src="/images/torus-logo-white.png"
                alt="Torus AC"
                className="h-16 w-auto object-contain drop-shadow-md"
              />
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Bienvenido a la Comunidad</h2>
            <p className="text-slate-400 mt-2 text-sm font-light">Accede a tu panel de control NITO</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
            {/* Glossy sheen */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none"></div>

            {verificationSent ? (
              <div className="text-center relative z-10">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
                  <Icon name="check" className="text-emerald-400 w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">¡Cuenta Creada!</h3>
                <p className="text-slate-300 mb-8 leading-relaxed">Hemos enviado un correo de verificación a <strong className="text-emerald-400">{email}</strong>. Por favor revisa tu bandeja de entrada.</p>
                <Button onClick={() => { setVerificationSent(false); setIsSignUp(false); }} className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/30 transition-all">
                  Volver al Inicio
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                {isSignUp && (
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">
                      Nombre Completo
                    </label>
                    <div className="relative">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required={isSignUp}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full px-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        placeholder="Tu Nombre"
                      />
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">
                    Correo Electrónico
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="tu@correo.com"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-xs font-bold text-slate-300 uppercase tracking-wider ml-1">
                    Contraseña
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={openForgotPasswordModal}
                    className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm flex items-center gap-3">
                    <Icon name="alert-circle" className="w-5 h-5 text-red-400 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <div>
                  <Button type="submit" size="lg" className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transform hover:-translate-y-1 transition-all duration-200" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Icon name="spinner" className="animate-spin w-5 h-5" />
                        Procesando...
                      </span>
                    ) : (isSignUp ? 'Crear Cuenta' : 'Iniciar Sesión')}
                  </Button>
                </div>

                <div className="text-center pt-2">
                  <p className="text-slate-400 text-sm">
                    {isSignUp ? "¿Ya tienes cuenta?" : "¿Aún no eres miembro?"}{' '}
                    <button
                      type="button"
                      onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
                      className="text-white hover:text-emerald-400 font-bold transition-colors ml-1"
                    >
                      {isSignUp ? "Inicia Sesión" : "Regístrate"}
                    </button>
                  </p>
                </div>
              </form>
            )}
          </div>

          <div className="mt-8 text-center flex flex-col items-center gap-4">
            {/* Redes Sociales */}
            <div className="flex justify-center gap-5 text-slate-400">
              <a href="https://www.instagram.com/torus_ac/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors relative group" title="Instagram">
                <Icon name="instagram" className="w-5 h-5" />
                <span className="absolute bottom-[120%] left-1/2 -translate-x-1/2 mb-1 w-max px-2 py-1 bg-slate-800 text-white text-[10px] font-bold uppercase rounded opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none drop-shadow-md">Instagram</span>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61552677463025&sk=about" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors relative group" title="Facebook">
                <Icon name="facebook" className="w-5 h-5" />
                <span className="absolute bottom-[120%] left-1/2 -translate-x-1/2 mb-1 w-max px-2 py-1 bg-slate-800 text-white text-[10px] font-bold uppercase rounded opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none drop-shadow-md">Facebook</span>
              </a>
              <a href="https://www.tiktok.com/@torus.ac4?_t=zs-8zppzl6ivrx&_r=1" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors relative group" title="TikTok">
                <Icon name="tiktok" className="w-5 h-5" />
                <span className="absolute bottom-[120%] left-1/2 -translate-x-1/2 mb-1 w-max px-2 py-1 bg-slate-800 text-white text-[10px] font-bold uppercase rounded opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none drop-shadow-md">TikTok</span>
              </a>
              <a href="https://www.youtube.com/@TORUS-u9l" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors relative group" title="YouTube">
                <Icon name="youtube" className="w-6 h-6" />
                <span className="absolute bottom-[120%] left-1/2 -translate-x-1/2 mb-1 w-max px-2 py-1 bg-slate-800 text-white text-[10px] font-bold uppercase rounded opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none drop-shadow-md">YouTube</span>
              </a>
            </div>
            <p className="text-slate-600 text-xs">
              &copy; {new Date().getFullYear()} Torus AC. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isForgotPasswordModalOpen}
        onClose={closeForgotPasswordModal}
        title="Recuperar Contraseña"
      >
        {!recoveryMessage ? (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-6 p-1">
            <p className="text-slate-600">
              Ingresa tu correo electrónico y te enviaremos un enlace seguro para restablecer tu contraseña.
            </p>
            <div className="space-y-2">
              <label htmlFor="recovery-email" className="text-xs font-bold text-slate-700 uppercase tracking-wider ml-1">
                Correo Electrónico
              </label>
              <input
                id="recovery-email"
                name="recovery-email"
                type="email"
                autoComplete="email"
                required
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                placeholder="tu@correo.com"
              />
            </div>
            <Button type="submit" className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors" disabled={isRecovering}>
              {isRecovering ? 'Enviando...' : 'Enviar enlace'}
            </Button>
          </form>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="check" className="text-emerald-600 w-8 h-8" />
            </div>
            <p className="text-slate-600 mb-6">{recoveryMessage}</p>
            <Button onClick={closeForgotPasswordModal} className="px-8 py-2 bg-slate-900 text-white rounded-full">
              Cerrar
            </Button>
          </div>
        )}
      </Modal>

      {/* Scroll Buttons Widget */}
      <div className={`fixed bottom-8 right-8 z-50 flex flex-col gap-2 transition-all duration-500 ${scrolled ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}>
        <button
          onClick={scrollToTop}
          className="p-3 rounded-full bg-emerald-600/90 backdrop-blur-sm text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-300 hover:bg-emerald-500 hover:scale-110"
          aria-label="Subir"
          title="Ir arriba"
        >
          <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
        <button
          onClick={scrollToBottom}
          className="p-3 rounded-full bg-emerald-600/90 backdrop-blur-sm text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-300 hover:bg-emerald-500 hover:scale-110"
          aria-label="Bajar"
          title="Ir abajo"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>
    </>
  );
};

export default LoginView;