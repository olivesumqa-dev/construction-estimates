import React from "react";
import { PaintingElement, MaterialItem, DivisionCost } from "../types";
import { Plus, Trash2, HelpCircle, ArrowUp, ArrowDown } from "lucide-react";
import { calculatePaintingMaterials } from "../utils/calculations";

interface PaintingEstimatorProps {
  elements: PaintingElement[];
  materials: MaterialItem[];
  onChange: (elements: PaintingElement[]) => void;
  divisionCost?: DivisionCost;
}

export default function PaintingEstimator({ elements, materials, onChange, divisionCost }: PaintingEstimatorProps) {
  
  const handleElementChange = <K extends keyof PaintingElement>(id: string, key: K, val: PaintingElement[K]) => {
    onChange(elements.map(item => item.id === id ? { ...item, [key]: val } : item));
  };

  const handleAddElement = () => {
    const newId = `paint-${Date.now()}`;
    const newEl: PaintingElement = {
      id: newId,
      name: "New Guest Bedroom Walls",
      type: "Interior Walls",
      area: 50,
      numberOfCoats: 3,
      surfaceType: "Plastered CHB"
    };
    onChange([...elements, newEl]);
  };

  const handleDeleteElement = (id: string) => {
    onChange(elements.filter(item => item.id !== id));
  };

  const handleMoveElement = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= elements.length) return;
    const updated = [...elements];
    [updated[index], updated[nextIndex]] = [updated[nextIndex], updated[index]];
    onChange(updated);
  };

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-xs space-y-6" id="painting-division-estimator">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-sans font-semibold text-slate-900 text-lg">Division 09B - Protective Painting Estimator</h3>
          <p className="text-xs text-slate-500">Calculates acrylic primer gallons, semi-gloss acrylic topcoat gallons, skimcoat/screed wall putty, and solvents.</p>
        </div>
        <button
          onClick={handleAddElement}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-9 px-4 rounded-lg flex items-center gap-1.5 transition cursor-pointer font-sans shadow-xs shrink-0 self-start text-nowrap"
          id="btn-add-painting-item"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Painting Surface
        </button>
      </div>

      {divisionCost && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-800" id="painting-cost-summary-board">
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
              <th className="px-3 py-2 w-52">PAINT SURFACE TYPE PLAN</th>
              <th className="px-2 py-2">SURFACE CATEGORY</th>
              <th className="px-2 py-2 w-28">INPUT AREA (sqm)</th>
              <th className="px-2 py-2 w-16 text-center">COATS</th>
              <th className="px-3 py-2">SUBSTRATE MATERIAL TYPE</th>
              <th className="px-2 py-2 text-right">PRIMER REQUIRED</th>
              <th className="px-2 py-2 text-right">TOPCOAT REQUIRED</th>
              <th className="px-2 py-2 text-right">WALL PUTTY / FILLERS</th>
              <th className="px-2 py-2 text-right">THINNING SOLVENTS</th>
              <th className="px-3 py-2 text-center w-12">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {elements.map((item, index) => {
              const mats = calculatePaintingMaterials(item);
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

                  {/* Type */}
                  <td className="px-2 py-3">
                    <select
                      value={item.type}
                      onChange={(e) => handleElementChange(item.id, "type", e.target.value as PaintingElement["type"])}
                      className="bg-slate-50 border border-slate-150 rounded-md py-1.5 px-1.5 text-[11px] block text-slate-700 outline-hidden font-medium"
                    >
                      <option value="Interior Walls">Interior Walls</option>
                      <option value="Exterior Walls">Exterior Walls</option>
                      <option value="Ceilings">Ceilings</option>
                      <option value="Metal Works">Metal Trusses</option>
                      <option value="Wood Works">Wood doors / Trims</option>
                    </select>
                  </td>

                  {/* Surface area */}
                  <td className="px-2 py-3">
                    <input
                      type="number"
                      step="1"
                      value={item.area}
                      onChange={(e) => handleElementChange(item.id, "area", Number(e.target.value) || 0)}
                      className="w-20 bg-amber-50 rounded-md py-1.5 px-1.5 focus:bg-white border border-slate-150 text-right font-mono font-bold"
                    />
                  </td>

                  {/* Number of coats */}
                  <td className="px-2 py-3 text-center">
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={item.numberOfCoats}
                      onChange={(e) => handleElementChange(item.id, "numberOfCoats", Number(e.target.value) || 3)}
                      className="w-12 bg-amber-50 rounded-md py-1.5 px-1 focus:bg-white border border-slate-150 text-center font-mono font-semibold"
                      title="Number of coats required (typically 1 flat primer + 2 gloss topcoats)"
                    />
                  </td>

                  {/* Substrate type */}
                  <td className="px-3 py-3">
                    <select
                      value={item.surfaceType}
                      onChange={(e) => handleElementChange(item.id, "surfaceType", e.target.value as PaintingElement["surfaceType"])}
                      className="w-full bg-slate-50 border border-slate-150 rounded-md py-1.5 px-2 text-[11px] text-slate-700 font-medium outline-hidden"
                    >
                      <option value="Plastered CHB">Plastered Concrete / CHB</option>
                      <option value="Fiber Cement / Gypsum">Fiber Cement Ceiling boards</option>
                      <option value="Wood Panels">Wood panels</option>
                      <option value="Structural Steel">Anti-rust Structural Steel</option>
                    </select>
                  </td>

                  {/* Primer gallons */}
                  <td className="px-2 py-3 text-right font-mono text-slate-900 font-semibold bg-slate-50/50">
                    {mats.primerGallons} gal
                  </td>

                  {/* Topcoat gallons */}
                  <td className="px-2 py-3 text-right font-mono text-slate-800">
                    {mats.topcoatGallons} gal
                  </td>

                  {/* Skimcoat/Putty bags */}
                  <td className="px-2 py-3 text-right font-mono text-slate-600">
                    {mats.puttyBags > 0 ? `${mats.puttyBags} bags` : "None"}
                  </td>

                  {/* Solvents */}
                  <td className="px-2 py-3 text-right font-mono text-slate-500">
                    {mats.thinnerGallons > 0 ? `${mats.thinnerGallons} gal` : "None"}
                  </td>

                  {/* Actions */}
                  <td className="px-3 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleMoveElement(index, -1)}
                        disabled={index === 0}
                        className="text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 p-1 rounded-md transition cursor-pointer disabled:cursor-default"
                        title="Move item up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleMoveElement(index, 1)}
                        disabled={index === elements.length - 1}
                        className="text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 p-1 rounded-md transition cursor-pointer disabled:cursor-default"
                        title="Move item down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteElement(item.id)}
                        className="text-slate-400 hover:text-red-500 p-1 rounded-md transition cursor-pointer"
                        title="Delete item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Manual details */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-[11px] text-slate-600 space-y-2 leading-relaxed" id="painting-division-guide">
        <h4 className="font-sans font-bold text-slate-800 uppercase tracking-wide">PH Protective Coating estimate indices:</h4>
        <ul className="list-disc pl-5 space-y-1 block">
          <li><strong>Wall Paint Coverage:</strong> Under local trade practices, standard interior flat-undercoat primers and semi-gloss acrylic topcoats cover approximately 30 sqm per 4-liter gallon per single coat.</li>
          <li><strong>Screed Skimcoat/Putty:</strong> Plastered hollow blocks and ceiling fiber cement boards require dense base patching. Standard powdered joint putties or compound bags weighing 25kg cover approximately 25 sqm.</li>
          <li><strong>Thinning Solvents:</strong> Enamel or anti-rust alkyd metal primers (such as red oxide primers) require clean mineral spirits / lacquer thinners, quantified at exactly 15.0% of cumulative alkyd coating volumes.</li>
        </ul>
      </div>

    </div>
  );
}
