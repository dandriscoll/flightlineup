import React from 'react';
import { Ship, Setup, FormatShip, isValidIconFilename } from '../types';

interface TileProps {
    ship: Ship;
    setup: Setup;
    forOccupant?: boolean;
}

const Tile: React.FC<TileProps> = ({ ship, setup, forOccupant }) => {
    const [formattedShip, setFormattedShip] = React.useState<Ship>(ship);

    React.useEffect(() => {
        setFormattedShip(FormatShip(ship, setup, forOccupant));
    }, [ship, setup, forOccupant]);

    return (
        <>
            {formattedShip &&
            <table className={`tile ${forOccupant ? 'occupant' : ''}`}>
                <tbody>
                    <tr>
                        <td className='left'>
                            {formattedShip.leftIcon && isValidIconFilename(formattedShip.leftIcon) &&
                            <img src={`img/${formattedShip.leftIcon}`} alt={formattedShip.leftIcon} />
                            }
                            {formattedShip.leftIcon && !isValidIconFilename(formattedShip.leftIcon) &&
                            <div className='left-text'>{formattedShip.leftIcon}</div>
                            }
                        </td>
                        <td className='middle'>
                        {formattedShip.row1 &&
                            <div className='row1'>{formattedShip.row1}</div>
                        }
                        {formattedShip.row2 &&
                            <div className='row2'>{formattedShip.row2}</div>
                        }
                        </td>
                        <td className='right'>
                            {formattedShip.rightIcon && isValidIconFilename(formattedShip.rightIcon) &&
                            <img src={`img/${formattedShip.rightIcon}`} alt={formattedShip.rightIcon} />
                            }
                            {formattedShip.rightIcon && !isValidIconFilename(formattedShip.rightIcon) &&
                            <div className='right-text'>{formattedShip.rightIcon}</div>
                            }
                        </td>
                    </tr>
                </tbody>
            </table>
            }
        </>
    )
}

export default Tile;