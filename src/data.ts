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
  PaintingElement
} from "./types";

export const DEFAULT_PROJECT_INFO: ProjectInfo = {
  projectName: "Proposed Two-Story Residence",
  clientName: "Engr. Maria Santos-Cruz",
  location: "Brgy. Santa Rosa, Laguna, Philippines",
  estimator: "Juan Dela Cruz, CE, QS",
  floorArea: 150,
  date: new Date().toISOString().split("T")[0],
  overheadPercent: 8,
  contingencyPercent: 5,
  profitPercent: 10,
  vatPercent: 12,
  mobilizationPercent: 2,
  companyName: "PHILIPPINES ESTIMATES INC.",
  companySubtitle: "Professional Quantity Surveying & Structural Takeoff Solutions"
};

export const DEFAULT_MATERIALS: MaterialItem[] = [
  // Concrete & Reinforcement Elements
  { id: "mat-1", category: "Concrete", name: "Portland Cement (40kg bag)", unit: "bag", unitPrice: 285 },
  { id: "mat-2", category: "Concrete", name: "Washed Sand", unit: "cu.m.", unitPrice: 1200 },
  { id: "mat-3", category: "Concrete", name: "Crushed Gravel (G1 or 3/4\")", unit: "cu.m.", unitPrice: 1450 },
  { id: "mat-4", category: "Concrete", name: "Curing Compound", unit: "gal", unitPrice: 650 },
  { id: "mat-5", category: "Steel", name: "10mm x 6.0m Deformed Rebar Grade 33", unit: "pc", unitPrice: 185 },
  { id: "mat-6", category: "Steel", name: "12mm x 6.0m Deformed Rebar Grade 33", unit: "pc", unitPrice: 270 },
  { id: "mat-7", category: "Steel", name: "16mm x 6.0m Deformed Rebar Grade 40", unit: "pc", unitPrice: 480 },
  { id: "mat-8", category: "Steel", name: "20mm x 6.0m Deformed Rebar Grade 40", unit: "pc", unitPrice: 750 },
  { id: "mat-9", category: "Steel", name: "25mm x 6.0m Deformed Rebar Grade 40", unit: "pc", unitPrice: 1200 },
  { id: "mat-10", category: "Steel", name: "#16 G.I. Tie Wire", unit: "kg", unitPrice: 110 },

  // Formworks & Lumber
  { id: "mat-11", category: "Formworks", name: "1/4\" x 4' x 8' Ordinary Plywood", unit: "sheet", unitPrice: 450 },
  { id: "mat-12", category: "Formworks", name: "1/2\" x 4' x 8' Phenolic Board", unit: "sheet", unitPrice: 950 },
  { id: "mat-13", category: "Formworks", name: "3/4\" x 4' x 8' Phenolic Formwork Board", unit: "sheet", unitPrice: 1350 },
  { id: "mat-14", category: "Formworks", name: "2\" x 2\" x 12' Coco Lumber", unit: "bd.ft.", unitPrice: 38 }, // 4 bd.ft. per pc typically, unit price is per bd.ft.
  { id: "mat-15", category: "Formworks", name: "2\" x 3\" x 12' Coco Lumber", unit: "bd.ft.", unitPrice: 38 },
  { id: "mat-16", category: "Formworks", name: "Assorted Common Wire Nails (CWN)", unit: "kg", unitPrice: 95 },
  { id: "mat-17", category: "Formworks", name: "Form Release Oil", unit: "gal", unitPrice: 550 },

  // CHB & Masonry Elements
  { id: "mat-18", category: "CHB", name: "4\" Concrete Hollow Block (Non-Bearing)", unit: "pc", unitPrice: 14.50 },
  { id: "mat-19", category: "CHB", name: "6\" Concrete Hollow Block (Load-Bearing)", unit: "pc", unitPrice: 19.50 },
  { id: "mat-20", category: "CHB", name: "Tile Adhesive (25kg bag)", unit: "bag", unitPrice: 320 },
  { id: "mat-21", category: "CHB", name: "Tile Grout (2kg bag)", unit: "bag", unitPrice: 95 },

  // Tiles
  { id: "mat-22", category: "Tiles", name: "30cm x 30cm Ceramic Floor Tiles", unit: "pc", unitPrice: 45 },
  { id: "mat-23", category: "Tiles", name: "40cm x 40cm Homogeneous Floor Tiles", unit: "pc", unitPrice: 85 },
  { id: "mat-24", category: "Tiles", name: "60cm x 60cm Polished Porcelain Tiles", unit: "pc", unitPrice: 165 },
  { id: "mat-25", category: "Tiles", name: "80cm x 80cm Nano-Polished Porcelain Tiles", unit: "pc", unitPrice: 320 },
  { id: "mat-26", category: "Tiles", name: "30cm x 30cm Matt Ceramic Wall Tiles", unit: "pc", unitPrice: 48 },
  { id: "mat-27", category: "Tiles", name: "Tile Corner Trims (PVC, 2.5m)", unit: "length", unitPrice: 85 },

  // Roofing & Framing Steel
  { id: "mat-28", category: "Roofing", name: "2\" x 3\" x 1.5mm C-Purlin", unit: "length", unitPrice: 580 },
  { id: "mat-29", category: "Roofing", name: "2\" x 4\" x 1.5mm C-Purlin", unit: "length", unitPrice: 690 },
  { id: "mat-30", category: "Roofing", name: "2\" x 2\" x 4mm Angle Bar (Truss)", unit: "length", unitPrice: 720 },
  { id: "mat-31", category: "Roofing", name: "Rib-Type Pre-painted Roofing Sheet (0.4mm thick)", unit: "l.m.", unitPrice: 320 },
  { id: "mat-32", category: "Roofing", name: "Ridge Roll (0.4mm x 8ft)", unit: "pc", unitPrice: 280 },
  { id: "mat-33", category: "Roofing", name: "Valley Gutter (0.4mm x 8ft)", unit: "pc", unitPrice: 320 },
  { id: "mat-34", category: "Roofing", name: "Wall Flashing (0.4mm x 8ft)", unit: "pc", unitPrice: 260 },
  { id: "mat-35", category: "Roofing", name: "Fascia Board (1/2\" x 10\" Hardisen)", unit: "length", unitPrice: 480 },
  { id: "mat-36", category: "Roofing", name: "G.I. Gutter Prefabricated (8ft)", unit: "pc", unitPrice: 450 },
  { id: "mat-37", category: "Roofing", name: "PVC Downspout (3\" x 10ft)", unit: "length", unitPrice: 240 },
  { id: "mat-38", category: "Roofing", name: "Roofing Tekscrews (2-1/2\", 100 pcs/box)", unit: "box", unitPrice: 250 },
  { id: "mat-39", category: "Roofing", name: "Double-Sided Aluminum Bubble Insulation (50m roll)", unit: "roll", unitPrice: 3800 },
  { id: "mat-40", category: "Roofing", name: "Welding Rod (E6011, 20kg box)", unit: "box", unitPrice: 1650 },

  // Painting Works
  { id: "mat-41", category: "Painting", name: "Flat Latex Primer Paint (4L, Boysen)", unit: "gal", unitPrice: 650 },
  { id: "mat-44", category: "Painting", name: "Semi-Gloss Latex Paint Topcoat (4L, Boysen)", unit: "gal", unitPrice: 820 },
  { id: "mat-45", category: "Painting", name: "Flat Wall Enamel Primer for Wood (4L)", unit: "gal", unitPrice: 680 },
  { id: "mat-46", category: "Painting", name: "Quick Drying Enamel for Wood/Metal (4L)", unit: "gal", unitPrice: 790 },
  { id: "mat-47", category: "Painting", name: "Gypsum Putty / Joint Compound (25kg bag)", unit: "bag", unitPrice: 450 },
  { id: "mat-48", category: "Painting", name: "Red Oxide Primer for Steel (4L)", unit: "gal", unitPrice: 520 },
  { id: "mat-49", category: "Painting", name: "Paint Thinner / Reducer (4L)", unit: "gal", unitPrice: 380 },
  { id: "mat-50", category: "Painting", name: "Assorted Sandpaper, Brushes, Rollers", unit: "lot", unitPrice: 1 }
];

