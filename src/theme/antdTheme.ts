import type { ThemeConfig } from 'antd'

export const paperTheme: ThemeConfig = {
  token: {
    colorPrimary: '#3d2c8d',
    colorText: '#262a3f',
    colorTextSecondary: '#565b75',
    colorLink: '#3d2c8d',
    fontFamily: "'Be Vietnam Pro', ui-sans-serif, system-ui, sans-serif",
    fontSize: 16,
    borderRadius: 8,
  },
  components: {
    Tabs: {
      itemColor: '#565b75',
      itemSelectedColor: '#3d2c8d',
      itemHoverColor: '#3d2c8d',
      inkBarColor: '#3d2c8d',
      titleFontSizeLG: 18,
    },
  },
}

// Nested theme for components placed on the chalkboard background
export const boardTheme: ThemeConfig = {
  token: {
    colorPrimary: '#eef1e8',
    colorPrimaryHover: '#ffffff',
    colorPrimaryActive: '#d9ded2',
    colorTextLightSolid: '#1f3b33',
    colorText: '#eef1e8',
    colorBgElevated: '#24443b',
    colorBorder: 'rgba(238, 241, 232, 0.35)',
  },
  components: {
    Segmented: {
      trackBg: 'rgba(238, 241, 232, 0.08)',
      itemColor: '#b9c4b8',
      itemHoverColor: '#eef1e8',
      itemHoverBg: 'rgba(238, 241, 232, 0.1)',
      itemSelectedBg: '#eef1e8',
      itemSelectedColor: '#1f3b33',
    },
    Button: {
      defaultGhostColor: '#eef1e8',
      defaultGhostBorderColor: 'rgba(238, 241, 232, 0.5)',
      fontWeight: 600,
    },
    Dropdown: {
      colorText: '#eef1e8',
      controlItemBgHover: 'rgba(238, 241, 232, 0.1)',
    },
  },
}
