import React, { useState, useEffect } from "react";
import { 
  ProjectInfo, 
  MaterialItem, 
  LaborItem, 
  EquipmentItem, 
  ConcreteElement, 
  FormworkElement, 
  CHBWallElement, 
  TileElement, 
  DoorWindowElement, 
  RoofingElement, 
  PaintingElement,
  DivisionTotals
} from "./types";

import defaultEstimateData from "./defaultEstimate.json";

import { 
  calculateConcreteVolume, 
  calculateConcreteMaterials, 
  calculateConcreteRebar, 
  REBAR_KG_PER_M,
  calculateFormworkMaterials,
  calculateCHBWallMaterials,
  calculateTileMaterials,
  calculateDoorWindowCost,
  calculateRoofingMaterials,
  calculatePaintingMaterials,
  calculateConcreteLaborCost,
  calculateFormworkLaborCost,
  calculateCHBLaborCost,
  calculateTileLaborCost,
  calculatePaintingLaborCost,
  calculateRoofingLaborAndEquip
} from "./utils/calculations";

import DashboardView, { EstimateFileData } from "./components/DashboardView";
import ProjectInfoView from "./components/ProjectInfoView";
import ConcreteEstimator from "./components/ConcreteEstimator";
import FormworkEstimator from "./components/FormworkEstimator";
import CHBWallEstimator from "./components/CHBWallEstimator";
import TilingEstimator from "./components/TilingEstimator";
import DoorsWindowsEstimator from "./components/DoorsWindowsEstimator";
import RoofingEstimator from "./components/RoofingEstimator";
import PaintingEstimator from "./components/PaintingEstimator";
import DatabaseView from "./components/DatabaseView";
import BOQView from "./components/BOQView";
import SavedEstimatesView, { SavedEstimate } from "./components/SavedEstimatesView";
import HelpView from "./components/HelpView";
import AccountView from "./components/AccountView";

import { 
  Calculator, 
  Layers, 
  Database, 
  Wrench, 
  FileSpreadsheet, 
  FolderGit2, 
  Home, 
  Activity, 
  HardHat, 
  Paintbrush, 
  Construction, 
  Maximize2,
  Calendar,
  Lock,
  RotateCcw,
  User,
  HelpCircle,
  Menu,
  X,
  FileText,
  AlertTriangle,
  FlameKindling
} from "lucide-react";

type DefaultEstimateTemplate = {
  projectInfo: ProjectInfo;
  materials: MaterialItem[];
  labor: LaborItem[];
  equipment: EquipmentItem[];
  concrete: ConcreteElement[];
  formworks: FormworkElement[];
  chb: CHBWallElement[];
  tiles: TileElement[];
  doorsWindows: DoorWindowElement[];
  roofing: RoofingElement[];
  painting: PaintingElement[];
};

const DEFAULT_ESTIMATE = defaultEstimateData as DefaultEstimateTemplate;
const DEFAULT_ESTIMATE_VERSION = `${(defaultEstimateData as { exportedAt?: string }).exportedAt ?? "001-JUN29"}:${DEFAULT_ESTIMATE.projectInfo.projectName}`;
const DEFAULT_ESTIMATE_VERSION_KEY = "strucforge_default_estimate_version";

