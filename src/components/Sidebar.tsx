import { useState, useEffect } from 'react';
import { TerminalSquare } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import MusicPlayer from './MusicPlayer';
import HiddenTarget from './HiddenTarget';
import BreakButton from './BreakButton';

interface SidebarProps {
  onOpenTerminal: () => void;
}

const Sidebar = ({ onOpenTerminal }: SidebarProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date, timeZone: string) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone,
    });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;
    const lenis = (window as unknown as { lenis?: { scrollTo: (target: HTMLElement) => void } }).lenis;
    if (lenis) {
      lenis.scrollTo(element);
    } else {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: 'about', label: 'ABOUT' },
    { id: 'experience', label: 'EXPERIENCE' },
    { id: 'projects', label: 'PROJECTS' },
    { id: 'education', label: 'EDUCATION' },
    { id: 'contact', label: 'CONTACT' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-80 bg-background border-r border-border p-8 overflow-y-auto">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-xl font-serif font-bold tracking-wide mb-3">Aryan Choudhari</h1>
          <div className="space-y-1 font-mono">
            <div className="flex items-baseline gap-3">
              <span className="text-xs text-muted-foreground w-8">ATL</span>
              <span className="text-base tabular-nums">{formatTime(currentTime, 'America/New_York')}</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-xs text-muted-foreground w-8">IST</span>
              <span className="text-base tabular-nums">{formatTime(currentTime, 'Asia/Kolkata')}</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="block text-left text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Controls */}
        <div className="space-y-3 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={onOpenTerminal}
              aria-label="Open terminal mode"
              title="Terminal mode"
              className="inline-flex items-center justify-center w-8 h-8 rounded border border-border text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
            >
              <TerminalSquare className="w-4 h-4" />
            </button>
            <span className="text-xs text-muted-foreground ml-1">try terminal</span>
          </div>
          <MusicPlayer />
          <BreakButton />
        </div>

        {/* Hidden target */}
        <HiddenTarget size={28} shardCount={22} wrapperClassName="pt-2 flex justify-start" />
      </div>
    </div>
  );
};

export default Sidebar;
