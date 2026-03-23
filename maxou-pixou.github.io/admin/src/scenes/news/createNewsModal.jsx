import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Modal from "../../components/Modal";
import LoadingButton from "../../components/LoadingButton";
import FileInput from "../../components/FileInput";
import api from "../../services/api";

export default function CreateNewsModal({ onSuccess }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);

  const onCreate = async () => {
    if (!values.title || !values.text) return toast.error("Le titre et le texte sont requis");
    setLoading(true);
    try {
      const { ok, code, data } = await api.post("/news", values);

      if (!ok) {
        toast.error(code || "Erreur lors de la création de l'actualité");
        setLoading(false);
      } else {
        toast.success("Actualité créée !");
        setOpen(false);
        setValues({});
        setLoading(false);
        if (onSuccess) onSuccess();
        navigate(`/news/${data._id}`);
      }
    } catch (error) {
      toast.error("Erreur lors de la création de l'actualité");
      setLoading(false);
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
        Ajouter une actualité
      </button>

      <Modal isOpen={open} className="!w-[90vw] md:!w-[600px] p-6" onClose={() => setOpen(false)}>
        <h1 className="text-xl font-semibold mb-6 text-gray-900">Ajouter une actualité</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
            <input
              type="text"
              className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black"
              placeholder="Titre de l'actualité"
              value={values.title || ""}
              onChange={(e) => setValues({ ...values, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Texte</label>
            <textarea
              className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-black focus:border-black h-32"
              placeholder="Contenu de l'actualité"
              value={values.text || ""}
              onChange={(e) => setValues({ ...values, text: e.target.value })}
            />
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
            <div className="flex flex-col gap-4">
              {values.image && <img src={values.image} alt="Aperçu" className="w-full max-h-48 object-cover rounded-lg border border-gray-200" />}
              <FileInput
                name="image"
                folder="news"
                buttonText={values.image ? "Changer l'image" : "Sélectionner une image"}
                onChange={(e) => setValues({ ...values, image: e.target.value })}
                buttonClassName="w-full py-2 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              />
            </div>
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
            loading={loading}
            disabled={!values.title || !values.text}
            onClick={onCreate}
          >
            Créer
          </LoadingButton>
        </div>
      </Modal>
    </div>
  );
}
