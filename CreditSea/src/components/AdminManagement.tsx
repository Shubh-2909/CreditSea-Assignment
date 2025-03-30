import { useState, useEffect } from "react";
import {
  Table,
  Modal,
  Button,
  Input,
  Select,
  message,
  Card,
  Avatar,
} from "antd";
import { UserOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

type User = {
  _id: string;
  fullName: string;
  email: string;
  role: "user" | "verifier" | "admin";
};

const AdminManagement = () => {
  const [admins, setAdmins] = useState<User[]>([]);
  const [verifiers, setVerifiers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [action, setAction] = useState<"add" | "remove">("add");
  const [isAdminModalVisible, setIsAdminModalVisible] = useState(false);
  const [isVerifierModalVisible, setIsVerifierModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Fetch admins
      const adminsRes = await axios.get<{ admins: User[] }>(
        "http://localhost:4000/application/admins",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAdmins(adminsRes.data.admins);

      // Fetch verifiers
      const verifiersRes = await axios.get(
        "http://localhost:4000/application/verifiers",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setVerifiers((verifiersRes.data as { verifiers: User[] }).verifiers);

      // Fetch regular users (for dropdown)
      const usersRes = await axios.get(
        "http://localhost:4000/application/admins",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const usersData = usersRes.data as { users: User[] };
      setUsers(usersData.users.filter((user: User) => user.role === "user"));
    } catch (error) {
      console.log(error);
      //   message.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddAdmin = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:4000/application/admins",
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response);
      message.success("Admin added successfully");
      setIsAdminModalVisible(false);
      setEmail("");
      fetchData();
    } catch (error) {
      message.error("Failed to add admin");
    }
  };

  const handleRemoveAdmin = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4000/application/admins/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Admin removed successfully");
      fetchData();
    } catch (error) {
      message.error("Failed to remove admin");
    }
  };

  const handleManageVerifier = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = users.find((u) => u._id === selectedUserId);
      if (!user) return;

      await axios.post(
        "http://localhost:4000/application/verifiers",
        { email: user.email, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(
        action === "add"
          ? "Verifier added successfully"
          : "Verifier removed successfully"
      );
      setIsVerifierModalVisible(false);
      setSelectedUserId("");
      setAction("add");
      fetchData();
    } catch (error) {
      message.error("Failed to manage verifier");
    }
  };

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVerifiers = verifiers.filter(
    (verifier) =>
      verifier.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verifier.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const adminColumns = [
    {
      title: "Admin",
      dataIndex: "fullName",
      key: "name",
      render: (text: string, record: User) => (
        <div className="flex items-center">
          <Avatar icon={<UserOutlined />} className="mr-3" />
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
          {role?.toUpperCase()}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: User) => (
        <Button
          danger
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveAdmin(record._id);
          }}
          disabled={
            record._id === JSON.parse(localStorage.getItem("user") || "{}")._id
          }
        >
          Remove Admin
        </Button>
      ),
    },
  ];

  const verifierColumns = [
    {
      title: "Verifier",
      dataIndex: "fullName",
      key: "name",
      render: (text: string, record: User) => (
        <div className="flex items-center">
          <Avatar icon={<UserOutlined />} className="mr-3" />
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-gray-500">{record.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
          {role?.toUpperCase()}
        </span>
      ),
    },
  ];

  return (
    <div className="p-6 flex items-center justify-center">
      {/* <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <Input
          placeholder="Search users..."
          prefix={<SearchOutlined />}
          className="w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div> */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Admin Management"
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsAdminModalVisible(true)}
            >
              Add Admin
            </Button>
          }
          className="shadow-md"
        >
          <Table
            columns={adminColumns}
            dataSource={filteredAdmins}
            rowKey="_id"
            loading={loading}
            pagination={{ pageSize: 5 }}
          />
        </Card>
      </div>

      {/* Add Admin Modal */}
      <Modal
        title="Add New Admin"
        visible={isAdminModalVisible}
        onCancel={() => {
          setIsAdminModalVisible(false);
          setEmail("");
        }}
        onOk={handleAddAdmin}
        okText="Add Admin"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              placeholder="Enter user's email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      {/* Manage Verifier Modal */}
      <Modal
        title="Manage Verifier"
        visible={isVerifierModalVisible}
        onCancel={() => {
          setIsVerifierModalVisible(false);
          setSelectedUserId("");
          setAction("add");
        }}
        onOk={handleManageVerifier}
        okText={action === "add" ? "Add Verifier" : "Remove Verifier"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User
            </label>
            <Select
              className="w-full"
              placeholder="Select a user"
              value={selectedUserId || undefined}
              onChange={(value) => setSelectedUserId(value)}
            >
              {users.map((user) => (
                <Option key={user._id} value={user._id}>
                  {user.fullName} ({user.email})
                </Option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Action
            </label>
            <Select
              className="w-full"
              value={action}
              onChange={(value) => setAction(value)}
            >
              <Option value="add">Add as Verifier</Option>
              <Option value="remove">Remove as Verifier</Option>
            </Select>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminManagement;
