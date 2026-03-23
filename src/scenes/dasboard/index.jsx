import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, AreaChart, Area } from "recharts";
import api from "../../services/api";

const formatMonth = (year, month) => {
  const date = new Date(year, month - 1);
  return date.toLocaleString("default", { month: "short", year: "2-digit" });
};

const formatWeek = (year, week) => {
  const start = new Date(year, 0, 1 + week * 7);
  const end = new Date(year, 0, 1 + week * 7 + 7);
  const formattedDate = (date) => `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}`;
  return `${formattedDate(start)} - ${formattedDate(end)}`;
};

export default () => {
  const [sizePerUser, setSizePerUser] = useState([]);
  const [earnPerMonth, setEarnPerMonth] = useState([]);
  const [audienceActivity, setAudienceActivity] = useState([]);
  const [audienceView, setAudienceView] = useState("all");
  const [loading, setLoading] = useState(true);

  const chartSizePerUser = async () => {
    try {
      const { data, ok } = await api.get("/dashboard/user-per-size");
      if (!ok) return toast.error("Erreur lors de la récupération des données");
      setSizePerUser(data.map((item) => ({ name: item._id || "N/A", count: item.count })));
    } catch (error) {
      console.error("Error fetching size chart:", error);
    } finally {
      setLoading(false);
    }
  };

  const chartEarnPerMonth = async () => {
    try {
      const { data, ok } = await api.get("/dashboard/command-price-per-month");
      if (!ok) return toast.error("Erreur lors de la récupération des données");
      setEarnPerMonth(
        data.map((item) => ({
          name: formatMonth(item._id.year, item._id.month),
          totalPrice: item.totalPrice,
        })),
      );
    } catch (error) {
      console.error("Error fetching command chart:", error);
    }
  };

  const chartAudienceActivity = async () => {
    try {
      const { data, ok } = await api.get("/dashboard/audience-activity");
      if (!ok) return toast.error("Erreur lors de la récupération des données");
      setAudienceActivity(
        data.map((item) => ({
          name: formatWeek(item.year, item.week),
          created: item.created,
          connected: item.connected,
          visits: item.visits,
        })),
      );
    } catch (error) {
      console.error("Error fetching audience chart:", error);
    }
  };

  useEffect(() => {
    chartSizePerUser();
    chartEarnPerMonth();
    chartAudienceActivity();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Tableau de bord</h1>
        <p className="text-gray-600">Statistiques globales de la plateforme.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User per Size Bar Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-lg">
          <h2 className="text-xl font-semibold mb-6">Utilisateurs par taille</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sizePerUser}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Command Price per Month Line Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-lg">
          <h2 className="text-xl font-semibold mb-6">Chiffre d'affaires mensuel (€)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={earnPerMonth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="totalPrice" stroke="#10B981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Audience Activity Bar Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-lg md:col-span-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold">Activité de l'audience (Hebdomadaire)</h2>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setAudienceView("all")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  audienceView === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setAudienceView("created")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  audienceView === "created" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Créés
              </button>
              <button
                onClick={() => setAudienceView("connected")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  audienceView === "connected" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Actifs
              </button>
              <button
                onClick={() => setAudienceView("visits")}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  audienceView === "visits" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Visites
              </button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={audienceActivity}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                {(audienceView === "all" || audienceView === "created") && <Bar dataKey="created" name="Comptes créés" fill="#6366F1" radius={[4, 4, 0, 0]} />}
                {(audienceView === "all" || audienceView === "connected") && <Bar dataKey="connected" name="Utilisateurs actifs" fill="#F59E0B" radius={[4, 4, 0, 0]} />}
                {(audienceView === "all" || audienceView === "visits") && <Bar dataKey="visits" name="Nombre de visites" fill="#EC4899" radius={[4, 4, 0, 0]} />}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
