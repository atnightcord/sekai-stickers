import HomeView from '../views/HomeView.jsx'
import App from '../views/App.jsx'
import NotFoundView from "../views/NotFoundView.jsx"
import { createBrowserRouter } from "react-router-dom"

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <NotFoundView />
    },
]);

export default router
