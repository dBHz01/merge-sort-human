import React, { useEffect, useState, useContext, useImperativeHandle } from 'react'
import Root from "../routes/root";
import { Image, Button, Radio, Col, Row } from 'antd'
import type { RadioChangeEvent } from 'antd'
import { MyContext } from './Image-Compare';
import "../index.css"

export interface Props {
    url1?: string;
    url2?: string;
    dispatch: (a: string) => void;
}

const CompareBox: React.FC<Props> = (props) => {
    // const [value, setValue] = useState(0);
    const { checkedId, setCheckedId } = useContext(MyContext);
    const onChange = (e: RadioChangeEvent) => {
        console.log('radio checked', e.target.value);
        setCheckedId(e.target.value);
    };
    return (
        <div className="Box">
            <div>
                <h1>请选择更好看的那一张图片</h1>
            </div>
            <div>
                <Radio.Group onChange={onChange} value={checkedId}>
                    <Row justify={"space-around"} align={'middle'}>
                        <Col span={12}>
                            <div className='compare-box'>
                                <div>
                                    <Image src={props.url1} height={300} />
                                </div>
                                <div className='compare-radio'>
                                    {/* <Radio value={"left"}>A</Radio> */}
                                    <Button type='primary' onClick={() => { props.dispatch("left"); }}>A更好看</Button>
                                </div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className='compare-box'>
                                <div>
                                    <Image src={props.url2} height={300} />
                                </div>
                                <div className='compare-radio'>
                                    {/* <Radio value={"right"}>B</Radio> */}
                                    <Button type='primary' onClick={() => { props.dispatch("right"); }}>B更好看</Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Radio.Group>
            </div>


        </div>
    );
};

export default CompareBox;
