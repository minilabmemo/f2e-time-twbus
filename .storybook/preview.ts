import type { Preview } from "@storybook/react";
import '../src/style/style.css';
import '../src/style/normalize.css';
import '../src/style/notosanstc.css';
import '../style/notosanstc.css';

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
