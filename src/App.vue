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
h1 {
  font-weight: 600;
  font-size: 18pt;
  color: #36d5d8;
}
table {
  width: 100%;
  text-align: left;
  border-spacing: 0 2px;
}
table.condensed {
  table-layout: fixed;
}
table.condensed > thead > tr > th {
  height: 320px;
  vertical-align: bottom;
}
table.condensed > thead > tr > th > span {
  display: inline-block;
  white-space: nowrap;
  transform: rotate(-90deg) translateX(-12pt);
  transform-origin: 0 0;
}
thead {
  background-color: #00000009;
}
tbody {
  background-color: #00000006;
}
th,
td {
  padding: 8px;
}
.card {
  position: relative;
  float: left;
  margin: 0 0 12px 0;
  width: 100%;
  background-color: #fff;
  color: #605e5e;
  border: 1px solid rgba(204, 204, 204, 0.43);
  border-radius: 4px;
  overflow: hidden;
}
.card:last-of-type {
  margin: 0;
}
.card--padded {
  padding: 12px 18px;
}
.card--center {
  text-align: center;
}
.card--ghosted {
  background-color: transparent;
  border: none;
}
section {
  border-bottom: 1px solid rgba(204, 204, 204, 0.43);
}
section:last-of-type {
  border-bottom: none;
}
.fields {
  width: 100%;
  padding: 18px 18px 6px 18px;
  overflow: auto;
}
.fields h1,
.fields h2,
.fields p,
.fields li {
  margin: 8px 0;
}
.field {
  float: left;
  margin: 0 0 12px 0;
  width: 100%;
}
.field--with--dropdown {
  position: relative;
}
label > span {
  color: #605e5e;
}
input,
textarea,
select {
  border: 1px solid rgba(204, 204, 204, 0.43);
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
  border: 1px solid #36d5d8;
}
label > input,
label > textarea,
label > select {
  margin: 6px 0 0 0;
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
.dropdown > span {
  font-size: 9pt;
  color: #36d5d8;
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
td > button {
  border: 1px solid #36d5d8;
  padding: 8px;
  background-color: #fff;
  color: #36d5d8;
  border-radius: 2px;
}
.field > button:focus,
.field > button:hover,
td > button:focus,
td > button:hover {
  background-color: #36d5d811;
}
.field > button.primary,
td > button.primary {
  border: 1px solid #36d5d8;
  background-color: #36d5d8;
  font-weight: 500;
  color: #fff;
}
.field > button.primary:focus,
.field > button.primary:hover,
td > button.primary:focus,
td > button.primary:hover {
  filter: brightness(1.05);
}
.columns {
  width: 100%;
  overflow: auto;
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
  overflow-y: scroll;
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
  filter: brightness(1.05);
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
@media (min-width: 544px) {
  .card {
    margin: 0 0 16px 0;
  }
  .card--padded {
    padding: 16px 24px;
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
  label > select {
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
  .field--half {
    width: calc((100% - 16px) / 2);
  }
  .field--half:nth-of-type(2n-1) {
    margin: 0 16px 16px 0;
  }
  .field--half:nth-of-type(2n) {
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
