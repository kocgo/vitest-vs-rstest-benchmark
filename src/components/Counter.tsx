import { useState } from 'react';

export type CounterProps = {
  initialCount?: number;
  step?: number;
  onChange?: (nextValue: number) => void;
};

export function Counter({ initialCount = 0, step = 1, onChange }: CounterProps) {
  const [count, setCount] = useState(initialCount);

  const increment = () => {
    setCount((current) => {
      const next = current + step;
      onChange?.(next);
      return next;
    });
  };

  const decrement = () => {
    setCount((current) => {
      const next = current - step;
      onChange?.(next);
      return next;
    });
  };

  const reset = () => {
    setCount(initialCount);
    onChange?.(initialCount);
  };

  return (
    <div aria-label="counter">
      <p aria-label="count-value">{count}</p>
      <div className="actions">
        <button onClick={increment} aria-label="increment">
          +{step}
        </button>
        <button onClick={decrement} aria-label="decrement">
          -{step}
        </button>
        <button onClick={reset} aria-label="reset">
          Reset
        </button>
      </div>
    </div>
  );
}
