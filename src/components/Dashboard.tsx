import React, { useState } from 'react';
import { motion } from 'motion/react';
import { UserStats } from '../types';
import { 
  TrendingDown, 
  Coins, 
  Leaf, 
  Utensils, 
  History, 
  HelpCircle, 
  ChevronRight, 
  DollarSign,
  Car,
  Trees,
  CheckCircle2,
  Trash2
} from 'lucide-react';

interface DashboardProps {
  stats: UserStats;
  onClearStats: () => void;
}

export default function Dashboard({ stats, onClearStats }: DashboardProps) {
  // Household typical waste estimator state
  const [householdSize, setHouseholdSize] = useState<number>(3);
  const [wasteLevel, setWasteLevel] = useState<string>('közepes'); // 'alacsony', 'közepes', 'magas'
  const [showEstimatorResult, setShowEstimatorResult] = useState<boolean>(false);

  // Estimates based on Hungarian statistical data:
  // An average Hungarian throws away ~65kg of food per year, about 1/3 is avoidable (22kg).
  // This costs approx 25,000 Ft per person yearly.
  const calculateAnnualWaste = () => {
    let multiplier = 1.0;
    if (wasteLevel === 'alacsony') multiplier = 0.5;
    if (wasteLevel === 'magas') multiplier = 1.8;

    const baseKg = 25; // avoidable waste in kg per person
    const baseHuf = 28000; // in HUF per person

    const totalKg = Math.round(householdSize * baseKg * multiplier);
    const totalHuf = Math.round(householdSize * baseHuf * multiplier);
    const totalCo2 = Math.round(totalKg * 2.5 * 10) / 10; // 1kg waste is ~2.5kg CO2 average

    return { totalKg, totalHuf, totalCo2 };
  };

  const estimate = calculateAnnualWaste();

  // Dynamic calculations for real-world equivalents
  const drivingAvoidedKm = Math.round(stats.totalCarbonSavedKg * 8.4 * 10) / 10; // 1kg CO2 = ~8.4 km driving equivalent
  const treeAbsorptionDays = Math.round(stats.totalCarbonSavedKg * 17); // 1kg CO2 absorption is equivalent to ~17 trees absorbing for 1 day
  
  // Calculate savings jar height (max 100%)
  const jarFillPercentage = Math.min(100, Math.round((stats.totalSavingsHuf / 30000) * 100));

  return (
    <div className="space-y-6">
      {/* Prime Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Money Counter */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="bg-emerald-50/70 border border-emerald-100 p-6 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-sm hover:border-emerald-200 transition-all cursor-default"
        >
          <div className="space-y-1">
            <span className="text-sm font-medium text-emerald-800">Összes megtakarítás</span>
            <h3 className="text-3xl font-bold text-emerald-950 tracking-tight">
              {stats.totalSavingsHuf.toLocaleString()} <span className="text-lg font-semibold">Ft</span>
            </h3>
            <p className="text-xs text-emerald-700/80">Kasszában maradt összeg</p>
          </div>
          <div className="p-4 bg-emerald-100/80 text-emerald-700 rounded-xl">
            <Coins className="w-8 h-8" />
          </div>
        </motion.div>

        {/* Carbon Footprint Counter */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="bg-teal-50/70 border border-teal-100 p-6 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-sm hover:border-teal-200 transition-all cursor-default"
        >
          <div className="space-y-1">
            <span className="text-sm font-medium text-teal-800">Karbonlábnyom csökkenés</span>
            <h3 className="text-3xl font-bold text-teal-950 tracking-tight">
              {stats.totalCarbonSavedKg.toFixed(1)} <span className="text-xl font-semibold">kg</span>
            </h3>
            <p className="text-xs text-teal-700/80">Megelőzött üvegházhatású gázok</p>
          </div>
          <div className="p-4 bg-teal-100/80 text-teal-700 rounded-xl">
            <Leaf className="w-8 h-8" />
          </div>
        </motion.div>

        {/* Meals Saved Counter */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="bg-sky-50/70 border border-sky-100 p-6 rounded-2xl flex items-center justify-between shadow-xs hover:shadow-sm hover:border-sky-200 transition-all cursor-default"
        >
          <div className="space-y-1">
            <span className="text-sm font-medium text-sky-800">Megmentett ételek</span>
            <h3 className="text-3xl font-bold text-sky-950 tracking-tight">
              {stats.totalMealsSaved} <span className="text-lg font-semibold">adag</span>
            </h3>
            <p className="text-xs text-sky-700/80">Szeméttől megmentett étel</p>
          </div>
          <div className="p-4 bg-sky-100/80 text-sky-700 rounded-xl">
            <Utensils className="w-8 h-8" />
          </div>
        </motion.div>
      </div>

      {/* Visual Impact Comparison & Coin Jar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Dynamic Coin Jar */}
        <div className="lg:col-span-5 bg-white border border-slate-100 p-6 rounded-2xl shadow-xs flex flex-col items-center justify-between min-h-[350px]">
          <div className="text-center space-y-1 w-full border-b border-slate-100 pb-3">
            <h4 id="saving-jar-title" className="font-semibold text-slate-800">Családi megtakarítás otthon</h4>
            <p className="text-xs text-slate-500">Nézze, hogyan gyűlik a megmentett pénz!</p>
          </div>

          {/* Jar graphic */}
          <div className="relative w-44 h-56 border-4 border-slate-700 rounded-b-3xl rounded-t-lg my-4 flex items-end justify-center overflow-hidden bg-slate-50 shadow-inner">
            <div className="absolute top-2 w-12 h-2 bg-slate-700 rounded-t-md"></div>
            
            {/* Fluid gold liquid / coin pile */}
            <motion.div 
              className="w-full bg-amber-400/90 relative"
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(8, jarFillPercentage)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {/* Floating coin sparkles */}
              <div className="absolute bottom-0 left-0 right-0 top-0 bg-amber-350 opacity-80 flex flex-wrap justify-center overflow-hidden gap-1 p-2">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-yellow-300 rounded-full border border-amber-500 flex items-center justify-center text-[8px] font-bold text-amber-700 select-none shadow-xs">ft</div>
                ))}
              </div>
              
              {/* Wave effect on top */}
              <div className="absolute -top-2 left-0 right-0 h-4 bg-amber-300 rounded-full animate-pulse"></div>
            </motion.div>

            {/* Empty state label */}
            {stats.totalSavingsHuf === 0 && (
              <span className="absolute inset-0 flex items-center justify-center text-center px-4 text-xs font-medium text-slate-400">
                Az üveg még üres. Kezdje el a mentést!
              </span>
            )}

            {/* Jar percentage label overlay */}
            <div className="absolute top-[40%] bg-slate-900/80 text-white text-[11px] px-2 py-0.5 rounded-full font-mono">
              {jarFillPercentage}% Telítve
            </div>
          </div>

          <div className="text-center w-full bg-slate-50 py-2 rounded-xl text-xs text-slate-600 font-medium">
            {stats.totalSavingsHuf > 0 
              ? `Félig-meddig teli! Cél: 30.000 Ft megtakarítás` 
              : `Mentsen meg akciós ételeket, hogy megtöltse!`}
          </div>
        </div>

        {/* Real-world equivalents & charts */}
        <div className="lg:col-span-7 bg-white border border-slate-100 p-6 rounded-2xl shadow-xs flex flex-col justify-between">
          <div className="space-y-1 pb-4 border-b border-slate-150">
            <h4 className="font-semibold text-slate-800">Környezeti és Életmódbeli Egyenérték</h4>
            <p className="text-xs text-slate-500">Mekkora változást hozott a megmentett élelem?</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="p-4 bg-slate-50 rounded-xl space-y-3 flex flex-col justify-between">
              <div className="flex items-center space-x-3 text-slate-800">
                <div className="p-2 bg-teal-100 text-teal-800 rounded-lg">
                  <Trees className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-slate-500">Erdő szén-dioxid elnyelés</h5>
                  <p className="text-base font-bold text-slate-800 font-mono">
                    {treeAbsorptionDays > 0 ? `+${treeAbsorptionDays} db fa` : '0 fa'}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Ennyi fának kellene dolgoznia 1 teljes napig, hogy ezt a szén-dioxid mennyiséget kivonja a légkörből.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl space-y-3 flex flex-col justify-between">
              <div className="flex items-center space-x-3 text-slate-800">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-slate-500">Autós utazás kiváltása</h5>
                  <p className="text-base font-bold text-slate-800 font-mono">
                    {drivingAvoidedKm > 0 ? `-${drivingAvoidedKm} km` : '0 km'}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Egy átlagos benzinmotoros autóval megtett út szén-dioxid kibocsátását sikerült megelőznie!
              </p>
            </div>
          </div>

          {/* Environmental facts / call to action */}
          <div className="p-4 bg-amber-50/65 border border-amber-100/60 rounded-xl flex items-start space-x-3">
            <span className="text-amber-600 text-lg">💡</span>
            <div className="space-y-1 text-xs text-amber-900">
              <strong className="font-semibold">Tudta?</strong> Az elpazarolt élelmiszerek globálisan a teljes emberi üvegházhatású gázkibocsátás közel 8-10%-áért felelősek! Ha az élelmiszer-pazarlás egy ország lenne, a harmadik legnagyobb kibocsátó lenne Kína és az USA után.
            </div>
          </div>
        </div>
      </div>

      {/* Household Waste Calculator & Motivation Estimator */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-lg font-bold flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-emerald-400" />
              Személyes Háztartási Pazarlás-Becslő
            </h4>
            <p className="text-xs text-slate-300">
              Mérje fel, hogy családja jelenleg mennyi ételt és pénzt pazarolhat el egy évben teljesen feleslegesen!
            </p>
          </div>
          <button 
            onClick={() => setShowEstimatorResult(!showEstimatorResult)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-semibold text-xs rounded-lg transition-all"
          >
            {showEstimatorResult ? 'Paraméterek módosítása' : 'Számítás indítása'}
          </button>
        </div>

        {!showEstimatorResult ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-350 flex justify-between">
                <span>Háztartás létszáma:</span>
                <span className="text-emerald-400 font-bold font-mono">{householdSize} fő</span>
              </label>
              <input 
                type="range" 
                min="1" 
                max="8" 
                value={householdSize} 
                onChange={(e) => setHouseholdSize(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>1 fő</span>
                <span>4 fő</span>
                <span>8 fő</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-350">
                Pazarlási szokások szintje:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'alacsony', label: 'Tudatos', desc: 'Nagyon kevés maradék' },
                  { id: 'közepes', label: 'Átlagos', desc: 'Néha kidobunk dolgokat' },
                  { id: 'magas', label: 'Megengedő', desc: 'Gyakran megromlik étel' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setWasteLevel(item.id)}
                    className={`p-2.5 rounded-xl text-center transition-all border ${
                      wasteLevel === item.id 
                        ? 'bg-emerald-500/20 border-emerald-400 text-white font-bold' 
                        : 'bg-slate-800/50 border-slate-700 text-slate-300 text-xs hover:bg-slate-850'
                    }`}
                  >
                    <div className="text-xs">{item.label}</div>
                    <div className="text-[9px] opacity-70 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="pt-2 border-t border-slate-800 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-slate-800/70 rounded-xl border border-slate-700/60">
                <span className="text-[11px] text-slate-400">Éves felesleges élelem</span>
                <div className="text-xl font-bold text-rose-400 font-mono mt-1">~{estimate.totalKg} kg</div>
                <p className="text-[10px] text-slate-500 mt-1">Ehető és elkerülhető szemét</p>
              </div>

              <div className="p-4 bg-slate-800/70 rounded-xl border border-slate-700/60">
                <span className="text-[11px] text-slate-400">Kidobott pénz a szemétbe</span>
                <div className="text-xl font-bold text-rose-400 font-mono mt-1">~{estimate.totalHuf.toLocaleString()} Ft</div>
                <p className="text-[10px] text-slate-500 mt-1">Éves felesleges kiadás a családból</p>
              </div>

              <div className="p-4 bg-slate-800/70 rounded-xl border border-slate-700/60">
                <span className="text-[11px] text-slate-400">Elpazarolt CO₂ láblenyom</span>
                <div className="text-xl font-bold text-rose-400 font-mono mt-1">~{estimate.totalCo2} kg</div>
                <p className="text-[10px] text-slate-500 mt-1">Környezeti kár mértéke</p>
              </div>
            </div>

            <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-750 flex items-center justify-between text-xs text-slate-200">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                Az Élelmiszer-Mentő használatával ennek akár a 80%-át is megspórolhatja!
              </span>
              <button 
                onClick={() => setShowEstimatorResult(false)} 
                className="text-slate-400 hover:text-white underline"
              >
                Újraszámolás
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* History log list */}
      <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <h4 className="font-semibold text-slate-800 flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-500" />
            Mentési Előzményeim
          </h4>
          {stats.history.length > 0 && (
            <button 
              onClick={onClearStats}
              className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Statisztikák nullázása
            </button>
          )}
        </div>

        {stats.history.length === 0 ? (
          <div className="text-center py-8 text-slate-400 space-y-2">
            <p className="text-sm">Még nem rendelkezik mentési előzménnyel.</p>
            <p className="text-[11px] text-slate-350">
              Mentsen meg alapanyagokat az AI tervezővel vagy foglaljon le élelmiszer felesleget!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
            {stats.history.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                      item.type === 'recept' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                      item.type === 'bolt' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      'bg-sky-50 text-sky-700 border border-sky-100'
                    }`}>
                      {item.type === 'recept' ? 'Otthoni Recept' :
                       item.type === 'bolt' ? 'Bolti Akció' : 'Adományozás'}
                    </span>
                    <span className="font-semibold text-slate-800">{item.itemName}</span>
                  </div>
                  <div className="text-slate-400 text-[10px]">{item.date}</div>
                </div>

                <div className="text-right space-y-0.5">
                  <div className="font-bold text-emerald-600 font-mono">+{item.savingsHuf.toLocaleString()} Ft</div>
                  <div className="text-[10px] text-teal-600 font-mono">-{item.carbonSavedKg.toFixed(1)} kg CO₂</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
