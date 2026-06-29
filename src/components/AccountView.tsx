import React, { useState, useEffect } from "react";
import { User, Shield, Key, Heart, Award, FileText, Check, Settings, Briefcase, RefreshCw } from "lucide-react";
import { ProjectInfo, DivisionTotals } from "../types";

interface AccountViewProps {
  projectInfo: ProjectInfo;
  divisionTotals: DivisionTotals;
  onChangeProjectInfo: (info: ProjectInfo) => void;
  onResetAll: () => void;
}

export default function AccountView({
  projectInfo,
  divisionTotals,
  onChangeProjectInfo,
  onResetAll
}: AccountViewProps) {
  const [profileName, setProfileName] = useState(projectInfo.estimator || "Engr. Juan Dela Cruz");
  const [companyName, setCompanyName] = useState(projectInfo.companyName || "O.A.S. CONSTRUCTION GROUP");
  const [companySubtitle, setCompanySubtitle] = useState(projectInfo.companySubtitle || "Professional Quantity Surveying & Structural Takeoff Solutions");
  const [licenseNo, setLicenseNo] = useState("PRC-CIVIL-0129481");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setProfileName(projectInfo.estimator || "Engr. Juan Dela Cruz");
    setCompanyName(projectInfo.companyName || "O.A.S. CONSTRUCTION GROUP");
    setCompanySubtitle(projectInfo.companySubtitle || "Professional Quantity Surveying & Structural Takeoff Solutions");
  }, [projectInfo.estimator, projectInfo.companyName, projectInfo.companySubtitle]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onChangeProjectInfo({
      ...projectInfo,
      estimator: profileName,
      companyName,
      companySubtitle
    });
    setSuccess("Professional profile successfully saved and integrated!");
    setTimeout(() => setSuccess(""), 4000);
  };

  const directSum = Object.values(divisionTotals).reduce((a, b) => a + b.total, 0);

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold shrink-0 text-lg">
          {profileName.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-850 flex items-center gap-1.5">
            Estimator Profile & Settings
          </h2>
          <p className="text-xs text-slate-500">
            Manage your professional license header, credentials, and app preferences.
          </p>
        </div>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium px-4 py-3 rounded-lg flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Estimator Details Form */}
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <User className="w-4 h-4 text-slate-400" />
            Estimator Details
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Professional Full Name</label>
              <input
                type="text"
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-850 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Company / Organization</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-850 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Company Header Subtitle</label>
              <input
                type="text"
                value={companySubtitle}
                onChange={(e) => setCompanySubtitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-850 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">PRC License Number (Optional)</label>
              <input
                type="text"
                value={licenseNo}
                onChange={(e) => setLicenseNo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-850 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs py-2 rounded-lg cursor-pointer transition shadow-xs flex items-center justify-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Update Profile Header</span>
          </button>
        </form>

        {/* Workspace Quick Stats */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-slate-400" />
            Active Session Statistics
          </h3>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Current Project</span>
              <p className="font-extrabold text-slate-800 text-base mt-1 truncate">{projectInfo.projectName || "House Temp"}</p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Subtotal Sum</span>
              <p className="font-extrabold text-orange-600 text-base mt-1">₱{directSum.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">System Information</span>
            <div className="text-xs text-slate-650 space-y-1.5">
              <div className="flex justify-between">
                <span>App Runtime:</span>
                <span className="font-mono text-slate-800">Capacitor Android Hybrid</span>
              </div>
              <div className="flex justify-between">
                <span>Local Engine:</span>
                <span className="font-mono text-slate-800">Vite React TS v6.0</span>
              </div>
              <div className="flex justify-between">
                <span>Database Sync:</span>
                <span className="font-mono text-emerald-600">Local Offline Persistent</span>
              </div>
            </div>
          </div>

          {/* Reset App data */}
          <div className="pt-3">
            <button
              type="button"
              onClick={onResetAll}
              className="w-full bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs py-2 rounded-lg cursor-pointer transition border border-red-200 flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Full Factory Reset Database</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
