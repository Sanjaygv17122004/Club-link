const CreateEvent = () => (
  <div className="space-y-6 max-w-xl mx-auto">
    <h1 className="text-3xl font-orbitron font-bold">Create Event</h1>
    <p className="text-muted-foreground">Create and manage events for your clubs.</p>
    <form className="rounded-lg border bg-card p-6 space-y-4 shadow-sm">
      <div>
        <label className="block text-sm font-medium mb-1">Event Title</label>
        <input className="w-full rounded border px-3 py-2 bg-background" placeholder="Enter event title" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea className="w-full rounded border px-3 py-2 bg-background" placeholder="Describe the event" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <input type="date" className="w-full rounded border px-3 py-2 bg-background" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">End Date</label>
          <input type="date" className="w-full rounded border px-3 py-2 bg-background" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Time</label>
        <input type="time" className="w-full rounded border px-3 py-2 bg-background" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Image</label>
        <input type="file" className="w-full rounded border px-3 py-2 bg-background" />
      </div>
      <button type="button" className="mt-2 px-4 py-2 rounded bg-primary text-white">Create Event</button>
    </form>
  </div>
);

export default CreateEvent;
