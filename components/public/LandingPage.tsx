
import React from 'react';
import { Button } from '../common/Button';

interface LandingPageProps {
    onNavigate: (path: string) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
    const navigateTo = (path: string) => {
        onNavigate(path);
    };

    const containerRef = React.useRef<HTMLDivElement>(null);
    const videoRef = React.useRef<HTMLVideoElement>(null);

    React.useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current || !videoRef.current) return;

            const container = containerRef.current;
            const video = videoRef.current;

            const rect = container.getBoundingClientRect();
            const totalScrollableDistance = container.offsetHeight - window.innerHeight;

            // Calculate progress: 0 when top sticks, 1 when finished scrolling
            let progress = -rect.top / totalScrollableDistance;
            progress = Math.max(0, Math.min(1, progress));

            if (video.duration && !isNaN(video.duration)) {
                video.currentTime = video.duration * progress;
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Initial sync
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen font-sans text-gray-800">

            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md shadow-sm z-50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex-shrink-0 flex items-center gap-2">
                            {/* Logo Placeholder */}
                            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl">T</div>
                            <span className="font-bold text-2xl tracking-tighter text-emerald-900">TORUS AC</span>
                        </div>
                        <div className="hidden md:flex space-x-8 items-center">
                            <a href="#about" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">Nosotros</a>
                            <a href="#impact" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">Impacto</a>
                            <a href="#contact" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">Contacto</a>
                            <Button onClick={() => navigateTo('/tramites')} variant="secondary" className="!py-2 !px-4 !text-sm">
                                Trámites Nuevos
                            </Button>
                            <Button onClick={() => navigateTo('/app')} className="!py-2 !px-4 !text-sm bg-emerald-700 hover:bg-emerald-800 shadow-lg hover:shadow-xl transition-all">
                                Acceso Socios
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
                {/* ... (existing hero content same as before) ... */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-100 opacity-70"></div>
                    <div className="absolute right-0 top-0 w-1/2 h-full bg-emerald-100/50 rounded-l-[100px] transform translate-x-20"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-emerald-100 text-emerald-700 text-sm font-bold tracking-wide mb-6 animate-fade-in-up">
                        ASOCIACIÓN CIVIL SIN FINES DE LUCRO
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 leading-tight">
                        lo logramos <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                            Futuro Sostenible
                        </span>
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 mb-10 leading-relaxed">
                        Sostenibilidad, equidad y transparencia. Comprometidos con el medio ambiente,
                        la justicia social y la gestión ética en la industria.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Button onClick={() => navigateTo('/tramites')} className="!text-lg !px-8 !py-4 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                            Únete a la Comunidad
                        </Button>
                        <Button onClick={() => window.open('https://api.whatsapp.com/message/K4BXKJMEZU2RP1', '_blank')} variant="secondary" className="!text-lg !px-8 !py-4 border-2 border-emerald-100 hover:border-emerald-200">
                            Contáctanos
                        </Button>
                    </div>
                </div>
            </div>

            {/* SCROLLYTELLING VIDEO SECTION */}
            <div ref={containerRef} className="relative h-[300vh] bg-black">
                {/* Sticky Container */}
                <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
                    {/* Video */}
                    <video
                        ref={videoRef}
                        src="/videos/story.mp4"
                        className="absolute w-full h-full object-cover opacity-60"
                        muted
                        playsInline
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/80"></div>

                    {/* Text Overlay Container */}
                    <div className="relative z-10 text-center text-white p-8 max-w-4xl">
                        <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight drop-shadow-lg">
                            Una Historia de Raíces
                        </h2>
                        <p className="text-xl md:text-2xl font-light text-gray-200 drop-shadow-md">
                            Descubre cómo transformamos la pasión por la tierra en una comunidad vibrante.
                        </p>
                    </div>
                </div>

                {/* Scrollable Text Cards */}
                <div className="absolute top-[80vh] left-4 md:left-24 max-w-md bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-white shadow-2xl">
                    <h3 className="text-2xl font-bold mb-4 text-emerald-300">1. El Origen</h3>
                    <p className="text-lg">Todo comienza en la sierra, donde nuestros agricultores cuidan cada planta con técnicas ancestrales y respeto por la naturaleza.</p>
                </div>

                <div className="absolute top-[160vh] right-4 md:right-24 max-w-md bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-white shadow-2xl text-right">
                    <h3 className="text-2xl font-bold mb-4 text-emerald-300">2. La Comunidad</h3>
                    <p className="text-lg">No somos solo productores, somos una familia de más de 1,000 asociados unidos por el desarrollo mutuo y la educación.</p>
                </div>

                <div className="absolute top-[240vh] left-4 md:left-24 max-w-md bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 text-white shadow-2xl">
                    <h3 className="text-2xl font-bold mb-4 text-emerald-300">3. El Futuro</h3>
                    <p className="text-lg">Con tecnología y transparencia, llevamos lo mejor de nuestra tierra directamente a ti, asegurando calidad y legalidad.</p>
                </div>
            </div>

            {/* Features / Principles */}
            <div id="about" className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Nuestros Principios</h2>
                        <p className="mt-4 text-lg text-gray-500">Los pilares que sostienen nuestra comunidad.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { title: "Sostenibilidad", icon: "🌱", desc: "Prácticas agrícolas regenerativas que protegen nuestra tierra." },
                            { title: "Equidad Social", icon: "🤝", desc: "Justicia y oportunidades iguales para todos los miembros." },
                            { title: "Transparencia", icon: "🔍", desc: "Gestión clara y ética en cada paso del proceso." }
                        ].map((feature, idx) => (
                            <div key={idx} className="group p-8 bg-gray-50 rounded-2xl hover:bg-emerald-50 transition-colors duration-300 border border-gray-100 hover:border-emerald-100">
                                <div className="text-4xl mb-6 bg-white w-16 h-16 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-emerald-900 py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl font-bold text-white mb-6">¿Listo para hacer la diferencia?</h2>
                    <p className="text-emerald-100 text-xl mb-10">
                        Únete a nuestra asociación y sé parte del cambio positivo. Accede a productos cultivados con amor en la sierra de Guerrero.
                    </p>
                    <Button onClick={() => navigateTo('/tramites')} className="bg-white !text-emerald-900 hover:bg-gray-100 !text-lg px-10 py-4 shadow-lg">
                        Comenzar Trámite
                    </Button>
                </div>
            </div>

            {/* Footer */}
            <footer id="contact" className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <span className="text-2xl font-bold text-white">TORUS AC</span>
                        <p className="mt-4 text-sm text-gray-400">
                            Comunidad dedicada al desarrollo sostenible y bienestar social.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Enlaces</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/tramites" className="hover:text-emerald-400 transition-colors">Trámites</a></li>
                            <li><a href="/app" className="hover:text-emerald-400 transition-colors">Portal Socios</a></li>
                            <li><a href="https://linktr.ee/TorusAc" target="_blank" className="hover:text-emerald-400 transition-colors">Linktree</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contacto</h4>
                        <p className="text-sm mb-2">📞 +52 55 2119 9427</p>
                        <div className="flex gap-4 mt-4">
                            {/* Social Icons Placeholder */}
                            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-emerald-600 cursor-pointer transition-colors">IG</div>
                            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-emerald-600 cursor-pointer transition-colors">FB</div>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
                    &copy; 2025 Torus AC. Todos los derechos reservados.
                </div>
            </footer>
        </div>
    );
}
