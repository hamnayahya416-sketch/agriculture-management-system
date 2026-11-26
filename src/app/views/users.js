import { useAuth } from "../auth/AuthContext.js";
import PageHeader from "../components/common/PageHeader.js";
import StatCard from "../components/common/StatCard.js";
import RegisterUserForm from "../components/users/RegisterUserForm.js";
import UserTable from "../components/users/UserTable.js";
import { IconShield, IconUsers, IconUser } from "../components/common/icons.js";

/* Admin dashboard section: register new users + manage existing accounts.
   Guarded by AdminRoute in App.jsx, hidden from the menu for other roles. */
export default function Users() {
  const { users } = useAuth();

  const admins = users.filter((entry) => entry.role === "admin").length;
  const regular = users.length - admins;

  return (
    <>
      <PageHeader
        title="Register / Manage Users"
        description="Create accounts and control who can sign in to AgriCore."
      />

      <div className="stats-row">
        <StatCard
          icon={<IconUsers size={20} />}
          label="Total accounts"
          value={users.length}
          note="Registered users"
        />
        <StatCard
          icon={<IconShield size={20} />}
          label="Administrators"
          value={admins}
          note="Full access"
        />
        <StatCard
          icon={<IconUser size={20} />}
          label="Users"
          value={regular}
          note="Standard access"
        />
      </div>

      <div className="grid">
        <div className="span-12">
          <RegisterUserForm />
        </div>

        <div className="span-12">
          <UserTable />
        </div>
      </div>
    </>
  );
}

