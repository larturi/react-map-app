import { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';

import { Subject } from 'rxjs';

import { v4 as uuidv4 } from 'uuid'

mapboxgl.accessToken = 'pk.eyJ1IjoibGFydHVyaSIsImEiOiJja3AxZnRhOHYwMWNhMnVtbG1xemkyY2RrIn0.ghsN2fMMuC9-bzgcFlHtWA';

export const useMapbox = (puntoInicial) => {

    // Referencia al div del mapa
    const mapaDiv = useRef();
    const setRef = useCallback( (node) => {
        mapaDiv.current = node;
    }, []);

    // Referencia a los marcadores
    const marcadores = useRef({});

    // Observables de Rxjs
    const movimientoMarcador = useRef( new Subject() );;
    const nuevoMarcador = useRef( new Subject() );

    const mapa = useRef();
    const [ coords , setCoords ] = useState(puntoInicial);

    // Funcion para agregar marcadores
    const agregarMarcador = useCallback( (ev, id) => {

        const { lng, lat } = ev.lngLat || ev;
        const marker = new mapboxgl.Marker();

        marker.id = id ?? uuidv4();

        marker
            .setLngLat([ lng, lat ])
            .addTo( mapa.current )
            .setDraggable( true );

        marcadores.current[marker.id] = marker; 

        // Solo si es un nuevo marcador (para evitar loop infinito en carga inicial)
        if (!id) {
            nuevoMarcador.current.next({
                id: marker.id,
                lng,
                lat
            });
        }

        // Escuchar movimientos del marcador
        marker.on('drag', ({ target }) => {
            const { id } = target;
            const { lng, lat } = target.getLngLat();

            movimientoMarcador.current.next({ id, lng, lat });
        }); 

    }, []);

    // Funcion para actualzar la ubicacion del marcador
    const actualizarPosicion = useCallback( ({ id, lng, lat }) => {
        marcadores.current[id].setLngLat([lng, lat]);
    }, []);

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapaDiv.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [ puntoInicial.lng, puntoInicial.lat ],
            zoom: puntoInicial.zoom
        });

        mapa.current = map;
    }, [puntoInicial]);

    // Cuando se mueve el mapa
    useEffect(() => {
        mapa.current?.on('move', () => {
            const { lng, lat } = mapa.current.getCenter();
            setCoords({
                lng: lng.toFixed(4),
                lat: lat.toFixed(4),
                zoom: mapa.current.getZoom().toFixed(2)
            });
        });
    }, []);

    // Agregar marcadores al hacer click
    useEffect(() => {
        mapa.current?.on('click', agregarMarcador);
    }, [agregarMarcador]);

    return {
        agregarMarcador,
        actualizarPosicion,
        coords,
        marcadores,
        nuevoMarcador$: nuevoMarcador.current,
        movimientoMarcador$: movimientoMarcador.current,
        setRef
    }

}