from typing import Optional
import scrapy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, Session
from sqlalchemy import create_engine

engine = create_engine("sqlite+pysqlite:///database.db", echo=False)

class Base(DeclarativeBase):
	pass

class Car(Base):
	__tablename__ = "car"

	id: Mapped[int] = mapped_column(primary_key=True)
	make: Mapped[str]
	model: Mapped[str]
	price: Mapped[int]
	fuel: Mapped[str]
	model_year: Mapped[int]
	engine_capacity: Mapped[int]
	mileage: Mapped[int]
	transmission: Mapped[str]
	power: Mapped[int]
	drivetrain: Mapped[str]
	color: Mapped[Optional[str]]
	url: Mapped[str]

Base.metadata.create_all(engine)

def parse_number(number: str) -> int:
    try:
        return int(number.replace(' ', '').replace('\xa0', '').replace('€', '').replace('km', ''))
    except:
        return 0
    
def parse_fuel(fuel: str) -> str:
    if 'hybrid' in fuel.lower():
        return 'hybrid'
    if 'benzin' in fuel.lower() or 'benzín' in fuel.lower():
        return 'petrol'
    if 'diesel' in fuel.lower():
        return 'diesel'
    if 'elektro' in fuel.lower():
        return 'electric'
    return 'other'

def parse_transmission(transmission: str) -> str:
    if 'automatic' in transmission.lower():
        return 'automatic'
    if 'manuál' in transmission.lower() or 'manual' in transmission.lower():
        return 'manual'
    return transmission

def parse_drivetrain(drivetrain: str) -> str:
    if 'predn' in drivetrain.lower():
        return 'FWD'
    if 'zadn' in drivetrain.lower():
        return 'RWD'
    if '4x4' in drivetrain.lower():
        return 'AWD'
    return drivetrain

class CarDetailsSpider(scrapy.Spider):
    name = "cardetails"
    with open('./car_links_unique.txt', 'r', encoding='utf-8') as file:
        start_urls = [line.strip() for line in file]

    def parse(self, response):
        try:
            data = {
                'make': response.xpath("//*[@id='__next']/div[2]/main/div/div[4]/div[1]/ul/li[3]/div/a/text()").get(),
                'model': response.xpath("//h1[@class='mb-[4px] mt-[8px] text-[20px] font-bold leading-[1.15] md:text-[23px] lg:mt-[24px] lg:text-[26px]']/text()").get().strip(),
                'price': parse_number(response.xpath('//*[contains(text(), "€") and @class="text-xl font-semibold"]/text()').get()),
                'fuel': parse_fuel(response.xpath("//span[.//span[text()='Palivo']]/span[contains(@class, 'text-[14px]')]/text()").get()),
                'model_year': int(response.xpath("//span[.//span[text()='Rok výroby']]/span[contains(@class, 'text-[14px]')]/text()").get().split('/')[-1]),
                'engine_capacity': parse_number(response.xpath("//span[.//span[text()='Objem motora']]/span[contains(@class, 'text-[14px]')]/span/text()").get()),
                'mileage': parse_number(response.xpath("//span[.//span[text()='Kilometre']]/span[contains(@class, 'text-[14px]')]/text()").get()),
                'transmission': parse_transmission(response.xpath("//span[.//span[text()='Prevodovka']]/span[contains(@class, 'text-[14px]')]/text()").get()),
                'power': int(response.xpath("//span[.//span[text()='Výkon']]/span[contains(@class, 'text-[14px]')]/text()").get().split()[0][:-2]),
                'drivetrain': parse_drivetrain(response.xpath("//span[.//span[text()='Pohon']]/span[contains(@class, 'text-[14px]')]/text()").get()),
                'color': response.xpath("//span[.//span[text()='Farba']]/span[contains(@class, 'text-[14px]')]/text()").get(),
                'url': response.url,
            }
            
            with Session(engine) as session:
                car = Car(**data)
                session.add(car)
                session.commit()

        except Exception as e:
            print(e)
            print(response.url)