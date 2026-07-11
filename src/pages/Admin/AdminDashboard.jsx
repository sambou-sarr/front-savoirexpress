import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UsersManager from "./UsersManager";
import SessionsManager from "./SessionsManager";
import RepetiteursManager from "./RepetiteursManager";

export default function AdminDashboard({ admin, onLogout }) {
  const navigate = useNavigate();
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [selected, setSelected] = useState(null);

  

  const regions = ["Dakar","Thiès","Saint-Louis","Diourbel","Kaolack","Fatick","Kaffrine","Tambacounda","Kédougou","Kolda","Sédhiou","Ziguinchor","Matam","Louga"];

  const chargerDemandes = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/demandes-repetiteur')
      .then(res => res.json())
      .then(data => { setDemandes(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { chargerDemandes(); }, []);

  const handleLogout = () => { onLogout(); navigate("/admin/login"); };

  const handleAction = async (id, action) => {
    await fetch(`http://localhost:8000/api/demandes-repetiteur/${id}/${action}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    });
    chargerDemandes();
    setSelected(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette demande ?")) return;
    await fetch(`http://localhost:8000/api/demandes-repetiteur/${id}`, { method: 'DELETE' });
    chargerDemandes();
    setSelected(null);
  };

  const filteredDemandes = demandes.filter(d => {
    const matchSearch = searchTerm === '' ||
      `${d.prenom} ${d.nom} ${d.email}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRegion = filterRegion === '' || d.region === filterRegion;
    const matchStatut = filterStatut === '' || (d.statut || 'en_attente') === filterStatut;
    return matchSearch && matchRegion && matchStatut;
  });

  const stats = {
    total: demandes.length,
    enAttente: demandes.filter(d => !d.statut || d.statut === 'en_attente').length,
    confirmes: demandes.filter(d => d.statut === 'confirme').length,
    refuses: demandes.filter(d => d.statut === 'refuse').length,
  };

  const statutBadge = (statut) => {
    const s = statut || 'en_attente';
    if (s === 'confirme') return 'bg-emerald-100 text-emerald-800';
    if (s === 'refuse') return 'bg-red-100 text-red-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const statutLabel = (statut) => {
    const s = statut || 'en_attente';
    if (s === 'confirme') return 'Confirmé';
    if (s === 'refuse') return 'Refusé';
    return 'En attente';
  };

  const [activeSection, setActiveSection] = useState('demandes');

  return (
    <div className="min-h-screen bg-slate-50">

    <nav className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="bg-emerald-600 text-white p-1.5 rounded-lg">
          <i className="fa-solid fa-graduation-cap"></i>
        </div>
        <span className="font-bold text-slate-900">SavoirExpress</span>
        <span className="text-slate-300">|</span>
        <span className="text-sm text-emerald-700 font-semibold">Admin</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500">
          <i className="fa-solid fa-user-shield mr-1.5 text-emerald-600"></i>
          {admin.nom}
        </span>
        <button
          onClick={handleLogout}
          className="text-sm px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl transition-all"
        >
          <i className="fa-solid fa-right-from-bracket mr-1.5"></i>Déconnexion
        </button>
      </div>
    </nav>

    <div className="flex min-h-screen">

{/* Sidebar */}
<aside className="w-56 bg-white border-r border-slate-100 shadow-sm flex flex-col">
  <div className="p-4 border-b border-slate-100">
    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Menu</p>
  </div>
  <nav className="flex-1 p-3 space-y-1">
    {[
      { id: 'demandes',    label: 'Demandes répétiteurs', icon: 'fa-file-lines' },
      { id: 'repetiteurs', label: 'Répétiteurs', icon: 'fa-chalkboard-user' },
      { id: 'utilisateurs', label: 'Utilisateurs',        icon: 'fa-users' },
      { id: 'sessions', label: 'Sessions', icon: 'fa-calendar-check' },
    ].map(item => (
      <button
        key={item.id}
        onClick={() => setActiveSection(item.id)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
          activeSection === item.id
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
        }`}
      >
        <i className={`fa-solid ${item.icon} text-sm`}></i>
        {item.label}
      </button>
    ))}
  </nav>
</aside>

{/* Contenu principal */}
<main className="flex-1 p-8 bg-slate-50">

  {/* Section Demandes */}
  {activeSection === 'demandes' && (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900">Demandes répétiteurs</h1>
        <p className="text-slate-500 text-sm mt-1">Gérez les candidatures des répétiteurs</p>
      </div>

      {/* Stats demandes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total",      value: stats.total,      color: "blue",    icon: "fa-file-lines" },
          { label: "En attente", value: stats.enAttente,  color: "yellow",  icon: "fa-clock" },
          { label: "Confirmés",  value: stats.confirmes,  color: "emerald", icon: "fa-circle-check" },
          { label: "Refusés",    value: stats.refuses,    color: "red",     icon: "fa-circle-xmark" },
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

      {/* Filtres demandes */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-3 text-slate-400 text-sm"></i>
          <input
            type="text"
            placeholder="Rechercher par nom, prénom, email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm focus:border-emerald-400"
          />
        </div>
        <select
          value={filterRegion}
          onChange={e => setFilterRegion(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm text-slate-700 bg-white focus:border-emerald-400"
        >
          <option value="">Toutes les régions</option>
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select
          value={filterStatut}
          onChange={e => setFilterStatut(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm text-slate-700 bg-white focus:border-emerald-400"
        >
          <option value="">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="confirme">Confirmé</option>
          <option value="refuse">Refusé</option>
        </select>
      </div>

      {/* Tableau demandes */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-900">
            Demandes
            <span className="ml-2 text-sm font-normal text-slate-400">({filteredDemandes.length} résultats)</span>
          </h2>
        </div>
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <i className="fa-solid fa-spinner fa-spin text-2xl mb-3"></i>
            <p className="text-sm">Chargement...</p>
          </div>
        ) : filteredDemandes.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <i className="fa-solid fa-inbox text-3xl mb-3"></i>
            <p className="text-sm">Aucune demande trouvée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {["Nom & Prénom","Email","Région","Téléphone","Date","Statut","Actions"].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredDemandes.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900 text-sm">{d.prenom} {d.nom}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{d.email}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{d.region}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{d.telephone || '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">
                      {new Date(d.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statutBadge(d.statut)}`}>
                        {statutLabel(d.statut)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelected(d)}
                        className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 font-semibold rounded-lg transition-all"
                      >
                        Voir
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
  )}
  {activeSection === 'repetiteurs' && (
  <div>
    <div className="mb-8">
      <h1 className="text-2xl font-black text-slate-900">Gestion des répétiteurs</h1>
      <p className="text-slate-500 text-sm mt-1">Gérez les répétiteurs actifs de la plateforme</p>
    </div>
    <RepetiteursManager />
  </div>
)}

  {/* Section Utilisateurs */}
  {activeSection === 'utilisateurs' && (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900">Gestion des utilisateurs</h1>
        <p className="text-slate-500 text-sm mt-1">Créez et gérez les élèves et répétiteurs</p>
      </div>
      <UsersManager />
    </div>
  )}

{activeSection === 'sessions' && (
  <div>
    <div className="mb-8">
      <h1 className="text-2xl font-black text-slate-900">Gestion des sessions</h1>
      <p className="text-slate-500 text-sm mt-1">Toutes les réservations de la plateforme</p>
    </div>
    <SessionsManager />
  </div>
)}

</main>
</div>

{/* Modal détail demande */}
{selected && (
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelected(null)}></div>
  <div className="bg-white rounded-3xl w-full max-w-lg p-6 relative shadow-2xl z-10">
    <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
      <i className="fa-solid fa-xmark text-lg"></i>
    </button>
    <div className="mb-4">
      <h3 className="text-lg font-black text-slate-900">{selected.prenom} {selected.nom}</h3>
      <p className="text-sm text-slate-400">{selected.email}</p>
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full mt-2 inline-block ${statutBadge(selected.statut)}`}>
        {statutLabel(selected.statut)}
      </span>
    </div>
    <div className="grid grid-cols-2 gap-3 mb-4">
      <div className="bg-slate-50 rounded-xl p-3">
        <p className="text-xs text-slate-400 mb-1">Région</p>
        <p className="text-sm font-semibold text-slate-700">{selected.region}</p>
      </div>
      <div className="bg-slate-50 rounded-xl p-3">
        <p className="text-xs text-slate-400 mb-1">Téléphone</p>
        <p className="text-sm font-semibold text-slate-700">{selected.telephone || '—'}</p>
      </div>
      <div className="bg-slate-50 rounded-xl p-3">
        <p className="text-xs text-slate-400 mb-1">Date de naissance</p>
        <p className="text-sm font-semibold text-slate-700">{selected.date_naissance || '—'}</p>
      </div>
      <div className="bg-slate-50 rounded-xl p-3">
        <p className="text-xs text-slate-400 mb-1">CV</p>
        <p className="text-sm font-semibold text-slate-700 truncate">{selected.cv_url || '—'}</p>
      </div>
    </div>
    <div className="bg-slate-50 rounded-xl p-3 mb-5">
      <p className="text-xs text-slate-400 mb-1">Motivations</p>
      <p className="text-sm text-slate-700 leading-relaxed">{selected.motivations}</p>
    </div>
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => handleAction(selected.id, 'confirmer')}
        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-all"
      >
        <i className="fa-solid fa-check mr-1.5"></i>Confirmer
      </button>
      <button
        onClick={() => handleAction(selected.id, 'refuser')}
        className="flex-1 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-bold rounded-xl transition-all"
      >
        <i className="fa-solid fa-xmark mr-1.5"></i>Refuser
      </button>
      
      <a
        href={`mailto:${selected.email}`}
        className="flex-1 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-bold rounded-xl transition-all text-center"
      >
        <i className="fa-solid fa-envelope mr-1.5"></i>
        Email
      </a>
      <button
        onClick={() => handleDelete(selected.id)}
        className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold rounded-xl transition-all"
      >
        <i className="fa-solid fa-trash"></i>
        </button>
    </div>
  </div>
</div>
)}

    </div>
  );
}