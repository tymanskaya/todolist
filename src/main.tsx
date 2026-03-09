import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import { App } from "@/app/App"
import { createRoot } from "react-dom/client"
import "./index.css"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router"
import { store } from "./app/store"

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
)
