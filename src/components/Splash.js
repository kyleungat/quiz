import React, {useCallback, useState} from 'react'
import {useSpring, useTrail, animated, interpolate} from 'react-spring'
import {useDrag, useGesture} from 'react-use-gesture'

const calc = (x, y, ex, ey) => [-(y - (ey + 100))/3, (x - (ex+100))/3 ]
const word = ["Q", "u", "i", "z"]

function Splash({callback}) {
    const [centerX, setCenterX] = useState(0);
    const [centerY, setCenterY] = useState(0);
    const [props, set] = useSpring(() => ({ xy: [0,0], s: 1, x:0}));
    const [width, setWidth] = useState(0);

    const text = useTrail(4, {from: {opacity: 0},to: {opacity: 1}})

    const bind = useGesture({
        onDrag: ({down, movement})=> {
            if (!down && movement[0] > width*0.6) {callback(1);}
            set({s: down?1.1:1, x: down? movement[0]: 0 })
        },
    })

    const findingCenter = useCallback(node => {
        if (node !== null) {
            setCenterY(node.getBoundingClientRect().top);
            setCenterX(node.getBoundingClientRect().left);
        }
      }, []);

    const findingWidth = useCallback(node => {
        if (node !== null) {
            setWidth(node.getBoundingClientRect().width);
        }
      }, []);

    return (
        <div className="container splash">
            <animated.i 
                className="fas fa-pen" 
                onMouseMove={({clientX, clientY}) => set({xy: calc(clientX, clientY, centerX, centerY )})} 
                onMouseLeave={()=> set({xy: [0,0]})}
                style={{transform: props.xy.interpolate((x,y) => `perspective(300px) rotateX(${x}deg) rotateY(${y}deg)`)}}
                ref={findingCenter}
            />
            <h1>
                {text.map((props,index) => (
                    <animated.span key={index} style={props}>
                        {word[index]}
                    </animated.span>
                ))}
            </h1>
            {/* <animated.button {...bind()} style={{ x, y }}>start</animated.button> */}
            <animated.div {...bind()} className="slide-bg" ref={findingWidth} style={{background: props.x.interpolate(x => `linear-gradient(${x}deg, #aaaaaa, #ededed)`)}}>
                {/* <animated.button style={{transform: interpolate( [props.s, props.x],(s, x) => `scale(${s}) translateX(${x}px)`)}}>start</animated.button> */}
                <animated.button style={{left: props.x}}>start</animated.button>
            </animated.div>
        </div>
    )
}

export default Splash
