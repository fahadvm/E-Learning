'use client';

import React from 'react';
import { Button } from '@/componentssss/ui/button';

interface Step {
  number: number;
  title: string;
  description: string;
}

interface NavigationProps {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  canProceed: any;
  isSubmitting: boolean;
  handleSubmit: () => void;
  isPublished: boolean;
  steps: Step[];
}

export default function Navigation({
  currentStep,
  setCurrentStep,
  canProceed,
  isSubmitting,
  handleSubmit,
  isPublished,
  steps,
}: NavigationProps) {
  return (
    <div className="flex items-center justify-between">
      <Button
        variant="outline"
        onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
        disabled={currentStep === 1}
        data-testid="button-previous-step"
      >
        Previous
      </Button>

      <div className="flex items-center space-x-2">
        {currentStep < 4 ? (
          <Button
            onClick={() => setCurrentStep(prev => prev + 1)}
            disabled={!canProceed}
            data-testid="button-next-step"
          >
            Next: {steps[currentStep]?.title}
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !canProceed}
            data-testid="button-create-course"
          >
            {isSubmitting
              ? 'Creating Course...'
              : isPublished
              ? 'Create & Publish Course'
              : 'Create Course Draft'}
          </Button>
        )}
      </div>
    </div>
  );
}
