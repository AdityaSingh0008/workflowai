import ChatWindow from "./components/ChatWindow";
import ApprovalCard from "./components/ApprovalCard";

export default function App() {
  return (
    <div className="app">
      <header>
        <h1>WorkFlowAI</h1>
        <p>Multi-Agent Business Operations Platform</p>
      </header>
      <main>
        <ChatWindow />
        <ApprovalCard />
      </main>
    </div>
  );
}
