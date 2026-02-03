import React, { useState } from 'react';
import { Reservation, User } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Icon } from './common/Icon';
import { ConfirmationModal } from './common/ConfirmationModal';
import { auth } from '../services/firebase';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

interface ProfileViewProps {
  currentUser: User;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
}

type ProfileTab = 'reservations' | 'account';

const ProfileView: React.FC<ProfileViewProps> = ({ currentUser, users, setUsers, reservations, setReservations }) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('reservations');
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const [cancellingReservationId, setCancellingReservationId] = useState<string | null>(null);

  const upcomingReservations = reservations.filter(r => !r.isPast && r.userNito === currentUser.nito);
  const pastReservations = reservations.filter(r => r.isPast && r.userNito === currentUser.nito);

  const handleConfirmCancel = () => {
    if (cancellingReservationId) {
      setReservations(prev => prev.filter(reservation => reservation.id !== cancellingReservationId));
      setCancellingReservationId(null);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);
    if (passwordData.new.length < 6) {
      setPasswordMessage({ type: 'error', text: 'La nueva contraseña debe tener al menos 6 caracteres.' });
      return;
    }
    if (passwordData.new !== passwordData.confirm) {
      setPasswordMessage({ type: 'error', text: 'Las nuevas contraseñas no coinciden.' });
      return;
    }

    const user = auth.currentUser;
    if (user && user.email) {
      try {
        const credential = EmailAuthProvider.credential(user.email, passwordData.current);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, passwordData.new);
        setPasswordMessage({ type: 'success', text: '¡Contraseña actualizada con éxito!' });
        setPasswordData({ current: '', new: '', confirm: '' });
      } catch (error: any) {
        console.error("Error updating password:", error);
        if (error.code === 'auth/wrong-password') {
          setPasswordMessage({ type: 'error', text: 'La contraseña actual es incorrecta.' });
        } else {
          setPasswordMessage({ type: 'error', text: 'Error al actualizar la contraseña.' });
        }
      }
    } else {
      setPasswordMessage({ type: 'error', text: 'No hay sesión activa.' });
    }
    setTimeout(() => setPasswordMessage(null), 5000);
  };

  return (
    <>
      <div className="space-y-8 pb-20">
        {/* Welcome Header & Digital Card */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold text-text-light mb-2">¡Hola, {currentUser.name.split(' ')[0]}!</h1>
            <p className="text-text-muted text-lg">Bienvenido a tu Espacio Torus</p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {/* Quick Stats or Actions */}
              <div className="bg-dark-secondary/50 p-4 rounded-2xl border border-white/5 text-center">
                <span className="block text-2xl font-bold text-accent-green">{upcomingReservations.length}</span>
                <span className="text-xs text-text-muted uppercase tracking-wider">Reservas Activas</span>
              </div>
              <div className="bg-dark-secondary/50 p-4 rounded-2xl border border-white/5 text-center">
                <span className="block text-2xl font-bold text-accent-green">{currentUser.role === 'admin' ? 'ADMIN' : 'MEMBER'}</span>
                <span className="text-xs text-text-muted uppercase tracking-wider">Nivel de Acceso</span>
              </div>
            </div>
          </div>

          {/* Digital ID Card Visualization */}
          <div className="relative group perspective-1000">
            <div className="bg-gradient-to-br from-accent-green/80 to-emerald-900 rounded-3xl p-8 shadow-2xl text-white relative overflow-hidden transform transition-transform duration-500 hover:scale-[1.02]">
              {/* Background decorative circles */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-black/20 rounded-full blur-xl"></div>

              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <h3 className="font-bold tracking-widest uppercase text-white/70 text-sm">Membresía Torus</h3>
                  <p className="text-2xl font-bold mt-1 tracking-wide">Comunidad</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Icon name="user" className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="mt-8 relative z-10">
                <p className="text-white/60 text-xs uppercase mb-1">Titular</p>
                <p className="text-xl font-medium tracking-wide">{currentUser.name}</p>
                <div className="mt-4 flex justify-between items-end">
                  <div>
                    <p className="text-white/60 text-xs uppercase mb-0.5">NITO</p>
                    <p className="font-mono text-lg">{currentUser.nito}</p>
                  </div>
                  <div className="text-right">
                    {/* QRCode Placeholder */}
                    <div className="w-12 h-12 bg-white p-1 rounded-lg">
                      <div className="w-full h-full bg-black/80 rounded-sm"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs (Dashboard Style) */}
        <div className="flex justify-center space-x-2 bg-dark-tertiary/50 p-1.5 rounded-full w-fit mx-auto backdrop-blur-sm border border-white/5">
          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'reservations' ? 'bg-accent-green text-white shadow-lg' : 'text-text-muted hover:text-white'}`}
          >
            Mis Reservas
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === 'account' ? 'bg-accent-green text-white shadow-lg' : 'text-text-muted hover:text-white'}`}
          >
            Mi Cuenta
          </button>
        </div>

        {/* Content Area */}
        <div className="transition-all duration-500 ease-in-out">
          {activeTab === 'reservations' && (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Upcoming */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-text-light">Próximas</h2>
                  <span className="bg-accent-green/20 text-accent-green text-xs font-bold px-3 py-1 rounded-full">{upcomingReservations.length}</span>
                </div>

                {upcomingReservations.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingReservations.map(res => (
                      <Card key={res.id} className="group hover:-translate-y-1 transition-transform border-l-4 border-l-accent-green">
                        <div className="flex justify-between items-start">
                          <div className="flex items-start space-x-4">
                            <div className="bg-accent-green/10 p-3 rounded-xl text-accent-green">
                              <Icon name={res.purpose === 'Curso' ? 'book' : 'calendar'} className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-text-light capitalize group-hover:text-accent-green transition-colors">{res.purpose || res.type}</h3>
                              <div className="text-text-muted text-sm space-y-1 mt-1">
                                <p className="flex items-center gap-2"><Icon name="calendar" className="w-4 h-4 opacity-70" /> <span className="font-medium">{res.date}</span> • {res.time}</p>
                                <p className="flex items-center gap-2"><Icon name="location" className="w-4 h-4 opacity-70" /> {res.branch}</p>
                              </div>
                            </div>
                          </div>
                          <Button variant="danger" size="sm" onClick={() => setCancellingReservationId(res.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">Cancelar</Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 bg-dark-secondary/30 rounded-2xl border border-dashed border-dark-border">
                    <Icon name="calendar" className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-text-muted">No tienes reservas próximas.</p>
                    <p className="text-sm text-gray-500 mt-1">¡Explora el menú para agendar algo!</p>
                  </div>
                )}
              </div>

              {/* Past */}
              <div>
                <h2 className="text-2xl font-bold text-text-light mb-6 opacity-70">Historial</h2>
                {pastReservations.length > 0 ? (
                  <div className="space-y-4">
                    {pastReservations.map(res => (
                      <div key={res.id} className="bg-dark-tertiary/40 p-4 rounded-xl flex items-center justify-between border border-transparent hover:border-dark-border transition-colors">
                        <div className="flex items-center space-x-4 opacity-60">
                          <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                            <Icon name="check" className="w-4 h-4 text-gray-400" />
                          </div>
                          <div>
                            <p className="font-bold text-text-muted capitalize">{res.purpose || res.type}</p>
                            <p className="text-xs text-gray-500">{res.date}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <p className="text-text-muted italic opacity-50">Sin historial reciente.</p>}
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <Card className="max-w-xl mx-auto backdrop-blur-xl">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-tr from-accent-green to-teal-600 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-white shadow-lg mb-4">
                  {currentUser.name.charAt(0)}
                </div>
                <h2 className="text-2xl font-bold text-text-light">{currentUser.name}</h2>
                <p className="text-text-muted">{currentUser.email}</p>
              </div>

              <div className="bg-dark-primary/50 p-6 rounded-xl border border-white/5">
                <h3 className="text-lg font-semibold text-text-light mb-4 flex items-center gap-2">
                  <Icon name="shield" className="w-5 h-5 text-accent-green" />
                  Seguridad
                </h3>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">Contraseña Actual</label>
                    <input type="password" value={passwordData.current} onChange={e => setPasswordData({ ...passwordData, current: e.target.value })} required className="w-full px-4 py-2.5 bg-dark-tertiary border border-dark-border rounded-lg focus:ring-2 focus:ring-accent-green focus:border-transparent transition-all" placeholder="••••••••" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-1">Nueva Contraseña</label>
                      <input type="password" value={passwordData.new} onChange={e => setPasswordData({ ...passwordData, new: e.target.value })} required className="w-full px-4 py-2.5 bg-dark-tertiary border border-dark-border rounded-lg focus:ring-2 focus:ring-accent-green focus:border-transparent transition-all" placeholder="••••••••" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-muted mb-1">Confirmar</label>
                      <input type="password" value={passwordData.confirm} onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })} required className="w-full px-4 py-2.5 bg-dark-tertiary border border-dark-border rounded-lg focus:ring-2 focus:ring-accent-green focus:border-transparent transition-all" placeholder="••••••••" />
                    </div>
                  </div>
                  {passwordMessage && (
                    <p className={`text-sm p-3 rounded-lg flex items-center gap-2 ${passwordMessage.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'}`}>
                      <Icon name={passwordMessage.type === 'error' ? 'alert-circle' : 'check'} className="w-4 h-4" />
                      {passwordMessage.text}
                    </p>
                  )}
                  <Button type="submit" className="w-full mt-2" size="lg">Actualizar Contraseña</Button>
                </form>
              </div>
            </Card>
          )}
        </div>
      </div>
      <ConfirmationModal
        isOpen={!!cancellingReservationId}
        onClose={() => setCancellingReservationId(null)}
        onConfirm={handleConfirmCancel}
        title="Cancelar Reserva"
        message="¿Estás seguro de que quieres cancelar esta reserva? Esta acción no se puede deshacer."
      />
    </>
  );
};

export default ProfileView;