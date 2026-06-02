import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

function getStatusBadge(status) {
  switch (status) {
    case 'waiting':
      return <span className="px-2 py-1 bg-gray-100 text-muted border border-gray-200 rounded text-xs font-medium uppercase tracking-wider">Waiting</span>;
    case 'answering':
      return (
        <span className="px-2 py-1 bg-teal-light text-teal border border-teal/20 rounded text-xs font-medium uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse"></span> Answering
        </span>
      );
    case 'finished':
      return <span className="px-2 py-1 bg-teal-light text-teal border border-teal/20 rounded text-xs font-medium uppercase tracking-wider">Finished</span>;
    case 'disconnected':
      return <span className="px-2 py-1 bg-red-50 text-red-600 border border-red-200 rounded text-xs font-medium uppercase tracking-wider">Disconnected</span>;
    default:
      return null;
  }
}

export default function StudentGrid({ students, roomStatus }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {students.map((student, idx) => (
        <motion.div
          key={student.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
          className="interactive-card flex flex-col relative overflow-hidden group cursor-pointer"
          style={{ padding: '20px', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 10 }}
        >
          {roomStatus === 'active' && student.status === 'finished' && (
             <div className="absolute inset-0 bg-white/95 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
               <div className="text-center">
                 <span className="text-[10px] font-medium text-muted uppercase tracking-wider">Score Preview</span>
                 <div className="text-2xl font-medium text-teal">{student.score}%</div>
               </div>
             </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-teal-light border border-teal/20 flex items-center justify-center text-teal font-medium">
              {student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <h3 className="font-medium text-gray-900 truncate">{student.name}</h3>
          </div>

          <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
            {getStatusBadge(student.status)}
          </div>
        </motion.div>
      ))}

      {students.length === 0 && (
        <div className="col-span-full py-20 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-muted" />
          </div>
          <p className="text-gray-900 font-medium text-lg">Waiting for the first student...</p>
          <p className="text-muted text-sm mt-2 max-w-md">Share the room code above with your students. They can join by visiting the explore page or entering the code.</p>
        </div>
      )}
    </div>
  );
}
