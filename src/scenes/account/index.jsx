import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiLock } from "react-icons/fi";
import { HiCamera, HiTrash } from "react-icons/hi2";

import useStore from "../../store";
import api from "../../services/api";
import Loader from "../../components/Loader";
import FileInput from "../../components/FileInput";

function Avatar({ value, onChange, name }) {
  const handleDelete = () => {
    onChange({ target: { value: "", name } });
    toast.success("Avatar supprimé");
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 bg-gray-100">
        {value ? (
          <img className="w-full h-full object-cover" src={value} alt="avatar" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <HiCamera className="w-8 h-8" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <FileInput
          value={value}
          onChange={onChange}
          name={name}
          folder="avatars"
          multiple={false}
          buttonText={value ? "Changer l'avatar" : "Ajouter un avatar"}
          buttonClassName="px-4 py-2 text-sm font-medium text-black bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50"
        />
        {value && (
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
          >
            <HiTrash className="w-4 h-4" />
            Supprimer
          </button>
        )}
      </div>
    </div>
  );
}

export default function Account() {
  const { user, setUser } = useStore();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    name: "",
    email: "",
    avatar: "",
  });

  useEffect(() => {
    if (user) {
      setValues({
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { ok, data } = await api.put("/admin", values);
      if (!ok) throw new Error();
      setUser(data);
      toast.success("Profil mis à jour avec succès !");
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de la mise à jour du profil");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <Loader />;

  return (
    <div className="h-full p-8 overflow-auto">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mon compte</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Information Card */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Informations du profil</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Avatar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
                <Avatar
                  value={values.avatar}
                  name="avatar"
                  onChange={(e) => {
                    setValues({ ...values, avatar: e.target.value });
                  }}
                />
              </div>

              {/* Name */}
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                  <FiUser className="mr-2 text-black" size={18} />
                  Nom
                </label>
                <input
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  placeholder="Votre nom"
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20 transition-all text-gray-900 outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                  <FiMail className="mr-2 text-black" size={18} />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20 transition-all text-gray-900 outline-none"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg text-base font-semibold text-white transition-all bg-black hover:bg-gray-800 shadow-lg shadow-black/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Enregistrement..." : "Enregistrer les modifications"}
                </button>
              </div>
            </form>
          </div>

          {/* Password Section */}
          <PasswordSection />
        </div>
      </div>
    </div>
  );
}

function PasswordSection() {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    password: "",
    newPassword: "",
    verifyPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (values.newPassword !== values.verifyPassword) {
      return toast.error("Les mots de passe ne correspondent pas");
    }
    if (values.newPassword.length < 6) {
      return toast.error("Le mot de passe doit contenir au moins 6 caractères");
    }
    setLoading(true);
    try {
      const { ok } = await api.post("/admin/reset_password", values);
      if (!ok) throw new Error();
      toast.success("Mot de passe mis à jour avec succès !");
      setValues({ password: "", newPassword: "", verifyPassword: "" });
    } catch (e) {
      console.error(e);
      toast.error("Erreur lors de la mise à jour du mot de passe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col">
      <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
        <FiLock className="mr-2 text-black" size={20} />
        Changer le mot de passe
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col flex-1">
        <div className="space-y-4 flex-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20 transition-all text-gray-900 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
            <input
              type="password"
              name="newPassword"
              value={values.newPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20 transition-all text-gray-900 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le nouveau mot de passe</label>
            <input
              type="password"
              name="verifyPassword"
              value={values.verifyPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20 transition-all text-gray-900 outline-none"
            />
          </div>
        </div>
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || !values.password || !values.newPassword || !values.verifyPassword}
            className="w-full py-3 rounded-lg text-base font-semibold text-white transition-all bg-gray-800 hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
          </button>
        </div>
      </form>
    </div>
  );
}
