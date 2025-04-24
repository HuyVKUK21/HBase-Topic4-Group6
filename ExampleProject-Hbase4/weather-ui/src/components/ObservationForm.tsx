import { useState } from "react";

interface ObservationFormProps {
  onSubmit: (temperature: number) => Promise<void>;
}

export default function ObservationForm({ onSubmit }: ObservationFormProps) {
  const [temperature, setTemperature] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    const tempValue = parseFloat(temperature);
    if (isNaN(tempValue)) {
      setError("Please enter a valid temperature");
      return;
    }
    
    if (tempValue < -100 || tempValue > 100) {
      setError("Temperature must be between -100°C and 100°C");
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      await onSubmit(tempValue);
      setTemperature(""); // Clear form after successful submission
    } catch (err) {
      setError("Failed to submit observation");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-1">
          Temperature (°C)
        </label>
        <div className="flex rounded-md shadow-sm">
          <input
            type="number"
            id="temperature"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            className="flex-1 block w-full rounded-md border-gray-300 border p-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Enter temperature"
            step="0.1"
            required
          />
          <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
            °C
          </span>
        </div>
      </div>
      
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          isSubmitting ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {isSubmitting ? "Submitting..." : "Add Observation"}
      </button>
    </form>
  );
}