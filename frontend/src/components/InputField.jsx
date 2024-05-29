import React from "react";

export default function InputField({
  label,
  type,
  id,
  value,
  onChange,
  autoComplete,
}) {
  return (
    <div className="rounded-xl pt-4 text-black flex flex-col items-center">
      <label className="text-slate-700" htmlFor={id}></label>
      <input
        className="border border-gray-300 bg-white w-auto mt-3 px-4 py-2 rounded-lg"
        type={type}
        id={id}
        name={id} // add this line so that FormData can pick it up by name
        aria-label={label}
        placeholder={label}
        value={value} // controlled component
        onChange={onChange} // event handler
        autoComplete={autoComplete}
      />
    </div>
  );
}
