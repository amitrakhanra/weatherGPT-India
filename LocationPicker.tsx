import React, { useState, useEffect } from 'react';
import { STATES, DISTRICTS, SEED_BLOCKS, KOLKATA_NO_BLOCKS, slugify } from '../data/locations';
import { lookupPincode, searchGeocoding } from '../services/weatherService';
import { localizePlaceLabel } from '../data/i18n';
import { MapPin, Search, Loader2, Navigation } from 'lucide-react';

interface LocationPickerProps {
  onLocationSelected: (lat: number, lon: number, label: string) => void;
  onUseCurrentLocation?: () => void;
  isLocating?: boolean;
  currentLang: string;
  t: (key: string) => string;
  isLoading: boolean;
}

const QUICK_STATES = ["West Bengal", "Maharashtra", "Punjab", "Tamil Nadu", "Bihar"];

export const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelected,
  onUseCurrentLocation,
  isLocating = false,
  currentLang,
  t,
  isLoading
}) => {
  const [selectedState, setSelectedState] = useState<string>("West Bengal");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Nadia");
  const [selectedBlock, setSelectedBlock] = useState<string>("Krishnaganj");
  const [villageInput, setVillageInput] = useState<string>("");
  const [pincodeInput, setPincodeInput] = useState<string>("");

  const [districtsList, setDistrictsList] = useState<string[]>([]);
  const [blocksList, setBlocksList] = useState<string[]>([]);
  const [isPinLoading, setIsPinLoading] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  // Update district options when state changes
  useEffect(() => {
    const stateEntry = STATES.find(s => s[0] === selectedState);
    const slug = stateEntry ? stateEntry[1] : slugify(selectedState);
    const districts = DISTRICTS[slug] || [];
    setDistrictsList(districts);
    if (districts.length > 0) {
      if (!districts.includes(selectedDistrict)) {
        setSelectedDistrict(districts[0]);
      }
    } else {
      setSelectedDistrict("");
    }
  }, [selectedState]);

  // Update block options when district changes
  useEffect(() => {
    if (!selectedDistrict) {
      setBlocksList([]);
      setSelectedBlock("");
      return;
    }

    const distSlug = slugify(selectedDistrict);
    if (SEED_BLOCKS[distSlug] === KOLKATA_NO_BLOCKS) {
      setBlocksList([]);
      setSelectedBlock("");
      return;
    }

    const seeded = SEED_BLOCKS[distSlug];
    if (Array.isArray(seeded) && seeded.length > 0) {
      setBlocksList(seeded);
      if (!seeded.includes(selectedBlock)) {
        setSelectedBlock(seeded[0]);
      }
    } else {
      // Default common block names fallback
      const fallbackBlocks = [`${selectedDistrict} Rural`, `${selectedDistrict} Sadar`, `${selectedDistrict} North`, `${selectedDistrict} South`];
      setBlocksList(fallbackBlocks);
      setSelectedBlock(fallbackBlocks[0]);
    }
  }, [selectedDistrict]);

  const handlePincodeSearch = async () => {
    const pin = pincodeInput.trim();
    if (!/^\d{6}$/.test(pin)) {
      setPinError("Enter 6 digits");
      return;
    }
    setPinError(null);
    setIsPinLoading(true);

    try {
      const pinResult = await lookupPincode(pin);
      if (pinResult) {
        // Geocode using PostOffice name
        const geo = await searchGeocoding(pinResult.name);
        if (geo.length > 0) {
          onLocationSelected(geo[0].latitude, geo[0].longitude, pinResult.label);
          if (pinResult.state) {
            const st = STATES.find(s => s[0].toLowerCase() === pinResult.state.toLowerCase());
            if (st) setSelectedState(st[0]);
          }
        } else {
          // Fallback to district geocoding
          const distGeo = await searchGeocoding(pinResult.district);
          if (distGeo.length > 0) {
            onLocationSelected(distGeo[0].latitude, distGeo[0].longitude, pinResult.label);
          }
        }
      } else {
        setPinError("PIN not found");
      }
    } catch {
      setPinError("Lookup failed");
    } finally {
      setIsPinLoading(false);
    }
  };

  const handlePickerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parts = [villageInput.trim(), selectedBlock, selectedDistrict, selectedState].filter(Boolean);
    const label = parts.join(', ');
    const query = parts.join(', ') + ', India';

    const results = await searchGeocoding(parts[0] || selectedBlock || selectedDistrict || selectedState);
    if (results.length > 0) {
      onLocationSelected(results[0].latitude, results[0].longitude, label);
    } else {
      // Fallback geocode just district or state
      const fallbackResults = await searchGeocoding(`${selectedDistrict}, ${selectedState}, India`);
      if (fallbackResults.length > 0) {
        onLocationSelected(fallbackResults[0].latitude, fallbackResults[0].longitude, label);
      }
    }
  };

  return (
    <section className="bg-white/[0.02] border-b border-white/10 py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={handlePickerSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
          {/* State */}
          <div>
            <label className="block text-[11px] font-semibold text-[#7d81a8] uppercase tracking-wider mb-1.5">
              {t('stateLbl')}
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-[#161a38] text-white border border-white/15 focus:border-[#6c8dff] rounded-xl px-3 py-2 text-xs sm:text-sm outline-none transition-colors"
            >
              {STATES.map(([name]) => (
                <option key={name} value={name}>
                  {localizePlaceLabel(name, currentLang)}
                </option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-[11px] font-semibold text-[#7d81a8] uppercase tracking-wider mb-1.5">
              {t('districtLbl')}
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={districtsList.length === 0}
              className="w-full bg-[#161a38] text-white border border-white/15 focus:border-[#6c8dff] rounded-xl px-3 py-2 text-xs sm:text-sm outline-none transition-colors disabled:opacity-50"
            >
              {districtsList.map(d => (
                <option key={d} value={d}>
                  {localizePlaceLabel(d, currentLang)}
                </option>
              ))}
            </select>
          </div>

          {/* Block */}
          <div>
            <label className="block text-[11px] font-semibold text-[#7d81a8] uppercase tracking-wider mb-1.5">
              {t('blockLbl')}
            </label>
            <select
              value={selectedBlock}
              onChange={(e) => setSelectedBlock(e.target.value)}
              disabled={blocksList.length === 0}
              className="w-full bg-[#161a38] text-white border border-white/15 focus:border-[#6c8dff] rounded-xl px-3 py-2 text-xs sm:text-sm outline-none transition-colors disabled:opacity-50"
            >
              {blocksList.length === 0 ? (
                <option value="">Urban / Custom</option>
              ) : (
                blocksList.map(b => (
                  <option key={b} value={b}>
                    {localizePlaceLabel(b, currentLang)}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Village / Town input */}
          <div>
            <label className="block text-[11px] font-semibold text-[#7d81a8] uppercase tracking-wider mb-1.5">
              {t('villageLbl')}
            </label>
            <input
              type="text"
              value={villageInput}
              onChange={(e) => setVillageInput(e.target.value)}
              placeholder={t('villagePh')}
              className="w-full bg-[#161a38] text-white border border-white/15 focus:border-[#6c8dff] rounded-xl px-3 py-2 text-xs sm:text-sm outline-none transition-colors placeholder-[#7d81a8]"
            />
          </div>

          {/* PIN code input with India Post API */}
          <div>
            <label className="block text-[11px] font-semibold text-[#7d81a8] uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>{t('pincodeLbl')}</span>
              {pinError && <span className="text-[#e5555a] text-[10px] lowercase">{pinError}</span>}
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={pincodeInput}
                onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handlePincodeSearch())}
                placeholder={t('pincodePh')}
                className="w-full bg-[#161a38] text-white border border-white/15 focus:border-[#6c8dff] rounded-xl pl-3 pr-8 py-2 text-xs sm:text-sm outline-none transition-colors placeholder-[#7d81a8] tracking-wider"
              />
              <button
                type="button"
                onClick={handlePincodeSearch}
                disabled={isPinLoading || pincodeInput.length !== 6}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 text-[#5ee9c8] hover:bg-[#5ee9c8]/10 rounded-md disabled:opacity-40"
                title="Search PIN code"
              >
                {isPinLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Submit Go */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#6c8dff] to-[#4f6fe0] hover:from-[#5a7bed] hover:to-[#3e5ecd] text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-lg shadow-[#6c8dff]/25 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading…</span>
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4" />
                  <span>{t('goBtn')}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick state chips & hint */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-white/5">
          <div className="flex flex-wrap items-center gap-1.5">
            {onUseCurrentLocation && (
              <button
                type="button"
                onClick={onUseCurrentLocation}
                disabled={isLocating}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all border border-[#5ee9c8]/40 text-[#5ee9c8] bg-[#5ee9c8]/10 hover:bg-[#5ee9c8]/20 shadow-sm disabled:opacity-50 mr-1"
                title="Update to your live GPS coordinates"
              >
                <Navigation className={`w-3 h-3 text-[#5ee9c8] ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Locating…' : 'My Live Location'}</span>
              </button>
            )}
            <span className="text-[11px] text-[#7d81a8] mr-1">Popular:</span>
            {QUICK_STATES.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setSelectedState(st)}
                className={`px-2.5 py-1 rounded-full text-xs transition-all border ${
                  selectedState === st
                    ? 'border-[#5ee9c8] text-[#5ee9c8] bg-[#5ee9c8]/10'
                    : 'border-white/10 text-[#b7bbdb] hover:border-white/20 bg-white/[0.03]'
                }`}
              >
                {localizePlaceLabel(st, currentLang)}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[#7d81a8] max-w-xl">
            {t('pickerHint')}
          </p>
        </div>
      </div>
    </section>
  );
};
