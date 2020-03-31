# Sparkset CRM

[Sparkset](https://www.hellosparkset.com/) helps business owners build experiences that aim to impress customers and promote growth. To better understand the clients and make the best decisions for them, it collects all sorts of data from the clients and continuously analyzes them. This app serves as a CRM where Sparkset employees can take notes when interviewing clients and easily look them up.

## Current Abilities

1. Add clients and add files accordingly to each client. There can be multiple clients associated with a single company.
2. Add notes and any associated tags. Filter notes by selecting a certain tag.
3. Create new users to use the system. It is possible to prevent new users from adding additional users to the system.
4. A global search bar allows the user to find any information on the entire system with a few keywords.
5. See inforation for each individual company on a seperate page.

## Dependencies

1. [LeanCloud](https://leancloud.app/) for [object storage](https://docs.leancloud.app/leanstorage_guide-js.html), [web hosting](https://docs.leancloud.app/leanengine_webhosting_guide-node.html), and [cloud functions](https://docs.leancloud.app/leanengine_cloudfunction_guide-node.html). Note that while we’re using the Developer Plan of LeanCloud (which is free), the cloud can only handle 30,000 requests per day. However, this is totally sufficient for the purpose of this app.
2. [Vue.js](https://vuejs.org/) as the front-end framework.
3. [Vue Router](https://router.vuejs.org/) for crunching multiple views into a single-page app.
4. [Vuex](https://vuex.vuejs.org/) for managing global states.
5. [vue-js-toggle-button](http://vue-js-toggle-button.yev.io/) for switch button.
6. [vue-multiselect](https://vue-multiselect.js.org/) for picking clients and tags for notes.
7. [Font Awesome](https://fontawesome.com/) for icons.

## Setting up Development Environment

### Installing Dependencies

```sh
npm install
```

The app will automatically compile after dependencies are installed.

### Running Locally

```sh
npm run serve
```

Note that this app doesn’t need LeanCloud’s command line interface to run locally.

## Deploying the App

The project is set up so that any commit made to this repository will automatically trigger the latest version on the `master` branch to be deployed to LeanEngine (so it’s safe to do experiments on other branches). See [LeanEngine Web Hosting documentation](https://docs.leancloud.app/leanengine_webhosting_guide-node.html#hash224173211) for how such mechanism is set up, as well as how you can manually deploy the app.

## TODO

1. Work on the creation of events for each client and user on the system.
