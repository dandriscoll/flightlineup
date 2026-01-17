import React from 'react';
import { AppMode, AppModes } from '../../../types';

interface SidebarProps {
    activeMode: AppMode;
    onModeChange: (mode: AppMode) => void;
    collapsed: boolean;
    onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    activeMode,
    onModeChange,
    collapsed,
    onToggleCollapse
}) => {
    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <a href="/" className="sidebar-logo">
                    <span className="sidebar-logo-icon">✈️</span>
                    <span className="sidebar-logo-text">FlightLineup</span>
                </a>
            </div>

            <nav className="sidebar-nav">
                <ul className="sidebar-nav-list">
                    {AppModes.map((mode) => (
                        <li
                            key={mode.id}
                            className={`sidebar-nav-item ${activeMode === mode.id ? 'active' : ''}`}
                            onClick={() => onModeChange(mode.id)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    onModeChange(mode.id);
                                }
                            }}
                        >
                            <span className="sidebar-nav-icon">{mode.icon}</span>
                            <div className="sidebar-nav-content">
                                <span className="sidebar-nav-label">{mode.label}</span>
                                <span className="sidebar-nav-description">{mode.description}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="sidebar-footer">
                <button
                    className="sidebar-collapse-btn"
                    onClick={onToggleCollapse}
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    <span className="sidebar-collapse-icon">
                        {collapsed ? '→' : '←'}
                    </span>
                    <span className="sidebar-collapse-text">
                        {collapsed ? 'Expand' : 'Collapse'}
                    </span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
