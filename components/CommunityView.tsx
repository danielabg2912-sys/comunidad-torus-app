import React, { useState, useCallback } from 'react';
import { Course, CourseType, SierraActivity, User, CourseRegistration } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Icon } from './common/Icon';
import { generateSierraActivityIdea } from '../services/geminiService';
import { Modal } from './common/Modal';
import { ConfirmationModal } from './common/ConfirmationModal';

interface CommunityViewProps {
  currentUser: User;
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  sierraActivities: SierraActivity[];
  setSierraActivities: React.Dispatch<React.SetStateAction<SierraActivity[]>>;
  courseRegistrations: CourseRegistration[];
  setCourseRegistrations: React.Dispatch<React.SetStateAction<CourseRegistration[]>>;
}

type ItemToDelete = {
  type: 'course' | 'activity';
  id: string;
  name: string;
}

const CourseCard: React.FC<{
  course: Course;
  currentUser: User;
  courseRegistrations: CourseRegistration[];
  setCourseRegistrations: React.Dispatch<React.SetStateAction<CourseRegistration[]>>;
  onShowPaymentInfo: (course: Course) => void;
}> = ({ course, currentUser, courseRegistrations, setCourseRegistrations, onShowPaymentInfo }) => {

  const isRegistered = courseRegistrations.some(reg => reg.userNito === currentUser.nito && reg.courseId === course.id);

  const handleRegister = () => {
    if (course.cost > 0) {
      onShowPaymentInfo(course);
    } else {
      setCourseRegistrations(prev => [...prev, { userNito: currentUser.nito, courseId: course.id }]);
    }
  }

  const getBadgeColor = (type: CourseType) => {
    switch (type) {
      case CourseType.Presencial: return 'bg-blue-900/50 text-blue-300';
      case CourseType.EnLineaVivo: return 'bg-red-900/50 text-red-300';
      case CourseType.EnLineaGrabado: return 'bg-purple-900/50 text-purple-300';
      default: return 'bg-gray-700 text-gray-300';
    }
  }

  const renderActionButtons = () => {
    if (currentUser.role === 'admin') return null;

    return (
      <Button onClick={handleRegister} disabled={isRegistered}>
        {isRegistered ? 'Inscrito' : 'Inscribirme'}
      </Button>
    );
  }

  return (
    <Card>
      <span className={`absolute top-4 right-4 text-xs font-medium mr-2 px-2.5 py-0.5 rounded ${getBadgeColor(course.type)}`}>
        {course.type}
      </span>
      <h3 className="text-xl font-bold text-text-light mb-2">{course.title}</h3>
      <p className="text-text-muted mb-4 h-20 overflow-hidden">{course.description}</p>
      {course.type === CourseType.Presencial && <p className="text-sm text-gray-400 mb-2"><Icon name="location" /> {course.branch}</p>}
      {course.type === CourseType.EnLineaVivo && <p className="text-sm text-gray-400 mb-2"><Icon name="link" /> <a href={course.meetingLink} target="_blank" rel="noopener noreferrer" className="text-accent-green hover:underline">Enlace a la sesión</a></p>}
      <div className="flex justify-between items-center mt-4">
        <span className="text-lg font-bold text-accent-red">{course.cost > 0 ? `$${course.cost}` : 'Gratis'}</span>
        {renderActionButtons()}
      </div>
    </Card>
  )
};

const SierraActivityCard: React.FC<{ activity: SierraActivity }> = ({ activity }) => (
  <Card className="overflow-hidden p-0">
    <img src={activity.imageUrl} alt={activity.title} className="w-full h-48 object-cover" />
    <div className="p-6">
      <h3 className="text-2xl font-bold text-text-light mb-2">{activity.title}</h3>
      <p className="text-text-muted mb-4">{activity.summary}</p>
      {activity.highlights && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2 text-text-light">Puntos Clave:</h4>
          <ul className="list-disc list-inside space-y-1 text-text-muted">
            {activity.highlights.map((h, i) => <li key={i}>{h}</li>)}
          </ul>
        </div>
      )}
      <Button variant="secondary">Leer más</Button>
    </div>
  </Card>
);

