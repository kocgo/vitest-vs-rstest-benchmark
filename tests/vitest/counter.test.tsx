import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from '../../src/components/Counter';

describe('Counter (vitest)', () => {
  it('increments and decrements using the configured step', async () => {
    const user = userEvent.setup();
    render(<Counter initialCount={5} step={2} />);

    await user.click(screen.getByLabelText('increment'));
    await user.click(screen.getByLabelText('increment'));
    await user.click(screen.getByLabelText('decrement'));

    expect(screen.getByLabelText('count-value')).toHaveTextContent('7');
  });

  it('resets to the starting value', async () => {
    const user = userEvent.setup();
    render(<Counter initialCount={10} step={5} />);

    await user.click(screen.getByLabelText('increment'));
    await user.click(screen.getByLabelText('increment'));
    await user.click(screen.getByLabelText('reset'));

    expect(screen.getByLabelText('count-value')).toHaveTextContent('10');
  });
});
