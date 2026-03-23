import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import LoadingButton from "../../../components/LoadingButton";
import FileInput from "../../../components/FileInput";
import api from "../../../services/api";

export default function Information({ category, setCategory }) {
  const navigate = useNavigate();
  const [values, setValues] = useState(category);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValues(category);
  }, [category]);

  const onUpdate = async () => {
    setLoading(true);
    try {
      const { data, ok } = await api.put(`/category/${category._id}`, values);
      if (!ok) return toast.error("Erreur lors de la mise à jour de la catégorie");
      setCategory(data);
      toast.success("Mis à jour avec succès !");
      navigate("/category");
    } catch (e) {
      toast.error("Erreur lors de la mise à jour de la catégorie");
    }
    setLoading(false);
  };

  const onDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible.")) return;

    try {
      const { ok } = await api.remove(`/category/${category._id}`);
      if (!ok) return toast.error("Erreur lors de la suppression de la catégorie");
      toast.success("Catégorie supprimée avec succès !");
      navigate("/category");
    } catch (e) {
      toast.error("Erreur lors de la suppression de la catégorie");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">Créé par</label>
          <div className="flex items-center gap-3">
            {category.admin_avatar ? (
              <img src={category.admin_avatar} alt={category.admin_name} className="h-10 w-10 rounded-full border-2 border-white shadow-sm object-cover" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center font-bold text-gray-400 uppercase">
                {category.admin_name?.[0] || "A"}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-gray-900">{category.admin_name || "Inconnu"}</p>
              <p className="text-[10px] text-gray-400 font-mono">ID: {category.admin_id}</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
          <p className="text-sm text-gray-900">{category.created_at ? new Date(category.created_at).toLocaleString() : "—"}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
          <input
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20 transition-all outline-none"
            value={values.name || ""}
            onChange={(e) => setValues({ ...values, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Point Box</label>
          <input
            type="number"
            min="0"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20 transition-all outline-none"
            value={values.box_point || 0}
            onChange={(e) => setValues({ ...values, box_point: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
          <div className="flex flex-col gap-4">
            {values.image && <img src={values.image} alt="Aperçu" className="max-w-md object-contain rounded-lg border border-gray-200 shadow-sm" />}
            <FileInput
              name="image"
              folder="categories"
              buttonText="Changer l'image"
              onChange={(e) => setValues({ ...values, image: e.target.value })}
              buttonClassName="max-w-md py-2 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <LoadingButton
          loading={loading}
          onClick={onUpdate}
          disabled={!values.name || !values.image}
          className="py-2 px-4 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 shadow-lg shadow-black/30 transition-all disabled:opacity-50"
        >
          Mettre à jour
        </LoadingButton>
        <button onClick={onDelete} className="py-2 px-4 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
          Supprimer
        </button>
      </div>
    </div>
  );
}
