# Push test coverage script runnable in bitbucket pipelines

## Setup
- add `TEST_COVERAGE_USERNAME`, `TEST_COVERAGE_PASSWORD`, `TEST_COVERAGE_URL` to environment variables
- make sure to use this syntax -> **VARIABLE=VALUE** <- (not *VARIABLE='VALUE'*)

## Implementation
- `export $(cat .env | xargs) && npx <thisGistURL> || exit 1`
- exporting output from .env / xargs makes environment variables accessible to this script
- `... || exit 1` explicitly kills the pipeline if npx script throws in any way
