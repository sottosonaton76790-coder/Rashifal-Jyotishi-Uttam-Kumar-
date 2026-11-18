export interface ConsultationService {
  id: string;
  title: string;
  feeInr: number;
  description: string;
}

export const BUSINESS_INFO = {
  name: 'Rashifal Jyotishi Uttam Kumar',
  astrologer: 'Jyotishi Uttam Kumar',
  whatsappNumber: '7478034675',
  whatsappInternational: '917478034675',
  upiId: '10mahakalibari@axl',
  upiPayeeName: 'M/S JYOTISH UTTAM KUMAR',
  upiBaseUri:
    'upi://pay?pa=10mahakalibari@axl&pn=M/S%20JYOTISH%20UTTAM%20KUMAR&mc=0000&mode=02&purpose=00',
} as const;

export const CONSULTATION_SERVICES: ConsultationService[] = [
  {
    id: 'janam-kundli',
    title: 'Janam Kundli Analysis',
    feeInr: 1001,
    description:
      'Complete Vedic birth chart reading covering Dasha periods, planetary strengths, career trajectory, and personalized Graha remedies.',
  },
  {
    id: 'kundli-milan',
    title: 'Marriage & Kundli Milan',
    feeInr: 1001,
    description:
      'Ashtakoota Guna matching, Manglik Dosha assessment, Nadi & Bhakoot compatibility check, and auspicious Vivah Muhurat guidance.',
  },
  {
    id: 'career-business',
    title: 'Career & Business Muhurat',
    feeInr: 1001,
    description:
      'Auspicious timing for new ventures, job transitions, property registry, and planetary remedies for financial stability.',
  },
  {
    id: 'vastu-remedies',
    title: 'Vastu & Graha Shanti Upay',
    feeInr: 1001,
    description:
      'Directional Vastu evaluation for home or office paired with Vedic mantra, gemstone, and charity remedies.',
  },
  {
    id: 'prashna-urgent',
    title: 'Prashna Horary Consultation',
    feeInr: 1001,
    description:
      'Focused horary astrology guidance for urgent life questions when exact birth time is unavailable.',
  },
];

export interface BookingDateOption {
  dateKey: string;
  dateObj: Date;
  dayShort: string;
  dayNumber: string;
  monthShort: string;
  fullLabel: string;
  isToday: boolean;
}

export function formatLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function generateUpcomingDates(
  daysCount = 14,
  referenceDate: Date = new Date()
): BookingDateOption[] {
  const base = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate()
  );

  const dayFormatter = new Intl.DateTimeFormat('en-IN', { weekday: 'short' });
  const monthFormatter = new Intl.DateTimeFormat('en-IN', { month: 'short' });
  const fullFormatter = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const dates: BookingDateOption[] = [];
  for (let i = 0; i < daysCount; i++) {
    const dateObj = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
    dates.push({
      dateKey: formatLocalDateKey(dateObj),
      dateObj,
      dayShort: dayFormatter.format(dateObj),
      dayNumber: String(dateObj.getDate()),
      monthShort: monthFormatter.format(dateObj),
      fullLabel: fullFormatter.format(dateObj),
      isToday: i === 0,
    });
  }
  return dates;
}

export interface TimeSlot {
  id: string;
  label: string;
  hour24: number;
  minute: number;
  period: 'Morning' | 'Afternoon' | 'Evening';
}

export const TIME_SLOTS: TimeSlot[] = [
  { id: 'slot-0930', label: '09:30 AM', hour24: 9, minute: 30, period: 'Morning' },
  { id: 'slot-1030', label: '10:30 AM', hour24: 10, minute: 30, period: 'Morning' },
  { id: 'slot-1130', label: '11:30 AM', hour24: 11, minute: 30, period: 'Morning' },
  { id: 'slot-1300', label: '01:00 PM', hour24: 13, minute: 0, period: 'Afternoon' },
  { id: 'slot-1530', label: '03:30 PM', hour24: 15, minute: 30, period: 'Afternoon' },
  { id: 'slot-1630', label: '04:30 PM', hour24: 16, minute: 30, period: 'Afternoon' },
  { id: 'slot-1800', label: '06:00 PM', hour24: 18, minute: 0, period: 'Evening' },
  { id: 'slot-1930', label: '07:30 PM', hour24: 19, minute: 30, period: 'Evening' },
];

