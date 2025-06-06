
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useLanguage } from "@/contexts/LanguageContext";

const WorldMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const { language } = useLanguage();

  // Get title based on language
  const getTitle = () => {
    switch (language) {
      case "sv":
        return "Geografiska fördelar - Sverige & Tunisien";
      case "fr":
        return "Avantages géographiques - Suède & Tunisie";
      default:
        return "Geographic Advantages - Sweden & Tunisia";
    }
  };

  // Get subtitle based on language
  const getSubtitle = () => {
    switch (language) {
      case "sv":
        return "Samma tidszon, effektiv kommunikation";
      case "fr":
        return "Même fuseau horaire, communication efficace";
      default:
        return "Same time zone, efficient communication";
    }
  };

  // Get input placeholder based on language
  const getPlaceholder = () => {
    switch (language) {
      case "sv":
        return "Ange din Mapbox token här...";
      case "fr":
        return "Entrez votre token Mapbox ici...";
      default:
        return "Enter your Mapbox token here...";
    }
  };

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      projection: 'mercator',
      zoom: 2.5,
      center: [15, 50], // Center between Sweden and Tunisia
      pitch: 0,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Sweden marker
    const swedenMarker = new mapboxgl.Marker({ color: '#4CD6B3' })
      .setLngLat([18.0686, 59.3293]) // Stockholm coordinates
      .setPopup(new mapboxgl.Popup().setHTML('<h3>Sverige</h3><p>Stockholm</p>'))
      .addTo(map.current);

    // Tunisia marker
    const tunisiaMarker = new mapboxgl.Marker({ color: '#3BB5E9' })
      .setLngLat([9.5375, 33.8869]) // Tunis coordinates
      .setPopup(new mapboxgl.Popup().setHTML('<h3>Tunisien</h3><p>Tunis</p>'))
      .addTo(map.current);

    // Add a line connecting Sweden and Tunisia
    map.current.on('load', () => {
      map.current?.addSource('route', {
        'type': 'geojson',
        'data': {
          'type': 'Feature',
          'properties': {},
          'geometry': {
            'type': 'LineString',
            'coordinates': [
              [18.0686, 59.3293], // Stockholm
              [9.5375, 33.8869]   // Tunis
            ]
          }
        }
      });

      map.current?.addLayer({
        'id': 'route',
        'type': 'line',
        'source': 'route',
        'layout': {
          'line-join': 'round',
          'line-cap': 'round'
        },
        'paint': {
          'line-color': '#4CD6B3',
          'line-width': 3,
          'line-dasharray': [2, 2]
        }
      });
    });

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [mapboxToken]);

  if (!mapboxToken) {
    return (
      <div className="bg-black/10 backdrop-blur-sm rounded-lg p-8 border border-white/5 text-center">
        <h3 className="text-2xl font-bold mb-4 text-tunitech-mint">
          {getTitle()}
        </h3>
        <p className="text-gray-300 mb-6">
          För att visa kartan, vänligen ange din Mapbox token. Du kan få en gratis token på{" "}
          <a 
            href="https://mapbox.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-tunitech-blue hover:underline"
          >
            mapbox.com
          </a>
        </p>
        <input
          type="text"
          placeholder={getPlaceholder()}
          value={mapboxToken}
          onChange={(e) => setMapboxToken(e.target.value)}
          className="w-full max-w-md mx-auto px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-tunitech-mint"
        />
      </div>
    );
  }

  return (
    <div className="bg-black/10 backdrop-blur-sm rounded-lg p-8 border border-white/5">
      <h3 className="text-2xl font-bold mb-2 text-center text-tunitech-mint">
        {getTitle()}
      </h3>
      <p className="text-gray-300 text-center mb-6">
        {getSubtitle()}
      </p>
      <div className="relative w-full h-96 rounded-lg overflow-hidden">
        <div ref={mapContainer} className="absolute inset-0" />
      </div>
    </div>
  );
};

export default WorldMap;
