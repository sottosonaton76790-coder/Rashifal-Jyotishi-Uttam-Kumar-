import { useEffect, useMemo, useRef, useState } from 'react';
import QRCode from 'qrcode';
import {
  Calendar,
  Check,
  Clock,
  Copy,
  ExternalLink,
  MessageCircle,
  QrCode,
  ShieldCheck,
} from 'lucide-react';
import {
  BUSINESS_INFO,
  CONSULTATION_SERVICES,
  generateUpcomingDates,
  isSlotPassedForDate,
  TIME_SLOTS,
  type BookingDateOption,
  type ConsultationService,
} from '../data/astrologyData';

interface BookingViewProps {
  initialServiceId?: string;
}

export default function BookingView({ initialServiceId }: BookingViewProps) {
  const [now] = useState<Date>(() => new Date());
  const upcomingDates = useMemo(() => generateUpcomingDates(14, now), [now]);

  // Always defaults to today's actual live date (upcomingDates[0])
  const [selectedDateKey, setSelectedDateKey] = useState<string>(
    () => upcomingDates[0].dateKey
  );

  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    () =>
      CONSULTATION_SERVICES.find((s) => s.id === initialServiceId)?.id ??
      CONSULTATION_SERVICES[0].id
  );

  const selectedDate: BookingDateOption = useMemo(
    () => upcomingDates.find((d) => d.dateKey === selectedDateKey) ?? upcomingDates[0],
    [upcomingDates, selectedDateKey]
  );

  const selectedService: ConsultationService = useMemo(
    () =>
      CONSULTATION_SERVICES.find((s) => s.id === selectedServiceId) ??
      CONSULTATION_SERVICES[0],
    [selectedServiceId]
  );

  const firstAvailableSlotId = useMemo(() => {
    const openSlot = TIME_SLOTS.find(
      (slot) => !isSlotPassedForDate(slot, selectedDate, now)
    );
    return openSlot?.id ?? '';
  }, [selectedDate, now]);

  const [selectedSlotId, setSelectedSlotId] = useState<string>(firstAvailableSlotId);

  useEffect(() => {
    const currentStillValid = TIME_SLOTS.some(
      (s) => s.id === selectedSlotId && !isSlotPassedForDate(s, selectedDate, now)
    );
    if (!currentStillValid) {
      setSelectedSlotId(firstAvailableSlotId);
    }
  }, [selectedDate, selectedSlotId, firstAvailableSlotId, now]);

  const selectedSlot = useMemo(
    () => TIME_SLOTS.find((s) => s.id === selectedSlotId) ?? null,
    [selectedSlotId]
  );

  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [birthDetails, setBirthDetails] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [confirmedUrl, setConfirmedUrl] = useState<string | null>(null);
  const whatsappLinkRef = useRef<HTMLAnchorElement | null>(null);

  const upiUri = useMemo(() => {
    return `${BUSINESS_INFO.upiBaseUri}&am=${selectedService.feeInr}&cu=INR`;
  }, [selectedService.feeInr]);

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(upiUri, {
      width: 240,
      margin: 2,
      color: {
        dark: '#1C1510',
        light: '#FFFFFF',
      },
    })
      .then((url) => {
        if (active) {
          setQrDataUrl(url);
        }
      })
      .catch(() => {
        if (active) {
          setQrDataUrl('');
        }
      });

    return () => {
      active = false;
    };
  }, [upiUri]);

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText(BUSINESS_INFO.upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    } catch {
      setCopiedUpi(false);
    }
  };

  const buildWhatsAppUrl = () => {
    const lines = [
      `Namaste ${BUSINESS_INFO.astrologer},`,
      `I would like to confirm my astrology consultation booking:`,
      ``,
      `Service: ${selectedService.title}`,
      `Consultation Fee: Rs. ${selectedService.feeInr}`,
      `Date: ${selectedDate.fullLabel}`,
      `Time Slot: ${selectedSlot ? selectedSlot.label : 'To be scheduled'}`,
      `Name: ${clientName.trim()}`,
    ];
    if (clientPhone.trim()) {
      lines.push(`Phone: ${clientPhone.trim()}`);
    }
    if (birthDetails.trim()) {
      lines.push(`Birth Details: ${birthDetails.trim()}`);
    }
    if (notes.trim()) {
      lines.push(`Question / Focus: ${notes.trim()}`);
    }
    lines.push(``);
    lines.push(`I have scanned the UPI QR code (${BUSINESS_INFO.upiId}) for payment.`);

    return `https://wa.me/${BUSINESS_INFO.whatsappInternational}?text=${encodeURIComponent(
      lines.join('\n')
    )}`;
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      setErrorMessage('Please enter your full name before confirming your consultation.');
      return;
    }
    if (!selectedSlot) {
      setErrorMessage('Please select an available time slot for the chosen date.');
      return;
    }

    setErrorMessage(null);
    const whatsappUrl = buildWhatsAppUrl();
    setConfirmedUrl(whatsappUrl);

    // Trigger anchor navigation cleanly on the next microtask after href updates
    requestAnimationFrame(() => {
      whatsappLinkRef.current?.click();
    });
  };

  return (
    <div className="space-y-8 pb-24 md:pb-14">
      <div className="border-b border-[#E5DCCB] pb-5">
        <p className="text-xs font-medium text-[#7A5C2E]">
          Direct Consultation · WhatsApp +91 {BUSINESS_INFO.whatsappNumber}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1C1510] mt-1">
          Book Consultation Slot
        </h1>
        <p className="text-sm sm:text-base text-[#5E4E3E] mt-1">
          Choose a Vedic service, select today&apos;s or an upcoming date and time slot, scan the
          UPI QR code, and confirm on WhatsApp.
        </p>
      </div>

      <form
        onSubmit={handleConfirmBooking}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* Left Column: Service, Dynamic Date, Time Slot & Client Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Consultation Services */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#1C1510]">01. Select Consultation Service</h2>
            <div className="grid grid-cols-1 gap-3">
              {CONSULTATION_SERVICES.map((service) => {
                const isSelected = service.id === selectedService.id;
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => {
                      setSelectedServiceId(service.id);
                      setConfirmedUrl(null);
                    }}
                    className={`w-full text-left p-4 sm:p-5 rounded-xl border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#FDF8EF] border-[#9E2A2B] ring-1 ring-[#9E2A2B]'
                        : 'bg-white border-[#E5DCCB] hover:border-[#C28B21]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-base font-semibold text-[#1C1510]">
                          {service.title}
                        </p>
                        <p className="text-sm text-[#5E4E3E] mt-1 leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                      <span className="text-base sm:text-lg font-mono font-bold text-[#9E2A2B] tabular-nums whitespace-nowrap shrink-0">
                        ₹{service.feeInr}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 2. Dynamic Calendar Date Selector (defaults to Today) */}
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-[#1C1510] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#9E2A2B]" />
                <span>02. Select Date</span>
              </h2>
              <span className="text-xs font-medium text-[#5E4E3E]">
                {selectedDate.isToday ? 'Defaulted to Today · ' : ''}
                {selectedDate.fullLabel}
              </span>
            </div>

            <div className="flex lg:grid lg:grid-cols-7 gap-2 overflow-x-auto pb-2 lg:pb-0">
              {upcomingDates.map((dateOption) => {
                const isSelected = dateOption.dateKey === selectedDate.dateKey;
                return (
                  <button
                    key={dateOption.dateKey}
                    type="button"
                    onClick={() => {
                      setSelectedDateKey(dateOption.dateKey);
                      setConfirmedUrl(null);
                    }}
                    className={`min-w-[72px] lg:min-w-0 min-h-[76px] px-2.5 py-2.5 rounded-xl border flex flex-col items-center justify-center transition-colors shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-[#9E2A2B] border-[#9E2A2B] text-white'
                        : 'bg-white border-[#E5DCCB] text-[#1C1510] hover:border-[#C28B21]'
                    }`}
                  >
                    <span
                      className={`text-[11px] font-medium ${
                        isSelected ? 'text-[#FFE2B0]' : 'text-[#7A5C2E]'
                      }`}
                    >
                      {dateOption.isToday ? 'Today' : dateOption.dayShort}
                    </span>
                    <span className="text-lg font-mono font-bold tabular-nums leading-tight mt-0.5">
                      {dateOption.dayNumber}
                    </span>
                    <span
                      className={`text-[11px] ${
                        isSelected ? 'text-[#F6DFD8]' : 'text-[#6B5A48]'
                      }`}
                    >
                      {dateOption.monthShort}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 3. Time Slot Selector */}
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-[#1C1510] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#9E2A2B]" />
                <span>03. Select Time Slot</span>
              </h2>
              <span className="text-xs text-[#6B5A48]">IST (India Standard Time)</span>
            </div>

            {firstAvailableSlotId === '' ? (
              <div className="p-4 rounded-xl bg-[#FDF3E3] border border-[#E8D0A3] text-sm text-[#6B4A12]">
                All slots for today have concluded. Please select tomorrow or another upcoming date
                above.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {TIME_SLOTS.map((slot) => {
                  const passed = isSlotPassedForDate(slot, selectedDate, now);
                  const isSelected = slot.id === selectedSlotId && !passed;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={passed}
                      onClick={() => {
                        setSelectedSlotId(slot.id);
                        setConfirmedUrl(null);
                      }}
                      className={`min-h-[48px] px-3 py-2.5 rounded-xl border text-center transition-colors ${
                        passed
                          ? 'bg-[#F5F0E6] border-[#E8E0D0] text-[#A29584] cursor-not-allowed line-through'
                          : isSelected
                            ? 'bg-[#9E2A2B] border-[#9E2A2B] text-white cursor-pointer'
                            : 'bg-white border-[#E5DCCB] text-[#1C1510] hover:border-[#C28B21] cursor-pointer'
                      }`}
                    >
                      <span className="block text-sm font-mono font-semibold tabular-nums">
                        {slot.label}
                      </span>
                      <span
                        className={`block text-[11px] mt-0.5 ${
                          passed
                            ? 'text-[#A29584]'
                            : isSelected
                              ? 'text-[#F6DFD8]'
                              : 'text-[#6B5A48]'
                        }`}
                      >
                        {passed ? 'Passed' : slot.period}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* 4. Client Details */}
          <section className="bg-white border border-[#E5DCCB] rounded-2xl p-5 sm:p-6 space-y-4">
            <h2 className="text-lg font-bold text-[#1C1510]">04. Your Details</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="client-name"
                  className="block text-xs font-semibold text-[#4B3D30] mb-1.5"
                >
                  Full Name *
                </label>
                <input
                  id="client-name"
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-[#DDD1BC] bg-[#FAF7F2] text-sm text-[#1C1510] placeholder:text-[#9B8C7B] focus:outline-none focus:border-[#9E2A2B]"
                />
              </div>

              <div>
                <label
                  htmlFor="client-phone"
                  className="block text-xs font-semibold text-[#4B3D30] mb-1.5"
                >
                  WhatsApp / Phone Number
                </label>
                <input
                  id="client-phone"
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-[#DDD1BC] bg-[#FAF7F2] text-sm text-[#1C1510] placeholder:text-[#9B8C7B] focus:outline-none focus:border-[#9E2A2B]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="birth-details"
                className="block text-xs font-semibold text-[#4B3D30] mb-1.5"
              >
                Date, Time &amp; Place of Birth (Optional for Kundli)
              </label>
              <input
                id="birth-details"
                type="text"
                value={birthDetails}
                onChange={(e) => setBirthDetails(e.target.value)}
                placeholder="e.g., 14 Aug 1995, 06:40 AM, Kolkata"
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-[#DDD1BC] bg-[#FAF7F2] text-sm text-[#1C1510] placeholder:text-[#9B8C7B] focus:outline-none focus:border-[#9E2A2B]"
              />
            </div>

            <div>
              <label
                htmlFor="client-notes"
                className="block text-xs font-semibold text-[#4B3D30] mb-1.5"
              >
                Question or Consultation Focus (Optional)
              </label>
              <textarea
                id="client-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Share any specific questions about career, marriage, health, or remedies"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD1BC] bg-[#FAF7F2] text-sm text-[#1C1510] placeholder:text-[#9B8C7B] focus:outline-none focus:border-[#9E2A2B]"
              />
            </div>
          </section>
        </div>

        {/* Right Column: Sticky UPI QR Payment & Confirm to WhatsApp */}
        <aside className="lg:col-span-5 lg:sticky lg:top-24 bg-white border border-[#E5DCCB] rounded-2xl p-6 space-y-6">
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#EFE8DA]">
            <div>
              <p className="text-xs font-medium text-[#7A5C2E]">Payment &amp; Confirmation</p>
              <h2 className="text-xl font-bold text-[#1C1510] mt-0.5">Scan UPI QR Code</h2>
            </div>
            <div className="text-right">
              <p className="text-xs text-[#6B5A48]">Consultation Fee</p>
              <p className="text-2xl font-mono font-bold text-[#9E2A2B] tabular-nums">
                ₹{selectedService.feeInr}
              </p>
            </div>
          </div>

          {/* Selected Slot Summary */}
          <div className="bg-[#FAF5EC] border border-[#E8DBC2] rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between gap-2">
              <span className="text-[#6B5A48]">Service</span>
              <span className="font-semibold text-[#1C1510] text-right">
                {selectedService.title}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-[#6B5A48]">Date</span>
              <span className="font-mono font-medium text-[#1C1510] tabular-nums text-right">
                {selectedDate.isToday ? `Today (${selectedDate.dayNumber} ${selectedDate.monthShort})` : selectedDate.fullLabel}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <span className="text-[#6B5A48]">Time Slot</span>
              <span className="font-mono font-medium text-[#1C1510] tabular-nums text-right">
                {selectedSlot ? selectedSlot.label : 'Select a slot'}
              </span>
            </div>
          </div>

          {/* Scannable UPI QR Code */}
          <div className="flex flex-col items-center text-center space-y-3 py-2">
            <div className="p-3 bg-white border border-[#DDD1BC] rounded-2xl">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`UPI QR Code for ₹${selectedService.feeInr} to ${BUSINESS_INFO.upiPayeeName}`}
                  className="w-48 h-48 object-contain"
                />
              ) : (
                <div className="w-48 h-48 flex flex-col items-center justify-center text-[#6B5A48] gap-2">
                  <QrCode className="w-10 h-10" />
                  <span className="text-xs">Generating UPI QR...</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-medium text-[#5E4E3E]">
                Pay via GPay, PhonePe, Paytm, or BHIM UPI
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FAF7F2] border border-[#E5DCCB]">
                <span className="text-xs font-mono font-medium text-[#1C1510]">
                  {BUSINESS_INFO.upiId}
                </span>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#9E2A2B] hover:text-[#7A1E1F] cursor-pointer"
                  aria-label="Copy UPI ID"
                >
                  {copiedUpi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-[#FDF0F0] border border-[#E8B8B8] text-xs font-medium text-[#9E2A2B]"
            >
              {errorMessage}
            </div>
          )}

          {/* Hidden direct anchor triggered programmatically on Confirm */}
          <a
            ref={whatsappLinkRef}
            href={confirmedUrl ?? buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden"
            aria-hidden="true"
          >
            WhatsApp Redirect
          </a>

          <div className="space-y-3">
            <button
              type="submit"
              className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#9E2A2B] text-white text-sm font-semibold hover:bg-[#822021] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Confirm</span>
            </button>

            <p className="text-xs text-[#6B5A48] flex items-center justify-center gap-1.5 text-center">
              <ShieldCheck className="w-4 h-4 text-[#2F6B43] shrink-0" />
              <span>
                Redirects to WhatsApp (+91 {BUSINESS_INFO.whatsappNumber}) with your slot details
              </span>
            </p>
          </div>

          {confirmedUrl && (
            <div className="p-4 rounded-xl bg-[#F2F8F3] border border-[#C3DEC8] space-y-3">
              <p className="text-xs font-semibold text-[#235733]">
                Booking summary prepared for WhatsApp (+91 {BUSINESS_INFO.whatsappNumber})
              </p>
              <a
                href={confirmedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-[#1F6F3D] text-white text-xs font-semibold hover:bg-[#185A31] transition-colors flex items-center justify-center gap-2"
              >
                <span>Open WhatsApp (+91 {BUSINESS_INFO.whatsappNumber})</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </aside>
      </form>
    </div>
  );
}
