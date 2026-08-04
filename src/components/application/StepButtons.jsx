function StepButtons({
  onPrevious,
  onNext,
  previousText = "Previous",
  nextText = "Next",
  loading = false,
}) {
  return (
    <div className="mt-10 flex justify-between">
      <button
        type="button"
        onClick={onPrevious}
        className="rounded-lg border px-6 py-3"
      >
        {previousText}
      </button>

      <button
        type="submit"
        disabled={loading}
        onClick={onNext}
        className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Saving..." : nextText}
      </button>
    </div>
  );
}

export default StepButtons;