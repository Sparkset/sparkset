<template>
  <div>
    <div class="columns">
      <div class="column column--right">
        <div class="card">
          <section class="fields">
            <h1>Upcoming</h1>
            <div class="field">
              <p>
                This is the overview page that shows upcoming events.
              </p>
            </div>
          </section>
        </div>
      </div>
      <div class="column column--left">
        <div class="card">
          <section class="fields">
            <h1>UI Demo</h1>
            <div class="field">
              <p>
                Below are some basic UI elements.
              </p>
            </div>
          </section>
          <section class="fields">
            <div class="field field--half">
              <label>
                Text Input
                <input type="text" />
              </label>
            </div>
            <div class="field field--half">
              <label>
                Dropdown
                <select>
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
              </label>
            </div>
            <div class="field">
              <label>
                Text Area
                <textarea />
              </label>
            </div>
            <div class="field">
              <button class="primary">Primary Button</button>
            </div>
            <div class="field">
              <button>Secondary Button</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OverviewPage"
};
</script>

<style scoped></style>
