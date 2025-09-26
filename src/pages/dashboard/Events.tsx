const events = [
	{
		title: "Photography Walkathon",
		date: "2025-09-20",
		location: "City Park",
		image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
		description:
			"Join us for a fun walk and photo session. Open to all skill levels!",
	},
	{
		title: "Code & Coffee Hackathon",
		date: "2025-10-05",
		location: "Innovation Hub",
		image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80",
		description:
			"Collaborate, code, and win prizes. Free coffee and snacks provided!",
	},
	{
		title: "Open Mic Night",
		date: "2025-10-15",
		location: "Campus Auditorium",
		image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
		description:
			"Showcase your talent or enjoy performances by fellow club members.",
	},
];

const Events = () => (
	<div className="max-w-2xl mx-auto py-4 px-2 sm:px-4">
		<h1 className="text-2xl sm:text-3xl font-orbitron font-bold mb-2 text-center">
			Activities & Events
		</h1>
		<p className="text-muted-foreground mb-6 text-center text-sm sm:text-base">
			Stay updated with upcoming events and activities.
		</p>
		<div className="flex flex-col gap-6 sm:gap-8">
			{events.map((event) => (
				<div
					key={event.title}
					className="rounded-xl border bg-card shadow-lg hover:shadow-2xl transition-shadow overflow-hidden"
				>
					<div className="relative">
						<img
							src={event.image}
							alt={event.title}
							className="w-full h-48 sm:h-72 object-cover"
						/>
						<div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-black/60 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-semibold backdrop-blur">
							{event.location}
						</div>
						<div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-white/80 text-primary px-2 sm:px-3 py-1 rounded-full text-xs font-semibold backdrop-blur">
							{new Date(event.date).toLocaleDateString()}
						</div>
					</div>
					<div className="p-3 sm:p-6">
						<h2 className="text-lg sm:text-xl font-semibold text-primary mb-2">
							{event.title}
						</h2>
						<p className="text-sm sm:text-base text-foreground/90 mb-4">
							{event.description}
						</p>
						<div className="flex items-center gap-2 sm:gap-4 flex-wrap">
							<button className="rounded-full bg-primary text-white px-3 sm:px-4 py-1 text-xs sm:text-sm font-semibold shadow hover:bg-primary/90 transition">
								Like
							</button>
							<button className="rounded-full bg-card border px-3 sm:px-4 py-1 text-xs sm:text-sm font-semibold text-primary hover:bg-primary/10 transition">
								Comment
							</button>
							<button className="rounded-full bg-card border px-3 sm:px-4 py-1 text-xs sm:text-sm font-semibold text-primary hover:bg-primary/10 transition">
								Share
							</button>
						</div>
					</div>
				</div>
			))}
		</div>
	</div>
);

export default Events;