export const DEFAULT_LABOR: LaborItem[] = [
  { id: "lab-1", role: "Construction Foreman", dailyRate: 1000 },
  { id: "lab-2", role: "Skilled Mason", dailyRate: 850 },
  { id: "lab-3", role: "Skilled Carpenter", dailyRate: 850 },
  { id: "lab-4", role: "Skilled Steelworker/Welder", dailyRate: 850 },
  { id: "lab-5", role: "Skilled Painter", dailyRate: 800 },
  { id: "lab-6", role: "General Helper / Laborer", dailyRate: 600 },
  { id: "lab-7", role: "Div 10 Specialty Installer", dailyRate: 950 }
];

export const DEFAULT_EQUIPMENT: EquipmentItem[] = [
  { id: "eq-1", name: "One-Bagger Concrete Mixer", hourlyRate: 150 },
  { id: "eq-2", name: "Concrete Vibrator (Shaft-type)", hourlyRate: 80 },
  { id: "eq-3", name: "Plate Compactor (5HP)", hourlyRate: 120 },
  { id: "eq-4", name: "Electric Welding Machine (Inverter)", hourlyRate: 100 },
  { id: "eq-5", name: "Scaffolding Set (H-Frames, Braces, Pins - rental/day)", hourlyRate: 40 }, // per day rental, expressed hourly (~PHP 5/hr equivalent, let's keep it 40/hr for simplicity of computations)
  { id: "eq-6", name: "Mini Backhoe Excavator (with Operator)", hourlyRate: 1400 },
  { id: "eq-7", name: "Div 10 Specialty Aerial Lift / Crane", hourlyRate: 1800 }
];

