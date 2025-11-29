import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from '../../src/components/Counter';

describe('Counter (rstest)', () => {
  it('tracks increments and decrements', async () => {
    const user = userEvent.setup();
    render(<Counter initialCount={3} step={3} />);

    await user.click(screen.getByLabelText('increment'));
    await user.click(screen.getByLabelText('increment'));
    await user.click(screen.getByLabelText('decrement'));

    expect(screen.getByLabelText('count-value')).toHaveTextContent('6');
  });

  it('notifies listeners on change', async () => {
    const user = userEvent.setup();
    const changes: number[] = [];
    render(<Counter initialCount={1} onChange={(value) => changes.push(value)} />);

    await user.click(screen.getByLabelText('increment'));
    await user.click(screen.getByLabelText('decrement'));

    expect(changes).toEqual([2, 1]);
  });
});
