export interface StatItem {
  id: number;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface ProjectItem {
  id: number;
  name: string;
  logo: string;
  members: string[];
  budget: string;
  completion: number;
}

export interface OrderItem {
  id: number;
  title: string;
  date: string;
  icon: string;
  color: string;
}
