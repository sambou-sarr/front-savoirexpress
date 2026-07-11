import { useState, useEffect } from "react";

export default function SessionsManager() {
  const [sessions, setSessions]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filterStatut, setFilterStatut] = useState('');

  const chargerSessions = () => {
    fetch('http://localhost:8000/api/sessions')
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

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette session ?')) return;
    await fetch(`http://localhost:8000/api/sessions/${id}`, { method: 'DELETE' });
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

  const stats = {
    total:     sessions.length,
    attente:   sessions.filter(s => s.statut === 'en_attente').length,
    acceptees: sessions.filter(s => s.statut === 'accepte').length,
    terminees: sessions.filter(s => s.statut === 'termine').length,
  };

  const filtered = filterStatut === ''
    ? sessions
    : sessions.filter(s => s.statut === filterStatut);

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total",      value: stats.total,     color: "blue",    icon: "fa-calendar" },
          { label: "En attente", value: stats.attente,   color: "yellow",  icon: "fa-clock" },
          { label: "Acceptées",  value: stats.acceptees, color: "emerald", icon: "fa-circle-check" },
          { label: "Terminées",  value: stats.terminees, color: "slate",   icon: "fa-flag-checkered" },
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

      <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6 shadow-sm">
        <select
          value={filterStatut}
          onChange={e => setFilterStatut(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm bg-white"
        >
          <option value="">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="accepte">Acceptées</option>
          <option value="refuse">Refusées</option>
          <option value="termine">Terminées</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-900">
            Sessions
            <span className="ml-2 text-sm font-normal text-slate-400">({filtered.length} résultats)</span>
          </h2>
        </div>
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <i className="fa-solid fa-spinner fa-spin text-2xl mb-3 block"></i>
            <p className="text-sm">Chargement...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <i className="fa-solid fa-calendar text-3xl mb-3 block"></i>
            <p className="text-sm">Aucune session trouvée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {["Élève","Répétiteur","Matière","Date","Durée","Montant","Statut","Actions"].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                      {s.eleve?.prenom} {s.eleve?.nom}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">
                      {s.repetiteur?.prenom} {s.repetiteur?.nom}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">{s.matiere}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {new Date(s.date_session).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">{s.duree_heures}h</td>
                    <td className="px-4 py-3 text-sm font-bold text-emerald-700">
                      {s.montant?.toLocaleString()} FCFA
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statutBadge(s.statut)}`}>
                        {statutLabel(s.statut)}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      {s.statut === 'en_attente' && (
                        <button
                          onClick={() => handleStatut(s.id, 'accepte')}
                          className="text-xs px-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold rounded-lg"
                        >
                          Accepter
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="text-xs px-2 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}