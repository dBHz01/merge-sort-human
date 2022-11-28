import { Outlet, Link } from "react-router-dom";

export default function Root() {
    return (
        <>
            <div id="sidebar">
                <h1>Pervasive Human Computer Interaction</h1>
                <nav>
                    <ul>
                        <li>
                            <Link to={`compare`}>图片对比任务</Link>
                        </li>
                        <li>
                            <Link to={`score`}>图片打分任务</Link>
                        </li>
                    </ul>
                </nav>
            </div>
            <div id="detail">
                <Outlet />
            </div>
        </>
    );
}