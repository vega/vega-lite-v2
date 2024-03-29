# Contributing

If you find a bug in the code or a mistake in the [documentation](https://vega.github.io/vega-lite/docs/)
or want a new feature, you can help us by creating an issue to [our repository](https://github.com/vega/vega-lite),
or even better, submit a pull request.

- For small fixes, please feel free to submit a pull request. Don't worry about creating an issue first.

- For major changes, please discuss with us via [our mailing list](https://bit.ly/vega-discuss), [slack](https://bit.ly/join-vega-slack) or Github first,
so we can better coordinate our efforts, prevent duplication of work,
and help you to craft the change so that it is successfully accepted into the project.
  - One way to use GitHub for this purpose is to submit a pull request (PR) with a "[WIP]" prefix in the PR's title.  With a WIP PR, you can annotate your modification with questions.

- Generally we name a branch using this pattern `<your 2-3 letters initial>/<topic>`.
For example, @kanitw's branch regarding scale type might be called `kw/scale-type`.

See our [issue](.github/ISSUE_TEMPLATE.md) and [pull request](.github/PULL_REQUEST_TEMPLATE.md) templates for more information.

### Looking for a Task to Contribute

You can find [tasks with the "Help wanted" label in the issue tracker](https://github.com/vega/vega-lite/labels/Help%20wanted). Please get in touch if you are planning to work on a major task.

### Help Create New Examples

To submit a new example, fork our [example Block](https://bl.ocks.org/domoritz/455e1c7872c4b38a58b90df0c3d7b1b9) and send us a [pull request to add a link](https://github.com/vega/vega-lite/edit/master/site/examples/index.md) to it to our [example gallery](https://vega.github.io/vega-lite/examples/).

## Documentation and Website

The website is under `site/` and the documentation is under `site/docs/`.
We use Github Pages to publish our documentation when we release a new version.
To contribute changes to the documentation or website, simply submit a pull request that changes the corresponding markdown files in `site/`.

Since we only publish the Github Pages when we release a new version,
it might be slightly outdated compared to `master`.
For development, once you have [setup the repository](#repository-setup),
you can run `yarn site` to serve the github page locally at [http://localhost:4000/vega-lite/](http://localhost:4000/vega-lite/).

Note that when you checkout different branches, the compiled JavaScript for the website might be reset. You will have to run `yarn build:site` to recompile the JavaScript so that interactive examples work.

### Documentation Guide

General Guides for Markdown Files:

- Wrap properties (`key`) with back ticks.
- Wrap values with back ticks for numbers and booleans (e.g., `5`, `true`) and wrap string values with both back ticks and double quotes (`"red"`).

#### Property Table

To generate a property tables from the JSON schema (which is in turn generated from the Typescript interfaces, you can include the `table.html` template. For example, to generate a table that includes `rangeStep`, `scheme`, and `padding` from `Scale`, you can use

```
{% include table.html props="rangeStep,scheme,padding" source="Scale" %}
```

To define a link for types in the table, you can edit `_data/link.yml`.

For JSDocs comment in the interfaces, please add `__Default value:__` line at the end to describe the property's value.

#### Examples

To include an example specification in the documentation, the specification's `.vl.json` file must be in `examples/specs`.
Then you can use the following span tag to include the specification (e.g., for `point_1d.vl.json`):

```
<span class="vl-example" data-name="point_1d"></span>
```

Before adding a new example, you might want to search inside `examples/` folder to see if there are other redundant examples that you can reuse.

To name the example file:
- Please begin with mark type and follow by some description for a static single view example.  For stacked marks, add `stacked_` prefix.
- For composite views, please begin the file with the operator name (e.g., `layer`).
- For interactive example, begin with either `interactive_` or `selection_`.
- For examples that are only for regression test, begin with `test_`.

After building an updated code or add a new example, make sure to run `yarn build:example <examplename>` (e.g., `yarn build:example bar_1d`) or `yarn build:examples` to recompile all examples so that your pull request includes a new compiled Vega specs and SVG files in `examples/compiled`.

__Notes:__
1) Our example building scripts only re-compile SVGs if the output Vega file changes (so it runs way faster). However, if you have a bug and accidentally change Vega outputs, please do not commit SVGs after you fix the bugs (as the SVGs are **not** recompiled if Vega output do not change from prior commits).  Instead, please reset your SVG changes.
2) To run `yarn build:examples`, you need to install [gnu parallel](https://www.gnu.org/software/parallel/). (For Mac, you can simply do `brew install parallel`.)


# Development Guide

## Repository Setup

1. Make sure you have [node.js](https://nodejs.org/en/). For mac users, we recommend using [homebrew](http://brew.sh) and simply run:

  ```sh
  brew install node
  ```

2. Clone this repository and cd into your local clone of the repository, and install all the npm dependencies. We use [yarn](https://yarnpkg.com/) to have reproducible dependencies:

  ```sh
  git clone https://github.com/vega/vega-lite.git
  cd vega-lite
  yarn
  ```

  Now you should be able to build and test the code.

3. To serve the website and documentation, you will need [ruby](https://www.ruby-lang.org/en/), [bundler](http://bundler.io/) and [Jekyll](https://help.github.com/articles/using-jekyll-as-a-static-site-generator-with-github-pages/).

  For ruby, Mac users can use [homebrew](http://brew.sh) to add it:
  ```sh
  brew install ruby@2.3
  ```

  For bundler:
  ```sh
  gem install bundler
  ```

  For jekyll and its dependencies, because we already have the `Gemfile` in the repo, you can simply run:
  ```sh
  bundle install
  ```

## Directory Structure

- `_layouts/` – Our website and documentation's Jekyll layout files.
- `bin/` – Scripts for using Vega-Lite with command line.
- `data/` – Example data.
- `site/` – Vega-Lite website including documentation.
- `examples/` – Example Vega-Lite specifications.
  - `specs` Vega-Lite examples.
  - `compiled` The generated Vega specifications and SVG files of the Vega-Lite examples.

- `scripts/` - Scripts for NPM commands.
- `src/` - Main source code directory.
  - All interfaces for Vega-Lite syntax should be declared at the top-level of the `src/` folder.
    - `src/index.ts` is the root file for Vega-Lite codebase that exports the global `vl` object.
    - Other files under `src/` reflect namespace structure. All methods for `vl.xxx` will be in either `src/xxx.ts` or `src/xxx/xxx.ts`.   For example, `vl.channel.*` methods are in `src/channel.ts` while `vl.compile` is in `src/compile/compile.ts`.

- `test/` - Code for unit testing. `test`'s structure reflects `src`'s directory structure.
For example, `test/compile/` tests files inside `src/compile/`.
  - Note that we prepend `/* tslint:disable:quotemark */` to all files under `test/compile`
  to allow putting JSON specs in tests directly without getting lint errors.
- `typings/` - TypeScript typing declaration for dependencies.

## Understanding How Vega-Lite Works

- The main compiler code is in `src/compile/compile.ts`. To try to understand how Vega-Lite works, first start by reading the `compile` method in the file and try to understand different phases in the compilation process.

## Commands

This section lists commands that are commonly used during development. See `package.json` for other commands.

### Build

You can run `yarn build` to compile Vega-Lite and regenerate `vega-lite-schema.json`.

### Basic Lint & Test & Test Coverage

Use `yarn test` (or `yarn test:inspect` to inspect tests) run ts-lint and all unit-tests respectively.

A lot of linting errors can be fixed automatically by running `yarn lint --fix`.

### Watch tasks

During development, it can be convenient to rebuild automatically or to run tests in the background. You can use:

- `yarn watch:test` to start a watcher task that **lints and runs tests** when any `.ts` file changes.

- `yarn watch:build` to start a watcher task that **re-compiles Vega-Lite** when `.ts` files related to VL change.

### Website

`yarn site`. See details in [Documentation and Website](#documentation-and-website).

### Deployment

(For team members only) `yarn deploy` will publish latest code to NPM
and also update github pages, which contains our webpage and documentation.
If you want to update only github pages, use `yarn deploy:gh`.

## Suggested Programming Environment.

We use the [Visual Studio Code](https://code.visualstudio.com/) editor with TSLint plugin.
- VSCode has nice built-in Typescript support!
- We already include project settings to hide compiled files  (`*.js`, `*.js.map`).  This should work automatically if you open the vega-lite folder with VSCode.
- Make sure to install [TypeScript Importer](https://marketplace.visualstudio.com/items?itemName=pmneo.tsimporter) and [TSLint](https://marketplace.visualstudio.com/items?itemName=eg2.tslint) extensions.

## Manually Testing with Vega-Editor

To manually test your changes locally, you should have a local instance of
[Vega Editor](https://github.com/vega/editor) and link Vega-Lite to the editor
(See [Vega Editor's README](https://github.com/vega/editor#local-testing--debugging)
for instructions).

## Developing Vega-Lite and Vega-Util

Vega-Lite depends on [vega-util](https://github.com/vega/vega-util).
If you plan to make changes to the utils and test Vega-Lite without publishing / copying compiled vega-util all the time, use [`yarn link`](http://justjs.com/posts/npm-link-developing-your-own-npm-modules-without-tears).

```sh
# first link vega-util global npm
cd path/to/vega-util
yarn link
# then link vega-lite to datalib
cd path/to/vega-lite
yarn link vega-util
```

Now all of the changes you make in vega-util are reflected in your Vega-Lite automatically.

## Pull Requests and Travis

All pull requests will be tested on [Travis](https://travis-ci.org/). If your PR does not pass the checks, your PR will not be approved. Travis' environments will run `yarn test`, generate vega specs and SVG files from your updated code, compare them with the existing compiled outputs in `examples/compiled/`, and check code coverage of your code.  (See `.travis.yml` for the commands it executes.) If you don't want your PR reviewed until Travis checks pass, just prepend `[WIP]` to the title of your PR. Once you're ready for review, remove the `[WIP]` prefix and comment that the PR is ready for review.

### Code Coverage

When checking for code coverage, we require that your PR tests cover at least the same percentage of code that was being covered before. To check the code coverage, you can see the link in the job log of your Travis test, from the Github page of your PR, or on `https://codecov.io/gh/vega/vega-lite/commits`. It'll be usually in the form of `https://codecov.io/gh/vega/vega-lite/commit/your-full-head-commit-number`. Under the *Files* and *Diff* tab, you can check your code coverage differences and total. In *Files*, you can check which lines in your files are being tested (marked in green) and which are not (marked in red). We appreciate PRs that improve our overall code coverage!

# Note

Vega-Lite enables a number of open-source applications including user interface tools ([PoleStar](https://github.com/uwdata/polestar) and [Voyager](https://github.com/uwdata/voyager)) and visualization recommender ([CompassQL](https://github.com/uwdata/compassql)). Look at their contribute pages if you are interested!


- [Voyager: Contribute](https://github.com/uwdata/voyager/wiki/Contribute)
- [CompassQL: Contribute](https://github.com/uwdata/compassql/wiki/Contribute)

-----

**Acknowledgment**: This contribution guide is partly inspired by [angular.js's CONTRIBUTION.md](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md).
