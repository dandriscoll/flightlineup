import React, { useState } from 'react';
import { Ship, Setup } from '../../types';

interface ShareProps {
    setup: Setup;
    ships: Ship[];
    signalComplete: () => void;
}

const Share: React.FC<ShareProps> = ({ setup, ships, signalComplete }) => {
    const [inProgress, setInProgress] = useState(false);
    const [name, setName] = useState<string>('');
    const [link, setLink] = useState<string>('');
    const [errorText, setErrorText] = useState<string>('');

    const handleShare = () => {
        setErrorText('');
        setInProgress(true);
        fetch('https://adverseyaw.com/flightlineup/api/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: name, ships, setup }),
        })
        .then(response => response.json())
        .then(data => {
            setLink(`https://adverseyaw.com/flightlineup/?l=${data.filename}`);
            setInProgress(false);
        })
        .catch(error => {
            setErrorText(error.message);
            setInProgress(false);
        });
    };

    return (
        <div className='share' onClick={(e) => e.stopPropagation()}>
            <div className='close-button' onClick={() => signalComplete(true)}>
                <button>X</button>
            </div>
            <h3>Share your lineup</h3>
            <div className='text'>
                <input
                    type='text'
                    placeholder='Lineup name (optional)'
                    aria-label='Lineup name (optional)'
                    value={name}
                    readOnly={inProgress}
                    onChange={(e) => setName(e.target.value)} />
                <button onClick={handleShare}>Share</button>
            </div>

            {link &&
                <div className='text'>
                    <p>Your lineup is ready to share. Use the 'copy' button to copy the link to your clipboard.</p>
                    <input
                        type="text"
                        aria-label="Link to your lineup"
                        value={link}
                        readOnly />
                    <button onClick={() => {
                        const inputElement = document.querySelector('input[value="' + link + '"]') as HTMLInputElement;
                        inputElement.classList.add('flash');
                        setTimeout(() => inputElement.classList.remove('flash'), 300);
                        navigator.clipboard.writeText(link);
                    }}>Copy</button>
                </div>
            }

            {errorText &&
                <div className='text'>
                    <p>Error: {errorText}</p>
                </div>
            }
        </div>
    );
};

export default Share;