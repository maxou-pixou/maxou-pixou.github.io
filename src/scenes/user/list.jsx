import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FaUser } from "react-icons/fa6";

import Loader from "../../components/Loader";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";

import api from "../../services/api";

export default function UserList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState();
  const [filter, setFilter] = useState({
    search: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState();
  const handleNextPage = () => setCurrentPage((prev) => prev + 1);
  const handlePreviousPage = () => setCurrentPage((prev) => prev - 1);

  useEffect(() => {
    getUsers();
    setCurrentPage(1);
  }, [filter, location]);

  useEffect(() => {
    getUsers();
  }, [currentPage]);

  const getUsers = async () => {
    try {
      const { data, ok, total } = await api.post("/user/search", {
        search: filter.search,
        page: currentPage,
        per_page: 10,
      });
      if (!ok) return toast.error("Erreur lors de la récupération des utilisateurs");
      setUsers(data);
      setTotal(total);
    } catch (error) {
      console.log(error);
      toast.error("Erreur lors de la récupération des utilisateurs");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="w-full md:max-w-md">
          <SearchBar search={filter.search} setFilter={setFilter} placeholder="Rechercher des utilisateurs..." />
        </div>

        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
          <div className="text-sm text-gray-600 whitespace-nowrap">
            Total : <span className="font-semibold font-mono text-gray-900">{total || 0}</span> utilisateurs
          </div>
        </div>
      </div>

      <div className="flow-root relative">
        {!users && <Loader />}
        {users?.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <FaUser className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-500">Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users?.map((user) => (
              <div
                key={user._id}
                onClick={() => navigate(`/user/${user._id}`)}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-black transition-all cursor-pointer"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="h-32 w-full rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-50">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      <FaUser className="h-12 w-12 text-gray-400" />
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900">{user.name || "—"}</h3>

                  <div className="w-full space-y-2 text-sm">
                    <div className="flex items-center justify-between py-2 border-t border-gray-100">
                      <span className="text-gray-600">Email</span>
                      <span className="font-medium text-gray-900 text-xs truncate max-w-[160px]" title={user.email}>
                        {user.email || "—"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-t border-gray-100">
                      <span className="text-gray-600">Rôle</span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === "client" ? "bg-green-100 text-green-800" : "bg-black text-white"
                          }`}
                      >
                        {user.role || "utilisateur"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-t border-gray-100">
                      <span className="text-gray-600">Dernière connexion</span>
                      <span className="font-medium text-gray-900">
                        {user.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : "Jamais"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-t border-gray-100">
                      <span className="text-gray-600">Créé le</span>
                      <span className="font-medium text-gray-900">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Pagination total={total} per_page={10} currentPage={currentPage} onNext={handleNextPage} onPrevious={handlePreviousPage} />
    </div>
  );
}
