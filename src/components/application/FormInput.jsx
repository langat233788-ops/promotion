function FormInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  required = false,
  readOnly = false,
  placeholder = "",
}) {
  return (
    <div>
      <label className="mb-2 block font-medium">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-600 focus:outline-none"
      />
    </div>
  );
}

export default FormInput;