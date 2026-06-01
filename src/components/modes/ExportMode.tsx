import React, { useState } from 'react';
import { Ship, Setup, Grid } from '../../../types';
import LineupGrid from '../shared/LineupGrid';
import Modal from '../shared/Modal';
import html2canvas from 'html2canvas';

interface ExportModeProps {
    setup: Setup;
    setSetup: (setup: Setup) => void;
    ships: Ship[];
    rows: number;
    cols: number;
}

const ExportMode: React.FC<ExportModeProps> = ({
    setup,
    setSetup,
    ships,
    rows,
    cols
}) => {
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [shareName, setShareName] = useState('');
    const [shareLink, setShareLink] = useState('');
    const [shareError, setShareError] = useState('');
    const [shareInProgress, setShareInProgress] = useState(false);

    const capturePng = () => {
        document.body.classList.add('print-preview');

        const previewElement = document.getElementById('export-preview');
        if (!previewElement) {
            document.body.classList.remove('print-preview');
            return;
        }

        html2canvas(previewElement, {
            scrollX: 0,
            scrollY: 0,
            backgroundColor: '#ffffff',
        }).then(canvas => {
            document.body.classList.remove('print-preview');

            const a = document.createElement('a');
            a.href = canvas.toDataURL('image/png');
            a.download = 'lineup.png';
            a.click();
        }).catch(() => {
            document.body.classList.remove('print-preview');
        });
    };

    const handlePrint = () => {
        window.print();
    };

    const handleShare = () => {
        setShareError('');
        setShareInProgress(true);

        fetch('https://adverseyaw.com/flightlineup/api/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: shareName, ships, setup }),
        })
            .then(response => response.json())
            .then(data => {
                if (!data || !data.filename) {
                    throw new Error(data && data.error ? data.error : 'Failed to generate share link');
                }
                setShareLink(`https://adverseyaw.com/flightlineup/?l=${data.filename}`);
                setShareInProgress(false);
            })
            .catch(error => {
                setShareError(error.message);
                setShareInProgress(false);
            });
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareLink);
        const inputElement = document.getElementById('share-link-input') as HTMLInputElement;
        if (inputElement) {
            inputElement.classList.add('flash');
            setTimeout(() => inputElement.classList.remove('flash'), 300);
        }
    };

    // Dummy handlers for read-only grid
    const noop = () => { };
    const noopGrid = (_: Grid, __?: Grid) => { };

    return (
        <div className="export-mode">
            {/* Preview Card */}
            <div className="card mb-6">
                <div className="card-header">
                    <h3 className="card-title">Preview</h3>
                    <p className="card-description">This is how your lineup will appear when exported</p>
                </div>

                <div id="export-preview" className="export-preview" style={{ padding: '24px', background: 'white' }}>
                    <LineupGrid
                        setup={setup}
                        setSetup={setSetup}
                        ships={ships}
                        rows={rows}
                        cols={cols}
                        handleClick={noop}
                        onMoveCells={noopGrid}
                        onMoveRows={noop}
                        readOnly={true}
                    />
                </div>
            </div>

            {/* Export Actions */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Export Options</h3>
                    <p className="card-description">Download, print, or share your lineup</p>
                </div>

                <div className="export-actions">
                    <button className="btn btn-primary btn-lg" onClick={capturePng}>
                        📥 Download PNG
                    </button>
                    <button className="btn btn-secondary btn-lg" onClick={handlePrint}>
                        🖨️ Print
                    </button>
                    <button className="btn btn-secondary btn-lg" onClick={() => setShareModalOpen(true)}>
                        🔗 Share Link
                    </button>
                </div>
            </div>

            {/* Share Modal */}
            <Modal isOpen={shareModalOpen} setIsOpen={setShareModalOpen} title="Share Your Lineup">
                <div className="share-content">
                    {!shareLink ? (
                        <>
                            <p className="mb-4">Generate a shareable link to your lineup that others can view.</p>

                            <div className="form-group">
                                <label className="form-label">Lineup Name (optional)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g., Mooney Caravan 2024"
                                    value={shareName}
                                    onChange={(e) => setShareName(e.target.value)}
                                    disabled={shareInProgress}
                                />
                            </div>

                            <button
                                className="btn btn-primary btn-lg w-full mt-4"
                                onClick={handleShare}
                                disabled={shareInProgress}
                            >
                                {shareInProgress ? 'Generating...' : 'Generate Share Link'}
                            </button>

                            {shareError && (
                                <p className="text-error mt-4">Error: {shareError}</p>
                            )}
                        </>
                    ) : (
                        <>
                            <p className="mb-4 text-success">Your lineup is ready to share!</p>

                            <div className="form-group">
                                <label className="form-label">Share Link</label>
                                <div className="flex gap-2">
                                    <input
                                        id="share-link-input"
                                        type="text"
                                        className="form-input"
                                        value={shareLink}
                                        readOnly
                                    />
                                    <button
                                        className="btn btn-primary"
                                        onClick={copyToClipboard}
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>

                            <button
                                className="btn btn-secondary w-full mt-4"
                                onClick={() => {
                                    setShareLink('');
                                    setShareName('');
                                    setShareModalOpen(false);
                                }}
                            >
                                Done
                            </button>
                        </>
                    )}
                </div>
            </Modal>

            {/* Privacy Note */}
            <div className="mt-6 text-sm text-secondary text-center">
                Your data is stored locally in your browser. Shared links store a snapshot on our server.
            </div>
        </div>
    );
};

export default ExportMode;
