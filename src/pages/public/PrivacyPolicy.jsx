import React from "react";
import { ShieldCheck, Eye, Lock, FileText, Smartphone, BellRing } from "lucide-react";

const sections = [
  {
    title: "Data Collection",
    icon: <Eye className="text-blue-600" size={24} />,
    content: "We collect personal information such as your name, contact details, and medical history specifically to facilitate appointment bookings and digital prescriptions."
  },
  {
    title: "Medical Privacy",
    icon: <Lock className="text-emerald-500" size={24} />,
    content: "Your health records are encrypted. We comply with standard healthcare data regulations to ensure your sensitive clinical information remains between you and your doctor."
  },
  {
    title: "Device Permissions",
    icon: <Smartphone className="text-purple-500" size={24} />,
    content: "Our mobile portal may request access to your notifications for appointment reminders and camera access for profile photo uploads."
  }
];

export default function PrivacyPolicy() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* --- Header Section --- */}
      <section className="bg-white border-b border-slate-100 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex p-3 bg-blue-50 rounded-2xl text-blue-600 mb-6">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">
            Last Updated: April 2026
          </p>
        </div>
      </section>

      {/* --- Content Section --- */}
      <section className="py-16 max-w-4xl mx-auto px-6">
        <div className="grid gap-8">
          {/* Main Highlights */}
          <div className="grid md:grid-cols-3 gap-6">
            {sections.map((sec, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm transition-hover hover:shadow-md">
                <div className="mb-4">{sec.icon}</div>
                <h3 className="font-black text-slate-900 mb-2">{sec.title}</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{sec.content}</p>
              </div>
            ))}
          </div>

          {/* Detailed Text Block */}
          <div className="bg-white p-10 md:p-16 rounded-[3rem] border border-slate-200 space-y-10">
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <FileText className="text-blue-600" /> 1. Information Usage
              </h2>
              <p className="text-slate-600 font-medium leading-relaxed">
                Health Portal uses your data to provide a personalized medical experience. This includes matching you with the right specialists based on your location and clinical requirements. We do not sell your personal data to third-party advertisers.
              </p>
            </div>

            <div className="space-y-4 border-t border-slate-50 pt-10">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <BellRing className="text-amber-500" /> 2. Communication Policy
              </h2>
              <p className="text-slate-600 font-medium leading-relaxed">
                By using the portal, you agree to receive essential communications regarding your appointments. You can opt-out of marketing newsletters at any time through your Profile settings.
              </p>
            </div>

            <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
              <h3 className="font-black text-lg mb-2">Have questions about your data?</h3>
              <p className="text-slate-400 text-sm font-medium mb-6">Our Data Protection Officer is here to help you understand your rights.</p>
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">
                Contact Privacy Team
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer Note --- */}
      <footer className="py-12 text-center">
        <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
          Health Portal &copy; 2026 • Secure Medical Services
        </p>
      </footer>
    </div>
  );
}