import React from 'react';

interface PaneProps {
    title: string;
    children: React.ReactNode;
}

const Pane: React.FC<PaneProps> = ({ title, children }) => {
    const [collapsed, setCollapsed] = React.useState(false);

    const handleCollapse = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className={`pane ${collapsed ? 'collapsed' : ''}`}>
            <div className='pane-title no-print'>
                {title}
                <span className={`chevron ${collapsed ? 'collapsed' : ''}`} onClick={handleCollapse}></span>
            </div>
            {!collapsed && (
                <div className='pane-content'>
                    {children}
                </div>
            )}
        </div>
    );
};

export default Pane;