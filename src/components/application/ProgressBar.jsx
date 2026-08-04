function ProgressBar({ step, totalSteps }) {
  const percentage = (step / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="mb-2 flex justify-between">
        <span className="font-semibold">
          Step {step} of {totalSteps}
        </span>

        <span className="font-semibold">
          {Math.round(percentage)}%
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;