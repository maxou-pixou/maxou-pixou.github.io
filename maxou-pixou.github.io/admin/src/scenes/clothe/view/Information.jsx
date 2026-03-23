import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import LoadingButton from "../../../components/LoadingButton";
import FileInput from "../../../components/FileInput";
import Select from "../../../components/Select";
import api from "../../../services/api";

export default function Information({ item, setItem }) {
  const navigate = useNavigate();
  const [values, setValues] = useState(item);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setValues(item);
    fetchCategory();
  }, [item]);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [values.image]);

  const deleteImage = async (index) => {
    if (!Array.isArray(values.image) || !values._id) return;
    if (!confirm("Supprimer cette photo ? Cette action est irréversible.")) return;

    const newImages = [...values.image];
    newImages.splice(index, 1);

    try {
      const { data, ok } = await api.patch(`/clothe/${item._id}`, { image: newImages });
      if (!ok) return toast.error("Erreur lors de la suppression de la photo");
      setValues(data);
      if (typeof setItem === "function") setItem(data);
      // adjust current index
      setCurrentImageIndex((i) => Math.max(0, Math.min(i, (data.image?.length || 0) - 1)));
      toast.success("Photo supprimée");
    } catch (e) {
      toast.error("Erreur lors de la suppression de la photo");
    }
  };

  const fetchCategory = async () => {
    try {
      const { data, ok } = await api.get("/category");
      if (!ok) return toast.error("Erreur lors de la récupération des catégories");
      setCategories(data);
    } catch (e) {
      toast.error("Erreur lors de la récupération des catégories");
      return e;
    }
  };

  const updateClothe = async () => {
    setLoading(true);
    try {
      const { data, ok } = await api.put(`/clothe/${item._id}`, values);
      if (!ok) return toast.error("Erreur lors de la mise à jour de l'article");
      setItem(data);
      toast.success("Mis à jour avec succès !");
      navigate("/clothe");
    } catch (e) {
      toast.error("Erreur lors de la mise à jour de l'article");
    }
    setLoading(false);
  };

  const deleteClothe = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.")) return;

    try {
      const { ok } = await api.remove(`/clothe/${item._id}`);
      if (!ok) return toast.error("Erreur lors de la suppression de l'article");
      toast.success("Article supprimé avec succès !");
      navigate("/clothe");
    } catch (e) {
      toast.error("Erreur lors de la suppression de l'article");
    }
  };

  return (
    <div className={`space-y-6 ${values.from_event ? "bg-yellow-50 p-6 rounded-xl border border-yellow-200" : ""}`}>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg border">
          <label className="block text-sm font-medium mb-2">Créé par</label>
          <div className="flex items-center gap-3">
            {item.admin_avatar ? (
              <img src={item.admin_avatar} alt={item.admin_name} className="h-10 w-10 rounded-full object-cover" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-white border flex items-center justify-center font-bold text-gray-400 uppercase">{item.admin_name?.[0] || "A"}</div>
            )}
            <div>
              <p className="text-sm font-semibold">{item.admin_name || "Inconnu"}</p>
              <p className="text-xs text-gray-400">ID: {item.admin_id}</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border">
          <label className="block text-sm font-medium mb-2">Date</label>
          <p className="text-sm">{item.created_at ? new Date(item.created_at).toLocaleString() : "—"}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 p-4 bg-white rounded-lg border shadow-sm">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            className="w-5 h-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
            checked={!!values.from_event}
            onChange={(e) => setValues({ ...values, from_event: e.target.checked })}
          />
          <span className="text-sm font-medium text-gray-900">Est un vêtement d'événement</span>
        </label>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nom</label>
            <input
              className="w-full px-4 py-2 rounded-lg border focus:border-black focus:ring-2 focus:ring-black/20 outline-none"
              value={values.name || ""}
              onChange={(e) => setValues({ ...values, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Catégorie</label>
            <Select
              placeholder="Sélectionner"
              data={categories.map((category) => category.name)}
              value={values.category_name}
              onChange={(value) => {
                const clotheCategory = categories.find((category) => category.name === value);
                setValues({ ...values, category_id: clotheCategory?._id, category_name: clotheCategory?.name });
              }}
              className="w-full max-w-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Prix (€)</label>
            <input
              type="number"
              step="0.01"
              className="w-full px-4 py-2 rounded-lg border focus:border-black focus:ring-2 focus:ring-black/20 outline-none"
              value={values.price || ""}
              onChange={(e) => {
                const sanitized = e.target.value.replace(/,/g, ".");
                if (sanitized === ".") return;
                if (!/^\d*\.?\d*$/.test(sanitized)) return;
                setValues({ ...values, price: sanitized });
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tailles</label>
            <div className="space-y-2 p-3 bg-gray-50 rounded-lg border">
              {["XS", "S", "M", "L", "XL", "XXL"].map((sizeValue) => {
                const sizeObj = values.size?.find((size) => size.type === sizeValue);
                const isSelected = !!sizeObj;

                return (
                  <div key={sizeValue} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 py-2 border-b last:border-0 border-gray-100">
                    <label className="flex items-center gap-2 cursor-pointer w-20">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded cursor-pointer"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setValues({
                              ...values,
                              size: [...(values.size || []), { type: sizeValue, display_shop: true, stock_available: 1 }],
                            });
                          } else {
                            setValues({
                              ...values,
                              size: (values.size || []).filter((s) => s.type !== sizeValue),
                            });
                          }
                        }}
                      />
                      <span className="text-sm font-medium">{sizeValue}</span>
                    </label>
                    {isSelected && (
                      <div className="flex flex-wrap items-center gap-4 text-sm w-full">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded cursor-pointer"
                            checked={sizeObj.display_shop}
                            onChange={(e) => {
                              setValues({
                                ...values,
                                size: (values.size || []).map((s) => (s.type === sizeValue ? { ...s, display_shop: e.target.checked } : s)),
                              });
                            }}
                          />
                          <span className="text-xs text-gray-600">En ligne</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-8">Qté:</span>
                          <input
                            type="number"
                            min="0"
                            className="w-16 px-2 py-1 text-sm rounded border focus:border-black outline-none"
                            value={sizeObj.stock_available}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 0;
                              setValues({
                                ...values,
                                size: (values.size || []).map((s) => (s.type === sizeValue ? { ...s, stock_available: value } : s)),
                              });
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 w-16">Poids (g):</span>
                          <input
                            type="number"
                            min="0"
                            className="w-16 px-2 py-1 text-sm rounded border focus:border-black outline-none"
                            value={sizeObj.weight_g}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 0;
                              setValues({
                                ...values,
                                size: (values.size || []).map((s) => (s.type === sizeValue ? { ...s, weight_g: value } : s)),
                              });
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              className="w-full px-4 py-2 rounded-lg border focus:border-black focus:ring-2 focus:ring-black/20 outline-none h-32 resize-none"
              value={values.description || ""}
              onChange={(e) => setValues({ ...values, description: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Coupe</label>
            <input
              className="w-full px-4 py-2 rounded-lg border focus:border-black focus:ring-2 focus:ring-black/20 outline-none"
              value={values.fit || ""}
              onChange={(e) => {
                const cleanedValue = e.target.value.toLowerCase().replace(/[^a-z]/g, "");
                setValues({ ...values, fit: cleanedValue });
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Image</label>
            <div className="space-y-3">
              {Array.isArray(values.image) && values.image.length > 0 ? (
                <div className="space-y-3">
                  <div className="relative">
                    <img src={values.image[currentImageIndex]} alt={`Photo ${currentImageIndex + 1}`} className="w-full max-h-64 object-contain rounded-lg border bg-gray-50" />
                    {values.image.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteImage(currentImageIndex);
                        }}
                        className="absolute right-2 top-2 bg-white/90 p-1 rounded-full shadow text-red-600"
                        title="Supprimer la photo"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                    {values.image.length > 1 && (
                      <>
                        <button
                          onClick={() => setCurrentImageIndex((index) => (index - 1 + values.image.length) % values.image.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow"
                          aria-label="Previous image"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setCurrentImageIndex((index) => (index + 1) % values.image.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow"
                          aria-label="Next image"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>

                  {values.image.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {values.image.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`h-14 w-14 flex-shrink-0 rounded border overflow-hidden ${currentImageIndex === index ? "ring-2 ring-black" : ""}`}
                        >
                          <img src={img} alt={`Thumb ${index + 1}`} className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                values.image && <img src={values.image} alt="Photo" className="w-full max-h-64 object-contain rounded-lg border bg-gray-50" />
              )}
              <FileInput
                name="image"
                folder="clothes"
                buttonText={Array.isArray(values.image) ? "Ajouter" : "Changer"}
                onChange={(e) => {
                  const newImage = e.target.value;
                  setValues({
                    ...values,
                    image: Array.isArray(values.image) ? [...values.image, newImage] : values.image ? [values.image, newImage] : [newImage],
                  });
                }}
                buttonClassName="w-full py-2 px-4 text-sm bg-white border rounded-lg hover:bg-gray-50"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <LoadingButton loading={loading} onClick={updateClothe} className="py-2.5 px-6 text-sm text-white bg-black rounded-lg hover:bg-gray-800">
          Mettre à jour
        </LoadingButton>
        <button onClick={deleteClothe} className="py-2.5 px-6 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700">
          Supprimer
        </button>
      </div>
    </div>
  );
}
