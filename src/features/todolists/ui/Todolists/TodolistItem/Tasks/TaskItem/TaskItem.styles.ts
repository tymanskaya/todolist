import { SxProps } from "@mui/material"

export const getListItemSx = (isDone: boolean): SxProps => ({
  p: "2px 8px",
  justifyContent: "space-between",
  borderRadius: "8px",
  transition: "all 0.2s ease-in-out", // Плавная анимация при наведении
  opacity: isDone ? 0.5 : 1,
  mb: "2px",

  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.03)", // Легкий фон при наведении (подсветка строки)
    transform: "translateX(4px)",
    // Если хотите показывать корзину только при наведении, добавьте селектор для IconButton внутри
    "& button": {
      opacity: 1,
    },
  },

  "& .MuiCheckbox-root": {
    transition: "transform 0.2s ease",
    "&:hover": {
      transform: "scale(1.1)", // Чекбокс немного увеличивается при наведении
    },
  },
})
