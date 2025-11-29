import { useMemo } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef, GridApi } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

export type SaleRecord = {
  id: number;
  region: string;
  salesperson: string;
  product: string;
  units: number;
  revenue: number;
};

export type SalesGridProps = {
  rows: SaleRecord[];
  quickFilterText?: string;
  onSelectionChange?: (selected: SaleRecord[]) => void;
  onGridReady?: (api: GridApi<SaleRecord>) => void;
};

export function SalesGrid({ rows, quickFilterText = '', onSelectionChange, onGridReady }: SalesGridProps) {
  const columnDefs = useMemo<ColDef[]>(() => (
    [
      { field: 'id', headerName: 'ID', width: 80, pinned: 'left', filter: 'agNumberColumnFilter' },
      { field: 'region', filter: true },
      { field: 'salesperson', headerName: 'Sales Rep', filter: true },
      { field: 'product', filter: true },
      {
        field: 'units',
        headerName: 'Units Sold',
        filter: 'agNumberColumnFilter',
        valueFormatter: (params) => params.value.toLocaleString()
      },
      {
        field: 'revenue',
        headerName: 'Revenue',
        filter: 'agNumberColumnFilter',
        valueFormatter: (params) => `$${params.value.toLocaleString()}`
      }
    ]
  ), []);

  const defaultColDef = useMemo<ColDef>(() => ({
    sortable: true,
    resizable: true
  }), []);

  return (
    <div className="ag-theme-alpine" style={{ width: '100%', height: 600 }}>
      <AgGridReact<SaleRecord>
        rowData={rows}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        animateRows
        ensureDomOrder
        domLayout="autoHeight"
        suppressRowVirtualisation
        rowSelection="multiple"
        rowMultiSelectWithClick
        quickFilterText={quickFilterText}
        onGridReady={(event) => onGridReady?.(event.api)}
        onSelectionChanged={(event) => onSelectionChange?.(event.api.getSelectedRows() as SaleRecord[])}
      />
    </div>
  );
}
