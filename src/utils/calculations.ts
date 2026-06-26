import {
  ConcreteElement,
  FormworkElement,
  CHBWallElement,
  TileElement,
  DoorWindowElement,
  RoofingElement,
  PaintingElement,
  MaterialItem,
  LaborItem,
  EquipmentItem
} from "../types";

// Standard Constants based on Philippine estimating practices (Fajardo's Simplified Estimate)
export const COEFF_CONCRETE = {
  // Quantities per 1.0 cu.m. of concrete (40kg bag cement, washed sand, crushed gravel)
  "Class A": { cement: 9.0, sand: 0.50, gravel: 1.00, water: 180 }, // 1:2:4 Mix
  "Class B": { cement: 7.5, sand: 0.50, gravel: 1.00, water: 170 }, // 1:2.5:5 Mix
  "Class C": { cement: 6.0, sand: 0.50, gravel: 1.00, water: 165 }  // 1:3:6 Mix
};

export const REBAR_KG_PER_M = {
  10: 0.617,
  12: 0.888,
  16: 1.578,
  20: 2.466,
  25: 3.853
};

// CHB Material Constants per 1 sqm of wall
export const CHB_BLOCKS_PER_SQM = 12.5; // standard block size: 400x200x(100/150)mm
export const COEFF_CHB_MORTAR = {
  // Cement bags and Sand cu.m. per 1 sqm of CHB wall (fill cores + joint mortar)
  "4\"": { cement: 0.32, sand: 0.025 },
  "6\"": { cement: 0.52, sand: 0.042 }
};
// Plastering Constants per 1 sqm of surface area (12mm thickness, 1:3 class A)
export const COEFF_PLASTERING = { cement: 0.11, sand: 0.009 };

// Tile adhesive and grout
export const ADHESIVE_BAGS_PER_SQM = 1 / 4.5; // 25kg bag covers ~4.5 sqm
export const GROUT_BAGS_PER_SQM = 1 / 4.0;    // 2kg grout bag covers ~4 sqm

// Painting Coverage (per 1 coat, in gallons per sqm)
export const PAINT_COVERAGE = {
  primer: 1 / 30,  // 30 sqm per gallon
  topcoat: 1 / 30, // 30 sqm per gallon
  putty: 1 / 25    // 25 sqm per gallon (bag/kg ratio converted or directly computed)
};

/**
 * ----------------- CONCRETE WORKS CALCULATIONS -----------------
 */
export function calculateConcreteVolume(element: ConcreteElement): number {
  return element.length * element.width * element.thickness * element.quantity;
}

export function calculateConcreteMaterials(element: ConcreteElement) {
  const vol = calculateConcreteVolume(element);
  const volWithWastage = vol * (1 + element.elementWastage / 100);
  const mix = COEFF_CONCRETE[element.concreteMix] || COEFF_CONCRETE["Class A"];

  return {
    volume: vol,
    volumeWithWastage: volWithWastage,
    cementBags: Math.ceil(volWithWastage * mix.cement),
    sandCubicMeters: Number((volWithWastage * mix.sand).toFixed(2)),
    gravelCubicMeters: Number((volWithWastage * mix.gravel).toFixed(2)),
    waterLiters: Math.ceil(volWithWastage * mix.water)
  };
}

