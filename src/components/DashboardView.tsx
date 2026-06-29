import React from "react";
import { Building, Wallet, Layers, MapPin, User, Calendar, Percent, Printer, FileSpreadsheet, Save } from "lucide-react";
import { ProjectInfo, MaterialItem, LaborItem, EquipmentItem, ConcreteElement, FormworkElement, CHBWallElement, TileElement, DoorWindowElement, RoofingElement, PaintingElement, DivisionTotals } from "../types";
import { computeMarkup } from "../utils/calculations";
import { generateEstimatingWorkbook } from "../utils/excelGenerator";

interface DashboardViewProps {
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
  divisionTotals: DivisionTotals;
}

export default function DashboardView({
  projectInfo,
  materials,
  labor,
  equipment,
  concrete,
  formworks,
  chb,
  tiles,
  doorsWindows,
  roofing,
  painting,
  divisionTotals
}: DashboardViewProps) {
  
  // Computations
  const directCostTotal = Object.values(divisionTotals).reduce((sum, v) => sum + v.total, 0);
  const markups = computeMarkup(directCostTotal, projectInfo);
  const grandTotal = markups.grandTotal;
  const costPerSqm = projectInfo.floorArea > 0 ? grandTotal / projectInfo.floorArea : 0;

  // Handler to export Excel
  const handleExportExcel = async () => {
    try {
      const buffer = await generateEstimatingWorkbook({
        projectInfo,
        materials,
        labor,
        equipment,
        concrete,
        formworks,
        chb,
        tiles,
        doorsWindows,
        roofing,
        painting
      });

      const fileName = `${projectInfo.projectName.replace(/\s+/g, "_")}_Estimating_Workbook.xlsx`;
      const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      const file = new File([blob], fileName, { type: blob.type });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "StrucForge Estimates Workbook",
          text: "Excel estimating workbook exported from StrucForge Estimates."
        });
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Failed to compile Excel file", e);
      alert("Error generating Excel file: " + e);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = async () => {
    const fileName = `${projectInfo.projectName.replace(/\s+/g, "_") || "StrucForge_Estimate"}_Estimate.json`;
    const payload = {
      exportedAt: new Date().toISOString(),
      appName: "StrucForge Estimates",
      projectInfo,
      materials,
      labor,
      equipment,
      concrete,
      formworks,
      chb,
      tiles,
      doorsWindows,
      roofing,
      painting,
      divisionTotals,
      summary: {
        directCostTotal,
        markups,
        grandTotal,
        costPerSqm
      }
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const file = new File([blob], fileName, { type: blob.type });

    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: "StrucForge Estimate JSON",
        text: "Saved estimate data exported from StrucForge Estimates."
      });
      return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Division chart bars
  const totalDivVal = directCostTotal || 1;
  const categories = [
    { label: "03 - Concrete Works", val: divisionTotals.concrete.total, color: "bg-blue-600" },
    { label: "04 - Formworks & Scaffolding", val: divisionTotals.formworks.total, color: "bg-emerald-600" },
    { label: "05 - CHB Masonry", val: divisionTotals.chb.total, color: "bg-orange-500" },
    { label: "09 - Tiling Works", val: divisionTotals.tiles.total, color: "bg-indigo-600" },
    { label: "08 - Doors & Windows", val: divisionTotals.doorsWindows.total, color: "bg-rose-500" },
    { label: "07 - Roofing & Trusses", val: divisionTotals.roofing.total, color: "bg-amber-500" },
    { label: "09B - Painting Works", val: divisionTotals.painting.total, color: "bg-teal-500" }
  ].sort((a, b) => b.val - a.val);

  return (
    <div className="space-y-6" id="dashboard-tab">
      
      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="bg-[#1e293b] text-white p-5 rounded-xl shadow-xs flex items-center justify-between" id="kpi-grand-total">
          <div className="space-y-1">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Estimated Bid Value</span>
            <div className="text-2xl font-bold text-orange-400 font-mono tracking-tight">
              ₱{grandTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-xs text-slate-400 block pb-0">Grand Total with Markups + VAT</span>
          </div>
          <div className="bg-slate-800 p-3 rounded-lg text-orange-400 shrink-0">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs flex items-center justify-between" id="kpi-cost-per-sqm">
          <div className="space-y-1">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block">Est. Cost per Sq.m.</span>
            <div className="text-2xl font-semibold text-slate-800 font-sans tracking-tight">
              ₱{costPerSqm.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-xs text-slate-400 block">Based on {projectInfo.floorArea} sqm area</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg text-slate-700 border border-slate-200 shrink-0">
            <Building className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs flex items-center justify-between" id="kpi-direct-cost">
          <div className="space-y-1">
            <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block">Direct Cost Subtotal</span>
            <div className="text-2xl font-semibold text-slate-800 font-sans tracking-tight">
              ₱{directCostTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-xs text-slate-400 block">Pure materials, labor, equipment</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg text-slate-700 border border-slate-200 shrink-0">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-orange-50 border border-orange-200 p-5 rounded-xl shadow-xs flex items-center justify-between" id="kpi-markups">
          <div className="space-y-1">
            <span className="text-[10px] uppercase text-orange-400 font-bold tracking-wider block">Indirects & Markup Value</span>
            <div className="text-2xl font-semibold text-orange-600 font-mono tracking-tight">
              ₱{markups.markupsTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-xs text-orange-500/80 block">OH, Profit, contingency & VAT</span>
          </div>
          <div className="bg-orange-100 p-3 rounded-lg text-orange-600 shrink-0">
            <Percent className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Division Breakdown & Sidebar Project Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cost Distribution Chart */}
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-xs lg:col-span-2 space-y-5" id="cost-takeoff-bars">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-sans font-semibold text-slate-900 text-lg">Work Division Cost Takeoff Distribution</h3>
              <p className="text-xs text-slate-500">Relative cost of materials and labor by division category</p>
            </div>
            <span className="text-xs font-mono font-medium text-slate-400">7 Active Divisions</span>
          </div>

          <div className="space-y-4 pt-1">
            {categories.map((cat, idx) => {
              const percentage = (cat.val / totalDivVal) * 100;
              return (
                <div key={idx} className="space-y-1 block">
                  <div className="flex justify-between text-xs text-slate-700">
                    <span className="font-medium text-slate-900">{cat.label}</span>
                    <div className="space-x-2">
                      <span className="font-mono text-slate-500">
                        ₱{cat.val.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                      <span className="font-sans font-semibold text-slate-400">({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className={`${cat.color} h-2 rounded-full`} style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick actions & Profile */}
        <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-xs flex flex-col justify-between space-y-6" id="dashboard-sidebar-profile">
          <div className="space-y-4">
            <h4 className="font-sans font-semibold text-slate-900 border-b border-slate-100 pb-2">Export & Print Actions</h4>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Export a styled contracting excel file. The output sheet is structured with actual Excel formulas matching your configuration, ready to print on A4/Legal for Philippine clients.
            </p>

            <button
              onClick={handleExportExcel}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer font-sans shadow-sm"
              id="btn-export-excel"
            >
              <FileSpreadsheet className="w-5 h-5" />
              Download Automated Excel
            </button>

            <button
              onClick={handleExportJson}
              className="w-full border border-emerald-200 hover:bg-emerald-50 text-emerald-700 font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer font-sans"
              id="btn-export-json"
            >
              <Save className="w-4 h-4" />
              Save Estimate JSON
            </button>

            <button
              onClick={handlePrint}
              className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer font-sans"
              id="btn-print-summary"
            >
              <Printer className="w-4 h-4" />
              Print Proposal Report
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <span className="text-xs font-mono font-bold text-slate-400 block uppercase tracking-wider">Project Profile Summary</span>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{projectInfo.location}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{projectInfo.clientName}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Base Date: {projectInfo.date}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Proposal Printable Document Preview */}
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs max-w-4xl mx-auto space-y-6 print:m-0 print:p-0 print:border-none print:shadow-none" id="printable-proposal-preview">
        
        {/* Internal Header */}
        <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
          <div className="space-y-1">
            <span className="text-2xl font-serif text-slate-900 font-bold block">{projectInfo.companyName || "PHILIPPINES ESTIMATES INC."}</span>
            <span className="text-xs font-mono text-slate-500 uppercase block tracking-wider">{projectInfo.companySubtitle || "Professional Quantity Surveying & Structural Takeoff Solutions"}</span>
          </div>
          <div className="text-right text-xs text-slate-500 space-y-1 leading-relaxed">
            <p className="font-semibold text-slate-800">Proposal Date: {projectInfo.date}</p>
            <p>Estimator: {projectInfo.estimator}</p>
          </div>
        </div>

        {/* Title */}
        <div className="text-center py-4 space-y-1">
          <h2 className="text-xl font-sans font-bold text-slate-900 uppercase tracking-tight block">Construction Cost Takeoff Proposal</h2>
          <p className="text-xs text-slate-500">Subject Project: {projectInfo.projectName}</p>
        </div>

        {/* Brief Table of Metadata */}
        <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-lg border border-slate-100">
          <div>
            <p className="text-slate-400 font-medium">Prepared For:</p>
            <p className="font-semibold text-slate-800 mt-1">{projectInfo.clientName}</p>
            <p className="text-slate-600 leading-relaxed mt-0.5">{projectInfo.location}</p>
          </div>
          <div className="text-right">
            <p className="text-slate-400 font-medium">Building Profile:</p>
            <p className="font-semibold text-slate-800 mt-1">Residential Villa / Low-rise</p>
            <p className="text-slate-600 mt-0.5">Estimated Area: {projectInfo.floorArea} sq.m.</p>
          </div>
        </div>

        {/* Divisions Summary Table */}
        <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-xs text-left">
          <thead>
            <tr className="border-b-2 border-slate-300 text-slate-500 uppercase tracking-wider h-8">
              <th className="py-2 font-semibold">Division Description</th>
              <th className="py-2 font-semibold text-right">Materials (PHP)</th>
              <th className="py-2 font-semibold text-right">Labor (PHP)</th>
              <th className="py-2 font-semibold text-right">Direct Cost (PHP)</th>
              <th className="py-2 font-semibold text-right">Ratio</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="py-3 font-medium text-slate-900">Division 03 - Reinforced Concrete Works</td>
              <td className="py-3 text-right font-mono text-slate-600">₱{divisionTotals.concrete.materials.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="py-3 text-right font-mono text-orange-600">₱{divisionTotals.concrete.labor.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="py-3 text-right font-mono text-slate-700 font-semibold">₱{divisionTotals.concrete.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="py-3 text-right text-slate-500">{((divisionTotals.concrete.total / totalDivVal)*100).toFixed(1)}%</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-3 font-medium text-slate-900">Division 04 - Formworks & Scaffoldings</td>
              <td className="py-3 text-right font-mono text-slate-600">₱{divisionTotals.formworks.materials.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="py-3 text-right font-mono text-orange-600">₱{divisionTotals.formworks.labor.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="py-3 text-right font-mono text-slate-700 font-semibold">₱{divisionTotals.formworks.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="py-3 text-right text-slate-500">{((divisionTotals.formworks.total / totalDivVal)*100).toFixed(1)}%</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-3 font-medium text-slate-900">Division 05 - CHB Walls Masonry & Plaster</td>
              <td className="py-3 text-right font-mono text-slate-600">₱{divisionTotals.chb.materials.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="py-3 text-right font-mono text-orange-600">₱{divisionTotals.chb.labor.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="py-3 text-right font-mono text-slate-700 font-semibold">₱{divisionTotals.chb.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="py-3 text-right text-slate-500">{((divisionTotals.chb.total / totalDivVal)*100).toFixed(1)}%</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-3 font-medium text-slate-900">Division 09A - Floors & Walls Tilings</td>
              <td className="py-3 text-right font-mono text-slate-600">₱{divisionTotals.tiles.materials.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="py-3 text-right font-mono text-orange-600">₱{divisionTotals.tiles.labor.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="py-3 text-right font-mono text-slate-700 font-semibold">₱{divisionTotals.tiles.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="py-3 text-right text-slate-500">{((divisionTotals.tiles.total / totalDivVal)*100).toFixed(1)}%</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-3 font-medium text-slate-900">Division 08 - Openings: Doors & Windows</td>
              <td className="py-3 text-right font-mono text-slate-600">₱{divisionTotals.doorsWindows.materials.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="py-3 text-right font-mono text-orange-600">₱{divisionTotals.doorsWindows.labor.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="py-3 text-right font-mono text-slate-700 font-semibold">₱{divisionTotals.doorsWindows.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="py-3 text-right text-slate-500">{((divisionTotals.doorsWindows.total / totalDivVal)*100).toFixed(1)}%</td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-3 font-medium text-slate-900">Division 07 - Roofing Framework & Trusses</td>
              <td className="py-3 text-right font-mono text-slate-600">₱{divisionTotals.roofing.materials.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="py-3 text-right font-mono text-orange-600">₱{divisionTotals.roofing.labor.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="py-3 text-right font-mono text-slate-700 font-semibold">₱{divisionTotals.roofing.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="py-3 text-right text-slate-500">{((divisionTotals.roofing.total / totalDivVal)*100).toFixed(1)}%</td>
            </tr>
            <tr className="border-b-2 border-slate-300">
              <td className="py-3 font-medium text-slate-900">Division 09B - Protective Painting Works</td>
              <td className="py-3 text-right font-mono text-slate-600">₱{divisionTotals.painting.materials.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="py-3 text-right font-mono text-orange-600">₱{divisionTotals.painting.labor.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="py-3 text-right font-mono text-slate-700 font-semibold">₱{divisionTotals.painting.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="py-3 text-right text-slate-500">{((divisionTotals.painting.total / totalDivVal)*100).toFixed(1)}%</td>
            </tr>

            {/* Direct Cost Subtotal */}
            <tr className="font-bold border-b border-slate-200">
              <td className="py-3 text-slate-800 uppercase italic">Sum of Direct Costs (PHP)</td>
              <td className="py-3"></td>
              <td className="py-3"></td>
              <td className="py-3 text-right font-mono text-slate-950">₱{directCostTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="py-3 text-right">100.0%</td>
            </tr>

            {/* Markups List */}
            <tr className="border-b border-slate-100">
              <td className="py-1.5 text-slate-600 italic">Overhead Markup Allowance ({projectInfo.overheadPercent}%)</td>
              <td className="py-1.5 text-right font-mono text-slate-700">₱{markups.overhead.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="py-1.5"></td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-1.5 text-slate-600 italic">Contingency Factor Allocation ({projectInfo.contingencyPercent}%)</td>
              <td className="py-1.5 text-right font-mono text-slate-700">₱{markups.contingency.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="py-1.5"></td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-1.5 text-slate-600 italic">Contractor's Net Profit Estimate ({projectInfo.profitPercent}%)</td>
              <td className="py-1.5 text-right font-mono text-slate-700">₱{markups.profit.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="py-1.5"></td>
            </tr>
            <tr className="border-b border-slate-100">
              <td className="py-1.5 text-slate-600 italic">Mobilization & Engineering logistics ({projectInfo.mobilizationPercent}%)</td>
              <td className="py-1.5 text-right font-mono text-slate-700">₱{markups.mobilization.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="py-1.5"></td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-1.5 text-slate-600 italic">VAT Construction Contract Tax ({projectInfo.vatPercent}%)</td>
              <td className="py-1.5 text-right font-mono text-slate-700">₱{markups.vat.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="py-1.5"></td>
            </tr>

            {/* Final Grand Total */}
            <tr className="bg-slate-900 text-white font-bold h-10 border-t-2 border-slate-950 font-sans">
              <td className="py-2.5 px-3 uppercase text-slate-200 tracking-wider">Estimated Project Bid Value</td>
              <td className="py-2.5 text-right font-mono text-emerald-400 text-sm">₱{grandTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
              <td className="py-2.5"></td>
            </tr>
          </tbody>
        </table>
        </div>

        {/* Footer legalities */}
        <div className="grid grid-cols-2 gap-8 text-[11px] text-slate-400 pt-8 border-t border-slate-100">
          <div className="space-y-4">
            <p>
              Note: This is an analytical structural cost estimating checklist prepared in accordance with local municipal regulations and pricing directories of the Philippines.
            </p>
            <div className="pt-2">
              <div className="w-40 border-b border-slate-400 h-8"></div>
              <p className="mt-1 font-semibold text-slate-600">Juan Dela Cruz, RCE, QS</p>
              <p className="text-[10px]">Licensed Structural Estimator #91024</p>
            </div>
          </div>
          <div className="text-right space-y-4">
            <p>
              The bid pricing presented here remains valid for forty-five (45) calendar days from the date of presentation, subject to material price index changes.
            </p>
            <div className="pt-2 flex justify-end">
              <div>
                <div className="w-40 border-b border-slate-400 h-8"></div>
                <p className="mt-1 font-semibold text-slate-600">Client Conformity Signature</p>
                <p className="text-[10px]">& Date Signed</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
