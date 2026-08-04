import ProgressBar from "./ProgressBar";

function StepHeader({
  title,
  description,
  step,
  totalSteps,
}) {
  return (
    <>
      <h1 className="text-3xl font-bold">
        {title}
      </h1>

      <p className="mb-8 mt-2 text-gray-600">
        {description}
      </p>

      <ProgressBar
        step={step}
        totalSteps={totalSteps}
      />
    </>
  );
}

export default StepHeader;