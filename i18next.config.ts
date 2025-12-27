import { defineConfig } from 'i18next-cli';

export default defineConfig({
  locales: [
    "en",
    "ro"
  ],
  extract: {
    input: "src/**/*.{js,jsx,ts,tsx}",
    output: "src/locales/{{language}}/{{namespace}}.json",
    keySeparator: false,
    nsSeparator: false,
    indentation: 4,
  },
});
