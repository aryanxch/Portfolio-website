import { useState, useEffect } from 'react';
const Sidebar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <div className="fixed left-0 top-0 h-full w-80 bg-background border-r border-border p-8 overflow-y-auto">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-xl font-serif font-bold tracking-wide mb-2">Aryan Choudhari</h1>
          <div className="text-lg font-mono">
            {formatTime(currentTime)}
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-4">
          {[{
          id: 'about',
          label: 'ABOUT'
        }, {
          id: 'experience',
          label: 'EXPERIENCE'
        }, {
          id: 'projects',
          label: 'PROJECTS'
        }, {
          id: 'education',
          label: 'EDUCATION'
        }, {
          id: 'contact',
          label: 'CONTACT'
        }].map(item => <button key={item.id} onClick={() => scrollToSection(item.id)} className="block text-left text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer">
              {item.label}
            </button>)}
        </nav>
      </div>
    </div>;
};
export default Sidebar;