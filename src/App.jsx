import { useState } from "react";
import Nav from "./components/Nav";
import Home from "./components/Home";
 
// ---- Données initiales ----
const initialProfiles = [
  { id: "u1", email: "moussa.diop@gmail.com", nom: "Diop", prenom: "Moussa", telephone: "77 123 45 67", role: "repetiteur", region: "Dakar", photo_url: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=150" },
  { id: "u2", email: "fatou.ndiaye@gmail.com", nom: "Ndiaye", prenom: "Fatou", telephone: "78 987 65 43", role: "repetiteur", region: "Thiès", photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150" },
  { id: "u3", email: "ibrahima.sow@gmail.com", nom: "Sow", prenom: "Ibrahima", telephone: "76 345 12 90", role: "repetiteur", region: "Saint-Louis", photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" },
];

const initialRepetiteurs = [
  { id: "rep1", profile_id: "u1", matieres: ["Mathématiques", "Sciences Physiques"], niveaux: ["BAC (Terminale)"], tarif_horaire: 5000, description: "Professeur de lycée d'excellence avec 8 ans d'expérience. Spécialiste de la préparation au BAC S.", note_moyenne: 4.9, nb_sessions: 42, disponible: true },
  { id: "rep2", profile_id: "u2", matieres: ["SVT", "Français"], niveaux: ["BFEM (3ème)"], tarif_horaire: 4000, description: "Enseignante passionnée. J'aide les élèves du collège à surmonter leurs difficultés pour réussir le BFEM.", note_moyenne: 4.7, nb_sessions: 28, disponible: true },
  { id: "rep3", profile_id: "u3", matieres: ["Français", "Mathématiques"], niveaux: ["CM2"], tarif_horaire: 3000, description: "Instituteur certifié avec 10 ans d'exercice. Idéal pour préparer l'entrée en 6ème.", note_moyenne: 5.0, nb_sessions: 15, disponible: true },
];

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
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

  const handleRepSubmit = async (e) => {
    e.preventDefault();
  
    try {
  
      const { error } = await supabase
        .from('demandes_repetiteur')
        .insert([
          {
            prenom: repForm.prenom,
            nom: repForm.nom,
            date_naissance: repForm.date_naissance,
            email: repForm.email,
            telephone: repForm.telephone,
            region: repForm.region,
            motivations: repForm.motivations,
            cv_url: repForm.cv_url,
          }
        ]);
  
      if (error) {
        console.error(error);
        alert("Erreur lors de l'envoi");
        return;
      }
  
      alert("Demande envoyée avec succès ✅");
  
      setShowRepetiteurForm(false);
  
      setRepForm({
        prenom: '',
        nom: '',
        date_naissance: '',
        email: '',
        telephone: '',
        region: '',
        motivations: '',
        cv_url: ''
      });
  
    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    }
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
    triggerToast(`👋 Bienvenue, ${user.prenom} ! Vous avez désormais un accès complet.`);
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
  
    // ici plus tard tu pourras envoyer vers Supabase
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">

      {/* Bande drapeau sénégalais */}
      <div className="bg-gradient-to-r from-emerald-600 via-yellow-500 to-red-600 h-1.5 w-full"></div>

      <Nav
        currentUser={currentUser}
        onLogout={() => { setCurrentUser(null); setActiveTab("home"); triggerToast("Déconnexion réussie."); }}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onChangeRole={handleRoleChange}
      />

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700">
          <i className="fa-solid fa-circle-info text-emerald-500"></i>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Onglets si connecté */}
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
          /* Dashboard */
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="space-y-2 mb-8">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Espace Personnel</h2>
              <p className="text-slate-500 text-sm">Gérez vos rendez-vous de cours particuliers.</p>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4 shadow-sm h-fit">
                <h3 className="font-bold text-slate-950 border-b pb-3 border-slate-100">Détails du compte</h3>
                <div className="flex gap-4 items-center">
                  <img src={currentUser.photo_url} className="w-16 h-16 rounded-2xl object-cover border" alt="Profile" />
                  <div>
                    <h4 className="font-extrabold text-slate-900">{currentUser.prenom} {currentUser.nom}</h4>
                    <span className="inline-block text-[10px] font-black px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full uppercase tracking-wider mt-1">{currentUser.role}</span>
                  </div>
                </div>
                <div className="space-y-2 text-xs text-slate-500 pt-2">
                  <p><i className="fa-solid fa-envelope mr-2"></i>{currentUser.email}</p>
                  <p><i className="fa-solid fa-phone mr-2"></i>{currentUser.telephone}</p>
                  <p><i className="fa-solid fa-location-dot mr-2"></i>{currentUser.region}</p>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                  <h3 className="font-bold text-slate-950 border-b pb-4 border-slate-100 mb-4">Mes Réservations de Cours</h3>
                  {db.sessions.filter(s => s.eleve_id === currentUser.id).length > 0 ? (
                    <div className="space-y-4">
                      {db.sessions.filter(s => s.eleve_id === currentUser.id).map((sess, idx) => (
                        <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-sm font-extrabold text-slate-900">{sess.matiere}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full capitalize bg-yellow-100 text-yellow-800">{sess.statut.replace("_", " ")}</span>
                            </div>
                            <p className="text-xs text-slate-400"><i className="fa-regular fa-calendar mr-1"></i>{new Date(sess.date_session).toLocaleDateString()} ({sess.duree_heures}h)</p>
                            {sess.notes && <p className="text-xs text-slate-500 mt-1 italic">"{sess.notes}"</p>}
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-xs text-slate-400 font-semibold">Montant total</p>
                            <p className="font-black text-emerald-700 text-sm">{sess.montant.toLocaleString()} FCFA</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-400">
                      <p className="text-xs">Vous n'avez pas encore de cours programmé.</p>
                      <button onClick={() => setActiveTab("home")} className="mt-4 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-4 py-2 rounded-xl transition-all">
                        Rechercher un répétiteur maintenant
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-16 bg-gradient-to-r from-emerald-700 to-teal-800 text-white relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold">Prêt à propulser vos notes vers les sommets ?</h2>
            <p className="text-emerald-100 text-lg max-w-2xl mx-auto">Rejoignez des milliers d'élèves sénégalais qui préparent activement leurs examens sur SavoirExpress.</p>
            <div className="pt-4">
              <button onClick={() => setIsRegisterOpen(true)} className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-extrabold rounded-2xl transition-all shadow-xl hover:-translate-y-0.5">
                S'inscrire gratuitement
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t-4 border-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-600 text-white p-2 rounded-xl"><i className="fa-solid fa-graduation-cap text-xl"></i></div>
                <span className="text-xl font-bold text-white">Savoir<span className="text-yellow-500">Express</span></span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">L'apprentissage interactif nouvelle génération, conçu par et pour les talents du Sénégal.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Liens Utiles</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#" className="hover:text-emerald-400 transition-colors">Accueil</a></li>
                <li><a href="#courses-section" className="hover:text-emerald-400 transition-colors">Nos Cours</a></li>
                <li><a href="#features-section" className="hover:text-emerald-400 transition-colors">Pourquoi nous choisir ?</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm">Scolarité</h4>
              <ul className="space-y-2 text-xs">
                <li>Fiches de révision BAC</li>
                <li>Fiches de révision BFEM</li>
                <li>Programme Primaire CM2</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-white font-semibold mb-4 text-sm">Suivez-nous</h4>
              <div className="flex space-x-4">
                {["facebook-f", "twitter", "instagram"].map(icon => (
                  <a key={icon} href="#" className="w-10 h-10 bg-slate-800 hover:bg-emerald-600 text-white rounded-xl flex items-center justify-center transition-colors">
                    <i className={`fa-brands fa-${icon}`}></i>
                  </a>
                ))}
              </div>
              <p className="text-[10px] text-slate-500">© 2026 SavoirExpress. Tous droits réservés.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* LOGIN MODAL */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsLoginOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 relative shadow-2xl z-10 border border-slate-100">
            <button onClick={() => setIsLoginOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100">
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
            <div className="text-center space-y-2 mb-6">
              <h3 className="text-xl font-bold text-slate-900">Se connecter</h3>
              <p className="text-xs text-slate-500">Accédez à votre espace d'excellence d'apprentissage.</p>
            </div>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Adresse email</label>
                <input type="email" required placeholder="exemple@email.com" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mot de passe</label>
                <input type="password" required placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm focus:border-emerald-500" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all">Me connecter</button>
            </form>
            <div className="text-center mt-6 pt-4 border-t border-slate-100 text-xs">
              <p className="text-slate-500">Nouveau sur la plateforme ?{" "}
                <button onClick={() => { setIsLoginOpen(false); setIsRegisterOpen(true); }} className="text-emerald-600 font-bold hover:underline">Créer un compte</button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER MODAL */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsRegisterOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 relative shadow-2xl z-10 border border-slate-100">
            <button onClick={() => setIsRegisterOpen(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50">
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
            <div className="text-center space-y-2 mb-6">
              <h3 className="text-xl font-bold text-slate-900">S'inscrire</h3>
              <p className="text-xs text-slate-500">Rejoignez-nous aujourd'hui pour apprendre gratuitement.</p>
            </div>
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Votre prénom</label>
                <input type="text" required placeholder="Mariama" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Adresse email</label>
                <input type="email" required placeholder="nom@email.com" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm focus:border-emerald-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Classe d'étude</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white outline-none text-sm text-slate-700 focus:border-emerald-500">
                  <option>CM2 (Entrée en 6ème)</option>
                  <option>Troisième (BFEM)</option>
                  <option>Terminale S (BAC S)</option>
                  <option>Terminale L (BAC L)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mot de passe</label>
                <input type="password" required placeholder="••••••••" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm focus:border-emerald-500" />
              </div>
              <button type="submit" className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all">Créer mon compte</button>
            </form>
            <div className="text-center mt-6 pt-4 border-t border-slate-100 text-xs">
              <p className="text-slate-500">Déjà inscrit ?{" "}
                <button onClick={() => { setIsRegisterOpen(false); setIsLoginOpen(true); }} className="text-emerald-600 font-bold hover:underline">Se connecter</button>
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}