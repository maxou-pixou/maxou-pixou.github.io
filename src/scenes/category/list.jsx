import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaTags } from "react-icons/fa6";

import Loader from "../../components/Loader";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import CreateCategoryModal from "./createCategoryModal";

import api from "../../services/api";

export default function CategoryList() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState();
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    search: "",
    page: 1,
  });

  const [total, setTotal] = useState();

  useEffect(() => {
    setFilter({ ...filter, page: 1 });
  }, [filter.search]);

  useEffect(() => {
    fetchCategories();
  }, [filter]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, ok, total, code } = await api.post("/category/search", {
        search: filter.search,
        offset: (filter.page - 1) * 10,
      });
      if (!ok) return toast.error(code || "Erreur !");
      setCategories(data);
      setTotal(total);
    } catch (error) {
      return toast.error("Erreur lors de la récupération des catégories !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="w-full md:max-w-md">
          <SearchBar search={filter.search} setFilter={setFilter} placeholder="Rechercher des catégories..." />
        </div>

        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
          <div className="text-sm text-gray-600 whitespace-nowrap">
            Total : <span className="font-semibold font-mono text-gray-900">{total || 0}</span> catégories
          </div>
          <CreateCategoryModal onSuccess={fetchCategories} />
        </div>
      </div>

      <div className="flow-root relative">
        {loading && <Loader />}
        {categories?.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <FaTags className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-500">Aucune catégorie trouvée</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories?.map((category) => (
              <div
                key={category._id}
                onClick={() => navigate(`/category/${category._id}`)}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-black transition-all cursor-pointer"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="h-32 w-full rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-50">
                    {category.image ? (
                      <img src={category.image} alt={category.name} className="h-full w-full object-cover" />
                    ) : (
                      <FaTags className="h-12 w-12 text-gray-400" />
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900">{category.name || "—"}</h3>

                  <div className="w-full space-y-2 text-sm">
                    <div className="flex items-center justify-between py-2 border-t border-gray-100">
                      <span className="text-gray-600">Créé par</span>
                      <div className="flex items-center gap-2">
                        {category.admin_avatar ? (
                          <img src={category.admin_avatar} alt={category.admin_name} className="h-5 w-5 rounded-full border border-gray-200 object-cover" />
                        ) : (
                          <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-500 uppercase">
                            {category.admin_name?.[0] || "A"}
                          </div>
                        )}
                        <span className="font-medium text-gray-900 text-xs">{category.admin_name || "—"}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-2 border-t border-gray-100">
                      <span className="text-gray-600">Créé le</span>
                      <span className="font-medium text-gray-900">
                        {category.created_at ? new Date(category.created_at).toLocaleDateString() : "—"}
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
