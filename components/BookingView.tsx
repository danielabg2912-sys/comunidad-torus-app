import React, { useState } from 'react';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Icon } from './common/Icon';
import { sendBookingConfirmation } from '../services/email';
import { Reservation, User, AppointmentPurpose, Course } from '../types';
import { db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';

type BookingStep = 'purpose' | 'course-selection' | 'course-schedule' | 'branch' | 'date' | 'time' | 'confirm' | 'success';
type Branch = 'Del Valle' | 'Coyoacán';
const APPOINTMENT_CAPACITY = 4;

// Helper to generate time slots every 15 minutes from 10:00 to 17:45
const generateTimeSlots = () => {
  const slots = [];
  for (let h = 10; h < 18; h++) {
    for (let m = 0; m < 60; m += 15) {
      const hour = h.toString().padStart(2, '0');
      const minute = m.toString().padStart(2, '0');
      slots.push(`${hour}:${minute}`);
    }
  }
  return slots;
};

const allTimeSlots = generateTimeSlots();

interface BookingViewProps {
  currentUser: User;
  reservations: Reservation[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
  courses: Course[];
}

const BookingView: React.FC<BookingViewProps> = ({ currentUser, reservations, setReservations, courses }) => {
  const [step, setStep] = useState<BookingStep>('purpose');
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedPurpose, setSelectedPurpose] = useState<AppointmentPurpose | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Handlers ---

  const handlePurposeSelect = (purpose: AppointmentPurpose) => {
    setSelectedPurpose(purpose);
    if (purpose === 'Curso') {
      setStep('course-selection');
    } else {
      setStep('branch');
    }
  };

  const handleCourseSelect = (course: Course) => {
    setSelectedCourse(course);
    setStep('course-schedule');
  };

  const handleCourseScheduleSelect = (date: string, time: string, branch: Branch) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setSelectedBranch(branch); // Branch is determined by the course schedule
    setStep('confirm');
  };

  const handleBranchSelect = (branch: Branch) => {
    setSelectedBranch(branch);
    setStep('date');
  };

  const handleDateSelect = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate) {
      setStep('time');
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep('confirm');
  };

  const handleConfirm = async () => {
    if (!selectedPurpose || !selectedDate || !selectedTime) return;
    setIsSubmitting(true);

    const newReservation: Reservation = {
      id: `res-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      type: selectedPurpose === 'Curso' ? 'curso' : 'cita',
      purpose: selectedPurpose,
      date: selectedDate,
      time: selectedTime,
      branch: selectedBranch || 'Del Valle', // Fallback, though should always be set
      isPast: false,
      userName: currentUser.name,
      userNito: currentUser.nito,
    };

    try {
      // Save to Firestore
      await setDoc(doc(db, 'reservations', newReservation.id), newReservation);

      // 2. Add to local state (optimistic update)
      setReservations(prev => [...prev, newReservation]);

      // 3. Send Email Confirmation
      await sendBookingConfirmation(newReservation, currentUser, selectedCourse || undefined);

      setStep('success');
    } catch (error) {
      console.error("Error saving reservation:", error);
      alert("Hubo un error al guardar tu cita. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep('purpose');
    setSelectedBranch(null);
    setSelectedPurpose(null);
    setSelectedCourse(null);
    setSelectedDate('');
    setSelectedTime('');
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-text-light mb-6 text-center">Agendar una Cita</h1>

      {/* Step 1: Purpose Selection */}
      {step === 'purpose' && (
        <Card>
          <h2 className="text-xl font-semibold text-center mb-4 text-text-light">1. ¿Qué deseas agendar?</h2>
          <div className="flex flex-col space-y-3">
            <Button variant="outline" size="lg" onClick={() => handlePurposeSelect('Trámite')}>
              <Icon name="edit" className="w-5 h-5 mr-2" /> Trámite (COFEPRIS/Legal)
            </Button>
            <Button variant="outline" size="lg" onClick={() => handlePurposeSelect('Curso')}>
              <Icon name="sparkles" className="w-5 h-5 mr-2" /> Curso o Taller
            </Button>
            <Button variant="outline" size="lg" onClick={() => handlePurposeSelect('Retiro de Cosecha')}>
              <Icon name="check" className="w-5 h-5 mr-2" /> Retiro de Cosecha
            </Button>
          </div>
        </Card>
      )}

      {/* --- COURSE FLOW --- */}

      {step === 'course-selection' && (
        <Card>
          <Button variant="link" onClick={() => setStep('purpose')} className="mb-4 text-sm"><Icon name="back" /> Volver</Button>
          <h2 className="text-xl font-semibold text-center mb-4 text-text-light">2. Selecciona un Curso</h2>
          <div className="space-y-3">
            {courses.map(course => (
              <div key={course.id} className="border border-dark-border p-4 rounded-lg hover:bg-dark-tertiary transition-colors cursor-pointer" onClick={() => handleCourseSelect(course)}>
                <h3 className="font-bold text-accent-green">{course.title}</h3>
                <p className="text-sm text-text-muted">{course.description}</p>
                <p className="text-xs text-gray-400 mt-2">Costo: ${course.cost}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {step === 'course-schedule' && selectedCourse && (
        <Card>
          <Button variant="link" onClick={() => setStep('course-selection')} className="mb-4 text-sm"><Icon name="back" /> Volver</Button>
          <h2 className="text-xl font-semibold text-center mb-4 text-text-light">3. Fechas Disponibles para {selectedCourse.title}</h2>

          {selectedCourse.schedule && selectedCourse.schedule.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedCourse.schedule.map((slot, index) => {
                const isFull = slot.booked >= slot.capacity;
                return (
                  <Button
                    key={index}
                    variant="secondary"
                    disabled={isFull}
                    onClick={() => handleCourseScheduleSelect(slot.date, slot.time, slot.branch)}
                    className="flex flex-col items-start p-4 h-auto"
                  >
                    <span className="font-bold text-lg">{slot.date}</span>
                    <span className="text-accent-green">{slot.time} hrs</span>
                    <span className="text-sm text-gray-400">{slot.branch}</span>
                    <span className={`text-xs mt-2 ${isFull ? 'text-red-400' : 'text-green-400'}`}>
                      {isFull ? 'Agotado' : `${slot.capacity - slot.booked} lugares disponibles`}
                    </span>
                  </Button>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-text-muted">No hay fechas programadas próximamente para este curso.</p>
          )}
        </Card>
      )}


      {/* --- REGULAR FLOW (Trámite / Retiro) --- */}

      {step === 'branch' && (
        <Card>
          <Button variant="link" onClick={() => setStep('purpose')} className="mb-4 text-sm"><Icon name="back" /> Volver</Button>
          <h2 className="text-xl font-semibold text-center mb-4 text-text-light">2. Selecciona una sucursal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" size="lg" onClick={() => handleBranchSelect('Del Valle')}>
              <Icon name="location" /> Del Valle
            </Button>
            <Button variant="outline" size="lg" onClick={() => handleBranchSelect('Coyoacán')}>
              <Icon name="location" /> Coyoacán
            </Button>
          </div>
        </Card>
      )}

      {step === 'date' && (
        <Card>
          <Button variant="link" onClick={() => setStep('branch')} className="mb-4 text-sm"><Icon name="back" /> Volver</Button>
          <h2 className="text-xl font-semibold text-center mb-4 text-text-light">3. Elige una fecha en {selectedBranch}</h2>
          <form onSubmit={handleDateSelect} className="flex flex-col items-center">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={today}
              required
              className="p-2 bg-dark-tertiary border border-dark-border rounded-md shadow-sm focus:outline-none focus:ring-accent-green focus:border-accent-green mb-6 dark:[color-scheme:dark]"
            />
            <Button type="submit" size="lg" disabled={!selectedDate}>
              Ver Horarios Disponibles
            </Button>
          </form>
        </Card>
      )}

      {step === 'time' && (
        <Card>
          <Button variant="link" onClick={() => setStep('date')} className="mb-4 text-sm"><Icon name="back" /> Volver</Button>
          <h2 className="text-xl font-semibold text-center mb-4 text-text-light">4. Elige un horario para el {selectedDate}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {allTimeSlots.map(time => {
              const existingReservations = reservations.filter(r => r.date === selectedDate && r.time === time && r.branch === selectedBranch).length;
              const availableSlots = APPOINTMENT_CAPACITY - existingReservations;
              const isFull = availableSlots <= 0;

              return (
                <Button
                  key={time}
                  variant="secondary"
                  onClick={() => handleTimeSelect(time)}
                  disabled={isFull}
                  className="flex-col h-auto py-2"
                >
                  <span className="font-bold">{time}</span>
                  <span className={`text-xs ${isFull ? 'text-accent-red' : 'text-green-400'}`}>
                    {isFull ? 'Lleno' : `${availableSlots} disp.`}
                  </span>
                </Button>
              )
            })}
          </div>
        </Card>
      )}

      {/* --- CONFIRMATION (Shared) --- */}

      {step === 'confirm' && (
        <Card>
          <Button variant="link" onClick={() => setStep(selectedPurpose === 'Curso' ? 'course-schedule' : 'time')} className="mb-4 text-sm"><Icon name="back" /> Volver</Button>
          <h2 className="text-xl font-semibold text-center mb-4 text-text-light">Confirmar Cita</h2>
          <div className="bg-dark-tertiary p-4 rounded-lg space-y-2 text-text-light">
            <p><span className="font-semibold text-text-muted">Motivo:</span> {selectedPurpose}</p>
            {selectedCourse && <p><span className="font-semibold text-text-muted">Curso:</span> {selectedCourse.title}</p>}
            <p><span className="font-semibold text-text-muted">Sucursal:</span> {selectedBranch}</p>
            <p><span className="font-semibold text-text-muted">Fecha:</span> {selectedDate}</p>
            <p><span className="font-semibold text-text-muted">Hora:</span> {selectedTime}</p>
          </div>
          <Button size="lg" onClick={handleConfirm} className="w-full mt-6" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Confirmar Cita'}
          </Button>
        </Card>
      )}

      {step === 'success' && (
        <Card className="text-center">
          <div className="w-16 h-16 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="check" className="text-green-400 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-accent-green mb-2">¡Cita Confirmada!</h2>
          <p className="text-text-muted">Hemos agendado tu cita para {selectedPurpose?.toLowerCase()} en {selectedBranch} para el {selectedDate} a las {selectedTime}.</p>
          <p className="text-text-muted mt-1">Recibirás un correo de confirmación.</p>
          <Button variant="outline" onClick={handleReset} className="mt-6">Hacer otra reserva</Button>
        </Card>
      )}
    </div>
  );
};

export default BookingView;