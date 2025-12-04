import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

interface ResizablePanelProps {
  children: React.ReactNode;
  width: number;
  minWidth: number;
  maxWidth: number;
  onResize: (width: number) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  position: 'left' | 'middle';
}

export function ResizablePanel({
  children,
  width,
  minWidth,
  maxWidth,
  onResize,
  isCollapsed = false,
  onToggleCollapse,
  position,
}: ResizablePanelProps) {
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!panelRef.current) return;

      const rect = panelRef.current.getBoundingClientRect();
      const newWidth = e.clientX - rect.left;

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        onResize(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, minWidth, maxWidth, onResize]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  return (
    <div
      ref={panelRef}
      className="relative flex-shrink-0 transition-all duration-300"
      style={{ width: isCollapsed ? 0 : width }}
    >
      <div className={`h-full overflow-hidden ${isCollapsed ? 'opacity-0' : 'opacity-100'} transition-opacity`}>
        {children}
      </div>

      {/* Resize Handle */}
      <div
        className={`absolute top-0 right-0 h-full w-1 cursor-col-resize hover:bg-blue-500 transition-colors group ${
          isResizing ? 'bg-blue-500' : 'bg-transparent'
        }`}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-1 h-12 bg-blue-500 rounded-full" />
        </div>
      </div>

      {/* Collapse/Expand Button */}
      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="absolute top-4 right-2 z-10 w-6 h-6 bg-white hover:bg-gray-100 rounded flex items-center justify-center transition-colors border border-gray-300 shadow-sm"
          title={isCollapsed ? '展开' : '收起'}
        >
          {position === 'left' ? (
            isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />
          ) : null}
        </button>
      )}

      {/* Collapsed Indicator */}
      {isCollapsed && onToggleCollapse && (
        <div className="absolute top-0 right-0 h-full w-8 bg-gray-50 border-r border-gray-200 flex items-center justify-center">
          <button
            onClick={onToggleCollapse}
            className="w-6 h-6 bg-white hover:bg-gray-100 rounded flex items-center justify-center transition-colors border border-gray-300 shadow-sm"
            title="展开"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}