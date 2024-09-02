# PsychoModels

This project establishes a database of formal models in psychology.

PsychoModels is managed by Noah van Dongen and Leonhard Volz. PsychoModels is made possible through the NWO grant no.
OSF23.1.031.

PsychoModels was developed by Leonhard Volz who created the MVP and Vincent Verbrugh.

## Requirements

Make sure you have the following tools installed on your machine:

- **Python 3.x**
- **Node.js >= 20.x**
- **yarn**
- **pip**

---

## Architecture

The choice of Python and Django was driven by the familiarity of these technologies within the academic community.
This project will be maintained by members of the Psychology Department at the University of Amsterdam, who are comfortable with the chosen language and framework.

The frontend is written in React.js and uses Vite as a bundler. The choice for React.js was made because of the complexity of the submission wizard. We apply Islands Architecture of small React apps within a server side rendered Django template driven app.

Tailwind css is used both in the Django templates and the React components. Note that some legacy CSS declarations remain in `style.css`.

---

## Setup

1. Install the python dependencies:

```bash
$ pip install -r requirements.txt
```

2. Copy the `.env.example` file to `.env`.


3. Run migrations for the project to build your local database:

```bash
$ python manage.py migrate
```

For the frontend assets (js and css), you need to install node.js and yarn on your machine. Then run the vite and
tailwind dev server by running:

```bash
$ yarn install
$ yarn start
```

The vite dev server must be running in order for the python runserver command to work. Else you can expect a Vite dev
server is not started! error.

Run the Django development server:

```bash
$ python manage.py runserver
```

## Docker

The docker setup is mainly used for the e2e testing in the CI pipeline. But you can use it to run the project locally.

```bash
$ docker-compose up
# and
$ yarn test:e2e
```


## Fixtures

You can load initial data for development by running:

```bash
$ python manage.py loaddata programming_language software_package framework psychology_discipline variable
```

## Testing

There are two types of tests in this project: Django tests and frontend tests.

To run the Django tests, run:

```bash
$ python manage.py test
```

To run the frontend tests, run:

```bash
$ yarn test
```

## E2E Testing

The project uses Playwright for end-to-end testing. To run the E2E tests, run:

```bash
$ yarn test:e2e
```

You can run against your local development server or against the docker-compose setup. To run against the docker-compose
setup, run:

```bash
$ docker-compose up
# and
$ yarn test:e2e
```

## Linting

This project uses [Black]((https://github.com/psf/black)) for linting and formatting. Configure your editor to use Black
for formatting. To lint the project, run:

```bash
$ python -m black .
```

Pre-commit hooks are configured to run black on the staged files for every commit. You can skip the pre-commit hooks by
adding the `--no-verify` flag to your commit command.

The frontend code is linted using ESLint. You can run the linting check by running:

```bash
$ yarn lint
# or
$ yarn lint:fix
```

The linting check is also run on the CI pipeline using Github actions.

## Hosting

The project is hosted at Digital Ocean on App Platform and a managed Postgres database. The project is automatically
deployed to production on every push to the `main` branch and to staging on `develop` branch if the tests succeed on the CI/CD pipeline.
The Digital Ocean App Platform config is stored at `./do/**`. Make sure to sync the config if you make changes through the Digital Ocean interface.


## Database schema

To visualize the database schema you can use https://dbdiagram.io/. Export the schema by running:

```bash
pg_dump -h 127.0.0.1 -p 5432 -d psychomodels -U postgres -s -F p -E UTF-8 -f schema.sql
```

To only export the schema for the psychology_models app run:

```bash
# Initialize an empty variable to hold the table options
TABLE_OPTIONS=""

# Get the list of table names that match the pattern
TABLES=$(psql -h 127.0.0.1 -p 5432 -d psychomodels -U postgres -t -c "SELECT tablename FROM pg_tables WHERE tablename LIKE 'psychology_models_%';")

# Trim whitespace and iterate over each table
for table in $TABLES; do
    TABLE_OPTIONS="$TABLE_OPTIONS --table=$table"
done

# Check if TABLE_OPTIONS is not empty
if [ -z "$TABLE_OPTIONS" ]; then
    echo "No matching tables found."
    exit 1
fi

# Run pg_dump with the constructed table options
pg_dump -h 127.0.0.1 -p 5432 -d psychomodels -U postgres -s -F p -E UTF-8 -f schema.sql $TABLE_OPTIONS
```
