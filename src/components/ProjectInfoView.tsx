import React from "react";
import { ProjectInfo } from "../types";
import { Sliders, HelpCircle, FileText, Globe, User, Landmark, Percent } from "lucide-react";

interface ProjectInfoViewProps {
  projectInfo: ProjectInfo;
  onChange: (info: ProjectInfo) => void;
}

export default function ProjectInfoView({ projectInfo, onChange }: ProjectInfoViewProps) {
  const handleInputChange = (field: keyof ProjectInfo, val: string | number) => {
    let parsed: string | number = val;
    if (typeof projectInfo[field] === "number") {
      parsed = Number(val) || 0;
    }
    onChange({
      ...projectInfo,
      [field]: parsed
    });
  };

  return (
    <div className="bg-white border border-slate-100 rounded-xl p-6 shadow-xs space-y-6" id="project-configuration-form">
      <div>
        <h3 className="font-sans font-semibold text-slate-900 text-lg">Project Profiler & Indirect Markups</h3>
        <p className="text-xs text-slate-500">Define the engineering metadata, building physical size, and profit margin multipliers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
        
        {/* Box 1: General Metadata */}
        <div className="space-y-4">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wide block">1. Operational Metadata</span>
          
          <div className="space-y-1 block">
            <label className="text-xs text-slate-700 font-medium block">Proposed Project Title</label>
            <div className="relative">
              <FileText className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={projectInfo.projectName}
                onChange={(e) => handleInputChange("projectName", e.target.value)}
                className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-hidden transition font-sans"
              />
            </div>
          </div>

          <div className="space-y-1 block">
            <label className="text-xs text-slate-700 font-medium block">Client Name / Developer</label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={projectInfo.clientName}
                onChange={(e) => handleInputChange("clientName", e.target.value)}
                className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-hidden transition font-sans"
              />
            </div>
          </div>

          <div className="space-y-1 block">
            <label className="text-xs text-slate-700 font-medium block">Project Location Address</label>
            <div className="relative">
              <Globe className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={projectInfo.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-hidden transition font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1 block">
              <label className="text-xs text-slate-700 font-medium block">Contract Estimator / QS</label>
              <input
                type="text"
                value={projectInfo.estimator}
                onChange={(e) => handleInputChange("estimator", e.target.value)}
                className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg py-2.5 px-4 text-sm text-slate-800 outline-hidden transition font-sans"
              />
            </div>
            <div className="space-y-1 block">
              <label className="text-xs text-slate-700 font-medium block">Building Floor Area (sq.m.)</label>
              <input
                type="number"
                value={projectInfo.floorArea}
                onChange={(e) => handleInputChange("floorArea", e.target.value)}
                className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg py-2.5 px-4 text-sm text-slate-800 outline-hidden transition font-sans font-mono"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-3">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Company Letterhead Branding (Print Preview)</span>
            
            <div className="space-y-1 block">
              <label className="text-xs text-slate-700 font-medium block">Company Letterhead Name</label>
              <input
                type="text"
                placeholder="e.g. O.A.S. CONSTRUCTION GROUP"
                value={projectInfo.companyName || ""}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg py-2 pl-3 pr-3 text-sm text-slate-800 outline-hidden transition font-sans"
              />
            </div>

            <div className="space-y-1 block">
              <label className="text-xs text-slate-700 font-medium block">Company Tagline / Subtitle</label>
              <input
                type="text"
                placeholder="e.g. Professional Quantity Surveying & Structural Takeoff Solutions"
                value={projectInfo.companySubtitle || ""}
                onChange={(e) => handleInputChange("companySubtitle", e.target.value)}
                className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-lg py-2 pl-3 pr-3 text-sm text-slate-800 outline-hidden transition font-sans"
              />
            </div>
          </div>
        </div>

        {/* Box 2: Markups Sliders */}
        <div className="space-y-4">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wide block">2. Indirect Costs & Profit Markups (%)</span>

          <div className="space-y-3">
            
            {/* Overhead Markup */}
            <div className="space-y-1 block">
              <div className="flex justify-between text-xs text-slate-700 font-medium">
                <span className="flex items-center gap-1">
                  Overhead Costs & Administration
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help" title="Office rent, admin staff salaries, field supervision" />
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={projectInfo.overheadPercent}
                    onChange={(e) => handleInputChange("overheadPercent", e.target.value)}
                    className="w-20 bg-slate-50 border border-slate-200 rounded-md py-1 px-2 text-right font-mono text-blue-700 outline-hidden focus:border-blue-500"
                  />
                  <span className="font-mono text-blue-600 font-bold">%</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="0.5"
                value={projectInfo.overheadPercent}
                onChange={(e) => handleInputChange("overheadPercent", e.target.value)}
                className="w-full h-1.5 bg-slate-150 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Contingency */}
            <div className="space-y-1 block">
              <div className="flex justify-between text-xs text-slate-700 font-medium">
                <span className="flex items-center gap-1">
                  Contingency Reserves
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help" title="Mitigates unforeseen site delays, bad weather, or custom changes" />
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={projectInfo.contingencyPercent}
                    onChange={(e) => handleInputChange("contingencyPercent", e.target.value)}
                    className="w-20 bg-slate-50 border border-slate-200 rounded-md py-1 px-2 text-right font-mono text-blue-700 outline-hidden focus:border-blue-500"
                  />
                  <span className="font-mono text-blue-600 font-bold">%</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={projectInfo.contingencyPercent}
                onChange={(e) => handleInputChange("contingencyPercent", e.target.value)}
                className="w-full h-1.5 bg-slate-150 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Contractor Profit */}
            <div className="space-y-1 block">
              <div className="flex justify-between text-xs text-slate-700 font-medium">
                <span className="flex items-center gap-1">
                  Contractor Profit Margin des.
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={projectInfo.profitPercent}
                    onChange={(e) => handleInputChange("profitPercent", e.target.value)}
                    className="w-20 bg-slate-50 border border-slate-200 rounded-md py-1 px-2 text-right font-mono text-blue-700 outline-hidden focus:border-blue-500"
                  />
                  <span className="font-mono text-blue-600 font-bold">%</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="0.5"
                value={projectInfo.profitPercent}
                onChange={(e) => handleInputChange("profitPercent", e.target.value)}
                className="w-full h-1.5 bg-slate-150 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Mobilization */}
            <div className="space-y-1 block">
              <div className="flex justify-between text-xs text-slate-700 font-medium">
                <span className="flex items-center gap-1">
                  Mobilization / Demobilization logistics
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={projectInfo.mobilizationPercent}
                    onChange={(e) => handleInputChange("mobilizationPercent", e.target.value)}
                    className="w-20 bg-slate-50 border border-slate-200 rounded-md py-1 px-2 text-right font-mono text-blue-700 outline-hidden focus:border-blue-500"
                  />
                  <span className="font-mono text-blue-600 font-bold">%</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={projectInfo.mobilizationPercent}
                onChange={(e) => handleInputChange("mobilizationPercent", e.target.value)}
                className="w-full h-1.5 bg-slate-150 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* VAT */}
            <div className="space-y-1 block">
              <div className="flex justify-between text-xs text-slate-700 font-medium">
                <span className="flex items-center gap-1">
                  Philippine Value Added Tax (VAT)
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={projectInfo.vatPercent}
                    onChange={(e) => handleInputChange("vatPercent", e.target.value)}
                    className="w-20 bg-slate-50 border border-slate-200 rounded-md py-1 px-2 text-right font-mono text-blue-700 outline-hidden focus:border-blue-500"
                  />
                  <span className="font-mono text-blue-600 font-bold">%</span>
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="1"
                value={projectInfo.vatPercent}
                onChange={(e) => handleInputChange("vatPercent", e.target.value)}
                className="w-full h-1.5 bg-slate-150 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

          </div>
        </div>

      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 text-xs text-blue-700" id="project-configuration-tip">
        <Sliders className="w-5 h-5 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Quantity Estimator Tip:</strong> Overhead and profits are computed compounding on the total direct cost, while the standard Philippine VAT is subsequently applied as a 12% indirect tax over the gross subtotal to comply with local BIR guidelines. Adjusting these values propagates live across the spreadsheet engine.
        </p>
      </div>
    </div>
  );
}
