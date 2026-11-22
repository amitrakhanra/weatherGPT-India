import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, Menu, X, User, Sun, Moon, ShieldCheck, LogOut } from 'lucide-react';
import { GeocodeResult, UserProfile, SolarCycleInfo } from '../types';
import { searchGeocoding } from '../services/weatherService';

interface HeaderProps {
  onSelectLocation: (lat: number, lon: number, label: string) => void;
  onUseCurrentLocation: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  currentUser: UserProfile | null;
  solarCycle: SolarCycleInfo | null;
  t: (key: string) => string;
  isLocating: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectLocation,
  onUseCurrentLocation,
  onOpenLogin,
  onLogout,
  currentUser,
  solarCycle,
  t,
  isLocating
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<GeocodeResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      const res = await searchGeocoding(searchQuery.trim());
      setResults(res);
      setIsOpen(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (r: GeocodeResult) => {
    const label = [r.name, r.admin2, r.admin1, r.country].filter(Boolean).join(', ');
    onSelectLocation(r.latitude, r.longitude, label);
    setSearchQuery(r.name);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0b0e1f]/85 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 sm:gap-6 py-3">
          {/* Brand */}
          <a href="#" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6c8dff] to-[#5ee9c8] flex items-center justify-center text-[#0b0e1f] font-black text-sm shadow-lg shadow-[#6c8dff]/25 group-hover:scale-105 transition-transform">
              ◐
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-white leading-none">
                Weather<span className="text-[#5ee9c8]">GPT</span>
              </span>
              <span className="text-[10px] font-medium text-[#7d81a8] uppercase tracking-wider">India</span>
            </div>
          </a>

          {/* Real-time Day / Night Indicator Pill */}
          {solarCycle && (
            <div
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                solarCycle.isDay
                  ? 'bg-[#f4b942]/10 border-[#f4b942]/30 text-[#f4b942] shadow-sm shadow-[#f4b942]/10'
                  : 'bg-[#6c8dff]/15 border-[#6c8dff]/30 text-[#6c8dff] shadow-sm shadow-[#6c8dff]/15'
              }`}
              title={`${solarCycle.phaseLabel} · ${solarCycle.phaseSubtitle} · Local Time: ${solarCycle.localTimeStr}`}
            >
              {solarCycle.isDay ? (
                <Sun className="w-3.5 h-3.5 text-[#f4b942] animate-[spin_12s_linear_infinite]" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-[#6c8dff]" />
              )}
              <span className="tracking-wide">
                {solarCycle.isDay ? 'DAY' : 'NIGHT'}
              </span>
              <span className="text-[11px] opacity-75 font-mono">
                {solarCycle.localTimeStr}
              </span>
            </div>
          )}

          {/* Search Box with Autocomplete */}
          <div className="flex-1 max-w-lg relative" ref={dropdownRef}>
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3.5 text-[#7d81a8] pointer-events-none" />
              <input
                id="headerSearchInput"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => results.length > 0 && setIsOpen(true)}
                placeholder={t('searchPh')}
                className="w-full pl-10 pr-24 py-2 text-sm bg-white/[0.06] hover:bg-white/[0.08] focus:bg-white/[0.1] border border-white/15 focus:border-[#6c8dff] rounded-xl text-white placeholder-[#7d81a8] transition-all outline-none"
              />
              <div className="absolute right-1.5 flex items-center gap-1">
                <button
                  type="button"
                  onClick={onUseCurrentLocation}
                  disabled={isLocating}
                  title={t('useLocationBtn')}
                  className="p-1.5 text-xs text-[#5ee9c8] hover:bg-[#5ee9c8]/10 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                  <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (results.length > 0) handleSelect(results[0]);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold bg-[#6c8dff] hover:bg-[#5a7bed] text-white rounded-lg transition-colors"
                >
                  {t('goBtn')}
                </button>
              </div>
            </div>

            {/* Dropdown Results */}
            {isOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#161a38] border border-white/15 rounded-xl shadow-2xl overflow-hidden z-50 max-h-72 overflow-y-auto">
                {results.length === 0 ? (
                  <div className="p-3 text-xs text-[#7d81a8] text-center">No locations found</div>
                ) : (
                  results.map((r, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelect(r)}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-white/[0.06] border-b border-white/5 last:border-none flex items-center gap-2.5 transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#5ee9c8] shrink-0" />
                      <div>
                        <div className="text-xs font-medium text-white">{r.name}</div>
                        <div className="text-[11px] text-[#7d81a8]">
                          {[r.admin2, r.admin1, r.country].filter(Boolean).join(', ')}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 text-sm text-[#b7bbdb]">
            <a href="#forecast" className="hover:text-white transition-colors">{t('navForecast')}</a>
            <a href="#monsoon" className="hover:text-white transition-colors">{t('navMonsoon')}</a>
            <a href="#alerts" className="hover:text-white transition-colors">{t('navAlerts')}</a>
            <a href="#decision" className="hover:text-white transition-colors">{t('navDecision')}</a>
          </nav>

          {/* Auth & Mobile Toggle */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              /* Logged In User Pill with Dropdown */
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white/[0.06] border border-[#5ee9c8]/40 hover:bg-[#5ee9c8]/10 text-white transition-all shadow-sm"
                >
                  <div className="w-5 h-5 rounded-full bg-[#5ee9c8]/20 text-[#5ee9c8] flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </div>
                  <span className="max-w-[110px] truncate">
                    {currentUser.name || currentUser.phone}
                  </span>
                  <ShieldCheck className="w-3.5 h-3.5 text-[#5ee9c8]" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[#161a38] border border-white/20 rounded-2xl shadow-2xl p-3 z-50 text-xs animate-in fade-in duration-150">
                    <div className="pb-2.5 border-b border-white/10">
                      <div className="font-bold text-white text-sm truncate">
                        {currentUser.name || 'Verified User'}
                      </div>
                      <div className="text-[#7d81a8] font-mono mt-0.5">
                        {currentUser.phone}
                      </div>
                      <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-[#5ee9c8] bg-[#5ee9c8]/15 px-2 py-0.5 rounded-full font-semibold">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Phone OTP Verified</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onLogout();
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[#e5555a] hover:bg-[#e5555a]/15 transition-colors font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Log In / Sign In Button */
              <button
                onClick={onOpenLogin}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-white/15 hover:border-[#5ee9c8]/40 hover:bg-[#5ee9c8]/10 text-white transition-colors"
              >
                <User className="w-3.5 h-3.5 text-[#5ee9c8]" />
                <span>Log in (OTP)</span>
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/5"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-white/10 flex flex-col gap-2">
            {solarCycle && (
              <div
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border ${
                  solarCycle.isDay
                    ? 'bg-[#f4b942]/10 border-[#f4b942]/30 text-[#f4b942]'
                    : 'bg-[#6c8dff]/15 border-[#6c8dff]/30 text-[#6c8dff]'
                }`}
              >
                <div className="flex items-center gap-2">
                  {solarCycle.isDay ? (
                    <Sun className="w-4 h-4 text-[#f4b942]" />
                  ) : (
                    <Moon className="w-4 h-4 text-[#6c8dff]" />
                  )}
                  <span>{solarCycle.isDay ? 'Daytime (Sun active)' : 'Nighttime (Stars & Moon)'}</span>
                </div>
                <span className="font-mono">{solarCycle.localTimeStr}</span>
              </div>
            )}

            <a
              href="#forecast"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm text-[#b7bbdb] hover:text-white hover:bg-white/5 rounded-lg"
            >
              {t('navForecast')}
            </a>
            <a
              href="#monsoon"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm text-[#b7bbdb] hover:text-white hover:bg-white/5 rounded-lg"
            >
              {t('navMonsoon')}
            </a>
            <a
              href="#alerts"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm text-[#b7bbdb] hover:text-white hover:bg-white/5 rounded-lg"
            >
              {t('navAlerts')}
            </a>
            <a
              href="#decision"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm text-[#b7bbdb] hover:text-white hover:bg-white/5 rounded-lg"
            >
              {t('navDecision')}
            </a>

            {currentUser ? (
              <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between px-3 py-2 bg-white/[0.04] rounded-xl">
                <div>
                  <div className="text-xs font-bold text-white">{currentUser.name || 'User'}</div>
                  <div className="text-[11px] text-[#5ee9c8] font-mono">{currentUser.phone}</div>
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onLogout();
                  }}
                  className="px-3 py-1.5 text-xs text-[#e5555a] bg-[#e5555a]/10 hover:bg-[#e5555a]/20 rounded-lg font-semibold flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="mt-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold rounded-xl bg-white/10 text-white"
              >
                <User className="w-4 h-4 text-[#5ee9c8]" />
                <span>Log in with Phone OTP</span>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
