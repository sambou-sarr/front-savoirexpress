import { useState } from "react";

export default function Nav({ currentUser, onLogout, onOpenLogin, onOpenRegister, onChangeRole }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-45 border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <a href="#" className="flex items-center gap-3">
            <div className="bg-emerald-600 text-white p-2.5 rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center">
              <i className="fa-solid fa-graduation-cap text-2xl"></i>
            </div>
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">
              Savoir<span className="text-yellow-500">Express</span>
            </span>
          </a>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-emerald-700 font-semibold px-1 py-2 border-b-2 border-emerald-600">Accueil</a>
            <a href="#courses-section" className="text-slate-600 hover:text-emerald-600 font-medium px-1 py-2 transition-colors">Nos Cours</a>
            <a href="#features-section" className="text-slate-600 hover:text-emerald-600 font-medium px-1 py-2 transition-colors">Pourquoi nous ?</a>
            <a href="#how-it-works" className="text-slate-600 hover:text-emerald-600 font-medium px-1 py-2 transition-colors">Méthode</a>
            <a href="#repetiteurs-section" className="text-slate-600 hover:text-emerald-600 font-semibold px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl transition-all">
              <i className="fa-solid fa-user-tie mr-1.5"></i>Répétiteurs
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <div className="flex items-center gap-4">
                <div className="bg-slate-100 p-1 rounded-xl flex gap-1 text-xs font-semibold">
                  <button
                    onClick={() => onChangeRole('eleve')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${currentUser.role === 'eleve' ? 'bg-white shadow text-emerald-700' : 'text-slate-500'}`}
                  >
                    Élève
                  </button>
                  <button
                    onClick={() => onChangeRole('repetiteur')}
                    className={`px-3 py-1.5 rounded-lg transition-all ${currentUser.role === 'repetiteur' ? 'bg-white shadow text-emerald-700' : 'text-slate-500'}`}
                  >
                    Répétiteur
                  </button>
                </div>

                <div className="flex items-center gap-3 bg-slate-50 pl-3 pr-4 py-1.5 rounded-full border border-slate-100">
                  <img src={currentUser.photo_url} className="w-8 h-8 rounded-full object-cover" alt="Avatar" />
                  <div>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{currentUser.role}</p>
                    <p className="text-xs font-bold text-slate-800">{currentUser.prenom} {currentUser.nom}</p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  title="Se déconnecter"
                >
                  <i className="fa-solid fa-right-from-bracket text-lg"></i>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={onOpenLogin}
                  className="px-5 py-2.5 text-slate-700 hover:text-emerald-600 font-bold transition-all border border-slate-200 hover:border-emerald-200 rounded-xl"
                >
                  Se connecter
                </button>
                <button
                  onClick={onOpenRegister}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl transition-all shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:-translate-y-0.5"
                >
                  S'inscrire
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="flex md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600 p-2 rounded-lg">
              <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-2xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-6 space-y-3 shadow-inner">
          <a href="#" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-600 font-medium hover:bg-slate-50">Accueil</a>
          <a href="#courses-section" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-600 font-medium hover:bg-slate-50">Nos Cours</a>
          <a href="#features-section" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-600 font-medium hover:bg-slate-50">Pourquoi nous ?</a>
          <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-slate-600 font-medium hover:bg-slate-50">Méthode</a>
          <a href="#repetiteurs-section" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-emerald-700 bg-emerald-50 font-bold">Nos Répétiteurs</a>
          <hr className="border-slate-100 my-2" />
          {currentUser ? (
            <div className="space-y-3 px-3">
              <div className="flex items-center gap-3">
                <img src={currentUser.photo_url} className="w-10 h-10 rounded-full object-cover" alt="Avatar" />
                <div>
                  <p className="text-sm font-bold text-slate-800">{currentUser.prenom} {currentUser.nom}</p>
                  <p className="text-xs text-slate-400 capitalize">Rôle : {currentUser.role}</p>
                </div>
              </div>
              <button onClick={() => { onLogout(); setMobileMenuOpen(false); }} className="w-full px-4 py-2.5 text-center text-red-600 font-semibold bg-red-50 rounded-xl">
                Se déconnecter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button onClick={() => { onOpenLogin(); setMobileMenuOpen(false); }} className="w-full px-4 py-2.5 text-center text-slate-700 font-bold border border-slate-200 rounded-xl">
                Se connecter
              </button>
              <button onClick={() => { onOpenRegister(); setMobileMenuOpen(false); }} className="w-full px-4 py-2.5 text-center bg-emerald-600 text-white font-bold rounded-xl">
                S'inscrire
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
