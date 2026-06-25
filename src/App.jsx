import { ProjectTree } from './components/ProjectTree';
import { ChatInterface } from './components/ChatInterface';
import { NotesPanel } from './components/NotesPanel';
import { Timeline } from './components/Timeline';
import { DocumentComparator } from './components/DocumentComparator';
import { InstallBanner } from './components/InstallBanner';
import { useEffect, useState } from 'react';

function App() {
  const [showComparator, setShowComparator] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        <ProjectTree />
        <ChatInterface onShowComparator={() => setShowComparator(true)} />
        <NotesPanel />
      </div>
      <Timeline />
      
      {showComparator && (
        <DocumentComparator onClose={() => setShowComparator(false)} />
      )}
      
      <InstallBanner />
    </div>
  );
}

export default App;
