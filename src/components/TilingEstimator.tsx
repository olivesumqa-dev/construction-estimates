import React from "react";
import { TileElement, MaterialItem, DivisionCost } from "../types";
import { Plus, Trash2, HelpCircle } from "lucide-react";
import { calculateTileMaterials } from "../utils/calculations";

interface TilingEstimatorProps {
  elements: TileElement[];
  materials: MaterialItem[];
  onChange: (elements: TileElement[]) => void;
  divisionCost?: DivisionCost;
}

export default function TilingEstimator({ elements, materials, onChange, divisionCost }: TilingEstimatorProps) {
  
  const handleElementChange = <K extends keyof TileElement>(id: string, key: K, val: TileElement[K]) => {
    onChange(elements.map(item => item.id === id ? { ...item, [key]: val } : item));
  };

  const handleAddElement = () => {
    const newId = `tile-${Date.now()}`;
    const newEl: TileElement = {
      id: newId,
      name: "New Guest Bathroom Tiles",
      type: "Floor",
      tileSize: "60x60 cm",
      lengthOrArea: 15.0,
      wastagePercent: 10
    };
    onChange([...elements, newEl]);
  };

  const handleDeleteElement = (id: string) => {
    onChange(elements.filter(item => item.id !== id));
  };

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-xs space-y-6" id="tiling-division-estimator">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-sans font-semibold text-slate-900 text-lg">Division 09A - Interior & Exterior Tiling Estimator</h3>
          <p className="text-xs text-slate-500">Calculates tile pieces bases on surface sizes, waste factors, tile adhesives, joint grout bags, and edge trims.</p>
        </div>
        <button
          onClick={handleAddElement}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold h-9 px-4 rounded-lg flex items-center gap-1.5 transition cursor-pointer font-sans shadow-xs shrink-0 self-start text-nowrap"
          id="btn-add-tiling-item"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Tiling Area
        </button>
      </div>

      {divisionCost && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 border border-slate-200 p-4 rounded-xl text-slate-800" id="tiling-cost-summary-board">
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
              <th className="px-3 py-2 w-52">TILING PLACEMENT LOCATION</th>
              <th className="px-2 py-2">TILE SIZE</th>
              <th className="px-2 py-2">PLACEMENT TYPE</th>
              <th className="px-2 py-2 w-28">INPUT AREA (sqm)</th>
              <th className="px-2 py-2 w-20 text-center">WASTE (%)</th>
              <th className="px-2 py-2 text-right">TILES REQUIRED</th>
              <th className="px-2 py-2 text-right">ADHESIVE (bags)</th>
              <th className="px-2 py-2 text-right">GROUT (bags)</th>
              <th className="px-2 py-2 text-right">CORNER TRIMS</th>
              <th className="px-3 py-2 text-center w-12">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {elements.map((item) => {
              const mats = calculateTileMaterials(item);
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

                  {/* Tile Size */}
                  <td className="px-2 py-3">
                    <select
                      value={item.tileSize}
                      onChange={(e) => handleElementChange(item.id, "tileSize", e.target.value as TileElement["tileSize"])}
                      className="bg-slate-50 border border-slate-150 rounded-md py-1.5 px-2 text-[11px] block text-slate-700 font-medium outline-hidden"
                    >
                      <option value="30x30 cm">30 x 30 cm</option>
                      <option value="40x40 cm">40 x 40 cm</option>
                      <option value="60x60 cm">60 x 60 cm (Porcelain)</option>
                      <option value="80x80 cm">80 x 80 cm (Porcelain)</option>
                    </select>
                  </td>

                  {/* Type */}
                  <td className="px-2 py-3">
                    <select
                      value={item.type}
                      onChange={(e) => handleElementChange(item.id, "type", e.target.value as TileElement["type"])}
                      className="bg-slate-50 border border-slate-150 rounded-md py-1.5 px-1.5 text-[11px] block text-slate-700 outline-hidden font-medium"
                    >
                      <option value="Floor">Floor Areas</option>
                      <option value="Wall">Bathroom Walls</option>
                      <option value="Stairs">Stair Treads</option>
                    </select>
                  </td>

                  {/* Area */}
                  <td className="px-2 py-3">
                    <input
                      type="number"
                      step="0.5"
                      value={item.lengthOrArea}
                      onChange={(e) => handleElementChange(item.id, "lengthOrArea", Number(e.target.value) || 0)}
                      className="w-20 bg-amber-50 rounded-md py-1.5 px-1.5 focus:bg-white border border-slate-150 text-right font-mono font-bold"
                    />
                  </td>

                  {/* Wastage */}
                  <td className="px-2 py-3 text-center">
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={item.wastagePercent}
                      onChange={(e) => handleElementChange(item.id, "wastagePercent", Number(e.target.value) || 0)}
                      className="w-14 bg-amber-50 rounded-md py-1.5 px-1.5 focus:bg-white border border-slate-150 text-center font-mono"
                    />
                  </td>

                  {/* Tile Count */}
                  <td className="px-2 py-3 text-right font-mono text-slate-900 font-semibold bg-slate-50/50">
                    {mats.tileCount} pcs
                  </td>

                  {/* Adhesive Bags */}
                  <td className="px-2 py-3 text-right font-mono text-slate-800">
                    {mats.adhesiveBags} bags
                  </td>

                  {/* Grout Bags */}
                  <td className="px-2 py-3 text-right font-mono text-slate-600">
                    {mats.groutBags} bags
                  </td>

                  {/* Corner Trims */}
                  <td className="px-2 py-3 text-right font-mono text-slate-500">
                    {item.type === "Wall" ? `${mats.trimsQty} pcs` : "--"}
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

      {/* Manual details */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-[11px] text-slate-600 space-y-2 leading-relaxed" id="tiling-division-guide">
        <h4 className="font-sans font-bold text-slate-800 uppercase tracking-wide">PH Standard Tiling takeoff specifications:</h4>
        <ul className="list-disc pl-5 space-y-1 block">
          <li><strong>Tile waste margin:</strong> Recommended at exactly 10.0% to allow for cutting bounds, broken edges, or pattern fitting around door corners.</li>
          <li><strong>Adhesive standard dosage:</strong> Standard tile adhesive bags weighing 25kg cover approximately 4.5 sqm of flat mortar beds.</li>
          <li><strong>Grout standard dosage:</strong> Standard 2kg bags of tile joint grout powder cover approximately 4.0 sqm of tiled flooring.</li>
        </ul>
      </div>

    </div>
  );
}
