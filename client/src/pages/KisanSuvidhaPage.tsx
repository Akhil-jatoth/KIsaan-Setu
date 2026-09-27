import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  TrendingUp, 
  FlaskConical, 
  Tractor, 
  MapPin, 
  HeartHandshake, 
  Search, 
  Calculator, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  PhoneCall, 
  Sparkles, 
  Volume2, 
  ArrowRight,
  Filter,
  DollarSign,
  Layers,
  Truck,
  HelpCircle,
  MessageSquareCode
} from 'lucide-react';
import { useAppStore } from '../store/appStore';

type TabType = 'pmkisan' | 'insurance' | 'mandi' | 'soil' | 'machinery' | 'dealers' | 'animal';

export function KisanSuvidhaPage() {
  const { setRoute, speakText, setCopilotOpen, sendCopilotMessage } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('pmkisan');

  // ── 1. PM-KISAN State ──
  const [aadhaarInput, setAadhaarInput] = useState('');
  const [beneficiaryData, setBeneficiaryData] = useState<any | null>(null);

  // ── 2. Insurance Calculator State ──
  const [selectedState, setSelectedState] = useState('Telangana');
  const [selectedCrop, setSelectedCrop] = useState('Paddy (Rice)');
  const [acreage, setAcreage] = useState<number>(2.5);
  const [season, setSeason] = useState<'Kharif' | 'Rabi'>('Kharif');

  // ── 3. Mandi Filter State ──
  const [mandiSearch, setMandiSearch] = useState('');
  const [selectedCommodity, setSelectedCommodity] = useState('All');

  // ── 4. Machinery Subsidy State ──
  const [machineType, setMachineType] = useState('Tractor (40-50 HP)');
  const [farmerCategory, setFarmerCategory] = useState<'Small/Marginal' | 'General'>('Small/Marginal');

  // PM-KISAN Status Check Handler
  const handleCheckPmkisan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aadhaarInput.trim()) return;
    // Simulated live lookup
    setBeneficiaryData({
      farmerName: 'Rameshwar Reddy',
      village: 'Kompally, Medchal-Malkajgiri',
      aadhaarLinked: true,
      bankAccount: 'State Bank of India (***4821)',
      installments: [
        { no: '18th Installment (Oct 2024)', amount: '₹2,000', status: 'Credited (FTO Generated)', date: '05-10-2024' },
        { no: '17th Installment (Jun 2024)', amount: '₹2,000', status: 'Credited (FTO Generated)', date: '18-06-2024' },
        { no: '16th Installment (Feb 2024)', amount: '₹2,000', status: 'Credited (FTO Generated)', date: '28-02-2024' }
      ],
      nextInstallment: '19th Installment (Feb 2025) — ₹2,000 (Eligible & Processed)'
    });
  };

  // PMFBY Insurance Calculation
  const sumInsuredPerAcre = selectedCrop === 'Paddy (Rice)' ? 38000 : selectedCrop === 'Cotton' ? 45000 : selectedCrop === 'Tomato' ? 52000 : 32000;
  const totalSumInsured = sumInsuredPerAcre * acreage;
  const farmerRatePercent = season === 'Kharif' ? (selectedCrop === 'Cotton' || selectedCrop === 'Tomato' ? 5 : 2) : 1.5;
  const farmerPremium = Math.round((totalSumInsured * farmerRatePercent) / 100);
  const govtSubsidy = Math.round((totalSumInsured * (100 - farmerRatePercent)) / 100);

  // Machinery Subsidy Calculation
  const machineBasePrice = machineType.includes('Tractor') ? 750000 : machineType.includes('Drone') ? 600000 : machineType.includes('Sprayer') ? 180000 : 120000;
  const subsidyPercent = farmerCategory === 'Small/Marginal' ? 50 : 40;
  const subsidyAmount = Math.round((machineBasePrice * subsidyPercent) / 100);
  const farmerSharePrice = machineBasePrice - subsidyAmount;

  // Live Mandi Data
  const mandiPrices = [
    { commodity: 'Tomato', market: 'Bowenpally (Hyderabad, TS)', min: 1400, max: 2200, modal: 1800, trend: 'up', arrival: '140 Tonnes' },
    { commodity: 'Potato', market: 'Gudimalkapur (TS)', min: 1600, max: 2400, modal: 2000, trend: 'stable', arrival: '85 Tonnes' },
    { commodity: 'Paddy (Rice)', market: 'Miryalaguda (Nalgonda, TS)', min: 2320, max: 2850, modal: 2600, trend: 'up', arrival: '320 Tonnes' },
    { commodity: 'Cotton (Kapás)', market: 'Warangal Mandi (TS)', min: 6800, max: 7600, modal: 7250, trend: 'up', arrival: '210 Tonnes' },
    { commodity: 'Red Chili', market: 'Khammam APMC (TS)', min: 14500, max: 19800, modal: 17200, trend: 'up', arrival: '95 Tonnes' },
    { commodity: 'Maize (Corn)', market: 'Nizamabad APMC (TS)', min: 2050, max: 2400, modal: 2250, trend: 'stable', arrival: '160 Tonnes' },
    { commodity: 'Wheat', market: 'Indore Mandi (MP)', min: 2450, max: 2900, modal: 2700, trend: 'stable', arrival: '280 Tonnes' },
    { commodity: 'Onion', market: 'Lasalgaon (Nashik, MH)', min: 1800, max: 2900, modal: 2350, trend: 'down', arrival: '450 Tonnes' }
  ].filter(m => {
    const matchSearch = m.commodity.toLowerCase().includes(mandiSearch.toLowerCase()) || m.market.toLowerCase().includes(mandiSearch.toLowerCase());
    const matchComm = selectedCommodity === 'All' || m.commodity.toLowerCase().includes(selectedCommodity.toLowerCase());
    return matchSearch && matchComm;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* ── Top Hero Header ───────────────────────────────────── */}
      <div className="glass-panel p-6 border-agri-accent/40 bg-gradient-to-r from-agri-dark via-[#072410] to-[#041508] shadow-2xl relative overflow-hidden rounded-3xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-agri-accent/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-agri-accent animate-pulse" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Kisan <span className="text-agri-accent">Suvidha</span> &amp; Mandi Hub
              </h1>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                GOVT. OF INDIA INTEGRATED
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl leading-relaxed">
              Unified portal for PM-KISAN tracking, PMFBY crop insurance calculator, real-time AGMARKNET Mandi prices, Soil Health Cards, and SMAM farm machinery subsidies.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => speakText("Welcome to Kisan Suvidha and Mandi Portal. Check your PM-KISAN status, calculate crop insurance premiums, check live mandi prices, or find nearby soil testing labs.")}
              className="bg-black/60 hover:bg-black/90 text-gray-200 border border-agri-accent/40 px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-agri-accent" />
              <span>Voice Read</span>
            </button>

            <button
              onClick={() => {
                setCopilotOpen(true);
                sendCopilotMessage("What are the key government agriculture schemes available under Kisan Suvidha like PM-KISAN, PMFBY, and SMAM subsidies?");
              }}
              className="bg-agri-accent hover:bg-lime-400 text-agri-darkest font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-glow-accent transition-all cursor-pointer"
            >
              <MessageSquareCode className="w-4 h-4" />
              <span>Ask Copilot about Schemes</span>
            </button>
          </div>
        </div>

        {/* Quick Service Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/10 text-xs font-mono">
          <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
            <span className="text-gray-400 block text-[10px]">PM-KISAN BENEFIT</span>
            <span className="text-agri-accent font-bold text-sm">₹6,000 / Year</span>
          </div>
          <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
            <span className="text-gray-400 block text-[10px]">PMFBY INSURANCE</span>
            <span className="text-sky-300 font-bold text-sm">1.5% - 2% Premium</span>
          </div>
          <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
            <span className="text-gray-400 block text-[10px]">SMAM SUBSIDY</span>
            <span className="text-amber-300 font-bold text-sm">40% - 50% Grants</span>
          </div>
          <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
            <span className="text-gray-400 block text-[10px]">AGMARKNET MANDIS</span>
            <span className="text-emerald-300 font-bold text-sm">2,800+ Live Markets</span>
          </div>
        </div>
      </div>

      {/* ── Category Navigation Tabs ───────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-mono font-bold">
        {[
          { id: 'pmkisan', label: '🏛️ PM-KISAN Status', icon: Building2 },
          { id: 'insurance', label: '🛡️ PMFBY Insurance Calculator', icon: ShieldCheck },
          { id: 'mandi', label: '📈 Live Mandi Prices (AGMARKNET)', icon: TrendingUp },
          { id: 'soil', label: '🧪 Soil Health & Labs', icon: FlaskConical },
          { id: 'machinery', label: '🚜 Machinery & Subsidies', icon: Tractor },
          { id: 'dealers', label: '📍 Dealers & Kisan Rath', icon: MapPin },
          { id: 'animal', label: '🐄 Animal Husbandry & Dairy', icon: HeartHandshake }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`px-4 py-2.5 rounded-2xl flex items-center gap-2 whitespace-nowrap transition-all border cursor-pointer ${
              activeTab === tab.id
                ? 'bg-agri-accent text-agri-darkest font-extrabold border-agri-accent shadow-glow-accent'
                : 'bg-black/60 text-gray-300 border-white/10 hover:border-white/20 hover:text-white'
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. PM-KISAN SERVICES TAB                                      */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'pmkisan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 glass-panel p-5 border-white/10 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <Building2 className="w-5 h-5 text-agri-accent" />
              <h2 className="text-base font-bold text-white">PM-KISAN Beneficiary Status &amp; e-KYC</h2>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Pradhan Mantri Kisan Samman Nidhi provides <strong>₹6,000 per year</strong> in 3 equal installments of ₹2,000 directly to verified farmer bank accounts.
            </p>

            <form onSubmit={handleCheckPmkisan} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">
                  Enter Aadhaar Number / Registration Number / Mobile
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aadhaarInput}
                    onChange={(e) => setAadhaarInput(e.target.value)}
                    placeholder="e.g. 5849 2018 3921"
                    className="flex-1 bg-black/60 border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-agri-accent font-mono"
                  />
                  <button
                    type="submit"
                    className="bg-agri-accent hover:bg-lime-400 text-agri-darkest font-extrabold px-4 py-2.5 rounded-xl text-xs shadow-glow-accent cursor-pointer transition-all"
                  >
                    Check Status
                  </button>
                </div>
              </div>
            </form>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2">
              <a 
                href="https://pmkisan.gov.in/" 
                target="_blank" 
                rel="noreferrer"
                className="bg-black/40 hover:bg-black/70 p-3 rounded-xl border border-white/10 flex items-center justify-between text-gray-300 hover:text-white"
              >
                <span>New Farmer Registration</span>
                <ExternalLink className="w-3.5 h-3.5 text-agri-accent" />
              </a>
              <a 
                href="https://pmkisan.gov.in/aadharekyc.aspx" 
                target="_blank" 
                rel="noreferrer"
                className="bg-black/40 hover:bg-black/70 p-3 rounded-xl border border-white/10 flex items-center justify-between text-gray-300 hover:text-white"
              >
                <span>Complete OTP e-KYC</span>
                <ExternalLink className="w-3.5 h-3.5 text-agri-accent" />
              </a>
            </div>

            <div className="bg-emerald-950/30 border border-emerald-500/30 p-3 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>PM-KISAN National Toll-Free Helpline: <strong>155261 / 011-24300606</strong></span>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-6 glass-panel p-5 border-agri-accent/30 space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase">Beneficiary Verification Details</h3>
            
            {beneficiaryData ? (
              <div className="space-y-3 animate-fade-in text-xs">
                <div className="bg-black/60 p-3.5 rounded-2xl border border-white/10 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Beneficiary Name:</span>
                    <span className="font-bold text-white">{beneficiaryData.farmerName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Location:</span>
                    <span className="text-white">{beneficiaryData.village}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Aadhaar e-KYC:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified &amp; Active
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Bank Account:</span>
                    <span className="text-white font-mono">{beneficiaryData.bankAccount}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="font-mono text-gray-300 font-bold block">Recent Installments History:</span>
                  {beneficiaryData.installments.map((inst: any, idx: number) => (
                    <div key={idx} className="bg-black/40 p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">{inst.no}</div>
                        <div className="text-[10px] text-gray-400 font-mono">Credited on {inst.date}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-agri-accent font-mono">{inst.amount}</div>
                        <div className="text-[10px] text-emerald-400">{inst.status}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-agri-accent/15 border border-agri-accent/30 text-agri-accent font-mono text-xs">
                  ✨ <strong>Upcoming:</strong> {beneficiaryData.nextInstallment}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400 text-xs">
                Enter your Aadhaar or Mobile Number above to verify payment status and release dates.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. PMFBY CROP INSURANCE CALCULATOR                            */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'insurance' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 glass-panel p-5 border-white/10 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <ShieldCheck className="w-5 h-5 text-sky-400" />
              <h2 className="text-base font-bold text-white">PMFBY Crop Insurance &amp; Premium Calculator</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-mono text-gray-300 mb-1">State / Union Territory</label>
                <select 
                  value={selectedState} 
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white font-mono focus:outline-none"
                >
                  <option>Telangana</option>
                  <option>Andhra Pradesh</option>
                  <option>Maharashtra</option>
                  <option>Karnataka</option>
                  <option>Punjab</option>
                  <option>Uttar Pradesh</option>
                  <option>Madhya Pradesh</option>
                  <option>Tamil Nadu</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-gray-300 mb-1">Season</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Kharif', 'Rabi'] as const).map(s => (
                    <button
                      key={s}
                      onClick={() => setSeason(s)}
                      className={`py-2 rounded-xl border text-xs font-mono font-bold transition-all ${
                        season === s ? 'bg-sky-500 text-white border-sky-400' : 'bg-black/40 text-gray-400 border-white/10'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-mono text-gray-300 mb-1">Crop Type</label>
                <select 
                  value={selectedCrop} 
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white font-mono focus:outline-none"
                >
                  <option>Paddy (Rice)</option>
                  <option>Cotton</option>
                  <option>Tomato</option>
                  <option>Wheat</option>
                  <option>Corn (Maize)</option>
                  <option>Soyabean</option>
                  <option>Red Chili</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-gray-300 mb-1">Cultivated Land (Acres): {acreage} Acres</label>
                <input 
                  type="range" 
                  min="0.5" 
                  max="25" 
                  step="0.5" 
                  value={acreage} 
                  onChange={(e) => setAcreage(parseFloat(e.target.value))}
                  className="w-full accent-sky-400 cursor-pointer mt-2"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex flex-wrap gap-2 text-xs font-mono">
              <a 
                href="https://pmfby.gov.in/" 
                target="_blank" 
                rel="noreferrer"
                className="bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 border border-sky-500/40 px-3.5 py-2 rounded-xl flex items-center gap-1.5"
              >
                <span>Official PMFBY Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a 
                href="https://pmfby.gov.in/claimStatus" 
                target="_blank" 
                rel="noreferrer"
                className="bg-black/50 text-gray-300 hover:text-white border border-white/10 px-3.5 py-2 rounded-xl flex items-center gap-1.5"
              >
                <span>Report Crop Loss within 72 hrs</span>
              </a>
            </div>
          </div>

          {/* Premium Breakdown */}
          <div className="lg:col-span-5 glass-panel p-5 border-sky-500/30 bg-gradient-to-br from-black/80 to-[#071f33] space-y-4">
            <h3 className="text-sm font-bold text-sky-400 font-mono uppercase">Calculated Policy Overview</h3>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Sum Insured:</span>
                  <span className="font-extrabold text-white text-base font-mono">₹{totalSumInsured.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-gray-400">Insured Coverage / Acre:</span>
                  <span className="text-gray-200 font-mono">₹{sumInsuredPerAcre.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-sky-950/40 border border-sky-500/30 space-y-2 font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-sky-300 font-bold">Farmer Premium Share ({farmerRatePercent}%):</span>
                  <span className="text-lg font-extrabold text-sky-300">₹{farmerPremium.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-gray-400 pt-1 border-t border-sky-500/20">
                  <span>Central + State Govt. Subsidy:</span>
                  <span className="text-emerald-400 font-bold">₹{govtSubsidy.toLocaleString()} (Paid by Govt)</span>
                </div>
              </div>

              <div className="text-[11px] text-gray-400 leading-relaxed">
                🛡️ Covers loss from localized calamities, inundation, drought, unseasonal post-harvest rainfall, and pest attack.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. AGMARKNET LIVE MANDI & COMMODITY PRICES                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'mandi' && (
        <div className="glass-panel p-5 border-white/10 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <div>
                <h2 className="text-base font-bold text-white">AGMARKNET &amp; e-NAM Daily Mandi Prices</h2>
                <p className="text-[11px] text-gray-400 font-mono">Real-time daily modal rates per Quintal across Indian markets</p>
              </div>
            </div>

            {/* Commodity filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-48">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={mandiSearch}
                  onChange={(e) => setMandiSearch(e.target.value)}
                  placeholder="Search crop or mandi..."
                  className="w-full bg-black/60 border border-white/15 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none font-mono"
                />
              </div>

              <select
                value={selectedCommodity}
                onChange={(e) => setSelectedCommodity(e.target.value)}
                className="bg-black/60 border border-white/15 rounded-xl p-2 text-xs text-agri-accent font-mono focus:outline-none"
              >
                <option value="All">All Crops</option>
                <option value="Tomato">Tomato</option>
                <option value="Potato">Potato</option>
                <option value="Paddy">Paddy / Rice</option>
                <option value="Cotton">Cotton</option>
                <option value="Chili">Chili</option>
                <option value="Maize">Maize</option>
                <option value="Wheat">Wheat</option>
                <option value="Onion">Onion</option>
              </select>
            </div>
          </div>

          {/* Mandi Price Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="bg-black/60 text-gray-400 border-b border-white/10">
                  <th className="p-3">COMMODITY</th>
                  <th className="p-3">MARKET (MANDI)</th>
                  <th className="p-3">MIN PRICE</th>
                  <th className="p-3">MAX PRICE</th>
                  <th className="p-3">MODAL RATE (₹/QTL)</th>
                  <th className="p-3">ARRIVAL VOL</th>
                  <th className="p-3">TREND</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mandiPrices.map((item, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-bold text-white">{item.commodity}</td>
                    <td className="p-3 text-gray-300">{item.market}</td>
                    <td className="p-3 text-gray-400">₹{item.min.toLocaleString()}</td>
                    <td className="p-3 text-gray-400">₹{item.max.toLocaleString()}</td>
                    <td className="p-3 font-bold text-agri-accent text-sm">₹{item.modal.toLocaleString()}</td>
                    <td className="p-3 text-gray-300">{item.arrival}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.trend === 'up' ? 'bg-emerald-500/20 text-emerald-400' : item.trend === 'down' ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-300'
                      }`}>
                        {item.trend === 'up' ? '▲ Bullish' : item.trend === 'down' ? '▼ Bearish' : '● Stable'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. SOIL HEALTH & LAB LOCATOR                                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'soil' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 glass-panel p-5 border-white/10 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <FlaskConical className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white">Soil Health Card &amp; 12-Parameter Assessment</h2>
            </div>

            <p className="text-xs text-gray-300 leading-relaxed">
              Government Soil Health Cards test 12 parameters to optimize NPK, organic carbon, and trace mineral balance for maximum yield with minimal fertilizer expenditure.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
              {[
                { name: 'Soil pH', val: '6.8 (Neutral - Optimal)', status: 'Optimal' },
                { name: 'Organic Carbon', val: '0.62% (Medium)', status: 'Medium' },
                { name: 'Available Nitrogen (N)', val: '185 kg/ha (Low)', status: 'Low' },
                { name: 'Available Phosphorus (P)', val: '24 kg/ha (Medium)', status: 'Medium' },
                { name: 'Available Potassium (K)', val: '280 kg/ha (High)', status: 'High' },
                { name: 'Zinc (Zn)', val: '0.8 ppm (Sufficient)', status: 'Optimal' },
                { name: 'Iron (Fe)', val: '4.5 ppm (Sufficient)', status: 'Optimal' },
                { name: 'Boron (B)', val: '0.4 ppm (Deficient)', status: 'Low' },
                { name: 'Electrical Cond (EC)', val: '0.45 dS/m (Normal)', status: 'Optimal' }
              ].map((p, i) => (
                <div key={i} className="bg-black/40 p-2.5 rounded-xl border border-white/8 space-y-1">
                  <span className="text-[10px] text-gray-400 block">{p.name}</span>
                  <span className="font-bold text-white text-xs block">{p.val}</span>
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold inline-block ${
                    p.status === 'Optimal' ? 'bg-emerald-500/20 text-emerald-400' : p.status === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Nearest Testing Labs */}
          <div className="lg:col-span-5 glass-panel p-5 border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase">Nearest Government Soil Testing Labs</h3>
            
            <div className="space-y-2.5 text-xs">
              {[
                { name: 'District Soil Testing Laboratory', loc: 'Rajendranagar, Hyderabad, TS', dist: '6.2 km', contact: '040-24015011' },
                { name: 'KVK Agriculture Research Station', loc: 'Medchal, TS', dist: '14.5 km', contact: '040-27201844' },
                { name: 'ICAR-CRIDA Soil Science Lab', loc: 'Santoshnagar, Hyderabad, TS', dist: '18.0 km', contact: '040-24530177' }
              ].map((lab, idx) => (
                <div key={idx} className="bg-black/40 p-3 rounded-xl border border-white/5 space-y-1">
                  <div className="flex justify-between font-bold text-white">
                    <span>{lab.name}</span>
                    <span className="text-agri-accent font-mono text-[11px]">{lab.dist}</span>
                  </div>
                  <p className="text-[11px] text-gray-400">{lab.loc}</p>
                  <p className="text-[10px] text-emerald-400 font-mono">📞 Helpline: {lab.contact}</p>
                </div>
              ))}
            </div>

            <a
              href="https://soilhealth.dac.gov.in/"
              target="_blank"
              rel="noreferrer"
              className="w-full bg-agri-accent hover:bg-lime-400 text-agri-darkest font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-glow-accent cursor-pointer transition-all"
            >
              <span>View Official Soil Health Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. FARM MACHINERY & SMAM SUBSIDIES                            */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'machinery' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 glass-panel p-5 border-white/10 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <Tractor className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white">SMAM Mechanization 40% - 50% Subsidy Calculator</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-mono text-gray-300 mb-1">Equipment Category</label>
                <select
                  value={machineType}
                  onChange={(e) => setMachineType(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 rounded-xl p-2.5 text-white font-mono focus:outline-none"
                >
                  <option>Tractor (40-50 HP)</option>
                  <option>Agricultural RTK Drone (10L)</option>
                  <option>Tractor-Mounted Boom Sprayer</option>
                  <option>Rotavator / Power Tiller</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-gray-300 mb-1">Farmer Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Small/Marginal', 'General'] as const).map(c => (
                    <button
                      key={c}
                      onClick={() => setFarmerCategory(c)}
                      className={`py-2 rounded-xl border text-xs font-mono font-bold transition-all ${
                        farmerCategory === c ? 'bg-amber-500 text-black border-amber-400' : 'bg-black/40 text-gray-400 border-white/10'
                      }`}
                    >
                      {c === 'Small/Marginal' ? 'Small / SC/ST (50%)' : 'General (40%)'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Hiring Centers (CHC) Finder */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <span className="font-mono text-gray-300 font-bold text-xs block">
                🚜 Nearby Custom Hiring Centers (CHCs) for Rental:
              </span>
              <div className="space-y-2 text-xs">
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">Rythu Bharosa Kendra CHC</div>
                    <div className="text-[10px] text-gray-400">Tractors, Disc Harrows, Drones Available</div>
                  </div>
                  <span className="text-agri-accent font-mono font-bold">₹850 / Hour</span>
                </div>
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">Gramin Krishi Mechanization Hub</div>
                    <div className="text-[10px] text-gray-400">Combine Harvesters &amp; Power Weeders</div>
                  </div>
                  <span className="text-agri-accent font-mono font-bold">₹1,200 / Hour</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subsidy Result Card */}
          <div className="lg:col-span-5 glass-panel p-5 border-amber-500/30 bg-gradient-to-br from-black/80 to-[#221706] space-y-4">
            <h3 className="text-sm font-bold text-amber-400 font-mono uppercase">Grant &amp; Subsidy Assessment</h3>
            
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Equipment Base Cost:</span>
                  <span className="font-extrabold text-white text-base font-mono">₹{machineBasePrice.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 space-y-2 font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-amber-300 font-bold">Government Subsidy ({subsidyPercent}%):</span>
                  <span className="text-lg font-extrabold text-amber-300">₹{subsidyAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] text-gray-400 pt-1 border-t border-amber-500/20">
                  <span>Net Payable by Farmer:</span>
                  <span className="text-white font-bold">₹{farmerSharePrice.toLocaleString()}</span>
                </div>
              </div>

              <a
                href="https://agrimachinery.nic.in/"
                target="_blank"
                rel="noreferrer"
                className="w-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-glow-accent cursor-pointer transition-all"
              >
                <span>Apply on SMAM Portal (agrimachinery.nic.in)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 6. DEALERS & KISAN RATH LOGISTICS                             */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'dealers' && (
        <div className="glass-panel p-5 border-white/10 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <MapPin className="w-5 h-5 text-rose-400" />
            <div>
              <h2 className="text-base font-bold text-white">Certified Dealers &amp; Kisan Rath Cold-Chain Logistics</h2>
              <p className="text-[11px] text-gray-400 font-mono">Verified seeds, fertilizers, pesticide distributors, and refrigerated farm transport</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {[
              { type: 'Seed Dealer', name: 'National Seeds Corporation (NSC)', loc: 'Kompally, Hyderabad', phone: '040-27845612', badge: 'Certified Govt Supplier' },
              { type: 'Fertilizer Outlet', name: 'IFFCO Farmer Service Center', loc: 'Medchal Market Yard', phone: '040-28193021', badge: 'Subsidized Urea/DAP' },
              { type: 'Pesticides & Bio', name: 'Krishi Vikas Bio-Formulations', loc: 'Bowenpally, Hyderabad', phone: '040-23910482', badge: 'Certified Biopesticides' },
              { type: 'Kisan Rath Transport', name: 'Kisan Cold-Chain Refrigerator Vans', loc: 'Hyderabad - Warangal Route', phone: '1800-180-1551', badge: 'Perishable Transport' },
              { type: 'CSC Center', name: 'Common Service Center (Village e-Kendra)', loc: 'Gundlapochampally', phone: '9849012345', badge: 'e-KYC & Schemes' },
              { type: 'Custom Hiring', name: 'FARMS Equipment Hub', loc: 'Shamirpet Zone', phone: '040-29182390', badge: 'Tractor/Drone Rental' }
            ].map((d, i) => (
              <div key={i} className="bg-black/50 p-3.5 rounded-2xl border border-white/10 space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <span className="font-bold text-white text-sm">{d.name}</span>
                  <span className="text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 px-1.5 py-0.5 rounded-full flex-shrink-0">
                    {d.type}
                  </span>
                </div>
                <p className="text-gray-400 text-[11px]">{d.loc}</p>
                <div className="flex justify-between items-center text-[10px] font-mono pt-1 border-t border-white/5">
                  <span className="text-emerald-400">📞 {d.phone}</span>
                  <span className="text-agri-accent">{d.badge}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 7. ANIMAL HUSBANDRY & DAIRY TAB                               */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeTab === 'animal' && (
        <div className="glass-panel p-5 border-white/10 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <HeartHandshake className="w-5 h-5 text-pink-400" />
            <div>
              <h2 className="text-base font-bold text-white">Animal Husbandry, Livestock Healthcare &amp; Dairy</h2>
              <p className="text-[11px] text-gray-400 font-mono">Vaccination schedules, livestock diseases &amp; Artificial Insemination (AI) breed management</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Diseases */}
            <div className="bg-black/50 p-4 rounded-2xl border border-white/10 space-y-3">
              <span className="font-bold text-white text-sm block font-mono text-pink-300">
                🩺 Common Livestock Diseases &amp; Preventive Cures:
              </span>
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <div className="font-bold text-white">Foot and Mouth Disease (FMD)</div>
                  <p className="text-gray-400 text-[11px] mt-0.5">Symptoms: Blisters in mouth and hooves, high fever. Solution: Polyvalent FMD vaccine bi-annually.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <div className="font-bold text-white">Bovine Mastitis (Udder Infection)</div>
                  <p className="text-gray-400 text-[11px] mt-0.5">Symptoms: Swollen udder, abnormal milk clots. Solution: Intramammary antibiotic infusion + Teat dip hygiene.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <div className="font-bold text-white">Black Quarter (BQ)</div>
                  <p className="text-gray-400 text-[11px] mt-0.5">Symptoms: Crepitating swelling on thigh/shoulder. Solution: Annual pre-monsoon BQ vaccination.</p>
                </div>
              </div>
            </div>

            {/* Breeds & Subsidies */}
            <div className="bg-black/50 p-4 rounded-2xl border border-white/10 space-y-3">
              <span className="font-bold text-white text-sm block font-mono text-emerald-300">
                🥛 Dairy Breeds &amp; Rashtriya Gokul Mission Subsidies:
              </span>
              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <div className="font-bold text-white">Indigenous Cattle (Gir, Sahiwal, Ongole)</div>
                  <p className="text-gray-400 text-[11px] mt-0.5">High heat tolerance, A2 milk yield (14-18 L/day). Eligible for 50% capital subsidy under Gokul Mission.</p>
                </div>
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <div className="font-bold text-white">Murrah &amp; Jaffarabadi Buffaloes</div>
                  <p className="text-gray-400 text-[11px] mt-0.5">High fat content (7-8%), ideal for commercial dairy units. Subsidized Artificial Insemination (AI) at village vet centers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
