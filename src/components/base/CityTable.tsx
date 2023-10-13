import React from 'react';
import styled from '@emotion/styled';
import { PetRequestData } from '../../hooks/usePetApi';
import { useTheme } from '@emotion/react';
import { getPetCityIdFromName } from '../twDistricts';
interface Props {
  sortedCities: string[];
  data: PetRequestData;
}
const Rectangle = styled.span`
 height: 1em;
 display: inline-block;

`;
const calculateCityAgeCount = (data: PetRequestData) => {
  const city_age_count: { [key: string]: { [key: string]: { CHILD: number, ADULT: number, UNKNOWN: number } } } = {};

  for (const animal of data.records) {
    const animal_subid = animal["animal_area_pkid"];
    const animal_age = animal["animal_age"];
    const animal_kind = animal["animal_kind"]; // 貓 | 狗

    if (!city_age_count[animal_subid]) {
      city_age_count[animal_subid] = {};
    }

    if (!city_age_count[animal_subid][animal_kind]) {
      city_age_count[animal_subid][animal_kind] = { CHILD: 0, ADULT: 0, UNKNOWN: 0 };
    }

    if (animal_age === "CHILD") {
      city_age_count[animal_subid][animal_kind]["CHILD"] += 1;
    } else if (animal_age === "ADULT") {
      city_age_count[animal_subid][animal_kind]["ADULT"] += 1;
    } else {
      city_age_count[animal_subid][animal_kind]["UNKNOWN"] += 1;
    }
  }

  return Object.entries(city_age_count).map(([animal_area_pkid, animalKindCounts]) => {
    const animalKindEntries = Object.entries(animalKindCounts);
    const result = animalKindEntries.map(([kind, counts]) => ({
      animal_area_pkid: animal_area_pkid,
      animal_kind: kind,
      CHILD: counts["CHILD"],
      ADULT: counts["ADULT"],
      UNKNOWN: counts["UNKNOWN"],
    }));
    return result;
  }).flat();
};




const CityTable: React.FC<Props> = ({ sortedCities, data }) => {

  const city_ages_list = calculateCityAgeCount(data);


  const getCHILDFromCityID = (animal_area_pkid: string, animal_kind: string): number => {
    return city_ages_list.find(
      (city) => city.animal_area_pkid === animal_area_pkid && city.animal_kind === animal_kind
    )?.CHILD || 0;
  };

  const getADULTFromCityID = (animal_area_pkid: string, animal_kind: string): number => {
    return city_ages_list.find(
      (city) => city.animal_area_pkid === animal_area_pkid && city.animal_kind === animal_kind
    )?.ADULT || 0;
  };


  const getUNKNOWNFromCityID = (animal_area_pkid: string, animal_kind: string): number => {
    return city_ages_list.find(
      (city) => city.animal_area_pkid === animal_area_pkid && city.animal_kind === animal_kind
    )?.UNKNOWN || 0;
  };

  const RectangleWrapper = ({ city }: { city: string }) => {
    const getTheme = useTheme();

    const widthRatio = 0.7;
    const cityID = getPetCityIdFromName(city)?.toString() || '';
    const dogChildCount = getCHILDFromCityID(cityID, "狗");
    const catChildCount = getCHILDFromCityID(cityID, "貓");

    const dogAdultCount = getADULTFromCityID(cityID, "狗");
    const catAdultCount = getADULTFromCityID(cityID, "貓");

    const dogUnknownCount = getUNKNOWNFromCityID(cityID, "狗");
    const catUnknownCount = getUNKNOWNFromCityID(cityID, "貓");


    const width_Dog1 = (dogChildCount * widthRatio) / 20;
    const width_Dog2 = (dogAdultCount * widthRatio) / 20;
    const width_Dog3 = (dogUnknownCount * widthRatio) / 20;

    const width_Cat1 = (catChildCount * widthRatio) / 20;
    const width_Cat2 = (catAdultCount * widthRatio) / 20;
    const width_Cat3 = (catUnknownCount * widthRatio) / 20;

    return (
      <div className='city-age-wrapper'>
        <div style={{ width: "100%", margin: ".5em", }}	>
          狗：
          <Rectangle style={{ width: `${width_Dog1}em`, backgroundColor: `${getTheme.typeColor}`, }} />
          <Rectangle style={{ width: `${width_Dog2}em`, backgroundColor: `${getTheme.dangerColor}`, }} />

          <Rectangle style={{ width: `${width_Dog3}em`, backgroundColor: `${getTheme.placeholderColor}`, }} />
          <div>{dogChildCount} : {dogAdultCount}: {dogUnknownCount}</div>
        </div >

        <div style={{ width: "100%", margin: ".5em", }}	>
          貓：
          <Rectangle style={{ width: `${width_Cat1}em`, backgroundColor: `${getTheme.typeColor}`, }} />
          <Rectangle style={{ width: `${width_Cat2}em`, backgroundColor: `${getTheme.dangerColor}`, }} />

          <Rectangle style={{ width: `${width_Cat3}em`, backgroundColor: `${getTheme.placeholderColor}`, }} />
          <div>{catChildCount} : {catAdultCount}: {catUnknownCount}</div>
        </div >
      </div>

    );
  };


  return (
    <table>
      <thead>
        <tr>
          <th >城市</th>
          <th>比例 [ 狗 / 貓 ] (幼年：老年：不明)</th>
        </tr>
      </thead>
      <tbody>
        {sortedCities.map((city, index) => (
          <tr key={index}>
            <td >{city}</td>
            <td><RectangleWrapper city={city} ></RectangleWrapper></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CityTable;
