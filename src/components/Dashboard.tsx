import { stats } from '../data/dummyData';
import StatCard from './StatCard';
import HeroRow from './HeroRow';
import ActiveUsersChart from './ActiveUsersChart';
import SalesOverviewChart from './SalesOverviewChart';
import ProjectsTable from './ProjectsTable';
import OrdersOverview from './OrdersOverview';

export default function Dashboard() {
  return (
    <div className="flex-1 w-full pb-10">
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map(stat => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>
      
      {/* Hero Row */}
      <HeroRow />
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        <div className="lg:col-span-5">
          <ActiveUsersChart />
        </div>
        <div className="lg:col-span-7">
          <SalesOverviewChart />
        </div>
      </div>
      
      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <ProjectsTable />
        </div>
        <div className="lg:col-span-4">
          <OrdersOverview />
        </div>
      </div>
    </div>
  );
}
