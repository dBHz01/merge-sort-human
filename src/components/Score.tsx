import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { RadioChangeEvent, UploadProps } from 'antd';
import type {
    RcFile,
} from 'rc-upload/lib/interface';
import { Radio, Image, Upload, Button, message, InputNumber, Result } from 'antd';
import { Debugout } from 'debugout.js';
// import { RcFile } from 'antd/es/upload';


const bugout = new Debugout({ useTimestamps: true, realTimeLoggingOn: true });

const Score: React.FC = () => {
    const [startExperiment, setStartExperiment] = useState(false);
    const [endExperiment, setEndExperiment] = useState(false);
    const [imgs, setImgs] = useState([]);
    const [curImgId, setCurImgId] = useState(-1);
    const [curValue, setCurValue] = useState<string | number | null>(100);
    const [username, setUsername] = useState<string>("");
    const [department, setDepartment] = useState<string>("");
    const [studentId, setStudentId] = useState<string>("");
    const [scoreResult, setScoreResult] = useState([]);
    const props: UploadProps = {
        name: 'file',
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        beforeUpload: (file: RcFile, fileList: RcFile[]) => {
            const reader = new FileReader();
            reader.onload = e => {
                console.log(e.target.result);
                let dataStr = e.target.result as string;
                let data = dataStr.split("\n");
                console.log(data);
                for (let i of data) {
                    let singleConsole = i.split(" ").map((a) => { return a.replaceAll("\"", "").replaceAll("[", "").replaceAll(",", "").replaceAll("]", ""); });
                    switch (singleConsole[1]) {
                        case "info":
                            setUsername(singleConsole[2]);
                            setStudentId(singleConsole[3]);
                            setDepartment(singleConsole[4]);
                            break;

                        case "result":
                            setImgs(singleConsole.splice(2).map((a) => { return `https://auto-ppt-data.oss-cn-zhangjiakou.aliyuncs.com/${a}` }));
                            break

                        default:
                            break;
                    }
                }
            };
            reader.readAsText(file);
            // Prevent upload
            setStartExperiment(true);
            setCurImgId(0);
            return false;
        }
    };

    function handleClick() {
        if (curImgId < imgs.length - 1) {
            bugout.log("click", curImgId, curValue);
            setScoreResult([...scoreResult, curValue]);
            setCurImgId(curImgId + 1);
        } else {
            bugout.log("info", username, studentId, department);
            bugout.log("result", [...scoreResult, curValue]);
            // bugout.downloadLog();
            setStartExperiment(false);
            setEndExperiment(true);
        }
    }

    return (
        <div>
            {startExperiment ? <div>
                <p>
                    ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
                </p>
                <p>
                    ??????????????????????????????????????????????????????????????????????????????????????????????????????
                </p>
                <p>
                    ?????????????????????????????????????????????????????????????????????????????????
                </p>
                <div>
                    <Image src={imgs[curImgId]} height={300} />
                    <InputNumber min={1} max={100} value={curValue} onChange={setCurValue} keyboard={true} className={"input-number"} />
                    <Button type='primary' onClick={handleClick} className={"input-number"}>????????????</Button>
                </div>
            </div> : endExperiment ? <div>
                <Result
                    status="success"
                    title="??????????????????????????????"
                    subTitle="??????????????????????????????????????????????????????????????????????????????????????????"
                    extra={[
                        <Button type="primary" key="console" onClick={() => { bugout.downloadLog(); }}>
                            ????????????
                        </Button>,
                    ]}
                />
            </div> : <div>
                <h1>??????????????????????????????</h1>
                <Upload {...props}>
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
                {/* <Button onClick={() => { debug(); }}>debug</Button> */}
            </div>
            }
        </div>
    );
};

export default Score;