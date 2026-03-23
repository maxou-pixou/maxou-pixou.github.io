import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaImages } from "react-icons/fa6";

import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";
import CreatePortfolioModal from "./createPortfolioModal";

import api from "../../services/api";

export default function PortfolioList() {
  const navigate = useNavigate();
  const [image, setImage] = useState();
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState({
    page: 1,
  });
  const [total, setTotal] = useState();

  useEffect(() => {
    fetchImage();
  }, [filter]);

  const fetchImage = async () => {
    try {
      setLoading(true);
      const { data, ok, total, code } = await api.post("/portfolio/search", {
        offset: (filter.page - 1) * 10,
      });
      if (!ok) return toast.error(code || "Erreur !");
      setImage(data);
      setTotal(total);
    } catch (error) {
      return toast.error("Erreur lors de la récupération des éléments du portfolio !");
    } finally {
      setLoading(false);
    }
  };

  if (!image) return <Loader />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
          <div className="text-sm text-gray-600 whitespace-nowrap">
            Total : <span className="font-semibold font-mono text-gray-900">{total || 0}</span> éléments
          </div>
          <CreatePortfolioModal onSuccess={fetchImage} />
        </div>
      </div>

      <div className="flow-root relative">
        {loading && <Loader />}
        {image.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <FaImages className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-500">Aucun élément du portfolio trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {image.map((image) => (
              <div
                key={image._id}
                onClick={() => navigate(`/portfolio/${image._id}`)}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-black transition-all cursor-pointer"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="h-32 w-full rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-50">
                    {image.image ? (
                      <img src={image.image} alt="Portfolio" className="h-full w-full object-cover" />
                    ) : (
                      <FaImages className="h-12 w-12 text-gray-400" />
                    )}
                  </div>

                  <div className="w-full space-y-2 text-sm">
                    <div className="flex items-center justify-between py-2 border-t border-gray-100">
                      <span className="text-gray-600">Créé par</span>
                      <div className="flex items-center gap-2">
                        {image.admin_avatar ? (
                          <img src={image.admin_avatar} alt={image.admin_name} className="h-5 w-5 rounded-full border border-gray-200 object-cover" />
                        ) : (
                          <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-500 uppercase">
                            {image.admin_name?.[0] || "A"}
                          </div>
                        )}
                        <span className="font-medium text-gray-900 text-xs">{image.admin_name || "—"}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-2 border-t border-gray-100">
                      <span className="text-gray-600">Créé le</span>
                      <span className="font-medium text-gray-900">
                        {image.created_at ? new Date(image.created_at).toLocaleDateString() : "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Pagination total={total} per_page={10} currentPage={filter.page} onChange={(page) => setFilter({ ...filter, page })} />
    </div>
  );
}
