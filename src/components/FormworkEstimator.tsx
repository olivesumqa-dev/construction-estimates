import React from "react";
import { FormworkElement, MaterialItem, DivisionCost } from "../types";
import { Plus, Trash2, HelpCircle } from "lucide-react";
import { calculateFormworkMaterials } from "../utils/calculations";

interface FormworkEstimatorProps {
  elements: FormworkElement[];
  materials: MaterialItem[];
  onChange: (elements: FormworkElement[]) => void;
  divisionCost?: DivisionCost;
}

export default function FormworkEstimator({ elements, materials, onChange, divisionCost }: FormworkEstimatorProps) {
  
  const handleElementChange = <K extends keyof FormworkElement>(id: string, key: K, val: FormworkElement[K]) => {
    onChange(elements.map(item => item.id === id ? { ...item, [key]: val } : item));
  };

  const handleAddElement = () => {
    const newId = `form-${Date.now()}`;
    const newEl: FormworkElement = {
      id: newId,
      name: "New Beam Shuttering",
      category: "Beams",
      contactArea: 10.0,
      quantity: 1,
      reuseFactor: 3,
      plywoodThickness: "1/2\"",
      supportType: "Coco Lumber",
      rentalDurationDays: 14
    };
    onChange([...elements, newEl]);
  };

  const handleDeleteElement = (id: string) => {
    onChange(elements.filter(item => item.id !== id));
  };

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-xs space-y-6" id="formwork-division-estimator">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-sans font-semibold text-slate-900 text-lg">Division 04 - Formworks & Scaffoldings Estimator</h3>
          <p className="text-xs text-slate-500">Calculates plywood sheeting, coco lumber framing (BF), support scaffolds, and standard wire nail count.</p>
        </div>
        <button
          onClick={handleAddElement}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-9 px-4 rounded-lg flex items-center gap-1.5 transition cursor-pointer font-sans shadow-xs shrink-0 self-start text-nowrap"
          id="btn-add-formwork-item"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Formwork Element
        </button>
      </div>

      {divisionCost && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-800" id="formwork-cost-summary-board">
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
              <th className="px-3 py-2 w-52">WORK DESCRIPTION</th>
              <th className="px-2 py-2">SECTION</th>
              <th className="px-2 py-2 w-28">CONTACT AREA (sqm)</th>
              <th className="px-2 py-2 w-14 text-center">QTY</th>
              <th className="px-2 py-2 w-16 text-center">REUSE TIMES</th>
              <th className="px-3 py-2 w-24">THICKNESS</th>
              <th className="px-3 py-2">SUPPORT TYPE</th>
              <th className="px-2 py-2 text-right">PLYWOOD (sheets)</th>
              <th className="px-2 py-2 text-right">COCO LUMBER (bd.ft)</th>
              <th className="px-2 py-2 text-right">CWN NAILS (kg)</th>
              <th className="px-3 py-2 text-center w-12">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {elements.map((item) => {
              const mats = calculateFormworkMaterials(item);
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

                  {/* Category */}
                  <td className="px-2 py-3">
                    <select
                      value={item.category}
                      onChange={(e) => handleElementChange(item.id, "category", e.target.value as FormworkElement["category"])}
                      className="bg-slate-50 border border-slate-150 rounded-md py-1.5 px-1.5 text-[11px] block text-slate-700 outline-hidden"
                    >
                      <option value="Footings">Footings</option>
                      <option value="Columns">Columns</option>
                      <option value="Beams">Beams</option>
                      <option value="Slabs">Slabs</option>
                      <option value="Stairs">Stairs</option>
                    </select>
                  </td>

                  {/* Contact Area */}
                  <td className="px-2 py-3">
                    <input
                      type="number"
                      step="0.5"
                      value={item.contactArea}
                      onChange={(e) => handleElementChange(item.id, "contactArea", Number(e.target.value) || 0)}
                      className="w-20 bg-amber-50 rounded-md py-1.5 px-1.5 focus:bg-white border border-slate-150 text-right font-mono font-bold"
                    />
                  </td>

                  {/* Quantity */}
                  <td className="px-2 py-3">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleElementChange(item.id, "quantity", Number(e.target.value) || 1)}
                      className="w-11 bg-amber-50 rounded-md py-1.5 px-1 focus:bg-white border border-slate-150 text-center font-bold"
                    />
                  </td>

                  {/* Reuse times */}
                  <td className="px-2 py-3 text-center">
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={item.reuseFactor}
                      onChange={(e) => handleElementChange(item.id, "reuseFactor", Number(e.target.value) || 1)}
                      className="w-12 bg-amber-50 rounded-md py-1.5 px-1 focus:bg-white border border-slate-150 text-center font-mono font-semibold"
                      title="Estimation factor representing the number of plywood boards reuses (e.g. 3-4)"
                    />
                  </td>

                  {/* Thickness */}
                  <td className="px-3 py-3">
                    <select
                      value={item.plywoodThickness}
                      onChange={(e) => handleElementChange(item.id, "plywoodThickness", e.target.value as FormworkElement["plywoodThickness"])}
                      className="w-full bg-slate-50 border border-slate-150 rounded-md py-1.5 px-1 text-[11px] text-slate-700 font-medium outline-hidden"
                    >
                      <option value="1/4&quot;">1/4" (Marine)</option>
                      <option value="1/2&quot;">1/2" (Phenolic)</option>
                      <option value="3/4&quot;">3/4" (Phenolic)</option>
                    </select>
                  </td>

                  {/* Support Type */}
                  <td className="px-3 py-3">
                    <select
                      value={item.supportType}
                      onChange={(e) => handleElementChange(item.id, "supportType", e.target.value as FormworkElement["supportType"])}
                      className="w-full bg-slate-50 border border-slate-150 rounded-md py-1.5 px-1.5 text-[11px] text-slate-700 font-medium outline-hidden"
                    >
                      <option value="Coco Lumber">Coco Lumber Frame</option>
                      <option value="Steel Props/Scaf">Steel Props / H-Frames</option>
                    </select>
                  </td>

                  {/* Plywood Count */}
                  <td className="px-2 py-3 text-right font-mono text-slate-900 font-semibold bg-slate-50/50">
                    {mats.plywoodSheets} sheets
                  </td>

                  {/* Lumber Board Feet */}
                  <td className="px-2 py-3 text-right font-mono text-slate-900">
                    {mats.cocoLumberBdFt.toLocaleString()} BF
                  </td>

                  {/* CWN Nails kg */}
                  <td className="px-2 py-3 text-right font-mono text-slate-600">
                    {mats.nailsKg} kg
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

      {/* Estimating Formulas Details */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-[11px] text-slate-600 space-y-2 leading-relaxed" id="formwork-division-guide">
        <h4 className="font-sans font-bold text-slate-800 uppercase tracking-wide">PH Standard Formwork Mathematical takeoff factors:</h4>
        <ul className="list-disc pl-5 space-y-1 block">
          <li><strong>Plywood sheets:</strong> Calculated bases on standard plywood board area of 2.98 sqm. Total base sheets required is Contact Area divided by 2.98. Incorporating 10% cutting wastage, sheets are divided by the selected <strong>Reuse Factor</strong>.</li>
          <li><strong>Coco Lumber:</strong> Under local estimation standards, scaffolding coco lumber consumes an average of 12 board feet (BF) of timber per 1.0 sqm of active form contact area, divided by the Reuse Factor.</li>
          <li><strong>Common Wire Nails (CWN):</strong> Estimated parametrically at a constant of 0.15 kg of assorted nails per square meter of contact area.</li>
        </ul>
      </div>

    </div>
  );
}
