import { useState, useEffect } from "react";

export default function EleveDashboard({ currentUser, onLogout }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/sessions/eleve/${currentUser.id}`)
      .then(res => res.json())
      .then(data => { setSessions(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

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
          <div className="bg-emerald-600 text-white p-1.5 rounded-lg">
            <i className="fa-solid fa-graduation-cap"></i>
          </div>
          <span className="font-bold text-slate-900">SavoirExpress</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500">
            <i className="fa-solid fa-user mr-1.5 text-emerald-600"></i>
            {currentUser.prenom} {currentUser.nom}
          </span>
          <button onClick={onLogout} className="text-sm px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl transition-all">
            <i className="fa-solid fa-right-from-bracket mr-1.5"></i>Déconnexion
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white mb-8">
          <h1 className="text-2xl font-black mb-1">Bonjour, {currentUser.prenom} ! 👋</h1>
          <p className="text-emerald-100 text-sm">Bienvenue dans votre espace personnel</p>
          <div className="mt-4 flex gap-3 flex-wrap">
            <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              <i className="fa-solid fa-user-graduate mr-1.5"></i>
              {currentUser.role === 'parent' ? 'Parent' : 'Élève'}
            </span>
            {currentUser.region && (
              <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                <i className="fa-solid fa-location-dot mr-1.5"></i>{currentUser.region}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Réservations", value: sessions.length,                                        icon: "fa-calendar-check", color: "emerald" },
            { label: "En attente",   value: sessions.filter(s => s.statut === 'en_attente').length, icon: "fa-clock",          color: "yellow" },
            { label: "Acceptées",    value: sessions.filter(s => s.statut === 'accepte').length,    icon: "fa-circle-check",   color: "blue" },
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
              { label: "Rôle",      value: currentUser.role === 'parent' ? 'Parent' : 'Élève' },
            ].map((item, i) => (
              <div key={i} className="bg-slate-50 rounded-xl p-3">
                <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                <p className="text-sm font-semibold text-slate-700">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">Mes réservations</h2>
          {loading ? (
            <div className="p-8 text-center text-slate-400">
              <i className="fa-solid fa-spinner fa-spin text-2xl mb-3 block"></i>
              <p className="text-sm">Chargement...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <i className="fa-solid fa-calendar text-3xl mb-3 block"></i>
              <p className="text-sm">Vous n'avez pas encore de réservation.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map(s => (
                <div key={s.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col sm:flex-row justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-900 text-sm">{s.matiere}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statutBadge(s.statut)}`}>
                        {statutLabel(s.statut)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      <i className="fa-solid fa-user mr-1"></i>
                      {s.repetiteur?.prenom} {s.repetiteur?.nom}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      <i className="fa-regular fa-calendar mr-1"></i>
                      {new Date(s.date_session).toLocaleDateString('fr-FR')} — {s.duree_heures}h
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-400">Montant</p>
                    <p className="font-black text-emerald-700">{s.montant?.toLocaleString()} FCFA</p>
                    {s.repetiteur?.email && (
                      <a href={`mailto:${s.repetiteur.email}`} className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                        <i className="fa-solid fa-envelope mr-1"></i>Contacter
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}