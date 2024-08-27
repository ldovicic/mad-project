import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { useEffect, useState } from "react";
import initSqlJs from "sql.js";

const getData = async () => {
	const SQL = await initSqlJs({
		locateFile: file => `https://sql.js.org/dist/${file}`,
	});

	const response = await fetch("database.db");
	const arrayBuffer = await response.arrayBuffer();
	const Uints = new Uint8Array(arrayBuffer);
	const db = new SQL.Database(Uints);

	const costByYear = db.exec("select model_year, round(avg(price)) as avg_price from car where model_year > 1994 group by model_year order by model_year")[0].values;
	const costByMileage = db.exec("select case when mileage >= 0 and mileage < 50000 then 'less than 50000' when mileage >= 50000 and mileage < 100000 then 'less than 100000' when mileage >= 100000 and mileage < 150000 then 'less than 150000' when mileage >= 150000 and mileage < 200000 then 'less than 200000' when mileage >= 200000 and mileage < 250000 then 'less than 250000' when mileage >= 250000 and mileage < 300000 then 'less than 300000' else 'over 300000' end as mileage_range, round(avg(price)) as avg_price from car group by case when mileage >= 0 and mileage < 50000 then 'less than 50000' when mileage >= 50000 and mileage < 100000 then 'less than 100000' when mileage >= 100000 and mileage < 150000 then 'less than 150000' when mileage >= 150000 and mileage < 200000 then 'less than 200000' when mileage >= 200000 and mileage < 250000 then 'less than 250000' when mileage >= 250000 and mileage < 300000 then 'less than 300000' else 'over 300000' end order by case when mileage_range = 'less than 50000' then 1 when mileage_range = 'less than 100000' then 2 when mileage_range = 'less than 150000' then 3 when mileage_range = 'less than 200000' then 4 when mileage_range = 'less than 250000' then 5 else 6 end")[0].values;
	const costByMake = db.exec("select make, round(avg(price)) as avg_price from car group by make order by avg_price desc")[0].values;


	return {
		"costByYear": costByYear,
		"costByMileage": costByMileage,
		"costByMake": costByMake,
	};
}

