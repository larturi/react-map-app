import React, { useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

import { useSocketMapbox } from '../hooks/useSocketMapbox';

const puntoInicial = {
    lng: -58.4595,
    lat: -34.6327,
    zoom: 15
};

export const MapaPage = () => {

    const { socket } = useContext(SocketContext);


    const { coords, setRef } = useSocketMapbox(socket, puntoInicial);

    return (
        <>

            <div className="info">
                Lng: { coords.lng } | Lat: { coords.lat } | Zoom: { coords.zoom }
            </div>

            <div
                ref={setRef}
                className="mapContainer"
            >

            </div> 
        </>
    )
}
