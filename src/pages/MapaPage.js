import React from 'react';

import { useMapbox } from '../hooks/useMapbox';

const puntoInicial = {
    lng: -58.4595,
    lat: -34.6327,
    zoom: 15
};

export const MapaPage = () => {

    if (localStorage.getItem('lng') && localStorage.getItem('lat') && localStorage.getItem('zoom')) {
        puntoInicial.lng = Number(localStorage.getItem('lng'));
        puntoInicial.lat = Number(localStorage.getItem('lat'));
        puntoInicial.zoom = Number(localStorage.getItem('zoom'));
    }

    const { coords, setRef } = useMapbox( puntoInicial );

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
