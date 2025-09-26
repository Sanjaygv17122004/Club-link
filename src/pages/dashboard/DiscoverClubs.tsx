
const clubs = [
  {
    name: "Photography Club",
    description: "Capture moments, learn photography skills, and join photo walks.",
    members: 120,
  },
  {
    name: "Coding Club",
    description: "Collaborate on projects, attend coding workshops, and hackathons.",
    members: 200,
  },
  {
    name: "Music Club",
    description: "Jam sessions, music production, and live performances.",
    members: 85,
  },
];

const DiscoverClubs = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-orbitron font-bold">Discover Clubs</h1>
    <p className="text-muted-foreground">Find and explore clubs that match your interests.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {clubs.map((club) => (
        <div key={club.name} className="rounded-lg border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold text-primary mb-1">{club.name}</h2>
          <p className="text-muted-foreground mb-2">{club.description}</p>
          <span className="text-xs text-foreground/70">{club.members} members</span>
        </div>
      ))}
    </div>
  </div>
);

export default DiscoverClubs;
