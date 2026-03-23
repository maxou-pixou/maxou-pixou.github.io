import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaShieldHalved } from "react-icons/fa6";

import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import LoadingButton from "../../components/LoadingButton";

import api from "../../services/api";

export default function AdminList() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState();
  const [filter, setFilter] = useState({
    search: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState();
  const handleNextPage = () => setCurrentPage((prev) => prev + 1);
  const handlePreviousPage = () => setCurrentPage((prev) => prev - 1);

  useEffect(() => {
    getAdmins();
    setCurrentPage(1);
  }, [filter]);

  useEffect(() => {
    getAdmins();
  }, [currentPage]);

  const getAdmins = async () => {
    try {
      const { data, ok, total, code } = await api.post("/admin/search", {
        search: filter.search,
        offset: (currentPage - 1) * 10,
      });
      if (!ok) return toast.error(code || "Erreur !");
      setAdmins(data);
      setTotal(total);
    } catch (error) {
      return toast.error("Erreur lors de la récupération des administrateurs !");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="w-full md:max-w-md">
          <SearchBar search={filter.search} setFilter={setFilter} placeholder="Rechercher des administrateurs..." />
        </div>

        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
          <div className="text-sm text-gray-600 whitespace-nowrap">
            Total : <span className="font-semibold font-mono text-gray-900">{total || 0}</span> administrateurs
          </div>
          <InviteAdmin onSuccess={getAdmins} />
        </div>
      </div>

      <div className="flow-root relative">
        {!admins && <Loader />}
        {admins?.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <FaShieldHalved className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-500">Aucun administrateur trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {admins?.map((admin) => {
              const isPending = admin.invitation_token && admin.invitation_expires && new Date(admin.invitation_expires) > new Date();
              const isExpired = admin.invitation_token && admin.invitation_expires && new Date(admin.invitation_expires) <= new Date();

              return (
                <div
                  key={admin._id}
                  onClick={() => navigate(`/admin/${admin._id}`)}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-black transition-all cursor-pointer"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="h-32 w-full rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-50">
                      {admin.avatar ? (
                        <img src={admin.avatar} alt={admin.name} className="h-full w-full object-cover" />
                      ) : (
                        <FaShieldHalved className="h-12 w-12 text-gray-400" />
                      )}
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900">{admin.name || "—"}</h3>

                    <div className="w-full space-y-2 text-sm">
                      <div className="flex items-center justify-between py-2 border-t border-gray-100">
                        <span className="text-gray-600">Email</span>
                        <span className="font-medium text-gray-900 text-xs truncate max-w-[160px]" title={admin.email}>
                          {admin.email || "—"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-2 border-t border-gray-100">
                        <span className="text-gray-600">Statut</span>
                        {isPending && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">En attente</span>}
                        {isExpired && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Expiré</span>}
                        {!isPending && !isExpired && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Actif</span>
                        )}
                      </div>

                      <div className="flex items-center justify-between py-2 border-t border-gray-100">
                        <span className="text-gray-600">Dernière connexion</span>
                        <span className="font-medium text-gray-900">
                          {admin.last_login_at ? new Date(admin.last_login_at).toLocaleDateString() : "Jamais"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-2 border-t border-gray-100">
                        <span className="text-gray-600">Créé le</span>
                        <span className="font-medium text-gray-900">
                          {admin.created_at ? new Date(admin.created_at).toLocaleDateString() : "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Pagination total={total} per_page={10} currentPage={currentPage} onNext={handleNextPage} onPrevious={handlePreviousPage} />
    </div>
  );
}

function InviteAdmin({ onSuccess }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({});
  const [btnLoading, setBtnLoading] = useState(false);

  const onCreate = async () => {
    setBtnLoading(true);
    try {
      const { ok, code, data } = await api.post("/admin", values);

      if (!ok) {
        toast.error(code || "Erreur lors de la création de l'administrateur !");
        setBtnLoading(false);
      } else {
        toast.success("Invitation envoyée !");
        setOpen(false);
        setValues({});
        setBtnLoading(false);
        if (onSuccess) onSuccess();
        navigate(`/admin/${data._id}`);
      }
    } catch (error) {
      toast.error("Erreur lors de la création de l'administrateur !");
      setBtnLoading(false);
    }
  };

  return (
    <div>
      <button
        className="whitespace-nowrap flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-lg shadow-lg shadow-black/30 text-sm font-medium text-white bg-black hover:bg-gray-800 transition-all"
        onClick={() => setOpen(true)}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Inviter un admin
      </button>

      <Modal isOpen={open} className="!w-[90vw] md:!w-[500px] p-6" onClose={() => setOpen(false)}>
        <h1 className="text-xl font-semibold mb-6 text-gray-900">Inviter un nouvel administrateur</h1>

        <div className="space-y-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
            <input
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20 transition-all outline-none"
              placeholder="Entrez le nom"
              value={values.name || ""}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20 transition-all outline-none"
              placeholder="Entrez l'email"
              type="email"
              value={values.email || ""}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end items-center gap-3 mt-6">
          <button
            onClick={() => setOpen(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <LoadingButton
            className="py-2 px-4 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 shadow-lg shadow-black/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            loading={btnLoading}
            disabled={!values.name || !values.email}
            onClick={onCreate}
          >
            Envoyer l'invitation
          </LoadingButton>
        </div>
      </Modal>
    </div>
  );
}
