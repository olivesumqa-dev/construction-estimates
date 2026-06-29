import React, { useEffect, useState } from "react";
import { ConcreteElement, MaterialItem, DivisionCost } from "../types";
import { Plus, Trash2, Layers, HardHat, FileText, CheckCircle, HelpCircle, ArrowUp, ArrowDown } from "lucide-react";
import { calculateConcreteVolume, calculateConcreteMaterials, calculateConcreteRebar, REBAR_KG_PER_M } from "../utils/calculations";

interface ConcreteEstimatorProps {
  elements: ConcreteElement[];
  materials: MaterialItem[];
  onChange: (elements: ConcreteElement[]) => void;
  divisionCost?: DivisionCost;
}

interface DecimalInputProps {
  value: number;
  step: string;
  className: string;
  onValueChange: (value: number) => void;
}

function DecimalInput({ value, step, className, onValueChange }: DecimalInputProps) {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  return (
    <input
      type="number"
      inputMode="decimal"
      min="0"
      step={step}
      value={draft}
      onChange={(event) => {
        const nextDraft = event.target.value;
        setDraft(nextDraft);
        const nextValue = Number(nextDraft);
        if (nextDraft !== "" && Number.isFinite(nextValue)) {
          onValueChange(nextValue);
        }
      }}
      onBlur={() => setDraft(String(value))}
      className={className}
    />
  );
}

