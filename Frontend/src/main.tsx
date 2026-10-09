import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { interceptor } from "./utils/interceptor";
import { Layout } from "./components/layout-area/layout/layout";
import "./index.css";

interceptor.create();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={store}>
      <Layout />
    </Provider>
  </BrowserRouter>,
);