export function isSlotPassedForDate(
  slot: TimeSlot,
  selectedDate: BookingDateOption,
  now: Date = new Date()
): boolean {
  if (!selectedDate.isToday) {
    return false;
  }
  const slotMinutes = slot.hour24 * 60 + slot.minute;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return slotMinutes <= currentMinutes + 15;
}

export interface KaalWindow {
  label: string;
  startHour24: number;
  startMinute: number;
  endHour24: number;
  endMinute: number;
  timeRange: string;
  status: 'Active Now' | 'Upcoming' | 'Completed';
}

export interface DailyPanchang {
  dateFormatted: string;
  vara: string;
  varaLord: string;
  hinduMasa: string;
  vikramSamvat: number;
  paksha: 'Shukla Paksha' | 'Krishna Paksha';
  tithi: string;
  nakshatra: string;
  yoga: string;
  karana: string;
  sunrise: string;
  sunset: string;
  moonrise: string;
  rahuKaal: KaalWindow;
  yamaganda: KaalWindow;
  gulikaKaal: KaalWindow;
  abhijitMuhurat: KaalWindow;
}

const VARA_DATA = [
  { vara: 'Ravivara (Sunday)', lord: 'Surya (Sun)' },
  { vara: 'Somavara (Monday)', lord: 'Chandra (Moon)' },
  { vara: 'Mangalavara (Tuesday)', lord: 'Mangala (Mars)' },
  { vara: 'Budhavara (Wednesday)', lord: 'Budha (Mercury)' },
  { vara: 'Guruvara (Thursday)', lord: 'Brihaspati (Jupiter)' },
  { vara: 'Shukravara (Friday)', lord: 'Shukra (Venus)' },
  { vara: 'Shanivara (Saturday)', lord: 'Shani (Saturn)' },
];

// Traditional Vedic 8-part daytime Rahu Kaal, Yamaganda, and Gulika Kaal slots (06:00 - 18:00 baseline)
const RAHU_KAAL_BY_DAY: Array<[number, number, number, number]> = [
  [16, 30, 18, 0], // Sunday
  [7, 30, 9, 0], // Monday
  [15, 0, 16, 30], // Tuesday
  [12, 0, 13, 30], // Wednesday
  [13, 30, 15, 0], // Thursday
  [10, 30, 12, 0], // Friday
  [9, 0, 10, 30], // Saturday
];

const YAMAGANDA_BY_DAY: Array<[number, number, number, number]> = [
  [12, 0, 13, 30], // Sunday
  [10, 30, 12, 0], // Monday
  [9, 0, 10, 30], // Tuesday
  [7, 30, 9, 0], // Wednesday
  [6, 0, 7, 30], // Thursday
  [15, 0, 16, 30], // Friday
  [13, 30, 15, 0], // Saturday
];

const GULIKA_BY_DAY: Array<[number, number, number, number]> = [
  [15, 0, 16, 30], // Sunday
  [13, 30, 15, 0], // Monday
  [12, 0, 13, 30], // Tuesday
  [10, 30, 12, 0], // Wednesday
  [9, 0, 10, 30], // Thursday
  [7, 30, 9, 0], // Friday
  [6, 0, 7, 30], // Saturday
];

const TITHI_NAMES = [
  'Pratipada',
  'Dwitiya',
  'Tritiya',
  'Chaturthi',
  'Panchami',
  'Shashthi',
  'Saptami',
  'Ashtami',
  'Navami',
  'Dashami',
  'Ekadashi',
  'Dwadashi',
  'Trayodashi',
  'Chaturdashi',
];

const NAKSHATRAS = [
  'Ashwini',
  'Bharani',
  'Krittika',
  'Rohini',
  'Mrigashira',
  'Ardra',
  'Punarvasu',
  'Pushya',
  'Ashlesha',
  'Magha',
  'Purva Phalguni',
  'Uttara Phalguni',
  'Hasta',
  'Chitra',
  'Swati',
  'Vishakha',
  'Anuradha',
  'Jyeshtha',
  'Mula',
  'Purva Ashadha',
  'Uttara Ashadha',
  'Shravana',
  'Dhanishta',
  'Shatabhisha',
  'Purva Bhadrapada',
  'Uttara Bhadrapada',
  'Revati',
];

