
import React, { useState, useEffect } from 'react';
import { Reservation, User } from '../types';
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
  const [greeting, setGreeting] = useState('Hola');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Buenos días');
    else if (hour < 18) setGreeting('Buenas tardes');
    else setGreeting('Buenas noches');
  }, []);

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
      <div className="space-y-12 pb-20 animate-fade-in-up">
        {/* Header Section with Glass Morphism */}
        <div className="relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 relative z-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/60 border border-slate-200/60 backdrop-blur-sm text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 shadow-sm">
                  <div className={`w-2 h-2 rounded-full ${navigator.onLine ? 'bg-emerald-500 box-shadow-neon' : 'bg-red-500'}`}></div>
                  <span>Panel de Control</span>
                </div>
                <h1 className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                  {greeting}, <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                    {(currentUser?.name || 'Usuario').split(' ')[0]}
                  </span>
                </h1>
                <p className="text-slate-500 text-lg md:text-xl font-medium max-w-md leading-relaxed mt-2">
                  Bienvenido a tu espacio en Torus. Aquí tienes el resumen de tu actividad.
                </p>
              </div>

              <div className="flex gap-6">
                <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xl shadow-slate-200/50 flex-1 hover:-translate-y-1 transition-transform duration-300">
                  <div className="text-4xl font-black text-slate-900 mb-1">{upcomingReservations.length}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Reservas Activas</div>
                </div>
                <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white shadow-xl shadow-slate-200/50 flex-1 hover:-translate-y-1 transition-transform duration-300">
                  <div className="text-4xl font-black text-slate-900 mb-1">{currentUser.role === 'admin' ? 'ADM' : 'MBR'}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nivel de Acceso</div>
                </div>
              </div>
            </div>

            {/* Premium Digital ID Card */}
            <div className="relative group perspective-1000 flex justify-center lg:justify-end">
              <div className="w-full max-w-sm aspect-[1.586/1] bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-8 shadow-2xl shadow-emerald-900/40 text-white relative overflow-hidden transform transition-all duration-700 hover:rotate-y-12 hover:scale-[1.03] group-hover:shadow-emerald-500/20 ring-1 ring-white/10">

                {/* ID Card Texture/Effects */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] mix-blend-screen pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/20 rounded-full blur-[80px] mix-blend-screen pointer-events-none"></div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10">
                        <img src="/images/torus-logo-white.png" alt="Torus" className="w-7 h-7 object-contain" />
                      </div>
                      <div className="leading-none">
                        <h3 className="text-lg font-black tracking-wide">TORUS</h3>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Official Member</p>
                      </div>
                    </div>
                    <div className="px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded text-[10px] font-bold uppercase tracking-widest text-emerald-300">
                      Active
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Member Name</p>
                      <p className="text-xl font-bold tracking-tight text-white">{currentUser?.name || 'Usuario'}</p>
                    </div>

                    <div className="flex justify-between items-end border-t border-white/10 pt-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">NITO ID</p>
                        <p className="font-mono text-lg text-emerald-300 tracking-wider">{currentUser?.nito || 'N/A'}</p>
                      </div>
                      <div className="opacity-50">
                        {/* Decorative Barcode Lines */}
                        <div className="flex gap-0.5 items-end h-8">
                          {[...Array(12)].map((_, i) => (
                            <div key={i} className="w-1 bg-white" style={{ height: `${Math.random() * 100}%` }}></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Improved Tabs (Segmented Control) */}
        <div className="flex justify-center">
          <div className="bg-slate-200/50 p-1.5 rounded-2xl flex gap-1 shadow-inner max-w-md w-full relative">
            <button
              onClick={() => setActiveTab('reservations')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative z-10 ${activeTab === 'reservations' ? 'bg-white text-slate-900 shadow-lg shadow-slate-200/50 scale-[1.02]' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Icon name="calendar" className={`w-4 h-4 ${activeTab === 'reservations' ? 'text-emerald-500' : ''}`} />
              Mis Reservas
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative z-10 ${activeTab === 'account' ? 'bg-white text-slate-900 shadow-lg shadow-slate-200/50 scale-[1.02]' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Icon name="user" className={`w-4 h-4 ${activeTab === 'account' ? 'text-emerald-500' : ''}`} />
              Mi Cuenta
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="transition-all duration-500 ease-out">
          {activeTab === 'reservations' && (
            <div className="grid lg:grid-cols-12 gap-8">
              {/* Upcoming Column */}
              <div className="lg:col-span-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    Próximas Actividades
                  </h2>
                </div>

                {upcomingReservations.length > 0 ? (
                  <div className="grid gap-4">
                    {upcomingReservations.map(res => (
                      <div key={res.id} className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-emerald-500 to-teal-400 group-hover:w-2 transition-all"></div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pl-4">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300 shadow-inner">
                              <Icon name={res.purpose === 'Curso' ? 'book' : 'calendar'} className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-slate-900">{res.purpose || res.type}</h3>
                              <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                                <span className="flex items-center gap-1.5"><Icon name="clock" className="w-3.5 h-3.5" /> {res.date} • {res.time}</span>
                                <span className="flex items-center gap-1.5"><Icon name="map-pin" className="w-3.5 h-3.5" /> {res.branch}</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="danger"
                            onClick={() => setCancellingReservationId(res.id)}
                            className="w-full sm:w-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 px-6 bg-white/50 rounded-[2.5rem] border-2 border-dashed border-slate-200 hover:border-emerald-200 transition-colors group">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 shadow-sm group-hover:scale-110 transition-transform duration-300">
                      <Icon name="calendar" className="w-8 h-8 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <p className="text-lg font-bold text-slate-800">No tienes reservas próximas</p>
                    <p className="text-slate-500 max-w-xs mx-auto mt-2">Explora nuestro catálogo y agenda una cita o inscríbete a un curso para comenzar.</p>
                  </div>
                )}
              </div>

              {/* Past Column */}
              <div className="lg:col-span-4">
                <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-lg shadow-slate-200/50 sticky top-4">
                  <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Icon name="clock" className="w-5 h-5 text-slate-400" />
                    Historial Reciente
                  </h2>
                  {pastReservations.length > 0 ? (
                    <ul className="space-y-4 relative before:absolute before:left-2.5 before:top-2 before:h-full before:w-px before:bg-slate-100">
                      {pastReservations.slice(0, 5).map(res => (
                        <li key={res.id} className="relative z-10 pl-8 pb-4 last:pb-0">
                          <span className="absolute left-0 top-1 w-5 h-5 rounded-full border-4 border-white bg-slate-200"></span>
                          <div>
                            <p className="font-bold text-slate-700 text-sm">{res.purpose || res.type}</p>
                            <span className="text-xs text-slate-400 font-medium">{res.date}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-slate-400 text-sm text-center py-6">Sin actividad reciente.</p>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 p-8 md:p-12 border border-slate-50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>

                <div className="flex flex-col md:flex-row items-center gap-8 mb-10 border-b border-slate-100 pb-10">
                  <div className="relative">
                    <div className="w-32 h-32 bg-gray-100 rounded-3xl overflow-hidden shadow-inner ring-4 ring-white">
                      <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-5xl font-bold text-white">
                        {(currentUser?.name || 'U').charAt(0)}
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-slate-600 cursor-pointer hover:text-emerald-500 hover:scale-110 transition-all">
                      <Icon name="camera" className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-3xl font-black text-slate-900 mb-1">{currentUser?.name || 'Usuario'}</h2>
                    <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2">
                      <Icon name="mail" className="w-4 h-4" /> {currentUser?.email || 'No email'}
                    </p>
                    <div className="mt-4 flex gap-2 justify-center md:justify-start">
                      <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">Miembro Activo</span>
                      <span className="px-3 py-1 rounded-lg bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-wider">{currentUser?.role || 'Miembro'}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                      <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Icon name="lock" className="w-4 h-4" /></div>
                      Seguridad & Contraseña
                    </h3>

                    <form onSubmit={handlePasswordChange} className="space-y-5 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Contraseña Actual</label>
                        <input type="password" value={passwordData.current} onChange={e => setPasswordData({ ...passwordData, current: e.target.value })} required className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-slate-800 placeholder:text-slate-300" placeholder="••••••••" />
                      </div>
                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Nueva Contraseña</label>
                          <input type="password" value={passwordData.new} onChange={e => setPasswordData({ ...passwordData, new: e.target.value })} required className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-slate-800 placeholder:text-slate-300" placeholder="••••••••" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Confirmar Contraseña</label>
                          <input type="password" value={passwordData.confirm} onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })} required className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-slate-800 placeholder:text-slate-300" placeholder="••••••••" />
                        </div>
                      </div>

                      {passwordMessage && (
                        <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-bold animate-fade-in-up ${passwordMessage.type === 'error' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                          <Icon name={passwordMessage.type === 'error' ? 'alert-circle' : 'check'} className="w-5 h-5 flex-shrink-0" />
                          {passwordMessage.text}
                        </div>
                      )}

                      <div className="pt-2">
                        <Button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 hover:scale-[1.01] transition-all">
                          Actualizar Credenciales
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
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