const CommunityView: React.FC<CommunityViewProps> = ({ currentUser, courses, setCourses, sierraActivities, setSierraActivities, courseRegistrations, setCourseRegistrations }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<SierraActivity | null>(null);

  const [itemToDelete, setItemToDelete] = useState<ItemToDelete | null>(null);

  const [paymentModalCourse, setPaymentModalCourse] = useState<Course | null>(null);

  const isAdmin = currentUser.role === 'admin';

  const handleShowPaymentInfo = (course: Course) => {
    setPaymentModalCourse(course);
  };

  // --- Delete Handler ---
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    if (itemToDelete.type === 'course') {
      setCourses(prev => prev.filter(c => c.id !== itemToDelete.id));
    } else if (itemToDelete.type === 'activity') {
      setSierraActivities(prev => prev.filter(a => a.id !== itemToDelete.id));
    }
    setItemToDelete(null);
  }

  // --- Course Handlers ---
  const handleAddNewCourseClick = () => {
    setEditingCourse({
      id: `course-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: '',
      type: CourseType.Presencial,
      description: '',
      cost: 0,
      branch: 'Del Valle',
    });
    setIsCourseModalOpen(true);
  };

  const handleEditCourseClick = (course: Course) => {
    setEditingCourse(course);
    setIsCourseModalOpen(true);
  };

  const handleUpdateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    const exists = courses.some(c => c.id === editingCourse.id);
    if (exists) {
      setCourses(prev => prev.map(c => c.id === editingCourse.id ? editingCourse : c));
    } else {
      setCourses(prev => [editingCourse, ...prev]);
    }
    setIsCourseModalOpen(false);
    setEditingCourse(null);
  };

  const handleDeleteCourseClick = (course: Course) => {
    setItemToDelete({ type: 'course', id: course.id, name: course.title });
  };

  // --- Activity Handlers ---
  const handleEditActivityClick = (activity: SierraActivity) => {
    setEditingActivity(activity);
    setIsActivityModalOpen(true);
  };

  const handleAddNewActivityClick = () => {
    setEditingActivity({
      id: `sa-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: '',
      summary: '',
      imageUrl: `https://picsum.photos/seed/sierra${Date.now()}/800/400`,
      content: '',
      highlights: []
    });
    setIsActivityModalOpen(true);
  };

  const handleUpdateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingActivity) return;
    // Check if it's a new activity or an update
    const exists = sierraActivities.some(a => a.id === editingActivity.id);
    if (exists) {
      setSierraActivities(prev => prev.map(a => a.id === editingActivity.id ? editingActivity : a));
    } else {
      setSierraActivities(prev => [editingActivity, ...prev]);
    }
    setIsActivityModalOpen(false);
    setEditingActivity(null);
  };

  const handleDeleteActivityClick = (activity: SierraActivity) => {
    setItemToDelete({ type: 'activity', id: activity.id, name: activity.title });
  };

  const handleGenerateIdea = useCallback(async () => {
    if (!editingActivity) return;
    setIsGenerating(true);
    setError(null);
    try {
      const newActivityIdea = await generateSierraActivityIdea();
      if (newActivityIdea) {
        setEditingActivity(prev => prev ? {
          ...prev,
          title: newActivityIdea.title,
          summary: newActivityIdea.summary,
          highlights: newActivityIdea.highlights
        } : null);
      }
    } catch (e) {
      setError('No se pudo generar una idea. Inténtalo de nuevo.');
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  }, [editingActivity]);

  return (
    <>
      <div className="space-y-16">

        {/* Cursos y Pláticas */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-text-light">Cursos y Pláticas</h2>
            {isAdmin && <Button onClick={handleAddNewCourseClick}>Añadir Curso</Button>}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <div key={course.id} className="relative group">
                <CourseCard
                  course={course}
                  currentUser={currentUser}
                  courseRegistrations={courseRegistrations}
                  setCourseRegistrations={setCourseRegistrations}
                  onShowPaymentInfo={handleShowPaymentInfo}
                />
                {isAdmin && (
                  <div className="absolute top-2 right-14 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 bg-dark-secondary/80 backdrop-blur-sm p-1 rounded-md shadow-lg">
                    <Button variant="secondary" size="sm" onClick={() => handleEditCourseClick(course)}>
                      <Icon name="edit" className="w-4 h-4" />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteCourseClick(course)}>
                      <Icon name="delete" className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* NUEVO: Contenido y Entrevistas */}
        <div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-text-light">Contenido y Entrevistas</h2>
              <p className="text-text-muted mt-2">Explora nuestras últimas entrevistas, reportajes y contenido exclusivo de la comunidad Torus.</p>
            </div>
            <a
              href="https://www.youtube.com/@TORUS-u9l"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-red-600/30 w-full sm:w-auto justify-center"
            >
              <Icon name="play" className="w-5 h-5" />
              Descubre más en YouTube
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Local Video 1 Placeholder */}
            <div className="bg-black rounded-3xl overflow-hidden shadow-2xl border border-dark-border aspect-video w-full h-full relative flex items-center justify-center p-8 text-center flex-col text-slate-400">
              <Icon name="play" className="w-16 h-16 mb-4 opacity-30 text-emerald-500" />
              <h4 className="text-xl font-bold text-slate-200 mb-2">Entrevista TORUS_1</h4>
              <p className="text-sm">Video demasiado pesado (795MB) para la web.<br />Por favor, súbelo a YouTube para incrustar el enlace aquí.</p>
            </div>

            {/* Local Video 2 Placeholder */}
            <div className="bg-black rounded-3xl overflow-hidden shadow-2xl border border-dark-border aspect-video w-full h-full relative flex items-center justify-center p-8 text-center flex-col text-slate-400">
              <Icon name="play" className="w-16 h-16 mb-4 opacity-30 text-emerald-500" />
              <h4 className="text-xl font-bold text-slate-200 mb-2">TORUS MARCHA</h4>
              <p className="text-sm">Video demasiado pesado (700MB) para la web.<br />Por favor, súbelo a YouTube para incrustar el enlace aquí.</p>
            </div>
          </div>

          {/* YouTube Videos Grid (Remaining 3) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-black rounded-2xl overflow-hidden shadow-xl border border-dark-border aspect-video w-full h-full relative group">
              <iframe
                className="absolute top-0 left-0 w-full h-full border-none"
                src="https://www.youtube.com/embed/vRLxreO7aqQ"
                title="YouTube video player 3"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="bg-black rounded-2xl overflow-hidden shadow-xl border border-dark-border aspect-video w-full h-full relative group">
              <iframe
                className="absolute top-0 left-0 w-full h-full border-none"
                src="https://www.youtube.com/embed/Zz2kKt9iPXs"
                title="YouTube video player 4"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="bg-black rounded-2xl overflow-hidden shadow-xl border border-dark-border aspect-video w-full h-full relative group">
              <iframe
                className="absolute top-0 left-0 w-full h-full border-none"
                src="https://www.youtube.com/embed/lGpKSovM10E"
                title="YouTube video player 5"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-text-light">Actividades en la Sierra</h2>
            {isAdmin && <Button onClick={handleAddNewActivityClick}>Añadir Actividad</Button>}
          </div>
          {error && <p className="text-red-300 mb-4 text-center p-3 bg-red-900/50 rounded-md">{error}</p>}
          <div className="space-y-8">
            {sierraActivities.map(activity => (
              <div key={activity.id} className="relative group">
                <SierraActivityCard activity={activity} />
                {isAdmin && (
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                    <Button variant="secondary" size="sm" onClick={() => handleEditActivityClick(activity)}>
                      <Icon name="edit" className="w-4 h-4" />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteActivityClick(activity)}>
                      <Icon name="delete" className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* --- Payment Instructions Modal --- */}
        {paymentModalCourse && (
          <Modal
            isOpen={!!paymentModalCourse}
            onClose={() => setPaymentModalCourse(null)}
            title={`Inscripción para: ${paymentModalCourse.title}`}
          >
            <div className="space-y-4 text-text-muted">
              <p>Para completar tu inscripción, por favor realiza una transferencia con los siguientes datos:</p>
              <div className="bg-dark-tertiary p-4 rounded-lg">
                <p><span className="font-semibold text-text-light">Banco:</span> BANORTE</p>
                <p><span className="font-semibold text-text-light">CLABE:</span> 072 180 01234567890 1</p>
                <p><span className="font-semibold text-text-light">Beneficiario:</span> Comunidad Torus S.A. de C.V.</p>
                <p><span className="font-semibold text-text-light">Monto:</span> ${paymentModalCourse.cost.toFixed(2)} MXN</p>
                <p className="mt-2"><span className="font-semibold text-text-light">Concepto/Referencia:</span> <span className="text-accent-green font-mono">{currentUser.nito}-{paymentModalCourse.id}</span></p>
              </div>
              <p className="text-sm">Una vez realizado el pago, un administrador confirmará tu inscripción en el sistema en un plazo de 24 horas. ¡Gracias!</p>
            </div>
            <div className="mt-6 text-right">
              <Button onClick={() => setPaymentModalCourse(null)}>Entendido</Button>
            </div>
          </Modal>
        )}

        {/* --- Modals for Editing --- */}
        {isCourseModalOpen && editingCourse && (
          <Modal isOpen={isCourseModalOpen} onClose={() => setIsCourseModalOpen(false)} title={courses.some(c => c.id === editingCourse.id) ? "Editar Curso" : "Nuevo Curso"}>
            <form onSubmit={handleUpdateCourse} className="space-y-4">
              <div><label className="text-sm font-medium text-text-muted">Título</label><input type="text" value={editingCourse.title} onChange={e => setEditingCourse({ ...editingCourse, title: e.target.value })} required className="w-full p-2 border rounded bg-dark-tertiary border-dark-border" /></div>
              <div><label className="text-sm font-medium text-text-muted">Descripción</label><textarea value={editingCourse.description} onChange={e => setEditingCourse({ ...editingCourse, description: e.target.value })} required className="w-full p-2 border rounded h-24 bg-dark-tertiary border-dark-border" /></div>
              <div><label className="text-sm font-medium text-text-muted">Costo</label><input type="number" value={editingCourse.cost} onChange={e => setEditingCourse({ ...editingCourse, cost: parseFloat(e.target.value) })} required className="w-full p-2 border rounded bg-dark-tertiary border-dark-border" /></div>
              <div><label className="text-sm font-medium text-text-muted">Tipo</label><select value={editingCourse.type} onChange={e => setEditingCourse({ ...editingCourse, type: e.target.value as CourseType })} className="w-full p-2 border rounded bg-dark-tertiary border-dark-border">
                {Object.values(CourseType).map(type => <option key={type} value={type}>{type}</option>)}
              </select></div>
              {editingCourse.type === CourseType.Presencial && <div><label className="text-sm font-medium text-text-muted">Sucursal</label><select value={editingCourse.branch} onChange={e => setEditingCourse({ ...editingCourse, branch: e.target.value as 'Del Valle' | 'Coyoacán' })} className="w-full p-2 border rounded bg-dark-tertiary border-dark-border"><option value="Del Valle">Del Valle</option><option value="Coyoacán">Coyoacán</option></select></div>}
              {editingCourse.type === CourseType.EnLineaVivo && <div><label className="text-sm font-medium text-text-muted">Enlace Reunión</label><input type="url" value={editingCourse.meetingLink} onChange={e => setEditingCourse({ ...editingCourse, meetingLink: e.target.value })} className="w-full p-2 border rounded bg-dark-tertiary border-dark-border" /></div>}
              <Button type="submit" className="w-full">Guardar Cambios</Button>
            </form>
          </Modal>
        )}

        {isActivityModalOpen && editingActivity && (
          <Modal isOpen={isActivityModalOpen} onClose={() => setIsActivityModalOpen(false)} title={sierraActivities.some(a => a.id === editingActivity.id) ? "Editar Actividad" : "Nueva Actividad"}>
            <form onSubmit={handleUpdateActivity} className="space-y-4">
              <Button type="button" onClick={handleGenerateIdea} disabled={isGenerating} variant="outline" className="w-full">
                {isGenerating ? <><Icon name="spinner" className="animate-spin" /> Generando...</> : <><Icon name="sparkles" /> Sugerir contenido con IA</>}
              </Button>
              {error && <p className="text-red-300 text-sm text-center">{error}</p>}

              <div><label className="text-sm font-medium text-text-muted">Título</label><input type="text" value={editingActivity.title} onChange={e => setEditingActivity({ ...editingActivity, title: e.target.value })} required className="w-full p-2 border rounded bg-dark-tertiary border-dark-border" /></div>
              <div><label className="text-sm font-medium text-text-muted">Resumen</label><textarea value={editingActivity.summary} onChange={e => setEditingActivity({ ...editingActivity, summary: e.target.value })} required className="w-full p-2 border rounded h-24 bg-dark-tertiary border-dark-border" /></div>
              <div><label className="text-sm font-medium text-text-muted">URL de Imagen</label><input type="url" value={editingActivity.imageUrl} onChange={e => setEditingActivity({ ...editingActivity, imageUrl: e.target.value })} required className="w-full p-2 border rounded bg-dark-tertiary border-dark-border" /></div>
              <div><label className="text-sm font-medium text-text-muted">Puntos Clave (uno por línea)</label><textarea value={editingActivity.highlights?.join('\n')} onChange={e => setEditingActivity({ ...editingActivity, highlights: e.target.value.split('\n') })} className="w-full p-2 border rounded h-20 bg-dark-tertiary border-dark-border" /></div>
              <Button type="submit" className="w-full">Guardar Actividad</Button>
            </form>
          </Modal>
        )}
      </div>

      <ConfirmationModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que quieres eliminar "${itemToDelete?.name}"? Esta acción no se puede deshacer.`}
      />
    </>
  );
};

export default CommunityView;
