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
    const [checkedId, setCheckedId] = useState<number>(0);
    const [showResult, setShowResult] = useState<boolean>(false);
    const [startExperiment, setStartExperiment] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    const [department, setDepartment] = useState<string>("");
    const [studentId, setStudentId] = useState<string>("");
    const [experimentId, setExperimentId] = useState<number>(0);

    const people = "azd crj cyy djy frw lly lzj tty xq ylc ytj zyx lyf zyw zxy lgz lbc hmf zhp ywt dyc jjx xtx wzz".split(" ");

    const [IMGS, setIMGS] = useState<Array<Array<string>>>([]);

    function shuffle<T>(array: T[]): T[] {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    };

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

    function genImgs() {
        let IMGLABLES = [];
        for (let p of people) {
            IMGLABLES.push(`folder/${p}/${p}-office-${experimentId}.jpeg`);
            IMGLABLES.push(`CNET-imgs/${p}/${p}-cnet-${experimentId}.png`);
        }
        IMGLABLES = shuffle(IMGLABLES);
        setIMGS(IMGLABLES.map((a) => { return [`https://auto-ppt-data.oss-cn-zhangjiakou.aliyuncs.com/${a}`] }));
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
                                    }}>??????</Button> */}

                                    {/* <Button onClick={() => { debug(); }}>debug</Button> */}
                                </div> : <Result
                                    status="success"
                                    title="??????????????????????????????"
                                    subTitle="??????????????????????????????????????????????????????????????????????????????????????????"
                                    extra={[
                                        <Button type="primary" key="console" onClick={() => { bugout.downloadLog(); }}>
                                            ????????????
                                        </Button>,
                                    ]}
                                />
                        }
                    </div> : <div>
                        <h1>?????????????????????</h1>
                        <span>
                            <p>??????</p>
                            <Input placeholder="??????" onChange={e => { setUsername(e.target.value) }} maxLength={20} />
                        </span>
                        <span>
                            <p>??????</p>
                            <Input placeholder="2019010001" onChange={e => { setStudentId(e.target.value) }} maxLength={20} />
                        </span>
                        <span>
                            <p>??????</p>
                            <Input placeholder="????????????" onChange={e => { setDepartment(e.target.value) }} maxLength={20} />
                        </span>
                        <span>
                            <p>????????????</p>
                            <Input placeholder="0" onChange={e => { setExperimentId(parseInt(e.target.value)) }} maxLength={20} />
                        </span>
                        <Button onClick={() => { genImgs(); dispatch('start'); bugout.log("info", username, studentId, department); }} className="submit-button">??????</Button>
                    </div>
            }
        </div>
    );
}

export default ImageCompare;