export function calculateConcreteRebar(element: ConcreteElement) {
  const rebarWeightUnit = REBAR_KG_PER_M[element.rebarDiameter] || 0.617;
  let totalLengthLm = 0;

  // Grid structural calculations for Footings/Slabs vs Axial long-bar calculations for Beams/Columns
  if (element.category === "Footings") {
    // Footing footing grid rebar: grid of spaced bars (usually both directions)
    // spacing is in meters (rebarSpacing)
    const countL = Math.ceil(element.width / element.rebarSpacing) + 1;
    const countW = Math.ceil(element.length / element.rebarSpacing) + 1;
    // Length in L-dir is footing length + anchor hooks (~0.15m each side = 0.3m)
    const barLengthL = element.length + 0.3;
    const barLengthW = element.width + 0.3;
    totalLengthLm = ((countL * barLengthL) + (countW * barLengthW)) * element.quantity;
  } else if (element.category === "Suspended Slabs" || element.category === "Ground Slabs") {
    // 2-way slab rebar grid spacing
    const countL = Math.ceil(element.width / element.rebarSpacing) + 1;
    const countW = Math.ceil(element.length / element.rebarSpacing) + 1;
    const barLengthL = element.length + 0.3; // with laps/anchors
    const barLengthW = element.width + 0.3;
    totalLengthLm = ((countL * barLengthL) + (countW * barLengthW)) * element.quantity;
  } else if (element.category === "Columns" || element.category === "Beams") {
    // Beams & Columns longitudinal main reinforcement
    const mainBarsLength = element.rebarCountPerElement * element.rebarLength * element.quantity;
    
    // Stirrups/Ties calculations
    // Qty of stirrups = length of column/beam / spacing + 1
    const stirrupCount = Math.ceil(element.length / element.rebarSpacing) + 1;
    // Stirrup length: (W-0.08)*2 + (T-0.08)*2 + 0.15 hooks
    const wFree = Math.max(0.05, element.width - 0.08); // allow cover
    const tFree = Math.max(0.05, element.thickness - 0.08);
    const stirrupLength = (wFree * 2) + (tFree * 2) + 0.15;
    
    // Typically stirrup diameter is 10mm or similar. For simpler material list, assume stirrups use 10mm bars
    // We will calculate stirrups separately in steel weight
    const stirrupsLengthTotal = stirrupCount * stirrupLength * element.quantity;

    // We can add stirrup reinforcement. We'll simplify total steel length by treating main bar diameter and sub-bar diameter together
    // In final takeoff we multiply by respective bar diameter weights.
    // Return both main bars and stirrups
    const mainRebarWeight = mainBarsLength * rebarWeightUnit;
    const stirrupRebarWeight = stirrupsLengthTotal * REBAR_KG_PER_M[10]; // assuming 10mm structural stirrups standard in PH

    return {
      mainLengthM: mainBarsLength,
      mainWeightKg: mainRebarWeight,
      stirrupLengthM: stirrupsLengthTotal,
      stirrupWeightKg: stirrupRebarWeight,
      totalWeightKg: mainRebarWeight + stirrupRebarWeight,
      tieWireKg: Number(((mainRebarWeight + stirrupRebarWeight) * 0.02).toFixed(2)) // 2% of total rebar weight
    };
  } else {
    // Stairs or Landings
    const steelPerSqm = 12 * rebarWeightUnit; // typical 12 linear meters per sqm for stairs
    const area = element.length * element.width;
    totalLengthLm = steelPerSqm * area * element.quantity;
  }

  const weightKg = totalLengthLm * rebarWeightUnit;
  const steelWastageMultiplier = 1 + element.elementWastage / 100;
  const finalWeightKg = weightKg * steelWastageMultiplier;

  return {
    mainLengthM: totalLengthLm,
    mainWeightKg: finalWeightKg,
    stirrupLengthM: 0,
    stirrupWeightKg: 0,
    totalWeightKg: finalWeightKg,
    tieWireKg: Number((finalWeightKg * 0.02).toFixed(2)) // 2% of total rebar weight
  };
}

export function calculateConcreteLaborCost(element: ConcreteElement, laborDb: LaborItem[]): number {
  const vol = calculateConcreteVolume(element);
  
  // Quick parametric labor modeling typical of PH construction (approx 1,200 to 1,500 PHP per cu.m. including steel and forms)
  // Or: Excavation labor + Steel labor + Pouring labor
  // Foreman @ 1000/day, Mason @ 850/day, Helpers @ 600/day
  // Pouring 1 cu.m. concrete typically takes 1.5 man-days. Rebar take 0.02 man-day per kg. Excavation takes 1.2 man-day per cu.m.
  const rebarEst = calculateConcreteRebar(element);
  
  const excavationManDays = element.category === "Footings" ? vol * 1.0 : 0;
  const rebarManDays = rebarEst.totalWeightKg * 0.015; // 0.015 man-days per kg
  const concretePourManDays = vol * 0.8; // 0.8 man-day per cu.m.
  
  const totalLaborDays = excavationManDays + rebarManDays + concretePourManDays;
  const averageDailyCost = (850 + 600 + 600) / 3; // blended team: 1 skilled + 2 helpers
  
  return Math.ceil(totalLaborDays * averageDailyCost);
}

