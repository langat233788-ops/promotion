function FormSelect({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
}) {
  return (
    <div>
      <label className="mb-2 block font-medium">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-gray-300 p-3 focus:border-blue-600 focus:outline-none"
      >
        <option value="">Select...</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FormSelect;