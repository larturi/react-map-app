import React, { useContext, useEffect } from 'react';
import { SocketContext } from '../context/SocketContext';

import { useMapbox } from '../hooks/useMapbox';

const puntoInicial = {
    lng: -58.4595,
    lat: -34.6327,
    zoom: 15
};

export const MapaPage = () => {

    const { socket } = useContext(SocketContext);
    const { 
            coords, 
            setRef, 
            agregarMarcador,
            actualizarPosicion,
            nuevoMarcador$, 
            movimientoMarcador$ 
    } = useMapbox( puntoInicial );

    // Escuchar los marcadores existentes
    useEffect(() => {
        socket.on('marcadores-activos', (marcadores) => {
            for (const key of Object.keys(marcadores)) {
                agregarMarcador(marcadores[key], key);
            }
        });
    }, [socket, agregarMarcador]);

    // Nuevo marcador
    useEffect(() => {
        nuevoMarcador$.subscribe( marcador => {
            socket.emit('marcador-nuevo', marcador);
        })
    }, [nuevoMarcador$, socket]);

    // Movimiento marcador
    useEffect(() => {
        movimientoMarcador$.subscribe( marcador => {
            socket.emit('marcador-actualizado', marcador);
        })
    }, [movimientoMarcador$, socket]);

    // Mover marcador mediante sockets
    useEffect(() => {
        socket.on('marcador-actualizado', (marcador) => {
            actualizarPosicion(marcador);
        });
    }, [socket, actualizarPosicion]);

    // Escuchar nuevos marcadores
    useEffect(() => {
        socket.on('marcador-nuevo', (marcador) => {
            agregarMarcador(marcador, marcador.id);
        });
    }, [socket, agregarMarcador]);

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
