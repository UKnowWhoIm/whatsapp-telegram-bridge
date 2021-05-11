name: JS Linter
on: [push, pull_request]
branches: ["main"]
jobs:
  test:
    if: "! contains(toJSON(github.event.commits.*.message), '[skip-ci]')"
    name: Generate build and test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v1
        with:
          node-version: "16"
      - run: npm test