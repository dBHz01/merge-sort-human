import React, { createContext, useReducer, useState } from 'react'
import { Button, Result, Input } from 'antd'
import { Debugout } from 'debugout.js';
import CompareBox from './Compare_Box';

const bugout = new Debugout({ useTimestamps: true, realTimeLoggingOn: true });

export interface Props {
    name?: string;
    enthusiasmLevel?: number;
    url?: string;
    id?: number;
}

export interface ContextProps {
    checkedId: number | string;
    setCheckedId: React.Dispatch<React.SetStateAction<number>>;
}
export const MyContext = createContext({} as ContextProps);

const ImageCompare: React.FC<Props> = (props) => {

    const IMGLABLES = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const IMGS = IMGLABLES.map((a) => { return [`https://auto-ppt-data.oss-cn-zhangjiakou.aliyuncs.com/${a}.jpg`] });
    // [["https://auto-ppt-data.oss-cn-zhangjiakou.aliyuncs.com/0.jpg"],
    // ["https://auto-ppt-data.oss-cn-zhangjiakou.aliyuncs.com/1.jpg"],
    // ["https://auto-ppt-data.oss-cn-zhangjiakou.aliyuncs.com/2.jpg"],
    // ["https://auto-ppt-data.oss-cn-zhangjiakou.aliyuncs.com/3.jpg"],
    // ["https://auto-ppt-data.oss-cn-zhangjiakou.aliyuncs.com/4.jpg"],
    // ["https://auto-ppt-data.oss-cn-zhangjiakou.aliyuncs.com/5.jpg"],
    // ["https://auto-ppt-data.oss-cn-zhangjiakou.aliyuncs.com/6.jpg"],
    // ["https://auto-ppt-data.oss-cn-zhangjiakou.aliyuncs.com/7.jpg"],
    // ["https://auto-ppt-data.oss-cn-zhangjiakou.aliyuncs.com/8.jpg"]];

    const [checkedId, setCheckedId] = useState<number>(0);
    const [showResult, setShowResult] = useState<boolean>(false);
    const [startExperiment, setStartExperiment] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    const [department, setDepartment] = useState<string>("");
    const [studentId, setStudentId] = useState<string>("");

    function genTask(imgs: Array<Array<string>>): [Array<string>, Array<string>] | undefined {
        if (imgs.length <= 1) return;
        imgs.sort((a, b) => { return a.length - b.length });
        let returnImgs: [Array<string>, Array<string>] = [imgs[0], imgs[1]];
        // console.log(imgs);
        // imgs = imgs.slice(2);
        return returnImgs;
    }

    function debug() {
        console.log(state);
    }

    const reducer = (state: any, action: any) => {
        let actionList = action.split(" ");
        let actionType = actionList[0];
        let actionContent = actionList.slice(1);
        switch (actionType) {
            case "start":
                console.log("start");
                setStartExperiment(true);
                let tasks = genTask(IMGS);
                return {
                    ...state,
                    tasks0: tasks![0],
                    tasks1: tasks![1],
                    imgs: IMGS.slice(2),
                }
            case "left":
                bugout.log("left");
                if (state.tasks0.length == 1) {
                    console.log(state);
                    if (state.imgs.length == 0) {
                        console.log("end");
                        let result = state.mergedTask.concat(state.tasks0).concat(state.tasks1);
                        bugout.log("result", result.map((a) => { return a.split("com/")[1] }));
                        // bugout.downloadLog();
                        setShowResult(true);
                        return {
                            ...state,
                            imgs: state.mergedTask.concat(state.tasks0).concat(state.tasks1),
                        }
                    } else {
                        let newImgs = state.imgs;
                        newImgs.push(state.mergedTask.concat(state.tasks0).concat(state.tasks1));
                        let tasks = genTask(newImgs);
                        return {
                            ...state,
                            tasks0: tasks![0],
                            tasks1: tasks![1],
                            mergedTask: [],
                            imgs: newImgs.slice(2),
                        }
                    }
                } else {
                    let newMergedTask = state.mergedTask;
                    newMergedTask.push(state.tasks0[0]);
                    let newTasks0 = state.tasks0.slice(1);
                    // console.log(state)
                    return {
                        ...state,
                        mergedTask: newMergedTask,
                        tasks0: newTasks0,
                    }
                }
            case "right":
                bugout.log("right");
                if (state.tasks1.length == 1) {
                    if (state.imgs.length == 0) {
                        console.log("end");
                        let result = state.mergedTask.concat(state.tasks1).concat(state.tasks0);
                        bugout.log("result", result.map((a) => { return a.split("com/")[1] }));
                        // bugout.downloadLog();
                        setShowResult(true);
                        return {
                            ...state,
                            imgs: state.mergedTask.concat(state.tasks1).concat(state.tasks0),
                        }
                    } else {
                        let newImgs = state.imgs;
                        newImgs.push(state.mergedTask.concat(state.tasks1).concat(state.tasks0));
                        let tasks = genTask(newImgs);
                        return {
                            ...state,
                            tasks0: tasks![0],
                            tasks1: tasks![1],
                            mergedTask: [],
                            imgs: newImgs.slice(2),
                        }
                    }
                } else {
                    let newMergedTask = state.mergedTask;
                    newMergedTask.push(state.tasks1[0]);
                    let newTasks0 = state.tasks1.slice(1);
                    return {
                        ...state,
                        mergedTask: newMergedTask,
                        tasks1: newTasks0,
                    }
                }
            default:
                break;
        }
    }

    const [state, dispatch] = useReducer(reducer, { tasks0: [], tasks1: [], mergedTask: [], imgs: [] });

    return (
        <div>
            {
                startExperiment ?
                    <div>
                        {
                            !showResult ?
                                <div>
                                    <MyContext.Provider value={{ checkedId, setCheckedId }}>
                                        <CompareBox url1={state.tasks0.length > 0 ? state.tasks0[0] : ""} url2={state.tasks1.length > 0 ? state.tasks1[0] : ""} dispatch={dispatch}></CompareBox>
                                    </MyContext.Provider>
                                    {/* <Button type="primary" onClick={() => {
                                        if (checkedId) {
                                            dispatch(checkedId);
                                            setCheckedId(0);
                                        } else {
                                            console.log(`error with ${checkedId}`);
                                        }
                                    }}>确认</Button> */}

                                    <Button onClick={() => { debug(); }}>debug</Button>
                                </div> : <Result
                                    status="success"
                                    title="实验完成！请下载数据"
                                    subTitle="请点击下载数据按钮，并将下载的数据发送给主试。请勿直接离开！"
                                    extra={[
                                        <Button type="primary" key="console" onClick={() => { bugout.downloadLog(); }}>
                                            下载数据
                                        </Button>,
                                    ]}
                                />
                        }
                    </div> : <div>
                        <h1>请输入基本信息</h1>
                        <span>
                            <p>姓名</p>
                            <Input placeholder="张三" onChange={e => { setUsername(e.target.value) }} maxLength={20} />
                        </span>
                        <span>
                            <p>学号</p>
                            <Input placeholder="2019010001" onChange={e => { setStudentId(e.target.value) }} maxLength={20} />
                        </span>
                        <span>
                            <p>院系</p>
                            <Input placeholder="洗衣机系" onChange={e => { setDepartment(e.target.value) }} maxLength={20} />
                        </span>
                        <Button onClick={() => { dispatch('start'); bugout.log("info", username, studentId, department); }} className="submit-button">提交</Button>
                    </div>
            }
        </div>
    );
}

export default ImageCompare;