
'use client';

import React from 'react';

interface Step {
  number: number;
  title: string;
  description: string;
}

interface ProgressStepsProps {
  currentStep: number;
  steps: Step[];
}

export default function ProgressSteps({ currentStep, steps }: ProgressStepsProps) {
  return (
    <div className="flex items-center justify-between mb-8 max-w-4xl">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              currentStep >= step.number
                ? 'bg-primary border-primary text-primary-foreground'
                : 'border-muted-foreground text-muted-foreground'
            }`}
            data-testid={`step-${step.number}`}
          >
            {step.number}
          </div>
          <div className="ml-3 hidden md:block">
            <div
              className={`text-sm font-medium ${
                currentStep >= step.number ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {step.title}
            </div>
            <div className="text-xs text-muted-foreground">{step.description}</div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`hidden md:block w-24 h-0.5 ml-8 ${
                currentStep > step.number ? 'bg-primary' : 'bg-muted'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
