import { useContext, useEffect } from 'react';

import { useMapbox } from '../hooks/useMapbox';

export const useSocketMapbox = ( socket ) => {

    const puntoInicial = {
        lng: -58.4595,
        lat: -34.6327,
        zoom: 15
    };

    const { 
        agregarMarcador,
    } = useMapbox( puntoInicial );

    // Escuchar los marcadores existentes
    useEffect(() => {
        socket.on('marcadores-activos', (marcadores) => {
            for (const key of Object.keys(marcadores)) {
                agregarMarcador(marcadores[key], key);
            }
        });
    }, [socket, agregarMarcador]);


    return {
        puntoInicial
    }
    

}
