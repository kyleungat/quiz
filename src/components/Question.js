import React, { useState, useEffect, useRef } from 'react'
import { data } from '../data'
import { useSpring, useTransition, useChain, animated } from 'react-spring'

const second = 10;
const calArea = (a, b) => {
    return (a+b)*2;
}

function Question({ callback, correctCb, timeCb, size }) {
    const selectRef = useRef();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timerSecond, setTimerSecond] = useState(second);
    
    const springRef = useRef();
    const [props, set] = useSpring(() => ({
        x: 0,
        from: { x: 0 },
        ref: springRef,
        config: {
            duration: timerSecond * 1000,
        }
    }));
    const transitionRef = useRef();
    const transition = useTransition(currentQuestion, null, {
        from: { opacity: 0, transform: 'translateX(100%)' },
        enter: { opacity: 1, transform: 'translateX(0%)' },
        leave: { opacity: 0, transform: 'translateX(-50%)' },
        ref: transitionRef,
    })

    useChain([transitionRef, springRef])

    useEffect(() => {
        const QuetionTimer = setInterval(() => {
            setTimerSecond(t => t > 0 ? t - 1 : t);
        }, 1000);
        return () => clearInterval(QuetionTimer);
    }, []);

    // useEffect(() => {
    //     if (timerSecond === 0) {
    //         procedure();
    //     }
    // }, [timerSecond])

    useEffect(() => {
        set({x: calArea(size[0], size[1]) });
    }, [size])

    const reset = () => {
        setCurrentQuestion(currentQuestion + 1);
        setTimerSecond(second);
        set({ reset: true });
    }

    const processData = () => {
        timeCb(time => time + (second - timerSecond));
        const selected = selectRef.current ? selectRef.current["choices"].value : null;
        const correctNumber = data[currentQuestion].correct;
        if (selected && selected === data[currentQuestion].choices[correctNumber]) {
            correctCb(c => c + 1);
        }
    }

    const procedure = () => {
        processData();
        if (currentQuestion < data.length - 1) {
            reset();
        }
        else {
            callback(2);
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        procedure();
    };

    return (
        <div className="container question">
            <animated.svg className="border-svg" version="1.1" xmlns="http://www.w3.org/2000/svg" strokeDashoffset={props.x} strokeDasharray={calArea(size[0], size[1])}>
                <rect rx="20" ry="20" className="border-svg-rect"/>
            </animated.svg>
            {transition.map(({ item, key, props }) => (
                <animated.div style={props} key={key} className="animated-container">
                    <h2><span>{`Q${item + 1})`}</span> <span>{data[item].question}</span></h2>
                    <form onSubmit={(e) => handleSubmit(e)} ref={selectRef}>
                        {data[item].choices.map((element, index) => (
                            <div key={`${element}${index}`}>
                                <input type="radio" id={element} name="choices" value={element} />
                                <label htmlFor={element}>{element}</label>
                            </div>
                        ))}
                        <button type="submit">next</button>
                    </form>
                    {/* <h3>{timerSecond}</h3> */}
                </animated.div>
            ))}
        </div>
    )
}



export default Question
