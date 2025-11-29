import { act } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SalesGrid } from '../../src/components/SalesGrid';
import { buildSalesRecords } from '../agGridFixtures';
import type { GridApi } from 'ag-grid-community';
import type { SaleRecord } from '../../src/components/SalesGrid';

const rows = buildSalesRecords(200);

async function renderGrid(
  props: Partial<React.ComponentProps<typeof SalesGrid>> & { rows?: SaleRecord[] } = {}
) {
  const { rows: overrideRows, suppressRowVirtualisation = false, ...rest } = props;
  let api: GridApi | null = null;
  const renderResult = render(
    <SalesGrid
      rows={overrideRows ?? rows}
      quickFilterText=""
      suppressRowVirtualisation={suppressRowVirtualisation}
      onGridReady={(gridApi) => {
        api = gridApi;
      }}
      {...rest}
    />
  );

  await waitFor(() => expect(api).not.toBeNull());
  return { api: api!, ...renderResult };
}

describe('SalesGrid (rstest)', () => {
  it('renders the dataset and responds to quick filter changes', async () => {
    const { api } = await renderGrid();

    expect(api.getDisplayedRowCount()).toBe(rows.length);

    await act(async () => {
      api.setGridOption('quickFilterText', 'APAC');
    });
    await waitFor(() => expect(api.getDisplayedRowCount()).toBe(50));
    expect(screen.queryByRole('gridcell', { name: /AMER/ })).toBeNull();
  });

  describe.each([
    { count: 100, expectedMatches: 25 },
    { count: 1_000, expectedMatches: 250 },
    { count: 10_000, expectedMatches: 2_500 }
  ])('quick filter scales with $count rows', ({ count, expectedMatches }) => {
    it('applies quick filter text across the dataset', async () => {
    const sampleRows = buildSalesRecords(count);
    const { api } = await renderGrid({ rows: sampleRows });

    expect(api.getDisplayedRowCount()).toBe(count);

      await act(async () => {
        api.setGridOption('quickFilterText', 'APAC');
      });
      await waitFor(() => expect(api.getDisplayedRowCount()).toBe(expectedMatches));
    });
  });

  it('sorts revenue and tracks selected rows', async () => {
    const user = userEvent.setup();
    const selections: Array<ReturnType<GridApi['getSelectedRows']>> = [];
    const { api, container } = await renderGrid({ onSelectionChange: (rows) => selections.push(rows) });

    await act(async () => {
      api.applyColumnState({ state: [{ colId: 'revenue', sort: 'desc' }] });
    });

    await waitFor(() => expect(api.getDisplayedRowAtIndex(0)?.data?.revenue).toBe(13425));

    const nodes = container.querySelectorAll('.ag-center-cols-container .ag-row');
    await user.click(nodes[0] as HTMLElement);
    await user.click(nodes[1] as HTMLElement);

    expect(selections.at(-1)?.length).toBe(2);
  });
});
