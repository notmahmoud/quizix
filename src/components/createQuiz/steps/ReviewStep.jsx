import { CheckCircle2 } from 'lucide-react';

export default function ReviewStep({ settings, questions }) {
  return (
    <div className="text-center py-6">
      <div className="w-20 h-20 bg-teal-light text-teal rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-medium text-gray-900 mb-2">Ready to Launch!</h2>
      <p className="text-muted mb-8">Review your quiz details before generating the room code.</p>

      <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-md mx-auto text-left mb-8">
        <h3 className="font-medium text-gray-900 text-lg mb-4">{settings.title || 'Untitled Quiz'}</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-muted">Questions</span>
            <span className="font-medium text-gray-900">{questions.length}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-muted">Global timer</span>
            <span className="font-medium text-gray-900">{settings.globalTimer}m</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="text-muted">Leaderboard</span>
            <span className="font-medium text-gray-900">{settings.leaderboardEnabled ? 'Enabled' : 'Disabled'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Visibility</span>
            <span className="font-medium text-gray-900">{settings.isPublic ? 'Public' : 'Private'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