const YOGAS = [
  'Vishkambha',
  'Priti',
  'Ayushman',
  'Saubhagya',
  'Shobhana',
  'Atiganda',
  'Sukarma',
  'Dhriti',
  'Shula',
  'Ganda',
  'Vriddhi',
  'Dhruva',
  'Vyaghata',
  'Harshana',
  'Vajra',
  'Siddhi',
  'Vyatipata',
  'Variyan',
  'Parigha',
  'Shiva',
  'Siddha',
  'Sadhya',
  'Shubha',
  'Shukla',
  'Brahma',
  'Indra',
  'Vaidhriti',
];

const KARANAS = [
  'Bava',
  'Balava',
  'Kaulava',
  'Taitila',
  'Gara',
  'Vanija',
  'Vishti (Bhadra)',
];

const HINDU_MASAS = [
  'Pausha',
  'Magha',
  'Phalguna',
  'Chaitra',
  'Vaishakha',
  'Jyeshtha',
  'Ashadha',
  'Shravana',
  'Bhadrapada',
  'Ashwin',
  'Kartika',
  'Margashirsha',
];

function format12Hour(hour24: number, minute: number): string {
  const period = hour24 >= 12 ? 'PM' : 'AM';
  const h12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${String(h12).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${period}`;
}

function buildKaalWindow(
  label: string,
  coords: [number, number, number, number],
  now: Date
): KaalWindow {
  const [sh, sm, eh, em] = coords;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = sh * 60 + sm;
  const endMinutes = eh * 60 + em;

  let status: KaalWindow['status'] = 'Upcoming';
  if (nowMinutes >= startMinutes && nowMinutes <= endMinutes) {
    status = 'Active Now';
  } else if (nowMinutes > endMinutes) {
    status = 'Completed';
  }

  return {
    label,
    startHour24: sh,
    startMinute: sm,
    endHour24: eh,
    endMinute: em,
    timeRange: `${format12Hour(sh, sm)} - ${format12Hour(eh, em)}`,
    status,
  };
}

export function getDailyPanchang(now: Date = new Date()): DailyPanchang {
  const dayOfWeek = now.getDay();
  const varaInfo = VARA_DATA[dayOfWeek];

  // Synodic lunar cycle anchored at J2000 reference New Moon (2000-01-06T18:14:00Z)
  const j2000NewMoonMs = Date.UTC(2000, 0, 6, 18, 14, 0);
  const synodicMonthDays = 29.53058867;
  const daysSinceRef = (now.getTime() - j2000NewMoonMs) / 86400000;
  const lunarCycles = daysSinceRef / synodicMonthDays;
  const phaseFraction = ((lunarCycles % 1) + 1) % 1;

  const tithiIndex = Math.floor(phaseFraction * 30); // 0..29
  const paksha: DailyPanchang['paksha'] =
    tithiIndex < 15 ? 'Shukla Paksha' : 'Krishna Paksha';
  const pakshaTithiIdx = tithiIndex % 15;
  const tithi =
    pakshaTithiIdx === 14
      ? paksha === 'Shukla Paksha'
        ? 'Purnima'
        : 'Amavasya'
      : TITHI_NAMES[pakshaTithiIdx];

  // Approximate Moon & Sun sidereal longitudes for Nakshatra & Yoga
  const daysSinceJ2000 = (now.getTime() - Date.UTC(2000, 0, 1, 12, 0, 0)) / 86400000;
  const ayanamsha = 24.18;
  const moonSidereal =
    (((218.316 + 13.176396 * daysSinceJ2000 - ayanamsha) % 360) + 360) % 360;
  const sunSidereal =
    (((280.46 + 0.9856474 * daysSinceJ2000 - ayanamsha) % 360) + 360) % 360;

  const nakshatra = NAKSHATRAS[Math.floor(moonSidereal / (360 / 27)) % 27];
  const yogaAngle = (sunSidereal + moonSidereal) % 360;
  const yoga = YOGAS[Math.floor(yogaAngle / (360 / 27)) % 27];
  const karana = KARANAS[(tithiIndex * 2) % KARANAS.length];

  const hinduMasa = HINDU_MASAS[now.getMonth()];
  // Vikram Samvat transitions around Chaitra (March/April)
  const vikramSamvat = now.getMonth() >= 3 ? now.getFullYear() + 57 : now.getFullYear() + 56;

  // Daylight seasonal offset (IST baseline)
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const seasonalShiftMin = Math.round(Math.sin(((dayOfYear - 80) / 365) * Math.PI * 2) * 28);
  const sunriseTotalMin = 6 * 60 + 12 - seasonalShiftMin;
  const sunsetTotalMin = 17 * 60 + 48 + seasonalShiftMin;
  const sunrise = format12Hour(Math.floor(sunriseTotalMin / 60), sunriseTotalMin % 60);
  const sunset = format12Hour(Math.floor(sunsetTotalMin / 60), sunsetTotalMin % 60);

  const moonriseOffsetMin = (tithiIndex * 49) % (24 * 60);
  const moonriseTotalMin = (6 * 60 + 25 + moonriseOffsetMin) % (24 * 60);
  const moonrise = format12Hour(Math.floor(moonriseTotalMin / 60), moonriseTotalMin % 60);

  const dateFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(now);

  return {
    dateFormatted,
    vara: varaInfo.vara,
    varaLord: varaInfo.lord,
    hinduMasa,
    vikramSamvat,
    paksha,
    tithi,
    nakshatra,
    yoga,
    karana,
    sunrise,
    sunset,
    moonrise,
    rahuKaal: buildKaalWindow('Rahu Kaal', RAHU_KAAL_BY_DAY[dayOfWeek], now),
    yamaganda: buildKaalWindow('Yamaganda Kaal', YAMAGANDA_BY_DAY[dayOfWeek], now),
    gulikaKaal: buildKaalWindow('Gulika Kaal', GULIKA_BY_DAY[dayOfWeek], now),
    abhijitMuhurat: buildKaalWindow('Abhijit Muhurat', [11, 46, 12, 34], now),
  };
}

export interface RashiItem {
  id: string;
  sanskritName: string;
  englishName: string;
  symbol: string;
  rulingPlanet: string;
  element: string;
  prediction: string;
  careerNote: string;
  healthNote: string;
  luckyNumber: number;
  luckyColor: string;
  auspiciousWindow: string;
}

const BASE_RASHIS: Array<Omit<RashiItem, 'prediction' | 'careerNote' | 'healthNote' | 'luckyNumber' | 'luckyColor' | 'auspiciousWindow'>> = [
  { id: 'mesha', sanskritName: 'Mesha', englishName: 'Aries', symbol: '♈', rulingPlanet: 'Mangala (Mars)', element: 'Agni (Fire)' },
  { id: 'vrishabha', sanskritName: 'Vrishabha', englishName: 'Taurus', symbol: '♉', rulingPlanet: 'Shukra (Venus)', element: 'Prithvi (Earth)' },
  { id: 'mithuna', sanskritName: 'Mithuna', englishName: 'Gemini', symbol: '♊', rulingPlanet: 'Budha (Mercury)', element: 'Vayu (Air)' },
  { id: 'karka', sanskritName: 'Karka', englishName: 'Cancer', symbol: '♋', rulingPlanet: 'Chandra (Moon)', element: 'Jala (Water)' },
  { id: 'simha', sanskritName: 'Simha', englishName: 'Leo', symbol: '♌', rulingPlanet: 'Surya (Sun)', element: 'Agni (Fire)' },
  { id: 'kanya', sanskritName: 'Kanya', englishName: 'Virgo', symbol: '♍', rulingPlanet: 'Budha (Mercury)', element: 'Prithvi (Earth)' },
  { id: 'tula', sanskritName: 'Tula', englishName: 'Libra', symbol: '♎', rulingPlanet: 'Shukra (Venus)', element: 'Vayu (Air)' },
  { id: 'vrishchika', sanskritName: 'Vrishchika', englishName: 'Scorpio', symbol: '♏', rulingPlanet: 'Mangala (Mars)', element: 'Jala (Water)' },
  { id: 'dhanu', sanskritName: 'Dhanu', englishName: 'Sagittarius', symbol: '♐', rulingPlanet: 'Brihaspati (Jupiter)', element: 'Agni (Fire)' },
  { id: 'makara', sanskritName: 'Makara', englishName: 'Capricorn', symbol: '♑', rulingPlanet: 'Shani (Saturn)', element: 'Prithvi (Earth)' },
  { id: 'kumbha', sanskritName: 'Kumbha', englishName: 'Aquarius', symbol: '♒', rulingPlanet: 'Shani (Saturn)', element: 'Vayu (Air)' },
  { id: 'meena', sanskritName: 'Meena', englishName: 'Pisces', symbol: '♓', rulingPlanet: 'Brihaspati (Jupiter)', element: 'Jala (Water)' },
];

const DAILY_GUIDANCE_THEMES = [
  'Planetary alignment favors disciplined execution of pending work. Avoid initiating major financial agreements during Rahu Kaal.',
  'Chandra transit strengthens clarity in family discussions and partnership choices. Offer water to Surya in the morning for steady focus.',
  'Favorable Guru aspect supports learning, long-term planning, and mentor conversations. Patience brings measurable progress by evening.',
  'Measured speech and thoughtful budgeting keep obstacles away today. An unexpected positive message from an associate is likely.',
  'Strong creative momentum accompanies routine tasks. Prioritize unfinished commitments before starting new ventures.',
  'Spiritual grounding and calm decision-making protect your energy. Evening hours bring relief in domestic or property matters.',
  'Favorable transit for negotiations, client outreach, and structured study. Avoid impulsive travel during inauspicious hours.',
];

const CAREER_NOTES = [
  'Senior colleagues notice consistent follow-through; document key deliverables clearly.',
  'Review contract clauses carefully before committing funds or partnerships.',
  'Strong day for client conversations, creative pitches, and strategic planning.',
  'Steady progress on analytical work; avoid workplace disagreements in the afternoon.',
  'Pending approvals or delayed payments show encouraging movement today.',
  'Focus on skill refinement and organizing long-range business milestones.',
];

const HEALTH_NOTES = [
  'Maintain hydration and light satvik meals during midday.',
  'Gentle evening pranayama relieves mental fatigue and restores sleep rhythm.',
  'Protect joints and posture if working long hours at a desk.',
  'Avoid cold beverages late in the evening; favor warm herbal infusions.',
  'Short morning walk in sunlight supports vitality and mood balance.',
  'Prioritize restful sleep and limit late-night screen exposure.',
];

const LUCKY_COLORS = [
  'Saffron Gold',
  'Ivory White',
  'Vermilion Red',
  'Emerald Green',
  'Deep Maroon',
  'Amber Yellow',
  'Royal Indigo',
  'Sandalwood Cream',
];

const AUSPICIOUS_WINDOWS = [
  '08:15 AM - 09:45 AM',
  '10:00 AM - 11:25 AM',
  '11:46 AM - 12:34 PM',
  '04:10 PM - 05:30 PM',
  '06:15 PM - 07:40 PM',
];

export function getDailyRashifal(now: Date = new Date()): RashiItem[] {
  const daySeed =
    now.getFullYear() * 372 + (now.getMonth() + 1) * 31 + now.getDate();

  return BASE_RASHIS.map((rashi, idx) => {
    const seed = daySeed + idx * 5;
    return {
      ...rashi,
      prediction: DAILY_GUIDANCE_THEMES[seed % DAILY_GUIDANCE_THEMES.length],
      careerNote: CAREER_NOTES[(seed + 2) % CAREER_NOTES.length],
      healthNote: HEALTH_NOTES[(seed + 4) % HEALTH_NOTES.length],
      luckyNumber: ((seed % 9) + 1),
      luckyColor: LUCKY_COLORS[(seed + idx) % LUCKY_COLORS.length],
      auspiciousWindow: AUSPICIOUS_WINDOWS[(seed + 1) % AUSPICIOUS_WINDOWS.length],
    };
  });
}
