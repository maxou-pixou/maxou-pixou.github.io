import React, { useState } from "react";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import { IoIosClose } from "react-icons/io";

const MultipleSelectInput = ({ value, label = "", placeholder = "", onChange }) => {
  const [inputValue, setInputValue] = useState("");

  React.useEffect(() => {
    setInputValue("");
  }, [value]);

  return (
    <div className="w-full">
      <div className="px-1 text-sm text-gray-700 font-medium mb-2">{label}</div>
      <div className="relative w-full">
        <TagsInput
          className="text-sm rounded-lg block w-full"
          inputProps={{
            placeholder: placeholder,
            className: "w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-black focus:ring-2 focus:ring-black/20 transition-all outline-none",
          }}
          renderLayout={(tagComponents, inputComponent) => (
            <div className="flex flex-col gap-4">
              <div className="rounded-lg">{inputComponent}</div>
              <div className="flex gap-2 flex-wrap border border-gray-200 rounded-lg min-h-[80px] p-3 bg-gray-50">
                {tagComponents.length > 0 ? tagComponents : <span className="text-gray-400 text-sm italic">No tags added</span>}
              </div>
            </div>
          )}
          renderTag={({ tag, key }) => (
            <span key={key} className="px-3 py-1 bg-gray-100 text-black text-xs font-semibold rounded-full flex items-center gap-1 transition-all border border-gray-200">
              {tag}
              <button type="button" onClick={() => onChange(value.filter((e) => e !== tag))} className="hover:text-red-500 focus:outline-none transition-colors">
                <IoIosClose className="h-4 w-4" />
              </button>
            </span>
          )}
          value={value}
          onChange={onChange}
          inputValue={inputValue}
          onChangeInput={setInputValue}
        />
      </div>
    </div>
  );
};

export default MultipleSelectInput;
