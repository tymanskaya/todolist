import { type ChangeEvent, type KeyboardEvent, useState } from "react"
import TextField from "@mui/material/TextField"
import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"
import AddCircleIcon from "@mui/icons-material/AddCircle"

type Props = {
  onCreateItem: (title: string) => void
  disabled?: boolean
}

export const CreateItemForm = ({ onCreateItem, disabled }: Props) => {
  const [title, setTitle] = useState("")
  const [error, setError] = useState<string | null>(null)

  const createItemHandler = () => {
    const trimmedTitle = title.trim()
    if (trimmedTitle !== "") {
      onCreateItem(trimmedTitle)
      setTitle("")
    } else {
      setError("Title is required")
    }
  }
  const changeTitleHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.currentTarget.value)
    setError(null)
  }

  const createItemOnEnterHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      createItemHandler()
    }
  }

  return (
    <TextField
      fullWidth
      placeholder="What needs to be done?" // Плейсхолдер современнее лейбла
      variant="standard" // Убираем тяжелые рамки
      value={title}
      error={!!error}
      helperText={error}
      disabled={disabled}
      onChange={changeTitleHandler}
      onKeyDown={createItemOnEnterHandler}
      // Стилизация под 2026: Мягкий фон и отсутствие агрессивных границ
      sx={{
        '& .MuiInput-root': {
          padding: '8px 12px',
          borderRadius: '12px',
          transition: 'all 0.2s ease-in-out',
          '&:before, &:after': { display: 'none' },

          // Динамический фон в зависимости от темы
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(0, 0, 0, 0.03)',

          '&:hover': {
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.05)',
          },

          '&.Mui-focused': {
            boxShadow: (theme) =>
              `0 0 0 2px ${theme.palette.primary.main}, 0 4px 12px rgba(99, 102, 241, 0.2)`,
            backgroundColor: (theme) =>
              theme.palette.mode === 'dark' ? '#1e293b' : '#fff',
          }
        },
        // Цвет текста плейсхолдера для лучшей видимости в темной теме
        '& .MuiInputBase-input::placeholder': {
          opacity: 0.6
        }
      }}

      // Встраиваем кнопку прямо в инпут — это экономит место и выглядит чище
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={createItemHandler}
                disabled={disabled || !title.trim()}
                sx={{
                  color: '#6366f1',
                  transition: 'transform 0.2s ease',
                  '&:hover': { transform: 'scale(1.1) rotate(90deg)' },
                  '&:active': { transform: 'scale(0.9)' },
                  '&.Mui-disabled': { color: '#cbd5e1' }
                }}
              >
                <AddCircleIcon />
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  )
}