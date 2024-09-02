FROM python:3.12-slim


# Install Node.js
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs


WORKDIR /home/django-docker

# Copy Python and Node.js dependencies
COPY requirements.txt .
COPY package.json .
COPY yarn.lock .

# Install Python and Node.js dependencies
RUN pip install -r requirements.txt
RUN npm install --global yarn
RUN yarn install --production=false


# Copy the rest of the application code
COPY . .

# Build frontend
RUN yarn run build

# Django collect static
RUN python manage.py collectstatic --noinput

# Run the application
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
