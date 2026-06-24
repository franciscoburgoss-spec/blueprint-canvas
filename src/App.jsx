import { ProjectTree } from './components/ProjectTree';
import { ChatInterface } from './components/ChatInterface';
import { NotesPanel } from './components/NotesPanel';
import { Timeline } from './components/Timeline';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        <ProjectTree />
        <ChatInterface />
        <NotesPanel />
      </div>
      <Timeline />
    </div>
  );
}

export default App;
