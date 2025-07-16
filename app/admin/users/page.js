import { UserManagement } from "@/components/admin/UserManagement";

export const metadata = {
  title: "User Management",
  description: "Manage users and roles",
};

export default function UserManagementPage() {
  return <UserManagement />;
}
