import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Loader from "../../components/Loader";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import api from "../../services/api";

const PER_PAGE = 10;

export default function CommandList() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [eventClothes, setEventClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ search: "", page: 1 });
  const [total, setTotal] = useState(0);

  const fetchEventClothes = async () => {
    try {
      const { data, ok } = await api.post("/clothe/search", { from_event: true });
      if (!ok) return toast.error("Erreur lors de la récupération des vêtements d'événement");
      setEventClothes(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData();
    fetchEventClothes();
  }, [filter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, ok, total } = await api.post("/command/search", {
        search: filter.search,
        confirmed: true,
        limit: PER_PAGE,
        offset: (filter.page - 1) * PER_PAGE,
      });
      if (!ok) return toast.error("Erreur lors de la récupération des données");

      setData(data);
      setTotal(total);
    } catch (e) {
      toast.error("Erreur lors de la récupération des données");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Commandes confirmées</h1>
        <div className="w-full md:w-auto md:max-w-md">
          <SearchBar search={filter.search} setFilter={setFilter} placeholder="Rechercher une commande..." />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600">
          Total : <span className="font-semibold font-mono text-gray-900">{total}</span>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ID Commande</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Total (€)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Articles</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">
                      Aucune commande confirmée
                    </td>
                  </tr>
                ) : (
                  data.map((command) => (
                    <tr key={command._id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate(`/command/${command._id}`)}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{command._id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {command.user_name ? (
                          <div className="flex items-center gap-3">
                            {command.user_avatar && <img src={command.user_avatar} alt={command.user_name} className="w-8 h-8 rounded-full object-cover" />}
                            <div>
                              <p className="text-sm font-medium text-gray-900">{command.user_name}</p>
                              <p className="text-xs text-gray-500">{command.user_email}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 italic">Non renseigné</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700 font-semibold">
                        {typeof command.total_price === "number"
                          ? command.total_price.toFixed(2)
                          : Array.isArray(command.items)
                            ? command.items.reduce((sum, item) => sum + item.price * item.count, 0).toFixed(2)
                            : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{command.items?.length || 0} article(s)</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(command.created_at).toLocaleDateString("fr-FR")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {data.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-500">Aucune commande confirmée</div>
        ) : (
          data.map((command) => (
            <div
              key={command._id}
              className="bg-white border border-gray-200 rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/command/${command._id}`)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Commande #{command._id}</p>
                  <p className="text-xs text-gray-600">{new Date(command.created_at).toLocaleDateString("fr-FR")}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-600">{command.items?.length || 0} article(s)</span>
                  <span className="text-xs text-gray-900 font-semibold">
                    {typeof command.total_price === "number"
                      ? command.total_price.toFixed(2) + "€"
                      : Array.isArray(command.items)
                        ? command.items.reduce((sum, item) => sum + item.price * item.count, 0).toFixed(2) + "€"
                        : "-"}
                  </span>
                </div>
              </div>
              {command.user_name && (
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  {command.user_avatar && <img src={command.user_avatar} alt={command.user_name} className="w-8 h-8 rounded-full object-cover" />}
                  <div>
                    <p className="text-xs font-medium text-gray-900">{command.user_name}</p>
                    <p className="text-xs text-gray-500">{command.user_email}</p>
                  </div>
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/command/${command._id}`);
                }}
                className="w-full py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all"
              >
                Voir détails
              </button>
            </div>
          ))
        )}
      </div>

      <div className="pt-8 border-t border-gray-100">
        {total > PER_PAGE && <Pagination total={total} per_page={PER_PAGE} currentPage={filter.page} onChange={(page) => setFilter({ ...filter, page })} />}
      </div>

      <div className="pt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Vêtements d'événement</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Prix (€)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {eventClothes.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-sm text-gray-500">
                    Aucun vêtement d'événement trouvé
                  </td>
                </tr>
              ) : (
                eventClothes.map((cloth) => (
                  <tr key={cloth._id} className="hover:bg-gray-50 transition-colors" onClick={() => navigate(`/clothe/${cloth._id}`)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cloth.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cloth.category_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700 font-semibold">{cloth.price.toFixed(2)}€</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {cloth.admin_name ? (
                        <div className="flex items-center gap-3">
                          {cloth.admin_avatar && <img src={cloth.admin_avatar} alt={cloth.admin_name} className="w-8 h-8 rounded-full object-cover" />}
                          <div>
                            <p className="text-sm font-medium text-gray-900">{cloth.admin_name}</p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Non renseigné</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
