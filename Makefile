.PHONY: serve localserve format

# Build & deploy the production image using a "blue-green" style (rebuild first).
# Currently this simply rebuilds the image and brings up the
# `docker-compose.yml` stack; adjust as needed for a true blue/green swap.
serve:
	@echo "[make] deploying with docker-compose.yml"
	docker compose down
	docker compose up -d --build
	make clean

# Run the application locally using the compose file for development.
localserve:
	@echo "[make] starting local compose stack..."
	docker compose -f docker-compose-local-launch.yml up --build
	make clean

# Format source code: JavaScript with prettier and Python with black.
format:
	@echo "[make] formatting with prettier & black"
	# prettier configuration lives in the frontend package.json/vite setup
	npx prettier . --write  || true
	black .

logs:
	docker compose -f logs -f

# Clean up Docker images and volumes to free space. Adjust as needed for more targeted cleanup.
clean:
	docker image prune -f
	docker volume prune -f
