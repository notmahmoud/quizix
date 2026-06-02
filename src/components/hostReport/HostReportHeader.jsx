export default function HostReportHeader({ code }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-medium text-gray-900 mb-2 letter-spacing[-0.5px]">Quiz Report</h1>
        <p className="text-muted">Analytics for Room <span className="font-mono font-semibold text-teal">{code}</span></p>
      </div>
    </div>
  );
}
