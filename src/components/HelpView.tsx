import React, { useState } from "react";
import { HelpCircle, ShieldAlert, Mail, BookOpen, FileText, Check, Info, LockKeyhole, Scale } from "lucide-react";

export default function HelpView() {
  const [supportName, setSupportName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportMsg, setSupportMsg] = useState("");
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSentSuccess(true);
    setSupportName("");
    setSupportEmail("");
    setSupportMsg("");
    setTimeout(() => setSentSuccess(false), 5000);
  };

  return (
    <div className="space-y-6">
      
      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-bold text-slate-900">About Strucforge Estimates Pro v5.0</h2>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          Strucforge Estimates Pro v5.0 is a construction cost estimator for contractors, engineers, architects, foremen, quantity surveyors, estimators, and construction students. It helps prepare project information, material and labor cost breakdowns, saved estimate revisions, printable BOQ reports, and spreadsheet exports.
        </p>
        <p className="text-xs text-slate-500 leading-relaxed">
          App category: Business / Productivity / Construction Tools. Current data storage is local to this device through browser or Android WebView storage.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <LockKeyhole className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-slate-900">Privacy Policy</h2>
        </div>
        <div className="space-y-2 text-sm text-slate-600 leading-relaxed">
          <p>
            Strucforge Estimates Pro v5.0 stores project details, price database edits, calculator inputs, and saved estimate revisions locally on your device. These records are used to restore your estimates and generate reports.
          </p>
          <p>
            The app does not require account sign-in and does not intentionally upload your estimate data to a cloud service in the current packaged app configuration.
          </p>
          <p className="text-xs text-slate-500">
            TODO before Play submission: confirm whether analytics, crash reporting, backend APIs, authentication, cloud storage, advertising SDKs, or remote AI services will be enabled in production. If any are added, update this privacy policy and the Google Play Data Safety form before release.
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-slate-700" />
          <h2 className="text-lg font-bold text-slate-900">Terms of Use</h2>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          By using this app, you agree to review all generated estimates before using them for bidding, procurement, contracts, or construction. You are responsible for validating local rates, quantities, taxes, supplier quotations, and professional requirements for each project.
        </p>
      </div>

      {/* Disclaimer block (COMMERCIAL PLAY STORE REQUIREMENT) */}
      <div className="bg-amber-50 border-l-4 border-amber-500 rounded-r-xl p-4 md:p-5 shadow-xs">
        <div className="flex gap-3">
          <ShieldAlert className="w-5.5 h-5.5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <h3 className="font-bold text-amber-900 text-sm md:text-base">Disclaimer of Accuracy</h3>
            <p className="text-amber-800 text-xs md:text-sm leading-relaxed">
              This app provides construction cost estimates for planning and budgeting purposes only. Final costs may vary depending on site conditions, supplier prices, labor rates, location, waste factors, design changes, supplier quotations, and professional evaluation. Users must verify all estimates before using them for contracts, bidding, procurement, or construction.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* FAQs */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-4 md:p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <BookOpen className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-slate-850 text-base">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-4 text-xs md:text-sm">
            <div className="space-y-1">
              <h4 className="font-semibold text-slate-800">1. How accurate are these construction estimates?</h4>
              <p className="text-slate-600 leading-normal">
                These estimates use standard engineering formulas and average material consumption ratios (Class A, B, C concrete mixes, etc.). However, they should be used as a preliminary baseline. Always adjust unit prices in the <strong>Master Prices DB</strong> to match your local hardware suppliers' quotes.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="font-semibold text-slate-800">2. Are Philippine construction standards compliant?</h4>
              <p className="text-slate-600 leading-normal">
                Yes, our concrete takeoff matches standard DPWH (Department of Public Works and Highways) volume formulas, reinforcement steel bar coefficients (such as rebar weight multiplier ratios), and standard commercial sizes of marine plywood and coco lumber supports used in the Philippines.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="font-semibold text-slate-800">3. How do I export this to my clients?</h4>
              <p className="text-slate-600 leading-normal">
                Head to the <strong>Bill of Quantities (BOQ)</strong> tab for printable reports, or use <strong>Export Excel</strong> on the dashboard. The app generates a styled multi-sheet spreadsheet containing division work sheets with formulas that load in Microsoft Excel or Google Sheets.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="font-semibold text-slate-800">4. Can I use this app offline on my Android device?</h4>
              <p className="text-slate-600 leading-normal">
                Yes! Since the app is built with Capacitor and leverages robust local storage state management, all estimators, calculators, and saved revisions are saved on your phone and work offline. No internet connection is required to make estimates!
              </p>
            </div>
          </div>
        </div>

        {/* Support contact form */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-4 md:p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Mail className="w-5 h-5 text-orange-500" />
            <h3 className="font-bold text-slate-850 text-base">Support / Contact</h3>
          </div>

          <p className="text-xs text-slate-500 leading-normal">
            Need help, want to report a bug, or need to request a correction? Email support@strucforge.com or use this local draft form.
          </p>

          {sentSuccess ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium px-4 py-3 rounded-lg flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Feedback draft submitted locally. Please email support@strucforge.com for support follow-up.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={supportName}
                  onChange={(e) => setSupportName(e.target.value)}
                  placeholder="e.g. Engr. Juan Dela Cruz"
                  className="w-full bg-slate-50 border border-slate-250 text-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  placeholder="e.g. juan@strucforge.com"
                  className="w-full bg-slate-50 border border-slate-250 text-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Inquiry Description</label>
                <textarea
                  rows={3}
                  required
                  value={supportMsg}
                  onChange={(e) => setSupportMsg(e.target.value)}
                  placeholder="Describe your suggestion or technical problem..."
                  className="w-full bg-slate-50 border border-slate-250 text-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-500 text-white font-semibold text-xs py-2 rounded-lg cursor-pointer transition shadow-xs flex items-center justify-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Prepare Support Request</span>
              </button>
            </form>
          )}

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
            <p><strong>Official Website:</strong> https://www.strucforge.com</p>
            <p><strong>Support Email:</strong> support@strucforge.com</p>
            <p className="text-orange-600 font-semibold mt-1">Privacy Summary</p>
            <p className="leading-normal">Estimate data is stored locally on this device unless production services are added later.</p>
          </div>
        </div>

      </div>

    </div>
  );
}
