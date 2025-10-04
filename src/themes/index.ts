// 小清新主题配置

// 默认主题 - 小清新蓝绿色主题
export const defaultTheme = {
  token: {
    colorPrimary: '#87c0a0', // 小清新绿蓝色，更加柔和
    colorSecondary: '#a1c4fd', // 淡蓝色，增加视觉层次
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorLink: '#87c0a0',
    fontSize: 13, // 稍微减小字体大小
    fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
      'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
      'Noto Color Emoji'`,
    lineHeight: 1.5,
    borderRadius: 6, // 稍微增加圆角
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
    boxShadowSecondary: '0 1px 6px rgba(0, 0, 0, 0.08)',
  },
  components: {
    Button: {
      defaultBg: '#ffffff',
      defaultBorderColor: '#e8e8e8',
      defaultColor: '#595959',
      primaryColor: '#ffffff',
      borderRadius: 6,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
    },
    Card: {
      borderRadius: 8,
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
    },
    Input: {
      borderRadius: 6,
    },
    Typography: {
      color: '#263238',
      colorTextSecondary: '#8c8c8c',
    },
    Tag: {
      borderRadius: 12, // 更圆润的标签
    },
    Table: {
      headerBg: '#fafafa',
      headerColor: '#595959',
      rowHoverBg: '#f8f9fa',
    },
  },
}

// 主题映射
export const themes = {
  default: defaultTheme
}

// 主题类型
export type ThemeType = 'default'