export default function CompanyDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Company Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Team Management</h2>
            <p className="text-muted-foreground">Manage agents, inspectors, and staff</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Subdomain Settings</h2>
            <p className="text-muted-foreground">Customize your branded company portal</p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Analytics & Revenue</h2>
            <p className="text-muted-foreground">Monitor performance and commission splits</p>
          </div>
        </div>
      </div>
    </div>
  );
}