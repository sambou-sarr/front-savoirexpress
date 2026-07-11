import { useState, useEffect } from "react";

export default function RepetiteursManager() {
  const [repetiteurs, setRepetiteurs] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [selected, setSelected]       = useState(null);
  const [editForm, setEditForm]       = useState(null);
  const [searchTerm, setSearchTerm]   = useState('');
  const [filterRegion, setFilterRegion] = useState('');

  const regions = ["Dakar","Thiès","Saint-Louis","Diourbel","Kaolack",
    "Fatick","Kaffrine","Tambacounda","Kédougou","Kolda","Sédhiou",
    "Ziguinchor","Matam","Louga"];

  const chargerRepetiteurs = () => {
    setLoading(true);
    fetch('http://localhost:8000/api/users?role=repetiteur')
      .then(res => res.json())
      .then(data => {
        const reps = data.filter(u => u.role === 'repetiteur');
        setRepetiteurs(reps);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => { chargerRepetiteurs(); }, []);

  const handleToggle = async (id) => {
    await fetch(`http://localhost:8000/api/users/${id}/toggle`, { method: 'PUT' });
    chargerRepetiteurs();
    setSelected(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce répétiteur ?')) return;
    await fetch(`http://localhost:8000/api/users/${id}`, { method: 'DELETE' });
    chargerRepetiteurs();
    setSelected(null);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    await fetch(`http://localhost:8000/api/users/${editForm.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    chargerRepetiteurs();
    setEditForm(null);
    setSelected(null);
  };

  const anciennete = (date) => {
    const diff = new Date() - new Date(date);
    const mois = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
    if (mois < 1)  return "Nouveau";
    if (mois < 12) return `${mois} mois`;
    return `${Math.floor(mois / 12)} an(s)`;
  };

  const filtered = repetiteurs.filter(r => {
    const matchSearch = searchTerm === '' ||
      `${r.prenom} ${r.nom} ${r.email} ${r.matieres || ''}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRegion = filterRegion === '' || r.region === filterRegion;
    return matchSearch && matchRegion;
  });

  const stats = {
    total:   repetiteurs.length,
    actifs:  repetiteurs.filter(r => r.actif).length,
    inactifs: repetiteurs.filter(r => !r.actif).length,
  };

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total répétiteurs", value: stats.total,    color: "blue",    icon: "fa-chalkboard-user" },
          { label: "Actifs",            value: stats.actifs,   color: "emerald", icon: "fa-circle-check" },
          { label: "Inactifs",          value: stats.inactifs, color: "red",     icon: "fa-circle-xmark" },
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

      {/* Filtres */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-3 text-slate-400 text-sm"></i>
          <input
            type="text"
            placeholder="Rechercher par nom, matière, email..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm focus:border-emerald-400"
          />
        </div>
        <select
          value={filterRegion}
          onChange={e => setFilterRegion(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm bg-white focus:border-emerald-400"
        >
          <option value="">Toutes les régions</option>
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-900">
            Répétiteurs
            <span className="ml-2 text-sm font-normal text-slate-400">({filtered.length} résultats)</span>
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <i className="fa-solid fa-spinner fa-spin text-2xl mb-3"></i>
            <p className="text-sm">Chargement...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <i className="fa-solid fa-chalkboard-user text-3xl mb-3"></i>
            <p className="text-sm">Aucun répétiteur trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {["Répétiteur","Matières","Région","Tarif/h","Ancienneté","Statut","Actions"].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {r.photo_url ? (
                          <img src={r.photo_url} className="w-8 h-8 rounded-full object-cover" alt="" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                            {r.prenom?.[0]}{r.nom?.[0]}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{r.prenom} {r.nom}</p>
                          <p className="text-xs text-slate-400">{r.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {r.matieres ? (
                        <div className="flex flex-wrap gap-1">
                          {r.matieres.split(',').map((m, i) => (
                            <span key={i} className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                              {m.trim()}
                            </span>
                          ))}
                        </div>
                      ) : <span className="text-slate-400 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-500">{r.region || '—'}</td>
                    <td className="px-4 py-3 text-sm font-bold text-emerald-700">
                      {r.tarif_horaire ? `${r.tarif_horaire.toLocaleString()} FCFA` : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-400">{anciennete(r.created_at)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        r.actif ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {r.actif ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => setSelected(r)}
                        className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 font-semibold rounded-lg transition-all"
                      >
                        Voir
                      </button>
                      <button
                        onClick={() => setEditForm({...r})}
                        className="text-xs px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold rounded-lg transition-all"
                      >
                        Modifier
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
      {selected && !editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelected(null)}></div>
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 relative shadow-2xl z-10">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <div className="flex items-center gap-4 mb-5">
              {selected.photo_url ? (
                <img src={selected.photo_url} className="w-16 h-16 rounded-2xl object-cover" alt="" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-black">
                  {selected.prenom?.[0]}{selected.nom?.[0]}
                </div>
              )}
              <div>
                <h3 className="text-lg font-black text-slate-900">{selected.prenom} {selected.nom}</h3>
                <p className="text-sm text-slate-400">{selected.email}</p>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full mt-1 inline-block ${
                  selected.actif ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                }`}>
                  {selected.actif ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: "Région",      value: selected.region || '—' },
                { label: "Téléphone",   value: selected.telephone || '—' },
                { label: "Tarif/heure", value: selected.tarif_horaire ? `${selected.tarif_horaire} FCFA` : '—' },
                { label: "Ancienneté",  value: anciennete(selected.created_at) },
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-1">{item.label}</p>
                  <p className="text-sm font-semibold text-slate-700">{item.value}</p>
                </div>
              ))}
            </div>

            {selected.matieres && (
              <div className="bg-slate-50 rounded-xl p-3 mb-4">
                <p className="text-xs text-slate-400 mb-2">Matières</p>
                <div className="flex flex-wrap gap-1">
                  {selected.matieres.split(',').map((m, i) => (
                    <span key={i} className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-lg">
                      {m.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selected.bio && (
              <div className="bg-slate-50 rounded-xl p-3 mb-5">
                <p className="text-xs text-slate-400 mb-1">Bio</p>
                <p className="text-sm text-slate-700 leading-relaxed">{selected.bio}</p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setEditForm({...selected})}
                className="flex-1 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 text-sm font-bold rounded-xl transition-all"
              >
                <i className="fa-solid fa-pen mr-1.5"></i>Modifier
              </button>
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
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold rounded-xl transition-all"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal modifier */}
      {editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditForm(null)}></div>
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 relative shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setEditForm(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
            <h3 className="text-lg font-black text-slate-900 mb-5">
              Modifier — {editForm.prenom} {editForm.nom}
            </h3>
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Prénom</label>
                  <input
                    value={editForm.prenom}
                    onChange={e => setEditForm({...editForm, prenom: e.target.value})}
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none text-sm focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Nom</label>
                  <input
                    value={editForm.nom}
                    onChange={e => setEditForm({...editForm, nom: e.target.value})}
                    className="w-full p-3 border border-slate-200 rounded-xl outline-none text-sm focus:border-emerald-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Téléphone</label>
                <input
                  value={editForm.telephone || ''}
                  onChange={e => setEditForm({...editForm, telephone: e.target.value})}
                  placeholder="77 000 00 00"
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none text-sm focus:border-emerald-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Région</label>
                <select
                  value={editForm.region || ''}
                  onChange={e => setEditForm({...editForm, region: e.target.value})}
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none text-sm bg-white focus:border-emerald-400"
                >
                  <option value="">Choisir une région</option>
                  {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                  Matières <span className="text-slate-400 font-normal">(séparées par des virgules)</span>
                </label>
                <input
                  value={editForm.matieres || ''}
                  onChange={e => setEditForm({...editForm, matieres: e.target.value})}
                  placeholder="Ex: Maths, Physique, SVT"
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none text-sm focus:border-emerald-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Tarif horaire (FCFA)</label>
                <input
                  type="number"
                  value={editForm.tarif_horaire || ''}
                  onChange={e => setEditForm({...editForm, tarif_horaire: e.target.value})}
                  placeholder="Ex: 5000"
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none text-sm focus:border-emerald-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Bio / Description</label>
                <textarea
                  value={editForm.bio || ''}
                  onChange={e => setEditForm({...editForm, bio: e.target.value})}
                  rows="3"
                  placeholder="Décrivez l'expérience du répétiteur..."
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none text-sm focus:border-emerald-400"
                />
              </div>
              <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all">
                <i className="fa-solid fa-check mr-2"></i>Enregistrer les modifications
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}