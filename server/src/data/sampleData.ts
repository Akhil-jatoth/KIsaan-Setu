export interface CropData {
  id: string;
  name: string;
  scientificName: string;
  category: string;
  image: string;
  description: string;
  idealSoil: string;
  optimalTemp: string;
  waterRequirement: string;
  growthStages: {
    stage: string;
    duration: string;
    description: string;
    keyCareTips: string[];
  }[];
  commonDiseases: string[];
  nutritionalNeeds: {
    nitrogen: string;
    phosphorus: string;
    potassium: string;
  };
  harvestingGuidelines: string;
}

export interface DiseaseData {
  id: string;
  crop: string;
  name: string;
  scientificName: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  image: string;
  symptoms: string[];
  causes: string[];
  visualIndicators: {
    leaf: string;
    stem?: string;
    fruit?: string;
  };
  prevention: string[];
  stepByStepGuidance: {
    step: number;
    title: string;
    instruction: string;
    urgency: string;
    illustrationType: 'isolate' | 'prune' | 'hygiene' | 'expert' | 'monitor';
  }[];
  expertAdvisory: string;
}

export interface EquipmentData {
  id: string;
  name: string;
  category: string;
  image: string;
  description: string;
  specs: Record<string, string>;
  components: {
    id: string;
    name: string;
    position: [number, number, number];
    description: string;
    safetyChecklist: string[];
    maintenanceCycle: string;
  }[];
  safetyProtocols: string[];
}

