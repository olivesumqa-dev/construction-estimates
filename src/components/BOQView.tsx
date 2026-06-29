import React, { useState } from "react";
import { ProjectInfo, DivisionTotals } from "../types";
import { computeMarkup } from "../utils/calculations";
import { FileText, Printer, ShieldCheck, ChevronDown, ChevronRight, Calculator, FileSpreadsheet } from "lucide-react";

interface BOQViewProps {
  projectInfo: ProjectInfo;
  divisionTotals: DivisionTotals;
}

export default function BOQView({ projectInfo, divisionTotals }: BOQViewProps) {
  const [expandedDivs, setExpandedDivs] = useState<Record<string, boolean>>({
    "div-3": true,
    "div-4": true,
    "div-5": true,
    "div-9a": true,
    "div-8": true,
    "div-7": true,
    "div-9b": true
  });

  const toggleDiv = (key: string) => {
    setExpandedDivs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const directCostTotal = Object.values(divisionTotals).reduce((sum, v) => sum + v.total, 0);
  const markups = computeMarkup(directCostTotal, projectInfo);

  const formatCurrency = (val: number) => {
    return "₱" + val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-xs space-y-6" id="boq-sheet">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-sans font-semibold text-slate-900 text-lg">Detailed Bill of Quantities (BOQ)</h3>
          <p className="text-xs text-slate-500">Official, unified construction schedules incorporating architectural finishes and structural partitions with local taxes.</p>
        </div>
        <button
          onClick={() => window.print()}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold h-9 px-4 rounded-lg flex items-center gap-1.5 transition cursor-pointer font-sans shadow-xs shrink-0 self-start text-nowrap"
          id="btn-boq-print"
        >
          <Printer className="w-4 h-4" />
          Print Official Estimate
        </button>
      </div>

      <div className="space-y-4">
        
        {/* Table representation */}
        <div className="overflow-x-auto border border-slate-100 rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-800 text-white font-sans text-[11px] h-10 tracking-wider">
                <th className="px-4 py-2 w-24">ITEM NO.</th>
                <th className="px-4 py-2">PROJECT DIVISION & MATERIAL SPECIFICATION</th>
                <th className="px-4 py-2 w-32 text-center">MEASURABLE UNIT</th>
                <th className="px-4 py-2 text-right w-44">DIRECT AMOUNT (PHP)</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 font-sans">
              
              {/* DIVISION 3 */}
              <tr className="bg-slate-50 hover:bg-slate-100 cursor-pointer h-9 font-semibold text-slate-800" onClick={() => toggleDiv("div-3")}>
                <td className="px-4 py-2">Div 01</td>
                <td className="px-4 py-2 flex items-center gap-1">
                  {expandedDivs["div-3"] ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                  DIV 01 - REINFORCED CONCRETE WORKS
                </td>
                <td className="px-4 py-2 text-center text-slate-500 font-mono">Structural Lump</td>
                <td className="px-4 py-2 text-right font-mono font-bold text-slate-900">{formatCurrency(divisionTotals.concrete.total)}</td>
              </tr>
              {expandedDivs["div-3"] && (
                <tr className="bg-slate-50/20 text-slate-500">
                  <td className="px-5 py-2 flex flex-col gap-1">
                    <span className="text-[10px] text-blue-700 font-bold">Mat: {formatCurrency(divisionTotals.concrete.materials)}</span>
                    <span className="text-[10px] text-orange-600 font-bold">Lab: {formatCurrency(divisionTotals.concrete.labor)}</span>
                  </td>
                  <td className="px-5 py-2 pl-8 leading-relaxed">
                    Includes cement (Portland Grade), course river sand, ¾” aggregate gravel, structural ties wire and deformed reinforcing steel reinforcement (#10 to #25 depending on layout schedules). Works encapsulate material transportation, site water, mixing, steel assembly grid bends, and manual pouring.
                  </td>
                  <td className="px-4 py-2 text-center font-mono">cu.m. Taking</td>
                  <td className="px-4 py-2"></td>
                </tr>
              )}

              {/* DIVISION 4 */}
              <tr className="bg-slate-50 hover:bg-slate-100 cursor-pointer h-9 font-semibold text-slate-800" onClick={() => toggleDiv("div-4")}>
                <td className="px-4 py-2">Div 02</td>
                <td className="px-4 py-2 flex items-center gap-1">
                  {expandedDivs["div-4"] ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                  DIV 02 - TEMPORARY FORMWORKS & SCAFFOLDINGS
                </td>
                <td className="px-4 py-2 text-center text-slate-500 font-mono">Lump Area</td>
                <td className="px-4 py-2 text-right font-mono font-bold text-slate-900">{formatCurrency(divisionTotals.formworks.total)}</td>
              </tr>
              {expandedDivs["div-4"] && (
                <tr className="bg-slate-50/20 text-slate-500">
                  <td className="px-5 py-2 flex flex-col gap-1">
                    <span className="text-[10px] text-blue-700 font-bold">Mat: {formatCurrency(divisionTotals.formworks.materials)}</span>
                    <span className="text-[10px] text-orange-600 font-bold">Lab: {formatCurrency(divisionTotals.formworks.labor)}</span>
                  </td>
                  <td className="px-5 py-2 pl-8 leading-relaxed">
                    Includes marine plywood sheeting (Phenolic boarding), timber support studs (Coco lumber size 2x2 and 2x3 framing), scaffolding H-frames accessories, alignment steel props, form release oil, and assorted CWN nails.
                  </td>
                  <td className="px-4 py-2 text-center font-mono">sq.m. Support</td>
                  <td className="px-4 py-2"></td>
                </tr>
              )}

              {/* DIVISION 05 */}
              <tr className="bg-slate-50 hover:bg-slate-100 cursor-pointer h-9 font-semibold text-slate-800" onClick={() => toggleDiv("div-5")}>
                <td className="px-4 py-2">Div 03</td>
                <td className="px-4 py-2 flex items-center gap-1">
                  {expandedDivs["div-5"] ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                  DIV 03 - CONCRETE HOLLOW BLOCKS (CHB) WALLS
                </td>
                <td className="px-4 py-2 text-center text-slate-500 font-mono">Masonry Lump</td>
                <td className="px-4 py-2 text-right font-mono font-bold text-slate-900">{formatCurrency(divisionTotals.chb.total)}</td>
              </tr>
              {expandedDivs["div-5"] && (
                <tr className="bg-slate-50/20 text-slate-500">
                  <td className="px-5 py-2 flex flex-col gap-1">
                    <span className="text-[10px] text-blue-700 font-bold">Mat: {formatCurrency(divisionTotals.chb.materials)}</span>
                    <span className="text-[10px] text-orange-600 font-bold">Lab: {formatCurrency(divisionTotals.chb.labor)}</span>
                  </td>
                  <td className="px-5 py-2 pl-8 leading-relaxed">
                    Includes 4" non-bearing boundaries or 6" load-bearing exterior concrete blocks, fill core concrete joints, vertical rebar pins spaced @0.60m/0.80m, horizontal layers wire bands, and cement-sand dual surface plastering finishes (12mm thickness).
                  </td>
                  <td className="px-4 py-2 text-center font-mono">sq.m. Surface</td>
                  <td className="px-4 py-2"></td>
                </tr>
              )}

              {/* DIVISION 07 Roofing */}
              <tr className="bg-slate-50 hover:bg-slate-100 cursor-pointer h-9 font-semibold text-slate-800" onClick={() => toggleDiv("div-7")}>
                <td className="px-4 py-2">Div 04</td>
                <td className="px-4 py-2 flex items-center gap-1">
                  {expandedDivs["div-7"] ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                  DIV 04 - STEEL TRUSS STRUCTURAL SYSTEM & ROOF COVERS
                </td>
                <td className="px-4 py-2 text-center text-slate-500 font-mono">Roofing Lump</td>
                <td className="px-4 py-2 text-right font-mono font-bold text-slate-900">{formatCurrency(divisionTotals.roofing.total)}</td>
              </tr>
              {expandedDivs["div-7"] && (
                <tr className="bg-slate-50/20 text-slate-500">
                  <td className="px-5 py-2 flex flex-col gap-1">
                    <span className="text-[10px] text-blue-700 font-bold">Mat: {formatCurrency(divisionTotals.roofing.materials)}</span>
                    <span className="text-[10px] text-orange-600 font-bold">Lab: {formatCurrency(divisionTotals.roofing.labor)}</span>
                  </td>
                  <td className="px-5 py-2 pl-8 leading-relaxed">
                    Includes cold-formed C-purlins framework sections, heavy structural angle bar systems, pre-painted rib-type long span roofing sheets, high-density bubble aluminum foil insulation, tekscrews, matching ridge rolls, rain valley gutters, fascia framing, and PVC downspout pipe accessories.
                  </td>
                  <td className="px-4 py-2 text-center font-mono">sq.m. Slopes</td>
                  <td className="px-4 py-2"></td>
                </tr>
              )}

              {/* DIVISION 08 Openings */}
              <tr className="bg-slate-50 hover:bg-slate-150 cursor-pointer h-9 font-semibold text-slate-800" onClick={() => toggleDiv("div-8")}>
                <td className="px-4 py-2">Div 05</td>
                <td className="px-4 py-2 flex items-center gap-1">
                  {expandedDivs["div-8"] ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                  DIV 05 - WOOD DOORS & GLASS WINDOW FRAME SECTIONS
                </td>
                <td className="px-4 py-2 text-center text-slate-500 font-mono">Openings Lump</td>
                <td className="px-4 py-2 text-right font-mono font-bold text-slate-900">{formatCurrency(divisionTotals.doorsWindows.total)}</td>
              </tr>
              {expandedDivs["div-8"] && (
                <tr className="bg-slate-50/20 text-slate-500">
                  <td className="px-5 py-2 flex flex-col gap-1">
                    <span className="text-[10px] text-blue-700 font-bold">Mat: {formatCurrency(divisionTotals.doorsWindows.materials)}</span>
                    <span className="text-[10px] text-orange-600 font-bold">Lab: {formatCurrency(divisionTotals.doorsWindows.labor)}</span>
                  </td>
                  <td className="px-5 py-2 pl-8 leading-relaxed">
                    Includes solid timber panel main doors, MDF bedroom flush doors, waterproof PVC toilet panels, aluminum sliding glass windows, toilet awning glass configurations, hinges hardware assembly locks, anchoring, and installation.
                  </td>
                  <td className="px-4 py-2 text-center font-mono">Sets Layout</td>
                  <td className="px-4 py-2"></td>
                </tr>
              )}

              {/* DIVISION 09 Tiling */}
              <tr className="bg-slate-50 hover:bg-slate-100 cursor-pointer h-9 font-semibold text-slate-800" onClick={() => toggleDiv("div-9a")}>
                <td className="px-4 py-2">Div 06</td>
                <td className="px-4 py-2 flex items-center gap-1">
                  {expandedDivs["div-9a"] ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                  DIV 06 - TILES & FINISHING SURFACE PLACEMENTS
                </td>
                <td className="px-4 py-2 text-center text-slate-500 font-mono">Finishing Lump</td>
                <td className="px-4 py-2 text-right font-mono font-bold text-slate-900">{formatCurrency(divisionTotals.tiles.total)}</td>
              </tr>
              {expandedDivs["div-9a"] && (
                <tr className="bg-slate-50/20 text-slate-500">
                  <td className="px-5 py-2 flex flex-col gap-1">
                    <span className="text-[10px] text-blue-700 font-bold">Mat: {formatCurrency(divisionTotals.tiles.materials)}</span>
                    <span className="text-[10px] text-orange-600 font-bold">Lab: {formatCurrency(divisionTotals.tiles.labor)}</span>
                  </td>
                  <td className="px-5 py-2 pl-8 leading-relaxed">
                    Includes homogeneous/porcelain floor tiling (60x60 / 80x80 cm), bedroom ceramic tiles, bathroom wet wall layouts, stair steps laying, high-grade tile adhesive binders, joint grout pigments, and corner protective plastic/brass trims.
                  </td>
                  <td className="px-4 py-2 text-center font-mono">sq.m. Layers</td>
                  <td className="px-4 py-2"></td>
                </tr>
              )}

              {/* DIVISION 09B Painting */}
              <tr className="bg-slate-50 hover:bg-slate-100 cursor-pointer h-9 font-semibold text-slate-800" onClick={() => toggleDiv("div-9b")}>
                <td className="px-4 py-2">Div 07</td>
                <td className="px-4 py-2 flex items-center gap-1">
                  {expandedDivs["div-9b"] ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                  DIV 07 - SURFACE PROTECTIVE COATING & PAINTING
                </td>
                <td className="px-4 py-2 text-center text-slate-500 font-mono">Finishes Lump</td>
                <td className="px-4 py-2 text-right font-mono font-bold text-slate-900">{formatCurrency(divisionTotals.painting.total)}</td>
              </tr>
              {expandedDivs["div-9b"] && (
                <tr className="bg-slate-50/20 text-slate-500">
                  <td className="px-5 py-2 flex flex-col gap-1">
                    <span className="text-[10px] text-blue-700 font-bold">Mat: {formatCurrency(divisionTotals.painting.materials)}</span>
                    <span className="text-[10px] text-orange-600 font-bold">Lab: {formatCurrency(divisionTotals.painting.labor)}</span>
                  </td>
                  <td className="px-5 py-2 pl-8 leading-relaxed">
                    Includes acrylic concrete undercoat primers, elastomeric semi-gloss topcoats, drywall skimming joint putties, sandpaper preparations, paint thinners, roller brushes, and auxiliary scaffold setups.
                  </td>
                  <td className="px-4 py-2 text-center font-mono">sq.m. Surface</td>
                  <td className="px-4 py-2"></td>
                </tr>
              )}

              {/* Spacer */}
              <tr>
                <td colSpan={4} className="h-6"></td>
              </tr>

              {/* Subtotal Direct Costs */}
              <tr className="bg-slate-100 text-slate-800 font-bold border-t border-slate-300">
                <td></td>
                <td className="px-4 py-2.5 uppercase text-slate-700 italic">Total Estimated Direct Costs (Mat + Lab + Equip)</td>
                <td></td>
                <td className="px-4 py-2.5 text-right font-mono text-slate-900 font-bold">{formatCurrency(directCostTotal)}</td>
              </tr>

              {/* MARKUPS CALC */}
              <tr className="border-b border-slate-100">
                <td></td>
                <td className="px-4 py-2 text-slate-600 italic">Overhead Costs & Administration Allocation ({projectInfo.overheadPercent}%)</td>
                <td className="text-center font-mono text-slate-400">Factor Multiplier</td>
                <td className="px-4 py-2 text-right font-mono text-slate-700">{formatCurrency(markups.overhead)}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td></td>
                <td className="px-4 py-2 text-slate-600 italic">Contingency Safety Reserve Allowance ({projectInfo.contingencyPercent}%)</td>
                <td className="text-center font-mono text-slate-400">Factor Multiplier</td>
                <td className="px-4 py-2 text-right font-mono text-slate-700">{formatCurrency(markups.contingency)}</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td></td>
                <td className="px-4 py-2 text-slate-600 italic">Contractor net Profit Margin ({projectInfo.profitPercent}%)</td>
                <td className="text-center font-mono text-slate-400">Factor Multiplier</td>
                <td className="px-4 py-2 text-right font-mono text-slate-700">{formatCurrency(markups.profit)}</td>
              </tr>
              <tr className="border-b border-slate-200">
                <td></td>
                <td className="px-4 py-2 text-slate-600 italic">Mobilization & demobilization engineering logistics ({projectInfo.mobilizationPercent}%)</td>
                <td className="text-center font-mono text-slate-400">Factor Multiplier</td>
                <td className="px-4 py-2 text-right font-mono text-slate-700">{formatCurrency(markups.mobilization)}</td>
              </tr>

              {/* SUB TOTAL CONSTR INDEX */}
              <tr className="bg-slate-50 font-bold border-b border-slate-200">
                <td></td>
                <td className="px-4 py-2.5 text-slate-800 uppercase italic text-[11px]">Gross Construction Contract Value (Before Taxes)</td>
                <td></td>
                <td className="px-4 py-2.5 text-right font-mono text-slate-900 font-bold">
                  {formatCurrency(directCostTotal + markups.overhead + markups.contingency + markups.profit + markups.mobilization)}
                </td>
              </tr>

              {/* VAT TAXES */}
              <tr className="border-b border-slate-200">
                <td></td>
                <td className="px-4 py-2 text-slate-600 italic font-semibold">Philippine standard Value Added Tax (VAT) ({projectInfo.vatPercent}%)</td>
                <td className="text-center font-mono text-slate-400 font-semibold">BIR Indirect Tax</td>
                <td className="px-4 py-2 text-right font-mono text-slate-700 font-bold">
                  {formatCurrency(markups.vat)}
                </td>
              </tr>

              {/* GRAND CONTRACT TOTAL */}
              <tr className="bg-blue-900 text-white font-sans font-bold text-sm h-12">
                <td className="px-4 rounded-l-lg">TOTAL</td>
                <td className="px-4 uppercase tracking-wider">CONSTRUCTION GRAND INVESTMENT BIDS CODES</td>
                <td></td>
                <td className="px-4 text-right font-mono text-emerald-400 text-bold text-lg rounded-r-lg">
                  {formatCurrency(markups.grandTotal)}
                </td>
              </tr>

            </tbody>
          </table>
        </div>

        <div className="bg-slate-50 border border-slate-250 p-4 rounded-xl flex gap-3 text-slate-600 text-xs leading-relaxed" id="boq-certification">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <p>
            <strong>Quantity Surveyor Certification:</strong> This unified document aggregates structural concrete and architectural costs formatted to cross-reference direct material pricing databases, providing maximum commercial audit accuracy for development proposals.
          </p>
        </div>

      </div>
    </div>
  );
}
