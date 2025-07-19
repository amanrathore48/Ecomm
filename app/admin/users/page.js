import { UserManagement } from "@/components/admin/UserManagement";

export const metadata = {
  title: "User Management | Admin Dashboard",
  description: "Manage users, assign roles, and control user access",
};

export default function UserManagementPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage users, assign roles, and control system access
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
        <UserManagement />
      </div>
    </div>
  );
}
