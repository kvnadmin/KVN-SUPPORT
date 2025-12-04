
import React, { useState } from 'react';
import { User, AppSettings } from '../types';
import { Shield, Users, Lock, Save, Plus, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';

interface AdminPortalProps {
  users: User[];
  settings: AppSettings;
  onAddUser: (user: Omit<User, 'id' | 'avatar'>) => void;
  onUpdateSettings: (settings: AppSettings) => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ users, settings, onAddUser, onUpdateSettings }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'security'>('users');
  const [newUserOpen, setNewUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<User['role']>('EMPLOYEE');

  // Local state for settings form
  const [localSettings, setLocalSettings] = useState<AppSettings>(settings);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUserName.trim()) {
      onAddUser({
        name: newUserName,
        role: newUserRole
      });
      setNewUserName('');
      setNewUserRole('EMPLOYEE');
      setNewUserOpen(false);
    }
  };

  const handleSettingChange = (key: keyof AppSettings) => {
    setLocalSettings(prev => ({ ...prev, [key]: !prev[key] }));
    setSaveStatus('idle');
  };

  const saveSettings = () => {
    onUpdateSettings(localSettings);
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-1 flex gap-1 w-fit">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'users' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users size={16} />
          User Management
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'security' ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <Shield size={16} />
          Security & Permissions
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create User Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Plus size={18} className="text-blue-600" />
                Add New User
              </h3>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Full Name</label>
                  <input
                    type="text"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as User['role'])}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="EMPLOYEE">Employee</option>
                    <option value="AGENT">Support Agent</option>
                    <option value="MANAGER">IT Manager</option>
                    <option value="ADMIN">System Admin</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  Create User
                </button>
              </form>
            </div>
          </div>

          {/* User List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-700">All Users ({users.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-medium">
                    <tr>
                      <th className="px-4 py-3">User</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={user.avatar} alt="" className="w-8 h-8 rounded-full border border-slate-200" />
                            <span className="font-medium text-slate-700">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                            user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                            user.role === 'MANAGER' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' :
                            user.role === 'AGENT' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                            'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="text-slate-400 hover:text-red-500 transition-colors" title="Delete User">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Lock size={18} className="text-slate-600" />
                  Access Control
                </h3>
                <p className="text-sm text-slate-500">Manage login and permission policies.</p>
              </div>
            </div>

            <div className="space-y-4">
              <Toggle 
                label="Allow Guest Signups" 
                desc="Allow users to register without invite"
                checked={localSettings.allowGuestSignup} 
                onChange={() => handleSettingChange('allowGuestSignup')} 
              />
              <Toggle 
                label="Enforce 2FA (MFA)" 
                desc="Require two-factor auth for Agents & Admins"
                checked={localSettings.enforceMfa} 
                onChange={() => handleSettingChange('enforceMfa')} 
              />
              <Toggle 
                label="Restrict Ticket Deletion" 
                desc="Only Admins can permanently delete tickets"
                checked={localSettings.restrictDeletion} 
                onChange={() => handleSettingChange('restrictDeletion')} 
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-orange-500" />
                  System Operations
                </h3>
                <p className="text-sm text-slate-500">Global system behavior settings.</p>
              </div>
            </div>

            <div className="space-y-4">
              <Toggle 
                label="AI Auto-Triage" 
                desc="Automatically categorize and prioritize new tickets"
                checked={localSettings.enableAiTriage} 
                onChange={() => handleSettingChange('enableAiTriage')} 
              />
              <Toggle 
                label="Maintenance Mode" 
                desc="Prevent new logins and ticket creation"
                checked={localSettings.maintenanceMode} 
                onChange={() => handleSettingChange('maintenanceMode')} 
                danger
              />
            </div>
          </div>

          <div className="col-span-full flex justify-end">
            <button 
              onClick={saveSettings}
              className={`px-6 py-2.5 rounded-lg font-medium text-white flex items-center gap-2 transition-all shadow-lg ${
                saveStatus === 'saved' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {saveStatus === 'saved' ? <CheckCircle2 size={18} /> : <Save size={18} />}
              {saveStatus === 'saved' ? 'Settings Saved' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Toggle = ({ label, desc, checked, onChange, danger = false }: { label: string, desc: string, checked: boolean, onChange: () => void, danger?: boolean }) => (
  <div className="flex items-start justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
    <div>
      <p className={`text-sm font-semibold ${danger ? 'text-red-600' : 'text-slate-700'}`}>{label}</p>
      <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
    </div>
    <button 
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        checked ? (danger ? 'bg-red-500 focus:ring-red-500' : 'bg-blue-600 focus:ring-blue-500') : 'bg-slate-200 focus:ring-slate-400'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

export default AdminPortal;
