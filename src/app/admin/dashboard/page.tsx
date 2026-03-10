import { redirect } from "next/navigation";

export default async function AdminPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {/* <p>Welcome, {user.name}. You have access to the admin panel.</p> */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="p-4 border rounded shadow-sm">
          <h2 className="font-semibold">Users</h2>
          <p className="text-gray-600">Manage application users</p>
        </div>
        <div className="p-4 border rounded shadow-sm">
          <h2 className="font-semibold">Settings</h2>
          <p className="text-gray-600">System configurations</p>
        </div>
        <div className="p-4 border rounded shadow-sm">
          <h2 className="font-semibold">Logs</h2>
          <p className="text-gray-600">View system activity</p>
        </div>
      </div>
    </div>
  );
}
