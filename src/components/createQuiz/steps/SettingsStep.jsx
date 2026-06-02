export default function SettingsStep({ settings, handleSettingsChange }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Quiz Title</label>
        <input 
          type="text" 
          name="title"
          value={settings.title}
          onChange={handleSettingsChange}
          className="form-input"
          placeholder="e.g. Advanced React Patterns"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Description</label>
        <textarea 
          name="description"
          value={settings.description}
          onChange={handleSettingsChange}
          rows={3}
          className="form-input resize-none"
          placeholder="Briefly describe what this quiz covers..."
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
        <div className="sm:col-span-2 flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Quiz Duration</h4>
            <p className="text-xs text-muted">Total time students have to complete the quiz (minutes)</p>
          </div>
          <input
            type="number"
            name="globalTimer"
            value={settings.globalTimer}
            onChange={handleSettingsChange}
            className="form-input text-center font-bold"
            style={{ width: 80 }}
            min={1}
            required
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Leaderboard</h4>
            <p className="text-xs text-muted">Show rankings to students</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" name="leaderboardEnabled" checked={settings.leaderboardEnabled} onChange={handleSettingsChange} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Public Room</h4>
            <p className="text-xs text-muted">Make this quiz public on Explore after session ends</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" name="isPublic" checked={settings.isPublic} onChange={handleSettingsChange} className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal"></div>
          </label>
        </div>
      </div>
    </div>
  );
}
