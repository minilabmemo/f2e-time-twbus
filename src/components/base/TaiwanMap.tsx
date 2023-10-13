import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

import taiwanGeoJSON from '../files/taiwan.geojson';
// 這是點擊版本
interface GeoJSONProperties {
  COUNTYCODE: string;
  COUNTYNAME: string;
  COUNTYENG: string;
}

interface GeoJSONGeometry {
  type: string;
  coordinates: number[][][] | number[][][][];
}

interface GeoJSONFeature {
  properties: GeoJSONProperties;
  geometry: GeoJSONGeometry;
}


const TaiwanMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const hasFetchedData = useRef(false); // 新增一個 ref 來追蹤是否已經獲取過數據

  useEffect(() => {

    const width = 900;
    const height = 600;

    const svg = d3
      .select(mapRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('id', 'svg');

    const projection = d3.geoMercator()
      .scale(6000)
      .center([121, 24])
      .translate([width / 3, height / 2]);

    const pathGenerator = d3.geoPath().projection(projection);
    if (!hasFetchedData.current) { // 只有在尚未獲取數據的情況下執行
      fetch(taiwanGeoJSON) // 使用 fetch 進行數據獲取
        .then(response => response.json())
        .then(data => {
          hasFetchedData.current = true; // 標記已經獲取過數據
          const taiwanGeoJSON: GeoJSONFeature[] = data.features;

          svg
            .selectAll('path')
            .data(taiwanGeoJSON)
            .enter()
            .append('path')
            .attr('d', (d: any) => pathGenerator(d.geometry)!)
            .attr('id', (d) => 'city' + d.properties.COUNTYCODE)
            .on('click', (d) => {
              console.log(d.properties.COUNTYNAME);
              document.querySelector('h2')!.textContent = d.properties.COUNTYNAME;
              document.querySelector('h3')!.textContent = d.properties.COUNTYENG;

              const activeElement = document.querySelector('.active');
              if (activeElement) {
                activeElement.classList.remove('active');
              }

              const cityElement = document.getElementById('city' + d.properties.COUNTYCODE);
              if (cityElement) {
                cityElement.classList.add('active');
              }
            });
        })
        .catch(error => {
          console.error('Error loading GeoJSON data:', error);
        });
    }
  }, []);

  return (
    <div className="container-map">
      <div className="taiwan-map">
        <div ref={mapRef} id="map"></div>
      </div>
      <div className="shop-list">
        <h2></h2>
        <h3></h3>
      </div>
    </div>
  );
};

export default TaiwanMap;
