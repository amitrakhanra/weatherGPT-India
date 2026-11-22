import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { ComputedAlerts, ReverseGeocodeResult } from '../types';
import { Map, Share2, MapPin, Navigation, Radio, Loader2, Compass } from 'lucide-react';
import { localizePlaceLabel } from '../data/i18n';

interface RiskMapProps {
  lat: number;
  lon: number;
  locationLabel: string;
  reverseGeoInfo?: ReverseGeocodeResult | null;
  alerts: ComputedAlerts | null;
  onMapClick: (lat: number, lon: number) => void;
  onUseCurrentLocation: () => void;
  isLocating: boolean;
  isLiveTracking?: boolean;
  onToggleLiveTracking?: () => void;
  locationAccuracy?: number | null;
  currentLang: string;
  t: (key: string) => string;
}

const createPinIcon = (color: string = '#5ee9c8') =>
  L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div style="position: relative; width: 32px; height: 32px;">
        <div style="
          width: 30px;
          height: 30px;
          background: radial-gradient(circle at 35% 35%, #ffffff, ${color});
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 16px rgba(0,0,0,0.6), 0 0 14px ${color}aa;
          border: 2px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="width: 10px; height: 10px; background: #0b0e1f; border-radius: 50%; transform: rotate(45deg);"></div>
        </div>
        <div style="
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 14px;
          height: 4px;
          background: rgba(0,0,0,0.5);
          border-radius: 50%;
          filter: blur(1px);
        "></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -32]
  });

