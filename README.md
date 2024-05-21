# PsychoModels

This project establishes a database of formal models in psychology.
The website is written in Python using the Django framework.

### Pipenv

This project uses pipenv to manage dependencies. See https://pipenv.pypa.io/en/latest/index.html for installation
instructions. To install the dependencies, run:

```bash
pipenv install "PACKAGE_NAME"
pipenv install --dev "DEV_PACKAGE_NAME"
```

## Setup

You can run the project on your local machine by following the steps outlined below.

Install pipenv on your machine.

Install the dependencies for this project if you haven't installed them yet:

```bash
$ pipenv install
```

```bash
$ pipenv install --dev
```

Make and apply the migrations for the project to build your local database:

```bash
$ pipenv run python manage.py makemigrations
$ pipenv run python manage.py migrate
```

Run the Django development server:

```bash
$ pipenv run python manage.py runserver
```

## Linting

This project uses [Black]((https://github.com/psf/black)) for linting and formatting. Configure your editor to use Black
for formatting. To lint the project, run:

```bash
$ pipenv run black .
```

Pre-commit hooks are configured to run black on the staged files for every commit. You can skip the pre-commit hooks by
adding the `--no-verify` flag to your commit command.

The linting check is also run on the CI pipeline using Github actions.
