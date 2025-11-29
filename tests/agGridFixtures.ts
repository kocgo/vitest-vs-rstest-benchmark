import type { SaleRecord } from '../src/components/SalesGrid';

const regions = ['AMER', 'EMEA', 'APAC', 'LATAM'];
const products = ['Router', 'Switch', 'Firewall', 'SD-WAN'];
const reps = ['Inez', 'Shawn', 'Priya', 'Sven', 'Heidi'];

export function buildSalesRecords(count: number): SaleRecord[] {
  return Array.from({ length: count }, (_, index) => {
    const units = 25 + ((index * 7) % 120);
    const revenue = 1500 + (index * 275) % 12000;

    return {
      id: index + 1,
      region: regions[index % regions.length],
      salesperson: reps[index % reps.length],
      product: products[index % products.length],
      units,
      revenue
    };
  });
}
