import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";

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

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const user = { id: "u4", email: "eleve@gmail.com", nom: "Diallo", prenom: "Alassane", telephone: "77 555 11 22", role: "eleve", region: "Dakar", photo_url: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=150" };
    setCurrentUser(user);
    setIsLoginOpen(false);
    triggerToast(`👋 Bienvenue, ${user.prenom} !`);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const user = { id: "u4", email: "nouvel.eleve@gmail.com", nom: "Faye", prenom: "Mariama", telephone: "78 123 45 67", role: "eleve", region: "Thiès", photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" };
    setCurrentUser(user);
    setIsRegisterOpen(false);
    triggerToast("🎉 Inscription réussie ! Bienvenue sur SavoirExpress.");
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

      {currentUser && (
        <div className="bg-white border-b border-slate-100 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-4">
            <button onClick={() => setActiveTab("home")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "home" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "text-slate-500 hover:text-slate-800"}`}>
              <i className="fa-solid fa-house mr-1.5"></i> Accueil & Recherche
            </button>
            <button onClick={() => setActiveTab("dashboard")} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "dashboard" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "text-slate-500 hover:text-slate-800"}`}>
              <i className="fa-solid fa-chart-line mr-1.5"></i> Tableau de bord ({db.sessions.filter(s => s.eleve_id === currentUser.id).length} réservations)
            </button>
          </div>
        </div>
      )}

      <main className="flex-grow">
        {activeTab === "home" ? (
          <Home
            db={db}
            currentUser={currentUser}
            onBookSession={handleBookSession}
            onStartCourse={handleStartCourse}
            onOpenLogin={() => setIsLoginOpen(true)}
            onOpenRegister={() => setIsRegisterOpen(true)}
          />
        ) : (
          <section className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-3xl font-black text-slate-900">Espace Personnel</h2>
          </section>
        )}
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
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 relative shadow-2xl z-10 border border-slate-100">
            <button onClick={() => setIsRegisterOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600">
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
            <h3 className="text-xl font-bold text-slate-900 text-center mb-6">S'inscrire</h3>
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <input type="text" required placeholder="Prénom" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm focus:border-emerald-500" />
              <input type="email" required placeholder="Email" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm focus:border-emerald-500" />
              <input type="password" required placeholder="Mot de passe" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm focus:border-emerald-500" />
              <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl">Créer mon compte</button>
            </form>
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
      </Routes>
    </BrowserRouter>
  );
}