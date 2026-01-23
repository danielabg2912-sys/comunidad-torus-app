import React, { useState } from 'react';
import { MOCK_LEGAL_STATUS } from '../constants';
import { Reservation, LegalStatus, User } from '../types';
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
        // Re-authenticate user before updating password
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
          setPasswordMessage({ type: 'error', text: 'Error al actualizar la contraseña. Inténtalo de nuevo.' });
        }
      }
    } else {
      setPasswordMessage({ type: 'error', text: 'No hay sesión activa.' });
    }

    setTimeout(() => setPasswordMessage(null), 5000);
  };

  return (
    <>
      <div className="space-y-8">
        <Card>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-accent-green rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-light">{currentUser.name}</h1>
              <p className="text-text-muted">{currentUser.email}</p>
              <p className="text-sm text-gray-500 mt-1">NITO: <span className="font-semibold text-text-muted">{currentUser.nito}</span></p>
            </div>
          </div>
        </Card>

        <div>
          <div className="border-b border-dark-border">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('reservations')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'reservations' ? 'border-accent-green text-accent-green' : 'border-transparent text-text-muted hover:text-text-light hover:border-gray-500'}`}
              >
                Mis Reservas
              </button>

              <button
                onClick={() => setActiveTab('account')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'account' ? 'border-accent-green text-accent-green' : 'border-transparent text-text-muted hover:text-text-light hover:border-gray-500'}`}
              >
                Mi Cuenta
              </button>
            </nav>
          </div>

          <div className="mt-6">
            {activeTab === 'reservations' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-text-light mb-4">Próximas</h2>
                  {upcomingReservations.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {upcomingReservations.map(res => (
                        <Card key={res.id}>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-bold capitalize text-accent-green">{res.purpose || res.type}</p>
                              <p className="text-text-muted"><Icon name="calendar" /> {res.date} a las {res.time}</p>
                              <p className="text-text-muted"><Icon name="location" /> {res.branch}</p>
                            </div>
                            <Button variant="danger" size="sm" onClick={() => setCancellingReservationId(res.id)}>Cancelar</Button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : <p className="text-text-muted">No tienes reservas próximas.</p>}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-text-light mb-4">Pasadas</h2>
                  {pastReservations.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {pastReservations.map(res => (
                        <Card key={res.id} className="opacity-60">
                          <p className="font-bold capitalize text-gray-500">{res.purpose || res.type}</p>
                          <p className="text-text-muted"><Icon name="calendar" /> {res.date} a las {res.time}</p>
                          <p className="text-gray-500"><Icon name="location" /> {res.branch}</p>
                        </Card>
                      ))}
                    </div>
                  ) : <p className="text-text-muted">No tienes reservas pasadas.</p>}
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <Card className="max-w-lg mx-auto">
                <h2 className="text-xl font-semibold text-text-light mb-4">Cambiar Contraseña</h2>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-muted">Contraseña Actual</label>
                    <input type="password" value={passwordData.current} onChange={e => setPasswordData({ ...passwordData, current: e.target.value })} required className="mt-1 block w-full px-3 py-2 bg-dark-tertiary border border-dark-border rounded-md shadow-sm focus:outline-none focus:ring-accent-green focus:border-accent-green" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-muted">Nueva Contraseña</label>
                    <input type="password" value={passwordData.new} onChange={e => setPasswordData({ ...passwordData, new: e.target.value })} required className="mt-1 block w-full px-3 py-2 bg-dark-tertiary border border-dark-border rounded-md shadow-sm focus:outline-none focus:ring-accent-green focus:border-accent-green" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-muted">Confirmar Nueva Contraseña</label>
                    <input type="password" value={passwordData.confirm} onChange={e => setPasswordData({ ...passwordData, confirm: e.target.value })} required className="mt-1 block w-full px-3 py-2 bg-dark-tertiary border border-dark-border rounded-md shadow-sm focus:outline-none focus:ring-accent-green focus:border-accent-green" />
                  </div>
                  {passwordMessage && (
                    <p className={`text-sm p-3 rounded-md ${passwordMessage.type === 'error' ? 'bg-red-900/50 text-red-300' : 'bg-green-900/50 text-green-300'}`}>
                      {passwordMessage.text}
                    </p>
                  )}
                  <Button type="submit" className="w-full">Actualizar Contraseña</Button>
                </form>
              </Card>
            )}
          </div>
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