import { styled } from "@mui/material/styles"
import Button from "@mui/material/Button"

type Props = {
  background?: string
}

export const NavButton = styled(Button)<Props>(({ background, theme }) => ({
  // borderRadius: "2px 15px 2px 15px", // Необычная геометрия
  // border: "2px solid #000",
  // boxShadow: `0 0 0 2px ${theme.palette.primary.dark}, 4px 4px 0 0 ${theme.palette.primary.dark}`,
  // minWidth: "120px",
  // fontWeight: "800",
  // textTransform: "none", // Без капса выглядит современнее
  // padding: "10px 24px",
  // color: theme.palette.primary.contrastText,
  // background: background || theme.palette.primary.light,
  //
  // transition: "all 0.15s ease-in-out",
  //
  // "&:hover": {
  //   background: background || "#f0f0f0",
  //   transform: "translate(2px, 2px)", // Кнопка слегка уходит вниз
  //   boxShadow: "2px 2px 0px 0px #000", // Тень уменьшается
  // },
  //
  // "&:active": {
  //   transform: "translate(4px, 4px)", // Полное нажатие
  //   boxShadow: "none",
  // },
  background: 'linear-gradient(135deg, #e91e63 0%, #9c27b0 100%)', // Ваши основные цвета
  borderRadius: '12px',
  padding: '8px 20px',
  color: '#fff',
  fontWeight: 600,
  boxShadow: '0 4px 15px rgba(233, 30, 99, 0.3)',
  transition: 'all 0.2s ease',
  border: 'none',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(233, 30, 99, 0.4)',
    filter: 'brightness(1.1)',
  }
}))
