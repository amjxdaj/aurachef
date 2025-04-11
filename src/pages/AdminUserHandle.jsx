import React, { useEffect, useState } from "react";
import { RotateCw, Trash2, UserCircle, Mail, Calendar, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminUserHandle = () => {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    type: 'success',
    message: ''
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch users");

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("❌ Error fetching users:", error);
        setNotification({
          show: true,
          type: 'error',
          message: 'Failed to fetch users'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers(users => users.filter(user => user._id !== userId));
      setExpandedUser(null);
      setNotification({
        show: true,
        type: 'success',
        message: 'User deleted successfully'
      });
      
      setTimeout(() => {
        setNotification({ show: false, type: 'success', message: '' });
      }, 3000);
    } catch (error) {
      console.error("❌ Error deleting user:", error);
      setNotification({
        show: true,
        type: 'error',
        message: 'Failed to delete user'
      });
    }
  };

  const handleUserClick = (user) => {
    setExpandedUser(expandedUser?._id === user._id ? null : user);
  };

  const UserList = ({ users }) => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <RotateCw className="w-8 h-8 animate-spin text-white/50 mx-auto" />
          <p className="text-white/80 mt-2">Loading users...</p>
        </div>
      );
    }

    if (users.length === 0) {
      return (
        <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
          <p className="text-white/80 text-lg">No users found</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer border border-white/10 group"
            onClick={() => handleUserClick(user)}
          >
            <div className="p-4">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 shadow-lg bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center">
                  <UserCircle className="w-10 h-10 text-white/70" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold truncate pr-4">
                      {user.name}
                    </h3>
                    <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="p-2 bg-red-500/20 rounded-full hover:bg-red-500/40 transition-all duration-300 transform hover:scale-110 active:scale-95 hover:shadow-lg hover:shadow-red-500/20"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-white/60" />
                      <p className="font-medium truncate">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-white/60" />
                      <p className="font-medium">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="page-transition max-w-5xl mx-auto px-4">
        <div className="flex flex-col items-center mb-12">
          <div className="relative">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 mb-2">
              User Management
            </h1>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-purple-400 to-pink-300 rounded-full"></div>
          </div>
        </div>

        <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl overflow-hidden transform perspective-1000">
          <CardHeader className="pb-4 bg-gradient-to-r from-purple-800/50 to-indigo-800/50">
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-semibold text-white">
                Registered Users
              </CardTitle>
              <div className="flex items-center">
                <div className="animate-pulse mr-2 w-2 h-2 rounded-full bg-purple-400"></div>
                <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium border border-white/20">
                  {users.length} users
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <UserList users={users} />
          </CardContent>
        </Card>
      </div>

      {/* User Details Modal */}
      {expandedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setExpandedUser(null)}
          ></div>
          <div className="bg-gradient-to-br from-purple-900/90 to-indigo-900/90 backdrop-blur-xl p-6 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10 border border-white/20 shadow-2xl">
            <button
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              onClick={() => setExpandedUser(null)}
            >
              <X className="h-6 w-6" />
            </button>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center">
                  <UserCircle className="w-12 h-12 text-white/70" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
                    {expandedUser.name}
                  </h2>
                  <p className="text-white/60">{expandedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                  <h3 className="text-sm text-white/60 mb-1">Joined Date</h3>
                  <p className="font-medium">
                    {new Date(expandedUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                  <h3 className="text-sm text-white/60 mb-1">Role</h3>
                  <p className="font-medium capitalize">{expandedUser.role || 'user'}</p>
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => {
                    handleDeleteUser(expandedUser._id);
                  }}
                  className="w-full py-2 px-4 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-all duration-300 flex items-center justify-center gap-2 group hover:shadow-lg hover:shadow-red-500/20"
                >
                  <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.show && (
        <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default AdminUserHandle;