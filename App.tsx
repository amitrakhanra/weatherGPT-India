import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  OpenMeteoWeatherResponse,
  AirQualityData,
  MonsoonResult,
  ComputedAlerts,
  UserProfile,
  SolarCycleInfo,
  ReverseGeocodeResult
} from './types';
import {
  fetchWeatherForecast,
  fetchAirQuality,
  computeMonsoonClimatology,
  computeAlerts,
  computeSolarCycle,
  reverseGeocode
} from './services/weatherService';
import { I18N, LANGS, LanguageOption, localizePlaceLabel } from './data/i18n';

import { Header } from './components/Header';
import { AlertBanner } from './components/AlertBanner';
import { LocationPicker } from './components/LocationPicker';
import { RiskMap } from './components/RiskMap';
import { CurrentWeather } from './components/CurrentWeather';
import { Forecast7Day } from './components/Forecast7Day';
import { DetailsGrid } from './components/DetailsGrid';
import { DecisionEngine } from './components/DecisionEngine';
import { MonsoonSection } from './components/MonsoonSection';
import { SignalsSection } from './components/SignalsSection';
import { PhaseHero } from './components/PhaseHero';
import { AlertsSection } from './components/AlertsSection';
import { BacktestSection } from './components/BacktestSection';
import { HybridAndDisease } from './components/HybridAndDisease';
import { LanguageSelector } from './components/LanguageSelector';
import { MeghChat } from './components/MeghChat';
import { LoginModal } from './components/LoginModal';

