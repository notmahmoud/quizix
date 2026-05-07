import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

function getStatusBadge(status) {
  switch (status) {
    case 'waiting':
      return <span className="px-2 py-1 bg-slate-500/10 text-slate-400 border border-slate-500/20 rounded text-xs font-bold uppercase tracking-wider">Waiting</span>;
    case 'answering':
      return (
        <span className="px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span> Answering
        </span>
      );
    case 'finished':
      return <span className="px-2 py-1 bg-accent/10 text-accent border border-accent/20 rounded text-xs font-bold uppercase tracking-wider">Finished</span>;
    case 'disconnected':
      return <span className="px-2 py-1 bg-error/10 text-error border border-error/20 rounded text-xs font-bold uppercase tracking-wider">Disconnected</span>;
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
          className="interactive-card p-4 rounded-xl flex flex-col relative overflow-hidden group cursor-pointer"
        >
          {roomStatus === 'active' && student.status === 'finished' && (
             <div className="absolute inset-0 bg-dark-bg/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
               <div className="text-center">
                 <span className="text-xs font-bold text-slate-400 uppercase">Score Preview</span>
                 <div className="text-2xl font-bold text-accent">{student.score}%</div>
               </div>
             </div>
          )}
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-start/20 to-primary-end/20 border border-primary-start/30 flex items-center justify-center text-primary-start font-bold">
              {student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <h3 className="font-semibold text-white truncate">{student.name}</h3>
          </div>
          
          <div className="flex justify-between items-center mt-auto pt-4 border-t border-dark-border">
            {getStatusBadge(student.status)}
          </div>
        </motion.div>
      ))}
      
      {students.length === 0 && (
        <div className="col-span-full py-20 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-dark-surface border border-dark-border rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-slate-400 font-medium text-lg">Waiting for the first student...</p>
          <p className="text-slate-500 text-sm mt-2 max-w-md">Share the room code above with your students. They can join by visiting the explore page or entering the code.</p>
        </div>
      )}
    </div>
  );
}
