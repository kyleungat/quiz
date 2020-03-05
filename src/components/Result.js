import React, {useRef} from 'react'
import {useSpring, animated, useChain} from 'react-spring'

const calcaulatedResult = (t, c) => {
    let overall = c/5 * 100;
    if (t > 50/2) {
        overall *= 0.6;
    }
    if (overall > 70){
        return "A";
    }
    else if (overall > 40){
        return "B";
    }
    else {
        return "C";
    }
}

function Result({score, time, callback, correctCb, timeCb}) {
    const scoreRef = useRef();
    const scoreProps = useSpring({
        scoreFetched: score,
        from: {scoreFetched: 0},
        ref: scoreRef,
    })

    const timeRef = useRef();
    const timeProps = useSpring({
        timeFetched: time,
        from: {timeFetched: 0},
        ref: timeRef,
    })

    const textRef = useRef();
    const textProps = useSpring({
        x: 0,
        from: {x: 500},
        ref: textRef,
    })

    useChain([scoreRef, timeRef, textRef]);

    const cleanUpDataAndGo = (n) => {
        callback(n);
        correctCb(0);
        timeCb(0);
    }

    return (
        <div className="container result">
            <div className="score">
                <span>Score: </span>
                <animated.span>{scoreProps.scoreFetched.interpolate(v => v.toFixed(2))}</animated.span>
                <span>/5</span>
            </div>
            <div className="time">
                <span>Time: </span>
                <animated.span>{timeProps.timeFetched.interpolate(t => Math.round(t))}</animated.span>
                <span>s</span>
            </div>
            <div className="average">
                <animated.svg version="1.1" xmlns="http://www.w3.org/2000/svg" strokeDashoffset={textProps.x} strokeDasharray="500">
                    <circle cx="150" cy="75" r="65" stroke="black" fill="transparent" strokeWidth="5"></circle>
                    <text x="150" y="110" textAnchor="middle" textLength="1" strokeWidth="3">{calcaulatedResult(time, score)}</text>
                </animated.svg>
            </div>
            <button type="button" id="try-again" onClick={()=> cleanUpDataAndGo(1) }>try again</button>
            <button type="button" id="back" onClick={() => cleanUpDataAndGo(0)}>back</button>
        </div>
    )
}

export default Result
