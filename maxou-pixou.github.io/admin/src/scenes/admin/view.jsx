import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { HiArrowLeft } from "react-icons/hi2";

import Loader from "../../components/Loader";
import LoadingButton from "../../components/LoadingButton";
import TabItem from "../../components/TabItem";

import api from "../../services/api";
import useStore from "../../store";

const INFORMATION = "INFORMATION";
const RAW_DATA = "RAW_DATA";

export default function AdminView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [admin, setAdmin] = useState();
  const [tab, setTab] = useState(INFORMATION);

  useEffect(() => {
    getAdmin();
  }, [id]);

  const getAdmin = async () => {
    try {
      const { data, ok } = await api.get(`/admin/${id}`);
      if (!ok) return toast.error("Erreur lors de la récupération des données de l'administrateur");
      setAdmin(data);
    } catch (e) {
      toast.error("Erreur lors de la récupération des données de l'administrateur");
    }
  };

  if (!admin) return <Loader />;

  return (
    <div className="p-6 space-y-6">
      <button onClick={() => navigate("/admin")} className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors">
        <HiArrowLeft className="h-4 w-4" />
        Retour aux administrateurs
      </button>

      <nav className="flex items-center gap-2">
        <TabItem tab={INFORMATION} title="Informations" setTab={setTab} active={tab === INFORMATION} />
        <TabItem tab={RAW_DATA} title="Données brutes" setTab={setTab} active={tab === RAW_DATA} />
      </nav>

      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        {tab === INFORMATION && <Information admin={admin} setAdmin={setAdmin} />}
        {tab === RAW_DATA && <RawData admin={admin} />}
      </div>
    </div>
  );
}

function Information({ admin, setAdmin }) {
  const { user } = useStore();
  const navigate = useNavigate();
  const [values, setValues] = useState(admin);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValues(admin);
  }, [admin]);

  const onUpdate = async () => {
    setLoading(true);
    try {
      const { data, ok } = await api.put(`/admin/${admin._id}`, values);
      if (!ok) throw new Error();
      setAdmin(data);
      toast.success("Mis à jour avec succès !");
      navigate("/admin");
    } catch (e) {
      toast.error("Erreur lors de la mise à jour de l'administrateur");
    }
    setLoading(false);
  };

  const onDelete = async () => {
    if (user?._id === admin._id) {
      return toast.error("Les administrateurs ne peuvent pas supprimer leur propre compte");
    }

    if (!confirm("Êtes-vous sûr de vouloir supprimer cet administrateur ? Cette action est irréversible.")) return;

    try {
      const { ok } = await api.remove(`/admin/${admin._id}`);
      if (!ok) throw new Error();
      toast.success("Administrateur supprimé avec succès !");
      navigate("/admin");
    } catch (e) {
      toast.error("Erreur lors de la suppression de l'administrateur");
    }
  };

  const isPending = admin.invitation_token && admin.invitation_expires && new Date(admin.invitation_expires) > new Date();
  const isExpired = admin.invitation_token && admin.invitation_expires && new Date(admin.invitation_expires) <= new Date();

  return (
    <div className="space-y-6">
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
            <div className="flex items-center gap-2">
              {isPending && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">Invitation en attente</span>}
              {isExpired && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">Invitation expirée</span>}
              {!isPending && !isExpired && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">Actif</span>}
            </div>
          </div>
          {isPending && admin.invitation_expires && (
            <div className="text-right">
              <label className="block text-sm font-medium text-gray-700 mb-2">L'invitation expire le</label>
              <span className="text-sm text-gray-600">{new Date(admin.invitation_expires).toLocaleString()}</span>
            </div>
          )}
          {isExpired && admin.invitation_expires && (
            <div className="text-right">
              <label className="block text-sm font-medium text-gray-700 mb-2">Invitation expirée</label>
              <span className="text-sm text-red-600">{new Date(admin.invitation_expires).toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
          <input
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20 transition-all outline-none"
            value={values.name || ""}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
          />
        </div>
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20 transition-all outline-none"
            value={values.email || ""}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <LoadingButton
          loading={loading}
          onClick={onUpdate}
          className="py-2 px-4 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 shadow-lg shadow-black/30 transition-all"
        >
          Mettre à jour
        </LoadingButton>
        <button
          onClick={onDelete}
          disabled={user?._id === admin._id}
          className="py-2 px-4 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}

function RawData({ admin }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <pre className="whitespace-pre-wrap break-words text-sm text-gray-800">{JSON.stringify(admin, null, 2)}</pre>
    </div>
  );
}
