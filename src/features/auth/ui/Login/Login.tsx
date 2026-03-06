import { setIsLoggedInAC } from "@/app/app-slice"
import { AUTH_TOKEN } from "@/common/constants"
import { ResultCode } from "@/common/enums"
import { useAppDispatch} from "@/common/hooks"
import { useLoginMutation } from "@/features/auth/api/authApi"
import { type LoginInputs, loginSchema } from "@/features/auth/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"

import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"
import styles from "./Login.module.css"
import { useRef, useState } from "react"
import ReCAPTCHA from "react-google-recaptcha"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import IconButton from "@mui/material/IconButton"
import InputAdornment from "@mui/material/InputAdornment"

export const Login = () => {
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const [login] = useLoginMutation()
  const dispatch = useAppDispatch()


  const { register, handleSubmit, reset, control, formState: { errors }, setError } = useForm<LoginInputs>({
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
    <Grid container justifyContent={"center"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <FormGroup>
            <TextField label="Email" margin="normal" error={!!errors.email} {...register("email")} />
            {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}

            <TextField
              type={showPassword ? "text" : "password"} // Переключаем тип инпута
              label="Password"
              margin="normal"
              error={!!errors.password}
              {...register("password")}
              slotProps={{
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
            {errors.password && <span className={styles.errorMessage}>{errors.password.message}</span>}


            <FormControlLabel
              label={"Remember me"}
              control={
                <Controller
                  name={"rememberMe"}
                  control={control}
                  render={({ field: { value, ...field } }) => <Checkbox {...field} checked={value} />}
                />
              }
            />

            {/* 5. Добавляем капчу ПЕРЕД кнопкой */}
            <div style={{ marginBottom: "20px" }}>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                onChange={setCaptchaToken}
              />
            </div>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!captchaToken} // Кнопка активна только после капчи
            >
              Login
            </Button>
          </FormGroup>
        </FormControl>
      </form>
    </Grid>
  )
}

