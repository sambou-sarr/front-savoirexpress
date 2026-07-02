import { useState } from "react";
 
export default function Home({ db, currentUser, onBookSession, onStartCourse, onOpenLogin, onOpenRegister }) {

  // ── États de recherche et filtres ──
  const [searchSubject, setSearchSubject] = useState('');
  const [searchRegion, setSearchRegion] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTutor, setSelectedTutor] = useState(null);

  // ── États du formulaire de réservation ──
  const [bookingSubject, setBookingSubject] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingDuration, setBookingDuration] = useState(1);
  const [bookingNotes, setBookingNotes] = useState('');

  // ── États du formulaire répétiteur ──
  const [showRepetiteurForm, setShowRepetiteurForm] = useState(false);
  const [repForm, setRepForm] = useState({
    prenom: '',
    nom: '',
    date_naissance: '',
    email: '',
    telephone: '',
    region: '',
    motivations: '',
    cv_url: ''
  });

  // ── Données des cours ──
  const courses = [
    { id: 1, title: "Mathématiques Terminale S", category: "BAC", level: "Terminale S", instructor: "M. Diop", rating: 4.9, students: 1240, image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400", price: "Gratuit" },
    { id: 2, title: "Préparation au BFEM : Sciences Physiques", category: "BFEM", level: "Troisième", instructor: "Mme Ndiaye", rating: 4.8, students: 850, image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=400", price: "Gratuit" },
    { id: 3, title: "CM2 : Français, Vocabulaire & Dictée", category: "CM2", level: "CM2", instructor: "M. Sow", rating: 5.0, students: 930, image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=400", price: "Gratuit" },
    { id: 4, title: "Français BAC : Méthodologie de la Dissertation", category: "BAC", level: "Lycée", instructor: "Mme Sow", rating: 4.9, students: 1420, image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=400", price: "Gratuit" },
    { id: 5, title: "CM2 : Mathématiques & Résolution de Problèmes", category: "CM2", level: "CM2", instructor: "M. Cissé", rating: 4.9, students: 810, image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400", price: "Gratuit" },
    { id: 6, title: "Création de sites Web (HTML / CSS / React)", category: "tech", level: "Intermédiaire", instructor: "Mme Sy", rating: 5.0, students: 1890, image: "https://images.unsplash.com/photo-1581291518655-9523c932dedf?auto=format&fit=crop&q=80&w=400", price: "Gratuit" },
  ];

  // Cours filtrés selon la catégorie sélectionnée
  const filteredCourses = selectedCategory === 'all'
    ? courses
    : courses.filter(c => c.category === selectedCategory);

  // Trouve le profil d'un répétiteur
  const getTutorProfile = (tutor) => db.profiles.find(p => p.id === tutor.profile_id) || {};

  // Répétiteurs filtrés selon matière et région
  const filteredTutors = db.repetiteurs.filter(tutor => {
    const profile = getTutorProfile(tutor);
    const matchesSubject = searchSubject === '' || tutor.matieres.some(m => m.toLowerCase().includes(searchSubject.toLowerCase()));
    const matchesRegion = searchRegion === '' || (profile.region && profile.region.toLowerCase() === searchRegion.toLowerCase());
    return matchesSubject && matchesRegion && tutor.disponible;
  });

  // ── Handler : soumettre une réservation ──
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) { onOpenLogin(); return; }
    const amount = selectedTutor.tarif_horaire * bookingDuration;
    onBookSession({
      repetiteur_id: selectedTutor.id,
      eleve_id: currentUser.id,
      matiere: bookingSubject,
      date_session: bookingDate,
      duree_heures: parseFloat(bookingDuration),
      montant: amount,
      notes: bookingNotes,
    });
    setSelectedTutor(null);
    setBookingSubject('');
    setBookingDate('');
    setBookingDuration(1);
    setBookingNotes('');
  };

  // ── Handler : champ formulaire répétiteur ──
  const handleRepChange = (e) => {
    setRepForm({ ...repForm, [e.target.name]: e.target.value });
  };

  // ── Handler : soumettre demande répétiteur ──
  const handleRepSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:8000/api/demandes-repetiteur', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(repForm),
      });
  
      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi');
      }
  
      alert("Demande envoyée avec succès ! Nous vous contacterons bientôt.");
      setShowRepetiteurForm(false);
      setRepForm({ prenom: '', nom: '', date_naissance: '', email: '', telephone: '', region: '', motivations: '', cv_url: '' });
  
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue. Réessaie.");
    }
  };
  return (
    <div>

      {/* ═══════════════════════════════════ HERO ═══════════════════════════════════ */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-white to-slate-50">
        <div className="absolute top-0 right-0 -z-10 translate-x-1/3 -translate-y-1/4 w-[600px] h-[600px] rounded-full bg-emerald-100/40 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -z-10 -translate-x-1/4 translate-y-1/4 w-[500px] h-[500px] rounded-full bg-yellow-100/30 blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">

            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Plateforme 100% Sénégalaise • Conforme au programme national
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1]">
                L'éducation d'excellence <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">à portée de main</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Maîtrisez pleinement le programme du CM2, du BFEM et du BAC, perfectionnez vos compétences scientifiques et apprenez la tech avec les professeurs les plus inspirants du Sénégal.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <a href="#courses-section" className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-center shadow-lg shadow-emerald-600/25 hover:-translate-y-0.5 transition-all">
                  Découvrir nos cours
                </a>
                <button
                  onClick={() => { if (!currentUser) onOpenLogin(); else window.location.hash = "#repetiteurs-section"; }}
                  className="px-8 py-4 bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-700 font-bold rounded-xl text-center transition-all"
                >
                  Trouver un Répétiteur
                </button>
              </div>
              <div className="pt-8 border-t border-slate-200/60 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                <div><div className="text-2xl sm:text-3xl font-extrabold text-slate-900">10k+</div><div className="text-xs sm:text-sm text-slate-500">Élèves connectés</div></div>
                <div><div className="text-2xl sm:text-3xl font-extrabold text-slate-900">150+</div><div className="text-xs sm:text-sm text-slate-500">Cours & fiches</div></div>
                <div><div className="text-2xl sm:text-3xl font-extrabold text-slate-900">98%</div><div className="text-xs sm:text-sm text-slate-500">Taux de réussite</div></div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-[450px] lg:max-w-none">
                <div className="absolute -top-4 -left-4 w-full h-full border-2 border-yellow-400 rounded-3xl -z-10 translate-x-2 translate-y-2"></div>
                <div className="relative bg-emerald-900 rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-square shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800" alt="SavoirExpress" className="w-full h-full object-cover mix-blend-overlay opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl flex items-center gap-4 shadow-xl">
                    <div className="bg-yellow-100 text-yellow-700 p-3 rounded-xl flex items-center justify-center">
                      <i className="fa-solid fa-medal text-xl"></i>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm sm:text-base">Meilleurs Enseignants</div>
                      <div className="text-xs text-slate-500 font-semibold">Sélectionnés et certifiés par l'État</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════ POURQUOI NOUS ════════════════════════════ */}
      <section id="features-section" className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Pourquoi choisir SavoirExpress ?</h2>
            <p className="text-lg text-slate-600">Une plateforme pensée pour faciliter l'apprentissage et maximiser les chances de réussite de chaque apprenant sénégalais.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "fa-book-open", color: "emerald", title: "Conforme au Programme", desc: "Tous nos cours, fiches de révision et quiz respectent scrupuleusement le programme officiel de l'Éducation Nationale sénégalaise." },
              { icon: "fa-cloud-arrow-down", color: "yellow", title: "Contenus Hors-ligne", desc: "Téléchargez vos cours, exercices et fiches PDF pour pouvoir continuer de réviser même sans connexion Internet active." },
              { icon: "fa-comments", color: "blue", title: "Entraide & Mentorat", desc: "Posez vos questions sur notre forum communautaire et recevez des explications détaillées de la part de nos mentors." },
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div className={`w-12 h-12 bg-${item.color}-100 text-${item.color}-700 rounded-2xl flex items-center justify-center mb-6`}>
                  <i className={`fa-solid ${item.icon} text-xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ COURS ══════════════════════════════ */}
      <section id="courses-section" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Nos cours populaires</h2>
              <p className="text-slate-600 max-w-xl">Explorez notre catalogue spécial d'examens nationaux : CM2, BFEM et BAC.</p>
            </div>
            <div className="flex flex-wrap gap-2 bg-slate-200/60 p-1.5 rounded-2xl self-start">
              {[{ id: 'all', label: 'Tous' }, { id: 'CM2', label: 'CM2 (Primaire)' }, { id: 'BFEM', label: 'BFEM (Troisième)' }, { id: 'BAC', label: 'BAC (Terminale)' }, { id: 'tech', label: 'Technologie' }].map(cat => (
                <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedCategory === cat.id ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map(course => (
              <div key={course.id} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="h-48 overflow-hidden relative">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-emerald-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">{course.level}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-slate-500 mb-4">Par {course.instructor}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex text-amber-500 gap-0.5 text-xs">{[...Array(5)].map((_, i) => <i key={i} className="fa-solid fa-star"></i>)}</div>
                      <span className="text-xs font-bold text-slate-700">{course.rating}</span>
                      <span className="text-xs text-slate-400">({course.students} élèves)</span>
                    </div>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-2 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-emerald-600 font-extrabold text-lg">{course.price}</span>
                  <button
                    onClick={() => { if (!currentUser) onOpenLogin(); else onStartCourse(course); }}
                    className="text-sm bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 font-bold px-4 py-2.5 rounded-xl transition-all"
                  >
                    Commencer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════ RÉPÉTITEURS ══════════════════════════ */}
      <section id="repetiteurs-section" className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Trouver un répétiteur particulier</h2>
            <p className="text-slate-600">Planifiez un accompagnement personnalisé pour CM2, BFEM ou BAC.</p>
          </div>

          {!currentUser ? (
            <div className="relative bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-200 text-center shadow-inner overflow-hidden">
              <div className="absolute inset-0 bg-slate-100/40 backdrop-blur-md"></div>
              <div className="relative z-10 max-w-md mx-auto py-10 space-y-6">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto shadow border border-emerald-100">
                  <i className="fa-solid fa-lock"></i>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900">Connexion Obligatoire</h3>
                  <p className="text-slate-600 text-sm">Pour accéder à notre catalogue d'enseignants certifiés, filtrer par région/matière et planifier des cours, vous devez d'abord posséder un compte.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <button onClick={onOpenLogin} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition-all shadow-md text-sm">
                    <i className="fa-solid fa-right-to-bracket mr-2"></i>Se connecter
                  </button>
                  <button onClick={onOpenRegister} className="px-6 py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold rounded-xl transition-all text-sm">
                    Créer un compte
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-slate-100 p-4 rounded-3xl flex flex-col md:flex-row gap-3 shadow-inner max-w-3xl mx-auto">
                <div className="flex-1 relative">
                  <i className="fa-solid fa-book-open absolute left-4 top-3.5 text-slate-400"></i>
                  <input type="text" placeholder="Quelle matière ? (Maths, SVT...)" value={searchSubject} onChange={(e) => setSearchSubject(e.target.value)} className="w-full bg-white text-sm text-slate-700 pl-11 pr-4 py-3 rounded-xl outline-none border border-transparent focus:border-emerald-300" />
                </div>
                <div className="flex-1 relative">
                  <i className="fa-solid fa-location-dot absolute left-4 top-3.5 text-slate-400"></i>
                  <select value={searchRegion} onChange={(e) => setSearchRegion(e.target.value)} className="w-full bg-white text-sm text-slate-700 pl-11 pr-4 py-3 rounded-xl outline-none border border-transparent focus:border-emerald-300 appearance-none">
                    <option value="">Toutes les régions (Sénégal)</option>
                    <option value="Dakar">Dakar</option>
                    <option value="Thiès">Thiès</option>
                    <option value="Saint-Louis">Saint-Louis</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTutors.map(tutor => {
                  const profile = getTutorProfile(tutor);
                  return (
                    <div key={tutor.id} className="bg-slate-50 rounded-3xl border border-slate-150 p-6 flex flex-col justify-between hover:shadow-lg transition-all">
                      <div>
                        <div className="flex items-center gap-4 mb-4">
                          <img src={profile.photo_url} className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow" alt="Tuteur" />
                          <div>
                            <h3 className="font-extrabold text-slate-900">{profile.prenom} {profile.nom}</h3>
                            <p className="text-xs text-slate-400"><i className="fa-solid fa-location-dot text-red-500 mr-1"></i>{profile.region}</p>
                            <div className="flex items-center gap-1 mt-1 text-xs text-amber-500 font-bold">
                              <i className="fa-solid fa-star"></i> {tutor.note_moyenne} ({tutor.nb_sessions} sessions)
                            </div>
                          </div>
                        </div>
                        <p className="text-slate-600 text-xs line-clamp-3 mb-4">{tutor.description}</p>
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-1">
                            {tutor.matieres.map((mat, idx) => <span key={idx} className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">{mat}</span>)}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {tutor.niveaux.map((niv, idx) => <span key={idx} className="bg-slate-200 text-slate-700 text-[9px] font-semibold px-2 py-0.5 rounded">{niv}</span>)}
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-slate-200/50 mt-6 pt-4 flex items-center justify-between">
                        <span className="text-slate-800 font-black text-sm">{tutor.tarif_horaire.toLocaleString()} FCFA/h</span>
                        <button onClick={() => setSelectedTutor(tutor)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all">
                          Réserver tuteur
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════ DEVENIR RÉPÉTITEUR ═══════════════════════ */}
      <section id="devenir-repetiteur" className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        <div className="absolute -top-20 right-0 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 left-0 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-10 md:p-14 text-center space-y-8">

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-sm">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Opportunité pour enseignants et étudiants
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              Devenir répétiteur et accompagner des élèves
            </h2>

            <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Rejoignez une plateforme qui met en relation des élèves et des personnes compétentes
              pour un accompagnement scolaire simple, structuré et efficace dans toutes les matières.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
              <div className="flex items-start gap-3 text-slate-700 text-sm"><span className="text-emerald-600 font-bold">✔</span>Accompagne des élèves du CM2 au BAC</div>
              <div className="flex items-start gap-3 text-slate-700 text-sm"><span className="text-emerald-600 font-bold">✔</span>Gère ton emploi du temps librement</div>
              <div className="flex items-start gap-3 text-slate-700 text-sm"><span className="text-emerald-600 font-bold">✔</span>Développe ton expérience pédagogique</div>
              <div className="flex items-start gap-3 text-slate-700 text-sm"><span className="text-emerald-600 font-bold">✔</span>Connecte-toi à des élèves motivés</div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-slate-600 text-sm">
              Une fois inscrit, ton profil devient visible et les élèves peuvent te contacter selon leurs besoins et ton domaine.
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <button
                onClick={() => setShowRepetiteurForm(true)}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition"
              >
                Devenir répétiteur
              </button>
              <button
                onClick={() => window.location.hash = "#repetiteurs-section"}
                className="px-8 py-3 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition"
              >
                Voir les répétiteurs
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════ MÉTHODE ══════════════════════════ */}
      <section id="how-it-works" className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900">Comment fonctionne SavoirExpress ?</h2>
            <p className="text-slate-600">Trois étapes simples pour commencer à révolutionner votre parcours scolaire.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: 1, title: "Créez votre compte", desc: "Inscrivez-vous gratuitement en 30 secondes pour accéder à votre tableau de bord personnalisé." },
              { num: 2, title: "Choisissez vos matières", desc: "Sélectionnez votre classe d'examen nationale (CM2, BFEM ou BAC) pour cibler vos besoins." },
              { num: 3, title: "Apprenez et progressez", desc: "Réservez des tuteurs dévoués, téléchargez des PDF d'entraînement et préparez vos examens sereinement." },
            ].map(step => (
              <div key={step.num} className="text-center space-y-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 border-2 border-emerald-500 rounded-full flex items-center justify-center text-xl font-black mx-auto">{step.num}</div>
                <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                <p className="text-slate-500 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ MODAL : RÉSERVATION RÉPÉTITEUR ══════════════ */}
      {selectedTutor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setSelectedTutor(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
          <div className="bg-white rounded-3xl w-full max-w-md p-6 relative shadow-2xl z-10 border border-slate-100">
            <button onClick={() => setSelectedTutor(null)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50">
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
            <div className="flex items-start gap-4 pb-4 border-b border-slate-100 mb-4">
              <img src={getTutorProfile(selectedTutor).photo_url} className="w-14 h-14 rounded-xl object-cover" alt="Avatar" />
              <div>
                <h3 className="text-lg font-black text-slate-900">{getTutorProfile(selectedTutor).prenom} {getTutorProfile(selectedTutor).nom}</h3>
                <p className="text-xs text-slate-400">Répétiteur de {getTutorProfile(selectedTutor).region}</p>
                <p className="text-xs text-emerald-600 font-bold mt-1">{selectedTutor.tarif_horaire.toLocaleString()} FCFA / heure</p>
              </div>
            </div>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Sélectionner la matière *</label>
                <select value={bookingSubject} onChange={(e) => setBookingSubject(e.target.value)} required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm text-slate-700 bg-white">
                  <option value="">Choisissez la matière</option>
                  {selectedTutor.matieres.map((m, idx) => <option key={idx} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Date & Heure *</label>
                  <input type="datetime-local" required value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm text-slate-700" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Durée (Heures) *</label>
                  <select value={bookingDuration} onChange={(e) => setBookingDuration(parseInt(e.target.value))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm text-slate-700 bg-white">
                    <option value={1}>1 Heure</option>
                    <option value={2}>2 Heures</option>
                    <option value={3}>3 Heures</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Notes (Optionnel)</label>
                <textarea rows="2" placeholder="Ex: J'aimerais travailler les fonctions polynômes..." value={bookingNotes} onChange={(e) => setBookingNotes(e.target.value)} className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none text-sm text-slate-700"></textarea>
              </div>
              <div className="bg-emerald-50 p-4 rounded-xl text-center">
                <span className="text-xs text-slate-500 font-semibold block mb-0.5">Montant estimé</span>
                <span className="text-xl font-black text-emerald-800">{(selectedTutor.tarif_horaire * bookingDuration).toLocaleString()} FCFA</span>
              </div>
              <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/10 transition-all text-sm">
                Confirmer et Réserver
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════ MODAL : DEVENIR RÉPÉTITEUR ══════════════ */}
      {showRepetiteurForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowRepetiteurForm(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-6 md:p-10 z-10 max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Demande de répétiteur</h2>
              <button onClick={() => setShowRepetiteurForm(false)} className="text-slate-500 hover:text-slate-800 text-xl font-bold">✕</button>
            </div>

            <form onSubmit={handleRepSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input name="prenom" value={repForm.prenom} onChange={handleRepChange} placeholder="Prénom" className="p-3 border border-slate-200 rounded-xl outline-none focus:border-emerald-400 w-full" required />
                <input name="nom" value={repForm.nom} onChange={handleRepChange} placeholder="Nom" className="p-3 border border-slate-200 rounded-xl outline-none focus:border-emerald-400 w-full" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Date de naissance</label>
                <input type="date" name="date_naissance" value={repForm.date_naissance} onChange={handleRepChange} className="p-3 border border-slate-200 rounded-xl outline-none focus:border-emerald-400 w-full" />
              </div>
              <input name="email" value={repForm.email} onChange={handleRepChange} placeholder="Email" type="email" className="p-3 border border-slate-200 rounded-xl outline-none focus:border-emerald-400 w-full" required />
              <input name="telephone" value={repForm.telephone} onChange={handleRepChange} placeholder="Téléphone (ex: 77 123 45 67)" className="p-3 border border-slate-200 rounded-xl outline-none focus:border-emerald-400 w-full" />
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Région
                </label>

                <select
                  name="region"
                  value={repForm.region}
                  onChange={handleRepChange}
                  required
                  className="p-3 border border-slate-200 rounded-xl outline-none focus:border-emerald-400 w-full bg-white"
                >
                  <option value="">Choisir une région</option>

                  <option value="Dakar">Dakar</option>
                  <option value="Thiès">Thiès</option>
                  <option value="Saint-Louis">Saint-Louis</option>
                  <option value="Diourbel">Diourbel</option>
                  <option value="Kaolack">Kaolack</option>
                  <option value="Fatick">Fatick</option>
                  <option value="Kaffrine">Kaffrine</option>
                  <option value="Tambacounda">Tambacounda</option>
                  <option value="Kédougou">Kédougou</option>
                  <option value="Kolda">Kolda</option>
                  <option value="Sédhiou">Sédhiou</option>
                  <option value="Ziguinchor">Ziguinchor</option>
                  <option value="Matam">Matam</option>
                  <option value="Louga">Louga</option>

                </select>
              </div>              <textarea name="motivations" value={repForm.motivations} onChange={handleRepChange} placeholder="Pourquoi voulez-vous devenir répétiteur ?" className="p-3 border border-slate-200 rounded-xl outline-none focus:border-emerald-400 w-full" rows="4" required />
              <input name="cv_url" value={repForm.cv_url} onChange={handleRepChange} placeholder="Lien CV (Google Drive, etc.)" className="p-3 border border-slate-200 rounded-xl outline-none focus:border-emerald-400 w-full" />
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all">
                Envoyer la demande
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
