const AddClub = () => (
  <div className="space-y-6 max-w-xl mx-auto">
    <h1 className="text-3xl font-orbitron font-bold">Add Club</h1>
    <p className="text-muted-foreground">Create new clubs and set up their configurations.</p>
    <form className="rounded-lg border bg-card p-6 space-y-4 shadow-sm">
      <div>
        <label className="block text-sm font-medium mb-1">Club Name</label>
        <input className="w-full rounded border px-3 py-2 bg-background" placeholder="Enter club name" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea className="w-full rounded border px-3 py-2 bg-background" placeholder="Describe the club" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <select className="w-full rounded border px-3 py-2 bg-background">
          <option>Technology</option>
          <option>Arts</option>
          <option>Sports</option>
          <option>Music</option>
        </select>
      </div>
      <button type="button" className="mt-2 px-4 py-2 rounded bg-primary text-white">Create Club</button>
    </form>
  </div>
);

export default AddClub;