/**
 * ----------------- FORMWORKS & SCAFFOLDINGS -----------------
 */
export function calculateFormworkMaterials(element: FormworkElement) {
  const area = element.contactArea * element.quantity;
  const sheetsBase = area / 2.9768; // standard 4x8 sheet is 2.9768 sqm
  const plyQty = Math.ceil(sheetsBase / element.reuseFactor * 1.10); // + 10% wastage
  
  // Coco lumber (bd.ft.): PH standard is approx. 12 board feet of coco lumber supporting 1 sqm of formwork
  const cocoBdFt = Math.ceil((area * 12) / element.reuseFactor);
  
  // Common Wire Nails (CWN): 0.15 kg per sqm of formwork area
  const nailsKg = Number((area * 0.15).toFixed(2));
  
  // Form release oil: covers ~18.9 sqm per gallon
  const oilGal = Number((area / 18.9).toFixed(2));
  
  return {
    plywoodSheets: plyQty,
    cocoLumberBdFt: cocoBdFt,
    nailsKg: nailsKg,
    formOilGal: oilGal
  };
}

export function calculateFormworkLaborCost(element: FormworkElement): number {
  const area = element.contactArea * element.quantity;
  // Standard installation: PHP 250 to PHP 350 per square meter of formwork
  return Math.ceil(area * 300);
}

/**
 * ----------------- CHB WALL CALCULATIONS -----------------
 */
export function calculateCHBWallMaterials(element: CHBWallElement) {
  const netArea = (element.length * element.height - element.deductions);
  const finalArea = netArea > 0 ? netArea : 0;
  
  const chbQtyBase = finalArea * CHB_BLOCKS_PER_SQM;
  const wastageMultiplier = 1 + element.chbWastagePercent / 100;
  const totalCHB = Math.ceil(chbQtyBase * wastageMultiplier);

  // Mortar quantities (cores + joints)
  const mortarMix = COEFF_CHB_MORTAR[element.chbSize] || COEFF_CHB_MORTAR["4\""];
  const cementMortarBags = Math.ceil(finalArea * mortarMix.cement);
  const sandMortarCuM = Number((finalArea * mortarMix.sand).toFixed(3));

  // Plastering quantities (both sides = plaster area * 2)
  const plasterSalesArea = element.plasterBothSides ? finalArea * 2 : finalArea;
  const cementPlasterBags = Math.ceil(plasterSalesArea * COEFF_PLASTERING.cement);
  const sandPlasterCuM = Number((plasterSalesArea * COEFF_PLASTERING.sand).toFixed(3));

  // Rebars for masonry (verticals spaced, horizontals every N layers)
  // Vertical bars count = ceil(length / verticalSpacing) + 1
  const verticalCount = Math.ceil(element.length / element.verticalRebarSpacing) + 1;
  const verticalLengthPerBar = element.height + 0.30; // height + 300mm dowel overlay
  const totalVerticalLength = verticalCount * verticalLengthPerBar;

  // Horizontal bars count = total height / (horizontalSpacingInLayers * 0.2m layer height)
  // CHB unit is 0.2m high
  const spacingInMeters = element.horizontalRebarSpacing * 0.2;
  const horizontalLayers = Math.max(1, Math.floor(element.height / spacingInMeters));
  const horizontalLengthPerLayer = element.length + 0.40; // overlap anchors
  const totalHorizontalLength = horizontalLayers * horizontalLengthPerLayer;

  const totalRebarLengthM = (totalVerticalLength + totalHorizontalLength) * wastageMultiplier;
  const rebarWeightKg = totalRebarLengthM * REBAR_KG_PER_M[10]; // standard CHB reinforcing rebar is 10mm (0.617 kg/m)
  const rebarPcs10mm = Math.ceil(totalRebarLengthM / 6.0); // 6.0m commercial bar length

  return {
    netArea: Number(finalArea.toFixed(2)),
    chbPieces: totalCHB,
    mortarCementBags: cementMortarBags,
    mortarSandCubicMeters: sandMortarCuM,
    plasterCementBags: cementPlasterBags,
    plasterSandCubicMeters: sandPlasterCuM,
    totalCementBags: cementMortarBags + cementPlasterBags,
    totalSandCubicMeters: Number((sandMortarCuM + sandPlasterCuM).toFixed(2)),
    rebarPcs10mm: rebarPcs10mm,
    rebarWeightKg: Number(rebarWeightKg.toFixed(2)),
    tieWireKg: Number((rebarWeightKg * 0.02).toFixed(2))
  };
}

