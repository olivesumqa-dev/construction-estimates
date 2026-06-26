import ExcelJS from "exceljs";
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
} from "../types";
import {
  calculateConcreteVolume,
  calculateConcreteMaterials,
  calculateConcreteRebar,
  calculateFormworkMaterials,
  calculateCHBWallMaterials,
  calculateTileMaterials,
  calculateRoofingMaterials,
  calculatePaintingMaterials,
  REBAR_KG_PER_M
} from "./calculations";

/**
 * Main routine to generate a styled Microsoft Excel Estimating Workbook (fully automated, formulas active)
 */
export async function generateEstimatingWorkbook(data: {
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
}) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Philippine Construction Estimator & Excel Sheets";
  workbook.lastModifiedBy = "Juan Dela Cruz, CE";
  workbook.created = new Date();
  workbook.modified = new Date();
  
  // Custom Color Palette Codes (Navy Blue, Slate Gray, Orange Highlights, Amber Inputs)
  const NAVY_HEADER_BG = "1B365D";
  const NAVY_HEADER_FG = "FFFFFF";
  const SLATE_BG = "F1F5F9";
  const SLATE_BORDER = "CBD5E1";
  const AMBER_INPUT_BG = "FEF3C7"; // For cells designated for user input
  const LIGHT_BLUE_RESULT = "F0F9FF"; // Formula/Protected cells
  
  // Standard Row styling helper
  const applyHeaderStyle = (sheet: ExcelJS.Worksheet, rowNumber: number, colors?: { bg?: string; fg?: string }) => {
    const row = sheet.getRow(rowNumber);
    row.height = 28;
    row.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: colors?.bg || NAVY_HEADER_BG }
      };
      cell.font = {
        name: "Segoe UI",
        size: 11,
        bold: true,
        color: { argb: colors?.fg || NAVY_HEADER_FG }
      };
      cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true };
      cell.border = {
        top: { style: "medium", color: { argb: "000000" } },
        bottom: { style: "medium", color: { argb: "000000" } },
        left: { style: "thin", color: { argb: SLATE_BORDER } },
        right: { style: "thin", color: { argb: SLATE_BORDER } }
      };
    });
  };

  const applyNormalRowStyle = (sheet: ExcelJS.Worksheet, rowNumber: number, isAlternate = false) => {
    const row = sheet.getRow(rowNumber);
    row.height = 20;
    row.eachCell((cell) => {
      cell.font = { name: "Segoe UI", size: 10 };
      cell.border = {
        top: { style: "thin", color: { argb: SLATE_BORDER } },
        bottom: { style: "thin", color: { argb: SLATE_BORDER } },
        left: { style: "thin", color: { argb: SLATE_BORDER } },
        right: { style: "thin", color: { argb: SLATE_BORDER } }
      };
      if (isAlternate) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "F8FAFC" }
        };
      }
    });
  };

  const applyFormulaCellStyle = (cell: ExcelJS.Cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: LIGHT_BLUE_RESULT }
    };
    cell.font = { name: "Segoe UI", size: 10, italic: true };
  };

  const applyInputCellStyle = (cell: ExcelJS.Cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: AMBER_INPUT_BG }
    };
    cell.font = { name: "Segoe UI", size: 10, bold: true };
  };

  // Helper to create basic header summary banner in each sheet
  const createSheetBanner = (sheet: ExcelJS.Worksheet, title: string, subtitle: string, lastColChar = "G") => {
    sheet.views = [{ showGridLines: true }];
    sheet.mergeCells(`A1:${lastColChar}1`);
    const mCell = sheet.getCell("A1");
    mCell.value = title;
    mCell.font = { name: "Segoe UI", size: 16, bold: true, color: { argb: "1E293B" } };
    mCell.alignment = { vertical: "middle", horizontal: "left" };
    sheet.getRow(1).height = 40;

    sheet.mergeCells(`A2:${lastColChar}2`);
    const mSubcell = sheet.getCell("A2");
    mSubcell.value = `${subtitle} | Ref: ${data.projectInfo.projectName}`;
    mSubcell.font = { name: "Segoe UI", size: 10, italic: true, color: { argb: "64748B" } };
    mSubcell.alignment = { vertical: "middle", horizontal: "left" };
    sheet.getRow(2).height = 20;

    sheet.getRow(3).height = 15; // Spacer row
    sheet.getRow(4).height = 15; // Spacer row
  };


  /**
   * ==========================================
   * 1. PROJECT INFO WORKSHEET
   * ==========================================
   */
  const wp = workbook.addWorksheet("PROJECT INFO");
  createSheetBanner(wp, "PROJECT INFORMATION PROFILE", "Residential Estimating Cost Model - Philippines", "B");
  wp.getColumn("A").width = 28;
  wp.getColumn("B").width = 50;

  wp.getRow(5).values = ["PARAMETER DESCRIPTION", "PROJECT ESTIMATING INPUTS"];
  applyHeaderStyle(wp, 5, { bg: "1E293B" });

  const pInfoRows = [
    ["Project Name", data.projectInfo.projectName],
    ["Client/Developer Name", data.projectInfo.clientName],
    ["Project Site Location", data.projectInfo.location],
    ["Licensed Estimator / QS", data.projectInfo.estimator],
    ["Total Floor Area (sq.m.)", data.projectInfo.floorArea],
    ["Estimating Baseline Date", data.projectInfo.date],
    ["Overhead Markup Factor (%)", data.projectInfo.overheadPercent / 100],
    ["Contingency Allowance (%)", data.projectInfo.contingencyPercent / 100],
    ["Contractor Profit Markup (%)", data.projectInfo.profitPercent / 100],
    ["Value Added Tax (VAT) (%)", data.projectInfo.vatPercent / 100],
    ["Mobilization/Demobilization (%)", data.projectInfo.mobilizationPercent / 100]
  ];

  pInfoRows.forEach((r, idx) => {
    const rowNum = 6 + idx;
    wp.getRow(rowNum).values = r;
    applyNormalRowStyle(wp, rowNum);
    applyInputCellStyle(wp.getCell(`B${rowNum}`));
    
    // Formatting numbers
    const cellA = wp.getCell(`A${rowNum}`);
    const cellB = wp.getCell(`B${rowNum}`);
    cellA.font = { name: "Segoe UI", size: 10, bold: true };
    if (r[0] === "Total Floor Area (sq.m.)") {
      cellB.numFmt = '#,##0.00" sq.m."';
    } else if (r[0].toString().includes("(%)")) {
      cellB.numFmt = "0.0%";
    }
  });


  /**
   * ==========================================
   * 2. DATABASES WORKSHEET (Materials, Labor, Equipment Price Points)
   * ==========================================
   */
  const wd = workbook.addWorksheet("DATABASES");
  createSheetBanner(wd, "ESTIMATING UNIT RATES DATABASE", "Master Unit Cost Price-book (Philippine Market Standard)", "E");
  wd.columns = [
    { key: "id", width: 15 },
    { key: "category", width: 22 },
    { key: "name", width: 50 },
    { key: "unit", width: 12 },
    { key: "unitPrice", width: 20 }
  ];

  wd.getRow(5).values = ["ITEM CODE", "CATEGORY", "MATERIAL / ITEM DESCRIPTION", "UNIT", "UNIT PRICE (PHP)"];
  applyHeaderStyle(wd, 5, { bg: "1E293B" });

  data.materials.forEach((mat, idx) => {
    const rNum = 6 + idx;
    wd.getRow(rNum).values = [mat.id, mat.category, mat.name, mat.unit, mat.unitPrice];
    applyNormalRowStyle(wd, rNum, idx % 2 === 1);
    wd.getCell(`E${rNum}`).numFmt = '"₱"#,##0.00';
    applyInputCellStyle(wd.getCell(`E${rNum}`)); // Editable helper representation
  });

  // Appendix columns for Labor & Equipment
  const baselineMatCount = data.materials.length;
  wd.getRow(6 + baselineMatCount).values = [];
  wd.getRow(6 + baselineMatCount + 1).values = [];
  
  const midSecRow = 6 + baselineMatCount + 2;
  wd.getRow(midSecRow).values = ["LABOR ROLE MASTER RATES", "", "", ""];
  wd.getCell(`A${midSecRow}`).font = { name: "Segoe UI", size: 12, bold: true, color: { argb: "334155" } };
  
  const midSecHeaderRow = midSecRow + 1;
  wd.getRow(midSecHeaderRow).values = ["LABOR CODE", "WORK FORCE / ROLE", "UNIT", "DAILY RATE (PHP)"];
  applyHeaderStyle(wd, midSecHeaderRow, { bg: "0F766E" });

  data.labor.forEach((lab, idx) => {
    const rNum = midSecHeaderRow + 1 + idx;
    wd.getRow(rNum).values = [lab.id, lab.role, "8-hour day", lab.dailyRate];
    applyNormalRowStyle(wd, rNum, idx % 2 === 1);
    wd.getCell(`D${rNum}`).numFmt = '"₱"#,##0.00';
    applyInputCellStyle(wd.getCell(`D${rNum}`));
  });

  const baselineLaborCount = data.labor.length;
  const preEquipGap = midSecHeaderRow + 1 + baselineLaborCount;
  wd.getRow(preEquipGap).values = [];
  wd.getRow(preEquipGap + 1).values = [];

  const equipSecRow = preEquipGap + 2;
  wd.getRow(equipSecRow).values = ["HEAVY MACHINERY & EQUIPMENT RENTAL FEES", "", "", ""];
  wd.getCell(`A${equipSecRow}`).font = { name: "Segoe UI", size: 12, bold: true, color: { argb: "334155" } };

  const equipSecHeaderRow = equipSecRow + 1;
  wd.getRow(equipSecHeaderRow).values = ["EQUIP CODE", "EQUIPMENT PROFILE", "RENTAL UNIT STATUS", "HOURLY RATE (PHP)"];
  applyHeaderStyle(wd, equipSecHeaderRow, { bg: "D97706" });

  data.equipment.forEach((eq, idx) => {
    const rNum = equipSecHeaderRow + 1 + idx;
    wd.getRow(rNum).values = [eq.id, eq.name, "Per Hour", eq.hourlyRate];
    applyNormalRowStyle(wd, rNum, idx % 2 === 1);
    wd.getCell(`D${rNum}`).numFmt = '"₱"#,##0.00';
    applyInputCellStyle(wd.getCell(`D${rNum}`));
  });


  /**
   * ==========================================
   * 3. REINFORCED CONCRETE WORKS
   * ==========================================
   */
  const wc = workbook.addWorksheet("CONCRETE WORKS");
  createSheetBanner(wc, "DIVISION 03 - REINFORCED CONCRETE CALCULATOR", "Automatic Structural Quantity Takeoff", "M");
  
  wc.columns = [
    { key: "name", width: 25 },
    { key: "length", width: 10 },
    { key: "width", width: 10 },
    { key: "thickness", width: 11 },
    { key: "qty", width: 11 },
    { key: "vol", width: 13 },
    { key: "mix", width: 12 },
    { key: "cement", width: 13 },
    { key: "sand", width: 13 },
    { key: "gravel", width: 14 },
    { key: "rebar", width: 13 },
    { key: "wire", width: 14 },
    { key: "cost", width: 18 }
  ];

  wc.getRow(5).values = ["ELEMENT NAME", "L (m)", "W (m)", "H / T (m)", "QTY (pcs)", "VOL (cu.m.)", "MIX CLASS", "CEMENT (bag)", "SAND (cu.m.)", "GRAVEL (cu.m.)", "REBAR (kg)", "TIE WIRE (kg)", "TOTAL ITEM COST"];
  applyHeaderStyle(wc, 5);

  let concGrandTotalRowStart = 6;
  data.concrete.forEach((item, idx) => {
    const rNum = 6 + idx;
    
    // Computed values
    const vol = calculateConcreteVolume(item);
    const mats = calculateConcreteMaterials(item);
    const steel = calculateConcreteRebar(item);

    // Dynamic material pricing lookup logic (Cement @ mat-1 index 6, Sand @ mat-2 index 7, Gravel @ mat-3 index 8 in databases sheet)
    const cementDbCell = "'DATABASES'!E6"; 
    const sandDbCell = "'DATABASES'!E7";
    const gravelDbCell = "'DATABASES'!E8";
    
    // Choose rebar row based on diameter
    let rebarDbCell = "'DATABASES'!E10"; // default 10mm
    if (item.rebarDiameter === 12) rebarDbCell = "'DATABASES'!E11";
    if (item.rebarDiameter === 16) rebarDbCell = "'DATABASES'!E12";
    if (item.rebarDiameter === 20) rebarDbCell = "'DATABASES'!E13";
    if (item.rebarDiameter === 25) rebarDbCell = "'DATABASES'!E14";
    const wiredCell = "'DATABASES'!E15";

    // Standard structural concrete composite labor estimation per cu.m. ~ PHP 4200 per cu.m.
    const compositeLaborRate = 4200;

    // Write row explicitly by index!
    wc.getRow(rNum).values = [
      item.name,
      item.length,
      item.width,
      item.thickness,
      item.quantity,
      { formula: `B${rNum}*C${rNum}*D${rNum}*E${rNum}` }, // Active Excel Volume Formula!
      item.concreteMix,
      // Cement formula based on mix class multiplier
      { formula: `ROUND(F${rNum}*${item.concreteMix === "Class A" ? 9.0 : item.concreteMix === "Class B" ? 7.5 : 6.0}, 0)` },
      { formula: `ROUND(F${rNum}*0.50, 2)` },
      { formula: `ROUND(F${rNum}*1.00, 2)` },
      steel.totalWeightKg, // Rebar weight computed in back-end for initial load
      { formula: `ROUND(K${rNum}*0.02, 2)` }, // 2% tie wire weight
      // Material cost + Labor cost subtotal formulas!
      { formula: `(H${rNum}*${cementDbCell}) + (I${rNum}*${sandDbCell}) + (J${rNum}*${gravelDbCell}) + (K${rNum}*(${rebarDbCell}/6.0/${REBAR_KG_PER_M[item.rebarDiameter]})) + (L${rNum}*${wiredCell}) + (F${rNum}*${compositeLaborRate})` }
    ];

    applyNormalRowStyle(wc, rNum, idx % 2 === 1);
    
    // Highlight input cells
    applyInputCellStyle(wc.getCell(`B${rNum}`));
    applyInputCellStyle(wc.getCell(`C${rNum}`));
    applyInputCellStyle(wc.getCell(`D${rNum}`));
    applyInputCellStyle(wc.getCell(`E${rNum}`));
    
    // Highlight formulas
    applyFormulaCellStyle(wc.getCell(`F${rNum}`));
    applyFormulaCellStyle(wc.getCell(`H${rNum}`));
    applyFormulaCellStyle(wc.getCell(`I${rNum}`));
    applyFormulaCellStyle(wc.getCell(`J${rNum}`));
    applyFormulaCellStyle(wc.getCell(`L${rNum}`));
    applyFormulaCellStyle(wc.getCell(`M${rNum}`));

    // Formats
    wc.getCell(`F${rNum}`).numFmt = "0.00";
    wc.getCell(`H${rNum}`).numFmt = "#,##0";
    wc.getCell(`I${rNum}`).numFmt = "0.00";
    wc.getCell(`J${rNum}`).numFmt = "0.00";
    wc.getCell(`K${rNum}`).numFmt = "#,##0.0";
    wc.getCell(`L${rNum}`).numFmt = "0.00";
    wc.getCell(`M${rNum}`).numFmt = '"₱"#,##0.00';
  });

  const size = data.concrete.length;
  const totRow = 6 + size;
  wc.getRow(totRow).values = [
    "TOTAL SITE CONCRETE DIVISION",
    "", "", "", "",
    { formula: `SUM(F6:F${totRow-1})` },
    "",
    { formula: `SUM(H6:H${totRow-1})` },
    { formula: `SUM(I6:I${totRow-1})` },
    { formula: `SUM(J6:J${totRow-1})` },
    { formula: `SUM(K6:K${totRow-1})` },
    { formula: `SUM(L6:L${totRow-1})` },
    { formula: `SUM(M6:M${totRow-1})` }
  ];

  wc.getRow(totRow).height = 24;
  wc.getRow(totRow).eachCell((cell) => {
    cell.font = { name: "Segoe UI", size: 10, bold: true, color: { argb: "1E293B" } };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "93C5FD" } // soft blue total highlight
    };
  });
  wc.getCell(`F${totRow}`).numFmt = '0.0" cu.m."';
  wc.getCell(`M${totRow}`).numFmt = '"₱"#,##0.00';


  /**
   * ==========================================
   * 4. FORMWORKS & SCAFFOLDINGS WORKSHEET
   * ==========================================
   */
  const wf = workbook.addWorksheet("FORMWORKS & SCAFFOLDS");
  createSheetBanner(wf, "DIVISION 04 - FORMWORKS & SCAFFOLDINGS", "System Shuttering and Props Breakdown", "G");
  
  wf.columns = [
    { key: "name", width: 25 },
    { key: "area", width: 20 },
    { key: "reuse", width: 14 },
    { key: "plywood", width: 18 },
    { key: "lumber", width: 20 },
    { key: "nails", width: 15 },
    { key: "cost", width: 22 }
  ];

  wf.getRow(5).values = ["ELEMENT WORK DESCRIPTION", "CONTACT AREA (sqm)", "REUSE TIMES", "PLYWOOD (sheets)", "COCO LUMBER (bd.ft)", "CWN NAILS (kg)", "ESTIMATED ITEM COST (PHP)"];
  applyHeaderStyle(wf, 5);

  data.formworks.forEach((item, idx) => {
    const rNum = 6 + idx;
    const mats = calculateFormworkMaterials(item);
    
    // Lookups inside DATABASES:
    const plyPriceCell = item.plywoodThickness === "3/4\"" ? "'DATABASES'!E18" : "'DATABASES'!E17";
    const cocoPriceCell = "'DATABASES'!E20";
    const nailPriceCell = "'DATABASES'!E21";
    const laborSqm = 320;

    wf.getRow(rNum).values = [
      item.name,
      item.contactArea,
      item.reuseFactor,
      { formula: `ROUNDUP((B${rNum}/2.97)/C${rNum}*1.1, 0)` }, // Plywood 4x8 formula with 10% wastage
      { formula: `ROUNDUP((B${rNum}*12)/C${rNum}, 0)` },       // Coco lumber standard multiplier formula of 12 bdft / sqm
      { formula: `ROUND(B${rNum}*0.15, 1)` },                   // Nails standard multiplier formula of 0.15 kg / sqm
      { formula: `(D${rNum}*${plyPriceCell}) + (E${rNum}*${cocoPriceCell}) + (F${rNum}*${nailPriceCell}) + (B${rNum}*${laborSqm})` }
    ];

    applyNormalRowStyle(wf, rNum, idx % 2 === 1);
    applyInputCellStyle(wf.getCell(`B${rNum}`));
    applyInputCellStyle(wf.getCell(`C${rNum}`));
    applyFormulaCellStyle(wf.getCell(`D${rNum}`));
    applyFormulaCellStyle(wf.getCell(`E${rNum}`));
    applyFormulaCellStyle(wf.getCell(`F${rNum}`));
    applyFormulaCellStyle(wf.getCell(`G${rNum}`));

    wf.getCell(`D${rNum}`).numFmt = "#,##0";
    wf.getCell(`E${rNum}`).numFmt = "#,##0";
    wf.getCell(`F${rNum}`).numFmt = "0.0";
    wf.getCell(`G${rNum}`).numFmt = '"₱"#,##0.00';
  });

  const formSize = data.formworks.length;
  const formTotRow = 6 + formSize;
  wf.getRow(formTotRow).values = [
    "TOTAL FORMWORKS DIVISION",
    { formula: `SUM(B6:B${formTotRow-1})` },
    "",
    { formula: `SUM(D6:D${formTotRow-1})` },
    { formula: `SUM(E6:E${formTotRow-1})` },
    { formula: `SUM(F6:F${formTotRow-1})` },
    { formula: `SUM(G6:G${formTotRow-1})` }
  ];
  wf.getRow(formTotRow).height = 24;
  wf.getRow(formTotRow).eachCell((cell) => {
    cell.font = { name: "Segoe UI", size: 10, bold: true };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "93C5FD" } };
  });
  wf.getCell(`G${formTotRow}`).numFmt = '"₱"#,##0.00';


  /**
   * ==========================================
   * 5. CHB WALLS WORKSHEET
   * ==========================================
   */
  const wCHB = workbook.addWorksheet("CHB MASONRY & PLASTER");
  createSheetBanner(wCHB, "DIVISION 05 - MASONRY WORKS", "Concrete Hollow Blocks Construction details", "K");

  wCHB.columns = [
    { key: "name", width: 22 },
    { key: "size", width: 8 },
    { key: "length", width: 10 },
    { key: "height", width: 10 },
    { key: "deduct", width: 14 },
    { key: "netArea", width: 12 },
    { key: "blocks", width: 12 },
    { key: "cement", width: 14 },
    { key: "sand", width: 14 },
    { key: "rebar", width: 16 },
    { key: "cost", width: 22 }
  ];

  wCHB.getRow(5).values = ["WALL WALL DIVISION", "SIZE", "L (m)", "H (m)", "DEDUCT (sqm)", "NET AREA", "CHB (pcs)", "CEMENT (bag)", "SAND (cu.m.)", "10mm REBAR (pc)", "ESTIMATED ITEM COST (PHP)"];
  applyHeaderStyle(wCHB, 5);

  data.chb.forEach((item, idx) => {
    const rNum = 6 + idx;
    
    // Lookups inside master prices:
    const chbPriceCell = item.chbSize === "6\"" ? "'DATABASES'!E24" : "'DATABASES'!E23";
    const cementPriceCell = "'DATABASES'!E6"; 
    const sandPriceCell = "'DATABASES'!E7";   
    const steel10mmPriceCell = "'DATABASES'!E10"; 
    
    const compositeLaborRate = 480; // PHP/sqm
    
    // Mortar multipliers
    const cemMult = item.chbSize === "6\"" ? 0.52 + 0.22 : 0.32 + 0.11; // mort + plas
    const sandMult = item.chbSize === "6\"" ? 0.042 + 0.018 : 0.025 + 0.009;

    wCHB.getRow(rNum).values = [
      item.name,
      item.chbSize,
      item.length,
      item.height,
      item.deductions,
      { formula: `ROUND((C${rNum}*D${rNum})-E${rNum}, 2)` }, // NET AREA formula
      { formula: `ROUNDUP(F${rNum}*12.5*1.05, 0)` },        // Block pieces (12.5 per sqm + 5% wastage)
      { formula: `ROUNDUP(F${rNum}*${cemMult}, 0)` },        // Combined cement bags (laying + dual side plastering)
      { formula: `ROUND(F${rNum}*${sandMult}, 2)` },         // Sand cu.m. (laying + dual side plastering)
      { formula: `ROUNDUP(((H${rNum}/C${rNum})*D${rNum})*2, 0)` }, // Parametric steel pcs estimation
      { formula: `(G${rNum}*${chbPriceCell}) + (H${rNum}*${cementPriceCell}) + (I${rNum}*${sandPriceCell}) + (J${rNum}*${steel10mmPriceCell}) + (F${rNum}*${compositeLaborRate})` }
    ];

    applyNormalRowStyle(wCHB, rNum, idx % 2 === 1);
    applyInputCellStyle(wCHB.getCell(`C${rNum}`));
    applyInputCellStyle(wCHB.getCell(`D${rNum}`));
    applyInputCellStyle(wCHB.getCell(`E${rNum}`));
    applyFormulaCellStyle(wCHB.getCell(`F${rNum}`));
    applyFormulaCellStyle(wCHB.getCell(`G${rNum}`));
    applyFormulaCellStyle(wCHB.getCell(`H${rNum}`));
    applyFormulaCellStyle(wCHB.getCell(`I${rNum}`));
    applyFormulaCellStyle(wCHB.getCell(`J${rNum}`));
    applyFormulaCellStyle(wCHB.getCell(`K${rNum}`));

    wCHB.getCell(`F${rNum}`).numFmt = "0.00";
    wCHB.getCell(`G${rNum}`).numFmt = "#,##0";
    wCHB.getCell(`H${rNum}`).numFmt = "#,##0";
    wCHB.getCell(`I${rNum}`).numFmt = "0.00";
    wCHB.getCell(`J${rNum}`).numFmt = "#,##0";
    wCHB.getCell(`K${rNum}`).numFmt = '"₱"#,##0.00';
  });

  const chbSize = data.chb.length;
  const chbTotRow = 6 + chbSize;
  wCHB.getRow(chbTotRow).values = [
    "TOTAL MASONRY DIVISION",
    "", "", "", "",
    { formula: `SUM(F6:F${chbTotRow-1})` },
    { formula: `SUM(G6:G${chbTotRow-1})` },
    { formula: `SUM(H6:H${chbTotRow-1})` },
    { formula: `SUM(I6:I${chbTotRow-1})` },
    { formula: `SUM(J6:J${chbTotRow-1})` },
    { formula: `SUM(K6:K${chbTotRow-1})` }
  ];
  wCHB.getRow(chbTotRow).height = 24;
  wCHB.getRow(chbTotRow).eachCell((cell) => {
    cell.font = { name: "Segoe UI", size: 10, bold: true };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "93C5FD" } };
  });
  wCHB.getCell(`K${chbTotRow}`).numFmt = '"₱"#,##0.00';


  /**
   * ==========================================
   * 6. FLOORS & WALLS TILING
   * ==========================================
   */
  const wTiles = workbook.addWorksheet("TILING WORKS");
  createSheetBanner(wTiles, "DIVISION 09A - INTERIOR TILING DETAILS", "Surface Tiling Takeoff Calculations", "H");

  wTiles.columns = [
    { key: "name", width: 25 },
    { key: "size", width: 14 },
    { key: "type", width: 14 },
    { key: "area", width: 18 },
    { key: "pcs", width: 14 },
    { key: "adhesive", width: 16 },
    { key: "grout", width: 14 },
    { key: "cost", width: 24 }
  ];

  wTiles.getRow(5).values = ["TILING DESCRIPTION", "TILE SIZE", "FLOOR / WALL", "INPUT AREA (sqm)", "TILES (pcs)", "ADHESIVE (bags)", "GROUT (bags)", "ESTIMATED ITEM COST (PHP)"];
  applyHeaderStyle(wTiles, 5);

  data.tiles.forEach((item, idx) => {
    const rNum = 6 + idx;
    
    // Choose master price in database sheets:
    let tilePriceCell = "'DATABASES'!E29"; // default 60x60
    let sizeFactorSq = 0.36; // 60x60
    if (item.tileSize === "30x30 cm") {
      tilePriceCell = "'DATABASES'!E27";
      sizeFactorSq = 0.09;
    } else if (item.tileSize === "40x40 cm") {
      tilePriceCell = "'DATABASES'!E28";
      sizeFactorSq = 0.16;
    } else if (item.tileSize === "80x80 cm") {
      tilePriceCell = "'DATABASES'!E30";
      sizeFactorSq = 0.64;
    }
    
    const adhesivePriceCell = "'DATABASES'!E25"; // standard 25kg bag
    const groutPriceCell = "'DATABASES'!E26";    // standard grout bag
    const laborRateSqm = 380; // PHP/sqm standard masonry tiling price

    wTiles.getRow(rNum).values = [
      item.name,
      item.tileSize,
      item.type,
      item.lengthOrArea,
      { formula: `ROUNDUP((D${rNum}/${sizeFactorSq})*1.1, 0)` }, // Tiles pieces formula including 10% wastage
      { formula: `ROUNDUP(D${rNum}*0.22, 0)` },                  // Adhesive: 1 bag (25kg) covers 4.5 sqm -> Factor = 0.22
      { formula: `ROUNDUP(D${rNum}*0.25, 0)` },                  // Grout: 1 bag (2kg) covers 4 sqm -> Factor = 0.25
      { formula: `(E${rNum}*${tilePriceCell}) + (F${rNum}*${adhesivePriceCell}) + (G${rNum}*${groutPriceCell}) + (D${rNum}*${laborRateSqm})` }
    ];

    applyNormalRowStyle(wTiles, rNum, idx % 2 === 1);
    applyInputCellStyle(wTiles.getCell(`D${rNum}`));
    applyFormulaCellStyle(wTiles.getCell(`E${rNum}`));
    applyFormulaCellStyle(wTiles.getCell(`F${rNum}`));
    applyFormulaCellStyle(wTiles.getCell(`G${rNum}`));
    applyFormulaCellStyle(wTiles.getCell(`H${rNum}`));

    wTiles.getCell(`E${rNum}`).numFmt = "#,##0";
    wTiles.getCell(`F${rNum}`).numFmt = "#,##0";
    wTiles.getCell(`G${rNum}`).numFmt = "#,##0";
    wTiles.getCell(`H${rNum}`).numFmt = '"₱"#,##0.00';
  });

  const tileCount = data.tiles.length;
  const tileTotRow = 6 + tileCount;
  wTiles.getRow(tileTotRow).values = [
    "TOTAL TILING MODULES",
    "", "",
    { formula: `SUM(D6:D${tileTotRow-1})` },
    { formula: `SUM(E6:E${tileTotRow-1})` },
    { formula: `SUM(F6:F${tileTotRow-1})` },
    { formula: `SUM(G6:G${tileTotRow-1})` },
    { formula: `SUM(H6:H${tileTotRow-1})` }
  ];
  wTiles.getRow(tileTotRow).height = 24;
  wTiles.getRow(tileTotRow).eachCell((cell) => {
    cell.font = { name: "Segoe UI", size: 10, bold: true };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "93C5FD" } };
  });
  wTiles.getCell(`H${tileTotRow}`).numFmt = '"₱"#,##0.00';


  /**
   * ==========================================
   * 7. DOORS & WINDOWS WORKSHEET
   * ==========================================
   */
  const wOpening = workbook.addWorksheet("DOORS & WINDOWS");
  createSheetBanner(wOpening, "DIVISION 08 - DOORS, WINDOWS & METAL FRAMINGS", "Schedule of Openings and Installation Costs", "H");

  wOpening.columns = [
    { key: "name", width: 32 },
    { key: "type", width: 12 },
    { key: "width", width: 10 },
    { key: "height", width: 10 },
    { key: "quantity", width: 12 },
    { key: "itemPrice", width: 18 },
    { key: "labor", width: 20 },
    { key: "total", width: 22 }
  ];

  wOpening.getRow(5).values = ["SCHEDULE ITEM DESCRIPTION", "TYPE", "W (m)", "H (m)", "QTY (sets)", "SET COST (PHP)", "INSTALLATION LABOR", "TOTAL ITEM COST (PHP)"];
  applyHeaderStyle(wOpening, 5);

  data.doorsWindows.forEach((item, idx) => {
    const rNum = 6 + idx;
    const laborHourRate = 120; // PHP/Hr
    const rawLaborCost = item.installationHoursPerPc * laborHourRate;

    wOpening.getRow(rNum).values = [
      item.name,
      item.type,
      item.width,
      item.height,
      item.quantity,
      item.unitPrice + item.hardwareCostPerPc,
      { formula: `E${rNum}*${rawLaborCost}` }, // Installation math formula
      { formula: `E${rNum}*(F${rNum}+(${rawLaborCost}))` }
    ];

    applyNormalRowStyle(wOpening, rNum, idx % 2 === 1);
    applyInputCellStyle(wOpening.getCell(`C${rNum}`));
    applyInputCellStyle(wOpening.getCell(`D${rNum}`));
    applyInputCellStyle(wOpening.getCell(`E${rNum}`));
    applyInputCellStyle(wOpening.getCell(`F${rNum}`));
    applyFormulaCellStyle(wOpening.getCell(`G${rNum}`));
    applyFormulaCellStyle(wOpening.getCell(`H${rNum}`));

    wOpening.getCell(`F${rNum}`).numFmt = '"₱"#,##0.00';
    wOpening.getCell(`G${rNum}`).numFmt = '"₱"#,##0.00';
    wOpening.getCell(`H${rNum}`).numFmt = '"₱"#,##0.00';
  });

  const opCount = data.doorsWindows.length;
  const opTotRow = 6 + opCount;
  wOpening.getRow(opTotRow).values = [
    "TOTAL DOORS & WINDOWS DIVISION",
    "", "", "",
    { formula: `SUM(E6:E${opTotRow-1})` },
    "",
    { formula: `SUM(G6:G${opTotRow-1})` },
    { formula: `SUM(H6:H${opTotRow-1})` }
  ];
  wOpening.getRow(opTotRow).height = 24;
  wOpening.getRow(opTotRow).eachCell((cell) => {
    cell.font = { name: "Segoe UI", size: 10, bold: true };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "93C5FD" } };
  });
  wOpening.getCell(`H${opTotRow}`).numFmt = '"₱"#,##0.00';


  /**
   * ==========================================
   * 8. ROOFING & STEEL TRUSSES WORKSHEET
   * ==========================================
   */
  const wRoof = workbook.addWorksheet("TRUSSES & ROOFING");
  createSheetBanner(wRoof, "DIVISION 07 - ROOFING SYSTEM & STEEL TRUSSES", "Roof Framing steel structures and Sheets takeaway", "G");

  wRoof.columns = [
    { key: "name", width: 28 },
    { key: "area", width: 16 },
    { key: "sheets", width: 22 },
    { key: "purlins", width: 22 },
    { key: "angles", width: 22 },
    { key: "insul", width: 18 },
    { key: "cost", width: 24 }
  ];

  wRoof.getRow(5).values = ["ROOF ITEM DESCRIPTION", "NET AREA (sqm)", "ROOF TILES / PRE-PAINTED (l.m.)", "C-PURLIN FRAMES (pcs)", "TRUSS ANGLE BARS (pcs)", "HEAT INSULATION (rolls)", "ESTIMATED DIVISION COST"];
  applyHeaderStyle(wRoof, 5);

  data.roofing.forEach((item, idx) => {
    const rNum = 6 + idx;
    const mats = calculateRoofingMaterials(item);
    
    // Database sheet reference indices:
    const sheetsPriceCell = "'DATABASES'!E36";       // Rib type pre-painted sheet per linear meter
    const purlinPriceCell = "'DATABASES'!E33";       // C-Purlin length
    const anglePriceCell = "'DATABASES'!E35";        // Truss angle bar length
    const insulationPriceCell = "'DATABASES'!E44";   // Insulation single/double bubble roll
    
    const purlinSpac = item.purlinSpacing;
    const ribCoverage = 1.0; 
    
    // Trusses labor flat rate of structural assembly ~ PHP 480 per sqm footprint
    const compositeFramingLabor = 520; // PHP/sqm of structure

    wRoof.getRow(rNum).values = [
      item.name,
      mats.slopedArea, // dynamic computed mathematical slope area in back-end
      { formula: `ROUNDUP((B${rNum}/${ribCoverage})*1.08, 1)` }, // Sheet linear meters formula + 8% waste
      { formula: `ROUNDUP((B${rNum}/${purlinSpac})/6.0, 0)` },    // C-Purlin count (6m standard commercial length)
      { formula: `ROUNDUP(B${rNum}*0.42, 0)` },                  // Angle bars (approx 0.42 pcs per sqm of sloped roof)
      { formula: `ROUNDUP(B${rNum}/50.0, 0)` },                  // Standard bubble foil insulation rolls
      { formula: `(C${rNum}*${sheetsPriceCell}) + (D${rNum}*${purlinPriceCell}) + (E${rNum}*${anglePriceCell}) + (F${rNum}*${insulationPriceCell}) + (B${rNum}*${compositeFramingLabor})` }
    ];

    applyNormalRowStyle(wRoof, rNum, idx % 2 === 1);
    applyInputCellStyle(wRoof.getCell(`B${rNum}`));
    applyFormulaCellStyle(wRoof.getCell(`C${rNum}`));
    applyFormulaCellStyle(wRoof.getCell(`D${rNum}`));
    applyFormulaCellStyle(wRoof.getCell(`E${rNum}`));
    applyFormulaCellStyle(wRoof.getCell(`F${rNum}`));
    applyFormulaCellStyle(wRoof.getCell(`G${rNum}`));

    wRoof.getCell(`B${rNum}`).numFmt = "0.0";
    wRoof.getCell(`C${rNum}`).numFmt = "0.0";
    wRoof.getCell(`D${rNum}`).numFmt = "#,##0";
    wRoof.getCell(`E${rNum}`).numFmt = "#,##0";
    wRoof.getCell(`F${rNum}`).numFmt = "#,##0";
    wRoof.getCell(`G${rNum}`).numFmt = '"₱"#,##0.00';
  });

  const rfCount = data.roofing.length;
  const rfTotRow = 6 + rfCount;
  wRoof.getRow(rfTotRow).values = [
    "TOTAL ROOFING DIVISION",
    { formula: `SUM(B6:B${rfTotRow-1})` },
    { formula: `SUM(C6:C${rfTotRow-1})` },
    { formula: `SUM(D6:D${rfTotRow-1})` },
    { formula: `SUM(E6:E${rfTotRow-1})` },
    { formula: `SUM(F6:F${rfTotRow-1})` },
    { formula: `SUM(G6:G${rfTotRow-1})` }
  ];
  wRoof.getRow(rfTotRow).height = 24;
  wRoof.getRow(rfTotRow).eachCell((cell) => {
    cell.font = { name: "Segoe UI", size: 10, bold: true };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "93C5FD" } };
  });
  wRoof.getCell(`G${rfTotRow}`).numFmt = '"₱"#,##0.00';


  /**
   * ==========================================
   * 9. PAINTING WORKS WORKSHEET
   * ==========================================
   */
  const wPaint = workbook.addWorksheet("PAINTING WORKS");
  createSheetBanner(wPaint, "DIVISION 09B - PROTECTIVE PAINTING WORKS", "Interior and Exterior Finishes Takeoff", "G");

  wPaint.columns = [
    { key: "name", width: 28 },
    { key: "area", width: 14 },
    { key: "coats", width: 10 },
    { key: "primer", width: 18 },
    { key: "topcoat", width: 18 },
    { key: "putty", width: 18 },
    { key: "cost", width: 22 }
  ];

  wPaint.getRow(5).values = ["PAINT SURFACE AREA PLAN", "AREA (sqm)", "COATS", "PRIMER (gallons)", "TOPCOAT (gallons)", "PATCH PUTTY (bags)", "ESTIMATED FINISH COST"];
  applyHeaderStyle(wPaint, 5);

  data.painting.forEach((item, idx) => {
    const rNum = 6 + idx;
    
    // Lookups in master prices:
    const FlatLatexPriceCell = "'DATABASES'!E46"; // Primer Latex
    const GlossLatexPriceCell = "'DATABASES'!E47"; // Topcoat Semi-gloss
    const puttyPriceCell = "'DATABASES'!E52";      // Joint compound putty
    const laborSqm = 165;                         // standard painter laying fee per sqm

    wPaint.getRow(rNum).values = [
      item.name,
      item.area,
      item.numberOfCoats,
      { formula: `ROUNDUP(B${rNum}/30, 0)` },                   // Primer (1 coat covers 30 sqm per gal)
      { formula: `ROUNDUP((B${rNum}/30)*(C${rNum}-1), 0)` },    // Topcoat (N-1 coats, covers 30 sqm per gal per coat)
      { formula: `ROUNDUP(B${rNum}/25, 0)` },                   // Putty (approx 1 bag per 25 sqm)
      { formula: `(D${rNum}*${FlatLatexPriceCell}) + (E${rNum}*${GlossLatexPriceCell}) + (F${rNum}*${puttyPriceCell}) + (B${rNum}*${laborSqm})` }
    ];

    applyNormalRowStyle(wPaint, rNum, idx % 2 === 1);
    applyInputCellStyle(wPaint.getCell(`B${rNum}`));
    applyInputCellStyle(wPaint.getCell(`C${rNum}`));
    applyFormulaCellStyle(wPaint.getCell(`D${rNum}`));
    applyFormulaCellStyle(wPaint.getCell(`E${rNum}`));
    applyFormulaCellStyle(wPaint.getCell(`F${rNum}`));
    applyFormulaCellStyle(wPaint.getCell(`G${rNum}`));

    wPaint.getCell(`D${rNum}`).numFmt = "#,##0";
    wPaint.getCell(`E${rNum}`).numFmt = "#,##0";
    wPaint.getCell(`F${rNum}`).numFmt = "#,##0";
    wPaint.getCell(`G${rNum}`).numFmt = '"₱"#,##0.00';
  });

  const paintSize = data.painting.length;
  const paintTotRow = 6 + paintSize;
  wPaint.getRow(paintTotRow).values = [
    "TOTAL PAINTING WORKS",
    { formula: `SUM(B6:B${paintTotRow-1})` },
    "",
    { formula: `SUM(D6:D${paintTotRow-1})` },
    { formula: `SUM(E6:E${paintTotRow-1})` },
    { formula: `SUM(F6:F${paintTotRow-1})` },
    { formula: `SUM(G6:G${paintTotRow-1})` }
  ];
  wPaint.getRow(paintTotRow).height = 24;
  wPaint.getRow(paintTotRow).eachCell((cell) => {
    cell.font = { name: "Segoe UI", size: 10, bold: true };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "93C5FD" } };
  });
  wPaint.getCell(`G${paintTotRow}`).numFmt = '"₱"#,##0.00';


  /**
   * ==========================================
   * 10. BILL OF QUANTITIES (BOQ) & MARKUPS WORKSHEET (Sheets name BOQ)
   * ==========================================
   */
  const wBOQ = workbook.addWorksheet("BOQ");
  createSheetBanner(wBOQ, "DETAILED BILL OF QUANTITIES (BOQ)", "Consolidated Construction Items with Markups and Indirect Taxes", "D");

  wBOQ.columns = [
    { key: "item", width: 12 },
    { key: "desc", width: 45 },
    { key: "boqUnit", width: 15 },
    { key: "rawCost", width: 30 }
  ];

  wBOQ.getRow(5).values = ["ITEM ID", "WORK DIVISION CATEGORIES", "MEASURED UNIT", "DIRECT ESTIMATE SUMMARY COST"];
  applyHeaderStyle(wBOQ, 5, { bg: "1E3A8A" });

  const summaryElements = [
    ["1.0", "GENERAL CONCRETE DIVISION WORKS", "Subtotal Lump", "'CONCRETE WORKS'!M" + totRow],
    ["2.0", "TEMPORARY FORMWORKS & SCAFFOLDINGS", "Subtotal Lump", "'FORMWORKS & SCAFFOLDS'!G" + formTotRow],
    ["3.0", "CONCRETE HOLLOW BLOCKS (CHB) MASONRY", "Subtotal Lump", "'CHB MASONRY & PLASTER'!K" + chbTotRow],
    ["4.0", "FLOORS, WALLS & DECORATIVE TILING", "Subtotal Lump", "'TILING WORKS'!H" + tileTotRow],
    ["5.0", "DOORS, WINDOWS & SERVICE OPENINGS", "Subtotal Lump", "'DOORS & WINDOWS'!H" + opTotRow],
    ["6.0", "STRUCTURAL STEEL TRUSS & ROOFING SHEETS", "Subtotal Lump", "'TRUSSES & ROOFING'!G" + rfTotRow],
    ["7.0", "INTERIOR & EXTERIOR PROTECTIVE PAINTING", "Subtotal Lump", "'PAINTING WORKS'!G" + paintTotRow]
  ];

  summaryElements.forEach((item, idx) => {
    const rNum = 6 + idx;
    wBOQ.getRow(rNum).values = [
      item[0],
      item[1],
      item[2],
      { formula: `${item[3]}` } // Dynamic active reference formula targeting our previous totals!
    ];
    applyNormalRowStyle(wBOQ, rNum, idx % 2 === 1);
    applyFormulaCellStyle(wBOQ.getCell(`D${rNum}`));
    wBOQ.getCell(`D${rNum}`).numFmt = '"₱"#,##0.00';
  });

  const baseBOQLimit = 6 + summaryElements.length;
  wBOQ.getRow(baseBOQLimit).values = [];
  wBOQ.getRow(baseBOQLimit + 1).values = [];

  // Direct Cost Sum
  const directCostSumRow = baseBOQLimit + 2;
  wBOQ.getRow(directCostSumRow).values = ["", "TOTAL CONSOLIDATED DIRECT COST", "", { formula: `SUM(D6:D${directCostSumRow-3})` }];
  applyNormalRowStyle(wBOQ, directCostSumRow);
  wBOQ.getCell(`B${directCostSumRow}`).font = { name: "Segoe UI", size: 10, bold: true };
  wBOQ.getCell(`D${directCostSumRow}`).font = { name: "Segoe UI", size: 11, bold: true };
  wBOQ.getCell(`D${directCostSumRow}`).numFmt = '"₱"#,##0.00';
  wBOQ.getCell(`D${directCostSumRow}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "93C5FD" } };

  // INDIRECT MARKUPS LOGIC - CONNECTED TO THE "PROJECT INFO" USER INTERACT METADATA
  const markups = [
    ["Overhead Markup Factor", "'PROJECT INFO'!B12"],
    ["Contingency Allowance", "'PROJECT INFO'!B13"],
    ["Contractor Profit Markup", "'PROJECT INFO'!B14"],
    ["Mobilization/Demobilizaton Fee", "'PROJECT INFO'!B16"]
  ];

  markups.forEach((markup, idx) => {
    const rNum = directCostSumRow + 2 + idx;
    wBOQ.getRow(rNum).values = [
      "",
      markup[0], 
      { formula: `${markup[1]}` }, 
      { formula: `D${directCostSumRow}*C${rNum}` } // Direct Cost * Markup percentage!
    ];
    applyNormalRowStyle(wBOQ, rNum);
    wBOQ.getCell(`C${rNum}`).numFmt = "0.0%";
    wBOQ.getCell(`D${rNum}`).numFmt = '"₱"#,##0.00';
    applyFormulaCellStyle(wBOQ.getCell(`D${rNum}`));
  });

  const profitEndRow = directCostSumRow + 2 + markups.length;
  wBOQ.getRow(profitEndRow + 1).values = [];

  // Subtotal before tax
  const subTotalBeforeTaxRow = profitEndRow + 2;
  wBOQ.getRow(subTotalBeforeTaxRow).values = ["", "SUBTOTAL CONSTRUCTION VALUE (BEFORE VALUE TAX)", "", { formula: `D${directCostSumRow}+SUM(D${directCostSumRow+2}:D${profitEndRow})` }];
  applyNormalRowStyle(wBOQ, subTotalBeforeTaxRow);
  wBOQ.getCell(`B${subTotalBeforeTaxRow}`).font = { name: "Segoe UI", size: 10, bold: true, italic: true };
  wBOQ.getCell(`D${subTotalBeforeTaxRow}`).font = { name: "Segoe UI", size: 11, bold: true };
  wBOQ.getCell(`D${subTotalBeforeTaxRow}`).numFmt = '"₱"#,##0.00';
  wBOQ.getCell(`D${subTotalBeforeTaxRow}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "BFDBFE" } };

  // VAT (12%)
  const vatTaxRow = subTotalBeforeTaxRow + 1;
  wBOQ.getRow(vatTaxRow).values = ["", "Philippine Value Added Tax (VAT)", { formula: `'PROJECT INFO'!B15` }, { formula: `D${subTotalBeforeTaxRow}*C${vatTaxRow}` }];
  applyNormalRowStyle(wBOQ, vatTaxRow);
  wBOQ.getCell(`C${vatTaxRow}`).numFmt = "0.0%";
  wBOQ.getCell(`D${vatTaxRow}`).numFmt = '"₱"#,##0.00';
  applyFormulaCellStyle(wBOQ.getCell(`D${vatTaxRow}`));

  // GRAND TOTAL
  const grandTotalRow = vatTaxRow + 2;
  wBOQ.getRow(grandTotalRow).values = ["", "CONSTRUCTION GRAND TOTAL INVESTMENT", "", { formula: `D${subTotalBeforeTaxRow}+D${vatTaxRow}` }];
  wBOQ.getRow(grandTotalRow).height = 28;
  wBOQ.getRow(grandTotalRow).eachCell((cell) => {
    cell.font = { name: "Segoe UI", size: 12, bold: true, color: { argb: "FFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "1E3A8A" } }; // Navy blue total header
    cell.border = {
      top: { style: "double", color: { argb: "D97706" } },
      bottom: { style: "double", color: { argb: "D97706" } }
    };
  });
  wBOQ.getCell(`D${grandTotalRow}`).numFmt = '"₱"#,##0.00';


  /**
   * ==========================================
   * 11. DASHBOARD & SUMMARY SHEET
   * ==========================================
   */
  const wDash = workbook.addWorksheet("SUMMARY REPORT");
  createSheetBanner(wDash, "EXECUTIVE CONTRACTING SUMMARY", "Printable Project Proposal Dashboard Profile", "C");
  wDash.getColumn("A").width = 25;
  wDash.getColumn("B").width = 40;
  wDash.getColumn("C").width = 28;

  // Add Project Details Panel
  wDash.getRow(5).values = ["CONTRACTOR PROPOSAL DOCUMENT SUMMARY", "", ""];
  wDash.getRow(5).height = 26;
  wDash.getRow(5).eachCell(cell => {
    cell.font = { name: "Segoe UI", size: 12, bold: true, color: { argb: "FFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D97706" } }; // Orange construction profile
  });
  wDash.mergeCells("A5:C5");

  wDash.getRow(6).values = ["Project Name Profile:", { formula: `'PROJECT INFO'!B6` }, ""];
  wDash.getRow(7).values = ["Proprietorial Client Developer:", { formula: `'PROJECT INFO'!B7` }, ""];
  wDash.getRow(8).values = ["Engineering Site Location:", { formula: `'PROJECT INFO'!B8` }, ""];
  wDash.getRow(9).values = ["Estimated Building Area (sq.m.):", { formula: `'PROJECT INFO'!B10` }, ""];
  wDash.getRow(10).values = ["Takeoff Baseline Date Reference:", { formula: `'PROJECT INFO'!B11` }, ""];

  for (let i = 6; i <= 10; i++) {
    applyNormalRowStyle(wDash, i);
    wDash.getCell(`A${i}`).font = { name: "Segoe UI", size: 10, bold: true };
    if (i === 9) {
      wDash.getCell(`B${i}`).numFmt = '#,##0" sq.m."';
    }
  }

  wDash.getRow(11).values = [];
  wDash.getRow(12).values = [];

  const costHeaderRow = 13;
  wDash.getRow(costHeaderRow).values = ["INVESTMENT BREAKDOWN", "", ""];
  wDash.getRow(costHeaderRow).height = 24;
  wDash.getRow(costHeaderRow).eachCell((cell) => {
    cell.font = { name: "Segoe UI", size: 11, bold: true, color: { argb: "FFFFFF" } };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "1E293B" } };
  });
  wDash.mergeCells(`A${costHeaderRow}:C${costHeaderRow}`);

  wDash.getRow(costHeaderRow + 1).values = ["Division Category Description", "Direct Core Cost Indicator", "Ratio of Total Portfolio"];
  applyHeaderStyle(wDash, costHeaderRow + 1, { bg: "475569" });

  summaryElements.forEach((item, idx) => {
    const rNum = costHeaderRow + 2 + idx;
    wDash.getRow(rNum).values = [
      item[1], 
      { formula: `${item[3]}` }, 
      { formula: `B${rNum}/'BOQ'!D${directCostSumRow}` } // Percentage of direct cost
    ];
    applyNormalRowStyle(wDash, rNum, idx % 2 === 1);
    wDash.getCell(`B${rNum}`).numFmt = '"₱"#,##0.00';
    wDash.getCell(`C${rNum}`).numFmt = "0.0%";
    applyFormulaCellStyle(wDash.getCell(`B${rNum}`));
    applyFormulaCellStyle(wDash.getCell(`C${rNum}`));
  });

  const dashProfitRow = costHeaderRow + 2 + summaryElements.length;
  wDash.getRow(dashProfitRow).values = [];

  const totalDirectCostRowIdx = dashProfitRow + 2;
  wDash.getRow(totalDirectCostRowIdx).values = ["TOTAL DIRECT CONSTRUCTION COST", { formula: `'BOQ'!D${directCostSumRow}` }, ""];
  applyNormalRowStyle(wDash, totalDirectCostRowIdx);
  wDash.getCell(`A${totalDirectCostRowIdx}`).font = { name: "Segoe UI", size: 10, bold: true };
  wDash.getCell(`B${totalDirectCostRowIdx}`).font = { name: "Segoe UI", size: 11, bold: true };
  wDash.getCell(`B${totalDirectCostRowIdx}`).numFmt = '"₱"#,##0.00';
  wDash.getCell(`B${totalDirectCostRowIdx}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "93C5FD" } };

  const indirectCostsRowIdx = totalDirectCostRowIdx + 1;
  wDash.getRow(indirectCostsRowIdx).values = ["INDIRECT COSTS AND TAXES IMPACT", { formula: `'BOQ'!D${grandTotalRow}-'BOQ'!D${directCostSumRow}` }, ""];
  applyNormalRowStyle(wDash, indirectCostsRowIdx);
  wDash.getCell(`A${indirectCostsRowIdx}`).font = { name: "Segoe UI", size: 10, bold: true };
  wDash.getCell(`B${indirectCostsRowIdx}`).font = { name: "Segoe UI", size: 11, bold: true };
  wDash.getCell(`B${indirectCostsRowIdx}`).numFmt = '"₱"#,##0.00';
  wDash.getCell(`B${indirectCostsRowIdx}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FED7AA" } }; // Soft light orange

  const overallTotalRowIdx = indirectCostsRowIdx + 1;
  wDash.getRow(overallTotalRowIdx).values = ["TOTAL ARCHITECTURAL & STRUCTURAL CONTRACT", { formula: `'BOQ'!D${grandTotalRow}` }, ""];
  applyNormalRowStyle(wDash, overallTotalRowIdx);
  wDash.getCell(`A${overallTotalRowIdx}`).font = { name: "Segoe UI", size: 11, bold: true };
  wDash.getCell(`B${overallTotalRowIdx}`).font = { name: "Segoe UI", size: 12, bold: true };
  wDash.getCell(`B${overallTotalRowIdx}`).numFmt = '"₱"#,##0.00';
  wDash.getCell(`B${overallTotalRowIdx}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "34D399" } }; // Green success indicator

  // Cost per square meter metric row
  const costSqmRowIdx = overallTotalRowIdx + 1;
  wDash.getRow(costSqmRowIdx).values = ["Average Cost per Square Meter:", { formula: `B${overallTotalRowIdx}/'PROJECT INFO'!B10` }, ""];
  applyNormalRowStyle(wDash, costSqmRowIdx);
  wDash.getCell(`A${costSqmRowIdx}`).font = { name: "Segoe UI", size: 10, bold: true, italic: true };
  wDash.getCell(`B${costSqmRowIdx}`).font = { name: "Segoe UI", size: 11, bold: true };
  wDash.getCell(`B${costSqmRowIdx}`).numFmt = '"₱"#,##0.00"/sq.m."';

  // Trigger Buffer compiler of exceljs
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}
