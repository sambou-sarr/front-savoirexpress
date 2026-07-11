import { useState, useEffect } from "react";

export default function RepetiteurDashboard({ currentUser, onLogout }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading]   = useState(true);

  const chargerSessions = () => {
    fetch(`http://localhost:8000/api/sessions/repetiteur/${currentUser.id}`)
      .then(res => res.json())
      .then(data => { setSessions(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { chargerSessions(); }, []);

  const handleStatut = async (id, statut) => {
    await fetch(`http://localhost:8000/api/sessions/${id}/statut`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut }),
    });
    chargerSessions();
  };

  const statutBadge = (statut) => {
    if (statut === 'accepte') return 'bg-emerald-100 text-emerald-800';
    if (statut === 'refuse')  return 'bg-red-100 text-red-800';
    if (statut === 'termine') return 'bg-slate-100 text-slate-600';
    return 'bg-yellow-100 text-yellow-800';
  };

  const statutLabel = (statut) => {
    if (statut === 'accepte') return 'Acceptée';
    if (statut === 'refuse')  return 'Refusée';
    if (statut === 'termine') return 'Terminée';
    return 'En attente';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg">
            <i className="fa-solid fa-chalkboard-user"></i>
          </div>
          <span className="font-bold text-slate-900">SavoirExpress</span>
          <span className="text-slate-300">|</span>
          <span className="text-sm text-blue-700 font-semibold">Répétiteur</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">
            <i className="fa-solid fa-user mr-1.5 text-blue-600"></i>
            {currentUser.prenom} {currentUser.nom}
          </span>
          <button onClick={onLogout} className="text-sm px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl transition-all">
            <i className="fa-solid fa-right-from-bracket mr-1.5"></i>Déconnexion
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white mb-8">
          <h1 className="text-2xl font-black mb-1">Bonjour, {currentUser.prenom} ! 👋</h1>
          <p className="text-blue-100 text-sm">Gérez vos sessions et vos élèves</p>
          <div className="mt-4 flex gap-3 flex-wrap">
            <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              <i className="fa-solid fa-chalkboard-user mr-1.5"></i>Répétiteur
            </span>
            {currentUser.region && (
              <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                <i className="fa-solid fa-location-dot mr-1.5"></i>{currentUser.region}
              </span>
            )}
            {currentUser.matieres && (
              <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                <i className="fa-solid fa-book mr-1.5"></i>{currentUser.matieres}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total",      value: sessions.length,                                        icon: "fa-calendar-check", color: "blue" },
            { label: "En attente", value: sessions.filter(s => s.statut === 'en_attente').length, icon: "fa-clock",          color: "yellow" },
            { label: "Acceptées",  value: sessions.filter(s => s.statut === 'accepte').length,    icon: "fa-circle-check",   color: "emerald" },
            { label: "Terminées",  value: sessions.filter(s => s.statut === 'termine').length,    icon: "fa-flag-checkered", color: "purple" },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500">{s.label}</span>
                <i className={`fa-solid ${s.icon} text-${s.color}-500`}></i>
              </div>
              <div className={`text-3xl font-black text-${s.color}-600`}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm mb-6">
          <h2 className="font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">Mon profil</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Prénom",    value: currentUser.prenom },
              { label: "Nom",       value: currentUser.nom },
              { label: "Email",     value: currentUser.email },
              { label: "Téléphone", value: currentUser.telephone || '—' },
              { label: "Région",    value: currentUser.region || '—' },
              { label: "Matières",  value: currentUser.matieres || '—' },
              { label: "Tarif",     value: currentUser.tarif_horaire ? `${currentUser.tarif_horaire} FCFA/h` : '—' },
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                <p className="text-sm font-semibold text-slate-700">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">Mes sessions</h2>
          {loading ? (
            <div className="p-8 text-center text-slate-400">
              <i className="fa-solid fa-spinner fa-spin text-2xl mb-3 block"></i>
              <p className="text-sm">Chargement...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <i className="fa-solid fa-calendar text-3xl mb-3 block"></i>
              <p className="text-sm">Aucune session pour le moment.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map(s => (
                <div key={s.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <div className="flex flex-col sm:flex-row justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900 text-sm">{s.matiere}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statutBadge(s.statut)}`}>
                          {statutLabel(s.statut)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        <i className="fa-solid fa-user mr-1"></i>
                        {s.eleve?.prenom} {s.eleve?.nom}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        <i className="fa-regular fa-calendar mr-1"></i>
                        {new Date(s.date_session).toLocaleDateString('fr-FR')} — {s.duree_heures}h
                      </p>
                      {s.notes && <p className="text-xs text-slate-500 mt-1 italic">"{s.notes}"</p>}
                    </div>
                    <div className="text-right">
                      <p className="font-black text-emerald-700 mb-2">{s.montant?.toLocaleString()} FCFA</p>
                      {s.eleve?.email && (
                        <a href={`mailto:${s.eleve.email}`} className="text-xs text-blue-600 hover:underline block mb-2">
                          <i className="fa-solid fa-envelope mr-1"></i>Contacter
                        </a>
                      )}
                    </div>
                  </div>
                  {s.statut === 'en_attente' && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200">
                      <button
                        onClick={() => handleStatut(s.id, 'accepte')}
                        className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl"
                      >
                        <i className="fa-solid fa-check mr-1.5"></i>Accepter
                      </button>
                      <button
                        onClick={() => handleStatut(s.id, 'refuse')}
                        className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl"
                      >
                        <i className="fa-solid fa-xmark mr-1.5"></i>Refuser
                      </button>
                      <button
                        onClick={() => handleStatut(s.id, 'termine')}
                        className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl"
                      >
                        <i className="fa-solid fa-flag-checkered mr-1.5"></i>Terminer
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}