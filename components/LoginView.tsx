import React, { useState } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Icon } from './common/Icon';
import { User } from '../types';
import { Modal } from './common/Modal';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
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
      <div className="min-h-screen flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-accent-green tracking-wider">TORUS</h1>
            <p className="text-text-secondary mt-2">Bienvenido a la comunidad</p>
          </div>
          <Card className="p-8 shadow-xl">

            {verificationSent ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="check" className="text-accent-green w-8 h-8" />
                </div>
                <h3 className="text-xl font-medium text-text-primary mb-2">¡Cuenta Creada!</h3>
                <p className="text-text-secondary mb-6">Hemos enviado un correo de verificación a <strong>{email}</strong>. Por favor revisa tu bandeja de entrada (y spam) para activar tu cuenta.</p>
                <Button onClick={() => { setVerificationSent(false); setIsSignUp(false); }} className="w-full">
                  Volver al Inicio de Sesión
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {isSignUp && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-text-secondary">
                      Nombre Completo
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required={isSignUp}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 bg-white border border-border-light rounded-lg shadow-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-green focus:border-accent-green sm:text-sm"
                      placeholder="Tu Nombre"
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-secondary">
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
                    className="mt-1 block w-full px-3 py-2 bg-white border border-border-light rounded-lg shadow-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-green focus:border-accent-green sm:text-sm"
                    placeholder="tu@correo.com"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-text-secondary">
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
                    className="mt-1 block w-full px-3 py-2 bg-white border border-border-light rounded-lg shadow-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent-green focus:border-accent-green sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={openForgotPasswordModal}
                    className="text-sm font-medium text-accent-green hover:underline focus:outline-none"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>

                {error && (
                  <p className="text-sm text-accent-red bg-accent-red/10 p-3 rounded-lg text-center">{error}</p>
                )}

                <div>
                  <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Icon name="spinner" className="animate-spin w-5 h-5 mr-2" />
                        {isSignUp ? 'Registrando...' : 'Ingresando...'}
                      </>
                    ) : (isSignUp ? 'Registrarse' : 'Ingresar')}
                  </Button>
                </div>
                <div className="text-center mt-4">
                  <p className="text-text-secondary text-sm">
                    {isSignUp ? "¿Ya tienes cuenta?" : "¿Aún no eres miembro?"}{' '}
                    <button
                      type="button"
                      onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
                      className="text-accent-green hover:underline font-medium"
                    >
                      {isSignUp ? "Inicia Sesión" : "Regístrate"}
                    </button>
                  </p>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
      <Modal
        isOpen={isForgotPasswordModalOpen}
        onClose={closeForgotPasswordModal}
        title="Recuperar Contraseña"
      >
        {!recoveryMessage ? (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
            <p className="text-sm text-text-muted">
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </p>
            <div>
              <label htmlFor="recovery-email" className="block text-sm font-medium text-text-muted">
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
                className="mt-1 block w-full px-3 py-2 bg-dark-tertiary border border-dark-border rounded-md shadow-sm text-text-light placeholder-gray-500 focus:outline-none focus:ring-accent-green focus:border-accent-green sm:text-sm"
                placeholder="tu@correo.com"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isRecovering}>
              {isRecovering ? (
                <>
                  <Icon name="spinner" className="animate-spin w-5 h-5 mr-2" />
                  Enviando...
                </>
              ) : 'Enviar enlace de recuperación'}
            </Button>
          </form>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="check" className="text-green-400 w-8 h-8" />
            </div>
            <p className="text-text-muted">{recoveryMessage}</p>
            <Button onClick={closeForgotPasswordModal} className="mt-6">
              Cerrar
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default LoginView;