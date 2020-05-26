<template>
  <div>
    <transition name="side-nav">
      <router-view
        name="sideNav"
        :class="['side-nav', $store.state.sideNavOn ? 'on' : '']"
      ></router-view>
    </transition>
    <transition name="side-nav-toggle">
      <router-view name="sideNavToggle" class="side-nav-toggle"></router-view>
    </transition>
    <transition name="top-nav">
      <router-view name="topNav" class="top-nav"></router-view>
    </transition>
    <transition name="page-wrapper">
      <router-view name="authWrapper" class="auth-wrapper"></router-view>
      <router-view name="basicWrapper" class="basic-wrapper"></router-view>
    </transition>
    <router-view
      v-if="$store.state.globalSearchOn"
      name="globalSearch"
      class="global-search"
    ></router-view>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
* {
  -webkit-appearance: none;
  box-sizing: border-box;
  border-radius: 0;
  outline: none;
  transition: all 0.1s linear;
}
body {
  margin: 0;
  background-color: #fff;
  font-family: "avenir next", sans-serif;
  font-weight: 400;
}
a {
  text-decoration: none;
  color: currentColor;
  cursor: pointer;
}
h1,
h2 {
  font-weight: 600;
  color: #36d5d8;
}
h1 {
  font-size: 18pt;
}
h2 {
  font-size: 16pt;
  margin-block-start: 0.3em;
}
table {
  width: 100%;
  text-align: left;
  border-spacing: 0 2px;
  table-layout: fixed;
}
thead {
  background-color: #00000008;
}
tbody {
  background-color: #00000004;
}
th,
td {
  padding: 8px;
  width: 192px;
}
.card {
  position: relative;
  float: left;
  margin: 0 0 12px 0;
  width: 100%;
  background-color: #fff;
  color: #605e5e;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  overflow: hidden;
}
.card:last-of-type {
  margin: 0;
}
.card--center {
  text-align: center;
}
.card--ghosted {
  background-color: transparent;
  border: none;
}
section {
  border-bottom: 1px solid #e5e5e5;
}
section:last-of-type {
  border-bottom: none;
}
.tabs {
  margin: 0 18px;
  padding: 0;
  list-style: none;
}
.tabs > li {
  display: inline-block;
  margin: 0 24px 0 0;
}
.tabs > li > a > span {
  display: inline-block;
  padding: 12px 0;
  border-bottom: 2px solid transparent;
}
.tabs > li > a:focus > span,
.tabs > li > a:hover > span {
  color: #36d5d8;
}
.tabs > li > a.router-link-exact-active > span {
  border-bottom: 2px solid #36d5d8;
  color: #36d5d8;
}
.fields {
  width: 100%;
  padding: 18px 18px 6px 18px;
  overflow: auto;
}
.fields > h1,
.fields > h2,
.fields > p,
.fields > li {
  margin: 8px 0;
}
.field {
  float: left;
  margin: 0 0 12px 0;
  width: 100%;
}
.field--superwide {
  overflow-x: auto;
}
.field--with--dropdown {
  position: relative;
}
.tag {
  display: inline-block;
  margin: 4px 4px 0 0;
  padding: 4px 8px;
  background-color: #36d5d822;
  color: #36d5d8;
  font-size: 9pt;
  border-radius: 2px;
  margin-bottom: 10px;
}
.tag.active {
  background-color: #36d5d8;
  color: #fff;
}
label > span {
  display: block;
  color: #605e5e;
}
label > span > a > svg > path {
  color: #36d5d8;
}
label > span > a:focus > svg > path,
label > span > a:hover > svg > path {
  color: #29a0a2;
}
input,
textarea,
select {
  border: 1px solid #e5e5e5;
  width: 100%;
  padding: 8px;
  background-color: #fff;
  font-family: "avenir next", sans-serif;
  font-weight: 400;
  font-size: 12pt;
  color: #605e5e;
  border-radius: 2px;
}
input:focus,
textarea:focus,
select:focus {
  border-color: #36d5d8;
}
label > input,
label > textarea,
label > select,
label > div,
label > .vue-js-switch {
  margin: 6px 0 0 0;
}
label > input:disabled,
label > textarea:disabled,
label > select:disabled {
  border-style: dashed;
}
label > textarea {
  resize: vertical;
}
option {
  font-weight: 400;
}
.dropdown {
  display: none;
  position: absolute;
  top: 56px;
  border: solid #36d5d8;
  border-width: 0 1px 1px 1px;
  width: 100%;
  padding: 4px 8px;
  background-color: #fff;
  border-radius: 0 0 2px 2px;
}
input:focus + .dropdown {
  display: block;
}
.dropdown__left,
.dropdown__right {
  font-size: 9pt;
  color: #36d5d8;
}
.dropdown__left {
  float: left;
}
.dropdown__right {
  float: right;
}
.dropdown__right > kbd {
  font-size: 6pt;
}
button {
  border: unset;
  margin: unset;
  padding: unset;
  background-color: unset;
  font-family: "avenir next", sans-serif;
  font-weight: 400;
  font-size: 12pt;
  cursor: pointer;
}
.field > button,
td > button,
h1 > button,
h2 > button {
  border: 1px solid #f7f5f5;
  padding: 8px 12px;
  background-color: #f7f5f5;
  color: #605e5e;
  border-radius: 2px;
}
.field > button:focus,
.field > button:hover,
td > button:focus,
td > button:hover,
h1 > button:focus,
h1 > button:hover,
h2 > button:focus,
h2 > button:hover {
  border-color: #e5e3e3;
  background-color: #e5e3e3;
}
.field > button.primary,
td > button.primary,
h1 > button.primary,
h2 > button.primary,
.field > button.danger,
td > button.danger,
h1 > button.danger,
h2 > button.danger {
  font-weight: 500;
  color: #fff;
}
.field > button.primary,
td > button.primary,
h1 > button.primary,
h2 > button.primary {
  border-color: #36d5d8;
  background-color: #36d5d8;
}
.field > button.primary:focus,
.field > button.primary:hover,
td > button.primary:focus,
td > button.primary:hover,
h1 > button.primary:focus,
h1 > button.primary:hover,
h2 > button.primary:focus,
h2 > button.primary:hover {
  border-color: #29a0a2;
  background-color: #29a0a2;
}
.field > button.danger,
td > button.danger,
h1 > button.danger,
h2 > button.danger {
  border-color: #e52f2e;
  background-color: #e52f2e;
}
.field > button.danger:focus,
.field > button.danger:hover,
td > button.danger:focus,
td > button.danger:hover,
h1 > button.danger:focus,
h1 > button.danger:hover,
h2 > button.danger:focus,
h2 > button.danger:hover {
  border-color: #ac2323;
  background-color: #ac2323;
}
.column {
  float: right;
  margin: 24px auto 0 auto;
  width: 100%;
  overflow: auto;
}
.column--left {
  margin: 12px auto 0 auto;
}
.side-nav {
  position: fixed;
  top: 0;
  bottom: 0;
  left: -100%;
  width: 100%;
  padding: 0 0 88px 0;
  background-color: #f3f3f3;
  overflow-y: auto;
  z-index: 2;
  transition: left 0.2s ease;
}
.side-nav:focus-within {
  left: 0;
}
.side-nav.on {
  left: 0;
}
.side-nav-enter-active,
.side-nav-leave-active {
  transition: left 0.4s ease 0.4s;
}
.side-nav-enter,
.side-nav-leave-to {
  left: -100%;
}
.side-nav-toggle {
  position: fixed;
  margin: 0 auto;
  right: 0;
  bottom: 16px;
  left: 0;
  width: 56px;
  height: 56px;
  line-height: 56px;
  text-align: center;
  background-color: #36d5d8;
  color: #fff;
  border-radius: 50%;
  z-index: 3;
}
.side-nav-toggle-enter-active,
.side-nav-toggle-leave-active {
  transition: transform 0.4s ease 0.4s;
}
.side-nav-toggle-enter,
.side-nav-toggle-leave-to {
  transform: scale(0);
}
.side-nav-toggle:focus,
.side-nav-toggle:hover {
  background-color: #29a0a2;
}
.top-nav {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  height: 48px;
  background-color: #f9f9f9;
  z-index: 1;
}
.top-nav-enter-active,
.top-nav-leave-active {
  transition: top 0.4s ease 0.4s;
}
.top-nav-enter,
.top-nav-leave-to {
  top: -48px;
}
.auth-wrapper {
  margin: 0;
}
.basic-wrapper {
  margin: 48px 0 0 0;
}
.page-wrapper-enter-active {
  transition: opacity 0.4s ease 0.8s;
}
.page-wrapper-leave-active {
  transition: opacity 0.4s ease;
}
.page-wrapper-enter,
.page-wrapper-leave-to {
  opacity: 0;
}
.global-search {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 4;
}
@media (min-width: 544px) {
  .card {
    margin: 0 0 16px 0;
  }
  .tabs {
    margin: 0 24px;
  }
  .tabs > li {
    margin: 0 32px 0 0;
  }
  .fields {
    padding: 24px 24px 8px 24px;
  }
  .field {
    margin: 0 0 16px 0;
  }
  .column--thin {
    float: none;
    max-width: 480px;
  }
  label > input,
  label > textarea,
  label > select,
  label > div,
  label > .vue-js-switch {
    margin: 8px 0 0 0;
  }
  .column {
    margin: 64px auto 0 auto;
  }
  .column--left {
    margin: 16px auto 0 auto;
  }
  .side-nav {
    padding: 0;
  }
}
@media (min-width: 800px) {
  .side-nav {
    left: 0;
    width: 256px;
  }
  .side-nav-enter,
  .side-nav-leave-to {
    left: -256px;
  }
  .side-nav-toggle {
    display: none;
  }
  .top-nav {
    left: 256px;
  }
  .basic-wrapper {
    margin: 48px 0 0 256px;
  }
}
@media (min-width: 1296px) {
  .column:not(.column--right) .field--half {
    width: calc((100% - 16px) / 2);
  }
  .column:not(.column--right) .field--half:nth-of-type(2n-1) {
    margin: 0 16px 16px 0;
  }
  .column:not(.column--right) .field--half:nth-of-type(2n) {
    margin: 0 0 16px 0;
  }
  .column--right {
    margin: 64px auto 0 auto;
    width: calc(30% - 8px);
  }
  .column--left {
    margin: 64px 16px 0 auto;
    width: calc(70% - 8px);
  }
}
</style>
