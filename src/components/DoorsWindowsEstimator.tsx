import React from "react";
import { DoorWindowElement, MaterialItem, DivisionCost } from "../types";
import { Plus, Trash2, HelpCircle, ArrowUp, ArrowDown } from "lucide-react";
import { calculateDoorWindowCost } from "../utils/calculations";

interface DoorsWindowsEstimatorProps {
  elements: DoorWindowElement[];
  materials: MaterialItem[];
  onChange: (elements: DoorWindowElement[]) => void;
  divisionCost?: DivisionCost;
}

export default function DoorsWindowsEstimator({ elements, materials, onChange, divisionCost }: DoorsWindowsEstimatorProps) {
  
  const handleElementChange = <K extends keyof DoorWindowElement>(id: string, key: K, val: DoorWindowElement[K]) => {
    onChange(elements.map(item => item.id === id ? { ...item, [key]: val } : item));
  };

  const handleAddElement = () => {
    const newId = `dw-${Date.now()}`;
    const newEl: DoorWindowElement = {
      id: newId,
      type: "Window",
      name: "New Sliding Aluminum Window",
      subType: "Sliding",
      width: 1.2,
      height: 1.2,
      quantity: 1,
      unitPrice: 5000,
      hardwareCostPerPc: 500,
      installationHoursPerPc: 3
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
    <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-xs space-y-6" id="openings-division-estimator">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-sans font-semibold text-slate-900 text-lg">Division 08 - Doors, Windows & Openings Scheduler</h3>
          <p className="text-xs text-slate-500">Manage standard opening apertures, frame materials, installation hardware, and labor hours.</p>
        </div>
        <button
          onClick={handleAddElement}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-9 px-4 rounded-lg flex items-center gap-1.5 transition cursor-pointer font-sans shadow-xs shrink-0 self-start text-nowrap"
          id="btn-add-opening-item"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Opening Item
        </button>
      </div>

      {divisionCost && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-800" id="doors-cost-summary-board">
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
              <th className="px-3 py-2 w-52">SCHEDULE DESCRIPTION</th>
              <th className="px-2 py-2 w-24">OPENING TYPE</th>
              <th className="px-2 py-2 w-28">SUBTYPE</th>
              <th className="px-2 py-2 w-14 text-center">W (m)</th>
              <th className="px-2 py-2 w-14 text-center">H (m)</th>
              <th className="px-2 py-2 w-14 text-center">QTY</th>
              <th className="px-3 py-2 text-right">MATERIAL (₱/pc)</th>
              <th className="px-3 py-2 text-right">HARDWARE (₱/pc)</th>
              <th className="px-2 py-2 text-center w-16">LABOR (hrs)</th>
              <th className="px-3 py-2 text-right">TOTAL TAKE COST</th>
              <th className="px-3 py-2 text-center w-12">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {elements.map((item, index) => {
              const costs = calculateDoorWindowCost(item);
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
                      onChange={(e) => handleElementChange(item.id, "type", e.target.value as DoorWindowElement["type"])}
                      className="bg-slate-50 border border-slate-150 rounded-md py-1.5 px-1.5 text-[11px] block text-slate-700 font-bold outline-hidden"
                    >
                      <option value="Door">Door</option>
                      <option value="Window">Window</option>
                    </select>
                  </td>

                  {/* SubType */}
                  <td className="px-2 py-3">
                    <select
                      value={item.subType}
                      onChange={(e) => handleElementChange(item.id, "subType", e.target.value as DoorWindowElement["subType"])}
                      className="bg-slate-50 border border-slate-150 rounded-md py-1.5 px-1.5 text-[11px] block text-slate-700 outline-hidden font-medium"
                    >
                      {item.type === "Door" ? (
                        <>
                          <option value="Solid Panel">Solid Timber Panel</option>
                          <option value="Flush">MDF Flush Door</option>
                          <option value="PVC">Waterproof PVC Door</option>
                        </>
                      ) : (
                        <>
                          <option value="Sliding">Sliding Window</option>
                          <option value="Awning">Awning window</option>
                          <option value="Casement">Casement window</option>
                          <option value="Fixed">Fixed glass screen</option>
                        </>
                      )}
                    </select>
                  </td>

                  {/* Width */}
                  <td className="px-2 py-3 text-center font-mono">
                    <input
                      type="number"
                      step="0.05"
                      value={item.width}
                      onChange={(e) => handleElementChange(item.id, "width", Number(e.target.value) || 0)}
                      className="w-12 bg-amber-50 rounded-md py-1.5 px-1 focus:bg-white border border-slate-150 text-center"
                    />
                  </td>

                  {/* Height */}
                  <td className="px-2 py-3 text-center font-mono">
                    <input
                      type="number"
                      step="0.05"
                      value={item.height}
                      onChange={(e) => handleElementChange(item.id, "height", Number(e.target.value) || 0)}
                      className="w-12 bg-amber-50 rounded-md py-1.5 px-1 focus:bg-white border border-slate-150 text-center"
                    />
                  </td>

                  {/* Quantity */}
                  <td className="px-2 py-3 text-center">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleElementChange(item.id, "quantity", Number(e.target.value) || 1)}
                      className="w-11 bg-amber-50 rounded-md py-1.5 px-1 focus:bg-white border border-slate-150 text-center font-bold"
                    />
                  </td>

                  {/* Material Unit Price */}
                  <td className="px-3 py-3 text-right font-mono">
                    <input
                      type="number"
                      value={item.unitPrice}
                      onChange={(e) => handleElementChange(item.id, "unitPrice", Number(e.target.value) || 0)}
                      className="w-20 bg-amber-50 rounded-md py-1 px-1 focus:bg-white border border-slate-150 text-right text-[11px] font-bold"
                    />
                  </td>

                  {/* Hardware Cost per set */}
                  <td className="px-3 py-3 text-right font-mono">
                    <input
                      type="number"
                      value={item.hardwareCostPerPc}
                      onChange={(e) => handleElementChange(item.id, "hardwareCostPerPc", Number(e.target.value) || 0)}
                      className="w-16 bg-amber-50 rounded-md py-1 px-1 focus:bg-white border border-slate-150 text-right text-[11px]"
                    />
                  </td>

                  {/* Labor hours per set */}
                  <td className="px-2 py-3 text-center font-mono">
                    <input
                      type="number"
                      min="0"
                      value={item.installationHoursPerPc}
                      onChange={(e) => handleElementChange(item.id, "installationHoursPerPc", Number(e.target.value) || 0)}
                      className="w-11 bg-amber-50 rounded-md py-1 px-1 focus:bg-white border border-slate-150 text-center"
                    />
                  </td>

                  {/* Computed Total cost */}
                  <td className="px-3 py-3 text-right font-mono text-slate-900 font-bold bg-slate-50/50">
                    ₱{costs.totalCost.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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

      {/* Manual Details */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-[11px] text-slate-600 space-y-2 leading-relaxed" id="openings-division-guide">
        <h4 className="font-sans font-bold text-slate-800 uppercase tracking-wide">PH Opening installation parameters:</h4>
        <ul className="list-disc pl-5 space-y-1 block">
          <li><strong>Material scope:</strong> Unit prices must encapsulate window aluminum frameworks, clear/tinted glass blocks, or timber panels.</li>
          <li><strong>Accessories & Hardware locksets:</strong> Includes standard handles, latch gears, hinges, locks, and rubber seal contours.</li>
          <li><strong>Installation labor cost:</strong> Labor represents typical carpenter/welder installation times, converted parametrically into PHP based on standard local crew outputs.</li>
        </ul>
      </div>

    </div>
  );
}
