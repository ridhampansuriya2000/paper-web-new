const settingsConfig = {
  layout: {
    style: 'layout1', // layout1 layout2 layout3
    config: {
      footer: {
        display: false,
        style: 'static',
      },
      toolbar:{
        display:false
      },
      navbar: {
        display: false,
        style: 'style-1',
        folded: true,
        position: 'left',
      },
    }, // checkout default layout configs at app/fuse-layouts for example  app/fuse-layouts/layout1/Layout1Config.js
  },
  customScrollbars: true,
  direction: 'ltr', // rtl, ltr
  theme: {
    main: 'legacy',
    navbar: 'greyDark',
    toolbar: 'legacy',
    footer: 'legacy',
  },
};

export default settingsConfig;
