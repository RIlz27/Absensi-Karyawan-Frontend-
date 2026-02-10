// UserList.jsx
import React from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Badge from "@/components/ui/Badge"; // Asumsi ada komponen Badge

const UserList = ({ users, onEdit, onDelete }) => {
  return (
    <Card title="Daftar Karyawan" noborder>
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-700">
              <th className="table-th">NIP</th>
              <th className="table-th">Nama Karyawan</th>
              <th className="table-th">Role</th>
              <th className="table-th">Status</th>
              <th className="table-th">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50">
                <td className="table-td font-bold">{user.nip}</td>
                <td className="table-td">{user.name}</td>
                <td className="table-td">
                  <Badge
                    label={user.role}
                    className={
                      user.role === "admin" ? "bg-danger-500" : "bg-primary-500"
                    }
                  />
                </td>
                <td className="table-td">
                  {user.is_active ? "✅ Aktif" : "❌ Nonaktif"}
                </td>
                <td className="table-td flex space-x-2">
                  <button
                    onClick={() => onEdit(user)}
                    className="text-info-500"
                  >
                    <Icon icon="ph:pencil" />
                  </button>
                  <button
                    onClick={() => onDelete(user.id)}
                    className="text-danger-500"
                  >
                    <Icon icon="ph:trash" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
export default UserList;
