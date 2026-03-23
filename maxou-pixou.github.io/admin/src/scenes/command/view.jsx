import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Loader from "../../components/Loader";
import api from "../../services/api";

export default function CommandView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, ok } = await api.get(`/command/${id}`);
      if (!ok) {
        toast.error("Commande non trouvée");
        navigate("/command");
        return;
      }
      if (!data.confirmed) {
        toast.error("Cette commande n'est pas confirmée");
        navigate("/command");
        return;
      }
      setData(data);
    } catch (e) {
      toast.error("Erreur lors de la récupération des données");
      navigate("/command");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <button onClick={() => navigate("/command")} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="text-sm font-medium">Retour</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">Détails de la commande</h1>
              <p className="text-gray-600">ID: {data._id}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Statut</p>
                <p className="text-sm font-semibold text-green-600">Confirmée</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                <p className="text-sm font-semibold text-gray-900">{new Date(data.created_at).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}</p>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          {data.ship_info && data.ship_info.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Adresse de livraison</h2>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  Téléphone: <span className="text-gray-900 font-medium">{data.ship_info[0].phone_number || "N/A"}</span>
                </p>
                <p className="text-gray-600">
                  Adresse:{" "}
                  <span className="text-gray-900 font-medium">
                    {data.ship_info[0].road_number || ""} {data.ship_info[0].shipping_address || "N/A"}
                  </span>
                </p>
                <p className="text-gray-600">
                  Code postal: <span className="text-gray-900 font-medium">{data.ship_info[0].postal_code || "N/A"}</span>
                </p>
                <p className="text-gray-600">
                  Ville: <span className="text-gray-900 font-medium">{data.ship_info[0].city || "N/A"}</span>
                </p>
                <p className="text-gray-600">
                  Pays: <span className="text-gray-900 font-medium">{data.ship_info[0].country || "N/A"}</span>
                </p>
              </div>
            </div>
          )}

          {/* Invoice Info */}
          {data.invoice_info && data.invoice_info.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations de facturation</h2>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600">
                  Entreprise: <span className="text-gray-900 font-medium">{data.invoice_info[0].company || "N/A"}</span>
                </p>
                <p className="text-gray-600">
                  Adresse de facturation: <span className="text-gray-900 font-medium">{data.invoice_info[0].invoice_address || "N/A"}</span>
                </p>
                <p className="text-gray-600">
                  Numéro TVA: <span className="text-gray-900 font-medium">{data.invoice_info[0].TVA_number || "N/A"}</span>
                </p>
              </div>
            </div>
          )}

          {/* Items */}
          {data.items && data.items.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Articles commandés</h2>
              <div className="space-y-3">
                {data.items.map((item, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {item.image && <img src={item.image[0]} alt={item.name} className="w-20 h-20 object-cover rounded" />}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
                        {item.size && (
                          <span>
                            Taille: <span className="font-semibold">{item.size}</span>
                          </span>
                        )}
                        <span>
                          Quantité: <span className="font-semibold">{item.quantity || item.count || 1}</span>
                        </span>
                        <span>
                          Prix: <span className="font-semibold">{item.price}€</span>
                        </span>
                        {item.clothe_id && (
                          <span className="text-gray-400 text-xs mt-0.5">
                            REF: <span className="font-mono">{item.clothe_id}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-20 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Résumé</h2>

            <div className="space-y-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total articles</span>
                <span className="font-semibold text-gray-900">{data.items?.length || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Statut</span>
                <span className="font-semibold text-green-600">Confirmée</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Créé le</p>
              <p className="text-sm text-gray-900">{new Date(data.created_at).toLocaleString("fr-FR")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
