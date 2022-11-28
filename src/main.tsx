import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from "./routes/root";
import ImageCompare from './components/Image-Compare';
import {
    createBrowserRouter,
    RouterProvider,
    Route,
} from "react-router-dom";
import './index.css'
import Score from './components/Score';


const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "/compare",
                element: <ImageCompare />,
            },
            {
                path: "/score",
                element: <Score />,
            },
        ],
    },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    // <React.StrictMode>
        <RouterProvider router={router} />
    // </React.StrictMode>
)