export const DEFAULT_CONCRETE: ConcreteElement[] = [
  {
    id: "conc-1",
    name: "Columns Footings (F1)",
    category: "Footings",
    length: 1.5,
    width: 1.5,
    thickness: 0.35,
    quantity: 12,
    concreteMix: "Class A",
    rebarDiameter: 16,
    rebarSpacing: 0.15,
    rebarCountPerElement: 10, // grid of 10x10 bars
    rebarLength: 6,
    elementWastage: 5
  },
  {
    id: "conc-2",
    name: "Columns (C1) - Ground to Second Floor",
    category: "Columns",
    length: 0.3,
    width: 0.3,
    thickness: 3.2, // height
    quantity: 12,
    concreteMix: "Class A",
    rebarDiameter: 16,
    rebarSpacing: 0.15, // ties spacing
    rebarCountPerElement: 8, // 8 vertical bars
    rebarLength: 6,
    elementWastage: 5
  },
  {
    id: "conc-3",
    name: "Beams (B1) - Roof and Perimeter",
    category: "Beams",
    length: 6.0,
    width: 0.25,
    thickness: 0.45, // depth
    quantity: 10,
    concreteMix: "Class A",
    rebarDiameter: 16,
    rebarSpacing: 0.15, // stirrups spacing
    rebarCountPerElement: 6, // 6 main bars
    rebarLength: 6,
    elementWastage: 5
  },
  {
    id: "conc-4",
    name: "Suspended Floor Slab (S1) - 2nd Floor",
    category: "Suspended Slabs",
    length: 8.0,
    width: 6.5,
    thickness: 0.12,
    quantity: 1,
    concreteMix: "Class A",
    rebarDiameter: 12,
    rebarSpacing: 0.15,
    rebarCountPerElement: 0, // calculated from spacing
    rebarLength: 6,
    elementWastage: 5
  },
  {
    id: "conc-5",
    name: "Slab on Fill (Ground Floor)",
    category: "Ground Slabs",
    length: 10.0,
    width: 8.0,
    thickness: 0.10,
    quantity: 1,
    concreteMix: "Class B",
    rebarDiameter: 10,
    rebarSpacing: 0.20,
    rebarCountPerElement: 0,
    rebarLength: 6,
    elementWastage: 5
  }
];