export function calculateCHBLaborCost(element: CHBWallElement): number {
  const netArea = (element.length * element.height - element.deductions);
  const finalArea = netArea > 0 ? netArea : 0;
  // Standard mason laying and plastering: lay: PHP 250/sqm, plaster both sides: PHP 180*2 = PHP 360/sqm.
  // Blended average: PHP 600 per square meter of CHB wall including horizontal/vertical steel and dual side plastering.
  return Math.ceil(finalArea * 600);
}

/**
 * ----------------- TILING WORKS CALCULATIONS -----------------
 */
export function calculateTileMaterials(element: TileElement) {
  let netArea = 0;
  
  if (element.type === "Stairs" && element.stepCount && element.lengthOrArea && element.widthOrRisers) {
    // For stairs, lengthOrArea is step width (m), widthOrRisers is riser height (~0.18m), treadWidth is tread (~0.30)
    // Area of stairs = stepcount * StepWidth * (Tread + Riser)
    const tread = element.treadWidth || 0.30;
    const riser = element.widthOrRisers;
    netArea = element.stepCount * element.lengthOrArea * (tread + riser);
  } else {
    // Floor/Wall
    if (element.widthOrRisers) {
      netArea = element.lengthOrArea * element.widthOrRisers;
    } else {
      netArea = element.lengthOrArea; // inputted directly as area in sqm
    }
  }

  const wastageMultiplier = 1 + element.wastagePercent / 100;
  const tileAreaWithWastage = netArea * wastageMultiplier;

  // Determine size in meters
  let tileLengthX = 0.3;
  let tileWidthY = 0.3;
  switch (element.tileSize) {
    case "30x30 cm": tileLengthX = 0.30; tileWidthY = 0.30; break;
    case "40x40 cm": tileLengthX = 0.40; tileWidthY = 0.40; break;
    case "60x60 cm": tileLengthX = 0.60; tileWidthY = 0.60; break;
    case "80x80 cm": tileLengthX = 0.80; tileWidthY = 0.80; break;
  }

  const tileArea = tileLengthX * tileWidthY;
  const totalTiles = Math.ceil(tileAreaWithWastage / tileArea);

  // Materials Adhesive & Grout
  const adhesiveBags = Math.ceil(netArea * ADHESIVE_BAGS_PER_SQM);
  const groutBags = Math.ceil(netArea * GROUT_BAGS_PER_SQM);
  
  // Custom PVC trim lengths: approx 1 corner linear meter per 2 sqm for wall tiles
  const trimsLength = element.type === "Wall" ? Math.ceil((netArea / 2) / 2.5) : 0; // PVC trims are 2.5m long

  return {
    computedArea: Number(netArea.toFixed(2)),
    tileCount: totalTiles,
    adhesiveBags: adhesiveBags,
    groutBags: groutBags,
    trimsQty: trimsLength
  };
}

export function calculateTileLaborCost(element: TileElement): number {
  const materials = calculateTileMaterials(element);
  const area = materials.computedArea;
  // Average tiling labor in PH: 350 PHP/sqm for floor, 400 PHP/sqm for wall, and 500 PHP/sqm for complex stair steps
  const rate = element.type === "Stairs" ? 550 : element.type === "Wall" ? 420 : 350;
  return Math.ceil(area * rate);
}

/**
 * ----------------- WINDOWS & DOORS -----------------
 */
export function calculateDoorWindowCost(element: DoorWindowElement) {
  const materialSubtotal = (element.unitPrice + element.hardwareCostPerPc) * element.quantity;
  // Blended labor daily cost: Labor base is 850/day (Skilled Carpenter), Helper 600/day. Blend is say PHP 100/hour
  const installationLabor = element.installationHoursPerPc * element.quantity * 120; // PHP 120 per hour
  return {
    materialCost: materialSubtotal,
    laborCost: installationLabor,
    totalCost: materialSubtotal + installationLabor
  };
}

