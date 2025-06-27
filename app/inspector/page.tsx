export default function InspectorDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Inspector Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Available Jobs</h2>
            <p className="text-muted-foreground">Accept inspection assignments based on location</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">My Inspections</h2>
            <p className="text-muted-foreground">Conduct virtual and physical inspections</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Earnings</h2>
            <p className="text-muted-foreground">Track payments and inspection history</p>
          </div>
        </div>
      </div>
    </div>
  );
}