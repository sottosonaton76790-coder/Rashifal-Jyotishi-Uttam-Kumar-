import { useState } from 'react';
import { CalendarCheck, Home } from 'lucide-react';
import logoImg from './assets/jyotishi-logo.png';
import BookingView from './components/BookingView';
import HomeView from './components/HomeView';
import { BUSINESS_INFO } from './data/astrologyData';

type ActiveTab = 'home' | 'booking';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [preselectedServiceId, setPreselectedServiceId] = useState<string | undefined>(undefined);
  const [headerLogoFailed, setHeaderLogoFailed] = useState(false);

  const navigateToBooking = (serviceId?: string) => {
    setPreselectedServiceId(serviceId);
    setActiveTab('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = () => {
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1C1510]">
      {/* Top Header: Static on mobile to respect sticky height cap, sticky on desktop */}
      <header className="md:sticky md:top-0 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E5DCCB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6 sm:gap-8">
          {/* Zone 1: Logo & Single-Line Brand Wordmark */}
          <button
            type="button"
            onClick={navigateToHome}
            className="flex items-center gap-3 text-left whitespace-nowrap shrink-0 cursor-pointer"
          >
            {!headerLogoFailed ? (
              <img
                src={logoImg}
                alt="Rashifal Jyotishi Uttam Kumar Logo"
                referrerPolicy="no-referrer"
                onError={() => setHeaderLogoFailed(true)}
                className="w-10 h-10 rounded-lg object-cover border border-[#D8C39A] shrink-0"
              />
            ) : (
              <span className="w-10 h-10 rounded-lg bg-[#9E2A2B] text-white font-display font-bold flex items-center justify-center shrink-0">
                ॐ
              </span>
            )}
            <span className="font-display text-base sm:text-lg font-bold tracking-tight text-[#1C1510] truncate max-w-[220px] sm:max-w-none">
              {BUSINESS_INFO.name}
            </span>
          </button>

          {/* Zone 2: Desktop Navigation (Only Home and Book Slot) */}
          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-8 text-sm font-medium"
          >
            <button
              type="button"
              onClick={navigateToHome}
              className={`py-1 whitespace-nowrap shrink-0 transition-colors border-b-2 cursor-pointer ${
                activeTab === 'home'
                  ? 'border-[#9E2A2B] text-[#9E2A2B] font-semibold'
                  : 'border-transparent text-[#5E4E3E] hover:text-[#1C1510]'
              }`}
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => navigateToBooking()}
              className={`py-1 whitespace-nowrap shrink-0 transition-colors border-b-2 cursor-pointer ${
                activeTab === 'booking'
                  ? 'border-[#9E2A2B] text-[#9E2A2B] font-semibold'
                  : 'border-transparent text-[#5E4E3E] hover:text-[#1C1510]'
              }`}
            >
              Book Slot
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="hidden md:flex items-center shrink-0">
            <button
              type="button"
              onClick={() => navigateToBooking()}
              className="px-4 py-2 min-h-[40px] rounded-xl bg-[#9E2A2B] text-white text-xs font-semibold hover:bg-[#822021] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Book Consultation
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {activeTab === 'home' ? (
          <HomeView onBookNow={navigateToBooking} />
        ) : (
          <BookingView initialServiceId={preselectedServiceId} />
        )}
      </main>

      {/* Clean Editorial Footer (Desktop & Tablet) */}
      <footer className="hidden md:block border-t border-[#E5DCCB] bg-[#F5EFE4]">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between gap-4 text-xs text-[#5E4E3E]">
          <span>
            {BUSINESS_INFO.name} · Horoscope, Kundli, Remedies &amp; Spiritual Guidance
          </span>
          <span className="font-mono tabular-nums">
            WhatsApp: +91 {BUSINESS_INFO.whatsappNumber}
          </span>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (Only Home and Book Slot) */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5DCCB]"
      >
        <div className="grid grid-cols-2 h-14">
          <button
            type="button"
            onClick={navigateToHome}
            className={`flex flex-col items-center justify-center gap-0.5 min-h-[44px] transition-colors cursor-pointer ${
              activeTab === 'home' ? 'text-[#9E2A2B]' : 'text-[#6B5A48]'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap">
              Home
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigateToBooking()}
            className={`flex flex-col items-center justify-center gap-0.5 min-h-[44px] transition-colors cursor-pointer ${
              activeTab === 'booking' ? 'text-[#9E2A2B]' : 'text-[#6B5A48]'
            }`}
          >
            <CalendarCheck className="w-5 h-5" />
            <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap">
              Book Slot
            </span>
          </button>
        </div>
      </nav>
    </div>
  );
}