/**
 * ----------------- ROOFING & TRUSSES -----------------
 */
export function calculateRoofingMaterials(element: RoofingElement) {
  // Footprint flat horizontal roof area including overhang on all sides
  const flatLength = element.length + 2 * element.overhang;
  const flatWidth = element.width + 2 * element.overhang;
  const footprintArea = flatLength * flatWidth;

  // Actual sloped surface area = FootprintArea / cos(slopeDegrees)
  const slopeRad = (element.slopeDegrees * Math.PI) / 180;
  const slopedArea = footprintArea / Math.cos(slopeRad);

  // Rib type Pre-painted roofing sheet effective width is typically 1.0m
  // Corrugated coverage is 0.80m, Tile effect is 1.0m
  const effectiveWidth = element.roofingType === "Corrugated Long Span" ? 0.80 : 1.00;
  const wastageCoeff = 1.08; // 8% wastage
  const roofingMetricTotalLM = Number((slopedArea / effectiveWidth * wastageCoeff).toFixed(1));

  // Steel Truss Angle Bars framing parametric calculator (high fidelity estimate based on sloped roof surface area)
  // Standard truss framing uses 50mm x 50mm x 4mm (2"x2" Angle Bar). Approx 0.4 lengths per sqm of sloped roof
  const angleBarsQty = Math.ceil(slopedArea * 0.40);
  
  // C-Purlins: spaced by purlinSpacing (meters)
  // Total span lines of spacing = slopedWidth / spacing
  // Total linear meters of purlins = flatLength * lines of spacing * 2 sides of slope
  // Plus 10% overlap and cuts
  const slopedWidthFromRidge = (flatWidth / 2) / Math.cos(slopeRad);
  const purlinLinesPerSide = Math.ceil(slopedWidthFromRidge / element.purlinSpacing) + 1;
  const purlinTotalLM = flatLength * purlinLinesPerSide * 2 * 1.10;
  const cPurlinsCount = Math.ceil(purlinTotalLM / 6.0); // 6m standard length

  // Welding Rods (20kg box): typically 0.04 box per purlin length
  const weldingRodsBoxQty = Math.ceil(cPurlinsCount * 0.03);

  // Fasteners: TekScrews (100 pcs per box). standard is ~12 textscrews per sqm
  const textscrewsCount = Math.ceil(slopedArea * 12);
  const textscrewsBoxes = Math.ceil(textscrewsCount / 100);

  // Protective Insulation
  const insulationRolls = element.insulationType === "None" ? 0 : Math.ceil(slopedArea / 50); // 50 sqm per 1m x 50m roll

  // Roof trims & flashing counts (ridge rolls, gutters at 8ft / 2.44m per pc)
  const ridgeRollCount = element.ridgeRollLength > 0 ? Math.ceil(element.ridgeRollLength / 2.2) : 0; // with overlaps
  const valleyGutterLength = (element as any).valleyGutterLength || 0;
  const valleyGutterCount = valleyGutterLength > 0 ? Math.ceil(valleyGutterLength / 2.2) : 0;
  const flashingCount = element.flashingLength > 0 ? Math.ceil(element.flashingLength / 2.2) : 0;
  const gutterCount = element.gutterLength > 0 ? Math.ceil(element.gutterLength / 2.2) : 0;

  // Downspouts (PVC 3" x 10ft / 3m): typical, 1 downspout of 5 meters per 6 meters of gutter length
  const downspoutLengthTotal = (element.gutterLength / 6.0) * 5.0; // 5 meters descent
  const downspoutCount = element.gutterLength > 0 ? Math.ceil(downspoutLengthTotal / 3.0) : 0;

  // Fascia board (length of 46.4m / 3m commercial length):
  const fasciaQty = element.fasciaLength > 0 ? Math.ceil(element.fasciaLength / 3.0) : 0;

  return {
    footprintArea: Number(footprintArea.toFixed(2)),
    slopedArea: Number(slopedArea.toFixed(2)),
    roofingLM: roofingMetricTotalLM,
    purlinsCount: cPurlinsCount,
    angleBarsCount: angleBarsQty,
    weldingRodsBox: weldingRodsBoxQty,
    insulationRolls: insulationRolls,
    textScrewsBoxes: textscrewsBoxes,
    ridgeRolls: ridgeRollCount,
    valleyGutters: valleyGutterCount,
    flashings: flashingCount,
    gutters: gutterCount,
    downspouts: downspoutCount,
    fasciaBoards: fasciaQty
  };
}

