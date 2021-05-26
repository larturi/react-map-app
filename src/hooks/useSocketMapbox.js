import { useEffect } from 'react';

import { useMapbox } from '../hooks/useMapbox';

export const useSocketMapbox = ( socket, puntoInicial ) => {

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


    return {
        puntoInicial,
        coords, 
        setRef,
    }
    

}
