const Introduction = () => (
	<main>
		<div className="titleBlock">
			<h1>Introduction</h1>
			<p>An introduction to the methodology used within this project.</p>
			<button>Skip to results</button>
		</div>
		<div className="textBlock">
			<h2>Initial proposal</h2>
			<p>Not all cars are made the same and the price usually reflects that. I want to examine the key factors that drive the price of used vehicles, whether that be the car&apos;s make, model year or other factors. Then, I would like to further analyze which models retain their value longer or shorter than the average, as certain models are still in demand many years later. The current hypothesis is that popular vehicle makes in Slovakia (Skoda, etc.) will be in demand more due to the availability of spare parts.</p>
		</div>

		<div className="textBlock">
			<h2>Objectives</h2>
			<ul>
				<li>find out <span className="bold">which factors influence the price the most</span></li>
				<li>find out <span className="bold">which makes retain their value the best</span></li>
				<li>build a <span className="bold">web application</span> to display the data</li>
			</ul>
		</div>

		<div className="textBlock">
			<h2>Used data</h2>
			<p>All data have been scraped from the online portal with used cars - <span className="bold"><a href="https://autobazar.eu">autobazar.eu</a></span>.</p>
		</div>

		<div className="textBlock">
			<h2>Acquiring data - part I.</h2>
			<p>The first step was collecting the URL addresses of all offers on the portal. The relevant script for this was <code>cars_spider.py</code>. The script scraped the autobazar.eu website for all car listings. However, the website was limited to 500 pages of results. To circumvent this, I had to split the scraping into different price intervals/categories to obtain all (most) results. Furthermore, the price was limited to the interval [500, ∞) to filter out results without a price, as well as rentals (more expensive rentals might still be included). The addresses were then saved to the file <code>car_links.txt</code>.</p>
		</div>

		<div className="textBlock">
			<h2>Preprocessing data - part I.</h2>
			<p>Any duplicates within the collected addresses had to be subsequently removed. This was handled by the script <code>unique.py</code>. Results were saved to the file <code>car_links_unique.txt</code>. This has the same functionality as the Linux commands <code>sort | uniq</code> or the Windows commands <code>type | sort -unique</code>.</p>
		</div>

		<div className="textBlock">
			<h2>Acquiring data - part II.</h2>
			<p>.The next step was scraping the individual offers for data. <code>car_details_spider.py</code> scraped all the unique addresses for data. It accessed relevant elements via their respective xpath values. It also automatically converted string numbers to integers and formatted strings. It set a standard for caterogical data and filtered out entries with nmissing values (except color). All this was then saved into the database.</p>
		</div>

		<div className="textBlock">
			<h2>Preprocessing data - part II.</h2>
			<p>After all the aforementioned scrips had finished running, manual validation had to be done. SQL queries were run to verify there were no invalid data and no alternative spellings for the car makes (e.g. VW and Volkswagen). Due to their low amount, these were manually corrected.</p>
		</div>
	</main>
)

export default Introduction;