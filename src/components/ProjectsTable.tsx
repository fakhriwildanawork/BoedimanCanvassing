import { projects } from '../data/dummyData';
import { MoreVertical, CheckCircle2 } from 'lucide-react';

export default function ProjectsTable() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full overflow-hidden">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">Projects</h3>
          <p className="text-sm text-gray-400 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="font-bold text-gray-500">30 done</span> this month
          </p>
        </div>
        <button className="text-gray-400 hover:text-gray-800">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr>
              <th className="pb-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">Companies</th>
              <th className="pb-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">Members</th>
              <th className="pb-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">Budget</th>
              <th className="pb-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">Completion</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, idx) => (
              <tr key={project.id} className={idx !== projects.length - 1 ? "border-b border-gray-100" : ""}>
                <td className="py-4 flex items-center gap-4">
                   <img src={project.logo} alt={project.name} className="w-9 h-9 rounded-full shadow-sm" />
                   <span className="text-sm font-bold text-gray-800">{project.name}</span>
                </td>
                <td className="py-4">
                  <div className="flex -space-x-3">
                    {project.members.map((member, i) => (
                      <img key={i} src={member} alt="Member" className="w-7 h-7 rounded-full border-2 border-white relative z-10 hover:z-20 transition-transform hover:scale-110 shadow-sm" />
                    ))}
                  </div>
                </td>
                <td className="py-4 text-sm font-bold text-gray-800">{project.budget}</td>
                <td className="py-4">
                  <div className="flex items-center flex-col items-start gap-1">
                    <span className="text-xs font-bold text-teal-400">{project.completion}%</span>
                    <div className="w-full max-w-[120px] bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-teal-400 h-full rounded-full" style={{ width: `${project.completion}%` }}></div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
