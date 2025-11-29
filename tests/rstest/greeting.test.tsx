import { render, screen } from '@testing-library/react';
import { Greeting } from '../../src/components/Greeting';

describe('Greeting (rstest)', () => {
  it('renders punctuation when excited', () => {
    render(<Greeting name="Scaler" excited />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hello, Scaler!');
  });

  it('renders punctuation when calm', () => {
    render(<Greeting name="Scaler" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hello, Scaler.');
  });
});
