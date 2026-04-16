import React from "react";
import { Heart, Users, Award, ShieldCheck, CheckCircle2 } from "lucide-react";

const stats = [
  { label: "Expert Doctors", value: "200+", icon: <Users className="text-blue-600" /> },
  { label: "Patients Served", value: "50K+", icon: <Heart className="text-red-500" /> },
  { label: "Years Excellence", value: "15+", icon: <Award className="text-amber-500" /> },
  { label: "Clinic Locations", value: "12", icon: <ShieldCheck className="text-emerald-500" /> },
];

export default function About() {
  return (
    <div className="bg-white">
      {/* --- Hero Section --- */}
      <section className="relative py-20 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
              Your Health, <span className="text-blue-600">Our Priority.</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
              We are dedicated to providing world-class healthcare through modern technology, 
              connecting patients with expert medical professionals seamlessly.
            </p>
          </div>
        </div>
        {/* Subtle background decoration */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      </section>

      {/* --- Stats Section --- */}
      <section className="py-12 -mt-10 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 flex flex-col items-center text-center">
                <div className="mb-3 p-3 bg-slate-50 rounded-2xl">{stat.icon}</div>
                <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Mission Section --- */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-square bg-blue-600 rounded-[3rem] overflow-hidden rotate-3 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800" 
                alt="Medical Team"
                className="w-full h-full object-cover -rotate-3 scale-110"
              />
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-2xl border border-slate-50 hidden md:block">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-emerald-500" size={32} />
                <div>
                  <p className="font-black text-slate-900">Certified Care</p>
                  <p className="text-sm text-slate-400 font-bold">ISO 9001 Professional</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">
              Redefining the <br /> 
              Patient Experience
            </h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              Founded in 2011, Health Portal started with a simple vision: to make quality healthcare accessible to everyone. We believe that technology should empower doctors and comfort patients.
            </p>
            
            <ul className="space-y-4">
              {['Real-time Appointment Booking', 'Digital Prescription Management', 'Verified Expert Doctors', '24/7 Support for Emergencies'].map((item, index) => (
                <li key={index} className="flex items-center gap-3 text-slate-800 font-bold">
                  <div className="h-6 w-6 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={14} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-slate-200">
              Meet Our Specialists
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}