with open('./car_links.txt', 'r', encoding='utf-8') as file:
	lines = set(line for line in file)

with open('./car_links_unique.txt', 'a', encoding='utf-8') as file:
	for line in lines:
		file.write(line)