export const DEFAULT_FORMWORKS: FormworkElement[] = [
  {
    id: "form-1",
    name: "Footings Form (Sides Only)",
    category: "Footings",
    contactArea: 25.2, // perimeter * height
    quantity: 1,
    reuseFactor: 4,
    plywoodThickness: "1/2\"",
    supportType: "Coco Lumber",
    rentalDurationDays: 3
  },
  {
    id: "form-2",
    name: "Columns (C1) Shutter Forms",
    category: "Columns",
    contactArea: 46.08, // 1.2m perimeter * 3.2m height * 12 columns
    quantity: 1,
    reuseFactor: 3,
    plywoodThickness: "1/2\"",
    supportType: "Coco Lumber",
    rentalDurationDays: 7
  },
  {
    id: "form-3",
    name: "Beams (B1) Forms and Bottoms",
    category: "Beams",
    contactArea: 69.0, // beam visual contact sides
    quantity: 1,
    reuseFactor: 3,
    plywoodThickness: "1/2\"",
    supportType: "Steel Props/Scaf",
    rentalDurationDays: 14
  },
  {
    id: "form-4",
    name: "Suspended Floor Slab Scaffolds & Deck",
    category: "Slabs",
    contactArea: 52.0, // slab bottom contact area
    quantity: 1,
    reuseFactor: 3,
    plywoodThickness: "3/4\"",
    supportType: "Steel Props/Scaf",
    rentalDurationDays: 21
  }
];

export const DEFAULT_CHB_WALLS: CHBWallElement[] = [
  {
    id: "chb-1",
    name: "Exterior Perimeter Walls (Ground & 2nd Floor)",
    chbSize: "6\"",
    length: 72.0, // total perimeter length
    height: 6.0,  // combined height
    deductions: 18.5, // deducing doors and windows sqm
    verticalRebarSpacing: 0.60, // vertical bar spacing
    horizontalRebarSpacing: 3,  // every 3 blocks (0.60m)
    plasterBothSides: true,
    chbWastagePercent: 5
  },
  {
    id: "chb-2",
    name: "Interior Bedroom & Toilet Partitions",
    chbSize: "4\"",
    length: 45.0,
    height: 3.0,
    deductions: 9.8,
    verticalRebarSpacing: 0.80,
    horizontalRebarSpacing: 4,  // every 4 blocks (0.80m)
    plasterBothSides: true,
    chbWastagePercent: 5
  }
];

export const DEFAULT_TILINGS: TileElement[] = [
  {
    id: "tile-1",
    name: "Ground Floor Living & Dining Area",
    type: "Floor",
    tileSize: "60x60 cm",
    lengthOrArea: 48.0, // area in sqm
    wastagePercent: 10
  },
  {
    id: "tile-2",
    name: "Master's Bedroom and Guest Rooms Floor",
    type: "Floor",
    tileSize: "60x60 cm",
    lengthOrArea: 38.0,
    wastagePercent: 10
  },
  {
    id: "tile-3",
    name: "Toilet and Bath Wall Tiling (1.8m height)",
    type: "Wall",
    tileSize: "30x30 cm",
    lengthOrArea: 24.0,
    wastagePercent: 10
  },
  {
    id: "tile-4",
    name: "Toilet Floor Tiling (Matt Finish)",
    type: "Floor",
    tileSize: "30x30 cm",
    lengthOrArea: 8.5,
    wastagePercent: 10
  }
];

