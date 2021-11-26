# Winget.run Svelte App

The frontend to [winget.run](https://winget.run), allowing users to search, discover, and install winget packages effortlessly without any third-party programs. Package manifests are periodically fetched from the GitHub API to prevent hitting ratelimits.

If you wish to use our API, please take a look at [our docs](https://docs.winget.run). All other non-documentation info will be provided in this readme.

## Contents

- [Winget.run Svelte App](#wingetrun-svelte-app)
  - [Contents](#contents)
  - [Installation](#installation)
  - [Development](#development)
  - [Deployment](#deployment)
  - [Contributing](#contributing)
  - [Authors](#authors)
  - [Acknowledgments](#acknowledgments)
  - [License](#license)

## Installation

A Docker image is built for the project in our CI/CD pipeline on the develop, release/\* and master branches. These can be found [here](https://github.com/winget-run/web/packages/237282). A detailed example of building and running the project without docker can be found in the [development](#Development) section.

## Development

Local development requires the following software:

- NodeJS
- PNPM

To install the nessasary dependencies, run:
- `pnpm install`

If everything is set up correctly, run the following command for an optimal development environment, which will make Sveltekit watch for changes and statefully hot-reload.

- `pnpm run dev`

Tests and linting can be run using the following commands:

- `pnpm run test`
- `pnpm run lint`

To create and serve a production-ready bundle, run:

- `pnpm run build`
- `pnpm run preview`

For any additional commands, check out the package.json.

## Deployment

We use GitHub Actions CI/CD and Kubernetes for our deployments. All required into regarding deployments can be found in /.github and /chart.

## Contributing

Issues and pull requests are welcome. We currently don't have any templates (at the time of writing) so a pr for those would be nice as well. If you wish to check the progress of current tickets, we have boards set up using [ZenHub](https://www.zenhub.com/).

We currently don't have tests, but will add them soon™.

## Authors

- **Matthew Watt** _(MattheousDT)_
- **Lukasz Niezabitowski** _(Dragon1320)_
- **Ryan Larkin** _(rlarkin212)_

## Acknowledgments

- Myself, for not ending it sooner. I'm proud of myself.

## License

Ask us if you want to use the code, or suggest a license and make a pr.
