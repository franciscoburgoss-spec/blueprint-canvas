import React from 'react';
import { ProjectTree } from './components/ProjectTree';
import { ChatInterface } from './components/ChatInterface';
import { NotesPanel } from './components/NotesPanel';
import { Timeline } from './components/Timeline';
import { DocumentComparator } from './components/DocumentComparator';
import { DocumentationModal } from './components/DocumentationModal';
import { InstallBanner } from './components/InstallBanner';
import { UpdateBanner } from './components/UpdateBanner';
import { useEffect, useState } from 'react';

const App: React.FC = () => {
  const [showComparator, setShowComparator] = useState<boolean>(false);
  const [showDocs, setShowDocs] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        <ProjectTree />
        <ChatInterface onShowComparator={() => setShowComparator(true)} onShowDocs={() => setShowDocs(true)} />
        <NotesPanel />
      </div>
      <Timeline />
      
      {showComparator && (
        <DocumentComparator onClose={() => setShowComparator(false)} />
      )}
      
      {showDocs && (
        <DocumentationModal onClose={() => setShowDocs(false)} />
      )}
      
      <InstallBanner />
      <UpdateBanner />
    </div>
  );
}

export default App;