export const RiskMap: React.FC<RiskMapProps> = ({
  lat,
  lon,
  locationLabel,
  reverseGeoInfo,
  alerts,
  onMapClick,
  onUseCurrentLocation,
  isLocating,
  isLiveTracking = false,
  onToggleLiveTracking,
  locationAccuracy,
  currentLang,
  t
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const pinMarkerRef = useRef<L.Marker | null>(null);
  const circleMarkerRef = useRef<L.CircleMarker | null>(null);
  const [isResolvingArea, setIsResolvingArea] = useState(false);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        scrollWheelZoom: false,
        zoomControl: true
      }).setView([lat, lon], 9);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18
      }).addTo(map);

      // Tap or click anywhere on the map to mark an area without search bar
      map.on('click', (e: L.LeafletMouseEvent) => {
        setIsResolvingArea(true);
        onMapClick(e.latlng.lat, e.latlng.lng);
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update view & markers when lat/lon/reverseGeoInfo/alerts change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.panTo([lat, lon], { animate: true, duration: 0.6 });

    if (pinMarkerRef.current) {
      map.removeLayer(pinMarkerRef.current);
    }
    if (circleMarkerRef.current) {
      map.removeLayer(circleMarkerRef.current);
    }

    setIsResolvingArea(false);

    const localizedLabel = localizePlaceLabel(locationLabel, currentLang);
    const pinColor = alerts?.worstColor || '#5ee9c8';

    // Draggable pinpoint marker
    const marker = L.marker([lat, lon], {
      icon: createPinIcon(pinColor),
      draggable: true
    }).addTo(map);

    marker.on('dragend', (e) => {
      const newPos = (e.target as L.Marker).getLatLng();
      setIsResolvingArea(true);
      onMapClick(newPos.lat, newPos.lng);
    });

    // Build rich popup content with actual area name, tehsil/block, state, and PIN code
    const placeName = reverseGeoInfo?.suburbOrVillage || reverseGeoInfo?.name || localizedLabel;
    const block = reverseGeoInfo?.blockOrTehsil;
    const district = reverseGeoInfo?.district;
    const state = reverseGeoInfo?.state;
    const postcode = reverseGeoInfo?.postcode;

    const hierarchyParts = [
      block && block !== placeName ? block : null,
      district && district !== placeName ? district : null,
      state
    ].filter(Boolean);

    const popupHtml = `
      <div style="min-width: 220px; font-family: Inter, sans-serif; padding: 2px;">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
          <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #5ee9c8; background: rgba(94,233,200,0.15); padding: 2px 8px; border-radius: 9999px;">
            ${isLiveTracking ? '🛰️ Live GPS' : '📍 Marked Area'}
          </span>
          ${
            postcode
              ? `<span style="font-size: 11px; font-weight: 700; color: #fbbf24; background: rgba(251,191,36,0.15); border: 1px solid rgba(251,191,36,0.3); padding: 2px 7px; border-radius: 6px; letter-spacing: 0.05em;">
                  📮 PIN: ${postcode}
                </span>`
              : ''
          }
        </div>
        <div style="font-size: 14px; font-weight: 700; color: #ffffff; line-height: 1.3; margin-bottom: 4px;">
          ${placeName}
        </div>
        ${
          hierarchyParts.length > 0
            ? `<div style="font-size: 11px; color: #b7bbdb; margin-bottom: 6px;">
                ${hierarchyParts.join(', ')}
              </div>`
            : ''
        }
        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 10px; color: #7d81a8; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 6px; margin-top: 6px;">
          <span>${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E</span>
          <span style="color: #4fce8a; font-weight: 600;">✓ Weather Loaded</span>
        </div>
      </div>
    `;

    marker.bindPopup(popupHtml).openPopup();
    pinMarkerRef.current = marker;

    // Halo circle marker representing risk envelope
    const circle = L.circleMarker([lat, lon], {
      radius: 16,
      color: pinColor,
      fillColor: pinColor,
      fillOpacity: 0.3,
      weight: 2
    }).addTo(map);
    circleMarkerRef.current = circle;
  }, [lat, lon, locationLabel, reverseGeoInfo, alerts, currentLang, isLiveTracking]);

  const handleShareWhatsapp = () => {
    const localizedLabel = localizePlaceLabel(locationLabel, currentLang);
    const pinStr = reverseGeoInfo?.postcode ? ` (PIN: ${reverseGeoInfo.postcode})` : '';
    const flagsSummary = alerts?.flags.map(f => `• ${t(f.labelKey)}: ${t(f.levelKey)} (${f.detail})`).join('\n') || '';
    const text = encodeURIComponent(
      `🌾 *WeatherGPT India — Advisory Update*\n` +
      `📍 *Location:* ${localizedLabel}${pinStr}\n` +
      `🌐 *Coordinates:* ${lat.toFixed(4)}°N, ${lon.toFixed(4)}°E\n` +
      `⚠️ *Risk Status:* ${alerts?.worstLevel.replace('level', '') || 'Normal'}\n\n` +
      `*Live Alerts:*\n${flagsSummary}\n\n` +
      `Plan smart farm operations with hyperlocal intelligence at WeatherGPT India.`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <section className="bg-white/[0.04] border border-white/10 rounded-3xl p-5 sm:p-7 backdrop-blur-xl space-y-4 shadow-xl">
      {/* Header with Title and Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Map className="w-5 h-5 text-[#5ee9c8]" />
            <h3 className="text-lg font-bold text-white font-display">
              {t('riskMapTitle')}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#6c8dff]/20 text-[#8ba6ff] border border-[#6c8dff]/30 uppercase tracking-wider">
              Tap or click to mark area
            </span>
            {isLiveTracking && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#5ee9c8]/15 text-[#5ee9c8] border border-[#5ee9c8]/30 uppercase tracking-wider animate-pulse">
                <Radio className="w-3 h-3 text-[#5ee9c8]" /> Live GPS Tracking
              </span>
            )}
          </div>
          <p className="text-xs text-[#7d81a8] mt-1">
            Click anywhere on the map to pinpoint any field, village, or area. The real village name, block, district, and postal PIN code will be automatically identified.
          </p>
        </div>

        {/* Live Location and Share Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onUseCurrentLocation}
            disabled={isLocating}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#1a2148] hover:bg-[#232c5e] text-[#5ee9c8] border border-[#5ee9c8]/30 transition-all shadow-md disabled:opacity-50"
            title="Update weather to your live GPS coordinates"
          >
            {isLocating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#5ee9c8]" />
            ) : (
              <Navigation className="w-3.5 h-3.5 text-[#5ee9c8]" />
            )}
            <span>{isLocating ? 'Locating…' : 'Update to Live Location'}</span>
          </button>

          {onToggleLiveTracking && (
            <button
              type="button"
              onClick={onToggleLiveTracking}
              className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isLiveTracking
                  ? 'bg-[#5ee9c8]/20 text-[#5ee9c8] border-[#5ee9c8]/50 shadow-sm shadow-[#5ee9c8]/20'
                  : 'bg-white/[0.04] text-[#b7bbdb] border-white/10 hover:border-white/20'
              }`}
              title="Continuous live GPS tracking mode"
            >
              <Radio className={`w-3.5 h-3.5 ${isLiveTracking ? 'text-[#5ee9c8] animate-pulse' : 'text-[#7d81a8]'}`} />
              <span className="hidden md:inline">{isLiveTracking ? 'Auto-Tracking On' : 'Auto-Track'}</span>
            </button>
          )}

          <button
            onClick={handleShareWhatsapp}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#20bd5a] text-[#08331c] transition-colors shadow-lg shadow-[#25D366]/20"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{t('shareWhatsapp')}</span>
          </button>
        </div>
      </div>

      {/* Real-time Marked Area Pill Indicator */}
      <div className="bg-[#121633]/90 border border-white/10 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#5ee9c8]/15 border border-[#5ee9c8]/30 flex items-center justify-center text-[#5ee9c8] shrink-0">
            {isResolvingArea ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-white">
                {isResolvingArea
                  ? 'Identifying village, block & pincode…'
                  : reverseGeoInfo?.suburbOrVillage || reverseGeoInfo?.name || locationLabel}
              </span>
              {reverseGeoInfo?.postcode && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-[#fbbf24]/15 text-[#fbbf24] border border-[#fbbf24]/30">
                  📮 PIN: {reverseGeoInfo.postcode}
                </span>
              )}
              {locationAccuracy != null && (
                <span className="text-[11px] text-[#5ee9c8] font-medium">
                  (GPS ±{locationAccuracy}m)
                </span>
              )}
            </div>
            <div className="text-[11px] text-[#7d81a8] flex items-center gap-2 flex-wrap">
              {reverseGeoInfo?.formattedAddress && reverseGeoInfo.formattedAddress !== reverseGeoInfo.name ? (
                <span>{reverseGeoInfo.formattedAddress}</span>
              ) : (
                <span>{[reverseGeoInfo?.district, reverseGeoInfo?.state, reverseGeoInfo?.country].filter(Boolean).join(', ')}</span>
              )}
              <span>•</span>
              <span className="font-mono text-[#8ba6ff]">
                {lat.toFixed(4)}°N, {lon.toFixed(4)}°E
              </span>
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] text-[#7d81a8] uppercase tracking-wider font-semibold">
            Marking Method
          </div>
          <div className="text-xs text-[#5ee9c8] font-medium flex items-center gap-1 justify-end">
            <Compass className="w-3.5 h-3.5" />
            <span>Tap anywhere or drag pin</span>
          </div>
        </div>
      </div>

      {/* Map Container with Floating Live GPS Button */}
      <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-white/15 z-10">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Quick Live Location button directly on map */}
        <div className="absolute top-3 right-3 z-[1000] flex flex-col gap-2">
          <button
            type="button"
            onClick={onUseCurrentLocation}
            disabled={isLocating}
            className="p-2.5 rounded-xl bg-[#161a38]/90 hover:bg-[#1f254f] text-[#5ee9c8] border border-white/20 shadow-xl backdrop-blur-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-2 text-xs font-semibold"
            title="Jump to my live GPS location"
          >
            <Navigation className={`w-4 h-4 text-[#5ee9c8] ${isLocating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">My Live Location</span>
          </button>
        </div>

        {/* Loading overlay while resolving clicked coordinates */}
        {isResolvingArea && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-[#121633]/95 border border-[#5ee9c8]/40 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-2xl backdrop-blur-md flex items-center gap-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#5ee9c8]" />
            <span>Resolving area name &amp; PIN code…</span>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-[#b7bbdb] pt-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4fce8a]" />
          <span>{t('riskLow')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f4b942]" />
          <span>{t('riskModerate')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#e5555a]" />
          <span>{t('riskElevated')}</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto text-[#7d81a8]">
          <MapPin className="w-3.5 h-3.5 text-[#5ee9c8]" />
          <span>Active Pinpoint: Drag marker or tap any point</span>
        </div>
      </div>
    </section>
  );
};
