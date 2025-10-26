import { useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import BackgroundWrapper from './react-bits/BackgroundWrapper';
import './Wheel.css';

const data = [
    { option: '%10' },
    { option: '%20' },
    { option: '%30' },
    { option: '%40' },
    { option: '%50' },
    { option: '%60' },
    { option: '%70' },
    { option: '%90' }
];

export default function WheelPage() {
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const handleSpinClick = () => {
        const randomIndex = Math.floor(Math.random() * data.length);
        setPrizeNumber(randomIndex);
        setMustSpin(true);
    };

    return (
        <BackgroundWrapper>
            <div className="wheel-page">
                <Wheel
                    mustStartSpinning={mustSpin}
                    prizeNumber={prizeNumber}
                    data={data}
                    fontSize={18}
                    backgroundColors={['#0088cc', '#ffffff']}
                    textColors={['#ffffff', '#0088cc']}
                    onStopSpinning={() => {
                        setMustSpin(false);
                        alert('Winner: ' + data[prizeNumber].option);
                    }}
                />

                <button className="spin-button" onClick={handleSpinClick}>
                    SPIN
                </button>
            </div>
        </BackgroundWrapper>
    );
}
