import React from 'react';
import { AppMode, AppModes } from '../../../types';

interface ContentPanelProps {
    activeMode: AppMode;
    children: React.ReactNode;
}

const ContentPanel: React.FC<ContentPanelProps> = ({ activeMode, children }) => {
    const modeConfig = AppModes.find(m => m.id === activeMode);

    return (
        <main className="content-panel">
            <header className="content-header no-print">
                <div className="content-header-inner">
                    <h1 className="content-title">{modeConfig?.label}</h1>
                    <p className="content-description">{modeConfig?.description}</p>
                </div>
            </header>
            <div className="content-main">
                {children}
            </div>
        </main>
    );
};

export default ContentPanel;
