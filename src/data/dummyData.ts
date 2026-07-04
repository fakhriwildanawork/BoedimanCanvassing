import { StatItem, ChartDataPoint, ProjectItem, OrderItem } from '../types';

export const stats: StatItem[] = [
  { id: 1, title: "Today's Money", value: "$53,000", change: "+55%", isPositive: true, icon: "Wallet" },
  { id: 2, title: "Today's Users", value: "2,300", change: "+5%", isPositive: true, icon: "Globe" },
  { id: 3, title: "New Clients", value: "+3,052", change: "-14%", isPositive: false, icon: "FileText" },
  { id: 4, title: "Total Sales", value: "$173,000", change: "+8%", isPositive: true, icon: "ShoppingCart" },
];

export const activeUsersData: ChartDataPoint[] = [
  { name: 'Jan', value: 300 },
  { name: 'Feb', value: 250 },
  { name: 'Mar', value: 400 },
  { name: 'Apr', value: 300 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 350 },
  { name: 'Jul', value: 400 },
  { name: 'Aug', value: 450 },
  { name: 'Sep', value: 550 },
];

export const salesOverviewData: ChartDataPoint[] = [
  { name: 'Jan', value: 50 },
  { name: 'Feb', value: 40 },
  { name: 'Mar', value: 300 },
  { name: 'Apr', value: 220 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 250 },
  { name: 'Jul', value: 400 },
  { name: 'Aug', value: 230 },
  { name: 'Sep', value: 500 },
  { name: 'Oct', value: 450 },
  { name: 'Nov', value: 300 },
  { name: 'Dec', value: 400 },
];

export const projects: ProjectItem[] = [
  { id: 1, name: "Chakra Vision UI Version", logo: "https://i.pravatar.cc/150?u=1", members: ["https://i.pravatar.cc/150?u=1", "https://i.pravatar.cc/150?u=2", "https://i.pravatar.cc/150?u=3", "https://i.pravatar.cc/150?u=4", "https://i.pravatar.cc/150?u=5"], budget: "$14,000", completion: 60 },
  { id: 2, name: "Add Progress Track", logo: "https://i.pravatar.cc/150?u=2", members: ["https://i.pravatar.cc/150?u=6", "https://i.pravatar.cc/150?u=7"], budget: "$3,000", completion: 10 },
  { id: 3, name: "Fix Platform Errors", logo: "https://i.pravatar.cc/150?u=3", members: ["https://i.pravatar.cc/150?u=8", "https://i.pravatar.cc/150?u=9"], budget: "Not set", completion: 100 },
  { id: 4, name: "Launch our Mobile App", logo: "https://i.pravatar.cc/150?u=4", members: ["https://i.pravatar.cc/150?u=10", "https://i.pravatar.cc/150?u=11", "https://i.pravatar.cc/150?u=12", "https://i.pravatar.cc/150?u=13"], budget: "$20,500", completion: 100 },
  { id: 5, name: "Add the New Pricing Page", logo: "https://i.pravatar.cc/150?u=5", members: ["https://i.pravatar.cc/150?u=14", "https://i.pravatar.cc/150?u=15"], budget: "$500", completion: 25 },
  { id: 6, name: "Redesign New Online Shop", logo: "https://i.pravatar.cc/150?u=6", members: ["https://i.pravatar.cc/150?u=16", "https://i.pravatar.cc/150?u=17", "https://i.pravatar.cc/150?u=18"], budget: "$2,000", completion: 40 },
];

export const orders: OrderItem[] = [
  { id: 1, title: "$2400, Design changes", date: "22 DEC 7:20 PM", icon: "Bell", color: "text-teal-400" },
  { id: 2, title: "New order #1832412", date: "21 DEC 11 PM", icon: "ShoppingCart", color: "text-red-500" },
  { id: 3, title: "Server payments for April", date: "21 DEC 9:34 PM", icon: "CreditCard", color: "text-blue-500" },
  { id: 4, title: "New card added for order #4395133", date: "20 DEC 2:20 AM", icon: "Wallet", color: "text-orange-500" },
  { id: 5, title: "Unlock packages for development", date: "18 DEC 4:54 AM", icon: "Wrench", color: "text-purple-500" },
  { id: 6, title: "New order #9583120", date: "17 DEC", icon: "ShoppingCart", color: "text-gray-400" },
];
