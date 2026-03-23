import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaShirt } from "react-icons/fa6";

import Loader from "../../components/Loader";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import CreateClotheModal from "./createClotheModal";
import api from "../../services/api";

export default function ClotheList() {
  const navigate = useNavigate();
  const [items, setItems] = useState();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({
    search: "",
    category_id: "",
    _id: "",
    size: "",
    page: 1,
  });

  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setFilter((f) => ({ ...f, page: 1 }));
  }, [filter.search, filter.category_id, filter.size]);

  useEffect(() => {
    fetchClothe();
  }, [filter]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const { data, ok } = await api.get("/category");
      if (!ok) return toast.error("Erreur lors de la récupération des catégories");
      setCategories(data);
    } catch (e) {
      toast.error("Erreur lors de la récupération des catégories");
      return e;
    } finally {
      setLoading(false);
    }
  };

  const fetchClothe = async () => {
    setLoading(true);
    try {
      const { data, ok, total, code } = await api.post("/clothe/search", {
        search: filter.search,
        category_id: filter.category_id,
        size: filter.size,
        offset: (filter.page - 1) * 10,
      });
      if (!ok) return toast.error(code || "Erreur !");
      setItems(data);
      setTotal(total);
    } catch (error) {
      return toast.error("Erreur lors de la récupération des vêtements !");
    } finally {
      setLoading(false);
    }
  };

  {
    loading && <Loader />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 flex-1 w-full">
          <div className="w-full sm:max-w-md">
            <SearchBar search={filter.search} setFilter={setFilter} placeholder="Rechercher des vêtements..." />
          </div>
          <div className="relative w-full sm:w-48">
            <select
              className="appearance-none w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:border-black focus:ring-2 focus:ring-black/20 transition-all outline-none cursor-pointer pr-10"
              value={filter.category_id}
              onChange={(e) => setFilter({ ...filter, category_id: e.target.value })}
            >
              <option value="">Toutes les catégories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          <div className="relative w-full sm:w-32">
            <select
              className="appearance-none w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:border-black focus:ring-2 focus:ring-black/20 transition-all outline-none cursor-pointer pr-10"
              value={filter.size}
              onChange={(e) => setFilter({ ...filter, size: e.target.value })}
            >
              <option value="">Taille</option>
              {["XS", "S", "M", "L", "XL", "XXL"].map((sizeValue) => (
                <option key={sizeValue} value={sizeValue}>
                  {sizeValue}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between lg:justify-end gap-4 w-full lg:w-auto">
          <div className="text-sm text-gray-600 whitespace-nowrap">
            Total : <span className="font-semibold font-mono text-gray-900">{total || 0}</span> articles
          </div>
          <CreateClotheModal onSuccess={fetchClothe} categories={categories} />
        </div>
      </div>

      <div className="flow-root relative">
        {loading && <Loader />}
        {items?.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <FaShirt className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-500">Aucun vêtement trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items?.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/clothe/${item._id}`)}
                className={`rounded-lg border p-6 hover:shadow-lg hover:border-black transition-all cursor-pointer ${
                  item.from_event ? "bg-yellow-50 border-yellow-200" : "bg-white border-gray-200"
                }`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="h-32 w-full rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-50 relative">
                    {item.from_event && (
                      <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow-sm z-10">
                        Event
                      </span>
                    )}
                    {item.image ? <img src={item.image[0]} alt={item.name} className="h-full w-full object-cover" /> : <FaShirt className="h-12 w-12 text-gray-400" />}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900">{item.name || "—"}</h3>

                  <div className="w-full space-y-2 text-sm">
                    <div className="flex items-center justify-between py-2 border-t border-gray-100">
                      <span className="text-gray-600">Catégorie</span>
                      <span className="font-medium text-gray-900">{item.category_name || "—"}</span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-t border-gray-100">
                      <span className="text-gray-600">Prix</span>
                      <span className="font-medium text-gray-900">{item.price ? `${item.price}€` : "—"}</span>
                    </div>

                    <div className="py-2 border-t border-gray-100">
                      <span className="text-gray-600 block mb-2">Tailles en boutique</span>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {Array.isArray(item.size) && item.size.length > 0 ? (
                          ["XS", "S", "M", "L", "XL", "XXL"].map((sizeValue) => {
                            const sizeObj = item.size?.find((s) => s.type === sizeValue);
                            if (!sizeObj) return null;
                            const isAvailable = sizeObj.display_shop && sizeObj.stock_available > 0;
                            return (
                              <span
                                key={sizeValue}
                                className={`inline-flex items-center justify-center h-6 w-6 rounded text-xs font-semibold ${
                                  isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                              >
                                {sizeValue}
                              </span>
                            );
                          })
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between py-2 border-t border-gray-100">
                      <span className="text-gray-600">Créé par</span>
                      <div className="flex items-center gap-2">
                        {item.admin_avatar ? (
                          <img src={item.admin_avatar} alt={item.admin_name} className="h-5 w-5 rounded-full border border-gray-200 object-cover" />
                        ) : (
                          <div className="h-5 w-5 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-500 uppercase">
                            {item.admin_name?.[0] || "A"}
                          </div>
                        )}
                        <span className="font-medium text-gray-900 text-xs">{item.admin_name || "—"}</span>
                      </div>
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