export default function ConcreteEstimator({ elements, materials, onChange, divisionCost }: ConcreteEstimatorProps) {
  
  const handleElementChange = <K extends keyof ConcreteElement>(id: string, key: K, val: ConcreteElement[K]) => {
    onChange(elements.map(item => item.id === id ? { ...item, [key]: val } : item));
  };

  const handleAddElement = () => {
    const newId = `conc-${Date.now()}`;
    const newEl: ConcreteElement = {
      id: newId,
      name: "New Footing / Beam",
      category: "Footings",
      length: 1.0,
      width: 1.0,
      thickness: 0.30,
      quantity: 1,
      concreteMix: "Class A",
      rebarDiameter: 12,
      rebarSpacing: 0.15,
      rebarCountPerElement: 4,
      rebarLength: 6,
      elementWastage: 5
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

  const getSixMeterBarCount = (item: ConcreteElement) => {
    const steel = calculateConcreteRebar(item);
    const mainBars = Math.ceil((steel.mainWeightKg || 0) / (6 * REBAR_KG_PER_M[item.rebarDiameter]));
    const stirrupBars = Math.ceil((steel.stirrupWeightKg || 0) / (6 * REBAR_KG_PER_M[10]));
    return {
      mainBars,
      stirrupBars,
      totalBars: mainBars + stirrupBars
    };
  };

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-xs space-y-6" id="concrete-division-estimator">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-sans font-semibold text-slate-900 text-lg">Division 03 - Reinforced Concrete Estimator</h3>
          <p className="text-xs text-slate-500">Auto-calculates concrete volumes, steel weights, sand/gravel takes, and pricing matrices.</p>
        </div>
        <button
          onClick={handleAddElement}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-9 px-4 rounded-lg flex items-center gap-1.5 transition cursor-pointer font-sans shadow-xs shrink-0 self-start text-nowrap"
          id="btn-add-concrete-item"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Concrete Element
        </button>
      </div>

      {divisionCost && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-800" id="concrete-cost-summary-board">
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
              <th className="px-3 py-2 w-48">ELEMENT DESCRIPTION</th>
              <th className="px-2 py-2">SECTION / DIVISION</th>
              <th className="px-2 py-2 w-16">L (m)</th>
              <th className="px-2 py-2 w-16">W (m)</th>
              <th className="px-2 py-2 w-16">H / T (m)</th>
              <th className="px-2 py-2 w-14">QTY</th>
              <th className="px-3 py-2 w-20 text-center">MIX CLASS</th>
              <th className="px-3 py-2 w-24">STEEL (REF)</th>
              <th className="px-2 py-2 text-right">VOL (cu.m.)</th>
              <th className="px-2 py-2 text-right">MATERIALS</th>
              <th className="px-2 py-2 text-right">6M REBARS</th>
              <th className="px-3 py-2 text-center w-12">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {elements.map((item, index) => {
              const vol = calculateConcreteVolume(item);
              const mats = calculateConcreteMaterials(item);
              const steel = calculateConcreteRebar(item);
              const sixMeterBars = getSixMeterBarCount(item);

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
                      onChange={(e) => handleElementChange(item.id, "category", e.target.value as ConcreteElement["category"])}
                      className="bg-slate-50 border border-slate-150 rounded-md py-1.5 px-2 text-[11px] block text-slate-700 outline-hidden"
                    >
                      <option value="Footings">Footings</option>
                      <option value="Columns">Columns</option>
                      <option value="Beams">Beams</option>
                      <option value="Suspended Slabs">Suspended Slabs</option>
                      <option value="Ground Slabs">Ground Slabs</option>
                      <option value="Stairs">Stairs</option>
                    </select>
                  </td>

                  {/* Length */}
                  <td className="px-2 py-3">
                    <input
                      type="number"
                      step="0.05"
                      value={item.length}
                      onChange={(e) => handleElementChange(item.id, "length", Number(e.target.value) || 0)}
                      className="w-14 bg-amber-50 rounded-md py-1.5 px-1.5 focus:bg-white border border-slate-150 text-right font-mono"
                    />
                  </td>

                  {/* Width */}
                  <td className="px-2 py-3">
                    <DecimalInput
                      value={item.width}
                      step="0.01"
                      onValueChange={(value) => handleElementChange(item.id, "width", value)}
                      className="w-14 bg-amber-50 disabled:bg-slate-100 disabled:opacity-50 rounded-md py-1.5 px-1.5 focus:bg-white border border-slate-150 text-right font-mono"
                    />
                  </td>

                  {/* Thickness */}
                  <td className="px-2 py-3">
                    <input
                      type="number"
                      step="0.01"
                      value={item.thickness}
                      onChange={(e) => handleElementChange(item.id, "thickness", Number(e.target.value) || 0)}
                      className="w-14 bg-amber-50 rounded-md py-1.5 px-1.5 focus:bg-white border border-slate-150 text-right font-mono"
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

                  {/* Concrete Mix */}
                  <td className="px-3 py-3 text-center">
                    <select
                      value={item.concreteMix}
                      onChange={(e) => handleElementChange(item.id, "concreteMix", e.target.value as ConcreteElement["concreteMix"])}
                      className="bg-slate-50 border border-slate-150 rounded-md py-1.5 px-1 text-[11px] block mx-auto text-slate-700 font-medium outline-hidden"
                    >
                      <option value="Class A">Class A (1:2:4)</option>
                      <option value="Class B">Class B (1:2.5:5)</option>
                      <option value="Class C">Class C (1:3:6)</option>
                    </select>
                  </td>

                  {/* Steel specification */}
                  <td className="px-3 py-3">
                    <div className="flex flex-col gap-1">
                      <select
                        value={item.rebarDiameter}
                        onChange={(e) => handleElementChange(item.id, "rebarDiameter", Number(e.target.value) as ConcreteElement["rebarDiameter"])}
                        className="bg-slate-50 border border-slate-150 rounded-md py-1 pl-1 text-[10px] text-slate-700 outline-hidden font-mono"
                      >
                        <option value={10}>Ø10mm main</option>
                        <option value={12}>Ø12mm main</option>
                        <option value={16}>Ø16mm main</option>
                        <option value={20}>Ø20mm main</option>
                        <option value={25}>Ø25mm main</option>
                      </select>
                      
                      {item.category === "Columns" || item.category === "Beams" ? (
                        <input
                          type="number"
                          placeholder="Rebars Qty"
                          value={item.rebarCountPerElement}
                          onChange={(e) => handleElementChange(item.id, "rebarCountPerElement", Number(e.target.value) || 0)}
                          className="w-full bg-slate-50 rounded-md py-0.5 px-1 border border-slate-150 text-[10px]"
                          title="Count of long bars inside columns/beams"
                        />
                      ) : (
                        <input
                          type="number"
                          step="0.05"
                          placeholder="Spacing (m)"
                          value={item.rebarSpacing}
                          onChange={(e) => handleElementChange(item.id, "rebarSpacing", Number(e.target.value) || 0.15)}
                          className="w-full bg-slate-50 rounded-md py-0.5 px-1 border border-slate-150 text-[10px] text-right font-mono"
                          title="Spacing of steel rebar grid grid spacing (meters)"
                        />
                      )}
                    </div>
                  </td>

                  {/* Computed Volume */}
                  <td className="px-2 py-3 text-right font-mono text-slate-900 font-semibold bg-slate-50/50">
                    {vol.toFixed(2)}m³
                  </td>

                  {/* Computed Material Breakdown */}
                  <td className="px-2 py-3 text-right">
                    <div className="text-[10px] space-y-0.5">
                      <p><strong className="text-slate-800">{mats.cementBags}</strong> bags cement</p>
                      <p><strong className="text-slate-800">{mats.sandCubicMeters}</strong>m³ sand</p>
                      <p><strong className="text-slate-800">{mats.gravelCubicMeters}</strong>m³ gravel</p>
                    </div>
                  </td>

                  {/* Steel 6m Bar Quantity */}
                  <td className="px-2 py-3 text-right">
                    <div className="text-[10px] leading-tight text-slate-600 font-mono">
                      <p><strong className="text-slate-800 font-bold">{sixMeterBars.totalBars.toLocaleString("en-US")} pcs</strong> 6m bars</p>
                      <p><strong className="text-slate-800">{steel.totalWeightKg.toLocaleString("en-US", { maximumFractionDigits: 1 })} kg</strong> steel ref.</p>
                      {sixMeterBars.stirrupBars > 0 && (
                        <p><strong className="text-slate-800">{sixMeterBars.mainBars}</strong> main + <strong className="text-slate-800">{sixMeterBars.stirrupBars}</strong> stirrup</p>
                      )}
                      <p><strong className="text-slate-800">{steel.tieWireKg} kg</strong> tie wire</p>
                    </div>
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

      {/* Structural Estimating Guide */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-[11px] text-slate-600 space-y-2 leading-relaxed" id="concrete-division-guide">
        <h4 className="font-sans font-bold text-slate-800 uppercase tracking-wide">PH Estimation Standard Formulas Manual (FAJARDO):</h4>
        <ul className="list-disc pl-5 space-y-1 block">
          <li><strong>Concrete Class A Mix:</strong> Every cubic meter consumes exactly 9.0 bags of 40kg cement, 0.50m³ clean sand, and 1.00m³ gravel (1:2:4 ratio).</li>
          <li><strong>Longitudinal bar weights:</strong> Determined using commercial weights per length: 10mm (0.617 kg/m), 12mm (0.888 kg/m), 16mm (1.578 kg/m), 20mm (2.466 kg/m), 25mm (3.853 kg/m).</li>
          <li><strong>Stirrups & Ties:</strong> Standard columns and beams automatically compute closed stirrups enclosing concrete cross sections with standard 135° anchoring pins, compiled using standard #10 (10mm) rebar lengths.</li>
          <li><strong>Tie Wire takeoff:</strong> Calculated systematically at a conservative factor of 2.0% (0.02 kg per kg) of overall structural reinforcing steel weight.</li>
        </ul>
      </div>

    </div>
  );
}
