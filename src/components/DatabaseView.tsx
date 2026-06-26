import React, { useState } from "react";
import { MaterialItem, LaborItem, EquipmentItem } from "../types";
import { Coins, Plus, Trash2, Search, Sliders, HardHat, Bolt, Check, X } from "lucide-react";

interface DatabaseViewProps {
  materials: MaterialItem[];
  labor: LaborItem[];
  equipment: EquipmentItem[];
  onMaterialsChange: (mats: MaterialItem[]) => void;
  onLaborChange: (lab: LaborItem[]) => void;
  onEquipmentChange: (equip: EquipmentItem[]) => void;
}

export default function DatabaseView({
  materials,
  labor,
  equipment,
  onMaterialsChange,
  onLaborChange,
  onEquipmentChange
}: DatabaseViewProps) {
  const [subTab, setNewSubTab] = useState<"materials" | "labor" | "equipment">("materials");
  const [search, setSearch] = useState("");

  // Entry creation states
  const [isAdding, setIsAdding] = useState(false);
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Division 10");
  const [formUnit, setFormUnit] = useState("pc");
  const [formRate, setFormRate] = useState(850);

  const handleSubTabChange = (tab: "materials" | "labor" | "equipment") => {
    setNewSubTab(tab);
    setSearch("");
    setIsAdding(false);
  };

  const handleItemPropertyChange = (id: string, field: string, value: any) => {
    if (subTab === "materials") {
      onMaterialsChange(materials.map(m => m.id === id ? { ...m, [field]: value } : m));
    } else if (subTab === "labor") {
      onLaborChange(labor.map(l => l.id === id ? { ...l, [field]: value } : l));
    } else {
      onEquipmentChange(equipment.map(e => e.id === id ? { ...e, [field]: value } : e));
    }
  };

  const handleStartAdding = () => {
    setIsAdding(true);
    if (subTab === "materials") {
      setFormName("Div 10 Specialty Toilet Partitions");
      setFormCategory("Division 10");
      setFormUnit("set");
      setFormRate(18500);
    } else if (subTab === "labor") {
      setFormName("Div 10 Specialty Craft Installer");
      setFormCategory("");
      setFormUnit("");
      setFormRate(950);
    } else {
      setFormName("Div 10 Heavy Lifting Scaffold Rig");
      setFormCategory("");
      setFormUnit("");
      setFormRate(1200);
    }
  };

  const handleConfirmAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert("Name / Role descriptor is required.");
      return;
    }
    const id = `${subTab === "materials" ? "mat" : subTab === "labor" ? "lab" : "eq"}-custom-${Math.random().toString(36).substr(2, 4)}`;
    
    if (subTab === "materials") {
      const newItem: MaterialItem = {
        id,
        category: formCategory.trim() || "Division 10",
        name: formName.trim(),
        unit: formUnit.trim() || "pc",
        unitPrice: Number(formRate) || 0
      };
      onMaterialsChange([...materials, newItem]);
    } else if (subTab === "labor") {
      const newItem: LaborItem = {
        id,
        role: formName.trim(),
        dailyRate: Number(formRate) || 0
      };
      onLaborChange([...labor, newItem]);
    } else {
      const newItem: EquipmentItem = {
        id,
        name: formName.trim(),
        hourlyRate: Number(formRate) || 0
      };
      onEquipmentChange([...equipment, newItem]);
    }

    // Reset Form
    setIsAdding(false);
    setFormName("");
    setFormCategory("Division 10");
    setFormUnit("pc");
    setFormRate(850);
  };

  const handleDelete = (id: string) => {
    if (subTab === "materials") {
      onMaterialsChange(materials.filter(m => m.id !== id));
    } else if (subTab === "labor") {
      onLaborChange(labor.filter(l => l.id !== id));
    } else {
      onEquipmentChange(equipment.filter(e => e.id !== id));
    }
  };

  // Filter items
  const filteredMaterials = materials.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );
  
  const filteredLabor = labor.filter(l =>
    l.role.toLowerCase().includes(search.toLowerCase())
  );

  const filteredEquipment = equipment.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6" id="database-manager">
      
      {/* 1. Header and Selector tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-sans font-bold text-slate-900 text-lg">Estimating Rates Master Database</h3>
          <p className="text-xs text-slate-500">Live rate sheet for materials, labor guilds, and equipment leases across the Philippine market.</p>
        </div>

        {/* Categories togglers */}
        <div className="flex bg-slate-100 border border-slate-200 rounded-lg p-0.5 text-xs font-semibold self-start font-sans">
          <button
            onClick={() => handleSubTabChange("materials")}
            className={`px-3 py-1.5 rounded-md transition cursor-pointer ${subTab === "materials" ? "bg-white text-orange-600 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"}`}
          >
            Materials (PHP)
          </button>
          <button
            onClick={() => handleSubTabChange("labor")}
            className={`px-3 py-1.5 rounded-md transition cursor-pointer ${subTab === "labor" ? "bg-white text-orange-600 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"}`}
          >
            Labor Rates (PHP)
          </button>
          <button
            onClick={() => handleSubTabChange("equipment")}
            className={`px-3 py-1.5 rounded-md transition cursor-pointer ${subTab === "equipment" ? "bg-white text-orange-600 shadow-xs font-bold" : "text-slate-600 hover:text-slate-900"}`}
          >
            Machinery Rental (PHP)
          </button>
        </div>
      </div>

      {/* 2. Controller Filters Row */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-450" />
          <input
            type="text"
            placeholder={`Search standard ${subTab}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-orange-500 rounded-lg py-2 pl-9 pr-4 text-sm text-slate-800 outline-hidden transition font-sans"
          />
        </div>
        {!isAdding && (
          <button
            onClick={handleStartAdding}
            className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold h-9 px-4 rounded-lg flex items-center gap-1.5 transition cursor-pointer font-sans shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Item
          </button>
        )}
      </div>

      {/* 3. New Entry Creation Drawer Form */}
      {isAdding && (
        <form onSubmit={handleConfirmAdd} className="bg-orange-50/70 border border-orange-200 rounded-xl p-4 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-orange-100 pb-2">
            <h4 className="text-xs font-bold font-sans text-orange-700 uppercase tracking-widest flex items-center gap-1.5">
              <Plus className="w-4 h-4" />
              Specify New {subTab === "materials" ? "Material Quantity" : subTab === "labor" ? "Labor Specialty Team" : "Equipment Rental Block"}
            </h4>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            {/* Field A: Name or Role */}
            <div className="md:col-span-2 space-y-1 block">
              <label className="font-bold text-slate-700 block">
                {subTab === "materials" ? "Material Item Description / Spec" : subTab === "labor" ? "Labor Role Title" : "Equipment Unit Name"}
              </label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder={subTab === "materials" ? "e.g. Toilet Partitions PH Phenolic" : subTab === "labor" ? "e.g. Specialist Partition Installer" : "e.g. Scissor Lift 10m platform"}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 font-sans text-slate-800 outline-hidden focus:border-orange-500"
              />
            </div>

            {/* Field B: Category / Unit */}
            {subTab === "materials" ? (
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1 block">
                  <label className="font-bold text-slate-700 block">Category</label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-white border border-slate-250 rounded-lg p-2 font-sans outline-hidden focus:border-orange-500"
                  />
                </div>
                <div className="space-y-1 block">
                  <label className="font-bold text-slate-700 block">Unit</label>
                  <input
                    type="text"
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full bg-white border border-slate-250 rounded-lg p-2 font-sans outline-hidden focus:border-orange-500"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1 block">
                <label className="font-bold text-slate-700 block">Base Reference Metric</label>
                <div className="p-2 border border-slate-250 rounded-lg bg-orange-50/40 text-slate-650 italic font-sans">
                  {subTab === "labor" ? "8-Hour Standard Shift" : "Lease Hour status"}
                </div>
              </div>
            )}

            {/* Field C: Cost / Rate */}
            <div className="space-y-1 block">
              <label className="font-bold text-slate-700 block">
                {subTab === "materials" ? "Unit Price (PHP)" : subTab === "labor" ? "Daily Shift Rate (PHP)" : "Hourly Rental Rate (PHP)"}
              </label>
              <input
                type="number"
                min="0"
                required
                value={formRate}
                onChange={(e) => setFormRate(Number(e.target.value) || 0)}
                className="w-full bg-white border border-slate-250 rounded-lg p-2 font-sans font-bold outline-hidden focus:border-orange-500 text-slate-900"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition cursor-pointer font-sans font-semibold text-xs text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg transition font-sans font-bold text-xs flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              Save Item
            </button>
          </div>
        </form>
      )}

      {/* 4. Interactive Tables with Editable Cells inline */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg shadow-inner bg-white">
        {subTab === "materials" && (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold h-9 font-sans uppercase">
                <th className="px-4 py-2 w-28">CODE</th>
                <th className="px-4 py-2 w-44">CATEGORY GROUP</th>
                <th className="px-4 py-2">MATERIAL DESCRIPTION (IN-TABLE EDITABLE)</th>
                <th className="px-4 py-2 w-24">UNIT</th>
                <th className="px-4 py-2 text-right w-36">UNIT PRICE (PHP)</th>
                <th className="px-4 py-2 text-center w-16">DELETE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMaterials.map((mat) => (
                <tr key={mat.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-2.5 font-mono text-slate-400 select-all">{mat.id}</td>
                  <td className="px-4 py-2.5 text-slate-500 italic">
                    <input
                      type="text"
                      value={mat.category}
                      onChange={(e) => handleItemPropertyChange(mat.id, "category", e.target.value)}
                      className="w-full bg-transparent hover:bg-slate-100 focus:bg-white border-b border-transparent focus:border-slate-300 rounded px-1.5 py-1 focus:outline-hidden text-slate-600"
                    />
                  </td>
                  <td className="px-4 py-2.5 font-sans text-slate-800">
                    <input
                      type="text"
                      value={mat.name}
                      onChange={(e) => handleItemPropertyChange(mat.id, "name", e.target.value)}
                      className="w-full bg-transparent hover:bg-slate-100 focus:bg-white border-b border-transparent focus:border-slate-300 rounded px-1.5 py-1 focus:outline-hidden font-medium text-slate-900"
                    />
                  </td>
                  <td className="px-4 py-2.5">
                    <input
                      type="text"
                      value={mat.unit}
                      onChange={(e) => handleItemPropertyChange(mat.id, "unit", e.target.value)}
                      className="w-16 bg-transparent hover:bg-slate-100 focus:bg-white border-b border-transparent focus:border-slate-300 rounded px-1.5 py-1 focus:outline-hidden text-slate-800 font-medium"
                    />
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono">
                    <input
                      type="number"
                      value={mat.unitPrice}
                      onChange={(e) => handleItemPropertyChange(mat.id, "unitPrice", Number(e.target.value) || 0)}
                      className="w-24 bg-amber-50 focus:bg-white text-right border border-slate-200 rounded-md py-1 px-2 focus:border-orange-500 text-[11px] font-bold text-slate-900"
                    />
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <button
                      onClick={() => handleDelete(mat.id)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded-md transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {subTab === "labor" && (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold h-9 font-sans uppercase">
                <th className="px-4 py-2 w-28">CODE</th>
                <th className="px-4 py-2">LABOR GUILD ROLE (IN-TABLE EDITABLE)</th>
                <th className="px-4 py-2 w-48">SHIFT REGIME</th>
                <th className="px-4 py-2 text-right w-44">DAILY COST (PHP / 8-HR)</th>
                <th className="px-4 py-2 text-center w-16">DELETE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLabor.map((lab) => (
                <tr key={lab.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-2.5 font-mono text-slate-400 select-all">{lab.id}</td>
                  <td className="px-4 py-2.5 font-sans text-slate-800">
                    <input
                      type="text"
                      value={lab.role}
                      onChange={(e) => handleItemPropertyChange(lab.id, "role", e.target.value)}
                      className="w-full bg-transparent hover:bg-slate-100 focus:bg-white border-b border-transparent focus:border-slate-300 rounded px-1.5 py-1 focus:outline-hidden font-semibold text-slate-900"
                    />
                  </td>
                  <td className="px-4 py-2.5 text-slate-500 select-none">8-Hour standard shift</td>
                  <td className="px-4 py-2.5 text-right font-mono">
                    <input
                      type="number"
                      value={lab.dailyRate}
                      onChange={(e) => handleItemPropertyChange(lab.id, "dailyRate", Number(e.target.value) || 0)}
                      className="w-32 bg-amber-50 focus:bg-white text-right border border-slate-200 rounded-md py-1 px-2 focus:border-orange-500 text-[11px] font-bold text-slate-900"
                    />
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <button
                      onClick={() => handleDelete(lab.id)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded-md transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {subTab === "equipment" && (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold h-9 font-sans uppercase">
                <th className="px-4 py-2 w-28">CODE</th>
                <th className="px-4 py-2">HEAVY EQUIPMENT UNIT (IN-TABLE EDITABLE)</th>
                <th className="px-4 py-2 w-64 font-sans">LEASE UNIT METRIC</th>
                <th className="px-4 py-2 text-right w-44">HOURLY LEASE RATE (PHP)</th>
                <th className="px-4 py-2 text-center w-16">DELETE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEquipment.map((eq) => (
                <tr key={eq.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-2.5 font-mono text-slate-400 select-all">{eq.id}</td>
                  <td className="px-4 py-2.5 font-sans text-slate-800">
                    <input
                      type="text"
                      value={eq.name}
                      onChange={(e) => handleItemPropertyChange(eq.id, "name", e.target.value)}
                      className="w-full bg-transparent hover:bg-slate-100 focus:bg-white border-b border-transparent focus:border-slate-300 rounded px-1.5 py-1 focus:outline-hidden font-semibold text-slate-900"
                    />
                  </td>
                  <td className="px-4 py-2.5 text-slate-550 select-none">Per leasing hour (with fuel + operator)</td>
                  <td className="px-4 py-2.5 text-right font-mono">
                    <input
                      type="number"
                      value={eq.hourlyRate}
                      onChange={(e) => handleItemPropertyChange(eq.id, "hourlyRate", Number(e.target.value) || 0)}
                      className="w-32 bg-amber-50 focus:bg-white text-right border border-slate-200 rounded-md py-1 px-2 focus:border-orange-500 text-[11px] font-bold text-slate-900"
                    />
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <button
                      onClick={() => handleDelete(eq.id)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded-md transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
