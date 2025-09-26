
const applications = [
  { club: "Photography Club", status: "Pending" },
  { club: "Coding Club", status: "Accepted" },
  { club: "Music Club", status: "Rejected" },
];

const JoinApplication = () => (
  <div className="space-y-6 max-w-xl mx-auto">
    <h1 className="text-3xl font-orbitron font-bold">Join Application</h1>
    <p className="text-muted-foreground">Apply to join clubs and track your applications.</p>
    <div className="rounded-lg border bg-card p-6 space-y-4 shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Your Applications</h2>
      <ul className="space-y-2">
        {applications.map((app) => (
          <li key={app.club} className="flex items-center justify-between p-3 rounded bg-background border">
            <span>{app.club}</span>
            <span className={`text-xs font-medium px-2 py-1 rounded ${
              app.status === "Accepted"
                ? "bg-green-100 text-green-700"
                : app.status === "Pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
            }`}>
              {app.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default JoinApplication;
