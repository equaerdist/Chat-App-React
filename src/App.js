import { Suspense, createRef } from "react";
import "./App.css";
import "./page.scss";
import { lazy } from "react";
import {
  BrowserRouter as Router,
  Route,
  createBrowserRouter,
  useOutlet,
  useLocation,
  RouterProvider,
} from "react-router-dom";
import { CSSTransition, SwitchTransition } from "react-transition-group";
const ChatPage = lazy(() => import("./components/chatPage/chatPage"));
const EnterPage = lazy(() => import("./enterPage/EnterPage"));
const routes = [
  {
    path: "/",
    name: "Home",
    element: <EnterPage></EnterPage>,
  },
  {
    path: "/chat/:nickname",
    name: "Chat",
    element: <ChatPage></ChatPage>,
  },
];
const Wrapper = () => {
  const outlet = useOutlet();
  const location = useLocation();
  return (
    <Suspense fallback={<div>LOading...</div>}>
      <SwitchTransition>
        <CSSTransition
          key={location.pathname}
          timeout={300}
          classNames="page"
          unmountOnExit
        >
          {outlet}
        </CSSTransition>
      </SwitchTransition>
    </Suspense>
  );
};
const router = createBrowserRouter([
  {
    path: "/",
    element: <Wrapper></Wrapper>,
    children: routes.map((route) => ({
      index: route.path === "/",
      path: route.path === "/" ? undefined : route.path,
      element: route.element,
    })),
  },
]);
function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
