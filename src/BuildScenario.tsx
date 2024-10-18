import { useState } from 'react'
import { Button } from 'antd'

const steps = [
  "Define your project requirements",
  "Set up the development environment",
  "Create the basic project structure",
  "Implement core functionality",
  "Test and debug",
  "Deploy your project"
]

interface Tool {
  id: number;
  name: string;
  description: string;
}

export default function BuildScenario({ tool }: { tool: Tool }) {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Building with {tool.name}</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Step {currentStep + 1}: {steps[currentStep]}</h2>
        <p className="mb-6">Here you would see detailed instructions for this step using {tool.name}.</p>
        <div className="flex justify-between">
          <Button onClick={handlePrevious} disabled={currentStep === 0}>
            Previous
          </Button>
          <Button onClick={handleNext} disabled={currentStep === steps.length - 1}>
            {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  )
}