FROM python:3.12-slim


# Install Node.js
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

# Install pipenv
# We do not use pipenv in docker for running the project but we do need it to generate the requirements.txt for pip
RUN pip install pipenv

WORKDIR /home/django-docker

# Copy Python and Node.js dependencies
COPY Pipfile .
COPY Pipfile.lock .
COPY package.json .
COPY yarn.lock .

# Install Python and Node.js dependencies
RUN pipenv requirements > requirements.txt
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
