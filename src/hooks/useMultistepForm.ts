import { useState, type ReactElement } from "react";

// Explained by Web Dev simplified: https://youtu.be/uDCBSnWkuH0
/**
 * A custom hook for managing a multi-step form.
 * @param steps - An array of React elements representing the different steps of the form.
 * @returns An object containing the current step index, the current step component, the array of steps, boolean values indicating if it's the first or last step, and functions to navigate between steps.
 * @example
 * const { CurrentStepIndex, step, isFirstStep, isLastStep, next, back } = useMultistepForm([<Step1 />, <Step2 />, <Step3 />]);
 */
export function useMultistepForm(steps: ReactElement[]) {
  const [CurrentStepIndex, setCurrentStepIndex] = useState<number>(0);

  function next() {
    setCurrentStepIndex((prevIndex) => {
      if (prevIndex >= steps.length - 1) return prevIndex;
      return prevIndex + 1;
    });
  }

  function back() {
    setCurrentStepIndex((prevIndex) => {
      if (prevIndex <= 0) return prevIndex;
      return prevIndex - 1;
    });
  }

  function goTo(index: number) {
    setCurrentStepIndex(index);
  }

  return {
    CurrentStepIndex,
    step: steps[CurrentStepIndex],
    steps,
    isFirstStep: CurrentStepIndex === 0,
    isLastStep: CurrentStepIndex === steps.length - 1,
    next,
    back,
    goTo,
  };
}
