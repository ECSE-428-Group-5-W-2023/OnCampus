const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
  },
  videoCompression: 0,
  projectId: "1vse71",
});