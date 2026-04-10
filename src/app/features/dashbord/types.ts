export type ExpensesByCategory = {
  id: number;
  categoryId: number;
  categoryName: string;
  totalAmount: number;
  color: string;
};

export type PieChartData = {
  labels: string[];
  datasets: PieChartDataset[];
};

type PieChartDataset = {
  data: number[];
  backgroundColor: string[];
  hoverBackgroundColor: string[];
};
