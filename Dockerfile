FROM python:3.12-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Install Node.js
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /workspace
ENV PATH="/workspace/.venv/bin:$PATH"

# Copy Python and Node.js dependencies
COPY pyproject.toml uv.lock ./
COPY package.json yarn.lock .yarnrc.yml ./

# Install Python and Node.js dependencies
RUN uv sync --frozen --no-dev
RUN corepack enable && corepack prepare yarn@4.12.0 --activate
RUN yarn install

# Copy the rest of the application code
COPY . .

# Build-time env vars (passed as --build-arg by DO App Platform)
ARG VITE_ALGOLIA_APP_ID
ARG VITE_ALGOLIA_PUBLIC_API_KEY

# Build frontend (Vite embeds VITE_* vars into the JS bundle)
ENV VITE_ALGOLIA_APP_ID=$VITE_ALGOLIA_APP_ID
ENV VITE_ALGOLIA_PUBLIC_API_KEY=$VITE_ALGOLIA_PUBLIC_API_KEY
RUN yarn run build

# Django collect static
RUN python manage.py collectstatic --noinput

CMD ["gunicorn", "--worker-tmp-dir", "/dev/shm", "--bind", "0.0.0.0:8080", "psychomodels.wsgi"]
