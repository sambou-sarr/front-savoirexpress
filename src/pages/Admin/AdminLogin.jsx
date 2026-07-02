import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "admin@savoirexpress.sn" && password === "admin123") {
      onLogin({ email, role: "admin", nom: "Administrateur" });
      navigate("/admin/dashboard"); // ← redirige après connexion
    } else {
      setError("Email ou mot de passe incorrect.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-100 w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="bg-emerald-600 text-white p-2 rounded-xl">
              <i className="fa-solid fa-graduation-cap text-xl"></i>
            </div>
            <span className="text-xl font-bold text-slate-900">
              Savoir<span className="text-yellow-500">Express</span>
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">Espace Admin</h1>
          <p className="text-slate-500 text-sm mt-1">Connectez-vous pour gérer la plateforme</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
            <i className="fa-solid fa-circle-exclamation mr-2"></i>{error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
            <input
              type="email" required
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@savoirexpress.sn"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Mot de passe</label>
            <input
              type="password" required
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm focus:border-emerald-500"
            />
          </div>
          <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all mt-2">
            <i className="fa-solid fa-right-to-bracket mr-2"></i>Se connecter
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 mt-6">
          Accès réservé aux administrateurs de SavoirExpress
        </p>
      </div>
    </div>
  );
}