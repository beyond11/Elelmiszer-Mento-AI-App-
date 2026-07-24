import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Leaf, 
  MapPin, 
  Sparkles, 
  Upload, 
  Camera, 
  AlertTriangle, 
  Heart, 
  Search, 
  Building2, 
  Filter, 
  Clock, 
  Plus, 
  X, 
  ChevronDown, 
  ShoppingBag, 
  ChefHat, 
  BookOpen,
  CheckCircle2,
  HelpCircle,
  QrCode,
  Map,
  Compass,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { StoreOffer, DonationPoint, UserStats, AiAnalysisResult } from './types';
import Dashboard from './components/Dashboard';

// Preset Coordinates / Hotspots in Hungary
const LOCATIONS_PRESETS = [
  { name: 'Budapest, Deák Ferenc tér (Központ)', lat: 47.4979, lng: 19.0503 },
  { name: 'Budapest, Astoria', lat: 47.4942, lng: 19.0594 },
  { name: 'Budapest, Széll Kálmán tér', lat: 47.5072, lng: 19.0253 },
  { name: 'Budapest, Nyugati pályaudvar', lat: 47.5103, lng: 19.0574 },
  { name: 'Debrecen, Nagytemplom', lat: 47.5317, lng: 21.6242 },
  { name: 'Szeged, Dóm tér', lat: 46.2483, lng: 20.1481 },
  { name: 'Pécs, Széchenyi tér', lat: 46.0763, lng: 18.2285 },
];

const INITIAL_OFFERS: StoreOffer[] = [
  {
    id: 'off-1',
    chain: 'Lidl',
    storeName: 'Lidl Budapest, Bajcsy-Zsilinszky út',
    productName: 'Sertéshús tálcás darált 500g',
    originalPrice: 1490,
    discountedPrice: 590,
    expiryText: 'Ma lejár a szavatossága',
    lat: 47.5025,
    lng: 19.0558,
    category: 'Hús',
    stockQuantity: 3,
    imageUrl: '🥩'
  },
  {
    id: 'off-2',
    chain: 'Spar',
    storeName: 'InterSpar Budapest, Király utca',
    productName: 'Teavaj 250g (82% zsírtartalom)',
    originalPrice: 990,
    discountedPrice: 490,
    expiryText: 'Holnap lejár',
    lat: 47.4991,
    lng: 19.0592,
    category: 'Tejtermék',
    stockQuantity: 8,
    imageUrl: '🧈'
  },
  {
    id: 'off-3',
    chain: 'Tesco',
    storeName: 'Tesco Expressz Budapest, Rákóczi út',
    productName: 'Kovászos parasztkenyér 500g',
    originalPrice: 650,
    discountedPrice: 220,
    expiryText: 'Ma este kivonják',
    lat: 47.4958,
    lng: 19.0620,
    category: 'Pékáru',
    stockQuantity: 5,
    imageUrl: '🍞'
  },
  {
    id: 'off-4',
    chain: 'Aldi',
    storeName: 'Aldi Budapest, Kálvin tér',
    productName: 'Bio alma lédús csomag (1.5kg)',
    originalPrice: 1190,
    discountedPrice: 490,
    expiryText: 'Megnyomódott szemektől mentes, de érett',
    lat: 47.4891,
    lng: 19.0615,
    category: 'Zöldség-Gyümölcs',
    stockQuantity: 4,
    imageUrl: '🍎'
  },
  {
    id: 'off-5',
    chain: 'Penny',
    storeName: 'Penny Market Budapest, Hősök tere',
    productName: 'Egész grillezetlen csirke (kb 1.2kg)',
    originalPrice: 2100,
    discountedPrice: 990,
    expiryText: 'Ma lejáró friss áru',
    lat: 47.5140,
    lng: 19.0780,
    category: 'Hús',
    stockQuantity: 2,
    imageUrl: '🍗'
  },
  {
    id: 'off-6',
    chain: 'Auchan',
    storeName: 'Auchan Szupermarket Budapest, Óbuda',
    productName: 'Családi Lasagne tészta készétel (1kg)',
    originalPrice: 2490,
    discountedPrice: 1190,
    expiryText: 'Holnap lejáró hűtött étel',
    lat: 47.5312,
    lng: 19.0345,
    category: 'Készétel',
    stockQuantity: 4,
    imageUrl: '🍛'
  },
  {
    id: 'off-7',
    chain: 'Metro',
    storeName: 'Metro Giga Budapest, Külső út',
    productName: 'Gouda tömbsajt 1kg kiszerelés',
    originalPrice: 3890,
    discountedPrice: 1790,
    expiryText: 'Csomagolás enyhén sérült, szavatosság kiváló (5 nap)',
    lat: 47.5610,
    lng: 19.1410,
    category: 'Tejtermék',
    stockQuantity: 11,
    imageUrl: '🧀'
  },
  {
    id: 'off-8',
    chain: 'Lidl',
    storeName: 'Lidl Szeged, Makkosházi krt.',
    productName: 'Friss Vegyes Salátatál öntettel',
    originalPrice: 890,
    discountedPrice: 350,
    expiryText: 'Ma lejár',
    lat: 46.2690,
    lng: 20.1550,
    category: 'Zöldség-Gyümölcs',
    stockQuantity: 6,
    imageUrl: '🥗'
  },
  {
    id: 'off-9',
    chain: 'Spar',
    storeName: 'Spar Debrecen, Nagyerdő',
    productName: 'Szeletelt bacon szalonna 200g',
    originalPrice: 1090,
    discountedPrice: 490,
    expiryText: 'Holnap lejár',
    lat: 47.5450,
    lng: 21.6310,
    category: 'Hús',
    stockQuantity: 14,
    imageUrl: '🥓'
  },
  {
    id: 'off-10',
    chain: 'Aldi',
    storeName: 'Aldi Pécs, Zsolnay negyed',
    productName: 'Csokoládés fánk 4db-os kiszerelés',
    originalPrice: 790,
    discountedPrice: 290,
    expiryText: 'Ma és holnap még omlós',
    lat: 46.0785,
    lng: 18.2410,
    category: 'Pékáru',
    stockQuantity: 3,
    imageUrl: '🍩'
  }
];

