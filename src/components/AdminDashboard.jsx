import React, { useState, useEffect } from 'react';
import { 
  Lock, User, LogOut, CheckCircle, XCircle, Trash2, Clock, 
  Search, ShieldCheck, RefreshCw, Phone, Mail, MapPin, Eye, EyeOff, ArrowLeft, Heart, 
  LayoutDashboard, FileText, Users, Activity, UserPlus, Shield, PlusCircle, Layers, Check,
  BarChart2, Calendar, TrendingUp, Maximize2, X, Download, FileSpreadsheet
} from 'lucide-react';
import elephantHouseLogo from '../assets/elephant-house-logo-v3.png';
import wonderLogo from '../assets/wonder-logo.png';

export default function AdminDashboard({ onBackToCampaign }) {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || null);
  const [adminUser, setAdminUser] = useState(JSON.parse(localStorage.getItem('admin_user') || 'null'));
  
  // Primary Main Navigation Tabs: 'dashboard', 'records', 'users', 'logs'
  const [mainNavTab, setMainNavTab] = useState('dashboard');

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // All Records State
  const [wishes, setWishes] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, count_en: 0, count_si: 0, count_ta: 0 });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // all, pending, approved, rejected
  const [activeLangTab, setActiveLangTab] = useState('all'); // all, en, si, ta
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Batch Selection State
  const [selectedWishIds, setSelectedWishIds] = useState([]);

  // Lightbox Preview Modal State
  const [previewWish, setPreviewWish] = useState(null);

  // Dashboard Overview State
  const [dashboardData, setDashboardData] = useState(null);
  const [dashLoading, setDashLoading] = useState(false);
  const [dashSearch, setDashSearch] = useState('');

  // Users Tab State
  const [usersList, setUsersList] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('admin');
  const [userMsg, setUserMsg] = useState('');
  const [userError, setUserError] = useState('');
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  // Activity Log Tab State
  const [logsList, setLogsList] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logSearch, setLogSearch] = useState('');

  // Auto load active tab data when token or tab changes
  useEffect(() => {
    if (token) {
      verifyTokenAndLoad();
    }
  }, [token, mainNavTab, activeTab, activeLangTab]);

  const verifyTokenAndLoad = async () => {
    try {
      const authRes = await fetch('api/admin/check_auth.php', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const authData = await authRes.json();

      if (!authData.success) {
        handleLogout();
        return;
      }

      if (authData.admin) {
        setAdminUser(authData.admin);
        localStorage.setItem('admin_user', JSON.stringify(authData.admin));
      }

      // Load data for current active main tab
      if (mainNavTab === 'dashboard') {
        fetchDashboardStats();
      } else if (mainNavTab === 'records') {
        fetchAdminData();
      } else if (mainNavTab === 'users') {
        fetchUsers();
      } else if (mainNavTab === 'logs') {
        fetchLogs();
      }
    } catch (err) {
      console.error('Session verification error:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmittingLogin(true);

    try {
      const res = await fetch('api/admin/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (data.success) {
        setToken(data.token);
        setAdminUser(data.admin);
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_user', JSON.stringify(data.admin));
      } else {
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setLoginError('Failed to connect to backend server');
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  const handleLogout = async () => {
    if (token) {
      try {
        await fetch('api/admin/logout.php', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        });
      } catch (err) {
        // Continue clearing client token
      }
    }
    setToken(null);
    setAdminUser(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
  };

  // 1. Fetch Dashboard Stats
  const fetchDashboardStats = async () => {
    if (!token) return;
    setDashLoading(true);
    try {
      const res = await fetch('api/admin/dashboard_stats.php', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setDashboardData(data);
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setDashLoading(false);
    }
  };

  // 2. Fetch Wishes Records (List format)
  const fetchAdminData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const url = `api/admin/wishes.php?status=${activeTab}&lang=${activeLangTab}&q=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        setWishes(data.wishes);
        setStats(data.stats);
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error('Error loading admin wishes:', err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Fetch Admin Users
  const fetchUsers = async () => {
    if (!token) return;
    setUsersLoading(true);
    try {
      const res = await fetch('api/admin/users.php', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUsersList(data.users);
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setUsersLoading(false);
    }
  };

  // Create User Handler
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setUserError('');
    setUserMsg('');
    setIsCreatingUser(true);

    try {
      const res = await fetch('api/admin/users.php', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          username: newUsername,
          password: newPassword,
          name: newName,
          role: newRole
        })
      });
      const data = await res.json();

      if (data.success) {
        setUserMsg(data.message || 'User created successfully!');
        setNewUsername('');
        setNewPassword('');
        setNewName('');
        setShowCreateUser(false);
        fetchUsers();
      } else {
        setUserError(data.error || 'Failed to create user');
      }
    } catch (err) {
      setUserError('Network error while creating user');
    } finally {
      setIsCreatingUser(false);
    }
  };

  // Delete User Handler
  const handleDeleteUser = async (id, usernameToDelete) => {
    if (!confirm(`Are you sure you want to delete admin user '${usernameToDelete}'?`)) return;

    try {
      const res = await fetch('api/admin/users.php', {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ id })
      });
      const data = await res.json();

      if (data.success) {
        fetchUsers();
      } else {
        alert(data.error || 'Failed to delete user');
      }
    } catch (err) {
      alert('Network error while deleting user');
    }
  };

  // 4. Fetch Activity Logs
  const fetchLogs = async () => {
    if (!token) return;
    setLogsLoading(true);
    try {
      const url = `api/admin/activity_logs.php?q=${encodeURIComponent(logSearch)}`;
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setLogsList(data.logs);
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setLogsLoading(false);
    }
  };

  const handleAction = async (wishId, action) => {
    if (!token) return;
    setActionLoadingId(wishId);
    try {
      const res = await fetch('api/admin/action.php', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: wishId, action })
      });
      const data = await res.json();

      if (data.success) {
        fetchAdminData();
        if (mainNavTab === 'dashboard') fetchDashboardStats();
      } else if (res.status === 401) {
        alert('Session expired. Please log in again.');
        handleLogout();
      } else {
        alert(data.error || 'Action failed');
      }
    } catch (err) {
      alert('Network error while processing action');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Jump from Dashboard Search to All Records
  const handleDashboardSearchSubmit = (e) => {
    e.preventDefault();
    if (dashSearch.trim()) {
      setSearchQuery(dashSearch);
      setMainNavTab('records');
    }
  };

  // Filter Dashboard recent submissions locally if typing in search bar
  const filteredRecentWishes = (dashboardData?.recent_wishes || []).filter(item => {
    if (!dashSearch.trim()) return true;
    const q = dashSearch.toLowerCase();
    return item.wish_title?.toLowerCase().includes(q) ||
           item.submitter_name?.toLowerCase().includes(q) ||
           item.city_region?.toLowerCase().includes(q);
  });

  // Batch selection handlers
  const toggleSelectWish = (id) => {
    setSelectedWishIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedWishIds.length === wishes.length && wishes.length > 0) {
      setSelectedWishIds([]);
    } else {
      setSelectedWishIds(wishes.map(w => w.id));
    }
  };

  const clearSelection = () => {
    setSelectedWishIds([]);
  };

  const handleDeleteBatch = async () => {
    if (selectedWishIds.length === 0 || !token) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedWishIds.length} selected record(s) permanently from the database?`)) return;

    try {
      const res = await fetch('api/admin/action.php', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ids: selectedWishIds, action: 'delete_batch' })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedWishIds([]);
        fetchAdminData();
        fetchDashboardStats();
      } else {
        alert(data.error || 'Failed to delete selected records');
      }
    } catch (err) {
      alert('Network error while deleting selected records');
    }
  };

  const handleDeleteAll = async () => {
    if (!token) return;
    if (!window.confirm("WARNING: Are you sure you want to DELETE ALL wish records permanently from the database?")) return;
    if (!window.confirm("This action CANNOT be undone! Confirm again to delete ALL records in database.")) return;

    try {
      const res = await fetch('api/admin/action.php', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'delete_all' })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedWishIds([]);
        fetchAdminData();
        fetchDashboardStats();
        alert('All wish records have been deleted successfully from the database.');
      } else {
        alert(data.error || 'Failed to delete all records');
      }
    } catch (err) {
      alert('Network error while deleting all records');
    }
  };

  // Handle Exporting Records (Full or Selected) to CSV or Excel
  const handleExportRecords = async (format = 'csv', forceOnlySelected = false) => {
    if (!token) return;

    const exportSelectedOnly = forceOnlySelected || selectedWishIds.length > 0;
    const targetWishIds = exportSelectedOnly ? selectedWishIds : [];

    try {
      // 1. Try API file download stream first
      let exportUrl = `api/admin/export_wishes.php?format=${format}&status=${activeTab}&lang=${activeLangTab}&q=${encodeURIComponent(searchQuery)}`;
      if (exportSelectedOnly && targetWishIds.length > 0) {
        exportUrl += `&ids=${targetWishIds.join(',')}`;
      }
      
      const res = await fetch(exportUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        const contentType = res.headers.get('Content-Type') || '';
        if (contentType.includes('csv') || contentType.includes('excel') || contentType.includes('text/') || contentType.includes('vnd.ms-excel')) {
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const timestamp = new Date().toISOString().slice(0, 10);
          const namePrefix = exportSelectedOnly ? `selected_${targetWishIds.length}_wishes` : `wishes_export_${activeTab}`;
          a.download = `wonder_${namePrefix}_${timestamp}.${format === 'excel' ? 'xls' : 'csv'}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend export endpoint fallback to client-side exporter:', err);
    }

    // 2. Client-side Fallback Exporter (exports loaded `wishes` array or selected subset)
    let recordsToExport = wishes;
    if (exportSelectedOnly && targetWishIds.length > 0) {
      recordsToExport = wishes.filter(w => targetWishIds.includes(w.id));
    }

    if (!recordsToExport || recordsToExport.length === 0) {
      alert('No records available to export.');
      return;
    }

    const headers = ['ID', 'Submitter Name', 'Phone Number', 'Email', 'Wish Title', 'Wish Story', 'District / Region', 'Language', 'Likes Count', 'Status', 'Submitted Date', 'Image Path'];
    
    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = recordsToExport.map(w => [
      w.id,
      escapeCsv(w.submitter_name),
      escapeCsv(w.submitter_phone || 'N/A'),
      escapeCsv(w.submitter_email || 'N/A'),
      escapeCsv(w.wish_title),
      escapeCsv(w.wish_story),
      escapeCsv(w.city_region),
      (w.lang || 'EN').toUpperCase(),
      w.likes_count || 0,
      (w.status || 'PENDING').toUpperCase(),
      escapeCsv(w.created_at),
      escapeCsv(w.image_path)
    ]);

    // Prepend UTF-8 BOM for Microsoft Excel compatibility
    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { 
      type: format === 'excel' ? 'application/vnd.ms-excel;charset=utf-8' : 'text/csv;charset=utf-8;' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const timestamp = new Date().toISOString().slice(0, 10);
    const namePrefix = exportSelectedOnly ? `selected_${targetWishIds.length}_wishes` : `wishes_export_${activeTab}`;
    link.download = `wonder_${namePrefix}_${timestamp}.${format === 'excel' ? 'xls' : 'csv'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // -------------------------------------------------------------
  // Render Login Form if unauthenticated
  // -------------------------------------------------------------
  if (!token) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-card tactile-card">
          <div className="admin-login-header">
            <div className="admin-login-logos">
              <img src={elephantHouseLogo} alt="Elephant House" className="admin-logo-eh" />
              <img src={wonderLogo} alt="Wonder" className="admin-logo-wonder" />
            </div>
            <h2>Admin Portal</h2>
            <p>Elephant House Wonder Wish Stick Campaign Backend</p>
          </div>

          <form onSubmit={handleLogin} className="admin-login-form">
            {loginError && (
              <div className="admin-error-alert">
                <XCircle size={18} />
                <span>{loginError}</span>
              </div>
            )}

            <div className="form-group">
              <label><User size={16} /> Username</label>
              <input 
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter admin username"
              />
            </div>

            <div className="form-group">
              <label><Lock size={16} /> Password</label>
              <div className="password-input-wrapper">
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
                <button 
                  type="button" 
                  className="btn-toggle-password" 
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="admin-submit-btn"
              disabled={isSubmittingLogin}
            >
              {isSubmittingLogin ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <button onClick={onBackToCampaign} className="admin-back-btn">
            <ArrowLeft size={16} /> Back to Website
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Render Admin Dashboard with Left Sidebar Layout
  // -------------------------------------------------------------
  return (
    <div className="admin-layout-container">
      
      {/* Left Sidebar Navigation */}
      <aside className="admin-sidebar">
        
        {/* Brand Logos */}
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-logos">
            <img src={elephantHouseLogo} alt="Elephant House" className="sidebar-logo-eh" />
            <img src={wonderLogo} alt="Wonder" className="sidebar-logo-wonder" />
          </div>
          <div className="sidebar-title">
            <h3>Wonder Admin</h3>
            <span>Campaign Portal</span>
          </div>
        </div>

        {/* Primary Vertical Navigation Tabs */}
        <nav className="admin-sidebar-nav">
          <button 
            className={`sidebar-nav-item ${mainNavTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setMainNavTab('dashboard')}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>

          <button 
            className={`sidebar-nav-item ${mainNavTab === 'records' ? 'active' : ''}`}
            onClick={() => setMainNavTab('records')}
          >
            <FileText size={18} />
            <span>All Records</span>
            {stats.pending > 0 && <span className="sidebar-pending-badge">{stats.pending}</span>}
          </button>

          <button 
            className={`sidebar-nav-item ${mainNavTab === 'users' ? 'active' : ''}`}
            onClick={() => setMainNavTab('users')}
          >
            <Users size={18} />
            <span>Users</span>
          </button>

          <button 
            className={`sidebar-nav-item ${mainNavTab === 'logs' ? 'active' : ''}`}
            onClick={() => setMainNavTab('logs')}
          >
            <Activity size={18} />
            <span>Activity Log</span>
          </button>
        </nav>

        {/* Sidebar Footer User Info & Action Buttons */}
        <div className="admin-sidebar-footer">
          <div className="sidebar-user-card">
            <div className="user-icon-wrap">
              <ShieldCheck size={20} color="#E6007E" />
            </div>
            <div className="user-info">
              <strong>{adminUser?.name || 'Administrator'}</strong>
              <small>@{adminUser?.username || 'admin'}</small>
            </div>
          </div>

          <div className="sidebar-actions-col">
            <button onClick={onBackToCampaign} className="sidebar-btn-back">
              <ArrowLeft size={16} /> Main Site
            </button>
            <button onClick={handleLogout} className="sidebar-btn-logout">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

      </aside>

      {/* Main Viewport Content on Right */}
      <main className="admin-main-viewport">

        {/* =========================================================================
            TAB 1: DASHBOARD
           ========================================================================= */}
        {mainNavTab === 'dashboard' && (
          <div className="tab-view-container animate-fade-in">
            
            {/* View Header with Search Bar */}
            <div className="view-header">
              <h2><LayoutDashboard size={24} color="#38BDF8" /> Campaign Performance Dashboard</h2>

              <div className="header-actions-row">
                {/* Search Bar inside Dashboard */}
                <form onSubmit={handleDashboardSearchSubmit} className="admin-search-input">
                  <Search size={16} />
                  <input 
                    type="text" 
                    placeholder="Search wishes or submitters..."
                    value={dashSearch}
                    onChange={e => setDashSearch(e.target.value)}
                  />
                  {dashSearch && (
                    <button type="submit" className="btn-search-go" title="Search All Records">Go</button>
                  )}
                </form>

                <button onClick={fetchDashboardStats} className="admin-refresh-btn" title="Refresh Dashboard">
                  <RefreshCw size={16} className={dashLoading ? 'spin' : ''} />
                </button>
              </div>
            </div>

            {dashLoading && !dashboardData ? (
              <div className="admin-loading-state">
                <RefreshCw className="spin" size={32} color="#E6007E" />
                <span>Loading campaign metrics...</span>
              </div>
            ) : (
              <>
                {/* 1. Total Wishes & 2. Today's Wishes Metric Cards */}
                <div className="admin-stats-grid">
                  <div className="admin-stat-card total" onClick={() => { setMainNavTab('records'); setActiveTab('all'); }}>
                    <div className="stat-meta">
                      <span>1. Total Wishes</span>
                      <h4>{dashboardData?.metrics?.total_wishes || 0}</h4>
                    </div>
                    <Eye className="stat-bg-icon" size={40} />
                  </div>

                  <div className="admin-stat-card today" onClick={() => { setMainNavTab('records'); setActiveTab('all'); }}>
                    <div className="stat-meta">
                      <span>2. Today's Wishes</span>
                      <h4>{dashboardData?.metrics?.todays_wishes || 0}</h4>
                    </div>
                    <Calendar className="stat-bg-icon" size={40} />
                  </div>

                  <div className="admin-stat-card pending" onClick={() => { setMainNavTab('records'); setActiveTab('pending'); }}>
                    <div className="stat-meta">
                      <span>Pending Moderation</span>
                      <h4>{dashboardData?.metrics?.pending_wishes || 0}</h4>
                    </div>
                    <Clock className="stat-bg-icon" size={40} />
                  </div>

                  <div className="admin-stat-card approved" onClick={() => { setMainNavTab('records'); setActiveTab('approved'); }}>
                    <div className="stat-meta">
                      <span>Approved Wishes</span>
                      <h4>{dashboardData?.metrics?.approved_wishes || 0}</h4>
                    </div>
                    <CheckCircle className="stat-bg-icon" size={40} />
                  </div>

                  <div className="admin-stat-card rejected" onClick={() => { setMainNavTab('records'); setActiveTab('rejected'); }}>
                    <div className="stat-meta">
                      <span>Rejected Wishes</span>
                      <h4>{dashboardData?.metrics?.rejected_wishes || 0}</h4>
                    </div>
                    <XCircle className="stat-bg-icon" size={40} />
                  </div>
                </div>

                {/* 3. Submission Statistics Card */}
                <div className="dashboard-section-card margin-top-lg">
                  <h3><Layers size={18} color="#00B5EC" /> 3. Submission Statistics & Language Breakdown</h3>
                  <div className="lang-progress-grid">
                    <div className="lang-prog-item">
                      <div className="prog-header">
                        <span>🇬🇧 English</span>
                        <strong>{dashboardData?.metrics?.count_en || 0} wishes ({dashboardData?.metrics?.total_wishes ? Math.round((dashboardData.metrics.count_en / dashboardData.metrics.total_wishes) * 100) : 0}%)</strong>
                      </div>
                      <div className="prog-track">
                        <div 
                          className="prog-bar bg-en" 
                          style={{ width: `${dashboardData?.metrics?.total_wishes ? ((dashboardData.metrics.count_en / dashboardData.metrics.total_wishes) * 100) : 0}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="lang-prog-item">
                      <div className="prog-header">
                        <span>🇱🇰 සිංහල (Sinhala)</span>
                        <strong>{dashboardData?.metrics?.count_si || 0} wishes ({dashboardData?.metrics?.total_wishes ? Math.round((dashboardData.metrics.count_si / dashboardData.metrics.total_wishes) * 100) : 0}%)</strong>
                      </div>
                      <div className="prog-track">
                        <div 
                          className="prog-bar bg-si" 
                          style={{ width: `${dashboardData?.metrics?.total_wishes ? ((dashboardData.metrics.count_si / dashboardData.metrics.total_wishes) * 100) : 0}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="lang-prog-item">
                      <div className="prog-header">
                        <span>🇱🇰 தமிழ் (Tamil)</span>
                        <strong>{dashboardData?.metrics?.count_ta || 0} wishes ({dashboardData?.metrics?.total_wishes ? Math.round((dashboardData.metrics.count_ta / dashboardData.metrics.total_wishes) * 100) : 0}%)</strong>
                      </div>
                      <div className="prog-track">
                        <div 
                          className="prog-bar bg-ta" 
                          style={{ width: `${dashboardData?.metrics?.total_wishes ? ((dashboardData.metrics.count_ta / dashboardData.metrics.total_wishes) * 100) : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Chart (Compare in Days) */}
                <div className="dashboard-section-card margin-top-lg">
                  <div className="section-card-header">
                    <h3><BarChart2 size={18} color="#38BDF8" /> 4. Daily Submission Comparison Chart</h3>
                    <span className="text-muted-xs"><TrendingUp size={14} color="#4ADE80" /> Daily Volume Trend</span>
                  </div>

                  <div className="daily-chart-container">
                    {!dashboardData?.chart_data || dashboardData.chart_data.length === 0 ? (
                      <p className="text-muted">No historical daily submission data available yet.</p>
                    ) : (
                      <div className="chart-bars-wrapper">
                        {dashboardData.chart_data.map((day, idx) => {
                          const maxCount = Math.max(...dashboardData.chart_data.map(d => d.count), 1);
                          const heightPct = Math.max((day.count / maxCount) * 100, 12);

                          return (
                            <div key={idx} className="chart-bar-column">
                              <div className="bar-count-badge">{day.count}</div>
                              <div className="bar-track">
                                <div 
                                  className="bar-fill-gradient" 
                                  style={{ height: `${heightPct}%` }}
                                ></div>
                              </div>
                              <span className="bar-date-label">{day.date}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Activity Streams */}
                <div className="dash-columns-grid margin-top-lg">
                  
                  {/* Recent Wishes */}
                  <div className="dashboard-section-card">
                    <div className="section-card-header">
                      <h3><FileText size={18} color="#E6007E" /> Recent Submissions ({filteredRecentWishes.length})</h3>
                      <button onClick={() => setMainNavTab('records')} className="btn-link-sm">
                        View All Records &rarr;
                      </button>
                    </div>

                    <div className="recent-list">
                      {filteredRecentWishes.length === 0 ? (
                        <p className="text-muted">No wishes matching search.</p>
                      ) : (
                        filteredRecentWishes.map(item => (
                          <div key={item.id} className="recent-item">
                            <div className="recent-item-meta">
                              <strong>{item.wish_title}</strong>
                              <small>By {item.submitter_name} • {item.city_region}</small>
                            </div>
                            <div className="recent-item-right">
                              <span className={`status-pill ${item.status}`}>{item.status.toUpperCase()}</span>
                              <span className="timestamp-xs">{item.created_at}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Recent Activity Log */}
                  <div className="dashboard-section-card">
                    <div className="section-card-header">
                      <h3><Activity size={18} color="#22C55E" /> Recent Admin Audit Log</h3>
                      <button onClick={() => setMainNavTab('logs')} className="btn-link-sm">
                        View Full Log &rarr;
                      </button>
                    </div>

                    <div className="recent-list">
                      {dashboardData?.recent_logs?.length === 0 ? (
                        <p className="text-muted">No activity logs recorded yet.</p>
                      ) : (
                        dashboardData?.recent_logs?.map(log => (
                          <div key={log.id} className="recent-item">
                            <div className="recent-item-meta">
                              <strong>{log.admin_username}</strong>
                              <small>{log.description}</small>
                            </div>
                            <div className="recent-item-right">
                              <span className={`action-pill action-${log.action_type}`}>{log.action_type}</span>
                              <span className="timestamp-xs">{log.created_at}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>
              </>
            )}
          </div>
        )}


        {/* =========================================================================
            TAB 2: ALL RECORDS (LIST VIEW FORMAT - NOT CARDS)
           ========================================================================= */}
        {mainNavTab === 'records' && (
          <div className="tab-view-container animate-fade-in">
            
            <div className="view-header">
              <h2><FileText size={24} color="#E6007E" /> All Submitted Records List</h2>
              
              <div className="header-actions-row">
                <div className="export-btn-group">
                  <button 
                    onClick={() => handleExportRecords('csv')} 
                    className="admin-export-btn btn-csv" 
                    title={selectedWishIds.length > 0 ? `Export ${selectedWishIds.length} selected records to CSV` : "Export currently filtered records to CSV"}
                  >
                    <Download size={15} /> {selectedWishIds.length > 0 ? `Export Selected CSV (${selectedWishIds.length})` : 'Export CSV (All)'}
                  </button>
                  <button 
                    onClick={() => handleExportRecords('excel')} 
                    className="admin-export-btn btn-excel" 
                    title={selectedWishIds.length > 0 ? `Export ${selectedWishIds.length} selected records to Excel` : "Export currently filtered records to Excel"}
                  >
                    <FileSpreadsheet size={15} /> {selectedWishIds.length > 0 ? `Export Selected Excel (${selectedWishIds.length})` : 'Export Excel (All)'}
                  </button>
                </div>

                {stats.total > 0 && (
                  <button 
                    onClick={handleDeleteAll} 
                    className="admin-export-btn btn-delete-all"
                    style={{ backgroundColor: '#EF4444', color: '#FFFFFF', borderColor: '#DC2626' }}
                    title="Permanently delete all wish records from database"
                  >
                    <Trash2 size={15} /> Delete All Records
                  </button>
                )}

                <button onClick={fetchAdminData} className="admin-refresh-btn" title="Refresh Records">
                  <RefreshCw size={16} className={loading ? 'spin' : ''} />
                </button>
              </div>
            </div>

            {/* Toolbar: Filters & Search */}
            <div className="admin-toolbar">
              
              {/* 3. All Status Filter */}
              <div className="admin-tab-group">
                <button 
                  className={`admin-tab ${activeTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveTab('all')}
                >
                  All Status ({stats.total})
                </button>
                <button 
                  className={`admin-tab pending ${activeTab === 'pending' ? 'active' : ''}`}
                  onClick={() => setActiveTab('pending')}
                >
                  Pending ({stats.pending})
                </button>
                <button 
                  className={`admin-tab approved ${activeTab === 'approved' ? 'active' : ''}`}
                  onClick={() => setActiveTab('approved')}
                >
                  Approved ({stats.approved})
                </button>
                <button 
                  className={`admin-tab rejected ${activeTab === 'rejected' ? 'active' : ''}`}
                  onClick={() => setActiveTab('rejected')}
                >
                  Rejected ({stats.rejected})
                </button>
              </div>

              {/* 4. All Languages Filter */}
              <div className="admin-tab-group admin-lang-tab-group">
                <button
                  className={`admin-tab ${activeLangTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveLangTab('all')}
                >
                  All Languages
                </button>
                <button
                  className={`admin-tab ${activeLangTab === 'en' ? 'active' : ''}`}
                  onClick={() => setActiveLangTab('en')}
                >
                  🇬🇧 English ({stats.count_en || 0})
                </button>
                <button
                  className={`admin-tab ${activeLangTab === 'si' ? 'active' : ''}`}
                  onClick={() => setActiveLangTab('si')}
                >
                  🇱🇰 සිංහල ({stats.count_si || 0})
                </button>
                <button
                  className={`admin-tab ${activeLangTab === 'ta' ? 'active' : ''}`}
                  onClick={() => setActiveLangTab('ta')}
                >
                  🇱🇰 தமிழ் ({stats.count_ta || 0})
                </button>
              </div>

              {/* 2. Search Bar */}
              <div className="admin-search-wrapper">
                <div className="admin-search-input">
                  <Search size={16} />
                  <input 
                    type="text" 
                    placeholder="Search by submitter, phone, title, city..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && fetchAdminData()}
                  />
                </div>
              </div>

            </div>

            {/* Batch Selection Action Bar when 1 or more rows selected */}
            {selectedWishIds.length > 0 && (
              <div className="selection-action-bar animate-fade-in">
                <div className="selection-info">
                  <CheckCircle size={18} color="#10B981" />
                  <span><strong>{selectedWishIds.length}</strong> of {wishes.length} record{selectedWishIds.length > 1 ? 's' : ''} selected</span>
                </div>
                
                <div className="selection-actions">
                  <button 
                    onClick={() => handleExportRecords('csv', true)} 
                    className="admin-export-btn btn-csv"
                  >
                    <Download size={14} /> Export Selected CSV ({selectedWishIds.length})
                  </button>
                  <button 
                    onClick={() => handleExportRecords('excel', true)} 
                    className="admin-export-btn btn-excel"
                  >
                    <FileSpreadsheet size={14} /> Export Selected Excel ({selectedWishIds.length})
                  </button>
                  <button 
                    onClick={handleDeleteBatch} 
                    className="admin-export-btn btn-delete-batch"
                    style={{ backgroundColor: '#EF4444', color: '#FFFFFF', borderColor: '#DC2626' }}
                  >
                    <Trash2 size={14} /> Delete Selected ({selectedWishIds.length})
                  </button>
                  <button 
                    onClick={clearSelection} 
                    className="btn-clear-selection"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            )}

            {/* 1. View All Submitted Records - LIST / TABLE FORMAT */}
            {loading ? (
              <div className="admin-loading-state">
                <RefreshCw className="spin" size={32} color="#E6007E" />
                <span>Loading submissions database list...</span>
              </div>
            ) : wishes.length === 0 ? (
              <div className="admin-empty-state">
                <Clock size={48} color="#94A3B8" />
                <h3>No records found</h3>
                <p>There are no submitted records matching the selected filter criteria.</p>
              </div>
            ) : (
              <div className="table-wrapper-card">
                <table className="admin-records-list-table">
                  <thead>
                    <tr>
                      <th className="th-checkbox">
                        <input 
                          type="checkbox" 
                          className="admin-select-checkbox"
                          checked={selectedWishIds.length === wishes.length && wishes.length > 0} 
                          onChange={toggleSelectAll} 
                          title="Select All / Deselect All"
                        />
                      </th>
                      <th>ID</th>
                      <th>Stick Image</th>
                      <th>Wish Details</th>
                      <th>Submitter Info</th>
                      <th>District</th>
                      <th>Lang</th>
                      <th>Status</th>
                      <th>Date & Time</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wishes.map((item) => (
                      <tr key={item.id} className={`row-status-${item.status} ${selectedWishIds.includes(item.id) ? 'row-selected' : ''}`}>
                        <td className="td-checkbox">
                          <input 
                            type="checkbox" 
                            className="admin-select-checkbox"
                            checked={selectedWishIds.includes(item.id)} 
                            onChange={() => toggleSelectWish(item.id)} 
                          />
                        </td>
                        <td><strong>#{item.id}</strong></td>
                        <td>
                          <div className="stick-list-thumb" onClick={() => setPreviewWish(item)} title="Click to view full photo">
                            <img 
                              src={item.image_path.startsWith('/') ? item.image_path : `/${item.image_path}`} 
                              alt={item.wish_title}
                              onError={(e) => { e.target.src = '/uploads/sample_stick1.png'; }}
                            />
                            <Maximize2 size={12} className="thumb-zoom-icon" />
                          </div>
                        </td>
                        <td>
                          <div className="list-wish-details">
                            <strong className="wish-list-title">{item.wish_title}</strong>
                            <p className="wish-list-story">"{item.wish_story}"</p>
                          </div>
                        </td>
                        <td>
                          <div className="list-submitter-info">
                            <strong>{item.submitter_name}</strong>
                            <a href={`tel:${item.submitter_phone}`} className="contact-link"><Phone size={12} /> {item.submitter_phone}</a>
                            {item.submitter_email && (
                              <a href={`mailto:${item.submitter_email}`} className="contact-link"><Mail size={12} /> {item.submitter_email}</a>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="location-pill-sm"><MapPin size={12} /> {item.city_region}</span>
                        </td>
                        <td>
                          <span className={`lang-pill-sm lang-${item.lang || 'en'}`}>
                            {(item.lang || 'en').toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <span className={`status-pill ${item.status}`}>
                            {item.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="timestamp-cell">{item.created_at}</td>
                        <td>
                          <div className="list-action-buttons">
                            <button 
                              onClick={() => setPreviewWish(item)}
                              className="btn-action view"
                              title="View Record Details"
                            >
                              <Eye size={14} /> View
                            </button>

                            {item.status !== 'approved' && (
                              <button 
                                onClick={() => handleAction(item.id, 'approve')}
                                disabled={actionLoadingId === item.id}
                                className="btn-action approve"
                                title="Approve wish"
                              >
                                <CheckCircle size={14} /> Approve
                              </button>
                            )}

                            {item.status !== 'rejected' && (
                              <button 
                                onClick={() => handleAction(item.id, 'reject')}
                                disabled={actionLoadingId === item.id}
                                className="btn-action reject"
                                title="Reject wish"
                              >
                                <XCircle size={14} /> Reject
                              </button>
                            )}

                            <button 
                              onClick={() => {
                                if (confirm(`Delete wish "${item.wish_title}" permanently?`)) {
                                  handleAction(item.id, 'delete');
                                }
                              }}
                              disabled={actionLoadingId === item.id}
                              className="btn-action delete"
                              title="Delete permanently"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}


        {/* =========================================================================
            TAB 3: USERS MANAGEMENT
           ========================================================================= */}
        {mainNavTab === 'users' && (
          <div className="tab-view-container animate-fade-in">
            <div className="view-header">
              <h2><Users size={24} color="#00B5EC" /> Admin Portal Users Management</h2>
              <div className="header-actions-row">
                <button 
                  onClick={() => setShowCreateUser(!showCreateUser)} 
                  className="admin-btn-primary"
                >
                  <UserPlus size={16} /> {showCreateUser ? 'Close Form' : 'Add New Admin'}
                </button>
                <button onClick={fetchUsers} className="admin-refresh-btn" title="Refresh Users">
                  <RefreshCw size={16} className={usersLoading ? 'spin' : ''} />
                </button>
              </div>
            </div>

            {/* User creation card/form */}
            {showCreateUser && (
              <div className="dashboard-section-card margin-bottom-lg animate-fade-in">
                <h3><UserPlus size={18} color="#00B5EC" /> Create New Admin User</h3>
                
                {userError && <div className="admin-error-alert margin-bottom-md"><XCircle size={16} /> <span>{userError}</span></div>}
                {userMsg && <div className="admin-success-alert margin-bottom-md"><Check size={16} /> <span>{userMsg}</span></div>}

                <form onSubmit={handleCreateUser} className="create-user-grid">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input 
                      type="text" 
                      required 
                      value={newName}
                      onChange={e => setNewName(e.target.value)}
                      placeholder="e.g. Ruwan Jayasinghe"
                    />
                  </div>

                  <div className="form-group">
                    <label>Username *</label>
                    <input 
                      type="text" 
                      required 
                      value={newUsername}
                      onChange={e => setNewUsername(e.target.value)}
                      placeholder="e.g. ruwan_admin"
                    />
                  </div>

                  <div className="form-group">
                    <label>Password *</label>
                    <input 
                      type="password" 
                      required 
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Enter strong password"
                    />
                  </div>

                  <div className="form-group">
                    <label>Role</label>
                    <select value={newRole} onChange={e => setNewRole(e.target.value)} className="admin-select">
                      <option value="admin">Administrator</option>
                      <option value="superadmin">Super Administrator</option>
                    </select>
                  </div>

                  <div className="form-group-full">
                    <button type="submit" disabled={isCreatingUser} className="admin-btn-primary">
                      {isCreatingUser ? 'Creating...' : 'Create Admin Account'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Users List Table */}
            {usersLoading ? (
              <div className="admin-loading-state">
                <RefreshCw className="spin" size={32} color="#00B5EC" />
                <span>Loading users...</span>
              </div>
            ) : (
              <div className="table-wrapper-card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Admin User</th>
                      <th>Username</th>
                      <th>Role</th>
                      <th>Last Login</th>
                      <th>Created Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((u) => (
                      <tr key={u.id}>
                        <td>#{u.id}</td>
                        <td>
                          <div className="user-table-info">
                            <div className="user-avatar-icon">
                              <Shield size={16} color="#E6007E" />
                            </div>
                            <strong>{u.name}</strong>
                          </div>
                        </td>
                        <td><code>{u.username}</code></td>
                        <td>
                          <span className={`role-pill role-${u.role}`}>
                            {(u.role || 'admin').toUpperCase()}
                          </span>
                        </td>
                        <td>{u.last_login || 'Never'}</td>
                        <td>{u.created_at}</td>
                        <td>
                          <button 
                            onClick={() => handleDeleteUser(u.id, u.username)}
                            disabled={adminUser?.id === u.id}
                            className="btn-action delete"
                            title={adminUser?.id === u.id ? "Cannot delete active session account" : "Delete user"}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}


        {/* =========================================================================
            TAB 4: ACTIVITY LOG
           ========================================================================= */}
        {mainNavTab === 'logs' && (
          <div className="tab-view-container animate-fade-in">
            <div className="view-header">
              <h2><Activity size={24} color="#22C55E" /> System Audit Trail & Activity Log</h2>
              <button onClick={fetchLogs} className="admin-refresh-btn" title="Refresh Logs">
                <RefreshCw size={16} className={logsLoading ? 'spin' : ''} />
              </button>
            </div>

            {/* Search Input Toolbar */}
            <div className="admin-toolbar margin-bottom-md">
              <div className="admin-search-input width-full">
                <Search size={16} />
                <input 
                  type="text" 
                  placeholder="Filter logs by admin username, action type, description or IP..."
                  value={logSearch}
                  onChange={e => setLogSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && fetchLogs()}
                />
              </div>
            </div>

            {/* Activity Logs Table */}
            {logsLoading ? (
              <div className="admin-loading-state">
                <RefreshCw className="spin" size={32} color="#22C55E" />
                <span>Loading activity log...</span>
              </div>
            ) : logsList.length === 0 ? (
              <div className="admin-empty-state">
                <Activity size={48} color="#94A3B8" />
                <h3>No activity logs found</h3>
                <p>System activities and admin actions will be recorded here.</p>
              </div>
            ) : (
              <div className="table-wrapper-card">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Timestamp</th>
                      <th>Admin User</th>
                      <th>Action Type</th>
                      <th>Description</th>
                      <th>IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logsList.map((log) => (
                      <tr key={log.id}>
                        <td>#{log.id}</td>
                        <td className="timestamp-cell">{log.created_at}</td>
                        <td><strong>{log.admin_username}</strong></td>
                        <td>
                          <span className={`action-pill action-${log.action_type}`}>
                            {log.action_type}
                          </span>
                        </td>
                        <td>{log.description}</td>
                        <td><code>{log.ip_address || '127.0.0.1'}</code></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Record View Details Modal */}
      {previewWish && (
        <div className="admin-lightbox-overlay" onClick={() => setPreviewWish(null)}>
          <div className="admin-lightbox-card record-detail-modal" onClick={e => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="record-modal-header">
              <div className="header-left">
                <h3>Record #{previewWish.id} Details</h3>
                <span className={`status-pill ${previewWish.status}`}>
                  {previewWish.status.toUpperCase()}
                </span>
              </div>
              <button className="lightbox-close-btn" onClick={() => setPreviewWish(null)}>
                <X size={18} />
              </button>
            </div>

            {/* Modal Body Grid */}
            <div className="record-modal-body">
              {/* Left Column: Image & Upvotes */}
              <div className="record-image-col">
                <div className="lightbox-image-wrap">
                  <img 
                    src={previewWish.image_path.startsWith('/') ? previewWish.image_path : `/${previewWish.image_path}`} 
                    alt={previewWish.wish_title}
                    onError={(e) => { e.target.src = '/uploads/sample_stick1.png'; }}
                  />
                </div>
              </div>

              {/* Right Column: Record Metadata & Submitter Info */}
              <div className="record-info-col">
                <div className="record-meta-row">
                  <span className={`lang-pill-sm lang-${previewWish.lang || 'en'}`}>
                    {(previewWish.lang || 'en').toUpperCase()}
                  </span>
                  <span className="location-pill-sm">
                    <MapPin size={12} /> {previewWish.city_region}
                  </span>
                  <span className="timestamp-badge">
                    <Clock size={12} /> {previewWish.created_at}
                  </span>
                </div>

                <div className="info-group">
                  <label>Wish Title</label>
                  <h4>{previewWish.wish_title}</h4>
                </div>

                <div className="info-group">
                  <label>Wish Story / Message</label>
                  <p className="lightbox-story">"{previewWish.wish_story}"</p>
                </div>

                <div className="info-group submitter-card-box">
                  <label>Submitter Information</label>
                  <div className="submitter-details-grid">
                    <div>
                      <small>Full Name:</small>
                      <strong>{previewWish.submitter_name}</strong>
                    </div>
                    <div>
                      <small>Phone Number:</small>
                      <a href={`tel:${previewWish.submitter_phone}`} className="contact-link">
                        <Phone size={12} /> {previewWish.submitter_phone}
                      </a>
                    </div>
                    {previewWish.submitter_email && (
                      <div>
                        <small>Email Address:</small>
                        <a href={`mailto:${previewWish.submitter_email}`} className="contact-link">
                          <Mail size={12} /> {previewWish.submitter_email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="record-modal-footer">
              <div className="modal-actions-left">
                {previewWish.status !== 'approved' && (
                  <button 
                    onClick={() => {
                      handleAction(previewWish.id, 'approve');
                      setPreviewWish(prev => prev ? { ...prev, status: 'approved' } : null);
                    }}
                    disabled={actionLoadingId === previewWish.id}
                    className="btn-action approve"
                  >
                    <CheckCircle size={14} /> Approve Wish
                  </button>
                )}

                {previewWish.status !== 'rejected' && (
                  <button 
                    onClick={() => {
                      handleAction(previewWish.id, 'reject');
                      setPreviewWish(prev => prev ? { ...prev, status: 'rejected' } : null);
                    }}
                    disabled={actionLoadingId === previewWish.id}
                    className="btn-action reject"
                  >
                    <XCircle size={14} /> Reject Wish
                  </button>
                )}

                <button 
                  onClick={() => {
                    if (confirm(`Delete wish "${previewWish.wish_title}" permanently?`)) {
                      handleAction(previewWish.id, 'delete');
                      setPreviewWish(null);
                    }
                  }}
                  disabled={actionLoadingId === previewWish.id}
                  className="btn-action delete"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>

              <button onClick={() => setPreviewWish(null)} className="btn-close-modal">
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
