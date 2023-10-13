import React, { useState } from 'react';
import { petCityIds, petShelterIds } from './twDistricts';
import styled from '@emotion/styled';
import pet from '../images/pet.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight, faCircle, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { theme } from '../style/theme';

import { ThemeProvider, useTheme } from '@emotion/react';

import { CatIcon, DogIcon } from './convert';
import usePetApi, { PetRequestData } from '../hooks/usePetApi';
import { NavLink } from 'react-router-dom';
import { Tab, Tabs } from './base/Tabs';
import TaiwanMap from './base/TaiwanMap';
import CityTable from './base/CityTable';




const Content = styled.div`
  margin:.8em ;
  width: max(100%,100px);
	
  height:auto ;
  display:flex ;
  flex-direction :column ;
  align-items:start ;
  color:#144480 ;
`;
const CityContent = styled.div`
  margin:.4em ;
`;

const CityText = styled.span`
color: #144480;
text-align: center;
font-family: Noto Sans TC;
font-size: .9em;
font-style: normal;
font-weight: 900;
line-height: normal;
margin-left:.8em ;

`;

const ShelterWrapper = styled.div`
  margin-left:.8em ;
  padding:1.5em ;
`;

const ShelterText = styled.span`
	color: #144480;
	text-align: center;
	font-family: 'Noto Sans TC';
	font-size: .8em;
	font-style: normal;
	font-weight: 900;
	line-height: normal;
	margin-left:.8em ;
`;

const ChartWrapper = styled.div`
  margin:.8em ;
  display:flex ;
	width:100% ;
	flex-wrap:wrap ;

`;
const ChartStatusBox = styled.div`
 	display         : flex ;
	flex-direction  : column ;
	justify-content:center ;
	align-items:start ;
	padding:.8em ;
	width           : auto ;
	
	background-color: #FFFDEF;
	color           : #000;
	font-family     : 'Noto Sans';
	font-size       : .7em;
	font-style      : normal;
	font-weight     : 400;
	line-height     : normal;
`;

const ChartStatus = styled.div`

	padding:.8em ;
	display         : flex ;
	justify-content:center ;
	align-items:center ;
	
	
	
`;
const ChartStatusTextWrapper = styled.span`
	width:7.5em ;
	text-align:center;
`;

const ChartSource = styled.div`
	padding:.8em ;
	margin    : 1.2em ;
	width           : min(50%,200px) ;
	height         : auto;
	background     : #EFFAFF;
	color          : #494949;
	font-family    : 'Noto Sans TC';
	font-size      : .6em;
	font-style     : normal;
	font-weight    : 900;
	line-height    : normal;
	display        : flex ;
	flex-direction : column ;
	justify-content: space-around ;
	text-align     : start;
`;

const RectangleWrapper = styled.span`
position:relative ;
 width: 100%;
	display:inline-block ;
	height: 1em;
`;

const RectangleCap = styled.span`
height: 1em;
 display: inline-block;
 position:absolute ;
 opacity:.3 ;
`;

const RectangleNow = styled.span`
height: 1em;
 display: inline-block;
 opacity:.6 ;
 position:absolute ;
 z-index:3 ;

`;






