import React, { useState, useEffect, useRef } from 'react';
import { Sprout, Handshake, Search, Wheat, ArrowRight, ShieldCheck, Users } from 'lucide-react';
import RegistrationModal from './RegistrationModal';
import TermsModal from './TermsModal';
import PrivacyModal from './PrivacyModal';
import FaqModal from './FaqModal';
import { ImageMapper } from '../admin/ImageMapper';
import { Icon } from '../common/Icon';

interface LandingPageProps {
    onNavigate: (path: string) => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
    const navigateTo = (path: string) => {
        onNavigate(path);
    };

    const scrollToPreviousSection = () => {
        const sectionIds = ['hero', 'nosotros', 'pilares', 'impacto', 'tramite', 'faq'];
        const currentScrollY = window.scrollY;

        for (let i = sectionIds.length - 1; i >= 0; i--) {
            const el = document.getElementById(sectionIds[i]);
            if (el && el.offsetTop < currentScrollY - 200) {
                window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
                return;
            }
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToNextSection = () => {
        const sectionIds = ['hero', 'nosotros', 'pilares', 'impacto', 'tramite', 'faq'];
        const currentScrollY = window.scrollY;

        for (let i = 0; i < sectionIds.length; i++) {
            const el = document.getElementById(sectionIds[i]);
            if (el && el.offsetTop > currentScrollY + 200) {
                window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
                return;
            }
        }
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };

    const [scrolled, setScrolled] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
    const [isFaqOpen, setIsFaqOpen] = useState(false);

    // Video Refs
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Reveal on Scroll Logic
    const revealRefs = useRef<(HTMLElement | null)[]>([]);
    const addToRefs = (el: HTMLElement | null) => {
        if (el && !revealRefs.current.includes(el)) {
            revealRefs.current.push(el);
        }
    };

    // Scroll Logic (For UI Effects only)
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setScrolled(scrollY > 50);

            if (containerRef.current) {
                const container = containerRef.current;
                const containerTop = container.offsetTop;
                const containerHeight = container.offsetHeight;
                const windowHeight = window.innerHeight;

                // Calculate basic linear progress for opacity fade
                const startScroll = containerTop;
                const endScroll = containerTop + containerHeight - windowHeight;

                if (endScroll > startScroll) {
                    let progress = (scrollY - startScroll) / (endScroll - startScroll);
                    progress = Math.max(0, Math.min(1, progress));
                    setScrollProgress(progress);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);

        // Ensure video plays
        if (videoRef.current) {
            videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('opacity-100', 'translate-y-0');
                        entry.target.classList.remove('opacity-0', 'translate-y-10');
                    }
                });
            },
            { threshold: 0.1 }
        );

        revealRefs.current.forEach((el) => {
            if (el) {
                el.classList.add('transition-all', 'duration-1000', 'opacity-0', 'translate-y-10');
                observer.observe(el);
            }
        });

        // Initial check
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
            revealRefs.current.forEach(el => el && observer.unobserve(el));
        };
    }, []);

    return (
        <div className="min-h-screen bg-[#F5F7FA] font-sans text-slate-800 overflow-x-hidden selection:bg-emerald-200 selection:text-emerald-900">

            {/* --- HEADER: Transparent & Clean --- */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center relative">
                    {/* Logo Container - Flex-1 to balance layout */}
                    <div className="flex-1 cursor-pointer flex justify-start" onClick={() => window.scrollTo(0, 0)}>
                        <img
                            src={scrolled ? "/images/torus-logo-black.png" : "/images/torus-logo-white.png"}
                            alt="Torus AC"
                            className="h-20 md:h-28 w-auto object-contain transition-all duration-300"
                        />
                    </div>

                    {/* Centered Navigation - Absolute positioning for perfect center */}
                    <div className="hidden md:flex items-center space-x-10 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        {['Nosotros', 'Pilares', 'Impacto'].map((item) => (
                            <a key={item} href={`#${item.toLowerCase()}`} className={`text-base font-medium hover:text-emerald-400 transition-colors relative group ${scrolled ? 'text-slate-600' : 'text-white/90'}`}>
                                {item}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full"></span>
                            </a>
                        ))}
                    </div>

                    {/* Action Button - Flex-1 (End aligned) */}
                    <div className="flex-1 flex justify-end">
                        <button
                            onClick={() => navigateTo('/app')}
                            className={`px-8 py-3 rounded-full text-sm font-bold hover:scale-105 transition-all duration-300 shadow-lg tracking-wide ${scrolled ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-900 border border-white/20'}`}
                        >
                            Acceso NITO
                        </button>
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION (VIDEO BACKGROUND) --- */}
            <header id="hero" ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">

                {/* Video Background */}
                <div className="absolute inset-0 bg-black z-0">
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover opacity-80"
                        src="/videos/story.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        onLoadedData={() => setVideoLoaded(true)}
                    />
                    {/* Overlay Gradient for readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60"></div>
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 w-full flex flex-col items-center justify-center text-center text-white px-6 pt-24">
                    <div ref={addToRefs} className="space-y-8 max-w-5xl">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-sm font-bold tracking-[0.2em] backdrop-blur-sm uppercase">
                            Bienvenidos a Torus AC
                        </span>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight drop-shadow-xl">
                            Cultivando un <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">
                                Futuro Sostenible
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-emerald-100 max-w-3xl mx-auto font-light leading-relaxed drop-shadow-md">
                            Creemos que el cannabis es la semilla del cambio. Trabajamos por el medio ambiente,
                            la equidad social y una gestión ética en la industria.
                        </p>

                        {!videoLoaded && (
                            <div className="text-emerald-400 text-sm animate-pulse mt-4">
                                Cargando experiencia...
                            </div>
                        )}

                        <a href="#nosotros" className="pt-12 animate-bounce cursor-pointer block hover:opacity-80 transition-opacity">
                            <span className="text-white/70 text-sm tracking-widest uppercase mb-4 block">Descubre Nuestra Historia</span>
                            <div className="p-2 border border-white/20 rounded-full inline-block backdrop-blur-sm">
                                <ArrowRight className="w-6 h-6 text-emerald-300 rotate-90" />
                            </div>
                        </a>
                    </div>
                </div>
            </header>

            {/* --- QUIÉNES SOMOS --- */}
            <section id="nosotros" className="py-24 bg-slate-50 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-50/50 -skew-x-12 transform origin-top-right z-0"></div>
                <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-emerald-200/20 rounded-full blur-[100px] z-0"></div>

                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <div ref={addToRefs} className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/50 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-200/50">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Nuestra Esencia
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                            ¿Quiénes <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Somos?</span>
                        </h2>

                        <div className="bg-white/60 backdrop-blur-sm rounded-[3rem] p-8 md:p-12 shadow-xl border border-white/50 text-lg text-slate-600 leading-relaxed text-left space-y-6 relative">
                            {/* Quote Decoration */}
                            <div className="absolute -top-6 -left-4 text-emerald-200 opacity-50">
                                <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.896 14.321 16.067 14.929 15.513C15.538 14.959 16.485 14.682 17.771 14.682V14.282C17.771 13.125 17.424 12.169 16.73 11.414C16.035 10.66 15.029 9.923 13.713 9.204L14.707 6C16.804 7.238 18.358 8.683 19.368 10.334C20.378 11.986 20.884 13.916 20.884 16.125V21H14.017ZM3.01705 21L3.01706 18C3.01706 16.896 3.32131 16.067 3.92906 15.513C4.53781 14.959 5.48512 14.682 6.77106 14.682V14.282C6.77106 13.125 6.42394 12.169 5.72975 11.414C5.03556 10.66 4.02906 9.923 2.71269 9.204L3.70706 6C5.80394 7.238 7.35844 8.683 8.36831 10.334C9.37819 11.986 9.88312 13.916 9.88312 16.125V21H3.01705Z" /></svg>
                            </div>

                            <p>
                                <span className="font-bold text-emerald-700">Torus AC</span> es una asociación civil sin fines de lucro dedicada al desarrollo sostenible y la equidad social en la industria del cannabis en México. Facilitamos la unión entre individuos con autorización sanitaria y brindamos apoyo integral.
                            </p>
                            <p>
                                Nuestra visión es la creación de un <span className="font-semibold text-slate-800 bg-emerald-100 px-2 py-0.5 rounded">modelo de cultivo colectivo</span> en colaboración con las comunidades rurales de la <span className="text-emerald-600 font-medium">Sierra de Guerrero</span>.
                            </p>
                            <div className="grid md:grid-cols-2 gap-6 py-4">
                                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex items-start gap-3">
                                    <div className="bg-white p-2 rounded-lg shadow-sm text-emerald-600"><Sprout className="w-5 h-5" /></div>
                                    <p className="text-sm">Promovemos una industria libre de prácticas indebidas, enfocada en el beneficio comunitario.</p>
                                </div>
                                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100 flex items-start gap-3">
                                    <div className="bg-white p-2 rounded-lg shadow-sm text-blue-600"><Users className="w-5 h-5" /></div>
                                    <p className="text-sm">Colaboramos con instituciones académicas y científicas para impulsar la investigación.</p>
                                </div>
                            </div>
                            <p className="font-medium text-emerald-800 border-l-4 border-emerald-500 pl-4 italic">
                                "Nuestro enfoque se basa en la salud, la ética, la transparencia y el desarrollo sostenible."
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- STICKY STORYTELLING: Nuestros Pilares --- */}
            <section id="pilares" className="relative bg-[#0f172a] py-32 text-white overflow-hidden">
                {/* Dark Theme with Vibrant Glows */}
                <div className="absolute top-0 left-[20%] w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 right-[20%] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-20 relative z-10">

                    {/* Sticky Left Title */}
                    <div className="lg:w-1/3 lg:sticky lg:top-32 lg:h-fit pt-10">
                        <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm mb-2 block">Fundamentos</span>
                        <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
                            Nuestros <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Pilares</span>
                        </h2>
                        <p className="text-lg text-slate-400 leading-relaxed max-w-xs border-l-2 border-slate-700 pl-6">
                            Valores inquebrantables que sostienen nuestro compromiso con el medio ambiente y la sociedad.
                        </p>
                    </div>

                    {/* Scrollable Cards - Dark Glassmorphism */}
                    <div className="lg:w-2/3 space-y-12">
                        {[
                            { title: "Sostenibilidad", Icon: Sprout, desc: "Respeto absoluto por la tierra y el medio ambiente. Prácticas regenerativas que devuelven vida al suelo.", color: "from-emerald-500/20 to-emerald-900/20 border-emerald-500/30 text-emerald-400" },
                            { title: "Equidad", Icon: Handshake, desc: "Justicia social para el campesino y acceso justo para el asociado. Un modelo donde todos ganan.", color: "from-blue-500/20 to-blue-900/20 border-blue-500/30 text-blue-400" },
                            { title: "Transparencia", Icon: Search, desc: "Honestidad en nuestra gestión y en la calidad de lo que producimos. Trazabilidad total.", color: "from-amber-500/20 to-amber-900/20 border-amber-500/30 text-amber-400" }
                        ].map((item, idx) => (
                            <div key={idx} ref={addToRefs} className={`p-10 rounded-[3rem] bg-gradient-to-br ${item.color} border backdrop-blur-xl transition-transform hover:-translate-y-2 duration-500 group`}>
                                <div className="flex flex-col md:flex-row md:items-center gap-6">
                                    <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center backdrop-blur-md shadow-inner group-hover:scale-110 transition-transform duration-300 border border-white/10">
                                        <item.Icon className="w-10 h-10" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-bold text-white mb-2">{item.title}</h3>
                                        <p className="text-lg text-slate-300 leading-relaxed font-light">{item.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- IMPACTO REAL --- */}
            <section id="impacto" className="py-32 bg-slate-50 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div ref={addToRefs} className="text-center mb-20">
                        <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm">Desarrollo Comunitario</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4">Un Enfoque Integral</h2>
                        <p className="mt-6 text-xl text-slate-500 max-w-2xl mx-auto">
                            Más allá de la producción, generamos un ecosistema de bienestar.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: "Cultivo Responsable", desc: "Nos comprometemos a cultivar cannabis libre de pesticidas y otros agentes contaminantes, priorizando la salud y minimizando el impacto ambiental.", Icon: Wheat },
                            { title: "Transparencia Total", desc: "Garantizamos la trazabilidad completa, desde la siembra hasta la cosecha, brindando confianza sobre el origen y la calidad de nuestros productos.", Icon: ShieldCheck },
                            { title: "Alianza Comunitaria", desc: "Mediante contratos de cultivo colectivo, trabajamos con asociados de la sierra de Guerrero, promoviendo prácticas agrícolas sostenibles y justas.", Icon: Users }
                        ].map((card, i) => (
                            <div key={i} ref={addToRefs} className="bg-slate-50 rounded-3xl p-8 hover:bg-emerald-50 transition-colors duration-300 text-center group border border-slate-100 shadow-sm hover:shadow-md">
                                <div className="w-16 h-16 mx-auto bg-white rounded-full shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-slate-100">
                                    <card.Icon className="w-8 h-8 text-emerald-700" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">{card.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CALIDAD & CTA --- */}
            <section id="tramite" className="bg-[#1a1f2c] text-white py-32 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <div ref={addToRefs} className="mb-20 space-y-8">
                        <h2 className="text-4xl font-bold mb-6 text-emerald-400">Trámite</h2>
                        <div className="text-xl text-slate-300 leading-relaxed space-y-6">
                            <p>
                                En nuestra asociación, nos enfocamos en reunir a personas que poseen la autorización sanitaria para el cultivo de cannabis. Si aún no cuentas con esta autorización, no te preocupes, estaremos encantados de brindarte ayuda para tramitarla.
                            </p>
                            <p>
                                Nuestro equipo estará disponible para asesorarte y brindarte apoyo en todo el proceso de obtención de la autorización sanitaria, para que puedas unirte a nuestra asociación y participar en el cultivo colectivo de manera legal y responsable.
                            </p>
                            <p className="font-medium text-white">
                                ¡Únete a nosotros y sé parte de este emocionante proyecto en la sierra de Guerrero!
                            </p>
                        </div>
                    </div>

                    <div ref={addToRefs} className="bg-emerald-600 rounded-[50px] p-12 md:p-16 shadow-2xl shadow-emerald-900/50 transform hover:scale-105 transition-transform duration-500">
                        <h2 className="text-3xl md:text-5xl font-black mb-6">Cultivando un Futuro Sostenible</h2>
                        <p className="text-emerald-100 text-lg mb-10 max-w-3xl mx-auto leading-relaxed">
                            Además, al unirte a nuestra asociación, contribuirás al desarrollo económico de las comunidades de la sierra de Guerrero. Estamos comprometidos en apoyar diversas áreas dentro de estas comunidades, generando oportunidades de empleo y mejorando la calidad de vida de sus habitantes. Creemos firmemente que el cultivo de cannabis puede ser una fuente de prosperidad y desarrollo sostenible para estas regiones.
                        </p>
                        <button onClick={() => setIsModalOpen(true)} className="bg-white text-emerald-900 px-10 py-5 rounded-full font-bold text-lg hover:bg-emerald-50 transition-colors shadow-lg">
                            Comenzar Registro
                        </button>
                        <div className="border-t border-emerald-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-emerald-200/60 text-sm">
                            <p>&copy; {new Date().getFullYear()} Torus Comunidad. Todos los derechos reservados.</p>
                            <div className="flex items-center gap-6 mt-4 md:mt-0">
                                <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-white transition-colors">Privacidad</button>
                                <button onClick={() => setIsTermsOpen(true)} className="hover:text-white transition-colors">Términos</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FAQ BUTTON SECTION --- */}
            <section id="faq" className="bg-gradient-to-br from-emerald-600 to-teal-600 py-16 md:py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <div ref={addToRefs}>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider mb-6">
                            <span className="text-xl">❓</span>
                            Preguntas Frecuentes
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                            ¿Tienes dudas sobre el trámite?
                        </h2>
                        <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
                            Consulta nuestras preguntas frecuentes para resolver tus dudas sobre costos, duración y proceso
                        </p>
                        <button
                            onClick={() => setIsFaqOpen(true)}
                            className="bg-white text-emerald-900 px-9 py-5 rounded-full font-bold text-xl hover:bg-emerald-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 inline-flex items-center gap-2"
                        >
                            <span>Ver Preguntas Frecuentes</span>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </section>

            {/* Modals */}
            <RegistrationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onContinue={() => navigateTo('/tramites')}
            />

            <TermsModal
                isOpen={isTermsOpen}
                onClose={() => setIsTermsOpen(false)}
            />

            <PrivacyModal
                isOpen={isPrivacyOpen}
                onClose={() => setIsPrivacyOpen(false)}
            />

            {/* FAQ Modal */}
            <FaqModal
                isOpen={isFaqOpen}
                onClose={() => setIsFaqOpen(false)}
                onStartRegistration={() => setIsModalOpen(true)}
            />


            {/* --- FOOTER --- */}
            <footer className="bg-[#11141d] text-slate-500 py-12 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm items-center">
                    <div className="flex items-center justify-center md:justify-start gap-4">
                        <img src="/images/torus-logo-white.png" alt="Torus AC" className="h-6 w-auto opacity-80" />
                        <span>&copy; {new Date().getFullYear()}</span>
                    </div>
                    {/* Redes Sociales Centradas */}
                    <div className="flex gap-4 items-center justify-center">
                        <a href="https://www.instagram.com/torus_ac/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors relative group" title="Instagram">
                            <Icon name="instagram" className="w-5 h-5" />
                            <span className="absolute bottom-[120%] left-1/2 -translate-x-1/2 mb-1 w-max px-2 py-1 bg-slate-800 text-white text-[10px] font-bold uppercase rounded opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none drop-shadow-md">Instagram</span>
                        </a>
                        <a href="https://www.facebook.com/profile.php?id=61552677463025&sk=about" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors relative group" title="Facebook">
                            <Icon name="facebook" className="w-5 h-5" />
                            <span className="absolute bottom-[120%] left-1/2 -translate-x-1/2 mb-1 w-max px-2 py-1 bg-slate-800 text-white text-[10px] font-bold uppercase rounded opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none drop-shadow-md">Facebook</span>
                        </a>
                        <a href="https://www.tiktok.com/@torus.ac4?_t=zs-8zppzl6ivrx&_r=1" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors relative group" title="TikTok">
                            <Icon name="tiktok" className="w-5 h-5" />
                            <span className="absolute bottom-[120%] left-1/2 -translate-x-1/2 mb-1 w-max px-2 py-1 bg-slate-800 text-white text-[10px] font-bold uppercase rounded opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none drop-shadow-md">TikTok</span>
                        </a>
                        <a href="https://www.youtube.com/@TORUS-u9l" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors relative group" title="YouTube">
                            <Icon name="youtube" className="w-6 h-6" />
                            <span className="absolute bottom-[120%] left-1/2 -translate-x-1/2 mb-1 w-max px-2 py-1 bg-slate-800 text-white text-[10px] font-bold uppercase rounded opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none drop-shadow-md">YouTube</span>
                        </a>
                    </div>
                    <div className="flex gap-6 justify-center md:justify-end">
                        <button onClick={() => setIsPrivacyOpen(true)} className="hover:text-emerald-400 transition-colors">Privacidad</button>
                        <button onClick={() => setIsTermsOpen(true)} className="hover:text-emerald-400 transition-colors">Términos</button>
                    </div>
                </div>
            </footer>

            {/* Scroll Buttons Widget */}
            <div className={`fixed bottom-24 right-8 md:bottom-8 md:right-8 z-50 flex flex-col gap-2 transition-all duration-500 ${scrolled ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20 pointer-events-none'}`}>
                <button
                    onClick={scrollToPreviousSection}
                    className="p-3 rounded-full bg-emerald-600/90 backdrop-blur-sm text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-300 hover:bg-emerald-500 hover:scale-110"
                    aria-label="Subir a la sección anterior"
                    title="Subir sección"
                >
                    <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </button>
                <button
                    onClick={scrollToNextSection}
                    className="p-3 rounded-full bg-emerald-600/90 backdrop-blur-sm text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-300 hover:bg-emerald-500 hover:scale-110"
                    aria-label="Bajar a la siguiente sección"
                    title="Bajar sección"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
