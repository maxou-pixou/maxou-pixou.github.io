import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaRegNewspaper } from "react-icons/fa6";

import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";
import CreateNewsModal from "./createNewsModal";

import api from "../../services/api";

export default function NewsList() {
  const navigate = useNavigate();
  const [news, setNews] = useState();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ page: 1 });
  const [total, setTotal] = useState();

  useEffect(() => {
    fetchNews();
  }, [filter]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const { data, ok, total, code } = await api.post("/news/search", {
        offset: (filter.page - 1) * 10,
      });
      if (!ok) return toast.error(code || "Erreur !");
      setNews(data);
      setTotal(total);
    } catch (error) {
      return toast.error("Erreur lors de la récupération des actualités !");
    } finally {
      setLoading(false);
    }
  };

  if (!news) return <Loader />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Actualités</h1>
        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
          <div className="text-sm text-gray-600 whitespace-nowrap">
            Total : <span className="font-semibold font-mono text-gray-900">{total || 0}</span> actualités
          </div>
          <CreateNewsModal onSuccess={fetchNews} />
        </div>
      </div>

      <div className="flow-root relative">
        {loading && <Loader />}
        {news.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <FaRegNewspaper className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-500">Aucune actualité trouvée</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {news.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/news/${item._id}`)}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg hover:border-black transition-all cursor-pointer flex flex-col"
              >
                <div className="h-48 w-full overflow-hidden bg-gray-50">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <FaRegNewspaper className="h-12 w-12 text-gray-200" />
                    </div>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col">
                  <h2 className="font-bold text-lg mb-2 line-clamp-2">{item.title}</h2>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">{item.text}</p>

                  <div className="mt-auto w-full space-y-2 text-[10px]">
                    <div className="flex items-center justify-between py-2 border-t border-gray-100">
                      <span className="text-gray-500">Par {item.admin_name || "Admin"}</span>
                      <span className="font-medium text-gray-400">{item.created_at ? new Date(item.created_at).toLocaleDateString() : "—"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Pagination page={filter.page} total={total} limit={10} onChange={(page) => setFilter({ ...filter, page })} />
    </div>
  );
}
