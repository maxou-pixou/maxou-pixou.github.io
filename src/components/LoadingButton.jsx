import React from "react";

export default ({ loading, children, disabled, className = "", ...rest }) => {
  return (
    <button
      {...rest}
      disabled={loading || disabled}
      className={`flex items-center justify-center transition-all ${loading || disabled ? "opacity-70 cursor-not-allowed" : "cursor-pointer"} ${className}`}
    >
      {loading && (
        <div className="flex justify-center items-center mr-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {children}
    </button>
  );
};
