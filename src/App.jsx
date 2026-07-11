import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import EleveDashboard      from "./pages/Dashboard/EleveDashboard";
import RepetiteurDashboard from "./pages/Dashboard/RepetiteurDashboard";


// ---- Données initiales ----
const initialProfiles = [
  { id: "u1", email: "moussa.diop@gmail.com", nom: "Diop", prenom: "Moussa", telephone: "77 123 45 67", role: "repetiteur", region: "Dakar", photo_url: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=150" },
  { id: "u2", email: "fatou.ndiaye@gmail.com", nom: "Ndiaye", prenom: "Fatou", telephone: "78 987 65 43", role: "repetiteur", region: "Thiès", photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150" },
  { id: "u3", email: "ibrahima.sow@gmail.com", nom: "Sow", prenom: "Ibrahima", telephone: "76 345 12 90", role: "repetiteur", region: "Saint-Louis", photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" },
];

const initialRepetiteurs = [
  { id: "rep1", profile_id: "u1", matieres: ["Mathématiques", "Sciences Physiques"], niveaux: ["BAC (Terminale)"], tarif_horaire: 5000, description: "Professeur de lycée d'excellence avec 8 ans d'expérience.", note_moyenne: 4.9, nb_sessions: 42, disponible: true },
  { id: "rep2", profile_id: "u2", matieres: ["SVT", "Français"], niveaux: ["BFEM (3ème)"], tarif_horaire: 4000, description: "Enseignante passionnée, spécialiste BFEM.", note_moyenne: 4.7, nb_sessions: 28, disponible: true },
  { id: "rep3", profile_id: "u3", matieres: ["Français", "Mathématiques"], niveaux: ["CM2"], tarif_horaire: 3000, description: "Instituteur certifié avec 10 ans d'exercice.", note_moyenne: 5.0, nb_sessions: 15, disponible: true },
];

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [adminUser, setAdminUser] = useState(null); // ← admin séparé
  const [db, setDb] = useState({
    profiles: initialProfiles,
    repetiteurs: initialRepetiteurs,
    sessions: [],
    transactions: [],
  });

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [toastMessage, setToastMessage] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleStartCourse = (course) => {
    triggerToast(`📚 Lancement de votre module : "${course.title}". Bonnes révisions !`);
  };

  const handleRoleChange = (newRole) => {
    if (!currentUser) return;
    setCurrentUser({ ...currentUser, role: newRole });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const email    = e.target[0].value;
    const password = e.target[1].value;
  
    try {
      const response = await fetch('http://localhost:8000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        alert(data.message || 'Erreur de connexion');
        return;
      }
  
      setCurrentUser(data.user);
      setIsLoginOpen(false);

      if (data.user.role === 'repetiteur') {
        setActiveTab('dashboard');
      } else {
        setActiveTab('home');
      }

    triggerToast(`👋 Bienvenue, ${data.user.prenom} !`);
  
    } catch (err) {
      alert('Erreur de connexion. Vérifie que Laravel tourne.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const prenom    = e.target[0].value;
    const nom       = e.target[1].value;
    const email     = e.target[2].value;
    const telephone = e.target[3].value;
    const region    = e.target[4].value;
    const role      = e.target[5].value;
    const password  = e.target[6].value;
    const confirm   = e.target[7].value;
  
    if (password !== confirm) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prenom, nom, email, telephone, region, password, role }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        alert(data.message || 'Erreur lors de l\'inscription');
        return;
      }
  
      setCurrentUser(data.data);
      setIsRegisterOpen(false);
      triggerToast(`🎉 Inscription réussie ! Bienvenue ${prenom} !`);
  
    } catch (err) {
      alert('Erreur. Vérifie que Laravel tourne.');
    }
  };

  const handleBookSession = (sessionData) => {
    console.log("Nouvelle réservation :", sessionData);
  };

  // ── Page publique (Home + Nav + Footer) ──
  const PublicLayout = () => (
    <div className="min-h-screen flex flex-col justify-between">
      <div className="bg-gradient-to-r from-emerald-600 via-yellow-500 to-red-600 h-1.5 w-full"></div>
      <Nav
        currentUser={currentUser}
        onLogout={() => { setCurrentUser(null); setActiveTab("home"); triggerToast("Déconnexion réussie."); }}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onChangeRole={handleRoleChange}
      />

      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700">
          <i className="fa-solid fa-circle-info text-emerald-500"></i>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

    {currentUser && currentUser.role !== 'repetiteur' && (
      <div className="bg-white border-b border-slate-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-4">
          <button
            onClick={() => setActiveTab("home")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "home" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "text-slate-500 hover:text-slate-800"}`}
          >
            <i className="fa-solid fa-house mr-1.5"></i> Accueil & Recherche
          </button>
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "dashboard" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "text-slate-500 hover:text-slate-800"}`}
          >
            <i className="fa-solid fa-chart-line mr-1.5"></i> Mon espace
          </button>
        </div>
      </div>
    )}

      <main className="flex-grow">
        {activeTab === "home" ? (
          <Home
          currentUser={currentUser}
          onBookSession={handleBookSession}
          onStartCourse={handleStartCourse}
          onOpenLogin={() => setIsLoginOpen(true)}
          onOpenRegister={() => setIsRegisterOpen(true)}
        />
        ) : activeTab === "dashboard" && currentUser?.role === 'repetiteur' ? (
          <RepetiteurDashboard
            currentUser={currentUser}
            onLogout={() => {
              setCurrentUser(null);
              setActiveTab('home');
              triggerToast('Déconnexion réussie.');
            }}
          />
        ) : activeTab === "dashboard" ? (
          <EleveDashboard
            currentUser={currentUser}
            onLogout={() => {
              setCurrentUser(null);
              setActiveTab('home');
              triggerToast('Déconnexion réussie.');
            }}
          />
        ) : null}
      </main>

      {/* LOGIN MODAL */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsLoginOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 relative shadow-2xl z-10 border border-slate-100">
            <button onClick={() => setIsLoginOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600">
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
            <h3 className="text-xl font-bold text-slate-900 text-center mb-6">Se connecter</h3>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <input type="email" required placeholder="Email" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm focus:border-emerald-500" />
              <input type="password" required placeholder="Mot de passe" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm focus:border-emerald-500" />
              <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl">Me connecter</button>
            </form>
          </div>
        </div>
      )}

      {/* REGISTER MODAL */}
      {isRegisterOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div onClick={() => setIsRegisterOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
    <div className="bg-white rounded-3xl w-full max-w-sm p-6 relative shadow-2xl z-10 border border-slate-100 max-h-[90vh] overflow-y-auto">
      <button onClick={() => setIsRegisterOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600">
        <i className="fa-solid fa-xmark text-lg"></i>
      </button>
      <div className="text-center space-y-2 mb-6">
        <h3 className="text-xl font-bold text-slate-900">S'inscrire</h3>
        <p className="text-xs text-slate-500">Rejoignez-nous pour apprendre gratuitement.</p>
      </div>
      <form onSubmit={handleRegisterSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Prénom *</label>
            <input type="text" required placeholder="Prénom" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm focus:border-emerald-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Nom *</label>
            <input type="text" required placeholder="Nom" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm focus:border-emerald-500" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email *</label>
          <input type="email" required placeholder="email@savoirexpress.com" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm focus:border-emerald-500" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Téléphone</label>
          <input type="tel" placeholder="77 000 00 00" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm focus:border-emerald-500" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Région</label>
          <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white outline-none text-sm text-slate-700 focus:border-emerald-500">
            <option value="">Choisir une région</option>
            {["Dakar","Thiès","Saint-Louis","Diourbel","Kaolack","Fatick","Kaffrine","Tambacounda","Kédougou","Kolda","Sédhiou","Ziguinchor","Matam","Louga"].map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Je suis *</label>
          <select required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white outline-none text-sm text-slate-700 focus:border-emerald-500">
            <option value="">Choisir...</option>
            <option value="eleve">Élève</option>
            <option value="parent">Parent</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mot de passe *</label>
          <input type="password" required placeholder="minimum 6 caractères" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm focus:border-emerald-500" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Confirmer le mot de passe *</label>
          <input type="password" required placeholder="Répétez le mot de passe" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm focus:border-emerald-500" />
        </div>
        <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all">
          Créer mon compte
        </button>
      </form>
      <div className="text-center mt-4 pt-4 border-t border-slate-100 text-xs">
        <p className="text-slate-500">Déjà inscrit ?{" "}
          <button onClick={() => { setIsRegisterOpen(false); setIsLoginOpen(true); }} className="text-emerald-600 font-bold hover:underline">Se connecter</button>
        </p>
      </div>
    </div>
  </div>
)}
    </div>
  );

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route path="/*" element={<PublicLayout />} />

        {/* Routes admin */}
        <Route path="/admin/login" element={<AdminLogin onLogin={setAdminUser} />} />
        <Route path="/admin/dashboard" element={
          adminUser
            ? <AdminDashboard admin={adminUser} onLogout={() => setAdminUser(null)} />
            : <Navigate to="/admin/login" replace />
        } />

      <Route path="/dashboard/eleve" element={
        currentUser && (currentUser.role === 'eleve' || currentUser.role === 'parent')
          ? <EleveDashboard currentUser={currentUser} onLogout={() => { setCurrentUser(null); }} />
          : <Navigate to="/" replace />
      } />

      <Route path="/dashboard/repetiteur" element={
        currentUser && currentUser.role === 'repetiteur'
          ? <RepetiteurDashboard currentUser={currentUser} onLogout={() => { setCurrentUser(null); }} />
          : <Navigate to="/" replace />
      } />
      </Routes>
    </BrowserRouter>
  );
}