export default function App() {
  const [coords, setCoords] = useState<{ lat: number; lon: number }>({
    lat: 23.4667,
    lon: 88.7667
  });
  const [locationLabel, setLocationLabel] = useState<string>("Krishnaganj, Nadia, West Bengal - 741506");
  const [reverseGeoInfo, setReverseGeoInfo] = useState<ReverseGeocodeResult | null>(null);
  const [currentLang, setCurrentLang] = useState<string>("en");
  const [voiceLang, setVoiceLang] = useState<string>("en-US");

  const [weather, setWeather] = useState<OpenMeteoWeatherResponse | null>(null);
  const [airQuality, setAirQuality] = useState<AirQualityData | null>(null);
  const [monsoonResult, setMonsoonResult] = useState<MonsoonResult | null>(null);
  const [alerts, setAlerts] = useState<ComputedAlerts | null>(null);

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('weathergpt_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [solarCycle, setSolarCycle] = useState<SolarCycleInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isLiveTracking, setIsLiveTracking] = useState<boolean>(false);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);

  const watchIdRef = useRef<number | null>(null);
  const lastLiveCoordsRef = useRef<{ lat: number; lon: number } | null>(null);

  // Keep solar cycle state fresh in real-time
  useEffect(() => {
    const updateCycle = () => {
      if (weather) {
        setSolarCycle(computeSolarCycle(weather));
      }
    };
    updateCycle();
    const timer = setInterval(updateCycle, 30000);
    return () => clearInterval(timer);
  }, [weather]);

  const handleLogout = () => {
    localStorage.removeItem('weathergpt_user');
    setCurrentUser(null);
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
  };

  // Translation helper with English fallback
  const t = useCallback((key: string): string => {
    const dict = I18N[currentLang] || I18N.en;
    return dict[key] || I18N.en[key] || '';
  }, [currentLang]);

  // Load weather and analytical models for a location
  const loadWeatherData = useCallback(
    async (
      lat: number,
      lon: number,
      label?: string,
      providedGeo?: ReverseGeocodeResult | null
    ) => {
      setIsLoading(true);
      if (label) setLocationLabel(label);
      setCoords({ lat, lon });

      // If pre-resolved reverse geocoding result provided, assign it directly
      if (providedGeo) {
        setReverseGeoInfo(providedGeo);
      } else {
        // Otherwise reverse-geocode this point asynchronously to guarantee real area name and pincode
        reverseGeocode(lat, lon)
          .then((geo) => {
            setReverseGeoInfo(geo);
            if (!label || label.startsWith('Marked') || label.startsWith('Point') || label.startsWith('Current')) {
              setLocationLabel(geo.formattedAddress);
            }
          })
          .catch((err) => console.warn('Background reverse geocode error:', err));
      }

      try {
        const weatherData = await fetchWeatherForecast(lat, lon);
        setWeather(weatherData);

        const computedAlerts = computeAlerts(weatherData);
        setAlerts(computedAlerts);

        // Async fetch Air Quality
        fetchAirQuality(lat, lon)
          .then((aq) => setAirQuality(aq))
          .catch(() => setAirQuality(null));

        // Async calculate local monsoon climatology and leave-one-out backtest
        computeMonsoonClimatology(lat, lon)
          .then((ms) => setMonsoonResult(ms))
          .catch(() => setMonsoonResult(null));
      } catch (err) {
        console.error('Failed to fetch weather:', err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Initial load
  useEffect(() => {
    reverseGeocode(23.4667, 88.7667)
      .then((geo) => {
        loadWeatherData(23.4667, 88.7667, geo.formattedAddress, geo);
      })
      .catch(() => {
        loadWeatherData(23.4667, 88.7667, 'Krishnaganj, Nadia, West Bengal - 741506');
      });
  }, [loadWeatherData]);

  // Use browser geolocation with real area name and PIN code reverse lookup
  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setLocationAccuracy(accuracy ? Math.round(accuracy) : null);
        lastLiveCoordsRef.current = { lat: latitude, lon: longitude };

        try {
          const geo = await reverseGeocode(latitude, longitude);
          setReverseGeoInfo(geo);
          await loadWeatherData(latitude, longitude, geo.formattedAddress, geo);
        } catch {
          const autoLabel = `Live GPS (${latitude.toFixed(3)}°, ${longitude.toFixed(3)}°)`;
          await loadWeatherData(latitude, longitude, autoLabel);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.warn('Geolocation denied or failed:', error.message);
        setIsLocating(false);
      },
      { timeout: 12000, enableHighAccuracy: true }
    );
  }, [loadWeatherData]);

  // Continuous Live GPS Auto-Tracking toggle
  const handleToggleLiveTracking = useCallback(() => {
    if (isLiveTracking) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setIsLiveTracking(false);
      setLocationAccuracy(null);
    } else {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        return;
      }
      setIsLiveTracking(true);
      handleUseCurrentLocation();

      watchIdRef.current = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setLocationAccuracy(accuracy ? Math.round(accuracy) : null);

          const prev = lastLiveCoordsRef.current;
          const hasMoved =
            !prev ||
            Math.abs(prev.lat - latitude) > 0.002 ||
            Math.abs(prev.lon - longitude) > 0.002;

          if (hasMoved) {
            lastLiveCoordsRef.current = { lat: latitude, lon: longitude };
            try {
              const geo = await reverseGeocode(latitude, longitude);
              setReverseGeoInfo(geo);
              await loadWeatherData(latitude, longitude, geo.formattedAddress, geo);
            } catch {
              await loadWeatherData(
                latitude,
                longitude,
                `Live GPS (${latitude.toFixed(3)}°, ${longitude.toFixed(3)}°)`
              );
            }
          }
        },
        (error) => {
          console.warn('WatchPosition error:', error.message);
          setIsLiveTracking(false);
        },
        { enableHighAccuracy: true, maximumAge: 15000, timeout: 20000 }
      );
    }
  }, [isLiveTracking, handleUseCurrentLocation, loadWeatherData]);

  // Clean up geolocation watch on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Handle map click: marks an area on their own without search bar and automatically resolves real area name & PIN code!
  const handleMapClick = async (lat: number, lon: number) => {
    try {
      const geo = await reverseGeocode(lat, lon);
      setReverseGeoInfo(geo);
      await loadWeatherData(lat, lon, geo.formattedAddress, geo);
    } catch {
      await loadWeatherData(lat, lon, `Marked Area (${lat.toFixed(3)}°, ${lon.toFixed(3)}°)`);
    }
  };

  // Text-to-speech for agricultural farmer advisory
  const handleSpeakAdvisory = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceLang || 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  const handleSelectLanguage = (lang: LanguageOption) => {
    setCurrentLang(lang.code);
    setVoiceLang(lang.voiceCode);
    document.documentElement.setAttribute('lang', lang.code === 'ur' ? 'ur' : lang.code);
    document.body.style.direction = lang.code === 'ur' ? 'rtl' : 'ltr';
  };

  const isDay = solarCycle?.isDay ?? true;

  return (
    <div
      className={`min-h-screen flex flex-col selection:bg-[#6c8dff]/30 selection:text-white transition-colors duration-700 ${
        isDay
          ? 'bg-[#080e22] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))]'
          : 'bg-[#040612] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))]'
      }`}
    >
      {/* Navigation Header */}
      <Header
        onSelectLocation={(lat, lon, label) => loadWeatherData(lat, lon, label)}
        onUseCurrentLocation={handleUseCurrentLocation}
        onOpenLogin={() => setLoginModalOpen(true)}
        onLogout={handleLogout}
        currentUser={currentUser}
        solarCycle={solarCycle}
        t={t}
        isLocating={isLocating}
      />

      {/* Critical Active Alert Banner */}
      <AlertBanner alerts={alerts} t={t} />

      {/* Hero Subtitle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
          {t('heroHeadline')}
        </h1>
        <p className="text-xs sm:text-sm text-[#b7bbdb] mt-1 max-w-2xl leading-relaxed">
          {t('heroSub')}
        </p>
      </div>

      {/* Location Picker Bar */}
      <LocationPicker
        onLocationSelected={(lat, lon, label) => loadWeatherData(lat, lon, label)}
        onUseCurrentLocation={handleUseCurrentLocation}
        isLocating={isLocating}
        currentLang={currentLang}
        t={t}
        isLoading={isLoading}
      />

      {/* Main Content Sections */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 w-full">
        {/* Interactive Block-level Risk Map */}
        <RiskMap
          lat={coords.lat}
          lon={coords.lon}
          locationLabel={locationLabel}
          reverseGeoInfo={reverseGeoInfo}
          alerts={alerts}
          onMapClick={handleMapClick}
          onUseCurrentLocation={handleUseCurrentLocation}
          isLocating={isLocating}
          isLiveTracking={isLiveTracking}
          onToggleLiveTracking={handleToggleLiveTracking}
          locationAccuracy={locationAccuracy}
          currentLang={currentLang}
          t={t}
        />

        {/* Current Live Weather Hero with Hourly Forecast & Real-time Day/Night */}
        <CurrentWeather
          weather={weather}
          solarCycle={solarCycle}
          locationLabel={locationLabel}
          reverseGeoInfo={reverseGeoInfo}
          currentLang={currentLang}
          t={t}
          isLoading={isLoading}
        />

        {/* 7-Day Forecast */}
        <Forecast7Day
          weather={weather}
          currentLang={currentLang}
          t={t}
        />

        {/* Today's Telemetry Details */}
        <DetailsGrid
          weather={weather}
          airQuality={airQuality}
          currentLang={currentLang}
          t={t}
        />

        {/* Multilingual Selector */}
        <LanguageSelector
          currentLang={currentLang}
          onSelectLanguage={handleSelectLanguage}
          t={t}
        />

        {/* Farmer Decision Engine */}
        <DecisionEngine
          monsoonResult={monsoonResult}
          currentLang={currentLang}
          t={t}
          onSpeakAdvisory={handleSpeakAdvisory}
        />

        {/* Monsoon Onset & Break Estimate */}
        <MonsoonSection
          monsoonResult={monsoonResult}
          currentLang={currentLang}
          t={t}
        />

        {/* Explainable Scientific Signals */}
        <SignalsSection
          monsoonResult={monsoonResult}
          weather={weather}
          currentLang={currentLang}
          t={t}
        />

        {/* Current Location Phase Card */}
        <PhaseHero
          monsoonResult={monsoonResult}
          locationLabel={locationLabel}
          currentLang={currentLang}
          t={t}
        />

        {/* Live Risk Alerts Flag List */}
        <AlertsSection
          alerts={alerts}
          t={t}
        />

        {/* Historical Backtest & Cross-Validation */}
        <BacktestSection
          monsoonResult={monsoonResult}
          currentLang={currentLang}
          t={t}
        />

        {/* Hybrid Drivers (ENSO/IOD) & Vector Disease Index */}
        <HybridAndDisease
          weather={weather}
          currentLang={currentLang}
          t={t}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0b0e1f]/60 backdrop-blur-md py-8 text-center text-xs text-[#7d81a8]">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-medium text-white/80">
            WeatherGPT India — Hyperlocal Weather Intelligence &amp; Agrarian Advisory (SIH 2026 - PS 26086)
          </p>
          <p>
            Meteorological data via <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="text-[#5ee9c8] hover:underline">Open-Meteo</a> · Geographic directories via <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="text-[#5ee9c8] hover:underline">OpenStreetMap</a> &amp; India Post
          </p>
        </div>
      </footer>

      {/* Floating AI Voice & Text Assistant Megh */}
      <MeghChat
        weather={weather}
        monsoonResult={monsoonResult}
        locationLabel={localizePlaceLabel(locationLabel, currentLang)}
        currentLang={currentLang}
        voiceLang={voiceLang}
        t={t}
      />

      {/* Login / Bookmarks Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        t={t}
      />
    </div>
  );
}
