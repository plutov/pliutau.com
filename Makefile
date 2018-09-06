build:
	docker build -t blog --no-cache .

run:
	docker run -p 1313:80 blog