import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import EleveDashboard from "./pages/Dashboard/EleveDashboard";
import RepetiteurDashboard from "./pages/Dashboard/RepetiteurDashboard";

export default function App() {

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [adminUser, setAdminUser] = useState(() => {
    const saved = localStorage.getItem('adminUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('activeTab');
    return saved || 'home';
  });

  const [isLoginOpen, setIsLoginOpen]     = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [toastMessage, setToastMessage]   = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const changeTab = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('activeTab', tab);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('activeTab');
    changeTab('home');
    triggerToast('Déconnexion réussie.');
  };

  const handleStartCourse = (course) => {
    triggerToast(`📚 Lancement de votre module : "${course.title}". Bonnes révisions !`);
  };

  const handleBookSession = (sessionData) => {
    console.log("Nouvelle réservation :", sessionData);
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
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      setIsLoginOpen(false);

      if (data.user.role === 'repetiteur') {
        changeTab('dashboard');
      } else {
        changeTab('home');
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
        alert(data.message || "Erreur lors de l'inscription");
        return;
      }

      setCurrentUser(data.data);
      localStorage.setItem('currentUser', JSON.stringify(data.data));
      setIsRegisterOpen(false);
      changeTab('home');
      triggerToast(`🎉 Inscription réussie ! Bienvenue ${prenom} !`);

    } catch (err) {
      alert('Erreur. Vérifie que Laravel tourne.');
    }
  };

  // ── Layout public ──
  const PublicLayout = () => (
    <div className="min-h-screen flex flex-col">

      {/* Bande drapeau */}
      <div className="bg-gradient-to-r from-emerald-600 via-yellow-500 to-red-600 h-1.5 w-full"></div>

      <Nav
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700">
          <i className="fa-solid fa-circle-info text-emerald-500"></i>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Onglets — seulement pour élève et parent */}
      {currentUser && currentUser.role !== 'repetiteur' && (
        <div className="bg-white border-b border-slate-100 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-4">
            <button
              onClick={() => changeTab("home")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "home" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "text-slate-500 hover:text-slate-800"}`}
            >
              <i className="fa-solid fa-house mr-1.5"></i>Accueil & Recherche
            </button>
            <button
              onClick={() => changeTab("dashboard")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === "dashboard" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "text-slate-500 hover:text-slate-800"}`}
            >
              <i className="fa-solid fa-chart-line mr-1.5"></i>Mon espace
            </button>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <main className="flex-grow">
        {activeTab === "home" && (
          <Home
            currentUser={currentUser}
            onBookSession={handleBookSession}
            onStartCourse={handleStartCourse}
            onOpenLogin={() => setIsLoginOpen(true)}
            onOpenRegister={() => setIsRegisterOpen(true)}
          />
        )}
        {activeTab === "dashboard" && currentUser?.role === 'repetiteur' && (
          <RepetiteurDashboard
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        )}
        {activeTab === "dashboard" && currentUser?.role !== 'repetiteur' && currentUser && (
          <EleveDashboard
            currentUser={currentUser}
            onLogout={handleLogout}
          />
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
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Se connecter</h3>
              <p className="text-xs text-slate-500 mt-1">Accédez à votre espace personnel</p>
            </div>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email</label>
                <input type="email" required placeholder="email@exemple.com" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mot de passe</label>
                <input type="password" required placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm focus:border-emerald-500" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl">
                Me connecter
              </button>
            </form>
            <div className="text-center mt-4 pt-4 border-t border-slate-100 text-xs">
              <p className="text-slate-500">Pas encore inscrit ?{" "}
                <button onClick={() => { setIsLoginOpen(false); setIsRegisterOpen(true); }} className="text-emerald-600 font-bold hover:underline">
                  Créer un compte
                </button>
              </p>
            </div>
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
                <input type="email" required placeholder="email@exemple.com" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm focus:border-emerald-500" />
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
                <button onClick={() => { setIsRegisterOpen(false); setIsLoginOpen(true); }} className="text-emerald-600 font-bold hover:underline">
                  Se connecter
                </button>
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
        <Route path="/admin/login" element={
          <AdminLogin onLogin={(admin) => {
            setAdminUser(admin);
            localStorage.setItem('adminUser', JSON.stringify(admin));
          }} />
        } />
        <Route path="/admin/dashboard" element={
          adminUser
            ? <AdminDashboard admin={adminUser} onLogout={() => {
                setAdminUser(null);
                localStorage.removeItem('adminUser');
              }} />
            : <Navigate to="/admin/login" replace />
        } />

      </Routes>
    </BrowserRouter>
  );
}