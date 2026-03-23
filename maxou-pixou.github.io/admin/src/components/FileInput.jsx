import React, { useState, useRef } from "react";
import toast from "react-hot-toast";

import api from "../services/api";

const FileInput = ({ value, onChange, name, folder, buttonText = "Télécharger", buttonClassName = "", multiple = false }) => {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const handleFileChange = async (e) => {
    try {
      setLoading(true);
      const files = [];
      const f = e.target.files;

      if (f.length === 0) return;

      for (let i = 0; i < f.length; i++) {
        const file = f[i];
        const rawBody = await readFileAsync(file);
        files.push({ rawBody, name: file.name });
      }

      const { data, ok } = await api.post(`/file`, { files, folder });

      if (!ok) throw new Error("Le téléchargement a échoué");

      const resultValue = multiple ? data : Array.isArray(data) ? data[0] : data;

      onChange({ target: { value: resultValue, name } });
      toast.success("Fichier téléchargé avec succès !");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du téléchargement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <input ref={inputRef} id={`openFile-${name}`} type="file" accept="image/*" multiple={multiple} onChange={handleFileChange} className="hidden" />
      <button type="button" onClick={() => inputRef.current.click()} disabled={loading} className={buttonClassName}>
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Téléchargement...</span>
          </div>
        ) : (
          buttonText
        )}
      </button>
    </>
  );
};

export default FileInput;

function readFileAsync(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