const cloneTemplate = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "project" | "concrete" | "formwork" | "chb" | "tiles" | "doorsWindows" | "roofing" | "painting" | "database" | "boq" | "saved" | "account" | "help" | "newEstimate"
  >("dashboard");

  // Loading and Offline States (Mobile App requirements)
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(window.navigator.onLine);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const shouldUseBundledDefault = localStorage.getItem(DEFAULT_ESTIMATE_VERSION_KEY) !== DEFAULT_ESTIMATE_VERSION;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Core Engineering States
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>(() => {
    const saved = localStorage.getItem("estim_projectInfo");
    return saved && !shouldUseBundledDefault ? JSON.parse(saved) : cloneTemplate(DEFAULT_ESTIMATE.projectInfo);
  });

  const [materials, setMaterials] = useState<MaterialItem[]>(() => {
    const saved = localStorage.getItem("estim_materials");
    return saved && !shouldUseBundledDefault ? JSON.parse(saved) : cloneTemplate(DEFAULT_ESTIMATE.materials);
  });

  const [labor, setLabor] = useState<LaborItem[]>(() => {
    const saved = localStorage.getItem("estim_labor");
    if (saved && !shouldUseBundledDefault) {
      const parsed = JSON.parse(saved) as LaborItem[];
      const merged = [...parsed];
      DEFAULT_ESTIMATE.labor.forEach((d) => {
        if (!merged.some((item) => item.id === d.id)) {
          merged.push(d);
        }
      });
      return merged;
    }
    return cloneTemplate(DEFAULT_ESTIMATE.labor);
  });

  const [equipment, setEquipment] = useState<EquipmentItem[]>(() => {
    const saved = localStorage.getItem("estim_equipment");
    if (saved && !shouldUseBundledDefault) {
      const parsed = JSON.parse(saved) as EquipmentItem[];
      const merged = [...parsed];
      DEFAULT_ESTIMATE.equipment.forEach((d) => {
        if (!merged.some((item) => item.id === d.id)) {
          merged.push(d);
        }
      });
      return merged;
    }
    return cloneTemplate(DEFAULT_ESTIMATE.equipment);
  });

  const [concrete, setConcrete] = useState<ConcreteElement[]>(() => {
    const saved = localStorage.getItem("estim_concrete");
    return saved && !shouldUseBundledDefault ? JSON.parse(saved) : cloneTemplate(DEFAULT_ESTIMATE.concrete);
  });

  const [formworks, setFormworks] = useState<FormworkElement[]>(() => {
    const saved = localStorage.getItem("estim_formworks");
    return saved && !shouldUseBundledDefault ? JSON.parse(saved) : cloneTemplate(DEFAULT_ESTIMATE.formworks);
  });

  const [chb, setChb] = useState<CHBWallElement[]>(() => {
    const saved = localStorage.getItem("estim_chb");
    return saved && !shouldUseBundledDefault ? JSON.parse(saved) : cloneTemplate(DEFAULT_ESTIMATE.chb);
  });

  const [tiles, setTiles] = useState<TileElement[]>(() => {
    const saved = localStorage.getItem("estim_tiles");
    return saved && !shouldUseBundledDefault ? JSON.parse(saved) : cloneTemplate(DEFAULT_ESTIMATE.tiles);
  });

  const [doorsWindows, setDoorsWindows] = useState<DoorWindowElement[]>(() => {
    const saved = localStorage.getItem("estim_doorsWindows");
    return saved && !shouldUseBundledDefault ? JSON.parse(saved) : cloneTemplate(DEFAULT_ESTIMATE.doorsWindows);
  });

  const [roofing, setRoofing] = useState<RoofingElement[]>(() => {
    const saved = localStorage.getItem("estim_roofing");
    return saved && !shouldUseBundledDefault ? JSON.parse(saved) : cloneTemplate(DEFAULT_ESTIMATE.roofing);
  });

  const [painting, setPainting] = useState<PaintingElement[]>(() => {
    const saved = localStorage.getItem("estim_painting");
    return saved && !shouldUseBundledDefault ? JSON.parse(saved) : cloneTemplate(DEFAULT_ESTIMATE.painting);
  });

  useEffect(() => {
    localStorage.setItem(DEFAULT_ESTIMATE_VERSION_KEY, DEFAULT_ESTIMATE_VERSION);
  }, []);

  // Automatically persist state changes in LocalStorage
  useEffect(() => {
    localStorage.setItem("estim_projectInfo", JSON.stringify(projectInfo));
  }, [projectInfo]);

  useEffect(() => {
    localStorage.setItem("estim_materials", JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem("estim_labor", JSON.stringify(labor));
  }, [labor]);

  useEffect(() => {
    localStorage.setItem("estim_equipment", JSON.stringify(equipment));
  }, [equipment]);

  useEffect(() => {
    localStorage.setItem("estim_concrete", JSON.stringify(concrete));
  }, [concrete]);

  useEffect(() => {
    localStorage.setItem("estim_formworks", JSON.stringify(formworks));
  }, [formworks]);

  useEffect(() => {
    localStorage.setItem("estim_chb", JSON.stringify(chb));
  }, [chb]);

  useEffect(() => {
    localStorage.setItem("estim_tiles", JSON.stringify(tiles));
  }, [tiles]);

  useEffect(() => {
    localStorage.setItem("estim_doorsWindows", JSON.stringify(doorsWindows));
  }, [doorsWindows]);

  useEffect(() => {
    localStorage.setItem("estim_roofing", JSON.stringify(roofing));
  }, [roofing]);

  useEffect(() => {
    localStorage.setItem("estim_painting", JSON.stringify(painting));
  }, [painting]);

  // Pricing helper lookups
  const getMatPrice = (id: string): number => {
    const m = materials.find(item => item.id === id);
    return m ? m.unitPrice : 0;
  };

  const getRebarPricePerKg = (diameter: number): number => {
    let matId = "mat-5"; // default to 10mm deformed bar
    if (diameter === 12) matId = "mat-6";
    else if (diameter === 16) matId = "mat-7";
    else if (diameter === 20) matId = "mat-8";
    else if (diameter === 25) matId = "mat-9";

    const pricePerPc = getMatPrice(matId);
    const nominalWeight = REBAR_KG_PER_M[diameter as keyof typeof REBAR_KG_PER_M] || 0.617;
    const weightPerPc = 6.0 * nominalWeight;
    return pricePerPc / weightPerPc;
  };

  // SYSTEM COST TAKE OFF CALCULATORS
  const concreteBreakdown = concrete.reduce((acc, el) => {
    const vol = calculateConcreteVolume(el);
    const mats = calculateConcreteMaterials(el);
    const steel = calculateConcreteRebar(el);

    const materialsCost = 
      (mats.cementBags * getMatPrice("mat-1")) +
      (mats.sandCubicMeters * getMatPrice("mat-2")) +
      (mats.gravelCubicMeters * getMatPrice("mat-3")) +
      (steel.mainWeightKg * getRebarPricePerKg(el.rebarDiameter)) +
      ((el.category === "Columns" || el.category === "Beams" ? steel.stirrupWeightKg * getRebarPricePerKg(10) : 0)) +
      (steel.tieWireKg * getMatPrice("mat-10"));

    const laborCost = calculateConcreteLaborCost(el, labor);
    acc.materials += materialsCost;
    acc.labor += laborCost;
    acc.total += materialsCost + laborCost;
    return acc;
  }, { materials: 0, labor: 0, total: 0 });

  const formworksBreakdown = formworks.reduce((acc, el) => {
    const mats = calculateFormworkMaterials(el);
    const plyPrice = el.plywoodThickness === "3/4\"" ? getMatPrice("mat-13") : getMatPrice("mat-12");

    const materialsCost = 
      (mats.plywoodSheets * plyPrice) +
      (mats.cocoLumberBdFt * getMatPrice("mat-14")) +
      (mats.nailsKg * getMatPrice("mat-16"));

    const laborCost = calculateFormworkLaborCost(el);
    acc.materials += materialsCost;
    acc.labor += laborCost;
    acc.total += materialsCost + laborCost;
    return acc;
  }, { materials: 0, labor: 0, total: 0 });

  const chbBreakdown = chb.reduce((acc, el) => {
    const mats = calculateCHBWallMaterials(el);
    const blockPrice = el.chbSize === "6\"" ? getMatPrice("mat-19") : getMatPrice("mat-18");

    const materialsCost = 
      (mats.chbPieces * blockPrice) +
      (mats.totalCementBags * getMatPrice("mat-1")) +
      (mats.totalSandCubicMeters * getMatPrice("mat-2")) +
      (mats.rebarPcs10mm * getMatPrice("mat-5")) +
      (mats.tieWireKg * getMatPrice("mat-10"));

    const laborCost = calculateCHBLaborCost(el);
    acc.materials += materialsCost;
    acc.labor += laborCost;
    acc.total += materialsCost + laborCost;
    return acc;
  }, { materials: 0, labor: 0, total: 0 });

  const tilesBreakdown = tiles.reduce((acc, el) => {
    const mats = calculateTileMaterials(el);
    let tileId = "mat-24"; // 60x60 standard
    if (el.tileSize === "30x30 cm") tileId = "mat-22";
    else if (el.tileSize === "40x40 cm") tileId = "mat-23";
    else if (el.tileSize === "80x80 cm") tileId = "mat-25";

    const tileUnitPrice = getMatPrice(tileId);

    const materialsCost = 
      (mats.tileCount * tileUnitPrice) +
      (mats.adhesiveBags * getMatPrice("mat-20")) +
      (mats.groutBags * getMatPrice("mat-21")) +
      (el.type === "Wall" ? mats.trimsQty * getMatPrice("mat-26") : 0);

    const laborCost = calculateTileLaborCost(el);
    acc.materials += materialsCost;
    acc.labor += laborCost;
    acc.total += materialsCost + laborCost;
    return acc;
  }, { materials: 0, labor: 0, total: 0 });

  const doorsWindowsBreakdown = doorsWindows.reduce((acc, el) => {
    const costData = calculateDoorWindowCost(el);
    acc.materials += costData.materialCost;
    acc.labor += costData.laborCost;
    acc.total += costData.totalCost;
    return acc;
  }, { materials: 0, labor: 0, total: 0 });

  const roofingBreakdown = roofing.reduce((acc, el) => {
    const mats = calculateRoofingMaterials(el);

    const materialsCost = 
      (mats.roofingLM * getMatPrice("mat-31")) +
      (mats.purlinsCount * getMatPrice("mat-28")) +
      (mats.angleBarsCount * getMatPrice("mat-30")) +
      (mats.textScrewsBoxes * getMatPrice("mat-38")) +
      (mats.insulationRolls * getMatPrice("mat-39")) +
      (mats.ridgeRolls * getMatPrice("mat-32")) +
      (mats.valleyGutters * getMatPrice("mat-33")) +
      (mats.flashings * getMatPrice("mat-34")) +
      (mats.gutters * getMatPrice("mat-36")) +
      (mats.downspouts * getMatPrice("mat-37")) +
      (mats.fasciaBoards * getMatPrice("mat-35"));

    const laborAndEquip = calculateRoofingLaborAndEquip(el);
    acc.materials += materialsCost;
    acc.labor += laborAndEquip.labor;
    acc.total += materialsCost + laborAndEquip.labor;
    return acc;
  }, { materials: 0, labor: 0, total: 0 });

  const paintingBreakdown = painting.reduce((acc, el) => {
    const mats = calculatePaintingMaterials(el);

    const materialsCost = 
      (mats.primerGallons * getMatPrice("mat-41")) +
      (mats.topcoatGallons * getMatPrice("mat-44")) +
      (mats.puttyBags * getMatPrice("mat-47")) +
      (mats.thinnerGallons * getMatPrice("mat-49"));

    const laborCost = calculatePaintingLaborCost(el);
    acc.materials += materialsCost;
    acc.labor += laborCost;
    acc.total += materialsCost + laborCost;
    return acc;
  }, { materials: 0, labor: 0, total: 0 });

  const divisionTotals: DivisionTotals = {
    concrete: {
      materials: Math.ceil(concreteBreakdown.materials),
      labor: Math.ceil(concreteBreakdown.labor),
      total: Math.ceil(concreteBreakdown.total)
    },
    formworks: {
      materials: Math.ceil(formworksBreakdown.materials),
      labor: Math.ceil(formworksBreakdown.labor),
      total: Math.ceil(formworksBreakdown.total)
    },
    chb: {
      materials: Math.ceil(chbBreakdown.materials),
      labor: Math.ceil(chbBreakdown.labor),
      total: Math.ceil(chbBreakdown.total)
    },
    tiles: {
      materials: Math.ceil(tilesBreakdown.materials),
      labor: Math.ceil(tilesBreakdown.labor),
      total: Math.ceil(tilesBreakdown.total)
    },
    doorsWindows: {
      materials: Math.ceil(doorsWindowsBreakdown.materials),
      labor: Math.ceil(doorsWindowsBreakdown.labor),
      total: Math.ceil(doorsWindowsBreakdown.total)
    },
    roofing: {
      materials: Math.ceil(roofingBreakdown.materials),
      labor: Math.ceil(roofingBreakdown.labor),
      total: Math.ceil(roofingBreakdown.total)
    },
    painting: {
      materials: Math.ceil(paintingBreakdown.materials),
      labor: Math.ceil(paintingBreakdown.labor),
      total: Math.ceil(paintingBreakdown.total)
    }
  };

  // Reset helper
  const handleReset = () => {
    if (window.confirm("Restore estimate template back to standard 2-Storey House template? Your custom edits will be safely reset.")) {
      localStorage.removeItem("estim_projectInfo");
      localStorage.removeItem("estim_materials");
      localStorage.removeItem("estim_labor");
      localStorage.removeItem("estim_equipment");
      localStorage.removeItem("estim_concrete");
      localStorage.removeItem("estim_formworks");
      localStorage.removeItem("estim_chb");
      localStorage.removeItem("estim_tiles");
      localStorage.removeItem("estim_doorsWindows");
      localStorage.removeItem("estim_roofing");
      localStorage.removeItem("estim_painting");
      
      setProjectInfo(cloneTemplate(DEFAULT_ESTIMATE.projectInfo));
      setMaterials(cloneTemplate(DEFAULT_ESTIMATE.materials));
      setLabor(cloneTemplate(DEFAULT_ESTIMATE.labor));
      setEquipment(cloneTemplate(DEFAULT_ESTIMATE.equipment));
      setConcrete(cloneTemplate(DEFAULT_ESTIMATE.concrete));
      setFormworks(cloneTemplate(DEFAULT_ESTIMATE.formworks));
      setChb(cloneTemplate(DEFAULT_ESTIMATE.chb));
      setTiles(cloneTemplate(DEFAULT_ESTIMATE.tiles));
      setDoorsWindows(cloneTemplate(DEFAULT_ESTIMATE.doorsWindows));
      setRoofing(cloneTemplate(DEFAULT_ESTIMATE.roofing));
      setPainting(cloneTemplate(DEFAULT_ESTIMATE.painting));
      setActiveTab("dashboard");
    }
  };

  const handleLoadEstimate = (est: SavedEstimate) => {
    setProjectInfo(est.projectInfo);
    setMaterials(est.materials);
    setLabor(est.labor);
    setEquipment(est.equipment);
    setConcrete(est.concrete);
    setFormworks(est.formworks);
    setChb(est.chb);
    setTiles(est.tiles);
    setDoorsWindows(est.doorsWindows);
    setRoofing(est.roofing);
    setPainting(est.painting);
    setActiveTab("dashboard");
  };

  const handleOpenEstimate = (estimate: EstimateFileData) => {
    setProjectInfo(cloneTemplate(estimate.projectInfo));
    setMaterials(cloneTemplate(estimate.materials));
    setLabor(cloneTemplate(estimate.labor));
    setEquipment(cloneTemplate(estimate.equipment));
    setConcrete(cloneTemplate(estimate.concrete));
    setFormworks(cloneTemplate(estimate.formworks));
    setChb(cloneTemplate(estimate.chb));
    setTiles(cloneTemplate(estimate.tiles));
    setDoorsWindows(cloneTemplate(estimate.doorsWindows));
    setRoofing(cloneTemplate(estimate.roofing));
    setPainting(cloneTemplate(estimate.painting));
    setActiveTab("dashboard");
  };

  const handleResetAll = () => {
    if (window.confirm("Perform a factory reset? All estimating configurations and saved estimates database will be permanently cleared.")) {
      localStorage.removeItem("estim_projectInfo");
      localStorage.removeItem("estim_materials");
      localStorage.removeItem("estim_labor");
      localStorage.removeItem("estim_equipment");
      localStorage.removeItem("estim_concrete");
      localStorage.removeItem("estim_formworks");
      localStorage.removeItem("estim_chb");
      localStorage.removeItem("estim_tiles");
      localStorage.removeItem("estim_doorsWindows");
      localStorage.removeItem("estim_roofing");
      localStorage.removeItem("estim_painting");
      localStorage.removeItem("strucforge_saved_estimates");
      
      setProjectInfo(cloneTemplate(DEFAULT_ESTIMATE.projectInfo));
      setMaterials(cloneTemplate(DEFAULT_ESTIMATE.materials));
      setLabor(cloneTemplate(DEFAULT_ESTIMATE.labor));
      setEquipment(cloneTemplate(DEFAULT_ESTIMATE.equipment));
      setConcrete(cloneTemplate(DEFAULT_ESTIMATE.concrete));
      setFormworks(cloneTemplate(DEFAULT_ESTIMATE.formworks));
      setChb(cloneTemplate(DEFAULT_ESTIMATE.chb));
      setTiles(cloneTemplate(DEFAULT_ESTIMATE.tiles));
      setDoorsWindows(cloneTemplate(DEFAULT_ESTIMATE.doorsWindows));
      setRoofing(cloneTemplate(DEFAULT_ESTIMATE.roofing));
      setPainting(cloneTemplate(DEFAULT_ESTIMATE.painting));
      setActiveTab("dashboard");
    }
  };

  // Format Helper
  const fmt = (num: number) => {
    return "₱" + num.toLocaleString("en-US", { maximumFractionDigits: 0 });
  };

  const directSum = Object.values(divisionTotals).reduce((a, b) => a + b.total, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white font-sans px-6 select-none" id="strucforge-loading-splash">
        <div className="space-y-6 text-center max-w-sm flex flex-col items-center">
          <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
            <Construction className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-1.5">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">StrucForge</h1>
            <p className="text-orange-500 font-mono font-bold uppercase tracking-widest text-xs">Cost Estimates PH</p>
          </div>
          <div className="w-48 bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-orange-500 h-full w-2/3 rounded-full animate-pulse"></div>
          </div>
          <p className="text-xs text-slate-400 font-sans mt-2">
            Loading local databases & formula baseline...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased select-none pb-16 md:pb-0" id="construction-estimator-root">
      
      {/* 1. TOP HEADER BANNER */}
      <header className="h-14 bg-[#1e293b] text-white flex items-center justify-between px-4 sm:px-6 shadow-md shrink-0 border-b border-slate-700 print:hidden">
        <div className="flex items-center gap-3">
          {/* Hamburger Menu Toggle on Mobile */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 text-slate-300 hover:text-white md:hidden cursor-pointer"
            title="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <img
            src="/LOGO-STRUCF.svg"
            alt="StrucForge Estimates logo"
            className="h-9 w-auto max-w-[150px] shrink-0 object-contain"
          />
          <div>
            <h1 className="text-sm sm:text-base md:text-lg font-semibold tracking-tight text-white flex items-center gap-1.5">
              <span className="text-slate-200 font-semibold">Estimates</span>
            </h1>
          </div>
        </div>

        {/* Current Info metadata */}
        <div className="flex items-center gap-2 sm:gap-6 text-sm">
          <div className="flex flex-col items-end">
            <span className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-widest leading-none mb-1">Project Total</span>
            <span className="text-orange-400 font-mono font-bold text-sm sm:text-base md:text-lg leading-none">{fmt(directSum)}</span>
          </div>
          <div className="hidden sm:block h-8 w-px bg-slate-700"></div>

          <button
            onClick={handleReset}
            className="bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white font-bold text-[10px] sm:text-[11px] uppercase px-2.5 py-1.5 sm:px-3 sm:py-2 rounded shadow-xs cursor-pointer transition-colors flex items-center gap-1.5"
            title="Restore default parameters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset Blueprint</span>
          </button>
        </div>
      </header>
      {!isOnline && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-xs px-4 py-2 flex items-center gap-2 print:hidden" id="strucforge-offline-banner">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Offline mode: estimates and saved local data remain available on this device.</span>
        </div>
      )}

      {/* 2. BODY CONTENT Drawer and main body */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Mobile menu backdrop */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/40 z-30 md:hidden" 
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* LEFT NAV PANEL - Slide drawer on mobile, static aside on desktop */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-slate-100 border-r border-slate-300 flex flex-col justify-between overflow-y-auto print:hidden font-sans transition-transform duration-300 ease-in-out md:static md:translate-x-0 shrink-0
          ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}>
          <div className="p-4 space-y-5">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2 px-2">Schedules Navigator</span>
              
              <nav className="space-y-1 block font-sans text-xs">
                {/* 1. Dashboard */}
                <button
                  onClick={() => { setActiveTab("dashboard"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 py-2 px-3 rounded-lg text-left transition cursor-pointer text-[13px] ${activeTab === "dashboard" ? "bg-white border border-slate-300 shadow-sm font-semibold text-orange-600" : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"}`}
                >
                  <Home className="w-4 h-4" />
                  Management Dashboard
                </button>

                {/* 2. Project config */}
                <button
                  onClick={() => { setActiveTab("project"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 py-2 px-3 rounded-lg text-left transition cursor-pointer text-[13px] ${activeTab === "project" ? "bg-white border border-slate-300 shadow-sm font-semibold text-orange-600" : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"}`}
                >
                  <FolderGit2 className="w-4 h-4" />
                  Project Config & Markup
                </button>
              </nav>
            </div>

            {/* Division Sections */}
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2 px-2">Estimate Calculators</span>
              <nav className="space-y-1 block font-sans text-xs">
                
                {/* concrete */}
                <button
                  onClick={() => { setActiveTab("concrete"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 py-2 px-3 rounded-lg text-left transition cursor-pointer text-[13px] ${activeTab === "concrete" ? "bg-white border border-slate-300 shadow-sm font-semibold text-orange-600" : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"}`}
                >
                  <Activity className="w-4 h-4" />
                  Div 01 - Concrete Works
                </button>

                {/* formworks */}
                <button
                  onClick={() => { setActiveTab("formwork"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 py-2 px-3 rounded-lg text-left transition cursor-pointer text-[13px] ${activeTab === "formwork" ? "bg-white border border-slate-300 shadow-sm font-semibold text-orange-600" : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"}`}
                >
                  <Layers className="w-4 h-4" />
                  Div 02 - Formworks & Scaf
                </button>

                {/* chb */}
                <button
                  onClick={() => { setActiveTab("chb"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 py-2 px-3 rounded-lg text-left transition cursor-pointer text-[13px] ${activeTab === "chb" ? "bg-white border border-slate-300 shadow-sm font-semibold text-orange-600" : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"}`}
                >
                  <HardHat className="w-4 h-4" />
                  Div 03 - Masonry CHB Walls
                </button>

                {/* roofing */}
                <button
                  onClick={() => { setActiveTab("roofing"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 py-2 px-3 rounded-lg text-left transition cursor-pointer text-[13px] ${activeTab === "roofing" ? "bg-white border border-slate-300 shadow-sm font-semibold text-orange-600" : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"}`}
                >
                  <Construction className="w-4 h-4" />
                  Div 04 - Roofing Systems
                </button>

                {/* Openings */}
                <button
                  onClick={() => { setActiveTab("doorsWindows"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 py-2 px-3 rounded-lg text-left transition cursor-pointer text-[13px] ${activeTab === "doorsWindows" ? "bg-white border border-slate-300 shadow-sm font-semibold text-orange-600" : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"}`}
                >
                  <Home className="w-4 h-4" />
                  Div 05 - Openings Schedule
                </button>

                {/* tiling */}
                <button
                  onClick={() => { setActiveTab("tiles"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 py-2 px-3 rounded-lg text-left transition cursor-pointer text-[13px] ${activeTab === "tiles" ? "bg-white border border-slate-300 shadow-sm font-semibold text-orange-600" : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"}`}
                >
                  <Wrench className="w-4 h-4" />
                  Div 06 - Finishing Tiling
                </button>

                {/* painting */}
                <button
                  onClick={() => { setActiveTab("painting"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 py-2 px-3 rounded-lg text-left transition cursor-pointer text-[13px] ${activeTab === "painting" ? "bg-white border border-slate-300 shadow-sm font-semibold text-orange-600" : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"}`}
                >
                  <Paintbrush className="w-4 h-4" />
                  Div 07 - Painting Works
                </button>

              </nav>
            </div>

            {/* Core registries & Mobile Extra tabs */}
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2 px-2">Official Documents</span>
              <nav className="space-y-1 block font-sans text-xs">
                <button
                  onClick={() => { setActiveTab("database"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 py-2 px-3 rounded-lg text-left transition cursor-pointer text-[13px] ${activeTab === "database" ? "bg-white border border-slate-300 shadow-sm font-semibold text-orange-600" : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"}`}
                >
                  <Database className="w-4 h-4" />
                  Master Prices DB
                </button>
                <button
                  onClick={() => { setActiveTab("boq"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 py-2 px-3 rounded-lg text-left transition cursor-pointer text-[13px] ${activeTab === "boq" ? "bg-white border border-slate-300 shadow-sm font-semibold text-orange-600" : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"}`}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Reports & BOQ
                </button>

                <button
                  onClick={() => { setActiveTab("saved"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 py-2 px-3 rounded-lg text-left transition cursor-pointer text-[13px] ${activeTab === "saved" ? "bg-white border border-slate-300 shadow-sm font-semibold text-orange-600" : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"}`}
                >
                  <FolderGit2 className="w-4 h-4" />
                  Saved Revisions DB
                </button>

                <button
                  onClick={() => { setActiveTab("account"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 py-2 px-3 rounded-lg text-left transition cursor-pointer text-[13px] ${activeTab === "account" ? "bg-white border border-slate-300 shadow-sm font-semibold text-orange-600" : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"}`}
                >
                  <User className="w-4 h-4" />
                  Estimator Settings
                </button>

                <button
                  onClick={() => { setActiveTab("help"); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-2.5 py-2 px-3 rounded-lg text-left transition cursor-pointer text-[13px] ${activeTab === "help" ? "bg-white border border-slate-300 shadow-sm font-semibold text-orange-600" : "text-slate-600 hover:bg-slate-200 hover:text-slate-900"}`}
                >
                  <HelpCircle className="w-4 h-4" />
                  Help & Policies
                </button>
              </nav>
            </div>
          </div>

          {/* Footer branding */}
          <div className="p-4 border-t border-slate-350 text-[10px] font-mono text-slate-500 leading-normal bg-slate-200/50 mt-auto">
            <p className="text-slate-600 font-semibold font-sans">© StrucForge Estimates</p>
            <p className="mt-1 text-slate-500 font-sans">Compliant with Philippine Construction standards.</p>
          </div>
        </aside>

        {/* COMPONENT INTERACTIVE MAIN VIEW SPACE */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 pb-20 md:pb-6 print:overflow-visible print:p-0">
          
          {/* Main conditional rendering routing */}
          {activeTab === "dashboard" && (
            <DashboardView
              projectInfo={projectInfo}
              materials={materials}
              labor={labor}
              equipment={equipment}
              concrete={concrete}
              formworks={formworks}
              chb={chb}
              tiles={tiles}
              doorsWindows={doorsWindows}
              roofing={roofing}
              painting={painting}
              divisionTotals={divisionTotals}
              onOpenEstimate={handleOpenEstimate}
            />
          )}

          {activeTab === "project" && (
            <ProjectInfoView
              projectInfo={projectInfo}
              onChange={setProjectInfo}
            />
          )}

          {activeTab === "concrete" && (
            <ConcreteEstimator
              elements={concrete}
              materials={materials}
              onChange={setConcrete}
              divisionCost={divisionTotals.concrete}
            />
          )}

          {activeTab === "formwork" && (
            <FormworkEstimator
              elements={formworks}
              materials={materials}
              onChange={setFormworks}
              divisionCost={divisionTotals.formworks}
            />
          )}

          {activeTab === "chb" && (
            <CHBWallEstimator
              elements={chb}
              materials={materials}
              onChange={setChb}
              divisionCost={divisionTotals.chb}
            />
          )}

          {activeTab === "tiles" && (
            <TilingEstimator
              elements={tiles}
              materials={materials}
              onChange={setTiles}
              divisionCost={divisionTotals.tiles}
            />
          )}

          {activeTab === "doorsWindows" && (
            <DoorsWindowsEstimator
              elements={doorsWindows}
              materials={materials}
              onChange={setDoorsWindows}
              divisionCost={divisionTotals.doorsWindows}
            />
          )}

          {activeTab === "roofing" && (
            <RoofingEstimator
              elements={roofing}
              materials={materials}
              onChange={setRoofing}
              divisionCost={divisionTotals.roofing}
            />
          )}

          {activeTab === "painting" && (
            <PaintingEstimator
              elements={painting}
              materials={materials}
              onChange={setPainting}
              divisionCost={divisionTotals.painting}
            />
          )}

          {activeTab === "database" && (
            <DatabaseView
              materials={materials}
              labor={labor}
              equipment={equipment}
              onMaterialsChange={setMaterials}
              onLaborChange={setLabor}
              onEquipmentChange={setEquipment}
            />
          )}

          {activeTab === "boq" && (
            <BOQView
              projectInfo={projectInfo}
              divisionTotals={divisionTotals}
            />
          )}

          {/* New mobile support view rendering */}
          {activeTab === "saved" && (
            <SavedEstimatesView
              currentProjectInfo={projectInfo}
              currentMaterials={materials}
              currentLabor={labor}
              currentEquipment={equipment}
              currentConcrete={concrete}
              currentFormworks={formworks}
              currentChb={chb}
              currentTiles={tiles}
              currentDoorsWindows={doorsWindows}
              currentRoofing={roofing}
              currentPainting={painting}
              onLoadEstimate={handleLoadEstimate}
            />
          )}

          {activeTab === "account" && (
            <AccountView
              projectInfo={projectInfo}
              divisionTotals={divisionTotals}
              onChangeProjectInfo={setProjectInfo}
              onResetAll={handleResetAll}
            />
          )}

          {activeTab === "help" && (
            <HelpView />
          )}

          {activeTab === "newEstimate" && (
            <div className="space-y-6" id="calculators-grid-mobile">
              <div>
                <h2 className="text-xl font-bold text-slate-800">New Cost Estimate Works</h2>
                <p className="text-xs text-slate-500 mt-1">Select a construction division module below to adjust takeoff parameters and compute labor & material cost breakdowns.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { tab: "concrete" as const, title: "Div 01 - Concrete Works", desc: "Calculate concrete volume, Class A/B/C cement, sand, gravel, and steel rebar specifications.", icon: Activity, total: divisionTotals.concrete.total },
                  { tab: "formwork" as const, title: "Div 02 - Formworks & Scaffolds", desc: "Estimate marine plywood sheets, coco lumber studs, nails, and scaffolding duration.", icon: Layers, total: divisionTotals.formworks.total },
                  { tab: "chb" as const, title: "Div 03 - Masonry CHB Walls", desc: "Compute 4\" or 6\" concrete hollow blocks (CHB), mortar cement/sand, and vertical/horizontal bars.", icon: HardHat, total: divisionTotals.chb.total },
                  { tab: "roofing" as const, title: "Div 04 - Roofing Systems", desc: "Estimate rib-type long span, purlins count, angle bars, bubble foil insulation, and gutter lengths.", icon: Construction, total: divisionTotals.roofing.total },
                  { tab: "doorsWindows" as const, title: "Div 05 - Doors & Windows", desc: "Input sliding, awning, flush door schedules, and calculate material and installation costs.", icon: Home, total: divisionTotals.doorsWindows.total },
                  { tab: "tiles" as const, title: "Div 06 - Finishing & Tiling", desc: "Design floor or wall tiles (30x30, 40x40, 60x60, 80x80 cm), adhesive bags, and grout.", icon: Wrench, total: divisionTotals.tiles.total },
                  { tab: "painting" as const, title: "Div 07 - Painting Works", desc: "Input interior/exterior wall areas, primer, semi-gloss topcoats, joint compound putty, and painters fee.", icon: Paintbrush, total: divisionTotals.painting.total },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveTab(item.tab)}
                      className="text-left bg-white border border-slate-200 hover:border-orange-400 p-4 rounded-xl shadow-xs transition hover:shadow-md cursor-pointer flex flex-col justify-between min-h-[160px] group"
                    >
                      <div className="space-y-1.5">
                        <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition">
                          <Icon className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-850 text-sm">{item.title}</h3>
                        <p className="text-slate-500 text-xs leading-normal">{item.desc}</p>
                      </div>
                      <div className="pt-3 border-t border-slate-100 flex justify-between items-center w-full mt-2">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Section Total:</span>
                        <span className="font-mono text-orange-600 font-bold text-sm">₱{item.total.toLocaleString()}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

        </main>

      </div>

      {/* 3. MOBILE BOTTOM NAVIGATION TAB BAR */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around md:hidden px-2 py-1 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] select-none">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={`flex flex-col items-center justify-center flex-1 py-1 gap-1 cursor-pointer transition-colors ${activeTab === "dashboard" ? "text-orange-600 font-semibold" : "text-slate-500 hover:text-slate-900"}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          onClick={() => setActiveTab("newEstimate")}
          className={`flex flex-col items-center justify-center flex-1 py-1 gap-1 cursor-pointer transition-colors ${activeTab === "newEstimate" || activeTab === "concrete" || activeTab === "formwork" || activeTab === "chb" || activeTab === "tiles" || activeTab === "doorsWindows" || activeTab === "roofing" || activeTab === "painting" ? "text-orange-600 font-semibold" : "text-slate-500 hover:text-slate-900"}`}
        >
          <Calculator className="w-5 h-5" />
        <span className="text-[10px]">New</span>
        </button>

        <button
          onClick={() => setActiveTab("saved")}
          className={`flex flex-col items-center justify-center flex-1 py-1 gap-1 cursor-pointer transition-colors ${activeTab === "saved" ? "text-orange-600 font-semibold" : "text-slate-500 hover:text-slate-900"}`}
        >
          <FolderGit2 className="w-5 h-5" />
          <span className="text-[10px]">Saved</span>
        </button>

        <button
          onClick={() => setActiveTab("boq")}
          className={`flex flex-col items-center justify-center flex-1 py-1 gap-1 cursor-pointer transition-colors ${activeTab === "boq" ? "text-orange-600 font-semibold" : "text-slate-500 hover:text-slate-900"}`}
        >
          <FileSpreadsheet className="w-5 h-5" />
        <span className="text-[10px]">Reports</span>
      </button>

        <button
          onClick={() => setActiveTab("help")}
          className={`flex flex-col items-center justify-center flex-1 py-1 gap-1 cursor-pointer transition-colors ${activeTab === "help" ? "text-orange-600 font-semibold" : "text-slate-500 hover:text-slate-900"}`}
        >
          <HelpCircle className="w-5 h-5" />
          <span className="text-[10px]">Help</span>
        </button>
      </nav>

    </div>
  );
}
