import { render, screen } from '@testing-library/react';
import { Greeting } from '../../src/components/Greeting';

describe('Greeting (vitest)', () => {
  it('renders the provided name and punctuation', () => {
    render(<Greeting name="Bench" excited />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hello, Bench!');
  });

  it('falls back to a calmer suffix when not excited', () => {
    render(<Greeting name="Bench" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hello, Bench.');
  });
});
