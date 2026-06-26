import React, { useState, useEffect } from "react";
import { FolderGit2, Trash2, Check, Save, Calendar, FileText, Download, ArrowUpRight } from "lucide-react";
import { ProjectInfo, MaterialItem, LaborItem, EquipmentItem, ConcreteElement, FormworkElement, CHBWallElement, TileElement, DoorWindowElement, RoofingElement, PaintingElement } from "../types";

export interface SavedEstimate {
  id: string;
  name: string;
  dateSaved: string;
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
}

interface SavedEstimatesViewProps {
  currentProjectInfo: ProjectInfo;
  currentMaterials: MaterialItem[];
  currentLabor: LaborItem[];
  currentEquipment: EquipmentItem[];
  currentConcrete: ConcreteElement[];
  currentFormworks: FormworkElement[];
  currentChb: CHBWallElement[];
  currentTiles: TileElement[];
  currentDoorsWindows: DoorWindowElement[];
  currentRoofing: RoofingElement[];
  currentPainting: PaintingElement[];
  onLoadEstimate: (est: SavedEstimate) => void;
}

export default function SavedEstimatesView({
  currentProjectInfo,
  currentMaterials,
  currentLabor,
  currentEquipment,
  currentConcrete,
  currentFormworks,
  currentChb,
  currentTiles,
  currentDoorsWindows,
  currentRoofing,
  currentPainting,
  onLoadEstimate
}: SavedEstimatesViewProps) {
  const [savedList, setSavedList] = useState<SavedEstimate[]>([]);
  const [newSaveName, setNewSaveName] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const list = localStorage.getItem("strucforge_saved_estimates");
    if (list) {
      try {
        setSavedList(JSON.parse(list));
      } catch (e) {
        console.error("Error loading saved estimates list", e);
      }
    }
  }, []);

  const saveCurrentEstimate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSaveName.trim()) return;

    const newEst: SavedEstimate = {
      id: "est-" + Date.now(),
      name: newSaveName.trim(),
      dateSaved: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }),
      projectInfo: currentProjectInfo,
      materials: currentMaterials,
      labor: currentLabor,
      equipment: currentEquipment,
      concrete: currentConcrete,
      formworks: currentFormworks,
      chb: currentChb,
      tiles: currentTiles,
      doorsWindows: currentDoorsWindows,
      roofing: currentRoofing,
      painting: currentPainting
    };

    const updated = [newEst, ...savedList];
    setSavedList(updated);
    localStorage.setItem("strucforge_saved_estimates", JSON.stringify(updated));
    setNewSaveName("");
    setSuccessMsg("Estimate successfully saved to local database!");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const deleteEstimate = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the saved estimate "${name}"?`)) {
      const updated = savedList.filter(item => item.id !== id);
      setSavedList(updated);
      localStorage.setItem("strucforge_saved_estimates", JSON.stringify(updated));
    }
  };

  const loadEstimate = (est: SavedEstimate) => {
    if (window.confirm(`Load "${est.name}"? This will overwrite your current unsaved estimating inputs with this saved version.`)) {
      onLoadEstimate(est);
      setSuccessMsg(`"${est.name}" loaded successfully!`);
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-850 flex items-center gap-2">
            <FolderGit2 className="w-5.5 h-5.5 text-orange-500" />
            Local Estimates Database
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Save multiple variants of cost estimates locally. Perfect for comparing revisions.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium px-4 py-3 rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Save Form */}
      <form onSubmit={saveCurrentEstimate} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Save Current Active Blueprint
        </h3>
        <div className="flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            required
            placeholder="e.g. 2-Storey House Rev B (Added Balcony)"
            value={newSaveName}
            onChange={(e) => setNewSaveName(e.target.value)}
            className="flex-1 bg-white border border-slate-300 text-slate-850 rounded-lg px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-500 text-white font-semibold text-sm px-5 py-2 rounded-lg cursor-pointer transition-colors flex items-center justify-center gap-2 shadow-xs shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>Save Estimate</span>
          </button>
        </div>
      </form>

      {/* Saved list */}
      <div className="space-y-3.5">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          Saved Revisions & Profiles ({savedList.length})
        </h3>

        {savedList.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-650 font-medium">No saved estimates yet</p>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto px-4">
              Use the form above to name and store your current calculations under multiple presets.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedList.map((item) => (
              <div key={item.id} className="border border-slate-200 rounded-xl p-4 bg-white hover:shadow-xs transition flex flex-col justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-800 text-sm line-clamp-1">{item.name}</span>
                    <button
                      type="button"
                      onClick={() => deleteEstimate(item.id, item.name)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded-sm cursor-pointer transition-colors"
                      title="Delete saved revision"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-xs text-slate-500 space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Saved on: {item.dateSaved}</span>
                    </div>
                    <div>
                      Project: <span className="text-slate-700 font-medium">{item.projectInfo?.projectName || "Unnamed"}</span>
                    </div>
                    <div>
                      Client: <span className="text-slate-700 font-medium">{item.projectInfo?.clientName || "N/A"}</span>
                    </div>
                    <div>
                      Floor Area: <span className="text-slate-700 font-medium">{item.projectInfo?.floorArea} sqm</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => loadEstimate(item)}
                  className="w-full mt-2 bg-slate-100 hover:bg-slate-200 text-slate-750 font-bold text-xs py-2 rounded-lg cursor-pointer transition flex items-center justify-center gap-1.5 border border-slate-250"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Restore Active Workspace</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
