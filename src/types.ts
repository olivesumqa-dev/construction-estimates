export interface DivisionCost {
  materials: number;
  labor: number;
  total: number;
}

export interface DivisionTotals {
  concrete: DivisionCost;
  formworks: DivisionCost;
  chb: DivisionCost;
  tiles: DivisionCost;
  doorsWindows: DivisionCost;
  roofing: DivisionCost;
  painting: DivisionCost;
}

export interface ProjectInfo {
  projectName: string;
  clientName: string;
  location: string;
  estimator: string;
  floorArea: number; // in sqm
  date: string;
  overheadPercent: number; // e.g. 10 for 10%
  contingencyPercent: number; // e.g. 5 for 5%
  profitPercent: number; // e.g. 10 for 10%
  vatPercent: number; // e.g. 12 for 12%
  mobilizationPercent: number; // e.g. 2 for 2%
  companyName?: string;
  companySubtitle?: string;
}

export interface MaterialItem {
  id: string;
  category: string;
  name: string;
  unit: string;
  unitPrice: number; // PHP
}

export interface LaborItem {
  id: string;
  role: string; // Foreman, Skilled Carpenter, Helper, etc.
  dailyRate: number; // PHP per 8-hour day
}

export interface EquipmentItem {
  id: string;
  name: string; // Bagger Mixer, Plate Compactor, Backhoe, etc.
  hourlyRate: number; // PHP per hour
}

export interface ConcreteElement {
  id: string;
  name: string; // e.g. Footing F1, Column C1, etc.
  category: "Footings" | "Columns" | "Beams" | "Suspended Slabs" | "Ground Slabs" | "Stairs";
  length: number; // meters
  width: number; // meters
  thickness: number; // meters / depth
  quantity: number; // count
  concreteMix: "Class A" | "Class B" | "Class C";
  rebarDiameter: 10 | 12 | 16 | 20 | 25; // mm
  rebarSpacing: number; // meters (e.g. 0.15m)
  rebarCountPerElement: number; // number of main reinforcing bars (used for beams/columns)
  rebarLength: number; // standard commercial lengths, e.g. 6.0m, 7.5m, 9.0m, etc.
  elementWastage: number; // percentage (e.g. 5%)
}

export interface FormworkElement {
  id: string;
  name: string; // Column Forms, Beam Forms, Slab Forms, etc.
  category: "Footings" | "Columns" | "Beams" | "Slabs" | "Stairs";
  contactArea: number; // sqm
  quantity: number;
  reuseFactor: number; // number of times form files are reused (typically 3-4)
  plywoodThickness: "1/4\"" | "1/2\"" | "3/4\""; // marine plywood
  supportType: "Coco Lumber" | "Steel Props/Scaf";
  rentalDurationDays: number;
}

export interface CHBWallElement {
  id: string;
  name: string; // Ground Floor Exterior, Inner Partitions, etc.
  chbSize: "4\"" | "6\""; // 100mm or 150mm
  length: number; // meters
  height: number; // meters
  deductions: number; // doors/windows area to deduct (sqm)
  verticalRebarSpacing: number; // spacing in meters (e.g. 0.60, 0.80)
  horizontalRebarSpacing: number; // spacing in layers (e.g. every 3 layers, which is 0.60m)
  plasterBothSides: boolean;
  chbWastagePercent: number; // e.g. 5
}

export interface TileElement {
  id: string;
  name: string; // Living Area, Toilet walls, Main Staircase
  type: "Floor" | "Wall" | "Stairs";
  tileSize: "30x30 cm" | "40x40 cm" | "60x60 cm" | "80x80 cm";
  lengthOrArea: number; // sqm for floor/wall, total length (m) for stairs
  widthOrRisers?: number; // width for floor/wall if inputting as dimensions, or stair steps/risers
  treadWidth?: number; // for stairs
  stepCount?: number; // for stairs
  wastagePercent: number; // typically 10%
}

export interface DoorWindowElement {
  id: string;
  type: "Door" | "Window";
  name: string; // e.g. Main Wooden Panel Door, Sliding Glass Window W1
  subType: "Sliding" | "Awning" | "Casement" | "Fixed" | "Solid Panel" | "Flush" | "PVC";
  width: number; // meters
  height: number; // meters
  quantity: number;
  unitPrice: number; // material cost per pc
  hardwareCostPerPc: number; // locksets, hinges, accessories per pc
  installationHoursPerPc: number; // labor duration estimation
}

export interface RoofingElement {
  id: string;
  name: string; // Main Roof Gable, Carport Lean-to
  length: number; // length of roof footprint (m)
  width: number; // width of roof footprint (m)
  slopeDegrees: number; // slope in degrees (e.g. 30 degrees)
  overhang: number; // e.g. 0.8m
  purlinSpacing: number; // m (e.g. 0.60m)
  roofingType: "Rib Type Long Span" | "Corrugated Long Span" | "Tile Effect";
  insulationType: "Single Foil" | "Double Foil" | "Bubble Foil" | "None";
  fasciaLength: number; // linear meters
  gutterLength: number; // linear meters
  ridgeRollLength: number; // linear meters
  flashingLength: number; // linear meters
}

export interface PaintingElement {
  id: string;
  name: string; // Living room walls, exterior facade, ceiling
  type: "Interior Walls" | "Exterior Walls" | "Ceilings" | "Metal Works" | "Wood Works";
  area: number; // sqm
  numberOfCoats: number; // e.g. 2 or 3
  surfaceType: "Plastered CHB" | "Fiber Cement / Gypsum" | "Wood Panels" | "Structural Steel";
}
