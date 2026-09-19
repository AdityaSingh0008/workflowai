import ChatWindow from "./components/ChatWindow";
import ApprovalCard from "./components/ApprovalCard";

export default function App() {
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="brand">
          <h1>WorkFlowAI</h1>
          <p>Enterprise AI Operations</p>
        </div>
        
        {/* Placeholder for future sidebar nav items */}
        <div style={{ flex: 1 }}></div>
        
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          System Status: <span style={{ color: 'var(--success)' }}>Online</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="content-grid">
          <ChatWindow />
          
          <div className="approvals-panel">
            <h2 className="approvals-header">Action Center</h2>
            <ApprovalCard />
          </div>
        </div>
      </main>
    </div>
  );
}
