import scrapy

class CarsSpider(scrapy.Spider):
    name = "cars"
    start_urls = []
    for low in range(500, 100501, 5000):
        url = f'https://www.autobazar.eu/vysledky/vozidla-do-3-5t/?priceFrom={low}&priceTo={low + 5000}&location=100000000&damaged=true&page='
        for i in range(1, 501):
            start_urls.append(url + str(i))
    start_urls.extend([f'https://www.autobazar.eu/vysledky/vozidla-do-3-5t/?priceFrom=100501&location=100000000&damaged=true&page={i}' for i in range(1, 501)])

    def parse(self, response):
        elements = response.xpath('//a[contains(@class, "block text-left text-[14px] font-semibold xs:text-[12px]")]')

        with open('./car_links.txt', 'a', encoding='utf-8') as file:
            for element in elements:
                href = element.xpath('@href').get()
                if 'detail' in href:
                    file.write('https://www.autobazar.eu' + href + '\n')
            