import React from "react";
import { RoofingElement, MaterialItem, DivisionCost } from "../types";
import { Plus, Trash2, HelpCircle } from "lucide-react";
import { calculateRoofingMaterials } from "../utils/calculations";

interface RoofingEstimatorProps {
  elements: RoofingElement[];
  materials: MaterialItem[];
  onChange: (elements: RoofingElement[]) => void;
  divisionCost?: DivisionCost;
}

export default function RoofingEstimator({ elements, materials, onChange, divisionCost }: RoofingEstimatorProps) {
  
  const handleElementChange = <K extends keyof RoofingElement>(id: string, key: K, val: RoofingElement[K]) => {
    onChange(elements.map(item => item.id === id ? { ...item, [key]: val } : item));
  };

  const handleAddElement = () => {
    const newId = `roof-${Date.now()}`;
    const newEl: RoofingElement = {
      id: newId,
      name: "New Side Lean-To Roof",
      length: 6.0,
      width: 4.0,
      slopeDegrees: 25,
      overhang: 0.6,
      purlinSpacing: 0.60,
      roofingType: "Rib Type Long Span",
      insulationType: "Single Foil",
      fasciaLength: 15.0,
      gutterLength: 6.0,
      ridgeRollLength: 0.0,
      flashingLength: 6.0
    };
    onChange([...elements, newEl]);
  };

  const handleDeleteElement = (id: string) => {
    onChange(elements.filter(item => item.id !== id));
  };

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-xs space-y-6" id="roofing-division-estimator">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-sans font-semibold text-slate-900 text-lg">Division 07 - Roofing Systems & Truss framing Estimator</h3>
          <p className="text-xs text-slate-500">Trigonometric sloped sheets calculator, C-Purlins count, heavy steel truss angles, ridge and flashing details.</p>
        </div>
        <button
          onClick={handleAddElement}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-9 px-4 rounded-lg flex items-center gap-1.5 transition cursor-pointer font-sans shadow-xs shrink-0 self-start text-nowrap"
          id="btn-add-roofing-item"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Roofing Structure
        </button>
      </div>

      {divisionCost && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-800" id="roofing-cost-summary-board">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Material Cost Subtotal</span>
            <div className="text-base font-bold text-slate-800 font-mono">
              ₱{divisionCost.materials.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-200 sm:pl-4">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Labor Cost Subtotal</span>
            <div className="text-base font-bold text-orange-600 font-mono">
              ₱{divisionCost.labor.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-200 sm:pl-4">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">Total Direct Cost (Combined)</span>
            <div className="text-base font-bold text-blue-700 font-mono">
              ₱{divisionCost.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto border border-slate-100 rounded-xl">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold h-11 font-sans">
              <th className="px-3 py-2 w-48">PROJECT STRUCTURE LOCATION</th>
              <th className="px-2 py-2">FOOTPRINT L x W (m)</th>
              <th className="px-2 py-2 w-16">PITCH (°)</th>
              <th className="px-2 py-2 w-16">EAVES (m)</th>
              <th className="px-2 py-2 w-20">PURLIN SPA</th>
              <th className="px-2 py-2">PROFILE TYPE</th>
              <th className="px-2 py-2">INSULATION</th>
              <th className="px-2 py-2 text-right">SLOPED AREA</th>
              <th className="px-2 py-2 text-right">SHEETS (l.m.)</th>
              <th className="px-2 py-2 text-right font-semibold text-slate-700">C-PURLINS / TRUSSES</th>
              <th className="px-2 py-2 text-right">ACCESSORIES</th>
              <th className="px-3 py-2 text-center w-12">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {elements.map((item) => {
              const mats = calculateRoofingMaterials(item);
              return (
                <tr key={item.id} className="hover:bg-slate-50/30">
                  
                  {/* Name */}
                  <td className="px-3 py-3 font-semibold text-slate-800">
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleElementChange(item.id, "name", e.target.value)}
                      className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white text-slate-800 rounded-md py-1.5 px-2 border border-slate-150 outline-hidden font-medium"
                    />
                  </td>

                  {/* Footprint dimensions */}
                  <td className="px-2 py-3 text-center">
                    <div className="flex items-center gap-1 font-mono">
                      <input
                        type="number"
                        step="0.5"
                        value={item.length}
                        onChange={(e) => handleElementChange(item.id, "length", Number(e.target.value) || 0)}
                        className="w-10 bg-amber-50 rounded-md py-1 text-center border border-slate-150"
                        title="Main Span horizontal length (meters)"
                      />
                      <span>×</span>
                      <input
                        type="number"
                        step="0.5"
                        value={item.width}
                        onChange={(e) => handleElementChange(item.id, "width", Number(e.target.value) || 0)}
                        className="w-10 bg-amber-50 rounded-md py-1 text-center border border-slate-150"
                        title="Main Span horizontal width (meters)"
                      />
                    </div>
                  </td>

                  {/* Slope degrees */}
                  <td className="px-2 py-3">
                    <input
                      type="number"
                      min="5"
                      max="60"
                      value={item.slopeDegrees}
                      onChange={(e) => handleElementChange(item.id, "slopeDegrees", Number(e.target.value) || 30)}
                      className="w-12 bg-amber-50 rounded-md py-1.5 px-1 focus:bg-white border border-slate-150 text-center font-mono font-bold"
                    />
                  </td>

                  {/* Overhang eaves */}
                  <td className="px-2 py-3">
                    <input
                      type="number"
                      step="0.1"
                      value={item.overhang}
                      onChange={(e) => handleElementChange(item.id, "overhang", Number(e.target.value) || 0.8)}
                      className="w-11 bg-amber-50 rounded-md py-1.5 px-1 focus:bg-white border border-slate-150 text-center font-mono"
                    />
                  </td>

                  {/* Purlin Spacing */}
                  <td className="px-2 py-3">
                    <select
                      value={item.purlinSpacing}
                      onChange={(e) => handleElementChange(item.id, "purlinSpacing", Number(e.target.value))}
                      className="bg-slate-50 border border-slate-150 rounded-md py-1.5 px-1 text-[11px] block w-full text-slate-700 font-mono outline-hidden"
                    >
                      <option value={0.50}>@0.50m</option>
                      <option value={0.60}>@0.60m</option>
                      <option value={0.75}>@0.75m</option>
                      <option value={0.90}>@0.90m</option>
                    </select>
                  </td>

                  {/* Profile Sheet */}
                  <td className="px-2 py-3">
                    <select
                      value={item.roofingType}
                      onChange={(e) => handleElementChange(item.id, "roofingType", e.target.value as RoofingElement["roofingType"])}
                      className="bg-slate-50 border border-slate-150 rounded-md py-1.5 px-1.5 text-[11px] block text-slate-700 font-medium outline-hidden"
                    >
                      <option value="Rib Type Long Span">Rib Pre-painted</option>
                      <option value="Corrugated Long Span">Corrugated Pre-painted</option>
                      <option value="Tile Effect">Premium Tile-Effect</option>
                    </select>
                  </td>

                  {/* Insulation Type */}
                  <td className="px-2 py-3">
                    <select
                      value={item.insulationType}
                      onChange={(e) => handleElementChange(item.id, "insulationType", e.target.value as RoofingElement["insulationType"])}
                      className="bg-slate-50 border border-slate-150 rounded-md py-1.5 px-1.5 text-[11px] block text-slate-700 outline-hidden"
                    >
                      <option value="None">None</option>
                      <option value="Single Foil">Single Foil Bubble</option>
                      <option value="Double Foil">Double Foil Bubble</option>
                      <option value="Bubble Foil">Dense Bubble insulation</option>
                    </select>
                  </td>

                  {/* Computed Sloped Area */}
                  <td className="px-2 py-3 text-right font-mono text-slate-900 font-semibold bg-slate-50/50">
                    {mats.slopedArea}m²
                  </td>

                  {/* Pre-painted Sheet Length Required */}
                  <td className="px-2 py-3 text-right font-mono text-slate-800">
                    {mats.roofingLM} l.m.
                  </td>

                  {/* C-Purlins and Truss elements */}
                  <td className="px-2 py-3 text-right font-mono text-[10px] leading-tight">
                    <p><strong className="text-slate-800 font-bold">{mats.purlinsCount} pcs</strong> purlins (6m)</p>
                    <p><strong className="text-slate-800">{mats.angleBarsCount} pcs</strong> angle truss (6m)</p>
                  </td>

                  {/* Insulation & Accessories details */}
                  <td className="px-2 py-3 text-right">
                    <div className="text-[10px] leading-tight text-slate-500 font-mono">
                      {mats.insulationRolls > 0 && <p><strong className="text-slate-800">{mats.insulationRolls} rolls</strong> foil</p>}
                      <p><strong className="text-slate-800">{mats.ridgeRolls} pcs</strong> ridge caps</p>
                      <p><strong className="text-slate-800">{mats.gutters} pcs</strong> gutters</p>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-3 text-center">
                    <button
                      onClick={() => handleDeleteElement(item.id)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded-md transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Trigonometric Roofing Specifications Guide */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-[11px] text-slate-600 space-y-2 leading-relaxed" id="roofing-division-guide">
        <h4 className="font-sans font-bold text-slate-800 uppercase tracking-wide">PH Roofing trigonometry & structural standards manual:</h4>
        <ul className="list-disc pl-5 space-y-1 block">
          <li><strong>Structural Sloped Area formula:</strong> Double pitches or hip slopes are computed using pure mathematical trigonometry: Footprint Area divided by cos(Slope Pitch Degrees).</li>
          <li><strong>Effective metal coverage:</strong> Base sheet linear meters are counted integrating side laps. Commercial rib covers 1.0m width, whereas traditional corrugated accounts for 0.80m effective coverage, multiplied by 1.08 (8% wastage allowance).</li>
          <li><strong>C-Purlins calculations:</strong> Total linear lines is Sloped width divided by purlin spacing plus 1. Total linear meters is lines multiplied by roof length multiplied by 2 sides multiplied by 1.10 overlap factor, using 6.0m commercial lengths.</li>
        </ul>
      </div>

    </div>
  );
}
