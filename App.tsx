
import React, { useState, useEffect } from 'react';
import { AppView, User, Product, Course, SierraActivity, Reservation, CourseRegistration } from './types';
import { MEMBER_NAV_ITEMS, ADMIN_NAV_ITEMS } from './constants';
import Navbar from './components/Navbar';
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
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
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

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {

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
      const fetchData = async () => {
        try {
          // Fetch Products
          const productsSnapshot = await getDocs(collection(db, 'products'));
          const productsData = productsSnapshot.docs.map(doc => doc.data() as Product);
          setProducts(productsData);

          // Fetch Categories (derive from products or fetch if stored separately)
          // For now, we can derive unique categories from products
          const uniqueCategories = Array.from(new Set(productsData.map(p => p.category)));
          setCategories(uniqueCategories);

          // Fetch Courses
          const coursesSnapshot = await getDocs(collection(db, 'courses'));
          setCourses(coursesSnapshot.docs.map(doc => doc.data() as Course));

          // Fetch Sierra Activities
          const activitiesSnapshot = await getDocs(collection(db, 'sierra_activities'));
          setSierraActivities(activitiesSnapshot.docs.map(doc => doc.data() as SierraActivity));

          // Fetch Reservations (filter by user if not admin)
          // TODO: Implement proper query filtering
          const reservationsSnapshot = await getDocs(collection(db, 'reservations'));
          const allReservations = reservationsSnapshot.docs.map(doc => doc.data() as Reservation);

          if (currentUser.role === 'admin') {
            setReservations(allReservations);
            // Fetch all users for admin
            const usersSnapshot = await getDocs(collection(db, 'users'));
            setUsers(usersSnapshot.docs.map(doc => doc.data() as User));
          } else {
            setReservations(allReservations.filter(r => r.userNito === currentUser.nito));
          }

        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
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

  return (
    <div className="min-h-screen text-text-primary flex flex-col">
      <header className="w-full bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50 border-b border-border-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-accent-green tracking-wider">TORUS</h1>
            </div>
            <Navbar
              navItems={navItems}
              currentView={currentView}
              setCurrentView={setCurrentView}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          {renderView()}
        </div>
      </main>

      <WhatsAppButton />

      <footer className="w-full bg-white/80 backdrop-blur-sm text-text-secondary py-4 mt-8 border-t border-border-light">
        <div className="container mx-auto text-center text-sm">
          &copy; 2025 Comunidad Torus. Todos los derechos reservados.
        </div>
      </footer>
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