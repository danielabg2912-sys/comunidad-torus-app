import React, { useState, useMemo } from 'react';
import { doc, addDoc, updateDoc, deleteDoc, collection } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Product, User, Reservation, Course, CourseType } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { Icon } from './common/Icon';
import { Modal } from './common/Modal';
import { sendCancellationNotification } from '../services/email';
import { ConfirmationModal } from './common/ConfirmationModal';

import { InventoryUploader } from './admin/InventoryUploader';

interface AdminViewProps {
    currentUser: User;
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
    categories: string[];
    setCategories: React.Dispatch<React.SetStateAction<string[]>>;
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    reservations: Reservation[];
    setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
    courses: Course[];
    setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
}

type AdminTab = 'products' | 'reservations' | 'categories' | 'members' | 'courses' | 'legal-tracking';
type ItemToDelete = {
    type: 'product' | 'category' | 'member' | 'reservation' | 'course';
    id: string;
    name: string;
}

const AdminView: React.FC<AdminViewProps> = ({ currentUser, products, setProducts, categories, setCategories, users, setUsers, reservations, setReservations, courses, setCourses }) => {
    const [activeTab, setActiveTab] = useState<AdminTab>('products');

    // --- Modals and Editing State ---
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editingCategory, setEditingCategory] = useState<{ oldName: string, newName: string } | null>(null);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [selectedLegalUser, setSelectedLegalUser] = useState<User | null>(null); // For Legal Tracking
    const [editingLegalStatus, setEditingLegalStatus] = useState<{ user: User, status: any, index?: number } | null>(null); // For Add/Edit Legal Item
    const [itemToDelete, setItemToDelete] = useState<ItemToDelete | null>(null);

    // --- Filter States ---
    const [productSearchQuery, setProductSearchQuery] = useState('');
    const [reservationFilters, setReservationFilters] = useState({ search: '', branch: 'all', date: '', status: 'all', purpose: 'all' });
    const [memberSearchQuery, setMemberSearchQuery] = useState('');
    const [searchTerm, setSearchTerm] = useState(''); // Specific for Legal Tracking


    // --- Form State for Adding New Items ---
    const [newProduct, setNewProduct] = useState({ name: '', category: categories[0] || '', description: '', properties: '', imageUrl: 'https://picsum.photos/seed/new/400/400' });
    const [newCategory, setNewCategory] = useState('');
    const [newUser, setNewUser] = useState({ nito: '', name: '', email: '', password: '', role: 'member' as 'member' | 'admin' });
    const [newCourse, setNewCourse] = useState<Partial<Course>>({ title: '', type: CourseType.Presencial, description: '', cost: 0, branch: 'Del Valle' });

    // --- Confirmation and Deletion Logic ---
    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;

        const { type, id } = itemToDelete;

        switch (type) {
            case 'product':
                setProducts(prev => prev.filter(p => p.id !== id));
                break;
            case 'category':
                setCategories(prev => prev.filter(c => c !== id));
                break;
            case 'member':
                setUsers(prev => prev.filter(u => u.nito !== id));
                break;
            case 'reservation':
                // Instead of deleting, mark as cancelled
                setReservations(prev => prev.map(r => {
                    if (r.id === id) {
                        // Look up user for email
                        const user = users.find(u => u.nito === r.userNito);
                        if (user) {
                            sendCancellationNotification(r, user.email, r.userName);
                        }
                        return { ...r, status: 'cancelled' };
                    }
                    return r;
                }));
                break;
            case 'course':
                try {
                    await deleteDoc(doc(db, 'courses', id));
                    setCourses(prev => prev.filter(c => c.id !== id));
                } catch (error) {
                    console.error("Error removing course:", error);
                    alert("Error al eliminar el curso");
                }
                break;
            default:
                break;
        }
        setItemToDelete(null);
    };

    // --- Product Handlers ---
    const handleAddProduct = (e: React.FormEvent) => {
        e.preventDefault();
        const productToAdd: Product = {
            id: `prod-${Date.now()}-${Math.random().toString(16).slice(2)}`,
            ...newProduct,
            availability: { 'Del Valle': 10, 'Coyoacán': 10 }
        };
        setProducts(prev => [productToAdd, ...prev]);
        setNewProduct({ name: '', category: categories[0] || '', description: '', properties: '', imageUrl: 'https://picsum.photos/seed/new/400/400' });
    };

    const handleDeleteProductClick = (product: Product) => {
        setItemToDelete({ type: 'product', id: product.id, name: product.name });
    };

    const handleEditProductClick = (product: Product) => {
        setEditingProduct(product);
        setIsProductModalOpen(true);
    };

    const handleUpdateProduct = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
        setIsProductModalOpen(false);
        setEditingProduct(null);
    };

    // --- Category Handlers ---
    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCategory && !categories.includes(newCategory)) {
            setCategories(prev => [...prev, newCategory].sort());
            setNewCategory('');
        }
    };

    const handleDeleteCategoryClick = (categoryName: string) => {
        setItemToDelete({ type: 'category', id: categoryName, name: categoryName });
    };

    const handleEditCategoryClick = (categoryName: string) => {
        setEditingCategory({ oldName: categoryName, newName: categoryName });
    };

    const handleUpdateCategory = () => {
        if (!editingCategory || editingCategory.oldName === editingCategory.newName) {
            setEditingCategory(null);
            return;
        }
        setCategories(prev => prev.map(c => c === editingCategory.oldName ? editingCategory.newName : c).sort());
        setProducts(prev => prev.map(p => p.category === editingCategory.oldName ? { ...p, category: editingCategory.newName } : p));
        setEditingCategory(null);
    };

    // --- User Handlers ---
    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        setUsers(prev => [...prev, newUser]);
        setNewUser({ nito: '', name: '', email: '', password: '', role: 'member' });
    }

    const handleDeleteUserClick = (user: User) => {
        setItemToDelete({ type: 'member', id: user.nito, name: user.name });
    };

    const handleEditUserClick = (user: User) => {
        setEditingUser(user);
        setIsUserModalOpen(true);
    };

    const handleUpdateUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;
        setUsers(prev => prev.map(u => u.nito === editingUser.nito ? editingUser : u));
        setIsUserModalOpen(false);
        setEditingUser(null);
    };

    // --- Reservation Handlers ---
    const handleDeleteReservationClick = (reservation: Reservation) => {
        setItemToDelete({ type: 'reservation', id: reservation.id, name: `la cita de ${reservation.userName}` });
    };

    // --- Memoized Filters ---
    const filteredProducts = useMemo(() => products.filter(p =>
        p.name.toLowerCase().includes(productSearchQuery.toLowerCase())
    ), [products, productSearchQuery]);

    const filteredReservations = useMemo(() => reservations.filter(r => {
        // RBAC: If admin has an assigned branch, only show reservations for that branch
        if (currentUser.assignedBranch && r.branch !== currentUser.assignedBranch) {
            return false;
        }

        const searchLower = reservationFilters.search.toLowerCase();
        const searchMatch = reservationFilters.search ?
            r.userName.toLowerCase().includes(searchLower) ||
            r.userNito.toLowerCase().includes(searchLower) : true;

        // If admin is restricted to a branch, the branch filter should be locked or pre-selected (handled in UI), 
        // but we also enforce it here. If they select 'all' in UI, this check still applies if they have an assignedBranch.
        // However, usually we'd hide the branch filter for them.
        const branchMatch = reservationFilters.branch !== 'all' ? r.branch === reservationFilters.branch : true;

        const dateMatch = reservationFilters.date ? r.date === reservationFilters.date : true;

        let statusMatch = true;
        if (reservationFilters.status === 'future') {
            statusMatch = !r.isPast && r.status !== 'cancelled';
        } else if (reservationFilters.status === 'past') {
            statusMatch = r.isPast && r.status !== 'cancelled';
        } else if (reservationFilters.status === 'cancelled') {
            statusMatch = r.status === 'cancelled';
        }

        const purposeMatch = reservationFilters.purpose !== 'all' ? r.purpose === reservationFilters.purpose : true;

        return searchMatch && branchMatch && dateMatch && statusMatch && purposeMatch;
    }), [reservations, reservationFilters, currentUser.assignedBranch]);

    const filteredMembers = useMemo(() => users.filter(u =>
        u.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
        u.nito.toLowerCase().includes(memberSearchQuery.toLowerCase())
    ), [users, memberSearchQuery]);

    const renderTabs = () => (
        <div className="border-b border-dark-border mb-6">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                <button onClick={() => setActiveTab('products')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'products' ? 'border-accent-green text-accent-green' : 'border-transparent text-text-muted hover:text-text-light hover:border-gray-500'}`}>
                    Productos
                </button>
                <button onClick={() => setActiveTab('reservations')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'reservations' ? 'border-accent-green text-accent-green' : 'border-transparent text-text-muted hover:text-text-light hover:border-gray-500'}`}>
                    Reservas
                </button>
                <button onClick={() => setActiveTab('categories')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'categories' ? 'border-accent-green text-accent-green' : 'border-transparent text-text-muted hover:text-text-light hover:border-gray-500'}`}>
                    Categorías
                </button>
                <button onClick={() => setActiveTab('members')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'members' ? 'border-accent-green text-accent-green' : 'border-transparent text-text-muted hover:text-text-light hover:border-gray-500'}`}>
                    Miembros
                </button>
                <button onClick={() => setActiveTab('courses')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'courses' ? 'border-accent-green text-accent-green' : 'border-transparent text-text-muted hover:text-text-light hover:border-gray-500'}`}>
                    Cursos
                </button>
                <button onClick={() => setActiveTab('legal-tracking')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'legal-tracking' ? 'border-accent-green text-accent-green' : 'border-transparent text-text-muted hover:text-text-light hover:border-gray-500'}`}>
                    Seguimiento Legal
                </button>
            </nav>
        </div>
    );

    const inputClasses = "w-full p-2 bg-dark-tertiary text-text-light border border-dark-border rounded-md shadow-sm focus:outline-none focus:ring-accent-green focus:border-accent-green";
    const labelClasses = "block text-sm font-medium text-text-muted";


    return (
        <>
            <div>
                <h1 className="text-3xl font-bold text-text-light mb-6">Panel de Administración</h1>
                {renderTabs()}

                {activeTab === 'products' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <h2 className="text-xl font-semibold mb-4 text-text-light">Lista de Productos ({filteredProducts.length})</h2>
                            <div className="relative mb-4">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Icon name="search" className="w-5 h-5 text-gray-400" />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre..."
                                    value={productSearchQuery}
                                    onChange={e => setProductSearchQuery(e.target.value)}
                                    className={`${inputClasses} pl-10`}
                                />
                            </div>
                            <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2">
                                {filteredProducts.map(p => (
                                    <Card key={p.id} className="flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-text-light">{p.name}</p>
                                            <p className="text-sm text-text-muted">{p.category}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button variant="secondary" size="sm" onClick={() => handleEditProductClick(p)}>Editar</Button>
                                            <Button variant="danger" size="sm" onClick={() => handleDeleteProductClick(p)}>Eliminar</Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="mb-8">
                                <InventoryUploader onSuccess={setProducts} />
                            </div>
                            <h2 className="text-xl font-semibold mb-4 text-text-light">Añadir Nuevo Producto</h2>
                            <Card>
                                <form onSubmit={handleAddProduct} className="space-y-4">
                                    <input type="text" placeholder="Nombre del producto" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} required className={inputClasses} />
                                    <textarea placeholder="Descripción" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} required className={inputClasses} />
                                    <textarea placeholder="Propiedades" value={newProduct.properties} onChange={e => setNewProduct({ ...newProduct, properties: e.target.value })} className={inputClasses} />
                                    <input type="url" placeholder="URL de la Imagen" value={newProduct.imageUrl} onChange={e => setNewProduct({ ...newProduct, imageUrl: e.target.value })} required className={inputClasses} />
                                    <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} className={inputClasses}>
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    <Button type="submit" className="w-full">Añadir Producto</Button>
                                </form>
                            </Card>
                        </div>
                    </div>
                )}

                {activeTab === 'reservations' && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-text-light">Gestión de Reservas ({filteredReservations.length})</h2>
                        <Card className="mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                                <div className="md:col-span-1">
                                    <label className={labelClasses}>Buscar por Miembro/NITO</label>
                                    <input
                                        type="text"
                                        placeholder="Buscar..."
                                        value={reservationFilters.search}
                                        onChange={e => setReservationFilters({ ...reservationFilters, search: e.target.value })}
                                        className={`mt-1 ${inputClasses}`}
                                    />
                                </div>
                                {/* Only show branch filter if admin is NOT restricted to a specific branch */}
                                {!currentUser.assignedBranch && (
                                    <div className="md:col-span-1">
                                        <label className={labelClasses}>Filtrar por Sucursal</label>
                                        <select
                                            value={reservationFilters.branch}
                                            onChange={e => setReservationFilters({ ...reservationFilters, branch: e.target.value })}
                                            className={`mt-1 ${inputClasses}`}
                                        >
                                            <option value="all">Todas</option>
                                            <option value="Del Valle">Del Valle</option>
                                            <option value="Coyoacán">Coyoacán</option>
                                        </select>
                                    </div>
                                )}
                                <div className="md:col-span-1">
                                    <label className={labelClasses}>Filtrar por Fecha</label>
                                    <input
                                        type="date"
                                        value={reservationFilters.date}
                                        onChange={e => setReservationFilters({ ...reservationFilters, date: e.target.value })}
                                        className={`mt-1 dark:[color-scheme:dark] ${inputClasses}`}
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <label className={labelClasses}>Tipo de Cita</label>
                                    <select
                                        value={reservationFilters.purpose}
                                        onChange={e => setReservationFilters({ ...reservationFilters, purpose: e.target.value })}
                                        className={`mt-1 ${inputClasses}`}
                                    >
                                        <option value="all">Todos</option>
                                        <option value="Retiro de Cosecha">Retiro de Cosecha</option>
                                        <option value="Trámite">Trámite</option>
                                        <option value="Curso">Curso</option>
                                    </select>
                                </div>
                                <div className="md:col-span-1">
                                    <label className={labelClasses}>Estatus</label>
                                    <select
                                        value={reservationFilters.status}
                                        onChange={e => setReservationFilters({ ...reservationFilters, status: e.target.value })}
                                        className={`mt-1 ${inputClasses}`}
                                    >
                                        <option value="all">Todos</option>
                                        <option value="future">Futuras</option>
                                        <option value="past">Pasadas</option>
                                        <option value="cancelled">Canceladas</option>
                                    </select>
                                </div>
                            </div>
                        </Card>
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                            {filteredReservations.map(r => (
                                <Card key={r.id} className={`flex justify-between items-center ${r.isPast || r.status === 'cancelled' ? 'opacity-60 bg-dark-tertiary' : ''}`}>
                                    <div>
                                        <p className="font-bold text-text-light">{r.userName} <span className={`text-xs px-2 py-0.5 rounded ${r.status === 'cancelled' ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'}`}>{r.status === 'cancelled' ? 'Cancelada' : (r.isPast ? 'Completada' : 'Activa')}</span></p>
                                        <p className="text-sm text-text-muted">NITO: {r.userNito}</p>
                                        <p className="text-sm text-gray-400">{r.purpose} - {r.branch}</p>
                                        <p className="text-sm font-semibold text-accent-green">{r.date} @ {r.time}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        {!r.isPast && r.status !== 'cancelled' && <Button variant="danger" size="sm" onClick={() => handleDeleteReservationClick(r)}>Cancelar</Button>}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'categories' && (
                    <div className="max-w-md mx-auto">
                        <h2 className="text-xl font-semibold mb-4 text-text-light">Añadir Nueva Categoría</h2>
                        <Card className="mb-6">
                            <form onSubmit={handleAddCategory} className="flex space-x-2">
                                <input type="text" placeholder="Nombre de la categoría" value={newCategory} onChange={e => setNewCategory(e.target.value)} required className={`flex-grow ${inputClasses}`} />
                                <Button type="submit">Añadir</Button>
                            </form>
                        </Card>
                        <h2 className="text-xl font-semibold mb-4 text-text-light">Categorías Existentes ({categories.length})</h2>
                        <div className="space-y-2">
                            {categories.map(c => (
                                <div key={c}>
                                    {editingCategory?.oldName === c ? (
                                        <div className="flex justify-between items-center p-4 border border-dark-border rounded-lg">
                                            <input type="text" value={editingCategory.newName} onChange={e => setEditingCategory({ ...editingCategory, newName: e.target.value })} className={`flex-grow p-1 mr-2 ${inputClasses}`} autoFocus onBlur={handleUpdateCategory} onKeyDown={e => e.key === 'Enter' && handleUpdateCategory()} />
                                            <Button variant="primary" size="sm" onClick={handleUpdateCategory}>Guardar</Button>
                                        </div>
                                    ) : (
                                        <Card className="flex justify-between items-center p-4">
                                            <p className="text-text-light">{c}</p>
                                            <div className="flex space-x-2">
                                                <Button variant="secondary" size="sm" onClick={() => handleEditCategoryClick(c)}>Editar</Button>
                                                <Button variant="danger" size="sm" onClick={() => handleDeleteCategoryClick(c)}>Eliminar</Button>
                                            </div>
                                        </Card>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'members' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <h2 className="text-xl font-semibold mb-4 text-text-light">Lista de Miembros ({filteredMembers.length})</h2>
                            <div className="relative mb-4">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Icon name="search" className="w-5 h-5 text-gray-400" />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre o NITO..."
                                    value={memberSearchQuery}
                                    onChange={e => setMemberSearchQuery(e.target.value)}
                                    className={`${inputClasses} pl-10`}
                                />
                            </div>
                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                {filteredMembers.map(u => (
                                    <Card key={u.nito} className="flex justify-between items-center">
                                        <div>
                                            <p className={`font-bold text-text-light`}>{u.name} <span className={`text-xs font-medium px-2 py-0.5 rounded ${u.role === 'admin' ? 'bg-accent-green text-white' : 'bg-dark-tertiary text-text-muted'}`}>{u.role}</span></p>
                                            <p className="text-sm text-text-muted">NITO: {u.nito}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button variant="secondary" size="sm" onClick={() => handleEditUserClick(u)}>Editar</Button>
                                            {u.role !== 'admin' && <Button variant="danger" size="sm" onClick={() => handleDeleteUserClick(u)}>Eliminar</Button>}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-text-light">Añadir Nuevo Miembro</h2>
                            <Card>
                                <form onSubmit={handleAddUser} className="space-y-4">
                                    <input type="text" placeholder="NITO" value={newUser.nito} onChange={e => setNewUser({ ...newUser, nito: e.target.value })} required className={inputClasses} />
                                    <input type="text" placeholder="Nombre Completo" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} required className={inputClasses} />
                                    <input type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required className={inputClasses} />
                                    <input type="password" placeholder="Contraseña" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required className={inputClasses} />
                                    <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value as 'member' | 'admin' })} className={inputClasses}>
                                        <option value="member">Miembro</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    <Button type="submit" className="w-full">Añadir Miembro</Button>
                                </form>
                            </Card>
                        </div>
                    </div>
                )}

                {isProductModalOpen && editingProduct && (
                    <Modal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} title="Editar Producto">
                        <form onSubmit={handleUpdateProduct} className="space-y-4">
                            <div><label className={labelClasses}>Nombre del producto</label><input type="text" value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} required className={inputClasses} /></div>
                            <div><label className={labelClasses}>Descripción</label><textarea value={editingProduct.description} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })} required className={inputClasses} /></div>
                            <div><label className={labelClasses}>Propiedades</label><textarea value={editingProduct.properties} onChange={e => setEditingProduct({ ...editingProduct, properties: e.target.value })} className={inputClasses} /></div>
                            <div><label className={labelClasses}>URL de la Imagen</label><input type="url" value={editingProduct.imageUrl} onChange={e => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })} required className={inputClasses} /></div>
                            <div><label className={labelClasses}>Categoría</label><select value={editingProduct.category} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })} className={inputClasses}>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select></div>
                            <Button type="submit" className="w-full">Guardar Cambios</Button>
                        </form>
                    </Modal>
                )}

                {isUserModalOpen && editingUser && (
                    <Modal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} title="Editar Miembro">
                        <form onSubmit={handleUpdateUser} className="space-y-4">
                            <div><label className={labelClasses}>NITO (no editable)</label><input type="text" value={editingUser.nito} disabled className={`${inputClasses} opacity-50 cursor-not-allowed`} /></div>
                            <div><label className={labelClasses}>Nombre Completo</label><input type="text" value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} required className={inputClasses} /></div>
                            <div><label className={labelClasses}>Email</label><input type="email" value={editingUser.email} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} required className={inputClasses} /></div>
                            <div><label className={labelClasses}>Nueva Contraseña (opcional)</label><input type="password" placeholder="Dejar en blanco para no cambiar" onChange={e => setEditingUser({ ...editingUser, password: e.target.value || editingUser.password })} className={inputClasses} /></div>
                            <div><label className={labelClasses}>Rol</label><select value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value as 'member' | 'admin' })} className={inputClasses}><option value="member">Miembro</option><option value="admin">Admin</option></select></div>
                            <Button type="submit" className="w-full">Guardar Cambios</Button>
                        </form>
                    </Modal>
                )}


                {activeTab === 'courses' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-text-light">Cursos Existentes ({courses.length})</h2>
                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                {courses.map(c => (
                                    <Card key={c.id} className="relative">
                                        <div className="absolute top-4 right-4 flex space-x-2">
                                            <Button variant="secondary" size="sm" onClick={() => { setEditingCourse(c); setIsProductModalOpen(true); /* Reuse modal logic or create new one? I'll reuse the Product modal state variable for simplicity or create a new one. Let's create a new one implicitly by checking editingCourse */ }}>Editar</Button>
                                            <Button variant="danger" size="sm" onClick={() => setItemToDelete({ type: 'course', id: c.id, name: c.title })}>Eliminar</Button>
                                        </div>
                                        <h3 className="font-bold text-lg text-text-light">{c.title}</h3>
                                        <p className="text-accent-green text-sm mb-1">{c.type} - ${c.cost}</p>
                                        <p className="text-gray-400 text-sm mb-2">{c.description}</p>

                                        {c.schedule && c.schedule.length > 0 && (
                                            <div className="mt-3 bg-dark-tertiary p-2 rounded">
                                                <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Horarios:</p>
                                                {c.schedule.map((s, idx) => (
                                                    <div key={idx} className="text-sm flex justify-between">
                                                        <span>{s.date} @ {s.time} ({s.branch})</span>
                                                        <span className={s.booked >= s.capacity ? "text-red-400" : "text-green-400"}>
                                                            {s.booked}/{s.capacity}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-text-light">Añadir Nuevo Curso</h2>
                            <Card>
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    const newCourseId = `course-${Date.now()}`; // Generate ID locally if needed or let Firestore generate
                                    // Let's use Firestore ID but we also need an ID for local state if we optimistically update,
                                    // or wait for result.

                                    const courseData = {
                                        title: newCourse.title || '',
                                        type: newCourse.type || CourseType.Presencial,
                                        description: newCourse.description || '',
                                        cost: Number(newCourse.cost),
                                        branch: (newCourse.branch as any) || 'Del Valle',
                                        meetingLink: newCourse.meetingLink,
                                        videoUrl: newCourse.videoUrl,
                                        schedule: []
                                    };

                                    try {
                                        const docRef = await addDoc(collection(db, 'courses'), courseData);
                                        const courseToAdd: Course = { ...courseData, id: docRef.id };
                                        setCourses(prev => [...prev, courseToAdd]);
                                        setNewCourse({ title: '', type: CourseType.Presencial, description: '', cost: 0, branch: 'Del Valle' });
                                    } catch (error) {
                                        console.error("Error adding course: ", error);
                                        alert("Error al crear el curso");
                                    }
                                }} className="space-y-4">
                                    <input type="text" placeholder="Título del Curso" value={newCourse.title} onChange={e => setNewCourse({ ...newCourse, title: e.target.value })} required className={inputClasses} />

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelClasses}>Tipo</label>
                                            <select value={newCourse.type} onChange={e => setNewCourse({ ...newCourse, type: e.target.value as CourseType })} className={inputClasses}>
                                                {Object.values(CourseType).map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Costo ($)</label>
                                            <input type="number" placeholder="0" value={newCourse.cost} onChange={e => setNewCourse({ ...newCourse, cost: Number(e.target.value) })} required className={inputClasses} />
                                        </div>
                                    </div>

                                    <textarea placeholder="Descripción" value={newCourse.description} onChange={e => setNewCourse({ ...newCourse, description: e.target.value })} required className={inputClasses} rows={3} />

                                    {newCourse.type === CourseType.EnLineaVivo && (
                                        <input type="url" placeholder="Link de Zoom/Meet" value={newCourse.meetingLink || ''} onChange={e => setNewCourse({ ...newCourse, meetingLink: e.target.value })} className={inputClasses} />
                                    )}
                                    {newCourse.type === CourseType.EnLineaGrabado && (
                                        <input type="url" placeholder="Link del Video/Playlist" value={newCourse.videoUrl || ''} onChange={e => setNewCourse({ ...newCourse, videoUrl: e.target.value })} className={inputClasses} />
                                    )}

                                    <Button type="submit" className="w-full">Crear Curso</Button>
                                </form>
                            </Card>
                        </div>
                    </div>
                )}

                {/* Edit Course Modal */}
                {editingCourse && (
                    <Modal isOpen={!!editingCourse} onClose={() => setEditingCourse(null)} title="Editar Curso">
                        <form onSubmit={async (e) => {
                            e.preventDefault();
                            if (!editingCourse) return;

                            try {
                                const courseRef = doc(db, 'courses', editingCourse.id);
                                await updateDoc(courseRef, { ...editingCourse });

                                setCourses(prev => prev.map(c => c.id === editingCourse.id ? editingCourse : c));
                                setEditingCourse(null);
                            } catch (error) {
                                console.error("Error updating course: ", error);
                                alert("Error al actualizar el curso");
                            }
                        }} className="space-y-4 max-h-[70vh] overflow-y-auto p-1">

                            <input type="text" value={editingCourse.title} onChange={e => setEditingCourse({ ...editingCourse, title: e.target.value })} className={inputClasses} />

                            <div className="grid grid-cols-2 gap-4">
                                <select value={editingCourse.type} onChange={e => setEditingCourse({ ...editingCourse, type: e.target.value as CourseType })} className={inputClasses}>
                                    {Object.values(CourseType).map(t => <option key={t} value={t}>{t}</option>)}
                                </select>
                                <input type="number" value={editingCourse.cost} onChange={e => setEditingCourse({ ...editingCourse, cost: Number(e.target.value) })} className={inputClasses} />
                            </div>

                            <textarea value={editingCourse.description} onChange={e => setEditingCourse({ ...editingCourse, description: e.target.value })} className={inputClasses} rows={3} />

                            {/* Specific fields based on type */}
                            {(editingCourse.type === CourseType.EnLineaVivo) && (
                                <input type="url" placeholder="Link de Reunión" value={editingCourse.meetingLink || ''} onChange={e => setEditingCourse({ ...editingCourse, meetingLink: e.target.value })} className={inputClasses} />
                            )}
                            {(editingCourse.type === CourseType.EnLineaGrabado) && (
                                <input type="url" placeholder="Link del Video" value={editingCourse.videoUrl || ''} onChange={e => setEditingCourse({ ...editingCourse, videoUrl: e.target.value })} className={inputClasses} />
                            )}

                            {/* Schedule Management */}
                            <div className="border-t border-dark-border pt-4 mt-2">
                                <h4 className="font-semibold text-text-light mb-2">Horarios y Fechas</h4>
                                <div className="space-y-2 mb-2">
                                    {editingCourse.schedule?.map((s, idx) => (
                                        <div key={idx} className="flex items-center gap-2 bg-dark-primary p-2 rounded text-sm">
                                            <div className="flex-grow grid grid-cols-2 gap-x-2">
                                                <span>{s.date} {s.time}</span>
                                                <span className="text-gray-400">{s.branch}</span>
                                                <span className="text-xs">Cupo: {s.booked}/{s.capacity}</span>
                                            </div>
                                            <button type="button" onClick={() => {
                                                const newSchedule = [...(editingCourse.schedule || [])];
                                                newSchedule.splice(idx, 1);
                                                setEditingCourse({ ...editingCourse, schedule: newSchedule });
                                            }} className="text-red-400 hover:text-red-300"><Icon name="x" className="w-4 h-4" /></button>
                                        </div>
                                    ))}
                                </div>

                                {/* Simple Add Schedule Row */}
                                <div className="grid grid-cols-2 gap-2 bg-dark-tertiary p-2 rounded">
                                    <input type="date" className={inputClasses} id="new-sched-date" />
                                    <input type="time" className={inputClasses} id="new-sched-time" />
                                    <select className={inputClasses} id="new-sched-branch">
                                        <option value="Del Valle">Del Valle</option>
                                        <option value="Coyoacán">Coyoacán</option>
                                    </select>
                                    <div className="flex items-center gap-2">
                                        <input type="number" placeholder="Cupo" className={inputClasses} id="new-sched-cap" defaultValue={15} />
                                        <Button type="button" size="sm" onClick={() => {
                                            const dateEl = document.getElementById('new-sched-date') as HTMLInputElement;
                                            const timeEl = document.getElementById('new-sched-time') as HTMLInputElement;
                                            const branchEl = document.getElementById('new-sched-branch') as HTMLSelectElement;
                                            const capEl = document.getElementById('new-sched-cap') as HTMLInputElement;

                                            if (dateEl.value && timeEl.value) {
                                                const newSession = {
                                                    date: dateEl.value,
                                                    time: timeEl.value,
                                                    branch: branchEl.value as any,
                                                    capacity: Number(capEl.value) || 15,
                                                    booked: 0
                                                };
                                                setEditingCourse({
                                                    ...editingCourse,
                                                    schedule: [...(editingCourse.schedule || []), newSession]
                                                });
                                                // Clear inputs logic omitted for brevity/simplicity in this inline handler
                                            }
                                        }}>Agg</Button>
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" className="w-full">Guardar Curso</Button>
                        </form>
                    </Modal>
                )}

                {activeTab === 'legal-tracking' && (
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-text-light">Seguimiento Legal</h2>
                            <div className="relative w-1/3">
                                <input
                                    type="text"
                                    placeholder="Buscar miembro por NITO o nombre..."
                                    className={inputClasses + " pl-10"}
                                    onChange={(e) => {
                                        const term = e.target.value.toLowerCase();
                                        // Simple search logic logic to find a user and select them if exact match or show list?
                                        // For now, let's just use the main filter or a local filter.
                                        setSearchTerm(term);
                                    }}
                                />
                                <Icon name="search" className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* List of Users with Active Cases */}
                            <div className="lg:col-span-1 bg-dark-secondary rounded-lg p-4 max-h-[600px] overflow-y-auto">
                                <h3 className="text-lg font-medium text-accent-green mb-4">Casos Activos</h3>
                                <div className="space-y-2">
                                    {(users || []).filter(u => (u.legalStatus && u.legalStatus.length > 0) || (searchTerm && (u.name.toLowerCase().includes(searchTerm) || u.nito.includes(searchTerm)))).map(u => (
                                        <div
                                            key={u.nito}
                                            onClick={() => setSelectedLegalUser(u)}
                                            className={`p-3 rounded cursor-pointer transition-colors ${selectedLegalUser?.nito === u.nito ? 'bg-accent-green text-dark-primary' : 'bg-dark-primary hover:bg-dark-tertiary'}`}
                                        >
                                            <div className="font-semibold">{u.name}</div>
                                            <div className="text-xs opacity-75">NITO: {u.nito}</div>
                                            {(u.legalStatus?.length || 0) > 0 && (
                                                <div className="mt-1 text-xs px-2 py-0.5 bg-dark-secondary bg-opacity-30 rounded w-fit">
                                                    {u.legalStatus?.length} expedientes
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {(users || []).filter(u => u.legalStatus && u.legalStatus.length > 0).length === 0 && !searchTerm && (
                                        <p className="text-text-muted text-sm text-center py-4">No hay casos activos.</p>
                                    )}
                                </div>
                            </div>

                            {/* Selected User Details */}
                            <div className="lg:col-span-2">
                                {selectedLegalUser ? (
                                    <Card>
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h3 className="text-2xl font-bold text-text-light">{selectedLegalUser.name}</h3>
                                                <p className="text-gray-400">NITO: {selectedLegalUser.nito}</p>
                                                <p className="text-gray-400 text-sm">{selectedLegalUser.email}</p>
                                            </div>
                                            <Button onClick={() => setEditingLegalStatus({ user: selectedLegalUser, status: {} as any })}>
                                                <Icon name="plus" className="w-4 h-4 mr-2" /> Nuevo Folio
                                            </Button>
                                        </div>

                                        <div className="space-y-4">
                                            {(!selectedLegalUser.legalStatus || selectedLegalUser.legalStatus.length === 0) && (
                                                <div className="text-center py-10 text-gray-500">
                                                    Este usuario no tiene seguimiento legal activo.
                                                </div>
                                            )}
                                            {selectedLegalUser.legalStatus?.map((status, idx) => (
                                                <div key={idx} className="bg-dark-tertiary p-4 rounded-lg border border-dark-border relative">
                                                    <div className="absolute top-4 right-4 flex space-x-2">
                                                        <button
                                                            onClick={() => setEditingLegalStatus({ user: selectedLegalUser, status: status, index: idx })}
                                                            className="text-gray-400 hover:text-white"
                                                        >
                                                            <Icon name="edit" className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={async () => {
                                                                if (!window.confirm("¿Eliminar este folio?")) return;
                                                                const newLegalStatus = [...(selectedLegalUser.legalStatus || [])];
                                                                newLegalStatus.splice(idx, 1);

                                                                try {
                                                                    await updateDoc(doc(db, 'users', selectedLegalUser.email), { legalStatus: newLegalStatus });
                                                                    const updatedUser = { ...selectedLegalUser, legalStatus: newLegalStatus };
                                                                    setUsers(prev => prev.map(u => u.nito === updatedUser.nito ? updatedUser : u));
                                                                    setSelectedLegalUser(updatedUser);
                                                                } catch (e) { console.error(e); alert("Error al eliminar"); }
                                                            }}
                                                            className="text-red-400 hover:text-red-300"
                                                        >
                                                            <Icon name="trash" className="w-4 h-4" />
                                                        </button>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4 mb-2">
                                                        <div>
                                                            <span className="text-xs text-gray-400 uppercase">Trámite</span>
                                                            <p className="font-semibold text-accent-green">{status.processName || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <span className="text-xs text-gray-400 uppercase">Folio / Caso</span>
                                                            <p className="font-medium text-white">{status.caseNumber}</p>
                                                        </div>
                                                    </div>
                                                    <div className="mb-2">
                                                        <span className="text-xs text-gray-400 uppercase">Estado</span>
                                                        <p className="text-white">{status.status}</p>
                                                    </div>
                                                    {status.url && (
                                                        <div className="mb-2">
                                                            <a href={status.url} target="_blank" rel="noreferrer" className="text-accent-green hover:underline text-sm flex items-center">
                                                                <Icon name="link" className="w-3 h-3 mr-1" /> Ver Documento/Enlace
                                                            </a>
                                                        </div>
                                                    )}
                                                    {status.notes && (
                                                        <div className="mt-2 text-sm text-gray-300 bg-dark-primary p-2 rounded">
                                                            {status.notes}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                ) : (
                                    <div className="h-full flex items-center justify-center text-gray-500 bg-dark-secondary rounded-lg p-10">
                                        Selecciona un miembro para ver o editar su seguimiento legal.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Add/Edit Legal Status Modal */}
                        {editingLegalStatus && (
                            <Modal
                                isOpen={!!editingLegalStatus}
                                onClose={() => setEditingLegalStatus(null)}
                                title={editingLegalStatus.index !== undefined ? "Editar Folio" : "Nuevo Folio"}
                            >
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    const { user, status, index } = editingLegalStatus;
                                    const newStatusItem = {
                                        processName: status.processName,
                                        caseNumber: status.caseNumber,
                                        status: status.status,
                                        notes: status.notes || '',
                                        url: status.url || '',
                                        updatedAt: new Date().toISOString()
                                    };

                                    const newLegalStatusList = [...(user.legalStatus || [])];
                                    if (index !== undefined && index >= 0) {
                                        newLegalStatusList[index] = newStatusItem;
                                    } else {
                                        newLegalStatusList.push(newStatusItem);
                                    }

                                    try {
                                        await updateDoc(doc(db, 'users', user.email), { legalStatus: newLegalStatusList });
                                        const updatedUser = { ...user, legalStatus: newLegalStatusList };
                                        setUsers(prev => prev.map(u => u.nito === updatedUser.nito ? updatedUser : u));
                                        setSelectedLegalUser(updatedUser);
                                        setEditingLegalStatus(null);
                                    } catch (err) {
                                        console.error(err);
                                        alert("Error al guardar información legal");
                                    }

                                }} className="space-y-4">
                                    <div>
                                        <label className={labelClasses}>Tipo de Trámite</label>
                                        <select
                                            value={editingLegalStatus.status.processName || 'COFEPRIS'}
                                            onChange={e => setEditingLegalStatus({ ...editingLegalStatus, status: { ...editingLegalStatus.status, processName: e.target.value } })}
                                            className={inputClasses}
                                        >
                                            <option value="COFEPRIS">COFEPRIS</option>
                                            <option value="Juzgado">Juzgado</option>
                                            <option value="Amparo">Amparo</option>
                                            <option value="Otro">Otro</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className={labelClasses}>Número de Folio / Caso</label>
                                        <input
                                            type="text"
                                            required
                                            value={editingLegalStatus.status.caseNumber || ''}
                                            onChange={e => setEditingLegalStatus({ ...editingLegalStatus, status: { ...editingLegalStatus.status, caseNumber: e.target.value } })}
                                            className={inputClasses}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClasses}>Estado Actual</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Ej. En revisión, Aprobado, Pendiente..."
                                            value={editingLegalStatus.status.status || ''}
                                            onChange={e => setEditingLegalStatus({ ...editingLegalStatus, status: { ...editingLegalStatus.status, status: e.target.value } })}
                                            className={inputClasses}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClasses}>Enlace (Opcional)</label>
                                        <input
                                            type="url"
                                            placeholder="https://..."
                                            value={editingLegalStatus.status.url || ''}
                                            onChange={e => setEditingLegalStatus({ ...editingLegalStatus, status: { ...editingLegalStatus.status, url: e.target.value } })}
                                            className={inputClasses}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClasses}>Notas</label>
                                        <textarea
                                            rows={3}
                                            value={editingLegalStatus.status.notes || ''}
                                            onChange={e => setEditingLegalStatus({ ...editingLegalStatus, status: { ...editingLegalStatus.status, notes: e.target.value } })}
                                            className={inputClasses}
                                        />
                                    </div>

                                    <Button type="submit" className="w-full">Guardar</Button>
                                </form>
                            </Modal>
                        )}
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={!!itemToDelete}
                onClose={() => setItemToDelete(null)}
                onConfirm={handleConfirmDelete}
                title={`Confirmar Eliminación de ${itemToDelete?.type}`}
                message={`¿Estás seguro de que quieres eliminar "${itemToDelete?.name}"? Esta acción no se puede deshacer.`}
            />
        </>
    );
};

export default AdminView;