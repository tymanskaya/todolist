import type { ThemeMode } from "@/app/app-slice.ts"
import { createTheme } from "@mui/material/styles"

export const getTheme = (themeMode: ThemeMode) => {
  return createTheme({
    palette: {
      mode: themeMode,
      primary: {
        main: "#F472B6",      // Ваш базовый розовый
        dark: "#DB2777",      // Для эффекта при наведении (Hover)

      },
      background: {
        default: themeMode === 'light' ? '#FDF2F8' : '#0F172A', // Светло-розовый или глубокий темно-синий
        paper: themeMode === 'light' ? '#FFFFFF' : '#1E293B',   // Белый или темно-серый (карточки)
      },
      text: {
        primary: themeMode === 'light' ? '#1F2937' : '#F9FAFB',
        secondary: themeMode === 'light' ? '#6B7280' : '#9CA3AF',
      }
    },
    typography: {
      fontFamily: '"Montserrat", "Arial", sans-serif',
      h6: {
        fontWeight: 800, // Усиливаем до Ultra Bold для акцента на заголовке карточки
        fontSize: '1.125rem',
        lineHeight: 1.3,
        letterSpacing: '-0.01em', // Отрицательный трекинг делает крупные заголовки плотнее и стильнее
        color: '#1e293b', // Глубокий темно-синий/серый вместо чистого черного
      },
      body1: {
        fontWeight: 500,
        fontSize: '0.925rem',
        lineHeight: 1.5,
        color: '#475569', // Мягкий цвет для основного текста задач
      },
      body2: {
        fontWeight: 400,
        fontSize: '0.75rem',
        color: '#94a3b8', // Для вспомогательного текста (например, "Тасок нет")
      },
      button: {
        textTransform: 'none',
        fontWeight: 700,
        letterSpacing: '0.02em', // Кнопкам, наоборот, добавляем чуть воздуха
      }
    }
  })
}