export interface TrainingModuleData {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  badge: string;
  description: string;
  learningObjectives: string[];
  interactive3DType: 'tractor' | 'sprayer' | 'farm' | 'drone' | 'plant';
  steps: {
    stepNumber: number;
    title: string;
    targetComponentId: string;
    instruction: string;
    feedbackSuccess: string;
    feedbackError: string;
    hint: string;
  }[];
  quiz: {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface CommunityNote {
  id: string;
  author: string;
  role: string;
  avatar: string;
  timeAgo: string;
  location: string;
  crop: string;
  title: string;
  content: string;
  image: string;
  upvotes: number;
  commentsCount: number;
  solved: boolean;
  comments: {
    id: string;
    author: string;
    avatar: string;
    role: string;
    content: string;
    timestamp: string;
  }[];
}

export const CROPS_DATA: CropData[] = [
  {
    id: "tomato",
    name: "Tomato",
    scientificName: "Solanum lycopersicum",
    category: "Nightshade (Solanaceae)",
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80",
    description: "High-yield fruit crop prone to foliar blights and humidity stress. Requires careful canopy management, drip irrigation, and calcium monitoring.",
    idealSoil: "Well-drained sandy loam, pH 6.0 - 6.8",
    optimalTemp: "21°C - 27°C (Day), 16°C - 19°C (Night)",
    waterRequirement: "1.5 - 2.0 inches/week via root zone",
    growthStages: [
      {
        stage: "Seedling & Transplant",
        duration: "Days 1 - 25",
        description: "Root establishment and true leaf emergence.",
        keyCareTips: ["Maintain 22°C soil temp", "Avoid overwatering to prevent damping off"]
      },
      {
        stage: "Vegetative Growth",
        duration: "Days 26 - 50",
        description: "Rapid stem thickening, branching, and foliar expansion.",
        keyCareTips: ["Install staking or trellising early", "Apply balanced N-P-K fertilizer"]
      },
      {
        stage: "Flowering & Fruit Set",
        duration: "Days 51 - 75",
        description: "Blossom formation and early fruit cluster development.",
        keyCareTips: ["Ensure pollinator activity or air movement", "Prevent calcium deficiency (Blossom End Rot)"]
      },
      {
        stage: "Fruit Ripening & Harvest",
        duration: "Days 76 - 100+",
        description: "Color break to uniform deep crimson ripening.",
        keyCareTips: ["Harvest in early morning", "Reduce moisture fluctuations to avoid cracking"]
      }
    ],
    commonDiseases: ["Early Blight", "Late Blight", "Bacterial Spot", "Septoria Leaf Spot"],
    nutritionalNeeds: {
      nitrogen: "Moderate - avoid excess to prevent bushy foliage with no fruit",
      phosphorus: "High during root setup and flowering",
      potassium: "Very High during fruit sizing and ripening"
    },
    harvestingGuidelines: "Pick when fruits reach breaker stage or uniform vine-ripened red with firm calyx."
  },
  {
    id: "potato",
    name: "Potato",
    scientificName: "Solanum tuberosum",
    category: "Tubers (Solanaceae)",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
    description: "Major staple tuber crop susceptible to late blight epidemics and soil nematodes. Requires regular hilling and strict field sanitation.",
    idealSoil: "Deep, loose, fertile sandy loam, pH 5.0 - 6.0",
    optimalTemp: "15°C - 20°C (Tuber bulking slows above 28°C)",
    waterRequirement: "1.0 - 1.5 inches/week; critical during stolonization",
    growthStages: [
      {
        stage: "Sprout Development",
        duration: "Days 1 - 20",
        description: "Eye sprouts emerge from seed tubers and form root systems.",
        keyCareTips: ["Plant certified disease-free seed tubers", "Ensure soil is crumbly"]
      },
      {
        stage: "Vegetative & Canopy Fill",
        duration: "Days 21 - 45",
        description: "Stem and foliage development establishing photosynthetic capacity.",
        keyCareTips: ["Begin first hilling round", "Scout for early leaf spot lesions"]
      },
      {
        stage: "Tuber Initiation & Bulking",
        duration: "Days 46 - 85",
        description: "Stolon tips swell into tubers; rapid dry matter accumulation.",
        keyCareTips: ["Maintain consistent soil moisture", "Keep tubers shielded from sunlight"]
      },
      {
        stage: "Maturation & Skin Set",
        duration: "Days 86 - 110+",
        description: "Vines begin natural senescence and tuber skins harden.",
        keyCareTips: ["Stop irrigation 2 weeks before lifting", "Allow skin to cure before storage"]
      }
    ],
    commonDiseases: ["Late Blight (Phytophthora)", "Early Blight", "Black Scurf", "Common Scab"],
    nutritionalNeeds: {
      nitrogen: "Early vegetative burst; stop before bulking",
      phosphorus: "Essential for tuber count per hill",
      potassium: "Crucial for tuber size, specific gravity, and bruise resistance"
    },
    harvestingGuidelines: "Harvest when skins are set and cannot be easily rubbed off with thumb pressure."
  },
  {
    id: "corn",
    name: "Corn / Maize",
    scientificName: "Zea mays",
    category: "Cereal Grass (Poaceae)",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80",
    description: "High-biomass grain and fodder crop demanding high nitrogen and precise canopy sunlight interception. Vulnerable to leaf blights and stalk borers.",
    idealSoil: "Rich loam with good organic matter, pH 5.8 - 7.0",
    optimalTemp: "24°C - 30°C for optimal photosynthetic conversion",
    waterRequirement: "2.0 - 2.5 inches/week during silking & kernel fill",
    growthStages: [
      {
        stage: "Emergence to V4",
        duration: "Days 1 - 20",
        description: "Collar emergence on 4th leaf, growing point still below soil line.",
        keyCareTips: ["Control early weed competition", "Check for cutworms"]
      },
      {
        stage: "Rapid Vegetative (V6 - V12)",
        duration: "Days 21 - 50",
        description: "Ear shoot initiation and potential kernel row determination.",
        keyCareTips: ["Side-dress Nitrogen", "Ensure zero water stress"]
      },
      {
        stage: "Tasseling & Silking (VT - R1)",
        duration: "Days 51 - 70",
        description: "Pollen shedding and silk emergence for kernel fertilization.",
        keyCareTips: ["Critical moisture period", "Scout for foliar leaf spots"]
      },
      {
        stage: "Grain Fill & Black Layer (R2 - R6)",
        duration: "Days 71 - 105+",
        description: "Dough stage to denting and physiological maturity black layer.",
        keyCareTips: ["Monitor grain moisture meter", "Check stalk integrity"]
      }
    ],
    commonDiseases: ["Northern Corn Leaf Blight", "Common Rust", "Gray Leaf Spot", "Gibberella Stalk Rot"],
    nutritionalNeeds: {
      nitrogen: "Heavy consumer (150-200 lbs/acre depending on yield goal)",
      phosphorus: "Important for early root depth and standability",
      potassium: "Promotes stalk strength and water regulation"
    },
    harvestingGuidelines: "Harvest grain at 15-20% moisture for storage or sweet corn when milky liquid flows from pierced kernel."
  },
  {
    id: "rice",
    name: "Rice",
    scientificName: "Oryza sativa",
    category: "Paddy Cereal (Poaceae)",
    image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=800&q=80",
    description: "Semi-aquatic staple grain cultivated in flooded paddy basins or upland fields. Requires stringent water-depth control and blast monitoring.",
    idealSoil: "Clayey loam with impermeable subsoil hardpan, pH 5.5 - 6.5",
    optimalTemp: "22°C - 32°C",
    waterRequirement: "Controlled water layer (3 - 7 cm depth)",
    growthStages: [
      {
        stage: "Nursery & Transplanting",
        duration: "Days 1 - 25",
        description: "Seedling nursery raising followed by puddle field transplanting.",
        keyCareTips: ["Maintain shallow 2cm water layer", "Space hills at 20x15 cm"]
      },
      {
        stage: "Tillering Phase",
        duration: "Days 26 - 55",
        description: "Clump expansion with productive primary and secondary tillers.",
        keyCareTips: ["Apply split urea topdressing", "Intermittent drying cycle for aeration"]
      },
      {
        stage: "Panicle Primordia & Heading",
        duration: "Days 56 - 85",
        description: "Panicle branch formation and emergence from boot leaf.",
        keyCareTips: ["Keep 5cm standing water layer", "Monitor for neck blast lesions"]
      },
      {
        stage: "Milk to Grain Maturity",
        duration: "Days 86 - 120+",
        description: "Starch hardening and golden yellow hue across 85% of panicles.",
        keyCareTips: ["Drain paddy 10 days before harvest", "Protect from lodging"]
      }
    ],
    commonDiseases: ["Rice Blast (Magnaporthe oryzae)", "Brown Leaf Spot", "Bacterial Leaf Blight", "Sheath Blight"],
    nutritionalNeeds: {
      nitrogen: "Split 3-phase application (transplant, tillering, panicle initiation)",
      phosphorus: "Base basal dressing for vigorous tillering",
      potassium: "Protects against lodging and improves grain weight"
    },
    harvestingGuidelines: "Harvest when 80-85% of grains turn golden straw color with moisture content ~20%."
  }
];

export const DISEASES_DATA: DiseaseData[] = [
  {
    id: "tomato-early-blight",
    crop: "Tomato",
    name: "Early Blight",
    scientificName: "Alternaria solani",
    riskLevel: "Medium",
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80",
    symptoms: [
      "Concentric dark brown rings (target board pattern) on older lower leaves",
      "Yellow chlorotic halo surrounding necrotic spots",
      "Premature leaf drop exposing fruits to sunscald",
      "Dark sunken collar rot lesions on lower stems"
    ],
    causes: [
      "Fungal spores splashing from infected soil during heavy rain or sprinkler irrigation",
      "Prolonged leaf wetness combined with warm temperatures (24-29°C)",
      "Plant stress due to heavy fruit load or low nitrogen"
    ],
    visualIndicators: {
      leaf: "Target-board circular spots with concentric rings and yellow margins",
      stem: "Dark brown sunken oval cankers near soil line",
      fruit: "Dark leathery sunken lesions at the stem attachment point"
    },
    prevention: [
      "Apply drip irrigation instead of overhead sprayers to keep foliage dry",
      "Practice 3-year crop rotation away from solanaceous species",
      "Apply organic mulch (straw/plastic) to block soil spore splash",
      "Prune bottom 12 inches of foliage after fruit set for ventilation"
    ],
    stepByStepGuidance: [
      {
        step: 1,
        title: "Inspect & Isolate Affected Canopy",
        instruction: "Carefully inspect lower tier leaves. Identify target-board brown lesions. Do not work in wet fields to prevent spore transfer on hands/tools.",
        urgency: "Immediate",
        illustrationType: "isolate"
      },
      {
        step: 2,
        title: "Sanitize & Prune Diseased Foliage",
        instruction: "Sterilize pruning shears in 70% isopropyl alcohol. Remove infected bottom leaves and drop them directly into a disposal bag.",
        urgency: "High Priority",
        illustrationType: "prune"
      },
      {
        step: 3,
        title: "Improve Field Hygiene & Mulching",
        instruction: "Layer clean straw or biodegradable mulch 5cm thick over bare soil beneath the canopy to seal splashing fungal pathogens.",
        urgency: "Medium Priority",
        illustrationType: "hygiene"
      },
      {
        step: 4,
        title: "Monitor Surrounding Rows & Adjust Irrigation",
        instruction: "Switch irrigation timers to early morning drip cycles so any accidental leaf splash evaporates rapidly under sunlight.",
        urgency: "Ongoing",
        illustrationType: "monitor"
      },
      {
        step: 5,
        title: "Consult Certified Agronomist for Control",
        instruction: "Follow certified organic copper or bio-fungicide label guidelines if severity exceeds 15% threshold. Follow product label and local agricultural expert guidance.",
        urgency: "Expert Advisory",
        illustrationType: "expert"
      }
    ],
    expertAdvisory: "Always follow the product label and local agricultural extension guidelines. Do not exceed manufacturer recommended spray intervals."
  },
  {
    id: "tomato-late-blight",
    crop: "Tomato",
    name: "Late Blight",
    scientificName: "Phytophthora infestans",
    riskLevel: "Critical",
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80",
    symptoms: [
      "Water-soaked pale green to dark brown patches expanding rapidly",
      "White fungal fuzzy mold on undersides of leaves during high humidity",
      "Foul odor in advanced field outbreaks",
      "Greasy brown rot destroying green and ripe fruits"
    ],
    causes: [
      "Oomycete water-mold thriving in cool (15-20°C), wet, foggy conditions",
      "Airborne sporangia carried for miles by wind currents"
    ],
    visualIndicators: {
      leaf: "Irregular greasy water-soaked blotches that turn purplish-black with white fluff underside",
      stem: "Black necrotic girdling patches",
      fruit: "Firm, rough, greasy brown discoloration"
    },
    prevention: [
      "Plant certified resistant hybrid cultivars",
      "Destroy volunteer tomato and potato plants in surrounding plots",
      "Provide wide row spacing for maximum wind airflow"
    ],
    stepByStepGuidance: [
      {
        step: 1,
        title: "Immediate Field Quarantine",
        instruction: "Late Blight can decimate an entire crop in 5-7 days. Immediately quarantine affected rows and flag outbreak coordinates.",
        urgency: "Critical (within 12 hrs)",
        illustrationType: "isolate"
      },
      {
        step: 2,
        title: "Cull Heavily Infected Plants",
        instruction: "Bag and safely remove severely infected stems. Never compost late-blight infested tissue in open farm piles.",
        urgency: "Critical",
        illustrationType: "prune"
      },
      {
        step: 3,
        title: "Apply Protective Barrier Sprays",
        instruction: "Consult local agronomy extensions for registered systemic protectants. Follow certified application safety gears.",
        urgency: "High Priority",
        illustrationType: "expert"
      },
      {
        step: 4,
        title: "Daily Micro-climate Scouting",
        instruction: "Record relative humidity and dew duration. High-risk alert activates when humidity exceeds 90% for >10 hours.",
        urgency: "Daily",
        illustrationType: "monitor"
      }
    ],
    expertAdvisory: "Late Blight is a community-level threat. Notify regional farmer networks if an outbreak is confirmed."
  },
  {
    id: "potato-early-blight",
    crop: "Potato",
    name: "Potato Early Blight",
    scientificName: "Alternaria solani",
    riskLevel: "Medium",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
    symptoms: [
      "Small dark brown lesions with concentric circular rings on mature leaves",
      "Yellowing leaves leading to canopy defoliation",
      "Tuber surface corky, dry, sunken dark rot"
    ],
    causes: ["Soil-borne overwintering fungal spores", "High temperature and alternate wet/dry cycles"],
    visualIndicators: {
      leaf: "Concentric target spots beginning on lowest canopy",
      fruit: "Sunken brownish-black circular dry rot on tuber skin"
    },
    prevention: ["3-year rotation away from Solanaceae", "Adequate potassium & nitrogen balance"],
    stepByStepGuidance: [
      {
        step: 1,
        title: "Scout Lower Canopy",
        instruction: "Examine canopy base after tuber initiation.",
        urgency: "Medium",
        illustrationType: "monitor"
      },
      {
        step: 2,
        title: "Remove Leaf Debris",
        instruction: "Safely discard fallen leaflets showing target spots.",
        urgency: "High",
        illustrationType: "prune"
      },
      {
        step: 3,
        title: "Optimise Nitrogen Application",
        instruction: "Avoid nutrient depletion during tuber bulking to maintain plant vigor.",
        urgency: "Medium",
        illustrationType: "hygiene"
      }
    ],
    expertAdvisory: "Maintain balanced nutrition to reduce plant physiological susceptibility."
  },
  {
    id: "potato-late-blight",
    crop: "Potato",
    name: "Potato Late Blight",
    scientificName: "Phytophthora infestans",
    riskLevel: "Critical",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
    symptoms: [
      "Water-soaked dark lesions spreading across leaflets",
      "White fungal downy growth on leaf undersides during humid mornings",
      "Tubers develop granular reddish-brown dry rot below the skin"
    ],
    causes: ["Cool wet weather", "Infected seed tubers planted in spring"],
    visualIndicators: {
      leaf: "Water soaked rapidly blackening lesions",
      fruit: "Rusty brown dry granular rot under skin"
    },
    prevention: ["Plant certified disease-free seed", "Hill ridges high to shield tubers from spore wash"],
    stepByStepGuidance: [
      {
        step: 1,
        title: "Inspect Seed Lot & Fields",
        instruction: "Inspect fields during cool, overcast mornings for mildew smell and leaf margins.",
        urgency: "Critical",
        illustrationType: "isolate"
      },
      {
        step: 2,
        title: "Kill Vines Before Digging",
        instruction: "Desiccate infected vines 2 weeks prior to harvest so spores die before tuber lifting.",
        urgency: "High",
        illustrationType: "hygiene"
      }
    ],
    expertAdvisory: "Never store tubers harvested from fields with active Late Blight infection."
  },
  {
    id: "corn-leaf-blight",
    crop: "Corn",
    name: "Northern Corn Leaf Blight",
    scientificName: "Exserohilum turcicum",
    riskLevel: "High",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80",
    symptoms: [
      "Cigar-shaped grayish-green to tan lesions (1 to 6 inches long)",
      "Lesions parallel to leaf veins that expand and coalesce",
      "Dirty gray fuzz on lesion surface in damp morning weather"
    ],
    causes: ["Fungal spores overwintering on corn residue", "Moderate temps (18-27°C) with long dew periods"],
    visualIndicators: {
      leaf: "Long elliptical cigar-shaped tan lesions along leaf blade"
    },
    prevention: ["Crop rotation with soybeans or pulses", "Tillage to bury infected stalk debris"],
    stepByStepGuidance: [
      {
        step: 1,
        title: "Assess Ear Leaf Status",
        instruction: "Scout the ear leaf and two leaves below it during silking. If lesions appear before tasseling, yield impact can be severe.",
        urgency: "High",
        illustrationType: "monitor"
      },
      {
        step: 2,
        title: "Crop Canopy Aeration",
        instruction: "Avoid excessively dense row configurations in river bottom fields prone to prolonged morning fog.",
        urgency: "Medium",
        illustrationType: "hygiene"
      }
    ],
    expertAdvisory: "Select hybrids with strong multi-gene Ht resistance for high-pressure regions."
  },
  {
    id: "rice-blast",
    crop: "Rice",
    name: "Rice Blast",
    scientificName: "Magnaporthe oryzae",
    riskLevel: "Critical",
    image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=800&q=80",
    symptoms: [
      "Diamond or spindle-shaped lesions with gray/whitish centers and reddish-brown margins",
      "Node blast causing blackening and breakage of stem joints",
      "Neck blast causing panicle breakage and blank chaffy grains"
    ],
    causes: ["Excessive nitrogen fertilization", "High humidity (>90%) with temperature fluctuations"],
    visualIndicators: {
      leaf: "Spindle-shaped diamond spots with pointy ends",
      stem: "Black rotten neck node causing drooping white panicles"
    },
    prevention: ["Avoid excessive single-dose urea applications", "Maintain continuous 5cm water level in paddy"],
    stepByStepGuidance: [
      {
        step: 1,
        title: "Water Level Adjustment",
        instruction: "Maintain continuous flood layer. Drought stress significantly predisposes rice plants to blast.",
        urgency: "High",
        illustrationType: "monitor"
      },
      {
        step: 2,
        title: "Split Nitrogen Topdressing",
        instruction: "Do not apply heavy urea in single doses during panicle emergence.",
        urgency: "Immediate",
        illustrationType: "hygiene"
      }
    ],
    expertAdvisory: "Neck blast infection at heading causes complete grain sterility. Preventative scouting is vital."
  },
  {
    id: "healthy-plant",
    crop: "General",
    name: "Healthy & Vigorous",
    scientificName: "Optimal Agronomic State",
    riskLevel: "Low",
    image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80",
    symptoms: [
      "Uniform chlorophyll distribution and vibrant green pigmentation",
      "Crisp leaf margins with zero necrosis or chlorosis",
      "Strong vascular turgidity and healthy root-shoot ratio"
    ],
    causes: ["Ideal agronomic practices, balanced nutrient profile, and optimal moisture balance"],
    visualIndicators: {
      leaf: "Clean vibrant green lamina with active stomatal conductance"
    },
    prevention: ["Continue standard scouting schedule", "Maintain regular soil moisture monitoring"],
    stepByStepGuidance: [
      {
        step: 1,
        title: "Maintain Standard Irrigation & Scouting",
        instruction: "Plant exhibits excellent turgor and nutrient balance. Continue planned irrigation and integrated pest scouting.",
        urgency: "Routine",
        illustrationType: "monitor"
      }
    ],
    expertAdvisory: "Great job! Keep up regular preventative checks and soil nutrient testing."
  }
];

export const EQUIPMENT_DATA: EquipmentData[] = [
  {
    id: "tractor-x900",
    name: "AgriPro X-900 Smart Tractor",
    category: "Heavy Field Traction & Power Unit",
    image: "https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&w=800&q=80",
    description: "Next-gen 120 HP agricultural power unit equipped with GPS autosteer, telemetry sensors, and heavy-duty 3-point hitch and PTO shaft.",
    specs: {
      "Engine Power": "120 HP @ 2200 RPM",
      "PTO Speed": "540 / 1000 Dual RPM",
      "Hydraulic Lift": "4500 kg Capacity",
      "Fuel Tank": "180 Liters Bio-Diesel Ready"
    },
    components: [
      {
        id: "engine",
        name: "Turbocharged Diesel Engine Bay",
        position: [0, 0.4, 1.2],
        description: "High-efficiency common-rail diesel engine with pre-cleaner air intake and dual fuel water separators.",
        safetyChecklist: [
          "Check engine oil dipstick level before cold startup",
          "Inspect radiator coolant level and debris screen",
          "Ensure turbo air filter indicator is not red"
        ],
        maintenanceCycle: "Every 250 operational hours"
      },
      {
        id: "brake",
        name: "Dual Wet-Disc Brake Interlock",
        position: [-0.6, -0.2, -0.4],
        description: "Independent left/right steering brakes with master highway interlock latch.",
        safetyChecklist: [
          "ALWAYS engage the brake pedal interlock lock-pin for road transport",
          "Test parking handbrake hold on 15% incline",
          "Verify hydraulic brake fluid reservoir is between Min and Max"
        ],
        maintenanceCycle: "Every 500 operational hours"
      },
      {
        id: "pto",
        name: "Power Take-Off (PTO) & 3-Point Hitch",
        position: [0, 0.1, -1.8],
        description: "Heavy rotational power shaft (540/1000 RPM) for driving rotavators, balers, and sprayers.",
        safetyChecklist: [
          "NEVER step over or reach near an active rotating PTO shaft",
          "Ensure full 360° PTO master shield and implement guard are securely latched",
          "Always disengage PTO clutch before dismounting the cab"
        ],
        maintenanceCycle: "Grease universal joints every 50 hours"
      },
      {
        id: "cab",
        name: "ROPS Certified Operator Cockpit",
        position: [0, 1.1, -0.3],
        description: "Roll-Over Protective Structure (ROPS) cab with air suspension seat and multi-function telemetry touch terminal.",
        safetyChecklist: [
          "Fasten seatbelt whenever ROPS structure is upright",
          "Keep cabin glass clean and side mirrors aligned",
          "Verify emergency hazard flashers and beacon lights"
        ],
        maintenanceCycle: "Clean cabin air microfilter monthly"
      }
    ],
    safetyProtocols: [
      "Always engage parking brake and shut off engine before inspection",
      "Wear snug-fitting clothing with no dangling cords near shafts",
      "Keep bystanders at least 15 meters clear during implement operation"
    ]
  },
  {
    id: "sprayer-3000",
    name: "Ultrasonic Precision Boom Sprayer",
    category: "Crop Protection & Foliar Delivery",
    image: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80",
    description: "Self-leveling 24-meter hydraulic boom sprayer featuring individual pulse-width modulation (PWM) nozzle control and drift-reduction air induction.",
    specs: {
      "Boom Width": "24 Meters (Foldable)",
      "Tank Capacity": "1200 Liters Polyethylene",
      "Pressure Range": "1.5 - 6.0 Bar PWM",
      "Nozzle Spacing": "50 cm Tri-Jet Turrets"
    },
    components: [
      {
        id: "tank",
        name: "Chemical Mixing & Rinse Tank",
        position: [0, 0.5, 0],
        description: "Graduated tank with hydraulic induction hopper and fresh water wash system.",
        safetyChecklist: [
          "Always wear chemical PPE (goggles, nitrile gloves, respirator)",
          "Inspect tank lid seal for zero weeping leaks",
          "Ensure clean water safety eye-wash reservoir is full"
        ],
        maintenanceCycle: "Triple-rinse after every chemical batch"
      },
      {
        id: "boom",
        name: "Ultrasonic Auto-Height Spray Boom",
        position: [0, 0.8, -1.2],
        description: "Carbon fiber truss wings equipped with sonar sensors to maintain exact 50cm canopy clearance.",
        safetyChecklist: [
          "Inspect hydraulic boom folding latches and safety pins",
          "Check nozzle spray pattern for streaking or clogging",
          "Verify diaphragm check-valves prevent dripping"
        ],
        maintenanceCycle: "Clean inline line filters daily"
      }
    ],
    safetyProtocols: [
      "Calibrate flow meters with water before mixing active chemicals",
      "Check wind speed: Never spray in winds exceeding 15 km/h to prevent drift",
      "Dispose of rinse water according to local environmental regulations"
    ]
  },
  {
    id: "drone-pro",
    name: "AeroCrop Multi-Spectrum Ag Drone",
    category: "Aerial Scouting & Targeted Spraying",
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80",
    description: "Hexacopter RTK-guided agricultural drone capable of NDVI multispectral crop scouting and 16L precision spot-spraying.",
    specs: {
      "Payload": "16 Kg / 16 Liters",
      "Flight Time": "22 Minutes with full payload",
      "Positioning": "Centimeter RTK GNSS",
      "Sensor": "RGB + 5-Band Multispectral (NDRE/NDVI)"
    },
    components: [
      {
        id: "rotors",
        name: "Carbon Folding Propellers & Motors",
        position: [0, 0.3, 0],
        description: "Brushless waterproof motors with dynamic balancing.",
        safetyChecklist: [
          "Check rotor blades for micro-cracks or nicked leading edges",
          "Ensure battery lock is clicked in securely",
          "Verify propeller rotation direction matches arm markings"
        ],
        maintenanceCycle: "Inspect before every takeoff"
      },
      {
        id: "camera",
        name: "Gimbal Multispectral Sensor",
        position: [0, -0.2, 0.3],
        description: "Calibrated down-welling light sensor and 4K optical camera.",
        safetyChecklist: [
          "Clean lens optics with microfiber cloth",
          "Run white-balance calibration tile test before mapping flight"
        ],
        maintenanceCycle: "Calibrate IMU weekly"
      }
    ],
    safetyProtocols: [
      "Maintain Visual Line of Sight (VLOS) at all times",
      "Set Return-To-Home (RTH) altitude higher than tallest farm obstacles"
    ]
  },
  {
    id: "irrigation-pivot",
    name: "Smart Center-Pivot Irrigation Rig",
    category: "Precision Water & Fertigation",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80",
    description: "Automated span pivot equipped with soil moisture telemetry, variable rate irrigation (VRI), and solar telemetry control.",
    specs: {
      "Span Length": "200 Meters (4 Spans)",
      "Flow Rate": "800 GPM @ 40 PSI",
      "Drive": "Electric Planetary Gearbox",
      "Control": "Cloud VRI & Soil Moisture Linked"
    },
    components: [
      {
        id: "center-point",
        name: "Pivot Center & Collector Ring",
        position: [0, 1.0, 0],
        description: "Main water inlet swivel and high-voltage slip-ring collector.",
        safetyChecklist: [
          "Lockout/Tagout electrical master switch before service",
          "Inspect main pressure gauge for steady operating pressure",
          "Check tire pressures on all tower planetary wheelbases"
        ],
        maintenanceCycle: "Grease center pivot seal quarterly"
      }
    ],
    safetyProtocols: [
      "Ensure path of pivot wheels is clear of farm machinery and wire fences",
      "Disconnect power before opening electrical control boxes"
    ]
  }
];

export const TRAINING_MODULES_DATA: TrainingModuleData[] = [
  {
    id: "module-tractor-safety",
    title: "Tractor Safety Inspection & Pre-Op Check",
    category: "Equipment Operation",
    difficulty: "Beginner",
    duration: "5 min",
    badge: "Master Inspector",
    description: "Master the mandatory 5-point daily pre-operation checklist on the AgriPro X-900 tractor before turning the ignition key.",
    learningObjectives: [
      "Identify the 4 key safety zones on a utility tractor",
      "Inspect engine oil and cooling system for field readiness",
      "Verify brake interlock lock-pin for road transport",
      "Demonstrate zero-contact safety protocol around PTO shafts"
    ],
    interactive3DType: "tractor",
    steps: [
      {
        stepNumber: 1,
        title: "Locate & Inspect Engine Bay",
        targetComponentId: "engine",
        instruction: "Click or tap on the FRONT ENGINE BAY of the 3D tractor to inspect oil level, air filter, and coolant reservoir.",
        feedbackSuccess: "Engine Bay verified! Dipstick level is full and radiator screen is clean of chaff.",
        feedbackError: "That is not the engine bay. Look near the front hood of the tractor.",
        hint: "The engine is located under the front hood of the tractor."
      },
      {
        stepNumber: 2,
        title: "Inspect Dual Brake Interlock",
        targetComponentId: "brake",
        instruction: "Click or tap on the BRAKE SYSTEM pedals on the right side of the operator station.",
        feedbackSuccess: "Brakes verified! The interlock latch is securely locked for transport stability.",
        feedbackError: "Not the brake pedals. Look near the side foot controls of the operator cab.",
        hint: "Check near the lower right side beneath the operator seat."
      },
      {
        stepNumber: 3,
        title: "Verify PTO Shaft & Safety Guard",
        targetComponentId: "pto",
        instruction: "Click or tap on the REAR PTO (Power Take-Off) shaft and verify the 360° shield.",
        feedbackSuccess: "PTO Safety Shield confirmed! Master shield is in place with zero rotation play.",
        feedbackError: "Not the PTO. The PTO shaft is located at the very rear between the 3-point hitch arms.",
        hint: "Navigate to the back of the tractor to inspect the power take-off shaft."
      },
      {
        stepNumber: 4,
        title: "Verify ROPS Cab & Operator Seat",
        targetComponentId: "cab",
        instruction: "Click or tap on the ROPS CABIN to inspect the seatbelt and emergency beacon lights.",
        feedbackSuccess: "Operator Cabin verified! Seatbelt retractor and emergency beacons are functional.",
        feedbackError: "Look at the main operator cabin in the upper center.",
        hint: "Tap on the enclosed operator cockpit on top."
      },
      {
        stepNumber: 5,
        title: "Complete Pre-Operation Safety Checklist",
        targetComponentId: "engine",
        instruction: "Tap the ENGINE one last time to confirm ignition clear zone protocol.",
        feedbackSuccess: "All 5 safety inspection zones cleared! Tractor is approved for field deployment.",
        feedbackError: "Confirm the ignition master switch at the front.",
        hint: "Click the engine unit to finalize the checklist."
      }
    ],
    quiz: [
      {
        id: "q1",
        question: "Why MUST the brake pedal interlock latch be connected when driving a tractor on public roads?",
        options: [
          "To save fuel and reduce engine RPM",
          "To ensure both wheels brake evenly and prevent rollover from sudden swerves",
          "To allow tighter turning circles around sharp corners",
          "To disengage the rear PTO automatically"
        ],
        correctIndex: 1,
        explanation: "If individual brake pedals are pressed at high road speeds without being locked together, one wheel will lock up, causing the tractor to violently spin and roll over."
      },
      {
        id: "q2",
        question: "What is the primary danger associated with an exposed rotating PTO shaft?",
        options: [
          "Electrical shock from the alternator",
          "Rapid entanglement of loose clothing leading to severe or fatal injury",
          "Overheating of hydraulic fluid",
          "Damage to tire tread"
        ],
        correctIndex: 1,
        explanation: "A PTO shaft rotating at 540 RPM completes 9 revolutions per second. It can entangle clothing faster than human reaction time (less than 1/4 second)."
      },
      {
        id: "q3",
        question: "When should the operator fasten their seatbelt on a tractor?",
        options: [
          "Only when driving above 30 km/h",
          "Never, so they can jump off in an emergency",
          "Whenever the ROPS (Roll-Over Protective Structure) is in the locked upright position",
          "Only when operating with a heavy rear plow"
        ],
        correctIndex: 2,
        explanation: "ROPS and seatbelts work together as a survival capsule. The seatbelt holds the operator within the protected zone during an overturn."
      },
      {
        id: "q4",
        question: "How often should you inspect the tractor engine oil and cooling screens during heavy harvest season?",
        options: [
          "Daily before starting the engine",
          "Once a month",
          "Only when the engine warning light stays on",
          "Once every 500 hours"
        ],
        correctIndex: 0,
        explanation: "Daily pre-op checks catch chaff buildup and oil leaks early, preventing catastrophic engine fires and mechanical seizures."
      }
    ]
  },
  {
    id: "module-crop-planting",
    title: "Precision Crop Planting & Seedbed Setup",
    category: "Agronomy Basics",
    difficulty: "Beginner",
    duration: "6 min",
    badge: "Soil Maestro",
    description: "Learn optimal seedbed tilth, soil moisture assessment, seed depth calibration, and spacing for high-germination crops.",
    learningObjectives: [
      "Assess soil moisture using the ribbon test",
      "Calibrate planter disc depth for tomato vs corn seeds",
      "Understand soil compaction and furrow closure"
    ],
    interactive3DType: "farm",
    steps: [
      {
        stepNumber: 1,
        title: "Scout Seedbed Tilth & Moisture",
        targetComponentId: "crop-zone",
        instruction: "Explore the 3D Virtual Farm and tap on the GREEN CROP ZONE to measure seedbed soil moisture.",
        feedbackSuccess: "Soil moisture measured at 22% (ideal field capacity)! Crumbly tilth with zero crusting.",
        feedbackError: "Navigate toward the green crop field plots in the farm.",
        hint: "Click on the main field crop rows in the 3D scene."
      },
      {
        stepNumber: 2,
        title: "Calibrate Seeder Depth",
        targetComponentId: "equipment-zone",
        instruction: "Tap the EQUIPMENT ZONE to configure seeder opener depth to 1.5 inches for corn.",
        feedbackSuccess: "Seeder depth calibrated! Firm seed-to-soil contact established.",
        feedbackError: "Look for the equipment parking zone near the tractor shed.",
        hint: "Click on the tractor/machinery area."
      },
      {
        stepNumber: 3,
        title: "Engage Furrow Press Wheels",
        targetComponentId: "crop-zone",
        instruction: "Return to the CROP ZONE to verify press wheel closure over the seed furrow.",
        feedbackSuccess: "Furrow closed smoothly without air pockets! Ready for emergence.",
        feedbackError: "Tap the crop field zone.",
        hint: "Select the crop field zone to complete planting."
      }
    ],
    quiz: [
      {
        id: "q_p1",
        question: "What happens if seeds are planted into excessively wet soil with high clay content?",
        options: [
          "Seeds germinate twice as fast",
          "Furrow sidewall smearing occurs, restricting root growth and causing poor emergence",
          "Soil temperature increases significantly",
          "Weeds are permanently eliminated"
        ],
        correctIndex: 1,
        explanation: "Planter discs smear wet clay into slick, hard walls that prevent roots from expanding into surrounding soil."
      },
      {
        id: "q_p2",
        question: "What is the general rule of thumb for seed planting depth?",
        options: [
          "Always 6 inches deep regardless of seed size",
          "Approximately 1.5 to 2 times the seed's diameter in moist soil",
          "Right on the bare surface without soil cover",
          "As deep as the planter can possibly dig"
        ],
        correctIndex: 1,
        explanation: "Planting too deep depletes the seed's stored energy before emergence, while planting too shallow causes desiccation."
      }
    ]
  },
  {
    id: "module-disease-identification",
    title: "AI & Visual Foliar Disease Scouting",
    category: "Plant Pathology",
    difficulty: "Intermediate",
    duration: "7 min",
    badge: "Pathology Scout",
    description: "Learn to distinguish between fungal blights, bacterial specks, and abiotic nutrient deficiencies under field conditions.",
    learningObjectives: [
      "Identify target-board lesions of Early Blight vs water-soaked Late Blight",
      "Recognize nutrient deficiency patterns (interveinal chlorosis vs necrosis)",
      "Execute sanitation protocols to prevent pathogen transfer between fields"
    ],
    interactive3DType: "plant",
    steps: [
      {
        stepNumber: 1,
        title: "Scan Lower Canopy Foliage",
        targetComponentId: "leaf-lower",
        instruction: "Inspect the lower leaf tier where soil-splashed Alternaria spores first germinate.",
        feedbackSuccess: "Lower leaf scouted! Detected early circular brown spot with chlorotic halo.",
        feedbackError: "Focus on the bottom leaves closest to the root zone.",
        hint: "Tap on the lower leaves of the 3D plant."
      },
      {
        stepNumber: 2,
        title: "Check Underside for Fungal Sporulation",
        targetComponentId: "leaf-underside",
        instruction: "Inspect the underside of the affected leaf to check for downy white mildew or dry sporulation.",
        feedbackSuccess: "Sporulation checked! Dry concentric rings confirmed Early Blight (Alternaria solani).",
        feedbackError: "Examine the underside surface of the leaf.",
        hint: "Rotate the plant to check the leaf underside."
      },
      {
        stepNumber: 3,
        title: "Prune and Bag Infested Leaves",
        targetComponentId: "stem",
        instruction: "Tap the stem node to execute clean pruning cut 1cm away from main stem.",
        feedbackSuccess: "Clean pruning executed! Diseased tissue bagged for off-field destruction.",
        feedbackError: "Select the stem attachment point.",
        hint: "Tap the main stem node."
      }
    ],
    quiz: [
      {
        id: "q_d1",
        question: "Which visual symptom is the classic hallmark of Early Blight (Alternaria solani) on tomato leaves?",
        options: [
          "Uniform powdery white dust across entire plant",
          "Concentric dark brown rings resembling a bullseye/target-board with yellow halo",
          "Translucent greasy water blisters on flower petals",
          "Mosaic purple streaks on fruit skin"
        ],
        correctIndex: 1,
        explanation: "Concentric rings surrounded by chlorotic yellow halos are the distinctive visual indicator of Alternaria solani."
      },
      {
        id: "q_d2",
        question: "Why should farmers avoid pruning or harvesting wet tomato crops after rain or heavy dew?",
        options: [
          "Wet leaves are too slippery to hold",
          "Water droplets transport fungal spores and bacteria across wounded stems rapidly",
          "Sunlight will boil the leaves immediately",
          "Pruning tools become rusty instantly"
        ],
        correctIndex: 1,
        explanation: "Free moisture facilitates the rapid swimming and transfer of bacterial and fungal pathogens through tool wounds."
      }
    ]
  },
  {
    id: "module-irrigation-basics",
    title: "Smart Pivot & Drip Irrigation Calibration",
    category: "Water Management",
    difficulty: "Intermediate",
    duration: "5 min",
    badge: "Hydro Specialist",
    description: "Calibrate application rate, pressure regulators, and soil moisture sensor telemetry to optimize water use efficiency.",
    learningObjectives: [
      "Understand evapotranspiration (ETc) replacement",
      "Check nozzle droplet size to prevent wind drift",
      "Interpret capacitance soil moisture sensor curves"
    ],
    interactive3DType: "farm",
    steps: [
      {
        stepNumber: 1,
        title: "Locate Irrigation Pivot Center",
        targetComponentId: "irrigation-zone",
        instruction: "Navigate to the IRRIGATION ZONE on the 3D farm and inspect the water pressure gauge.",
        feedbackSuccess: "Pressure gauge verified at 42 PSI! Line pressure is stable.",
        feedbackError: "Find the circular pivot structure in the irrigation quadrant.",
        hint: "Click the irrigation zone with the water pivot."
      },
      {
        stepNumber: 2,
        title: "Verify Nozzle Spray Uniformity",
        targetComponentId: "crop-zone",
        instruction: "Inspect the end-gun droplet pattern over the crop canopy.",
        feedbackSuccess: "Droplet size optimized! Uniform overlap achieved without runoff pooling.",
        feedbackError: "Look at the irrigated field area.",
        hint: "Select the crop zone."
      }
    ],
    quiz: [
      {
        id: "q_i1",
        question: "What is the primary benefit of Variable Rate Irrigation (VRI) over conventional uniform pivot watering?",
        options: [
          "It sprays pesticides automatically without water",
          "It applies precise water depths to specific field zones based on soil type and topography, eliminating overwatering in depressions",
          "It eliminates the need for any water pumps",
          "It warms the soil up during freezing winters"
        ],
        correctIndex: 1,
        explanation: "VRI modulates nozzle pulse rates to match varying soil water holding capacities across diverse field topography."
      }
    ]
  },
  {
    id: "module-harvesting-basics",
    title: "Grain Combine & Fruit Harvest Readiness",
    category: "Harvest Operations",
    difficulty: "Advanced",
    duration: "8 min",
    badge: "Harvest Master",
    description: "Determine crop maturity indices, calibrate combine cylinder speeds, minimize grain loss, and ensure post-harvest quality.",
    learningObjectives: [
      "Measure grain moisture using handheld dielectric meters",
      "Adjust combine reel and concaves for clean separation",
      "Implement post-harvest cooling to extend shelf life"
    ],
    interactive3DType: "farm",
    steps: [
      {
        stepNumber: 1,
        title: "Check Grain Maturity in Field",
        targetComponentId: "crop-zone",
        instruction: "Tap the CROP ZONE to collect kernel samples for moisture testing.",
        feedbackSuccess: "Corn moisture tested at 18.5%! Optimal window for combine harvest with minimal crackage.",
        feedbackError: "Navigate to the golden corn plot in the farm.",
        hint: "Click the crop zone."
      },
      {
        stepNumber: 2,
        title: "Inspect Combine Header & Rotor",
        targetComponentId: "equipment-zone",
        instruction: "Tap the EQUIPMENT ZONE to inspect gatherer chains and concave clearance.",
        feedbackSuccess: "Concave gap calibrated! Rotor speed adjusted for zero kernel shatter.",
        feedbackError: "Tap the machinery area.",
        hint: "Select the equipment zone."
      }
    ],
    quiz: [
      {
        id: "q_h1",
        question: "What is the target moisture percentage for long-term safe storage of shelled corn without artificial drying?",
        options: [
          "30% - 35%",
          "14% - 15%",
          "5% - 8%",
          "45% - 50%"
        ],
        correctIndex: 1,
        explanation: "Grain stored above 15% moisture rapidly develops mycotoxins and heating from fungal respiration."
      }
    ]
  }
];

export const COMMUNITY_NOTES_DATA: CommunityNote[] = [
  {
    id: "note-1",
    author: "Ramesh Patel",
    role: "Progressive Farmer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    timeAgo: "2 hours ago",
    location: "Nashik, Maharashtra",
    crop: "Tomato",
    title: "Concentric rings on lower leaves after unseasonal night rain",
    content: "Noticed these brown bullseye spots spreading on my early variety tomatoes. Used AgriLens AR scanner and it predicted 91% Early Blight. Pruned lower foliage and applied bio-trichoderma. Any other tips for humidity control?",
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80",
    upvotes: 24,
    commentsCount: 3,
    solved: true,
    comments: [
      {
        id: "c1",
        author: "Dr. Ananya Sharma",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
        role: "Agronomist / Extension Specialist",
        content: "Spot on detection Ramesh. Make sure you don't compost those pruned leaves nearby. Keep your drip lines at 30cm spacing to keep the root base ventilated.",
        timestamp: "1 hour ago"
      },
      {
        id: "c2",
        author: "Vikram Reddy",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
        role: "Farmer",
        content: "Had the same issue last season. Adding straw mulch immediately stopped the spores from splashing back up during morning irrigation.",
        timestamp: "45 mins ago"
      }
    ]
  },
  {
    id: "note-2",
    author: "Priya Sundaram",
    role: "Agriculture Student",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    timeAgo: "5 hours ago",
    location: "Guntur, Andhra Pradesh",
    crop: "Rice / Paddy",
    title: "Spindle-shaped diamond lesions on paddy seedlings",
    content: "Ran the AgriLens AR Field Scanner on our experimental paddy plots. Identified early Rice Blast with 94% confidence. We immediately adjusted flood water levels to 5cm.",
    image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=800&q=80",
    upvotes: 42,
    commentsCount: 2,
    solved: false,
    comments: [
      {
        id: "c3",
        author: "Dr. K. Srinivas",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80",
        role: "Senior Plant Pathologist",
        content: "Good observation Priya. Ensure you avoid further urea topdressing until the diamond lesions stabilize.",
        timestamp: "3 hours ago"
      }
    ]
  },
  {
    id: "note-3",
    author: "Harpreet Singh",
    role: "Agronomist",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    timeAgo: "1 day ago",
    location: "Ludhiana, Punjab",
    crop: "Potato",
    title: "Pre-harvest tuber vine desiccation best practices",
    content: "Sharing field results: Killing potato vines 14 days before harvest reduced late-blight skin infection down to <0.5% in cold storage lots. Highly recommend everyone check the 3D equipment module for sprayer calibration!",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80",
    upvotes: 56,
    commentsCount: 4,
    solved: true,
    comments: []
  }
];

export const PREDICTIVE_RISK_RADAR = {
  forecastDays: [
    { day: "Mon", date: "Sep 26", temp: "27°C", humidity: "84%", rainChance: "70%", riskScore: 78, threat: "Early Blight Spore Surge" },
    { day: "Tue", date: "Sep 27", temp: "26°C", humidity: "90%", rainChance: "85%", riskScore: 88, threat: "High Humidity Leaf Infection" },
    { day: "Wed", date: "Sep 28", temp: "28°C", humidity: "76%", rainChance: "40%", riskScore: 62, threat: "Moderate Spore Dispersal" },
    { day: "Thu", date: "Sep 29", temp: "29°C", humidity: "65%", rainChance: "20%", riskScore: 45, threat: "Low Risk - Favorable" },
    { day: "Fri", date: "Sep 30", temp: "30°C", humidity: "60%", rainChance: "10%", riskScore: 30, threat: "Optimal Spray Window" },
    { day: "Sat", date: "Oct 01", temp: "31°C", humidity: "58%", rainChance: "5%", riskScore: 25, threat: "Dry & Clear" },
    { day: "Sun", date: "Oct 02", temp: "30°C", humidity: "62%", rainChance: "15%", riskScore: 28, threat: "Low Risk" }
  ],
  overallRiskLevel: "High Risk (Next 48 Hours)",
  recommendedAction: "Apply preventative organic bio-fungicide barrier before Tuesday morning rain event."
};
