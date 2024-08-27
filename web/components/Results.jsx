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

	const totalCount = db.exec("select count(*) from car")[0].values[0][0];
	const manualCount = db.exec("select count(*) from car where transmission='manual'")[0].values[0][0];
	const automaticCount = db.exec("select count(*) from car where transmission='automatic'")[0].values[0][0];

	const mostFrequentMake = db.exec("select make, count(make) as occ from car group by make order by occ desc limit 1")[0].values[0];
	const mostFrequentYear = db.exec("select model_year, count(model_year) as occ from car group by model_year order by occ desc limit 1")[0].values[0];
	const mostFrequentDrivetrain = db.exec("select drivetrain, count(drivetrain) as occ from car group by drivetrain order by occ desc limit 1")[0].values[0];

	const averageMileage = db.exec("select avg(mileage) from car")[0].values[0][0];
	const averageCost = db.exec("select avg(price) from car")[0].values[0][0];
	const averagePower = db.exec("select avg(power) from car")[0].values[0][0];

	return {
		"totalCount": totalCount,
		"manualCount": manualCount,
		"automaticCount": automaticCount,
		"mostFrequentMake": mostFrequentMake,
		"mostFrequentYear": mostFrequentYear,
		"mostFrequentDrivetrain": mostFrequentDrivetrain,
		"averageMileage": averageMileage,
		"averageCost": averageCost,
		"averagePower": averagePower,
	};
}

const Results = () => {
	const [data, setData] = useState(null);

	useEffect(() => {
		getData().then(data => {
			setData(data);
		});
	}, []);

	if (!data) {
		return <div>Loading...</div>;
	}

	return (
		<section className='results'>
			<div className="titleBlock">
				<h1>Results</h1>
				<p>Initial results of the data collection.</p>
				<button>Skip to analysis</button>
			</div>
			<div className="statRow">
				<div className="statBlock">
					<div className="statTitle">Number of listings</div>
					<div className="statMain">{data.totalCount}</div>
					<div className="statDesc">cars for sale</div>
				</div>
				<div className="statBlock">
					<div className="statTitle">Number of manual transmissions</div>
					<div className="statMain">{data.manualCount}</div>
					<div className="statDesc"></div>
				</div>
				<div className="statBlock">
					<div className="statTitle">Number of automatic transmissions</div>
					<div className="statMain">{data.automaticCount}</div>
					<div className="statDesc"></div>
				</div>
			</div>

			<div className="statRow">
				<div className="statBlock">
					<div className="statTitle">Most frequent make</div>
					<div className="statMain">{data.mostFrequentMake[0]}</div>
					<div className="statDesc">{data.mostFrequentMake[1]} offerings</div>
				</div>
				<div className="statBlock">
					<div className="statTitle">Most frequent year</div>
					<div className="statMain">{data.mostFrequentYear[0]}</div>
					<div className="statDesc">{data.mostFrequentYear[1]} offerings</div>
				</div>
				<div className="statBlock">
					<div className="statTitle">Most frequent drivetrain</div>
					<div className="statMain">{data.mostFrequentDrivetrain[0]}</div>
					<div className="statDesc">{data.mostFrequentDrivetrain[1]} offerings</div>
				</div>
			</div>

			<div className="statRow">
				<div className="statBlock">
					<div className="statTitle">Average mileage</div>
					<div className="statMain">{Math.round(data.averageMileage)}</div>
					<div className="statDesc">kilometers</div>
				</div>
				<div className="statBlock">
					<div className="statTitle">Average cost</div>
					<div className="statMain">{Math.round(data.averageCost)}</div>
					<div className="statDesc">euros</div>
				</div>
				<div className="statBlock">
					<div className="statTitle">Average power</div>
					<div className="statMain">{Math.round(data.averagePower)}</div>
					<div className="statDesc">kW</div>
				</div>
			</div>
		</section>
	);
}

export default Results;