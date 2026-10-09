import { Header } from "../header/header";
import { Routing } from "../routing/routing";
import { Copyrights } from "../copyrights/copyrights";
import "./layout.css";

// The page frame: header with the menu, the current page, and the footer.
export function Layout() {
  return (
    <div className="Layout">
      <header>
        <Header />
      </header>

      <main>
        <Routing />
      </main>

      <footer>
        <Copyrights />
      </footer>
    </div>
  );
}
