import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { HiArrowLeft } from "react-icons/hi2";

import Loader from "../../../components/Loader";
import api from "../../../services/api";
import LoadingButton from "../../../components/LoadingButton";
import FileInput from "../../../components/FileInput";

export default function NewsView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState();
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    setLoading(true);
    try {
      const { data, ok } = await api.get(`/news/${id}`);
      if (!ok) return toast.error("Erreur lors de la récupération de l'actualité");
      setItem(data);
    } catch (e) {
      toast.error("Erreur lors de la récupération de l'actualité");
    }
    setLoading(false);
  };

  const onUpdate = async () => {
    setBtnLoading(true);
    try {
      const { ok } = await api.put(`/news/${id}`, item);
      if (!ok) return toast.error("Erreur lors de la mise à jour");
      toast.success("Actualité mise à jour");
    } catch (e) {
      toast.error("Erreur lors de la mise à jour");
    }
    setBtnLoading(false);
  };

  const onDelete = async () => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette actualité ?")) return;
    try {
      const { ok } = await api.delete(`/news/${id}`);
      if (!ok) return toast.error("Erreur lors de la suppression");
      toast.success("Actualité supprimée");
      navigate("/news");
    } catch (e) {
      toast.error("Erreur lors de la suppression");
    }
  };

  if (loading || !item) return <Loader />;

  return (
    <div className="p-6 space-y-6">
      <button onClick={() => navigate("/news")} className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors">
        <HiArrowLeft className="h-4 w-4" />
        Retour aux actualités
      </button>

      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-gray-900">Modifier l'actualité</h1>
          <button onClick={onDelete} className="text-red-600 hover:text-red-700 text-sm font-medium">
            Supprimer
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
            <input
              type="text"
              className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
              value={item.title || ""}
              onChange={(e) => setItem({ ...item, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Texte</label>
            <textarea
              className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black h-64"
              value={item.text || ""}
              onChange={(e) => setItem({ ...item, text: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <FileInput
                  name="image"
                  folder="news"
                  buttonText={item.image ? "Changer l'image" : "Sélectionner une image"}
                  onChange={(e) => setItem({ ...item, image: e.target.value })}
                  buttonClassName="w-full py-2 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                />
                <LoadingButton
                  className="w-full py-2 px-4 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 shadow-lg shadow-black/30 transition-all"
                  loading={btnLoading}
                  onClick={onUpdate}
                >
                  Enregistrer les modifications
                </LoadingButton>
              </div>
              <div>{item.image && <img src={item.image} alt="Aperçu" className="w-full h-auto rounded-lg border border-gray-200 shadow-sm" />}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
