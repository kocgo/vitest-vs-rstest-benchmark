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

describe('SalesGrid (rstest)', () => {
  it('renders the dataset and responds to quick filter changes', async () => {
    const { rerender, api } = await renderGrid();

    expect(api.getDisplayedRowCount()).toBe(rows.length);

    rerender(<SalesGrid rows={rows} quickFilterText="APAC" onGridReady={(gridApi) => {}} />);

    await waitFor(() => expect(api.getDisplayedRowCount()).toBe(50));
    expect(screen.queryByRole('gridcell', { name: /AMER/ })).toBeNull();
  });

  it('sorts revenue and tracks selected rows', async () => {
    const user = userEvent.setup();
    const selections: Array<ReturnType<GridApi['getSelectedRows']>> = [];
    const { api, container } = await renderGrid({ onSelectionChange: (rows) => selections.push(rows) });

    api.applyColumnState({ state: [{ colId: 'revenue', sort: 'desc' }] });

    await waitFor(() => expect(api.getDisplayedRowAtIndex(0)?.data?.revenue).toBe(13425));

    const nodes = container.querySelectorAll('.ag-center-cols-container .ag-row');
    await user.click(nodes[0] as HTMLElement);
    await user.click(nodes[1] as HTMLElement);

    expect(selections.at(-1)?.length).toBe(2);
  });
});
