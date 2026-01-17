import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ContentPanel from './ContentPanel';
import { AppMode } from '../../../types';

interface AppShellProps {
    activeMode: AppMode;
    onModeChange: (mode: AppMode) => void;
    children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ activeMode, onModeChange, children }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Close mobile menu when mode changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [activeMode]);

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleModeChange = (mode: AppMode) => {
        onModeChange(mode);
        setMobileMenuOpen(false);
    };

    return (
        <div className="app-shell">
            {/* Mobile menu button */}
            <button
                className="mobile-menu-btn no-print"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
            >
                ☰
            </button>

            {/* Mobile overlay */}
            {mobileMenuOpen && (
                <div
                    className="sidebar-overlay visible"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            <Sidebar
                activeMode={activeMode}
                onModeChange={handleModeChange}
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            <ContentPanel activeMode={activeMode}>
                {children}
            </ContentPanel>
        </div>
    );
};

export default AppShell;