const INITIAL_DONATION_POINTS: DonationPoint[] = [
  {
    id: 'don-1',
    name: 'Magyar Vöröskereszt Adománygyűjtő pont',
    organization: 'Magyar Vöröskereszt',
    address: '1051 Budapest, Arany János u. 31.',
    phone: '+36 1 374 1300',
    hours: 'Hétfő - Péntek: 08:00 - 16:30',
    acceptedItems: ['Tartós élelmiszer', 'Konzerv', 'Bébiétel', 'Cukor, liszt, tészta', 'É Tolóolaj'],
    lat: 47.5020,
    lng: 19.0525,
    description: 'Hivatalos Vöröskereszt kirendeltség. Kizárólag bontatlan, szavatossági időn belüli tartós élelmiszereket tudnak fogadni rászoruló családoknak.'
  },
  {
    id: 'don-2',
    name: 'Budapesti Élelmiszerbank Egyesület raktári leadás',
    organization: 'Élelmiszerbank',
    address: '1106 Budapest, Lokomotív utca 4.',
    phone: '+36 1 261 4112',
    hours: 'Munkanapokon: 09:00 - 15:00',
    acceptedItems: ['Tartós élelmiszer', 'Pékáru (szervezetten)', 'Zöldség-Gyümölcs surplus', 'Tejtermékek (hűtve)'],
    lat: 47.4915,
    lng: 19.1250,
    description: 'Nagyobb mennyiségű háztartási vagy kereskedelmi élelmiszer-felesleg koordinációs központja. Magánszemélyek és cégek felajánlásait is fogadják.'
  },
  {
    id: 'don-3',
    name: 'Belvárosi Szeretetláda rászorulóknak',
    organization: 'Szeretetláda',
    address: '1075 Budapest, Károly körút 18. (Udvar)',
    phone: 'Nem szükséges regisztráció',
    hours: '0-24 órában nyitva (Közterületi szekrény)',
    acceptedItems: ['Kenyérfélék', 'Gyümölcs', 'Konzervek', 'Zárt csomagolású készétel', 'Száraztészta'],
    lat: 47.4950,
    lng: 19.0601,
    description: 'Bárki által szabadon igénybe vehető élelmiszer-megosztó doboz. Tedd be ami feleslegessé vált, és vedd ki ha szükséged van rá! Kérjük, csak tiszta, fogyasztható ételt helyezz el.'
  },
  {
    id: 'don-4',
    name: 'Szent Ferenc Karitász Csoport gyűjtőhely',
    organization: 'Egyház / Civil',
    address: '1053 Budapest, Ferenciek tere 2.',
    phone: '+36 30 551 2940',
    hours: 'Kedd és Csütörtök: 14:00 - 18:00',
    acceptedItems: ['Tartós élelmiszerek', 'Rizs, tészta, konzervek', 'Édesség gyermekeknek', 'Tisztítószerek'],
    lat: 47.4930,
    lng: 19.0560,
    description: 'A helyi plébánia által működtetett karitatív segítségnyújtó pont, amely közvetlenül juttatja el a csomagokat szegény sorsú belvárosiaknak.'
  },
  {
    id: 'don-5',
    name: 'Oltalom Karitatív Egyesület Ételosztó Központ',
    organization: 'Egyéb',
    address: '1086 Budapest, Dankó utca 9.',
    phone: '+36 1 210 5400',
    hours: 'Hétköznap: 07:00 - 20:00, Hétvége: 09:00 - 18:00',
    acceptedItems: ['Zöldségek', 'Nagyüzemi élelmiszer-maradék', 'Kenyér', 'Készétel'],
    lat: 47.4880,
    lng: 19.0792,
    description: 'Hajléktalanellátó és szociális konyha. Bármilyen fogyasztásra alkalmas, akár friss ételt, péksüteményt nagy örömmel vesznek át közvetlen felhasználásra.'
  }
];

