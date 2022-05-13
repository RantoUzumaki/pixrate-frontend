import { Global } from '@emotion/react';
const Fonts = () => (
  <Global
    styles={`
    @font-face {
      font-family: 'Poppins-Bold';
      src: url(assets/fonts/Poppins-Bold.ttf);
    }
    @font-face {
      font-family: 'Poppins-Medium';
      src: url(assets/fonts/Poppins-Medium.ttf);
    }
    @font-face {
      font-family: 'Poppins-Regular';
      src: url(assets/fonts/Poppins-Regular.ttf);
    }
    @font-face {
      font-family: 'Poppins-SemiBold';
      src: url(assets/fonts/Poppins-SemiBold.ttf);
    } `}
  />
);

export default Fonts;
