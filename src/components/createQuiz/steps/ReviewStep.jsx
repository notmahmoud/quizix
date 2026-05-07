import { CheckCircle2 } from 'lucide-react';

export default function ReviewStep({ settings, questions }) {
  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Ready to Launch!</h2>
      <p className="text-slate-400 mb-8">Review your quiz details before generating the room code.</p>

      <div className="bg-dark-bg border border-dark-border rounded-xl p-6 max-w-md mx-auto text-left mb-8">
        <h3 className="font-bold text-white text-lg mb-4">{settings.title || 'Untitled Quiz'}</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-dark-border pb-2">
            <span className="text-slate-500">Questions</span>
            <span className="font-bold text-white">{questions.length}</span>
          </div>
          <div className="flex justify-between border-b border-dark-border pb-2">
            <span className="text-slate-500">Time per question</span>
            <span className="font-bold text-white">{settings.timePerQuestionEnabled ? `${settings.timePerQuestion}s` : 'Off'}</span>
          </div>
          <div className="flex justify-between border-b border-dark-border pb-2">
            <span className="text-slate-500">Global timer</span>
            <span className="font-bold text-white">{settings.globalTimerEnabled ? `${settings.globalTimer}m` : 'Off'}</span>
          </div>
          <div className="flex justify-between border-b border-dark-border pb-2">
            <span className="text-slate-500">Leaderboard</span>
            <span className="font-bold text-white">{settings.leaderboardEnabled ? 'Enabled' : 'Disabled'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Visibility</span>
            <span className="font-bold text-white">{settings.isPublic ? 'Public' : 'Private'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