// Typical household leftover pre-configurations for easy user testing
const SYSTEM_LEFTOVERS = [
  { name: 'Szikkadt kenyér / kifli', emoji: '🍞' },
  { name: 'Megbarnult / túlérett banán', emoji: '🍌' },
  { name: 'Tejföl (lejárat közeli / bontott)', emoji: '🥛' },
  { name: 'Főtt rizs / tészta maradék', emoji: '🍚' },
  { name: 'Sárgarépa / fonnyadt zöldségek', emoji: '🥕' },
  { name: 'Sajtmaradékok (lehetőleg kissé száraz)', emoji: '🧀' },
  { name: 'Megmaradt főtt/sült csirkehús', emoji: '🍗' },
  { name: 'Magányos tojások (1-2 darab)', emoji: '🥚' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'offers' | 'donations' | 'ai-kitchen'>('dashboard');
  
  // GPS Location states
  const [userLat, setUserLat] = useState<number>(47.4979); // Default Deák Ferenc tér
  const [userLng, setUserLng] = useState<number>(19.0503);
  const [currentAddressLabel, setCurrentAddressLabel] = useState<string>('Budapest, Deák Ferenc tér (Központ)');
  const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Stats stored in localStorage or locally
  const [stats, setStats] = useState<UserStats>({
    totalSavingsHuf: 6300,
    totalCarbonSavedKg: 14.8,
    totalMealsSaved: 5,
    history: [
      {
        id: 'hist-1',
        date: '2026-06-08',
        itemName: 'Lefoglalt Sertéshús tálcás - Spar',
        savingsHuf: 1200,
        carbonSavedKg: 3.2,
        type: 'bolt'
      },
      {
        id: 'hist-2',
        date: '2026-06-09',
        itemName: 'Főtt rizs & Banán kenyér AI Mentő recept',
        savingsHuf: 2600,
        carbonSavedKg: 5.4,
        type: 'recept'
      },
      {
        id: 'hist-3',
        date: '2026-06-09',
        itemName: 'Konzerv adományozás - Magyar Vöröskereszt',
        savingsHuf: 2500,
        carbonSavedKg: 6.2,
        type: 'adomany'
      }
    ]
  });

  // State load from local Storage if exists
  useEffect(() => {
    const saved = localStorage.getItem('food_rescue_stats_v1');
    if (saved) {
      try {
        setStats(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved progressstats', e);
      }
    }
  }, []);

  const saveStats = (newStats: UserStats) => {
    setStats(newStats);
    localStorage.setItem('food_rescue_stats_v1', JSON.stringify(newStats));
  };

  const handleClearStats = () => {
    const fresh: UserStats = {
      totalSavingsHuf: 0,
      totalCarbonSavedKg: 0,
      totalMealsSaved: 0,
      history: []
    };
    saveStats(fresh);
    showToast('Statisztikák és előzmények sikeresen nullázva!', 'info');
  };

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' | 'warning' } | null>(null);
  const showToast = (message: string, type: 'success' | 'info' | 'error' | 'warning' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Offers Filters
  const [selectedChain, setSelectedChain] = useState<string>('Összes');
  const [selectedCategory, setSelectedCategory] = useState<string>('Összes');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [maxDistance, setMaxDistance] = useState<number>(10); // in km
  
  // Modal for reserving items
  const [selectedReservingOffer, setSelectedReservingOffer] = useState<StoreOffer | null>(null);
  const [reservationSuccessCode, setReservationSuccessCode] = useState<string>('');

  // Donation State
  const [donationSearchQuery, setDonationSearchQuery] = useState<string>('');
  const [selectedDonationPoint, setSelectedDonationPoint] = useState<DonationPoint | null>(null);
  const [donatedItemName, setDonatedItemName] = useState<string>('');
  const [donatedWeightKg, setDonatedWeightKg] = useState<number>(1);
  const [showDonationModal, setShowDonationModal] = useState<boolean>(false);

  // AI Kitchen States
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [customTextIngredients, setCustomTextIngredients] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null); // base64
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<AiAnalysisResult | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  
  // Simple predefined sample uploads to easily test without capturing
  const SAMPLES = [
    {
      title: 'Kevert zöldségek & megpuhult sajt',
      text: 'Egy fél fonnyadt sárgarépa, pár darab száraz Gouda sajt, egy kis fej hagyma és pici tejföl a pohár alján.',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23fef08a"/><text x="10" y="55" font-size="40">🥕🧀</text></svg>'
    },
    {
      title: 'Túlérett banánok & száraz kalács',
      text: '3 darab erősen megbarnult banán, egy negyed száraz karácsonyi kalács, pici tej.',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23fed7aa"/><text x="10" y="55" font-size="40">🍌🍞</text></svg>'
    },
    {
      title: 'Főtt főtt tészta & paradicsom konzerv',
      text: 'Megmaradt hideg orsótészta a hűtőben, egy bontott paradicsom sűrítmény, fél konzerv kukorica.',
      image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23fca5a5"/><text x="10" y="55" font-size="40">🍝🥫</text></svg>'
    }
  ];

  // distance calculator
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c * 10) / 10;
  };

  // Handle GPS location activation
  const askForGeolocation = () => {
    setLocationStatus('loading');
    if (!navigator.geolocation) {
      showToast('A böngészője nem támogatja a helymeghatározást.', 'error');
      setLocationStatus('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLat(position.coords.latitude);
        setUserLng(position.coords.longitude);
        setCurrentAddressLabel(`Saját GPS Koordináták (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`);
        setLocationStatus('success');
        showToast('Pozíció sikeresen lekérdezve GPS alapján!', 'success');
      },
      (error) => {
        console.warn('Geolocation error:', error);
        setLocationStatus('error');
        showToast('Nem sikerült hozzáférni a GPS-hez. Válasszon egy magyarországi hotspotot!', 'warning');
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  // handle preset selection
  const handlePresetLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const index = Number(e.target.value);
    if (!isNaN(index) && LOCATIONS_PRESETS[index]) {
      const preset = LOCATIONS_PRESETS[index];
      setUserLat(preset.lat);
      setUserLng(preset.lng);
      setCurrentAddressLabel(preset.name);
      setLocationStatus('idle');
      showToast(`Helyszín átállítva: ${preset.name}`, 'info');
    }
  };

  // Reserve Item Process
  const triggerReservationModal = (offer: StoreOffer) => {
    setSelectedReservingOffer(offer);
    const randCode = 'RES-' + Math.floor(1000 + Math.random() * 9000);
    setReservationSuccessCode(randCode);
  };

  const confirmReservation = () => {
    if (!selectedReservingOffer) return;
    
    // Add savings to state
    const savedHuf = selectedReservingOffer.originalPrice - selectedReservingOffer.discountedPrice;
    
    // Calculate realistic savings: e.g. for meat 4.2 kg CO₂ saved, bread 0.8 kg, dairy 1.8 kg, vegetables 0.6 kgCO2.
    let co2Factor = 1.2;
    if (selectedReservingOffer.category === 'Hús') co2Factor = 3.8;
    if (selectedReservingOffer.category === 'Tejtermék') co2Factor = 1.9;
    if (selectedReservingOffer.category === 'Zöldség-Gyümölcs') co2Factor = 0.6;
    if (selectedReservingOffer.category === 'Készétel') co2Factor = 2.4;

    const savedCo2 = co2Factor;

    const newHistoryItem = {
      id: 'hist-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      itemName: `Lekérve: ${selectedReservingOffer.productName} (${selectedReservingOffer.chain})`,
      savingsHuf: savedHuf,
      carbonSavedKg: savedCo2,
      type: 'bolt' as const
    };

    const updatedStats: UserStats = {
      totalSavingsHuf: stats.totalSavingsHuf + savedHuf,
      totalCarbonSavedKg: stats.totalCarbonSavedKg + savedCo2,
      totalMealsSaved: stats.totalMealsSaved + 1,
      history: [newHistoryItem, ...stats.history]
    };

    saveStats(updatedStats);
    showToast(`Foglalás sikeres! Kódja: ${reservationSuccessCode}. 1 adag megmentve!`, 'success');
    setSelectedReservingOffer(null);
  };

  // Log donation centers
  const handleLogDonationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDonationPoint || !donatedItemName.trim() || donatedWeightKg <= 0) {
      showToast('Kérjük töltsön ki minden mezőt megfelelően!', 'error');
      return;
    }

    // Average value for donation is calculated:
    // Est. value = 1100 HUF per kg. Est. CO2 reduction = 2.1kg per kg donated food.
    const calculatedValue = Math.round(donatedWeightKg * 1100);
    const calculatedCo2 = Math.round(donatedWeightKg * 2.1 * 10) / 10;

    const newHistoryItem = {
      id: 'hist-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      itemName: `Adomány: ${donatedItemName} (${donatedWeightKg}kg)`,
      savingsHuf: calculatedValue,
      carbonSavedKg: calculatedCo2,
      type: 'adomany' as const
    };

    const updatedStats: UserStats = {
      totalSavingsHuf: stats.totalSavingsHuf + calculatedValue,
      totalCarbonSavedKg: stats.totalCarbonSavedKg + calculatedCo2,
      totalMealsSaved: stats.totalMealsSaved + Math.max(1, Math.round(donatedWeightKg * 2)),
      history: [newHistoryItem, ...stats.history]
    };

    saveStats(updatedStats);
    showToast(`Adomány sikeresen rögzítve! Köszönjük önzetlenségét! ❤️`, 'success');
    setShowDonationModal(false);
    setDonatedItemName('');
    setDonatedWeightKg(1);
  };

  // Toggle selected ingredient
  const handleToggleIngredient = (name: string) => {
    if (selectedIngredients.includes(name)) {
      setSelectedIngredients(prev => prev.filter(i => i !== name));
    } else {
      setSelectedIngredients(prev => [...prev, name]);
    }
  };

  // Handle Image upload selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        showToast('A kiválasztott fájl túl nagy. Max 8MB megengedett.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        showToast('Fénykép sikeresen betöltve!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  // Select Sample Leftover Setup
  const handleSelectSample = (sample: typeof SAMPLES[0]) => {
    setUploadedImage(sample.image);
    setCustomTextIngredients(sample.text);
    setSelectedIngredients([]);
    showToast(`"Minta betöltve: ${sample.title}"`, 'info');
  };

  // Calls the server-side proxy route `/api/analyze-food` to utilize the Gemini client securely
  const handleAnalyzeWithGemini = async () => {
    if (selectedIngredients.length === 0 && !customTextIngredients.trim() && !uploadedImage) {
      showToast('Kérjük jelöljön be alapanyagokat, írja le őket, vagy töltsön fel fényképet!', 'warning');
      return;
    }

    setIsAiLoading(true);
    setAiError(null);
    setAiResult(null);

    const dataPayload = {
      image: uploadedImage,
      textInput: customTextIngredients,
      existingIngredients: selectedIngredients
    };

    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'A szerver hibát küldött vissza.');
      }

      const result: AiAnalysisResult = await response.json();
      setAiResult(result);
      showToast('AI Receptjavaslatok és Maradék-mentő terv sikeresen elkészült!', 'success');
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || 'Sikertelen kapcsolódás az AI-hoz. Kérjük próbálja újra később.');
      showToast('Nem sikerült lekérni a recepteket a Gemini AI-tól.', 'error');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Confirm cooking of an AI suggestion recipe
  const handleCookRecipe = (recipeTitle: string, savHuf: number, carbKg: number) => {
    const newHistoryItem = {
      id: 'hist-' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      itemName: `Elkészült: ${recipeTitle} (AI recept)`,
      savingsHuf: savHuf,
      carbonSavedKg: carbKg,
      type: 'recept' as const
    };

    const updatedStats: UserStats = {
      totalSavingsHuf: stats.totalSavingsHuf + savHuf,
      totalCarbonSavedKg: stats.totalCarbonSavedKg + carbKg,
      totalMealsSaved: stats.totalMealsSaved + 2,
      history: [newHistoryItem, ...stats.history]
    };

    saveStats(updatedStats);
    showToast(`Jó étvágyat! Megmentett és megspórolt: ${savHuf} Ft, illetve megelőzött ${carbKg} kg CO₂-t!`, 'success');
  };

  // Calculate coordinates for the offers and filter appropriately
  const filteredOffers = INITIAL_OFFERS.filter(offer => {
    const dist = calculateDistance(userLat, userLng, offer.lat, offer.lng);
    const matchesChain = selectedChain === 'Összes' || offer.chain === selectedChain;
    const matchesCategory = selectedCategory === 'Összes' || offer.category === selectedCategory;
    const matchesQuery = searchQuery.trim() === '' || 
      offer.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.storeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDistance = dist <= maxDistance;

    return matchesChain && matchesCategory && matchesQuery && matchesDistance;
  }).sort((a, b) => {
    const distA = calculateDistance(userLat, userLng, a.lat, a.lng);
    const distB = calculateDistance(userLat, userLng, b.lat, b.lng);
    return distA - distB; // Show closest first
  });

  const filteredDonations = INITIAL_DONATION_POINTS.filter(point => {
    const matchesQuery = donationSearchQuery.trim() === '' || 
      point.name.toLowerCase().includes(donationSearchQuery.toLowerCase()) ||
      point.address.toLowerCase().includes(donationSearchQuery.toLowerCase()) ||
      point.acceptedItems.some(i => i.toLowerCase().includes(donationSearchQuery.toLowerCase()));
    return matchesQuery;
  }).sort((a, b) => {
    const distA = calculateDistance(userLat, userLng, a.lat, a.lng);
    const distB = calculateDistance(userLat, userLng, b.lat, b.lng);
    return distA - distB; // Show closest first
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-lg border text-sm font-semibold flex items-center space-x-3 max-w-md ${
              toast.type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' :
              toast.type === 'error' ? 'bg-rose-600 border-rose-500 text-white' :
              toast.type === 'warning' ? 'bg-amber-500 border-amber-400 text-white' :
              'bg-slate-900 border-slate-800 text-white'
            }`}
          >
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="hover:opacity-80 p-0.5">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Aesthetic Top Navigation Bar Area */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Elegant Branding Logo */}
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-xs">
                <Leaf className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 id="app-title" className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                  Élelmiszer-Mentő <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-mono">AI ASSIST</span>
                </h1>
                <p className="text-[10px] text-slate-500 font-medium tracking-wide">Pazarlás-mentes Intelligens Magyar Háztartás</p>
              </div>
            </div>

            {/* Simulated Live GPS Location Pill */}
            <div className="hidden md:flex items-center bg-slate-50 border border-slate-150 px-3 py-1.5 rounded-xl space-x-2">
              <MapPin className="w-4 h-4 text-emerald-600 animate-bounce" />
              <div className="text-left">
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Aktuális Pozíció</p>
                <p className="text-xs font-semibold text-slate-700 truncate max-w-[200px]">{currentAddressLabel}</p>
              </div>
              <button 
                onClick={askForGeolocation}
                className="ml-2 p-1 bg-white hover:bg-slate-100 rounded-md border border-slate-200 text-[10px] font-bold text-emerald-700 cursor-pointer active:scale-95 transition-all"
                title="Saját GPS lekérése"
              >
                {locationStatus === 'loading' ? 'Keresés...' : (locationStatus === 'success' ? 'GPS OK' : 'GPS lekérés')}
              </button>
            </div>

            {/* Quick Action Navigation links */}
            <nav className="flex space-x-1 p-1 bg-slate-100 rounded-xl">
              {[
                { id: 'dashboard', label: 'Irányítópult', icon: ChefHat },
                { id: 'offers', label: 'Közeli Akciók', icon: ShoppingBag },
                { id: 'donations', label: 'Adománypontok', icon: Heart },
                { id: 'ai-kitchen', label: 'AI Ételmentő', icon: Sparkles }
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected 
                        ? 'bg-white text-emerald-700 shadow-xs font-bold' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </nav>

          </div>
        </div>
      </header>

      {/* Sub-header controls for mobile map view / coordinate tweaks */}
      <section className="bg-emerald-950 text-emerald-100 py-3.5 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-md font-bold uppercase text-[9px] tracking-widest">Helyszín szimulátor</span>
            <p className="text-slate-300">Cserélje a helyzetét bármikor, hogy lássa a közeli boltok vagy adománypontok távolságait:</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              onChange={handlePresetLocationChange}
              className="bg-emerald-900/80 border border-emerald-700 rounded-lg py-1 px-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-400 font-medium select-none w-full md:w-60"
            >
              <option value="">-- Válasszon hotspotot a térképen --</option>
              {LOCATIONS_PRESETS.map((loc, i) => (
                <option key={i} value={i}>
                  {loc.name}
                </option>
              ))}
            </select>

            <button 
              onClick={askForGeolocation}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-all text-[11px] whitespace-nowrap cursor-pointer"
            >
              Helyzetem (GPS)
            </button>
          </div>
        </div>
      </section>

      {/* Primary Workspace container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Irányítópult & Impact (Dashboard view) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Encouraging motivational speech on hotel foods */}
            <div className="bg-white border-l-4 border-amber-500 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start gap-4">
              <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-base">Útitárs a pazarmentes nyaralások és mindennapok felé</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Gyakran tapasztaljuk szállodák, all-inclusive hotelek éttermeiben és a családi asztalnál is, hogy túl sok étel kerül a tányérokra és végül a kukában landol. Az <strong className="text-slate-950">Élelmiszer-Mentő AI</strong> célja, hogy tudatosságot hozzon az életünkbe. Mentse meg a közeli boltok kidobás előtt álló prémium élelmiszereit féláron, adományozzon könnyen a rászorulóknak, és alakítsa át otthoni maradékait Michelin-szintű AI fogásokká!
                </p>
                <div className="flex items-center gap-4 text-[11px] font-semibold text-emerald-800">
                  <span className="flex items-center gap-1">🌿 Súlyos CO₂ megtakarítás</span>
                  <span className="flex items-center gap-1">💰 Forintra váltható tudatosság</span>
                </div>
              </div>
            </div>

            <Dashboard stats={stats} onClearStats={handleClearStats} />
          </div>
        )}

        {/* Mid-Merchant connection to Consumer (Store discount offers view) */}
        {activeTab === 'offers' && (
          <div className="space-y-6">
            
            {/* Introduction and Search card banner */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-emerald-600" />
                    Kidobás előtti Akciók Kereskedőknél (Lidl, Tesco, Spar, Aldi, stb.)
                  </h3>
                  <p className="text-xs text-slate-500">
                    A lejárathoz közeli termékek azonnali megvásárlása óriási discounts-szal. Helyzetéhez mérten a legközelebbi fiókok ajánlatait mutatjuk!
                  </p>
                </div>
                <div className="bg-emerald-50 text-emerald-800 font-bold text-xs py-1.5 px-3 rounded-full flex items-center gap-1">
                  <span>Aktív körzet: {maxDistance} km</span>
                </div>
              </div>

              {/* Advanced multi-filter segment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                
                {/* Search query input */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Keresés termék vagy bolt alapján..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-3 pl-9 py-2.5 text-xs focus:outline-emerald-500"
                  />
                </div>

                {/* Chain filter */}
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                  <select 
                    value={selectedChain}
                    onChange={(e) => setSelectedChain(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-3 pl-9 py-2.5 text-xs focus:outline-emerald-500 accent-emerald-500 appearance-none"
                  >
                    <option value="Összes">Minden Kereskedő (Összes)</option>
                    <option value="Lidl">Lidl</option>
                    <option value="Tesco">Tesco</option>
                    <option value="Penny">Penny</option>
                    <option value="Spar">Spar</option>
                    <option value="Aldi">Aldi</option>
                    <option value="Auchan">Auchan</option>
                    <option value="Metro">Metro</option>
                  </select>
                </div>

                {/* Category selector */}
                <div className="relative">
                  <Filter className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-3 pl-9 py-2.5 text-xs focus:outline-emerald-500 accent-emerald-500 appearance-none"
                  >
                    <option value="Összes">Minden Élelmiszer kategória</option>
                    <option value="Tejtermék">Tejtermékek</option>
                    <option value="Pékáru">Pékáruk & Kenyerek</option>
                    <option value="Hús">Húsfélék & Halak</option>
                    <option value="Zöldség-Gyümölcs">Zöldség & Gyümölcs</option>
                    <option value="Készétel">Készételek</option>
                    <option value="Egyéb">Egyéb</option>
                  </select>
                </div>

                {/* Maximum Distance range selector */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-col justify-center">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                    <span>Maximális távolság:</span>
                    <span className="text-emerald-700 font-mono font-bold">{maxDistance} km</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="50" 
                    value={maxDistance} 
                    onChange={(e) => setMaxDistance(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

              </div>
            </div>

            {/* Simulated Live SVG Map Grid for Visual Aesthetics and pinpoint GPS alignment */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <Map className="w-4 h-4 text-emerald-600" />
                    Interaktív GPS Lokációs Térkép
                  </h4>
                  <p className="text-[10px] text-slate-400">Az akciók és adománygyűjtő helyek elhelyezkedése a közelében.</p>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Saját koordináta: {userLat.toFixed(3)}N, {userLng.toFixed(3)}E
                </div>
              </div>

              {/* Custom Map Visual representation */}
              <div className="relative h-64 bg-slate-900 rounded-xl overflow-hidden border border-slate-800/80 shadow-inner flex items-center justify-center">
                
                {/* Simulated Radar Wave */}
                <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(16,185,129,0.065)_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                
                {/* SVG radar lines scanning */}
                <svg className="absolute inset-0 w-full h-full">
                  <circle cx="50%" cy="50%" r="50" fill="none" stroke="#059669" strokeWidth="1" strokeDasharray="4 4" className="opacity-30" />
                  <circle cx="50%" cy="50%" r="100" fill="none" stroke="#059669" strokeWidth="1" strokeDasharray="6 6" className="opacity-20" />
                  <circle cx="50%" cy="50%" r="180" fill="none" stroke="#059669" strokeWidth="1" strokeDasharray="8 8" className="opacity-10" />
                </svg>

                {/* User Pin Indicator (Center) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                  <div className="w-5 h-5 bg-emerald-500 text-slate-950 font-bold rounded-full scale-110 flex items-center justify-center shadow-lg animate-bounce border-2 border-white text-[10px]">📍</div>
                  <span className="bg-emerald-900 border border-emerald-500 px-2 py-0.5 rounded-md text-[9px] font-bold text-white whitespace-nowrap mt-1 uppercase tracking-wider">Én (GPS)</span>
                </div>

                {/* Nearby store offer markers calculated relative to center */}
                {filteredOffers.slice(0, 10).map((off, i) => {
                  const dx = (off.lng - userLng) * 2000; // factor out for scale
                  const dy = (userLat - off.lat) * 2000;
                  
                  // clamp to bounds
                  const left = Math.min(90, Math.max(10, 50 + dx));
                  const top = Math.min(85, Math.max(15, 50 + dy));
                  
                  return (
                    <button
                      key={off.id}
                      onClick={() => triggerReservationModal(off)}
                      style={{ left: `${left}%`, top: `${top}%` }}
                      className="absolute group z-10 p-1 rounded-lg bg-emerald-950/90 hover:bg-emerald-800 border border-emerald-500 shadow-md text-white flex items-center space-x-1 hover:scale-105 transition-all text-[9.5px]"
                    >
                      <span>{off.imageUrl}</span>
                      <strong className="font-semibold">{off.chain}</strong>
                      <span className="text-[8px] bg-emerald-500 text-slate-950 px-1 rounded-sm">
                        {calculateDistance(userLat, userLng, off.lat, off.lng)}km
                      </span>
                    </button>
                  );
                })}

                {/* Information badge on distance calculation */}
                <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-750 p-2 rounded-lg text-[10px] text-slate-300">
                  <p className="font-semibold text-emerald-400">Térkép Jelmagyarázat:</p>
                  <p className="mt-0.5 text-slate-400">A pontok a valós GPS koordinátáik alapján helyezkednek el Önhöz képest.</p>
                </div>
              </div>
            </div>

            {/* Store Listing Cards */}
            {filteredOffers.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 p-8 space-y-3">
                <span className="text-4xl">🔍</span>
                <p className="text-sm font-semibold text-slate-600">Sajnos nincs a keresésnek megfelelő akciós ajánlat a megadott távolságon belül.</p>
                <p className="text-xs text-slate-400">Próbálja növelni a távolságot vagy állítsa át a Helyszín szimulátort egy másik magyar városra!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOffers.map((offer) => {
                  const dist = calculateDistance(userLat, userLng, offer.lat, offer.lng);
                  const savedPercent = Math.round(((offer.originalPrice - offer.discountedPrice) / offer.originalPrice) * 100);
                  
                  return (
                    <motion.div
                      key={offer.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white border border-slate-150 p-5 rounded-2xl flex flex-col justify-between shadow-xs hover:shadow-md hover:border-emerald-200 transition-all group scale-100 active:scale-[0.99]"
                    >
                      {/* Badge Chain and Expiry info */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                            offer.chain === 'Lidl' ? 'bg-blue-600 text-white' :
                            offer.chain === 'Spar' ? 'bg-red-600 text-white' :
                            offer.chain === 'Tesco' ? 'bg-blue-800 text-white' :
                            offer.chain === 'Aldi' ? 'bg-indigo-900 text-white' :
                            offer.chain === 'Penny' ? 'bg-red-700 text-white' :
                            'bg-slate-800 text-white'
                          }`}>
                            {offer.chain}
                          </span>
                          
                          <span className="text-xs font-bold text-slate-500 font-mono flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                            {offer.expiryText}
                          </span>
                        </div>

                        {/* Store Offer product title */}
                        <div>
                          <div className="flex items-start gap-2.5">
                            <span className="text-2xl mt-1">{offer.imageUrl || '🥗'}</span>
                            <div>
                              <h4 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{offer.productName}</h4>
                              <p className="text-xs text-slate-500 mt-1 font-medium">{offer.storeName}</p>
                            </div>
                          </div>
                        </div>

                        {/* Distance information */}
                        <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg w-fit">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{dist} km távolságra Öntől</span>
                        </div>
                      </div>

                      {/* Pricing and reservation button */}
                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="text-left space-y-0.5">
                          <span className="text-xs line-through text-slate-400 font-mono">{offer.originalPrice} Ft</span>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xl font-bold text-slate-950 font-mono tracking-tight">{offer.discountedPrice} Ft</span>
                            <span className="text-[10px] text-rose-500 font-extrabold bg-rose-55 py-0.5 px-1.5 rounded-md">-{savedPercent}%</span>
                          </div>
                        </div>

                        <button
                          onClick={() => triggerReservationModal(offer)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                        >
                          Lefoglalás & Mentés
                        </button>
                      </div>

                    </motion.div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* Nearby donation points list / "Közeli adományozási pontozás" */}
        {activeTab === 'donations' && (
          <div className="space-y-6">
            
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-500" />
                    Közeli Élelmiszer-Adományozási Pontok
                  </h3>
                  <p className="text-xs text-slate-500">
                    Keresse meg a legközelebbi leadópontokat, szeretetládákat vagy alapítványokat, ahol a bontatlan vagy többlet élelmét rászorulóknak ajánlhatja fel!
                  </p>
                </div>
                
                {/* Search in donations */}
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Keressen szervezet vagy cím alapján..."
                    value={donationSearchQuery}
                    onChange={(e) => setDonationSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pr-3 pl-9 py-2 text-xs focus:outline-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Donation Points List */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Coordinates sorted Points cards */}
              <div className="lg:col-span-2 space-y-4 max-h-[580px] overflow-y-auto pr-1">
                {filteredDonations.length === 0 ? (
                  <div className="text-center py-10 bg-white rounded-2xl border border-slate-150 p-6">
                    <p className="text-xs text-slate-500">Nincs a szűrésnek megfelelő adományozási pont.</p>
                  </div>
                ) : (
                  filteredDonations.map((point) => {
                    const distCheck = calculateDistance(userLat, userLng, point.lat, point.lng);
                    const isSelected = selectedDonationPoint?.id === point.id;
                    
                    return (
                      <div
                        key={point.id}
                        onClick={() => setSelectedDonationPoint(point)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer text-xs space-y-3 ${
                          isSelected 
                            ? 'bg-rose-50/50 border-rose-300 shadow-sm' 
                            : 'bg-white border-slate-150 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold tracking-wide rounded-md text-[9px] uppercase">
                              {point.organization}
                            </span>
                            <h4 className="font-extrabold text-slate-900 mt-1 text-sm">{point.name}</h4>
                          </div>
                          
                          <div className="text-right">
                            <span className="text-[11px] font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                              {distCheck} km távolság
                            </span>
                          </div>
                        </div>

                        <p className="text-slate-600 leading-relaxed text-xs">{point.description}</p>
                        
                        <div className="flex flex-wrap gap-1 items-center">
                          <span className="text-[10px] text-slate-400 font-bold">Elfogadott ételek:</span>
                          {point.acceptedItems.slice(0, 4).map((i, idx) => (
                            <span key={idx} className="bg-slate-50 border border-slate-200 text-slate-600 text-[10px] px-1.5 py-0.5 rounded-md">
                              {i}
                            </span>
                          ))}
                          {point.acceptedItems.length > 4 && <span>...</span>}
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                          <span className="truncate">📍 {point.address}</span>
                          <span className="font-extrabold text-rose-700 hover:underline">Részletek megosztása &gt;</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Right Column: Donation point details & Logging action */}
              <div className="bg-white border border-slate-150 p-6 rounded-2xl shadow-xs space-y-4 min-h-[400px]">
                {selectedDonationPoint ? (
                  <div className="space-y-4">
                    <div className="pb-3 border-b border-rose-100">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-rose-600">Kiválasztott átvevő</span>
                      <h4 className="text-base font-bold text-slate-900 mt-0.5">{selectedDonationPoint.name}</h4>
                      <p className="text-xs text-slate-500 mt-1">Szervezet: {selectedDonationPoint.organization}</p>
                    </div>

                    <div className="space-y-2.5 text-xs text-slate-600">
                      <div>
                        <strong className="text-slate-800 font-bold">📍 Pontos Cím:</strong>
                        <p className="text-slate-500 mt-0.5 font-medium">{selectedDonationPoint.address}</p>
                      </div>
                      <div>
                        <strong className="text-slate-800 font-bold">📞 Kapcsolati Telefon:</strong>
                        <p className="text-slate-500 mt-0.5 font-mono">{selectedDonationPoint.phone}</p>
                      </div>
                      <div>
                        <strong className="text-slate-800 font-bold">⏰ Nyitvatartás:</strong>
                        <p className="text-slate-500 mt-0.5">{selectedDonationPoint.hours}</p>
                      </div>
                      <div>
                        <strong className="text-slate-800 font-bold">📋 Összes elfogadott alapanyag:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedDonationPoint.acceptedItems.map((item, id) => (
                            <span key={id} className="bg-rose-50 text-rose-800 text-[10px] px-2 py-0.5 rounded-md border border-rose-100">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Simulation logger button to add stats */}
                    <div className="pt-4 border-t border-slate-100 space-y-2">
                      <div className="bg-rose-50/50 p-3 rounded-xl text-center text-xs text-rose-900 leading-snug">
                        Ide vitt felesleg élelmiszert? Rögzítse adományát statisztikáiban!
                      </div>
                      <button
                        onClick={() => setShowDonationModal(true)}
                        className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        Adományozási aktus rögzítése
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
                    <span className="text-4xl text-rose-200">❤️</span>
                    <h5 className="font-bold text-slate-700">Válasszon ki egy Pontot a listából</h5>
                    <p className="text-xs leading-relaxed max-w-[240px]">
                      A részletes adatok megtekintéséhez és az adományozás rögzítéséhez kattintson a bal oldali pontok egyikére.
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* AI Leftovers Meal Planner ("AI Ételmentő Fénykép feltöltés és AI receptek") */}
        {activeTab === 'ai-kitchen' && (
          <div className="space-y-6">
            
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
                    AI Ételmentő Konyha (Residual Food Recycler)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Töltsön fel egy fényképet az otthoni hűtő tartalmáról vagy a polcon lévő maradékokról, és a Gemini AI azonnal összeállít egy heti recepttervet részletes elkészítési útmutatókkal!
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Form Input options (Left column) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Visual Capture & Upload block */}
                <div className="bg-white p-5 rounded-2xl border border-slate-150 space-y-4">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Étel/Alapanyag Fénykép feltöltése
                  </label>

                  <div className="relative border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-xl p-6 transition-all flex flex-col items-center justify-center text-center bg-slate-50/50 group h-44">
                    {uploadedImage ? (
                      <div className="absolute inset-0 p-2 flex items-center justify-center bg-white rounded-xl">
                        {uploadedImage.startsWith('data:image/svg+xml') ? (
                          <div className="w-full h-full bg-emerald-50 rounded-lg flex items-center justify-center text-3xl">
                            🥕🍞🥚
                          </div>
                        ) : (
                          <img 
                            src={uploadedImage} 
                            alt="Feltöltött élelem" 
                            className="w-full h-full object-contain rounded-lg"
                          />
                        )}
                        <button
                          onClick={() => setUploadedImage(null)}
                          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-md"
                          title="Fénykép eltávolítása"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2 cursor-pointer">
                        <Upload className="w-10 h-10 text-slate-400 mx-auto group-hover:text-emerald-500 group-hover:scale-110 transition-all" />
                        <div className="text-xs text-slate-600 font-semibold">
                          <span>Klikkeljen a feltöltéshez</span> vagy dobi be a képet
                        </div>
                        <p className="text-[10px] text-slate-400">PNG, JPG formátumok (max 8MB)</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>

                  {/* Predefined samples to help user run and test the AI immediately */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">
                      Nincs kéznél fotó? Válasszon egy gyors tesztmintát:
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {SAMPLES.map((sample, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectSample(sample)}
                          className="p-2 bg-slate-50 hover:bg-emerald-50 text-left rounded-lg text-xs border border-slate-200 hover:border-emerald-350 transition-all flex items-center justify-between"
                        >
                          <span className="font-semibold text-slate-700 truncate">{sample.title}</span>
                          <span className="text-slate-400 font-bold font-mono text-[10px]">minta &gt;</span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Checklist of typical household leftovers */}
                <div className="bg-white p-5 rounded-2xl border border-slate-150 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Otthoni Alapanyagok gyorslistája
                    </label>
                    {selectedIngredients.length > 0 && (
                      <button 
                        onClick={() => setSelectedIngredients([])} 
                        className="text-[10px] text-red-500 hover:underline"
                      >
                        Összes törlése
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {SYSTEM_LEFTOVERS.map((item, idx) => {
                      const isChecked = selectedIngredients.includes(item.name);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleToggleIngredient(item.name)}
                          className={`p-2 rounded-xl text-left font-medium text-xs flex items-center space-x-2 border transition-all ${
                            isChecked 
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold' 
                              : 'bg-slate-50/50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <span>{item.emoji}</span>
                          <span className="truncate">{item.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Free description text container */}
                <div className="bg-white p-5 rounded-2xl border border-slate-150 space-y-3">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Leírás vagy további felesleg alapanyagok
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Írja le mi van még otthon a hűtő alján, pl. fél üveg tejföl, kinyitott mustár, fonnyadó hagyma..."
                    value={customTextIngredients}
                    onChange={(e) => setCustomTextIngredients(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-emerald-500 text-slate-700"
                  />
                </div>

                {/* Action request Trigger button */}
                <button
                  onClick={handleAnalyzeWithGemini}
                  disabled={isAiLoading}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm tracking-wide text-white shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                    isAiLoading 
                      ? 'bg-emerald-700/60 cursor-not-allowed' 
                      : 'bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98]'
                  }`}
                >
                  {isAiLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                      <span>Gastro AI elemzés folyamatban... (Kérjük várjon)</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-yellow-350 animate-bounce" />
                      <span>Kreatív Ételmentő-terv és Receptek Generálása</span>
                    </>
                  )}
                </button>

              </div>

              {/* AI Results Output panel */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-150 p-6 shadow-xs min-h-[450px]">
                {isAiLoading ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20">
                    <div className="p-4 bg-emerald-50 text-emerald-800 rounded-full animate-pulse">
                      <Sparkles className="w-12 h-12" />
                    </div>
                    <div className="space-y-1 max-w-sm">
                      <h4 className="font-bold text-slate-800">A Gemini AI elemzi az alapanyagokat!</h4>
                      <p className="text-xs text-slate-400">
                        Megvizsgáljuk a gombákat, lejáró tejtermékeket és zöldségeket, hogy ínycsiklandozó, szinte 0-hulladékkal rendelkező recepteket alkossunk. Ez pár másodpercet igénybe vehet.
                      </p>
                    </div>
                  </div>
                ) : aiError ? (
                  <div className="p-5 bg-rose-50 border border-rose-200 rounded-xl space-y-3 text-rose-950">
                    <h5 className="font-bold text-sm flex items-center gap-1.5 text-rose-800">
                      <AlertTriangle className="w-4.5 h-4.5" />
                      Hiba történt az AI generáláskor
                    </h5>
                    <p className="text-xs">{aiError}</p>
                    <p className="text-[11px] text-rose-700">Tipp: Ellenőrizze, hogy a GEMINI_API_KEY helyesen be van-e állítva az AI Studio Secret beállításaiban.</p>
                  </div>
                ) : aiResult ? (
                  <div className="space-y-6">
                    
                    {/* Detected items and instant overview */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-emerald-700">Gazdasági és Környezeti hatás</span>
                        <h4 className="text-sm font-extrabold text-slate-900">Köszönjük a tudatos ételmentést!</h4>
                      </div>
                      <div className="flex gap-4 text-center">
                        <div className="bg-white py-1.5 px-3.5 rounded-lg border border-emerald-100">
                          <span className="text-[9px] text-slate-400 font-bold block">Spórolás</span>
                          <span className="font-mono text-sm font-bold text-emerald-600">{aiResult.savingsHuf} Ft</span>
                        </div>
                        <div className="bg-white py-1.5 px-3.5 rounded-lg border border-emerald-100">
                          <span className="text-[9px] text-slate-400 font-bold block">CO₂ megspórolva</span>
                          <span className="font-mono text-sm font-bold text-teal-600">{aiResult.carbonSavedKg || 2.2} kg</span>
                        </div>
                      </div>
                    </div>

                    {/* Leftovers detected by AI checklist */}
                    <div className="space-y-2">
                      <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide">
                        Azonosított / felhasznált alapanyagok:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {aiResult.detectedItems?.map((item, id) => (
                          <span key={id} className="bg-slate-50 border border-slate-200 text-slate-700 py-1 px-2.5 rounded-lg text-xs flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <strong className="font-extrabold text-slate-900">{item.name}</strong>
                            {item.quantityRating && <span className="opacity-80">({item.quantityRating})</span>}
                            {item.condition && <span className="text-[10px] text-slate-400 font-bold"> - {item.condition}</span>}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Tabular Meal plan */}
                    <div className="space-y-2">
                      <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-emerald-600" />
                        Javasolt heti étkezési és mentő terv:
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {aiResult.mealPlan?.map((plan, id) => (
                          <div key={id} className="bg-slate-50 p-3 rounded-xl border border-slate-150 flex flex-col justify-between">
                            <div>
                              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 py-0.5 px-1.5 rounded-md uppercase tracking-wider">{plan.mealName}</span>
                              <h5 className="font-bold text-slate-900 mt-1 text-xs">{plan.recipeTitle}</h5>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1.5 italic leading-snug">{plan.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Detailed recipes generated */}
                    <div className="space-y-4 pt-2 border-t border-slate-100">
                      <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wide flex items-center gap-1">
                        <ChefHat className="w-4 h-4 text-slate-600" />
                        Részletes lépésről-lépésre receptek:
                      </h4>
                      <div className="space-y-6">
                        {aiResult.recipes?.map((recipe, idx) => (
                          <div key={idx} className="bg-slate-50/50 p-5 rounded-2xl border border-slate-200 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/65 pb-3">
                              <div>
                                <h5 className="font-extrabold text-slate-900 text-sm">{recipe.title}</h5>
                                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-bold mt-1">
                                  <span>🕒 Elkészítés: {recipe.prepTime}</span>
                                  <span>📊 Nehézség: {recipe.difficulty}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => handleCookRecipe(recipe.title, aiResult.savingsHuf, aiResult.carbonSavedKg || 2.4)}
                                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Megfőztem és megmentettem!
                              </button>
                            </div>

                            {/* Ingredient components */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                              <div className="bg-white p-3 rounded-xl border border-slate-150 space-y-1">
                                <strong className="text-emerald-800 font-bold">Megmentett felesleg:</strong>
                                <ul className="list-disc list-inside text-slate-600 pl-1 space-y-0.5">
                                  {recipe.ingredientsUsed?.map((ing, i) => (
                                    <li key={i}>{ing}</li>
                                  ))}
                                </ul>
                              </div>

                              {recipe.otherNeeded && recipe.otherNeeded.length > 0 && (
                                <div className="bg-white p-3 rounded-xl border border-slate-150 space-y-1">
                                  <strong className="text-slate-700 font-bold">Szükséges alapvető otthoni hozzávalók:</strong>
                                  <ul className="list-disc list-inside text-slate-600 pl-1 space-y-0.5">
                                    {recipe.otherNeeded.map((ing, i) => (
                                      <li key={i}>{ing}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>

                            {/* Cooking steps checklist */}
                            <div className="space-y-2 text-xs">
                              <strong className="text-slate-800 font-bold block">Elkészítési útmutató:</strong>
                              <ol className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-150">
                                {recipe.steps?.map((step, i) => (
                                  <li key={i} className="flex items-start gap-2.5">
                                    <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0 mt-0.5">{i + 1}</span>
                                    <p className="text-slate-600 leading-relaxed">{step}</p>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Practical storage tips */}
                    {aiResult.practicalTips && aiResult.practicalTips.length > 0 && (
                      <div className="bg-emerald-50/70 border border-emerald-100 p-4 rounded-xl space-y-2 mt-4 text-xs">
                        <h4 className="font-black text-emerald-900 flex items-center gap-1 text-xs uppercase tracking-wider">
                          💡 GASZTRO-MENTOR AI TÁROLÁSI TIPPEK:
                        </h4>
                        <ul className="list-disc list-inside text-emerald-850 pl-1 space-y-1">
                          {aiResult.practicalTips.map((tip, idx) => (
                            <li key={idx} className="leading-relaxed">{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-4 py-20">
                    <span className="text-5xl">🍳</span>
                    <h5 className="font-bold text-slate-700">Várjuk az Ön alapanyagait és fotóit!</h5>
                    <p id="ai-kitchen-guide-text" className="text-xs leading-relaxed max-w-sm text-slate-500 font-medium">
                      Kattintson az alapanyagokra a bal oldalon, írja le a hűtőben található megmaradt ételek összetevőit, vagy töltsön fel egy képet az AI elemzéshez.
                    </p>
                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl inline-flex items-center gap-2 text-left text-[11px] text-amber-900 max-w-xs leading-snug">
                      <span className="text-lg">🛎️</span>
                      <strong>Tipp:</strong> Bármikor használhatja a bal oldali gyors tesztmintákat az AI azonnali kipróbálásához fotó hiányában!
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Footer credits and information */}
      <footer className="bg-slate-900 text-slate-350 border-t border-slate-800 py-8 px-4 text-xs mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <div className="space-y-1 text-center sm:text-left">
            <p id="footer-app-title" className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-emerald-400 tracking-widest uppercase text-[10.5px]">Élelmiszer-pazarlás csökkentő AI alkalmazás</p>
            <p className="text-[11px] text-slate-500">Minden jog fenntartva © 2026. Mentsük meg az ételt közösen!</p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-[11px] text-emerald-400">
            <span className="flex items-center gap-1">🌏 Magyarország GPS adatbázis</span>
            <span className="flex items-center gap-1 font-mono">UTC: 2026-06-10</span>
          </div>
        </div>
      </footer>

      {/* RESERVATION CONFIRMATION MODAL */}
      <AnimatePresence>
        {selectedReservingOffer && (
          <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-100 p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-extrabold text-slate-900 text-base">Foglalás megerősítése</h4>
                <button 
                  onClick={() => setSelectedReservingOffer(null)} 
                  className="p-1 hover:bg-slate-100 rounded-full"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="space-y-3.5 text-xs text-slate-600">
                <div className="p-3 bg-emerald-50 rounded-xl text-center">
                  <span className="text-[10px] uppercase font-bold text-emerald-800">Foglalja le a boltban leértékelve</span>
                  <div className="font-black text-emerald-950 text-base mt-0.5">{selectedReservingOffer.productName}</div>
                  <p className="text-[11px] text-emerald-700/80 font-semibold">{selectedReservingOffer.storeName}</p>
                </div>

                <div className="bg-slate-50 rounded-xl p-3.5 space-y-2 border border-slate-150">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Eredeti ár:</span>
                    <span className="line-through text-slate-400">{selectedReservingOffer.originalPrice} Ft</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-800 text-sm">
                    <span>Mentő akciós ár:</span>
                    <span className="text-emerald-600 font-mono text-base">{selectedReservingOffer.discountedPrice} Ft</span>
                  </div>
                  <div className="flex justify-between font-bold text-rose-600 text-[11px] pt-1 border-t border-slate-200">
                    <span>Megtakarított konyhapénz:</span>
                    <span>{selectedReservingOffer.originalPrice - selectedReservingOffer.discountedPrice} Ft</span>
                  </div>
                </div>

                <div className="space-y-1 bg-yellow-50/60 p-3 rounded-xl border border-yellow-100/60 text-[11px] text-yellow-900">
                  <p className="font-extrabold flex items-center gap-1">
                    <QrCode className="w-3.5 h-3.5 text-yellow-700" />
                    Hogyan veheti át?
                  </p>
                  <p className="leading-snug">Mutassa be az alábbi kódot a fenti bolt vevőszolgálatán vagy pénztáránál a fizetéskor:</p>
                  <p className="font-mono text-center text-sm font-black text-slate-900 tracking-widest py-1 bg-white border border-yellow-200 rounded-lg mt-1.5 uppercase">
                    {reservationSuccessCode}
                  </p>
                </div>
              </div>

              <div className="flex space-x-3 pt-3 border-t border-slate-100 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setSelectedReservingOffer(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all cursor-pointer"
                >
                  Mégse
                </button>
                <button
                  type="button"
                  onClick={confirmReservation}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  Mentés rögzítése
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MANUAL DONATION RECORDING MODAL */}
      <AnimatePresence>
        {showDonationModal && selectedDonationPoint && (
          <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-100 p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="font-extrabold text-slate-900 text-base">Adományozás Rögzítése</h4>
                <button 
                  onClick={() => setShowDonationModal(false)} 
                  className="p-1 hover:bg-slate-100 rounded-full"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleLogDonationSubmit} className="space-y-4">
                <div className="p-3 bg-rose-50 text-rose-950 text-center rounded-xl text-xs font-medium">
                  Helyszín: <strong className="font-bold">{selectedDonationPoint.name}</strong>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="block text-slate-700 font-bold">Adományozott élelmiszer neve:</label>
                  <input
                    type="text"
                    required
                    placeholder="pl. 3 csomag spagetti tészta, konzerv bab"
                    value={donatedItemName}
                    onChange={(e) => setDonatedItemName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-emerald-500 text-slate-700 font-medium"
                  />
                </div>

                <div className="space-y-1 text-xs">
                  <label className="block text-slate-700 font-bold flex justify-between">
                    <span>Becsült súly kilogrammban:</span>
                    <span className="text-emerald-700 font-bold font-mono">{donatedWeightKg} kg</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="0.5"
                    value={donatedWeightKg}
                    onChange={(e) => setDonatedWeightKg(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono pt-1">
                    <span>1 kg</span>
                    <span>10 kg</span>
                    <span>20 kg</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50/70 border border-slate-200/60 rounded-xl space-y-1.5 text-[11px] text-slate-500 leading-snug">
                  <p className="font-bold text-slate-700">Előnye a környezetre és a kasszának:</p>
                  <p>• Megelőzött hulladékérték: ~<strong>{(donatedWeightKg * 1100).toLocaleString()} Ft</strong> hazai piaci alapon.</p>
                  <p>• Eltérített CO₂ kibocsátás: ~<strong>{(donatedWeightKg * 2.1).toFixed(1)} kg</strong> üvegházhatású gáz.</p>
                </div>

                <div className="flex space-x-3 pt-3 border-t border-slate-100 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setShowDonationModal(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all cursor-pointer"
                  >
                    Mégse
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-sm transition-all cursor-pointer"
                  >
                    Rögzítés és Mentés
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
