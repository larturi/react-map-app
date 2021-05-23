import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoibGFydHVyaSIsImEiOiJja3AxZnRhOHYwMWNhMnVtbG1xemkyY2RrIn0.ghsN2fMMuC9-bzgcFlHtWA';

const puntoInicial = {
    lng: -58.4595,
    lat: -34.6327,
    zoom: 15
};

export const MapaPage = () => {

    const mapaDiv = useRef();
    const [ mapa, setMapa ] = useState(null);
    const [ coords , setCoords ] = useState(puntoInicial);

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapaDiv.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [ puntoInicial.lng, puntoInicial.lat ],
            zoom: puntoInicial.zoom
        });

        setMapa(map);
    }, []);

    useEffect(() => {
        mapa?.on('move', () => {
            const { lng, lat } = mapa.getCenter();
            setCoords({
                lng: lng.toFixed(4),
                lat: lat.toFixed(4),
                zoom: mapa.getZoom().toFixed(2)
            });
        });
    }, [mapa]);

    return (
        <>

            <div className="info">
                Lng: { coords.lng } | Lat: { coords.lat } | Zoom: { coords.zoom }
            </div>

            <div
                ref={mapaDiv}
                className="mapContainer"
            >

            </div> 
        </>
    )
}
