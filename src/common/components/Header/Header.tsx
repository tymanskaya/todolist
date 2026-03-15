import {
  changeThemeModeAC,
  selectAppStatus,
  selectIsLoggedIn,
  selectThemeMode,
  setIsLoggedInAC,
} from "@/app/app-slice.ts"
import { baseApi } from "@/app/baseApi"
import { NavButton } from "@/common/components/NavButton/NavButton"
import { AUTH_TOKEN } from "@/common/constants"
import { ResultCode } from "@/common/enums"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { containerSx } from "@/common/styles"
import { getTheme } from "@/common/theme"
import { useLogoutMutation } from "@/features/auth/api/authApi"
import MenuIcon from "@mui/icons-material/Menu"
import { IconButton, AppBar, Toolbar, Container, LinearProgress } from '@mui/material';
import { Switch as MuiSwitch } from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny'; // Солнышко
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

export const Header = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const themeMode = useAppSelector(selectThemeMode)
  const status = useAppSelector(selectAppStatus)

  const [logout] = useLogoutMutation()

  const dispatch = useAppDispatch()

  const theme = getTheme(themeMode)

  const changeMode = () => {
    dispatch(changeThemeModeAC({ themeMode: themeMode === "light" ? "dark" : "light" }))
  }

  const logoutHandler = () => {
    logout()
      .then((res) => {
        if (res.data?.resultCode === ResultCode.Success) {
          dispatch(setIsLoggedInAC({ isLoggedIn: false }))
          localStorage.removeItem(AUTH_TOKEN)
        }
      })
      .then(() => {
        dispatch(baseApi.util.invalidateTags(["Todolist", "Task"]))
      })
  }

  return (
    <AppBar position="static" elevation={1} sx={{ mb: "30px" }}>
      <Toolbar>
        <Container maxWidth={"lg"} sx={containerSx}>
          <IconButton color="inherit">
            <MenuIcon />
          </IconButton>
          <div>
            {isLoggedIn && <NavButton onClick={logoutHandler}>Sign out</NavButton>}
            <NavButton >Faq</NavButton>
            <MuiSwitch
              color="default"
              // Важно: привязываем состояние Switch к вашей теме в Redux
              checked={themeMode === "dark"}
              onChange={changeMode}
              // Иконка для светлой темы (солнце)
              icon={
                <LightModeIcon
                  sx={{
                    fontSize: '20px',
                    color: '#ffb74d', // Оранжевый цвет солнца
                    backgroundColor: '#fff',
                    borderRadius: '50%',
                    p: '2px'
                  }}
                />
              }
              // Иконка для темной темы (луна)
              checkedIcon={
                <DarkModeIcon
                  sx={{
                    fontSize: '20px',
                    color: '#fff',
                    backgroundColor: '#001e3c',
                    borderRadius: '50%',
                    p: '2px'
                  }}
                />
              }
            />
          </div>
        </Container>
      </Toolbar>
      {status === "loading" && <LinearProgress />}
    </AppBar>
  )
}
