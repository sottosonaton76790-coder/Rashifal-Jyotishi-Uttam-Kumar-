import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  Clock,
  Compass,
  Moon,
  Sparkles,
  Sun,
} from 'lucide-react';
import logoImg from '../assets/jyotishi-logo.png';
import {
  BUSINESS_INFO,
  getDailyPanchang,
  getDailyRashifal,
  type KaalWindow,
} from '../data/astrologyData';

interface HomeViewProps {
  onBookNow: (serviceId?: string) => void;
}

function getStatusBadgeText(status: KaalWindow['status']) {
  if (status === 'Active Now') {
    return 'Active Now';
  }
  if (status === 'Upcoming') {
    return 'Upcoming Today';
  }
  return 'Completed Today';
}

export default function HomeView({ onBookNow }: HomeViewProps) {
  const now = useMemo(() => new Date(), []);
  const panchang = useMemo(() => getDailyPanchang(now), [now]);
  const rashifalList = useMemo(() => getDailyRashifal(now), [now]);
  const [selectedRashiId, setSelectedRashiId] = useState<string>(rashifalList[0].id);
  const [logoFailed, setLogoFailed] = useState(false);

  const selectedRashi = useMemo(
    () => rashifalList.find((r) => r.id === selectedRashiId) ?? rashifalList[0],
    [rashifalList, selectedRashiId]
  );

  return (
    <div className="space-y-10 pb-24 md:pb-14">
      {/* Hero & Today's Rahu Kaal Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 bg-white border border-[#E5DCCB] rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              {!logoFailed ? (
                <img
                  src={logoImg}
                  alt="Rashifal Jyotishi Uttam Kumar Emblem"
                  referrerPolicy="no-referrer"
                  onError={() => setLogoFailed(true)}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-[#D8C39A] shrink-0"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#9E2A2B] text-[#FAF7F2] flex items-center justify-center shrink-0">
                  <Sun className="w-8 h-8" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-medium text-[#7A5C2E] flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span>{panchang.dateFormatted}</span>
                  <span aria-hidden="true">·</span>
                  <span>Vikram Samvat {panchang.vikramSamvat}</span>
                </p>
                <h1 className="text-2xl sm:text-4xl font-bold text-[#1C1510] tracking-tight mt-1 text-balance">
                  {BUSINESS_INFO.name}
                </h1>
              </div>
            </div>

            <p className="text-base text-[#4B3D30] leading-relaxed max-w-2xl">
              Authentic Vedic Rashifal, daily Panchang, and live Rahu Kaal timings for auspicious
              planning. Schedule a personal consultation for Janam Kundli, Kundli Milan, career
              muhurat, or Vastu remedies.
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-[#EFE8DA] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-[#5E4E3E] flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-medium text-[#1C1510]">
                {panchang.hinduMasa} Masa
              </span>
              <span aria-hidden="true">·</span>
              <span>{panchang.paksha}</span>
              <span aria-hidden="true">·</span>
              <span>{panchang.tithi} Tithi</span>
            </div>

            <button
              type="button"
              onClick={() => onBookNow()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-xl bg-[#9E2A2B] text-white text-sm font-semibold hover:bg-[#822021] active:scale-[0.99] transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Book Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Today's Rahu Kaal & Auspicious Muhurat Panel */}
        <div className="lg:col-span-5 bg-white border border-[#E5DCCB] rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[#9E2A2B]">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <h2 className="text-xl font-bold text-[#1C1510]">Today&apos;s Rahu Kaal</h2>
              </div>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-md whitespace-nowrap ${
                  panchang.rahuKaal.status === 'Active Now'
                    ? 'bg-[#9E2A2B] text-white'
                    : panchang.rahuKaal.status === 'Upcoming'
                      ? 'bg-[#FDF3E3] text-[#8B5A13] border border-[#E8D0A3]'
                      : 'bg-[#F3EFE7] text-[#5E4E3E]'
                }`}
              >
                {getStatusBadgeText(panchang.rahuKaal.status)}
              </span>
            </div>

            <div className="mt-4 py-4 px-5 rounded-xl bg-[#FAF5EC] border border-[#E8DBC2]">
              <p className="text-xs font-medium text-[#6B5A48]">{panchang.vara}</p>
              <p className="text-2xl sm:text-3xl font-mono font-semibold text-[#9E2A2B] tabular-nums mt-1">
                {panchang.rahuKaal.timeRange}
              </p>
              <p className="text-xs text-[#5E4E3E] mt-2 leading-relaxed">
                Avoid initiating new journeys, auspicious ceremonies, or financial contracts during
                this inauspicious window.
              </p>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-[#EFE8DA] grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-[#6B5A48] flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-[#B57B1B]" />
                <span>Abhijit Muhurat</span>
              </p>
              <p className="text-sm font-mono font-semibold text-[#1C1510] tabular-nums mt-1">
                {panchang.abhijitMuhurat.timeRange}
              </p>
              <p className="text-xs text-[#2F6B43] font-medium mt-0.5">
                Auspicious for new starts
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-[#6B5A48] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#7A5C2E]" />
                <span>Gulika Kaal</span>
              </p>
              <p className="text-sm font-mono font-semibold text-[#1C1510] tabular-nums mt-1">
                {panchang.gulikaKaal.timeRange}
              </p>
              <p className="text-xs text-[#5E4E3E] mt-0.5">
                {getStatusBadgeText(panchang.gulikaKaal.status)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Panchang Section */}
      <section className="bg-white border border-[#E5DCCB] rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-5 border-b border-[#EFE8DA]">
          <div>
            <p className="text-xs font-medium text-[#7A5C2E] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Vedic Almanac · Live Calculation</span>
            </p>
            <h2 className="text-2xl font-bold text-[#1C1510] mt-1">Today&apos;s Panchang</h2>
          </div>
          <p className="text-sm text-[#5E4E3E]">
            Sunrise <span className="font-mono font-medium text-[#1C1510] tabular-nums">{panchang.sunrise}</span>
            <span className="mx-2" aria-hidden="true">·</span>
            Sunset <span className="font-mono font-medium text-[#1C1510] tabular-nums">{panchang.sunset}</span>
            <span className="mx-2" aria-hidden="true">·</span>
            Moonrise <span className="font-mono font-medium text-[#1C1510] tabular-nums">{panchang.moonrise}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-5 pt-6">
          <div>
            <p className="text-xs font-medium text-[#6B5A48]">Vara (Day)</p>
            <p className="text-sm sm:text-base font-semibold text-[#1C1510] mt-1">
              {panchang.vara}
            </p>
            <p className="text-xs text-[#5E4E3E] mt-0.5">Lord: {panchang.varaLord}</p>
          </div>

          <div>
            <p className="text-xs font-medium text-[#6B5A48]">Tithi</p>
            <p className="text-sm sm:text-base font-semibold text-[#1C1510] mt-1">
              {panchang.tithi}
            </p>
            <p className="text-xs text-[#5E4E3E] mt-0.5">{panchang.paksha}</p>
          </div>

          <div>
            <p className="text-xs font-medium text-[#6B5A48]">Nakshatra</p>
            <p className="text-sm sm:text-base font-semibold text-[#1C1510] mt-1">
              {panchang.nakshatra}
            </p>
            <p className="text-xs text-[#5E4E3E] mt-0.5">Lunar Constellation</p>
          </div>

          <div>
            <p className="text-xs font-medium text-[#6B5A48]">Yoga</p>
            <p className="text-sm sm:text-base font-semibold text-[#1C1510] mt-1">
              {panchang.yoga}
            </p>
            <p className="text-xs text-[#5E4E3E] mt-0.5">Solar-Lunar Union</p>
          </div>

          <div>
            <p className="text-xs font-medium text-[#6B5A48]">Karana</p>
            <p className="text-sm sm:text-base font-semibold text-[#1C1510] mt-1">
              {panchang.karana}
            </p>
            <p className="text-xs text-[#5E4E3E] mt-0.5">Half-Tithi Phase</p>
          </div>

          <div>
            <p className="text-xs font-medium text-[#6B5A48]">Yamaganda Kaal</p>
            <p className="text-sm font-mono font-semibold text-[#1C1510] tabular-nums mt-1">
              {panchang.yamaganda.timeRange}
            </p>
            <p className="text-xs text-[#5E4E3E] mt-0.5">
              {getStatusBadgeText(panchang.yamaganda.status)}
            </p>
          </div>
        </div>
      </section>

      {/* Today's Rashifal Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-[#7A5C2E] flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5" />
              <span>Chandra Rashi Predictions</span>
            </p>
            <h2 className="text-2xl font-bold text-[#1C1510] mt-1">Today&apos;s Rashifal</h2>
          </div>
          <p className="text-sm text-[#5E4E3E]">
            Select your Moon Sign (Rashi) for daily guidance
          </p>
        </div>

        {/* 12 Rashi Selector */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {rashifalList.map((rashi) => {
            const isSelected = rashi.id === selectedRashi.id;
            return (
              <button
                key={rashi.id}
                type="button"
                onClick={() => setSelectedRashiId(rashi.id)}
                className={`min-h-[56px] px-3 py-2.5 rounded-xl border text-left transition-colors cursor-pointer flex items-center gap-2.5 ${
                  isSelected
                    ? 'bg-[#9E2A2B] border-[#9E2A2B] text-white'
                    : 'bg-white border-[#E5DCCB] text-[#1C1510] hover:border-[#C28B21]'
                }`}
              >
                <span
                  className={`text-xl leading-none shrink-0 ${
                    isSelected ? 'text-[#FFE2B0]' : 'text-[#9E2A2B]'
                  }`}
                  aria-hidden="true"
                >
                  {rashi.symbol}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{rashi.sanskritName}</p>
                  <p
                    className={`text-xs truncate ${
                      isSelected ? 'text-[#F6DFD8]' : 'text-[#6B5A48]'
                    }`}
                  >
                    {rashi.englishName}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Rashi Detailed Reading */}
        <div className="bg-white border border-[#E5DCCB] rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#EFE8DA]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#FAF5EC] border border-[#E5DCCB] flex items-center justify-center text-3xl text-[#9E2A2B] shrink-0">
                {selectedRashi.symbol}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#1C1510]">
                  {selectedRashi.sanskritName} ({selectedRashi.englishName})
                </h3>
                <p className="text-sm text-[#5E4E3E] mt-0.5 flex flex-wrap items-center gap-x-2">
                  <span>Swami: {selectedRashi.rulingPlanet}</span>
                  <span aria-hidden="true">·</span>
                  <span>Tattva: {selectedRashi.element}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onBookNow('janam-kundli')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl border border-[#9E2A2B] text-[#9E2A2B] text-sm font-semibold hover:bg-[#9E2A2B] hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Consult on Your Kundli</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
            <div className="lg:col-span-7 space-y-4">
              <div>
                <p className="text-xs font-semibold text-[#7A5C2E]">Daily Outlook</p>
                <p className="text-base text-[#1C1510] leading-relaxed mt-1">
                  {selectedRashi.prediction}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="pt-3 border-t border-[#EFE8DA]">
                  <p className="text-xs font-semibold text-[#6B5A48]">Career &amp; Finance</p>
                  <p className="text-sm text-[#3A2E24] leading-relaxed mt-1">
                    {selectedRashi.careerNote}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#EFE8DA]">
                  <p className="text-xs font-semibold text-[#6B5A48]">Health &amp; Balance</p>
                  <p className="text-sm text-[#3A2E24] leading-relaxed mt-1">
                    {selectedRashi.healthNote}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#FAF5EC] border border-[#E8DBC2] rounded-xl p-5 grid grid-cols-2 gap-4 content-center">
              <div>
                <p className="text-xs font-medium text-[#6B5A48]">Lucky Number</p>
                <p className="text-xl font-mono font-bold text-[#1C1510] tabular-nums mt-1">
                  {selectedRashi.luckyNumber}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-[#6B5A48]">Lucky Color</p>
                <p className="text-base font-semibold text-[#1C1510] mt-1">
                  {selectedRashi.luckyColor}
                </p>
              </div>
              <div className="col-span-2 pt-3 border-t border-[#E8DBC2]">
                <p className="text-xs font-medium text-[#6B5A48] flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#9E2A2B]" />
                  <span>Auspicious Time Window</span>
                </p>
                <p className="text-base font-mono font-semibold text-[#9E2A2B] tabular-nums mt-1">
                  {selectedRashi.auspiciousWindow}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