const PetChart = () => {
	const [petData] = usePetApi({
		isDog: false,
		isCat: false,
		isBird: false,
		isOthers: false,
		isSexF: false,
		isSexM: false,
		animalID: null,
		keyWordRef: null,
		areaRef: null,
		animalIDs: null,
		callAtInstall: true,
	});
	const TabCapStatus = () => {
		return (
			<>

				<Content>
					{sortedCities.map((city) => (

						<CityContent  >
							<CityText onClick={() => toggleCity(city)}>
								<FontAwesomeIcon icon={faCaretRight} size='lg' style={{ marginRight: '.4em' }} className={expandedCities.includes(city) ? '' : 'transform90deg'} />
								{city}
							</CityText>

							{expandedCities.includes(city) && (
								<ShelterWrapper>
									{petShelterIds
										.filter((shelter) => shelter.city === city)
										.map((shelter) => {
											const dogCount = getCount(shelter.name, "狗");
											const catCount = getCount(shelter.name, "貓");
											return (
												<div>
													<FontAwesomeIcon icon={faCircle} size='2xs' />
													<ShelterText >{shelter.name}</ShelterText>
													<ChartWrapper >
														<ChartStatusBox >
															<ChartStatus className='chart-status'>
																<span style={{ width: '5em' }}>犬隻收容量</span>
																<DogIcon percent={getPercent(shelter.capacity?.dog, dogCount)} />
																<ChartStatusTextWrapper >{getPercentText(shelter.capacity?.dog, dogCount)} </ChartStatusTextWrapper>
																<Rectangle capacity={shelter.capacity?.dog} now={dogCount}></Rectangle>

															</ChartStatus>
															<ChartStatus className='chart-status'>
																<span style={{ width: '5em' }}>貓隻收容量</span>
																<CatIcon percent={getPercent(shelter.capacity?.cat, catCount)} />
																<ChartStatusTextWrapper>{getPercentText(shelter.capacity?.cat, catCount)} </ChartStatusTextWrapper>

																<Rectangle capacity={shelter.capacity?.cat} now={catCount}></Rectangle>
															</ChartStatus>
														</ChartStatusBox>
														<ChartSource><div>資料來源 : </div><div>1. 農委會資料開放平台</div>
															{shelter.capacity && (<div>2. 網站報導 :
																[<a href={shelter.capacity?.source.URL} target='_blank' rel="noreferrer">{shelter.capacity?.source.name}, {shelter.capacity?.source.date}</a> ]
															</div>)}


														</ChartSource>
													</ChartWrapper>
												</div>
											);
										})}

								</ShelterWrapper>
							)}
						</CityContent>
					))}
				</Content>
			</>
		)
	}

	const calculateShelterCounts = (data: PetRequestData) => {
		const shelter_animal_count: { [key: string]: { [key: string]: number } } = {};

		for (const animal of data.records) {
			const shelter_name = animal["shelter_name"];
			const animal_kind = animal["animal_kind"].trim(); // Removing any leading/trailing spaces
			if (!shelter_animal_count[shelter_name]) {
				shelter_animal_count[shelter_name] = {};
			}
			if (!shelter_animal_count[shelter_name][animal_kind]) {
				shelter_animal_count[shelter_name][animal_kind] = 1;
			} else {
				shelter_animal_count[shelter_name][animal_kind] += 1;
			}
		}
		return Object.entries(shelter_animal_count).map(([shelter, counts]) => ({
			shelter_name: shelter,
			count: counts,
		}))
	};



	const shelter_counts_list = calculateShelterCounts(petData);

	const getCount = (shelter_name: string, animal_kind: string): number => {
		return shelter_counts_list.find(
			(shelter) => shelter.shelter_name === shelter_name
		)?.count[animal_kind] || 0;
	};


	const [expandedCities, setExpandedCities] = useState<string[]>([]);

	const toggleCity = (city: string) => {
		const cityIndex = expandedCities.indexOf(city);
		if (cityIndex === -1) {
			setExpandedCities([...expandedCities, city]);
		} else {
			setExpandedCities(expandedCities.filter((item) => item !== city));
		}
	};
	const Rectangle = ({ capacity, now }: { capacity: number | undefined, now: number }) => {
		const getTheme = useTheme();
		if (capacity === undefined) {
			capacity = 0;
		}
		if (capacity < 0) {
			throw new Error("Length must be a positive number.");
		}
		const widthRatio = 0.5;
		const width_R1 = (capacity * widthRatio) / 20;
		const width_R2 = (now * widthRatio) / 20;
		const percent = getPercent(capacity, now)
		let nowColor = getTheme.successColor;
		let capColor = getTheme.defaultColor;
		if (percent > 100) {
			nowColor = getTheme.dangerColor;
			capColor = getTheme.defaultColor;
		} else if (percent > 50) {
			nowColor = getTheme.primeColor;
		} else if (percent === 0) {
			nowColor = getTheme.defaultColor;
		}


		return (
			//TODO 不能這樣寫動畫 transition無效
			<RectangleWrapper style={{ width: "17.5em", margin: ".5em" }}	>
				<RectangleCap style={{ width: `${width_R1}em`, backgroundColor: `${capColor}` }} />
				<RectangleNow className="test" style={{ width: `${width_R2}em`, backgroundColor: `${nowColor}` }} />
			</RectangleWrapper >
		);
	};


	const uniqueCities: string[] = [];
	petShelterIds.forEach((shelter) => {
		if (!uniqueCities.includes(shelter.city)) {
			uniqueCities.push(shelter.city);
		}
	});

	const sortedCities = petCityIds
		.filter(city => uniqueCities.includes(city.name))
		.map(city => city.name);


	function getPercentText(capacity: number | undefined, nowTotal: number): string {
		if ((capacity === 0) || capacity === undefined) {
			return `${nowTotal}/未知 = 無法計算`;
		}
		else {
			return `${nowTotal}/${capacity} = ${Math.floor((nowTotal / capacity) * 100)} % `;
		}
	}

	function getPercent(capacity: number | undefined, nowTotal: number): number {
		if ((capacity === 0) || capacity === undefined) {
			return 0;
		}
		else {
			return Math.floor((nowTotal / capacity) * 100);
		}
	}




	return (

		<ThemeProvider theme={theme}>

			<div className='title-box'>
				<img style={{ width: "2em", height: "2em" }} src={pet} alt="pet" />
				<span className="title-text">統計圖表</span>

			</div>
			<div><FontAwesomeIcon icon={faCircleInfo} color='red' />本資料根據收容資料呈現，資料有誤或缺失等問題？，<NavLink to="/about">快來告訴我！</NavLink></div>
			<Tabs>
				<Tab label="各縣市收容比" key={1}>
					<TabCapStatus />
				</Tab>
				{/* <Tab label="全台狀態" key={2} >//TODO
					Wait...尚未完成
					<TaiwanMap></TaiwanMap>
				</Tab> */}
				<Tab label="各縣市年齡比" key={3}>

					<CityTable sortedCities={sortedCities} data={petData} />
				</Tab>
			</Tabs>
		</ThemeProvider>


	);
};

export default PetChart;
