import type { Preview } from "@storybook/react";
import '../src/styles/style.css';
import '../src/styles/normalize.css';
import '../src/styles/notosanstc.css';


const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
