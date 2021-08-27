# Push test coverage script runnable in bitbucket pipelines

## Setup
- add `TEST_COVERAGE_USERNAME`, `TEST_COVERAGE_PASSWORD`, `TEST_COVERAGE_URL` to environment variables (BB / local)
- make sure to use this syntax -> **VARIABLE=VALUE** <- (not *VARIABLE='VALUE'*)

## Local testing
- **CAUTION: `export` may print environment variables to terminal on some systems**
- invoke as `export $(cat .env | xargs) && npx GoodRequest/test-coverage-push-script`
- exporting output from .env / xargs makes environment variables accessible to this script

## Implementation (example bitbucket-pipelines.yml step)
```yml
- step:
  name: Test code
  script:
    - npm run db:init:test
    - npm run test:coverage
    - npx GoodRequest/test-coverage-push-script
  services:
    - mssql
```
