import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { HiArrowLeft } from "react-icons/hi2";

import Loader from "../../components/Loader";
import LoadingButton from "../../components/LoadingButton";
import TabItem from "../../components/TabItem";

import api from "../../services/api";

const INFORMATION = "INFORMATION";
const RAW_DATA = "RAW_DATA";

export default function UserView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [tab, setTab] = useState(INFORMATION);

  useEffect(() => {
    get();
  }, [id]);

  const get = async () => {
    try {
      const { data, ok } = await api.get(`/user/${id}`);
      if (!ok) return toast.error("Erreur lors de la récupération de l'utilisateur");
      setUser(data);
    } catch (e) {
      console.log(e);
      toast.error("Erreur lors de la récupération de l'utilisateur");
    }
  };

  if (!user) return <Loader />;

  return (
    <div className="p-6 space-y-6">
      <button onClick={() => navigate("/user")} className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors">
        <HiArrowLeft className="h-4 w-4" />
        Retour aux utilisateurs
      </button>

      <nav className="flex items-center gap-2">
        <TabItem tab={INFORMATION} title="Informations" setTab={setTab} active={tab === INFORMATION} />
        <TabItem tab={RAW_DATA} title="Données brutes" setTab={setTab} active={tab === RAW_DATA} />
      </nav>

      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        {tab === INFORMATION && <Information user={user} setUser={setUser} />}
        {tab === RAW_DATA && <RawData user={user} />}
      </div>
    </div>
  );
}

function Information({ user, setUser }) {
  const navigate = useNavigate();
  const [values, setValues] = useState(user);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    setValues(user);
  }, [user]);

  const onUpdate = async () => {
    setBtnLoading(true);
    try {
      const { data, ok } = await api.put(`/user/${user._id}`, values);
      if (!ok) return toast.error("Erreur lors de la mise à jour de l'utilisateur");
      toast.success("Mis à jour !");
      setUser(data);
      navigate("/user");
    } catch (e) {
      console.log(e);
      toast.error("Erreur lors de la mise à jour de l'utilisateur");
    } finally {
      setBtnLoading(false);
    }
  };

  const onDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.")) return;

    try {
      const { ok } = await api.remove(`/user/${user._id}`);
      if (!ok) return toast.error("Erreur lors de la suppression de l'utilisateur");
      toast.success("Supprimé !");
      navigate("/user");
    } catch (e) {
      console.log(e);
      toast.error("Erreur lors de la suppression de l'utilisateur");
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
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
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20 transition-all outline-none"
            value={values.email || ""}
            onChange={(e) => setValues({ ...values, email: e.target.value })}
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
          <select
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20 transition-all outline-none"
            value={values.role || "user"}
            onChange={(e) => setValues({ ...values, role: e.target.value })}
          >
            <option value="user">Utilisateur</option>
            <option value="client">Client</option>
          </select>
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">Dernière connexion</label>
          <input
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 cursor-not-allowed outline-none"
            value={values.last_login_at ? new Date(values.last_login_at).toLocaleString() : "Jamais"}
            disabled
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">Créé le</label>
          <input
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 cursor-not-allowed outline-none"
            value={values.created_at ? new Date(values.created_at).toLocaleString() : "—"}
            disabled
          />
        </div>
      </div>

      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
        <LoadingButton
          className="py-2 px-4 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 shadow-lg shadow-black/30 transition-all"
          loading={btnLoading}
          onClick={() => onUpdate()}
        >
          Mettre à jour
        </LoadingButton>

        <button className="py-2 px-4 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors" onClick={onDelete}>
          Supprimer
        </button>
      </div>
    </div>
  );
}

function RawData({ user }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <pre className="break-all whitespace-pre-wrap text-sm text-gray-800">{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
