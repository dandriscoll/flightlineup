import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Sidebar from '../src/components/Layout/Sidebar';
import ContentPanel from '../src/components/Layout/ContentPanel';
import Modal from '../src/components/shared/Modal';
import Tile from '../src/components/shared/Tile';
import { Ship, Setup, SetupDefaults, AppMode } from '../types';

describe('Sidebar', () => {
    const defaultProps = {
        activeMode: 'roster' as AppMode,
        onModeChange: jest.fn(),
        collapsed: false,
        onToggleCollapse: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render all four mode buttons', () => {
        render(<Sidebar {...defaultProps} />);

        expect(screen.getByText('Enter Roster')).toBeInTheDocument();
        expect(screen.getByText('Lay Out Formation')).toBeInTheDocument();
        expect(screen.getByText('Assign Ships')).toBeInTheDocument();
        expect(screen.getByText('Create Printable Views')).toBeInTheDocument();
    });

    it('should highlight the active mode', () => {
        render(<Sidebar {...defaultProps} activeMode="formation" />);

        const formationItem = screen.getByText('Lay Out Formation').closest('.sidebar-nav-item');
        expect(formationItem).toHaveClass('active');
    });

    it('should call onModeChange when clicking a mode', async () => {
        const user = userEvent.setup();
        render(<Sidebar {...defaultProps} />);

        await user.click(screen.getByText('Assign Ships'));

        expect(defaultProps.onModeChange).toHaveBeenCalledWith('assign');
    });

    it('should call onToggleCollapse when clicking collapse button', async () => {
        const user = userEvent.setup();
        render(<Sidebar {...defaultProps} />);

        const collapseBtn = screen.getByRole('button', { name: /collapse/i });
        await user.click(collapseBtn);

        expect(defaultProps.onToggleCollapse).toHaveBeenCalled();
    });

    it('should add collapsed class when collapsed prop is true', () => {
        const { container } = render(<Sidebar {...defaultProps} collapsed={true} />);

        const sidebar = container.querySelector('.sidebar');
        expect(sidebar).toHaveClass('collapsed');
    });

    it('should show descriptions in expanded mode', () => {
        render(<Sidebar {...defaultProps} collapsed={false} />);

        expect(screen.getByText('Add pilots and aircraft')).toBeInTheDocument();
        expect(screen.getByText('Configure grid and labels')).toBeInTheDocument();
    });
});

describe('ContentPanel', () => {
    it('should render children', () => {
        render(
            <ContentPanel activeMode="roster">
                <div data-testid="child">Test Content</div>
            </ContentPanel>
        );

        expect(screen.getByTestId('child')).toBeInTheDocument();
        expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should display the correct title for roster mode', () => {
        render(
            <ContentPanel activeMode="roster">
                <div>Content</div>
            </ContentPanel>
        );

        expect(screen.getByText('Enter Roster')).toBeInTheDocument();
    });

    it('should display the correct title for formation mode', () => {
        render(
            <ContentPanel activeMode="formation">
                <div>Content</div>
            </ContentPanel>
        );

        expect(screen.getByText('Lay Out Formation')).toBeInTheDocument();
    });

    it('should display the correct title for assign mode', () => {
        render(
            <ContentPanel activeMode="assign">
                <div>Content</div>
            </ContentPanel>
        );

        expect(screen.getByText('Assign Ships')).toBeInTheDocument();
    });

    it('should display the correct title for export mode', () => {
        render(
            <ContentPanel activeMode="export">
                <div>Content</div>
            </ContentPanel>
        );

        expect(screen.getByText('Create Printable Views')).toBeInTheDocument();
    });
});

describe('Modal', () => {
    const defaultProps = {
        isOpen: true,
        setIsOpen: jest.fn(),
        title: 'Test Modal'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render when isOpen is true', () => {
        render(
            <Modal {...defaultProps}>
                <div>Modal Content</div>
            </Modal>
        );

        expect(screen.getByText('Test Modal')).toBeInTheDocument();
        expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('should not render when isOpen is false', () => {
        render(
            <Modal {...defaultProps} isOpen={false}>
                <div>Modal Content</div>
            </Modal>
        );

        expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    });

    it('should call setIsOpen(false) when clicking close button', async () => {
        const user = userEvent.setup();
        render(
            <Modal {...defaultProps}>
                <div>Content</div>
            </Modal>
        );

        const closeBtn = screen.getByRole('button', { name: /close/i });
        await user.click(closeBtn);

        expect(defaultProps.setIsOpen).toHaveBeenCalledWith(false);
    });

    it('should call setIsOpen(false) when clicking overlay', async () => {
        const user = userEvent.setup();
        const { container } = render(
            <Modal {...defaultProps}>
                <div>Content</div>
            </Modal>
        );

        const overlay = container.querySelector('.modal-overlay');
        if (overlay) {
            await user.click(overlay);
            expect(defaultProps.setIsOpen).toHaveBeenCalledWith(false);
        }
    });
});

describe('Tile', () => {
    const mockShip: Ship = {
        name: 'John Doe',
        tail: 'N12345',
        type: 'Mooney M20J',
        qualification: 'Wing',
        squadron: 'Texas',
        row: 0,
        col: 0,
        seat: null
    };

    const defaultSetup: Setup = { ...SetupDefaults };

    it('should render ship name and tail by default', () => {
        render(<Tile ship={mockShip} setup={defaultSetup} />);

        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('N12345')).toBeInTheDocument();
    });

    it('should render badge images for qualification and squadron', () => {
        const { container } = render(<Tile ship={mockShip} setup={defaultSetup} />);

        const images = container.querySelectorAll('img');
        expect(images.length).toBeGreaterThan(0);
    });

    it('should handle ship with null values', () => {
        const emptyShip: Ship = {
            name: null,
            tail: null,
            type: null,
            qualification: null,
            squadron: null,
            row: null,
            col: null,
            seat: null
        };

        // Should not throw
        expect(() => render(<Tile ship={emptyShip} setup={defaultSetup} />)).not.toThrow();
    });

    it('should apply occupant class when forOccupant is true', () => {
        const { container } = render(<Tile ship={mockShip} setup={defaultSetup} forOccupant={true} />);

        const table = container.querySelector('table.tile');
        expect(table).toHaveClass('occupant');
    });

    it('should use custom field assignments from setup', () => {
        const customSetup: Setup = {
            ...defaultSetup,
            row1: 'type',
            row2: 'name'
        };

        render(<Tile ship={mockShip} setup={customSetup} />);

        // Type should be in row1 position, name in row2
        expect(screen.getByText('Mooney M20J')).toBeInTheDocument();
        expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
});
