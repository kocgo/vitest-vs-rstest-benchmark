import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SalesGrid } from '../../src/components/SalesGrid';
import { buildSalesRecords } from '../agGridFixtures';
import type { GridApi } from 'ag-grid-community';

const rows = buildSalesRecords(200);

async function renderGrid(props: Partial<React.ComponentProps<typeof SalesGrid>> = {}) {
  let api: GridApi | null = null;
  const renderResult = render(
    <SalesGrid
      rows={rows}
      quickFilterText=""
      onGridReady={(gridApi) => {
        api = gridApi;
      }}
      {...props}
    />
  );

  await waitFor(() => expect(api).not.toBeNull());
  return { api: api!, ...renderResult };
}

describe('SalesGrid (vitest)', () => {
  it('renders all rows and filters them with a quick filter', async () => {
    const { rerender, api } = await renderGrid();

    expect(api.getDisplayedRowCount()).toBe(rows.length);

    rerender(<SalesGrid rows={rows} quickFilterText="EMEA" onGridReady={(gridApi) => {}} />);

    await waitFor(() => expect(api.getDisplayedRowCount()).toBe(50));
    expect(screen.queryByRole('gridcell', { name: /AMER/ })).toBeNull();
  });

  it('supports sorting revenue and multi-row selection', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    const { api, container } = await renderGrid({ onSelectionChange });

    api.applyColumnState({ state: [{ colId: 'revenue', sort: 'desc' }] });

    await waitFor(() => expect(api.getDisplayedRowAtIndex(0)?.data?.revenue).toBe(13425));

    const nodes = container.querySelectorAll('.ag-center-cols-container .ag-row');
    await user.click(nodes[0] as HTMLElement);
    await user.click(nodes[1] as HTMLElement);

    expect(onSelectionChange).toHaveBeenCalledTimes(2);
    const lastSelected = onSelectionChange.mock.calls.at(-1)[0];
    expect(lastSelected).toHaveLength(2);
  });
});
