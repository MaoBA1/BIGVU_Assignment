import React, { useEffect, useState } from 'react';
import fetchData from '../FetchData';
import '../utilities/home.css';
import { Scrollbars } from 'react-custom-scrollbars-2';
import Colors from '../utilities/Colors';
import blueVector from '../assets/blue vector.svg';
import greenVector from '../assets/green vector.svg';
import orangeVector from '../assets/orange vector.svg';


// components
import CourseItem from '../components/CourseItem';
import { isBrowser } from 'react-device-detect';

const Baseurl = "https://interviews.bigvu.tv/course/list";

function Home(props) {
    const [ windowSize, setWindowSize ] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });
    const [ courses, setCourses ] = useState([]);
    
    const componentsColors = [ 
        {
            background: `-webkit-linear-gradient(${Colors.blueBold}, ${Colors.blueLight})`,
            svg: blueVector
        },
        {
            background: `-webkit-linear-gradient(${Colors.greenBold}, ${Colors.greenLight})`,
            svg: greenVector
        },
        {
            background: `-webkit-linear-gradient(${Colors.orangeBold}, ${Colors.orangeLight})`,
            svg: orangeVector
        },
    ];

    useEffect(() => {
        const handelResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }
        window.addEventListener('resize', handelResize);


        const initiateHomePage = async () => {
            let data = await fetchData(Baseurl);
            if(data) {
                setCourses(data.result);
                
            }
        }
        initiateHomePage();
    }, [])

    return (
        <div style={{
            height: windowSize.height,
            display:"flex",
        }}>
            { courses.length > 0 ?
                (
                    <Scrollbars className='container'>    
                        <div className='head-container'>
                            <label style={{
                                fontFamily:"ExtraBold",
                                color: Colors.blueBlack
                            }}>
                                BIGVU 101  Crash Course
                            </label>
                            <label style={{
                                fontFamily:"Light",
                                color: Colors.blueBlack,
                                width: isBrowser ? "490px" : "350px",
                                marginTop:"10px"
                                
                            }}>
                                Zero editing experience to pro — your journey starts here. 
                                Watch step-by-step video lessons how to make videos with impact.
                            </label>
                        </div>
                        
                        <div className='body-container'
                            style={
                                isBrowser? 
                                {
                                    display:"grid",
                                    gridTemplateColumns: "repeat(4, 450px)"
                                } 
                                : 
                                {
                                    display:"flex",
                                    flexDirection:"column",
                                    alignItems:"center"
                                }
                            }
                        >
                            {
                                courses.map((item, index) => 
                                    <CourseItem
                                        key={item.id}
                                        color={componentsColors[ index % componentsColors.length ]}
                                        data={item}
                                    />
                                )
                            }
                        </div>
                            
                    </Scrollbars>
                )
                :
                (
                    <div className='loading-container'>
                        <label style={{
                            background: `-webkit-linear-gradient(${Colors.blueBold}, ${Colors.blueLight})`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor:"transparent",
                            fontSize:"30px",
                            fontFamily:"ExtraBold"
                        }}>
                            Loading...
                        </label>

                        <div style={{ 
                            marginTop:"20px",
                            width:"50%",
                            display:"flex",
                            flexDirection:"column",
                            position:"relative"
                        }}>
                            <div 
                                className='animation'
                                style={{
                                    background: `-webkit-linear-gradient(${Colors.blueBold}, ${Colors.blueLight})`,
                                    borderRadius:"20px",
                                    width:"0%",
                                    height:"5px",
                                    position:"absolute"
                                }}
                            />
                        </div>
                    </div>
                )
            }

            
        </div>
    );
}

export default Home;