const Analysis = () => {
	const [data, setData] = useState(null);

	useEffect(() => {
		getData().then(data => {
			setData(data);
		});
	}, []);

	if (!data) {
		return <div>Loading...</div>;
	}

	const costByYear = data.costByYear.map(item => ({
		x: item[0],
		y: item[1],
	}));

	const costData = [{
		"id": "Average Price (€)",
		"data": costByYear,
	}];

	const costByMileage = data.costByMileage.map(item => ({
		x: item[0],
		y: item[1],
	}));

	const costByMileageData = [{
		"id": "Average Price (€)",
		"data": costByMileage,
	}];

	const costByMake = data.costByMake.map(item => ({
		"make": item[0],
		"cost": item[1],
	}));

	const costByMakeData = costByMake;

	return (
		<section className='analysis'>
			<div className="titleBlock">
				<h1>Analysis</h1>
				<p>Analysis of the obtained data.</p>
				<button>Back to beginning</button>
			</div>
			<div className="textBlock">
				<h2>Obtained results</h2>
				<p>In the previous part we have confirmed our hypothesis that Skoda would be the most popular car make. Surprisingly, automatic transmissions are more abundant despite the prevalence of manual transmissions in Europe.</p>
			</div>

			<div className="chartBlock" style={{ height: "500px" }}>
				<h2>Cost by model year (past 30 years)</h2>
				<ResponsiveLine
					data={costData}
					margin={{ top: 20, right: 100, bottom: 100, left: 100 }}
					xScale={{ type: 'point' }}
					yScale={{
						type: 'linear',
						min: 'auto',
						max: 'auto',
						stacked: true,
						reverse: false
					}}
					axisBottom={{
						legend: 'Year',
						legendOffset: 36,
						legendPosition: 'middle',
					}}
					axisLeft={{
						legend: 'Average price (€)',
						legendOffset: -50,
						legendPosition: 'middle',
					}}
					colors={['#000000']}
					pointSize={10}
					pointColor={{ from: 'color', modifiers: [] }}
					pointBorderWidth={2}
					pointBorderColor={{ from: 'serieColor' }}
					pointLabel="data.yFormatted"
					enableTouchCrosshair={true}
					useMesh={true}
				/>
			</div>

			<div className="textBlock">
				<h2>Analysis</h2>
				<p>Here, we see a steady exponential increase in price with increasing model year, as expected. This growth, however, gets slower as we approach the present year. This is most likely due to cars not depreciating in value as much within the first few years. Cars made before 2000, and even more so before 1996, sell for higher price - most likely due to their rarity, i.e. lower supply.</p>
			</div>

			<div className="chartBlock" style={{ height: "500px" }}>
				<h2>Cost by mileage</h2>
				<ResponsiveLine
					data={costByMileageData}
					margin={{ top: 20, right: 100, bottom: 100, left: 100 }}
					xScale={{ type: 'point' }}
					yScale={{
						type: 'linear',
						min: 'auto',
						max: 'auto',
						stacked: true,
						reverse: false
					}}
					axisBottom={{
						legend: 'Mileage (km)',
						legendOffset: 36,
						legendPosition: 'middle',
					}}
					axisLeft={{
						legend: 'Average price (€)',
						legendOffset: -50,
						legendPosition: 'middle',
					}}
					colors={['#000000']}
					pointSize={10}
					pointColor={{ from: 'color', modifiers: [] }}
					pointBorderWidth={2}
					pointBorderColor={{ from: 'serieColor' }}
					pointLabel="data.yFormatted"
					enableTouchCrosshair={true}
					useMesh={true}
				/>
			</div>

			<div className="textBlock">
				<h2>Analysis</h2>
				<p>Nothing unexpected here, either. The price goes down with increasing mileage, as the cars get less reliable and more expensive to fix.</p>
			</div>

			<div className="chartBlock" style={{ height: "1500px" }}>
				<h2>Cost by make</h2>
				<ResponsiveBar
					data={costByMakeData}
					keys={['cost']}
					indexBy="make"
					margin={{ top: 50, right: 60, bottom: 50, left: 100 }}
					padding={0.3}
					layout="horizontal"
					colors={['#000000']}
					axisBottom={{
						tickSize: 5,
						tickPadding: 5,
						tickRotation: 0,
					}}
					axisLeft={{
						tickSize: 5,
						tickPadding: 5,
						tickRotation: 0,
					}}
					enableLabel={false}
				/>
			</div>

			<div className="textBlock">
				<h2>Analysis</h2>
				<p>Once again, luxury cars surpass regular ones by far. It is interesting to note that Skoda has not placed within the cheapest makes. Toyota has also placed somewhat high, especially compared to other Japanese brands within the same category, e.g. Honda. Maybach has outdone Rolls Royce, despite Rolls Royce being generally the more expensive brand.</p>
			</div>

			<div className="textBlock">
				<h2>Final thoughts</h2>
				<p>Most of my hypotheses were during the course of this project confirmed. Although, it was interesting to compare the general trends of the market with some commonly thought concepts.</p>
				<p>As I have decided to create a web app, I was met with lots of difficulties, most of them related to the technologies that I have chosen. As I wanted to work mostly with front end, connecting to the database has been rather difficult as most libraries are back end only. Upon further research I have come upon the <code>sql.js</code> library which has solved my problems.</p>
				<p>Another difficult part has been the visualization, as the library used (nivo) is not very well documented. This part was mostly trial and error. The non-web related parts were rather easy.</p>
				<p>As a result, I have learned many new technologies (scrapy, React, many JS libraries and frameworks) which I look forward to using in the future. I would not do anything differently as I think everything was a good learning experience.</p>
			</div>
		</section>
	);
}

export default Analysis;