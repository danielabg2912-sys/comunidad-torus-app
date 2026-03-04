
import React, { useState, useEffect } from 'react';
import { AppView, User, Product, Course, SierraActivity, Reservation, CourseRegistration } from './types';
import { MEMBER_NAV_ITEMS, ADMIN_NAV_ITEMS } from './constants';
import ProfileView from './components/ProfileView';
import BookingView from './components/BookingView';
import MenuView from './components/MenuView';
import CommunityView from './components/CommunityView';
import LoginView from './components/LoginView';
import AdminView from './components/AdminView';
import LegalTrackingView from './components/LegalTrackingView';
import { WhatsAppButton } from './components/WhatsAppButton';
import { auth, db } from './services/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, collection, onSnapshot } from 'firebase/firestore';
import Sidebar from './components/Sidebar';
import PaperworkView from './components/public/PaperworkView';
import LandingPage from './components/public/LandingPage';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("App Error Boundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-xl w-full bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-red-600 mb-4 border-b pb-2">Error de Aplicación</h1>
            <p className="text-gray-700 mb-4">Se ha producido un error inesperado. Por favor comparte este mensaje con el soporte.</p>
            <div className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-64 mb-6 border border-gray-200">
              <code className="text-sm font-mono text-red-800 break-words">
                {this.state.error && this.state.error.toString()}
              </code>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
            >
              Recargar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const AppContent: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.Profile);
  const [loading, setLoading] = useState(true);
  const [isPublicRoute, setIsPublicRoute] = useState(false);
  const [showLanding, setShowLanding] = useState(false);

  // App-wide state
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [sierraActivities, setSierraActivities] = useState<SierraActivity[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const [courseRegistrations, setCourseRegistrations] = useState<CourseRegistration[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = currentUser?.role === 'admin' ? ADMIN_NAV_ITEMS : MEMBER_NAV_ITEMS;

  useEffect(() => {
    const path = window.location.pathname;

    // Check for public routes
    if (path === '/tramites') {
      setIsPublicRoute(true);
      setLoading(false);
      return;
    }

    if (path === '/') {
      setShowLanding(true);
      setLoading(false);
      return;
    }

    if (path === '/app') {
      setShowLanding(false);
      setIsPublicRoute(false);
      setLoading(false);
      // Fallthrough to auth check
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      // ...


      // ... existing auth logic ...
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.email!);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setCurrentUser(userDoc.data() as User);
        }
      } else {
        setCurrentUser(null);
        setCurrentView(AppView.Profile);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch data when user is logged in
  useEffect(() => {
    if (currentUser) {
      // Real-time Products Listener
      const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
        const productsData = snapshot.docs
          .map(doc => ({ ...doc.data(), id: doc.id } as Product))
          .filter((p: any) => !p.hidden);
        setProducts(productsData);

        const uniqueCategories = Array.from(new Set(productsData.map(p => p.category)));
        setCategories(uniqueCategories);
      });

      // Real-time Courses Listener
      const unsubCourses = onSnapshot(collection(db, 'courses'), (snapshot) => {
        setCourses(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Course)));
      });

      // Real-time Sierra Activities Listener
      const unsubActivities = onSnapshot(collection(db, 'sierra_activities'), (snapshot) => {
        setSierraActivities(snapshot.docs.map(doc => doc.data() as SierraActivity));
      });

      // Real-time Reservations Listener
      const unsubReservations = onSnapshot(collection(db, 'reservations'), (snapshot) => {
        const allReservations = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Reservation));

        if (currentUser.role === 'admin') {
          setReservations(allReservations);
        } else {
          setReservations(allReservations.filter(r => r.userNito === currentUser.nito));
        }
      });

      let unsubUsers = () => { };
      if (currentUser.role === 'admin') {
        // Real-time Users Listener (Admin Only)
        unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
          setUsers(snapshot.docs.map(doc => doc.data() as User));
        });
      }

      // Cleanup function
      return () => {
        unsubProducts();
        unsubCourses();
        unsubActivities();
        unsubReservations();
        unsubUsers();
      };
    }
  }, [currentUser]);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentView(user.role === 'admin' ? AppView.Admin : AppView.Profile);
  };

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setCurrentView(AppView.Profile);
  };

  const handleNavigate = (path: string) => {
    window.history.pushState({}, '', path);
    if (path === '/') {
      setShowLanding(true);
      setIsPublicRoute(false);
    } else if (path === '/tramites') {
      setIsPublicRoute(true);
      setShowLanding(false);
    } else {
      setShowLanding(false);
      setIsPublicRoute(false);
    }
  };

  const renderView = () => {
    if (!currentUser) return null;

    if (currentUser.role === 'admin' && currentView === AppView.Admin) {
      return <AdminView
        currentUser={currentUser}
        products={products}
        setProducts={setProducts}
        categories={categories}
        setCategories={setCategories}
        users={users}
        setUsers={setUsers}
        reservations={reservations}
        setReservations={setReservations}
        courses={courses}
        setCourses={setCourses}
      />;
    }

    switch (currentView) {
      case AppView.Profile:
        return <ProfileView currentUser={currentUser} users={users} setUsers={setUsers} reservations={reservations} setReservations={setReservations} />;
      case AppView.Booking:
        return <BookingView currentUser={currentUser} reservations={reservations} setReservations={setReservations} courses={courses} />;
      case AppView.Menu:
        return <MenuView products={products} categories={categories} />;
      case AppView.Community:
        return <CommunityView
          currentUser={currentUser}
          courses={courses}
          setCourses={setCourses}
          sierraActivities={sierraActivities}
          setSierraActivities={setSierraActivities}
          courseRegistrations={courseRegistrations}
          setCourseRegistrations={setCourseRegistrations}
        />;
      case AppView.LegalTracking:
        return <LegalTrackingView currentUser={currentUser} />;
      default:
        return <ProfileView currentUser={currentUser} users={users} setUsers={setUsers} reservations={reservations} setReservations={setReservations} />;
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-accent-green font-semibold text-xl">Cargando...</div>;
  }

  // PUBLIC ROUTE RENDER
  // PUBLIC ROUTE RENDER
  if (showLanding) {
    return <LandingPage onNavigate={handleNavigate} />;
  }

  if (isPublicRoute) {
    return <PaperworkView />;
  }

  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }


  // RENDER LAYOUT
  return (
    <div className="min-h-screen bg-[#F5F7FA] text-slate-900 flex relative overflow-hidden font-sans selection:bg-emerald-500/30">

      {/* Background Decor (Matching Landing Page) */}
      {!showLanding && !isPublicRoute && currentUser && (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] bg-emerald-100/40 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-float"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-teal-100/40 rounded-full blur-[100px] mix-blend-multiply opacity-70 animate-float-delayed"></div>
          <div className="absolute top-[20%] left-[20%] w-[30vw] h-[30vw] bg-white rounded-full blur-[80px] mix-blend-overlay opacity-50"></div>
        </div>
      )}

      {/* Public Pages Wrapper */}
      {(showLanding || isPublicRoute || !currentUser) ? (
        <div className="w-full flex-1 flex flex-col z-10">
          {showLanding ? <LandingPage onNavigate={handleNavigate} /> :
            isPublicRoute ? <PaperworkView /> :
              <LoginView onLoginSuccess={handleLoginSuccess} />
          }
        </div>
      ) : (
        /* Authenticated Dashboard Layout */
        <>
          <Sidebar
            currentView={currentView}
            setCurrentView={setCurrentView}
            onLogout={handleLogout}
            isOpen={isSidebarOpen}
            setIsOpen={setIsSidebarOpen}
            navItems={navItems}
            currentUser={currentUser}
          />

          <main className="flex-1 flex flex-col min-w-0 z-10 relative transition-all duration-300">
            {/* Mobile Header */}
            <header className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 h-16 flex items-center justify-between">
              <div className="font-bold text-lg text-slate-800">TORUS</div>
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                <i className="fas fa-bars text-xl"></i> {/* Fallback icon if Icon component not available here easily, or use simple SVG */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              </button>
            </header>

            <div id="main-scroll-container" className="flex-1 p-4 sm:p-8 lg:p-12 overflow-y-auto w-full max-w-7xl mx-auto">
              {renderView()}
            </div>
          </main>
        </>
      )}

      {/* WhatsApp Button (keep clear of sidebar on desktop) */}
      <div className="fixed bottom-6 right-6 z-50">
        <WhatsAppButton />
      </div>

    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
};

export default App;