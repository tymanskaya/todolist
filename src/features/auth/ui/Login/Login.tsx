import { setIsLoggedInAC } from "@/app/app-slice"
import { AUTH_TOKEN } from "@/common/constants"
import { ResultCode } from "@/common/enums"
import { useAppDispatch} from "@/common/hooks"
import { useLoginMutation } from "@/features/auth/api/authApi"
import { type LoginInputs, loginSchema } from "@/features/auth/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"
import { useRef, useState } from "react"
import ReCAPTCHA from "react-google-recaptcha"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import { Paper, Typography, Box, Stack, TextField, FormControlLabel, Checkbox, Button, Grid, InputAdornment, IconButton } from '@mui/material';


export const Login = () => {
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const [login] = useLoginMutation()
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },

  } = useForm<LoginInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  })

  const onSubmit: SubmitHandler<LoginInputs> = (data) => {
    // 1. Проверяем капчу ВНУТРИ сабмита
    if (!captchaToken) {
      alert("Подтвердите, что вы не робот")
      return
    }

    // 2. Отправляем запрос (нужно привести тип, так как loginSchema не знает о captcha)
    login({ ...data, captcha: captchaToken } as any).then((res) => {
      if (res.data?.resultCode === ResultCode.Success) {
        dispatch(setIsLoggedInAC({ isLoggedIn: true }))
        localStorage.setItem(AUTH_TOKEN, res.data.data.token)
        reset()
      } else {
        // 3. Сбрасываем капчу при любой ошибке (неверный пароль или токен)
        setCaptchaToken(null)
        recaptchaRef.current?.reset()
      }
    })
  }

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  return (
    <Grid container justifyContent="center" alignItems="center" sx={{ minHeight: "80vh" }}>
      {/* Paper создает эффект карточки с тенью */}
      <Paper
        elevation={6}
        sx={{
          p: 4, // Внутренние отступы (padding)
          width: "100%",
          maxWidth: 420, // Ограничение ширины
          borderRadius: 2, // Скругление углов
          textAlign: "center",
        }}
      >
        {/* Заголовок формы */}
        <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 3 }}>
          Login
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Stack управляет вертикальными отступами между элементами */}
          <Stack spacing={2.5}>
            <Box>
              <TextField fullWidth label="Email" error={!!errors.email} {...register("email")} />
              {errors.email && (
                <Typography color="error" variant="caption" sx={{ display: "block", textAlign: "left", mt: 0.5 }}>
                  {errors.email.message}
                </Typography>
              )}
            </Box>

            <Box>
              <TextField
                fullWidth
                type={showPassword ? "text" : "password"}
                label="Password"
                error={!!errors.password}
                {...register("password")}
                slotProps={{
                  // Оставляем slotProps, если у тебя MUI v6
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickShowPassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              {errors.password && (
                <Typography color="error" variant="caption" sx={{ display: "block", textAlign: "left", mt: 0.5 }}>
                  {errors.password.message}
                </Typography>
              )}
            </Box>

            <FormControlLabel
              sx={{ alignSelf: "flex-start" }} // Прижимаем чекбокс влево
              label="Remember me"
              control={
                <Controller
                  name="rememberMe"
                  control={control}
                  render={({ field: { value, ...field } }) => <Checkbox {...field} checked={value} size="small" />}
                />
              }
            />

            {/* Контейнер для капчи */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                overflow: "hidden", // Чтобы капча не вылезала на мобилках
                my: 1,
              }}
            >
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={setCaptchaToken}
              />
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={!captchaToken}
              sx={{ mt: 1, py: 1.5, fontWeight: "bold" }}
            >
              Sign In
            </Button>
          </Stack>
        </form>
      </Paper>
    </Grid>
  )
}

