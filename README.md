# gliff.ai SLPF

![Latest Tag](https://img.shields.io/github/v/tag/gliff-ai/slpf?&label=latest_tag&style=flat-square&color=f2f2f2) ![Number of Open Issues](https://img.shields.io/github/issues/gliff-ai/slpf?style=flat-square&color=yellow) ![Number of Open Pull Requests](https://img.shields.io/github/issues-pr/gliff-ai/slpf?style=flat-square&color=yellow) ![Number of Contributors](https://img.shields.io/github/contributors/gliff-ai/slpf?style=flat-square&color=yellow) ![Repository Size](https://img.shields.io/github/repo-size/gliff-ai/slpf?style=flat-square&color=red)

👋 **Welcome in!** 👋

This repository contains the Open Source code for [gliff.ai](https://gliff.ai/)'s Scanline Polygon Fill (SLPF) algorithm (based on: [Kyle Amoroso’s Polygon Fill Algorithms Benchmark](https://github.com/kamoroso94/polygon-fill-benchmark)) for use on [ANNOTATE](https://github.com/gliff-ai/annotate/blob/main/README.md).

This repository aims to allow users to fill the area of an annotation object within the ANNOTATE product for the purposes of enhancing their development of imaging AI products. gliff.ai’s SLPF is just one supporting aspect of [gliff.ai](https://gliff.ai/)’s growing privacy-preserving MLOps (Machine Learning Operations) platform. When the full [gliff.ai platform](https://gliff.ai/software/) is used, gliff.ai’s SLPF provides just one step in developing high-quality and auditable datasets that satisfy any relevant regulatory frameworks which enables our users to build world-changing and trustworthy AI models and products.

✅ **We welcome contributions on this repository!** ✅

## Table of Contents

Looking for something specific? 🔍

- [Repository Introduction](#gliffai-slpf)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Development](#development)
- [Linting and Formatting](#linting-and-formatting)
- [Testing](#testing)
- [Contribute](#contribute)
- [Contact](#contact)
- [License](#license)

## Installation

[{{back to navigation}}](#table-of-contents)

Run `npm install @gliff-ai/slpf` in your command line to install the package from the npm registry.

## Development

[{{back to navigation}}](#table-of-contents)

Frontend code should always be written in [Typescript](https://www.typescriptlang.org/) and transpiled using the options in `tsconfig.json` in this repository. npm should always be used for package management.

`npm run serve` will run a local webpack developer server for quick access.

## Linting and Formatting

[{{back to navigation}}](#table-of-contents)

As a standard, all code contributions should be linted with [ESLint](https://eslint.org/) using `.eslintrc.js` and formatted with [Prettier](https://prettier.io/). **Note:** HTML + CSS, mark-up and mark-down code are exemptions and should be formatted using [Prettier](https://prettier.io/) but do not need to be linted.

`npm run lint` will lint the codebase.

Our GitHub Actions will also lint any pull requests before they're merged.

## Testing

[{{back to navigation}}](#table-of-contents)

All code contributions should be tested using both the [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

`npm run test` will run any existing tests in our codebase.

Our GitHub Actions will also test any pull requests before they're merged! These all must pass and have 2 reviewers approval before a pull request can merge. If one or a few fail and your troubleshooting is not giving an answer, please check out the [gliff.ai Contribution Guide](https://github.com/gliff-ai/.github/blob/main/CONTRIBUTING.md) 👋 for further guidance.

## Continuous Integration

[{{back to navigation}}](#table-of-contents)

GitHub Actions should only be included under the `.github/workflows` path.

## Contribute

[{{back to navigation}}](#table-of-contents)

We welcome all contributors and any contributions on this project through the likes of feedback on or suggesting features and enhancements, raising bug problems, reporting on security vulnerabilities, reviewing code, requesting or creating tests, user testing etc. to ensure gliff.ai can help enable the best and biggest positive impact possible. 

Sounds good and want to contribute to the project? 🧑‍💻 \
Please check the [gliff.ai Contribution Guide]((https://github.com/gliff-ai/.github/blob/main/CONTRIBUTING.md)) 👋 before you get started. Don’t forget the [gliff.ai Code of Conduct]((https://github.com/gliff-ai/.github/blob/main/CODE_OF_CONDUCT.md)) ⚠️ and  [gliff.ai Security Policy]((https://github.com/gliff-ai/.github/blob/main/SECURITY.md)) 🔒 too!

A big thank you from the entire gliff.ai team to these fellow contributors ([emoji key](https://allcontributors.org/docs/en/emoji-key)): \
[{{Contributor List - _coming soon_}}](https://github.com/all-contributors/all-contributors)

## Contact

[{{back to navigation}}](#table-of-contents)

Need some help? 🤔 Have a question? 🧠 \
Reach out to the gliff.ai team at [community@gliff.ai](mailto:community@gliff.ai?subject=[GitHub]) or on GitHub.

## License

[{{back to navigation}}](#table-of-contents)

This code is licensed under a [GNU AGPLv3 license](https://github.com/gliff-ai/slpf/blob/main/LICENSE) 📝 \
Curious about our reasoning for this? Read about them [here](https://gliff.ai/articles/open-source-license-gnu-agplv3/)!
