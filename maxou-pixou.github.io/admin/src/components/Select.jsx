import React, { useState } from "react";
import { Combobox } from "@headlessui/react";
import { FiChevronDown } from "react-icons/fi";

export default ({ placeholder = "Sélectionner", data, value, onChange, search = true, className = "min-w-40 max-w-52" }) => {
  const [arr, setArr] = useState(data || []);

  function find(str) {
    const regex = new RegExp("^" + str, "i");
    const newArr = data.filter((name) => name.match(regex));
    setArr(newArr);
  }

  return (
    <Combobox value={value || ""} onChange={onChange}>
      <div className="relative cursor-pointer space-y-3">
        <Combobox.Button
          className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20 transition-all text-left items-center justify-between truncate flex gap-3 ${className}`}
        >
          <div className="truncate">{value ? value : placeholder}</div>
          <FiChevronDown className="text-xl flex-shrink-0" aria-hidden="true" />
        </Combobox.Button>
        <Combobox.Options className="absolute top-full left-0 w-full rounded-lg bg-white text-base shadow-lg ring-1 ring-gray-200 ring-opacity-5 focus:outline-none z-10 border border-gray-200">
          {search && (
            <Combobox.Input
              onChange={(event) => find(event.target.value)}
              placeholder="Rechercher"
              className="w-full bg-gray-50 py-2.5 px-4 border-0 focus:ring-0 focus:ring-offset-0 text-base font-medium text-gray-900 rounded-t-lg"
            />
          )}
          <div className="overflow-auto max-h-80">
            {arr.map((string) => (
              <Combobox.Option key={string} value={string}>
                {({ selected, active }) => (
                  <div
                    className={`relative cursor-pointer select-none text-sm py-2 border-0 px-4 transition-colors ${selected ? "bg-gray-100 text-black font-medium" : active ? "bg-gray-50" : ""
                      }`}
                  >
                    {string}
                  </div>
                )}
              </Combobox.Option>
            ))}
          </div>
        </Combobox.Options>
      </div>
    </Combobox>
  );
};