export const DEFAULT_DOORS_WINDOWS: DoorWindowElement[] = [
  // Doors
  {
    id: "dw-1",
    type: "Door",
    name: "Main Entrance Wood Solid Panel Door",
    subType: "Solid Panel",
    width: 1.0,
    height: 2.1,
    quantity: 1,
    unitPrice: 12500,
    hardwareCostPerPc: 2500,
    installationHoursPerPc: 6
  },
  {
    id: "dw-2",
    type: "Door",
    name: "Bedroom Flush Doors (Phloem panel)",
    subType: "Flush",
    width: 0.8,
    height: 2.1,
    quantity: 4,
    unitPrice: 3800,
    hardwareCostPerPc: 1200,
    installationHoursPerPc: 4
  },
  {
    id: "dw-3",
    type: "Door",
    name: "Toilet and Bath PVC Waterproof Doors",
    subType: "PVC",
    width: 0.7,
    height: 2.1,
    quantity: 2,
    unitPrice: 2200,
    hardwareCostPerPc: 600,
    installationHoursPerPc: 3
  },
  // Windows
  {
    id: "dw-4",
    type: "Window",
    name: "Living Room Powder Coated Sliding Windows (W1)",
    subType: "Sliding",
    width: 1.5,
    height: 1.2,
    quantity: 4,
    unitPrice: 6800,
    hardwareCostPerPc: 800,
    installationHoursPerPc: 3
  },
  {
    id: "dw-5",
    type: "Window",
    name: "Bedrooms Alum Casement Windows (W2)",
    subType: "Casement",
    width: 1.2,
    height: 1.2,
    quantity: 3,
    unitPrice: 5200,
    hardwareCostPerPc: 600,
    installationHoursPerPc: 3
  },
  {
    id: "dw-6",
    type: "Window",
    name: "Toilet Awning Glass Windows",
    subType: "Awning",
    width: 0.6,
    height: 0.6,
    quantity: 2,
    unitPrice: 1800,
    hardwareCostPerPc: 400,
    installationHoursPerPc: 2
  }
];

export const DEFAULT_ROOFING: RoofingElement[] = [
  {
    id: "roof-1",
    name: "Main Two-Sided Hip Roof",
    length: 12.0, // horizontal span
    width: 8.5,  // horizontal span
    slopeDegrees: 30, // slope
    overhang: 0.8, // eaves overhang on all sides
    purlinSpacing: 0.60,
    roofingType: "Rib Type Long Span",
    insulationType: "Double Foil",
    fasciaLength: 46.4, // perimeter with overhang eaves
    gutterLength: 25.6, // gutter horizontal edges
    ridgeRollLength: 12.0,
    flashingLength: 0.0
  }
];

export const DEFAULT_PAINTING: PaintingElement[] = [
  {
    id: "paint-1",
    name: "Interior Walls (Rooms and Social Spaces)",
    type: "Interior Walls",
    area: 280,
    numberOfCoats: 3, // 1 primer + 2 topcoats
    surfaceType: "Plastered CHB"
  },
  {
    id: "paint-2",
    name: "Exterior Concrete Walls (Facade & Perimeter)",
    type: "Exterior Walls",
    area: 195,
    numberOfCoats: 3,
    surfaceType: "Plastered CHB"
  },
  {
    id: "paint-3",
    name: "Slab Ceilings & Gypsum Boards Ceiling",
    type: "Ceilings",
    area: 140,
    numberOfCoats: 3,
    surfaceType: "Fiber Cement / Gypsum"
  },
  {
    id: "paint-4",
    name: "Steel Roof Framing Trusses Anti-Rust Paint",
    type: "Metal Works",
    area: 85,
    numberOfCoats: 2, // 1 red oxide primer + 1 topcoat
    surfaceType: "Structural Steel"
  }
];
