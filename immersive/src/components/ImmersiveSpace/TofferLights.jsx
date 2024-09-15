import React from 'react';

function TofferLights() {
    const tofferLightsPositions = [
        ["-30 15 -31", "-30 15 -18", "-30 15 -4", "-30 15 8.5", "-30 15 23", "-30 15 37"],
        ["-10 15 -37", "-10 15 -24", "-10 15 -10", "-10 15 2.5", "-10 15 15.4", "-10 15 28.5"],
        ["10 15 -31", "10 15 -18", "10 15 -4", "10 15 8.5", "10 15 23", "10 15 37"],
        ["30 15 -37", "30 15 -24", "30 15 -10", "30 15 2.5", "30 15 15.4", "30 15 28.5"],
    ];

    return (
        <>
            {/* Ceiling Lamps with Lights */}
            <a-entity>
                {tofferLightsPositions.map((row, rowIndex) => (
                    row.map((position, colIndex) => (
                        <a-entity 
                            key={`${rowIndex}-${colIndex}`} 
                            light="type: point; intensity: 1; distance: 25" 
                            position={position}
                        ></a-entity>
                    ))
                ))}
            </a-entity>
        </>
    );
}

export default TofferLights;