export function calculateRoofingLaborAndEquip(element: RoofingElement) {
  const mats = calculateRoofingMaterials(element);
  const area = mats.slopedArea;
  // Installation of structural trusses: PHP 280/sqm sloped and sheet installation + flashing: PHP 220/sqm.
  // Total labor rate is ~PHP 500 per square meter.
  const labor = Math.ceil(area * 500);

  // Small equipment cost (welding machine rentals, hoist etc.): dynamic flat daily scaffold charge or ~PHP 50 per sqm
  const equip = Math.ceil(area * 60);

  return { labor, equip };
}

/**
 * ----------------- PAINTING WORKS CALCULATIONS -----------------
 */
export function calculatePaintingMaterials(element: PaintingElement) {
  const area = element.area;
  // Primer Paint: 1 coat. covers ~30 sqm per gallon.
  const primerGallons = Math.ceil(area * PAINT_COVERAGE.primer);
  // Topcoat Paint: N-1 coats (usually 2 coats, as total is e.g. 3 with primer). Covers 30 sqm per coat.
  const coatsCount = Math.max(1, element.numberOfCoats - 1);
  const topcoatGallons = Math.ceil(area * PAINT_COVERAGE.topcoat * coatsCount);

  // Surface Preparation Putty / Patching:
  // Plastered walls require gypsum/concrete putty, typically 1 box/bag (25kg) covers ~25 sqm.
  let puttyBags = 0;
  if (element.surfaceType === "Plastered CHB" || element.surfaceType === "Fiber Cement / Gypsum") {
    puttyBags = Math.ceil(area * (1 / 25));
  } else if (element.surfaceType === "Wood Panels") {
    puttyBags = Math.ceil(area * (1 / 40)); // lighter wood putty
  }

  // Paint thinner/solvent (typically 1 gallon per 10 gallons of topcoat enamel/oil or concrete solvent)
  let thinnerGallons = 0;
  if (element.surfaceType === "Structural Steel" || element.surfaceType === "Wood Panels") {
    thinnerGallons = Math.ceil((primerGallons + topcoatGallons) * 0.15);
  }

  return {
    primerGallons: primerGallons,
    topcoatGallons: topcoatGallons,
    puttyBags: puttyBags,
    thinnerGallons: thinnerGallons
  };
}

export function calculatePaintingLaborCost(element: PaintingElement): number {
  // Painting labor in PH: typically PHP 150 to PHP 220 per square meter depending on height, prep work and coats
  const rate = element.type === "Exterior Walls" ? 220 : 160;
  return Math.ceil(element.area * rate * (element.numberOfCoats / 3)); // adjusted for number of coats
}

/**
 * ----------------- SYSTEM-WIDE COST TAKE-OFF MATHS -----------------
 */

// Helper to look up prices directly
export function lookupMaterialPrice(id: string, database: MaterialItem[]): number {
  const item = database.find(m => m.id === id);
  return item ? item.unitPrice : 0;
}

export function lookupMaterialPriceByName(name: string, database: MaterialItem[]): number {
  const item = database.find(m => m.name.toLowerCase().trim() === name.toLowerCase().trim());
  return item ? item.unitPrice : 0;
}

export function computeMarkup(baseCost: number, proj: {
  overheadPercent: number;
  contingencyPercent: number;
  profitPercent: number;
  vatPercent: number;
  mobilizationPercent: number;
}) {
  const overhead = baseCost * (proj.overheadPercent / 100);
  const contingency = baseCost * (proj.contingencyPercent / 100);
  const profit = baseCost * (proj.profitPercent / 100);
  const mobilization = baseCost * (proj.mobilizationPercent / 100);
  
  const subtotalWithMarkup = baseCost + overhead + contingency + profit + mobilization;
  const vat = subtotalWithMarkup * (proj.vatPercent / 100);
  
  return {
    overhead,
    contingency,
    profit,
    mobilization,
    vat,
    markupsTotal: overhead + contingency + profit + mobilization + vat,
    grandTotal: subtotalWithMarkup + vat
  };
}
