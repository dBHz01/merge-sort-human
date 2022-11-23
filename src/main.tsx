import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from "./routes/root";
import Hello from './components/Image-Compare';
import {
    createBrowserRouter,
    RouterProvider,
    Route,
} from "react-router-dom";
import './index.css'

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "/hello",
                element: <Hello name='ts' enthusiasmLevel={10} />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        {/* <App /> */}
        <RouterProvider router={router} />
    </React.StrictMode>
)
