import React from "react";
import { CHBWallElement, MaterialItem, DivisionCost } from "../types";
import { Plus, Trash2, HelpCircle } from "lucide-react";
import { calculateCHBWallMaterials } from "../utils/calculations";

interface CHBWallEstimatorProps {
  elements: CHBWallElement[];
  materials: MaterialItem[];
  onChange: (elements: CHBWallElement[]) => void;
  divisionCost?: DivisionCost;
}

export default function CHBWallEstimator({ elements, materials, onChange, divisionCost }: CHBWallEstimatorProps) {
  
  const handleElementChange = <K extends keyof CHBWallElement>(id: string, key: K, val: CHBWallElement[K]) => {
    onChange(elements.map(item => item.id === id ? { ...item, [key]: val } : item));
  };

  const handleAddElement = () => {
    const newId = `chb-${Date.now()}`;
    const newEl: CHBWallElement = {
      id: newId,
      name: "New Perimeter Enclosure",
      chbSize: "4\"",
      length: 10.0,
      height: 3.0,
      deductions: 2.0,
      verticalRebarSpacing: 0.60,
      horizontalRebarSpacing: 3,
      plasterBothSides: true,
      chbWastagePercent: 5
    };
    onChange([...elements, newEl]);
  };

  const handleDeleteElement = (id: string) => {
    onChange(elements.filter(item => item.id !== id));
  };

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-xs space-y-6" id="chb-division-estimator">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-sans font-semibold text-slate-900 text-lg">Division 05 - Masonry Works & CHB Estimator</h3>
          <p className="text-xs text-slate-500">Estimates hollow block quantities, joint mortar volumes, plastering sand/cement, and structural rebar codes.</p>
        </div>
        <button
          onClick={handleAddElement}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-9 px-4 rounded-lg flex items-center gap-1.5 transition cursor-pointer font-sans shadow-xs shrink-0 self-start text-nowrap"
          id="btn-add-chb-item"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Interior/Exterior Wall
        </button>
      </div>

      {divisionCost && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-800" id="chb-cost-summary-board">
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
              <th className="px-3 py-2 w-48">WALL LOCATION DESCRIPTION</th>
              <th className="px-2 py-2">CHB SIZE</th>
              <th className="px-2 py-2 w-16">L (m)</th>
              <th className="px-2 py-2 w-16">H (m)</th>
              <th className="px-2 py-2 w-20">DEDUCTS (sqm)</th>
              <th className="px-3 py-2 text-center w-20">STEEL VERT</th>
              <th className="px-3 py-2 text-center w-20">STEEL HORZ</th>
              <th className="px-2 py-2 text-center w-16">PLASTER</th>
              <th className="px-2 py-2 text-right">NET AREA</th>
              <th className="px-2 py-2 text-right">CHB COUNT</th>
              <th className="px-2 py-2 text-right">MORTAR & PLASTER</th>
              <th className="px-2 py-2 text-right">Ø10mm REBARS</th>
              <th className="px-3 py-2 text-center w-12">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {elements.map((item) => {
              const mats = calculateCHBWallMaterials(item);
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

                  {/* CHB Size */}
                  <td className="px-2 py-3">
                    <select
                      value={item.chbSize}
                      onChange={(e) => handleElementChange(item.id, "chbSize", e.target.value as CHBWallElement["chbSize"])}
                      className="bg-slate-50 border border-slate-150 rounded-md py-1.5 px-1.5 text-[11px] block text-slate-700 outline-hidden font-bold"
                    >
                      <option value="4&quot;">4" (Interior)</option>
                      <option value="6&quot;">6" (Exterior)</option>
                    </select>
                  </td>

                  {/* Length */}
                  <td className="px-2 py-3">
                    <input
                      type="number"
                      step="0.1"
                      value={item.length}
                      onChange={(e) => handleElementChange(item.id, "length", Number(e.target.value) || 0)}
                      className="w-14 bg-amber-50 rounded-md py-1.5 px-1.5 focus:bg-white border border-slate-150 text-right font-mono"
                    />
                  </td>

                  {/* Height */}
                  <td className="px-2 py-3">
                    <input
                      type="number"
                      step="0.05"
                      value={item.height}
                      onChange={(e) => handleElementChange(item.id, "height", Number(e.target.value) || 0)}
                      className="w-14 bg-amber-50 rounded-md py-1.5 px-1.5 focus:bg-white border border-slate-150 text-right font-mono"
                    />
                  </td>

                  {/* Deductions door/windows */}
                  <td className="px-2 py-3">
                    <input
                      type="number"
                      step="0.1"
                      value={item.deductions}
                      onChange={(e) => handleElementChange(item.id, "deductions", Number(e.target.value) || 0)}
                      className="w-16 bg-amber-50 rounded-md py-1.5 px-1.5 focus:bg-white border border-slate-150 text-right font-mono"
                    />
                  </td>

                  {/* Steel Vertical spacing */}
                  <td className="px-3 py-3 text-center">
                    <select
                      value={item.verticalRebarSpacing}
                      onChange={(e) => handleElementChange(item.id, "verticalRebarSpacing", Number(e.target.value))}
                      className="bg-slate-50 border border-slate-150 rounded-md py-1.5 px-1 text-[11px] block mx-auto text-slate-700 font-mono outline-hidden"
                    >
                      <option value={0.4}>@0.40m</option>
                      <option value={0.6}>@0.60m</option>
                      <option value={0.8}>@0.80m</option>
                    </select>
                  </td>

                  {/* Steel Horizontal layer */}
                  <td className="px-3 py-3 text-center">
                    <select
                      value={item.horizontalRebarSpacing}
                      onChange={(e) => handleElementChange(item.id, "horizontalRebarSpacing", Number(e.target.value))}
                      className="bg-slate-50 border border-slate-150 rounded-md py-1.5 px-1 text-[11px] block mx-auto text-slate-700 outline-hidden font-mono"
                    >
                      <option value={2}>Every 2 layers</option>
                      <option value={3}>Every 3 layers</option>
                      <option value={4}>Every 4 layers</option>
                    </select>
                  </td>

                  {/* Plaster checkboxes */}
                  <td className="px-2 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={item.plasterBothSides}
                      onChange={(e) => handleElementChange(item.id, "plasterBothSides", e.target.checked)}
                      className="w-4 h-4 rounded-md text-blue-600 focus:ring-blue-500 border-slate-350 accent-blue-600 cursor-pointer"
                    />
                  </td>

                  {/* Computed Net Area */}
                  <td className="px-2 py-3 text-right font-mono text-slate-900 font-semibold bg-slate-50/50">
                    {mats.netArea}m²
                  </td>

                  {/* Block Pieces count */}
                  <td className="px-2 py-3 text-right font-mono text-slate-800 font-bold">
                    {mats.chbPieces.toLocaleString()} pcs
                  </td>

                  {/* Cement and Sand Mortar/Plaster info */}
                  <td className="px-2 py-3 text-right">
                    <div className="text-[10px] space-y-0.5">
                      <p><strong className="text-slate-800">{mats.totalCementBags}</strong> bags cement</p>
                      <p><strong className="text-slate-800">{mats.totalSandCubicMeters}</strong>m³ sand</p>
                    </div>
                  </td>

                  {/* Steel Pieces */}
                  <td className="px-2 py-3 text-right">
                    <div className="text-[10px] leading-tight text-slate-600 font-mono">
                      <p><strong className="text-slate-800 font-bold">{mats.rebarPcs10mm} pcs</strong> (6m length)</p>
                      <p><strong className="text-slate-800">{mats.tieWireKg} kg</strong> wire</p>
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

      {/* CHB Specifications Handbook guidelines */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-[11px] text-slate-600 space-y-2 leading-relaxed" id="chb-division-guide">
        <h4 className="font-sans font-bold text-slate-800 uppercase tracking-wide">PH Standard Masonry Handbooks Constants & Multipliers:</h4>
        <ul className="list-disc pl-5 space-y-1 block">
          <li><strong>Wall hollow blocks count:</strong> Under Philippine standard sizes (400mm x 200mm), hollow blocks are counted at exactly <strong>12.5 blocks per square meter</strong> of plaster area, compounded by an optional 5% breakage/wastage.</li>
          <li><strong>Cement & Sand Mortar (Filling + joints):</strong> 
            - 4-inch walls consume 0.32 bags cement and 0.025 cubic meters sand per sqm.
            - 6-inch walls consume 0.52 bags cement and 0.042 cubic meters sand per sqm (due to larger core cavities).
          </li>
          <li><strong>Plastering:</strong> A standard 12mm dual-side plastering consumes 0.11 bags cement and 0.009 cubic meters sand per square meter per side face (Class A plaster mix).</li>
          <li><strong>Reinforcement:</strong> Vertical steel dowels block spaces are estimated relative to continuous height bounds, modeled comprehensively on 10mm deformed reinforcing profile pieces.</li>
        </ul>
      </div>

    </div>
  );
}
