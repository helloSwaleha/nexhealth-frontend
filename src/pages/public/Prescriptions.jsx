import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const patientId = localStorage.getItem("userId");

  // 🔹 Fetch prescriptions
  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        // Updated URL to match your standard API structure
        const res = await axios.get(
          `http://localhost:8080/api/patient/prescriptions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPrescriptions(res.data);
      } catch (error) {
        console.error("Error fetching prescriptions", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchPrescriptions();
    }
  }, [token]);

  // 🔹 Download Prescription PDF
  const downloadPrescription = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/patient/prescriptions/${id}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Important for handling binary data (PDF)
        }
      );

      // Create a blob link to trigger download
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `prescription-${id}.pdf`);
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
      alert("Failed to download prescription. The file might not be ready yet.");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Prescriptions...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        My Prescriptions
      </h1>

      {prescriptions.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow text-center">
          <p className="text-gray-600 italic">No prescriptions have been issued to you yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {prescriptions.map((pres) => (
            <div
              key={pres.id}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
            >
              {/* HEADER */}
              <div className="flex flex-col md:flex-row justify-between mb-4 border-b pb-4">
                <div>
                  <h2 className="text-xl font-bold text-blue-700">
                    {pres.clinicName || "Medical Center"}
                  </h2>
                  <p className="text-gray-700 font-medium">
                    👨‍⚕️ Dr. {pres.doctorName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-sm">Date Issued</p>
                  <p className="font-semibold text-gray-800">
                    📅 {pres.date}
                  </p>
                </div>
              </div>

              {/* DIAGNOSIS */}
              <div className="mb-4 bg-blue-50 p-3 rounded-lg">
                <p className="text-blue-900">
                  <strong>Diagnosis:</strong> {pres.diagnosis || "General Consultation"}
                </p>
              </div>

              {/* MEDICINES */}
              <div className="mb-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  💊 Prescribed Medicines
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-gray-500 text-sm uppercase">
                        <th className="py-2">Medicine</th>
                        <th className="py-2">Dosage</th>
                        <th className="py-2">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {pres.medicines && pres.medicines.map((med, index) => (
                        <tr key={index} className="text-gray-800">
                          <td className="py-2 font-medium">{med.name}</td>
                          <td className="py-2">{med.dosage}</td>
                          <td className="py-2">{med.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* NOTES */}
              {pres.notes && (
                <p className="mb-4 text-gray-600 bg-gray-50 p-3 rounded-lg text-sm italic">
                  <strong>Doctor's Advice:</strong> {pres.notes}
                </p>
              )}

              {/* DOWNLOAD */}
              <div className="mt-6">
                <button
                  onClick={() => downloadPrescription(pres.id)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-blue-200"
                >
                  📥 Download PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}