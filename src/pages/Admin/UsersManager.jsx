import { useState, useEffect } from "react";

export default function UsersManager() {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterRole, setFilterRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', password: '',
    telephone: '', region: '', role: 'eleve',
    matieres: '', tarif_horaire: '', bio: '',
  });

  const regions = ["Dakar","Thiès","Saint-Louis","Diourbel","Kaolack",
    "Fatick","Kaffrine","Tambacounda","Kédougou","Kolda","Sédhiou",
    "Ziguinchor","Matam","Louga"];

  const chargerUsers = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/users')
      .then(res => res.json())
      .then(data => { setUsers(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { chargerUsers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || 'Erreur lors de la création');
        return;
      }
      alert('Utilisateur créé avec succès !');
      setShowForm(false);
      setForm({ nom:'', prenom:'', email:'', password:'', telephone:'', region:'', role:'eleve' });
      chargerUsers();
    } catch {
      alert('Erreur de connexion');
    }
  };

  const handleToggle = async (id) => {
    await fetch(`http://localhost:8000/api/users/${id}/toggle`, { method: 'PUT' });
    chargerUsers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    await fetch(`http://localhost:8000/api/users/${id}`, { method: 'DELETE' });
    chargerUsers();
    setSelected(null);
  };

  const filteredUsers = users.filter(u => {
    const matchSearch = searchTerm === '' ||
      `${u.nom} ${u.prenom} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filterRole === '' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const stats = {
    total:       users.length,
    eleves:      users.filter(u => u.role === 'eleve').length,
    repetiteurs: users.filter(u => u.role === 'repetiteur').length,
    inactifs:    users.filter(u => !u.actif).length,
  };

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total",        value: stats.total,       color: "blue",    icon: "fa-users" },
          { label: "Élèves",       value: stats.eleves,      color: "emerald", icon: "fa-user-graduate" },
          { label: "Répétiteurs",  value: stats.repetiteurs, color: "yellow",  icon: "fa-chalkboard-user" },
          { label: "Inactifs",     value: stats.inactifs,    color: "red",     icon: "fa-user-slash" },
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

      {/* Filtres + bouton créer */}
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
          value={filterRole}
          onChange={e => setFilterRole(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm bg-white focus:border-emerald-400"
        >
          <option value="">Tous les rôles</option>
          <option value="eleve">Élèves</option>
          <option value="repetiteur">Répétiteurs</option>
        </select>
        <button
          onClick={() => setShowForm(true)}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl transition-all"
        >
          <i className="fa-solid fa-plus mr-2"></i>Créer un utilisateur
        </button>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-900">
            Utilisateurs
            <span className="ml-2 text-sm font-normal text-slate-400">({filteredUsers.length} résultats)</span>
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <i className="fa-solid fa-spinner fa-spin text-2xl mb-3"></i>
            <p className="text-sm">Chargement...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <i className="fa-solid fa-users text-3xl mb-3"></i>
            <p className="text-sm">Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {["Nom & Prénom","Email","Rôle","Région","Statut","Actions"].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900 text-sm">{u.prenom} {u.nom}</td>
                    <td className="px-4 py-3 text-sm text-slate-500">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        u.role === 'repetiteur'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {u.role === 'repetiteur' ? 'Répétiteur' : 'Élève'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">{u.region || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        u.actif ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {u.actif ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => setSelected(u)}
                        className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 font-semibold rounded-lg transition-all"
                      >
                        Voir
                      </button>
                      <button
                        onClick={() => handleToggle(u.id)}
                        className={`text-xs px-3 py-1.5 font-semibold rounded-lg transition-all ${
                          u.actif
                            ? 'bg-red-50 hover:bg-red-100 text-red-600'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                        }`}
                      >
                        {u.actif ? 'Désactiver' : 'Activer'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal détail */}
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
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { label: "Rôle",      value: selected.role },
                { label: "Région",    value: selected.region || '—' },
                { label: "Téléphone", value: selected.telephone || '—' },
                { label: "Statut",    value: selected.actif ? 'Actif' : 'Inactif' },
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-700">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleToggle(selected.id)}
                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
                  selected.actif
                    ? 'bg-red-50 hover:bg-red-100 text-red-600'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                }`}
              >
                {selected.actif ? 'Désactiver' : 'Activer'}
              </button>
              <button
                onClick={() => handleDelete(selected.id)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold rounded-xl transition-all"
              >
                <i className="fa-solid fa-trash mr-1.5"></i>Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal créer utilisateur */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowForm(false)}></div>
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 relative shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
            <h3 className="text-lg font-black text-slate-900 mb-5">Créer un utilisateur</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Prénom *</label>
                  <input value={form.prenom} onChange={e => setForm({...form, prenom: e.target.value})} required placeholder="Prénom" className="w-full p-3 border border-slate-200 rounded-xl outline-none text-sm focus:border-emerald-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Nom *</label>
                  <input value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} required placeholder="Nom" className="w-full p-3 border border-slate-200 rounded-xl outline-none text-sm focus:border-emerald-400" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Email *</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required placeholder="email@exemple.com" className="w-full p-3 border border-slate-200 rounded-xl outline-none text-sm focus:border-emerald-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Mot de passe *</label>
                <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required placeholder="minimum 6 caractères" className="w-full p-3 border border-slate-200 rounded-xl outline-none text-sm focus:border-emerald-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Téléphone</label>
                <input value={form.telephone} onChange={e => setForm({...form, telephone: e.target.value})} placeholder="77 000 00 00" className="w-full p-3 border border-slate-200 rounded-xl outline-none text-sm focus:border-emerald-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Région</label>
                <select value={form.region} onChange={e => setForm({...form, region: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl outline-none text-sm bg-white focus:border-emerald-400">
                  <option value="">Choisir une région</option>
                  {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              {form.role === 'repetiteur' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                        Matières enseignées
                      </label>
                      <input
                        value={form.matieres || ''}
                        onChange={e => setForm({...form, matieres: e.target.value})}
                        placeholder="Ex: Maths, Physique, SVT"
                        className="w-full p-3 border border-slate-200 rounded-xl outline-none text-sm focus:border-emerald-400"
                      />
                      <p className="text-xs text-slate-400 mt-1">Séparez par des virgules</p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                        Tarif horaire (FCFA)
                      </label>
                      <input
                        type="number"
                        value={form.tarif_horaire || ''}
                        onChange={e => setForm({...form, tarif_horaire: e.target.value})}
                        placeholder="Ex: 5000"
                        className="w-full p-3 border border-slate-200 rounded-xl outline-none text-sm focus:border-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                        Bio / Description
                      </label>
                      <textarea
                        value={form.bio || ''}
                        onChange={e => setForm({...form, bio: e.target.value})}
                        placeholder="Décrivez l'expérience du répétiteur..."
                        rows="3"
                        className="w-full p-3 border border-slate-200 rounded-xl outline-none text-sm focus:border-emerald-400"
                      />
                    </div>
                  </>
                )}
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Rôle *</label>
                <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl outline-none text-sm bg-white focus:border-emerald-400">
                  <option value="eleve">Élève</option>
                  <option value="repetiteur">Répétiteur</option>
                </select>
              </div>
              <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all">
                <i className="fa-solid fa-plus mr-2"></i>Créer l'utilisateur
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}