import { useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import BackgroundWrapper from './react-bits/BackgroundWrapper';
import './Wheel.css';
// this is library is awesome and gives the spinny wheel code is react library

const data = [
    { option: 'Golf Fang Glasgow' },
    { option: 'Bar 91' },
    { option: "Maggie's" },
    { option: "Tennents Bar" },
    { option: "O'Neill's Grand Central" },
    { option: 'Boteco Do Brasil' },
    { option: "The Lauder's" },
    { option: 'NQ64 Glasgow' },
    { option: 'Mecca Glasgow Drumchapel' },
    { option: 'Alea Glasgow Casino' },
    { option: 'Enish Restaurant & Lounge' },
    { option: "Waxy O'Connor's Glasgow" },
    { option: 'Mono' },
    { option: 'Super Bario' },
    { option: 'The Flying Duck' },
    { option: '18 Candleriggs' }
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
                    fontSize={11}
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
