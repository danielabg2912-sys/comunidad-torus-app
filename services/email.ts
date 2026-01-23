import { addDoc, collection } from 'firebase/firestore';
import { db } from './firebase';
import { Reservation, User, Course } from '../types';

export const sendBookingConfirmation = async (reservation: Reservation, user: User, course?: Course) => {
    try {
        await addDoc(collection(db, 'mail'), {
            to: user.email,
            message: {
                subject: `Confirmación de Cita - Comunidad Torus`,
                html: `
                    <h1>¡Hola ${user.name}!</h1>
                    <p>Tu cita ha sido confirmada exitosamente.</p>
                    
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Motivo:</strong> ${reservation.purpose || 'Cita General'}</p>
                        ${course ? `<p><strong>Curso:</strong> ${course.title}</p>` : ''}
                        <p><strong>Sucursal:</strong> ${reservation.branch}</p>
                        <p><strong>Fecha:</strong> ${reservation.date}</p>
                        <p><strong>Hora:</strong> ${reservation.time}</p>
                        <p><strong>ID de Reserva:</strong> ${reservation.id}</p>
                    </div>

                    <p>Si necesitas cancelar o reprogramar, por favor contáctanos o hazlo a través de la plataforma.</p>
                    <p>¡Te esperamos!</p>
                    <p><em>Comunidad Torus</em></p>
                `,
            },
        });
        console.log('Email confirmation queued for:', user.email);
    } catch (error) {
        console.error('Error sending email confirmation:', error);
        // We don't block the UI flow if email fails, just log it
    }
};

export const sendCancellationNotification = async (reservation: Reservation, userEmail: string, userName: string) => {
    try {
        await addDoc(collection(db, 'mail'), {
            to: userEmail,
            message: {
                subject: `Cancelación de Cita - Comunidad Torus`,
                html: `
                    <h1>Hola ${userName},</h1>
                    <p>Te informamos que tu cita ha sido cancelada.</p>
                    
                    <div style="background-color: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Fecha:</strong> ${reservation.date}</p>
                        <p><strong>Hora:</strong> ${reservation.time}</p>
                        <p><strong>Sucursal:</strong> ${reservation.branch}</p>
                    </div>

                    <p>Si esto fue un error o deseas agendar nuevamente, por favor visita la plataforma.</p>
                    <p><em>Comunidad Torus</em></p>
                `,
            },
        });
        console.log('Cancellation email queued for:', userEmail);
    } catch (error) {
        console.error('Error sending cancellation email:', error);
    }
};
