const RemoveClub = () => {
  const clubs = [
    { name: "Photography Club", members: 120 },
    { name: "Coding Club", members: 200 },
    { name: "Music Club", members: 85 },
  ];
  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-orbitron font-bold">Remove Club</h1>
      <p className="text-muted-foreground">Manage and remove existing clubs from the platform.</p>
      <div className="rounded-lg border bg-card p-6 space-y-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Existing Clubs</h2>
        <ul className="space-y-2">
          {clubs.map((club) => (
            <li key={club.name} className="flex items-center justify-between p-3 rounded bg-background border">
              <span>{club.name} <span className="text-xs text-muted-foreground">({club.members} members)</span></span>
              <button className="px-3 py-1 rounded bg-red-500 text-white text-xs">Remove</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RemoveClub;
