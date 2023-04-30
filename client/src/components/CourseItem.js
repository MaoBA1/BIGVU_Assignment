import React, { useState } from 'react';
import Colors from '../utilities/Colors';
import fetchData from '../FetchData';
import { isBrowser } from 'react-device-detect';
import { HiVideoCamera } from 'react-icons/hi'
import { IoIosArrowForward } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { MdDone } from 'react-icons/md';

function CourseItem({ color, data }) {
    const navigate = useNavigate();
    const [extraData, setExtraData] = useState(null);
    const Baseurl = `/course/${data.id}`;
    const initiateComponent = async () => {
        let data = await fetchData(Baseurl);
        if(data) {
            setExtraData(data);
            
        }
    }
    if(!extraData) {
        initiateComponent();
    }
    
    const isCourseComplete = () => {
        let completedCourse = localStorage.getItem("completedCourse");
        completedCourse = completedCourse ? JSON.parse(completedCourse) : null;
        if(completedCourse) {
            return completedCourse.findIndex(course => course.id === extraData.id) !== -1;
        }
        return false;
    }

    
    return (  
        <>
            {
                extraData ? 
                (
                    <div style={{ margin:"20px" }}>
                        <div style={{
                            display:"flex",
                            flexDirection:"row",
                            alignItems:"center"
                        }}>
                            <label style={{
                                fontFamily:"Bold",
                                background: color.background,
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor:"transparent",
                                fontSize:"18px"
                            }}>
                                {data.headline}
                            </label>
                            {
                                isCourseComplete() &&
                                <div style={{
                                    display:"flex",
                                    flexDirection:"row",
                                    alignItems:"center",
                                    marginLeft:"10px",
                                    backgroundColor: Colors.grey,
                                    padding:"2px",
                                    paddingLeft:"5px",
                                    paddingRight:"5px",
                                    borderRadius:"5px"
                                }}>
                                    <MdDone color='#FFFFFF'/>
                                    <label style={{
                                        fontFamily:"Light",
                                        color:"#FFFFFFFF",
                                        fontSize:"14px",
                                        marginLeft:"5px"
                                    }}>
                                        Completed
                                    </label>
                                </div>
                            }
                        </div>

                        <div onClick={() => { !isBrowser && navigate(`courseitem/${data.id}`) }} style={{
                            position:"relative",
                            display:"flex",
                            flexDirection:"column-reverse",
                            border: `1px solid ${Colors.grey}`,
                            width: isBrowser ? "400px" : "350px",
                            height:"240px",
                            borderRadius:"20px",
                            marginTop:"5px"
                        }}>
                            {
                                isBrowser &&
                                <div style={{
                                    position:"absolute",
                                    width:"50px",
                                    height:"50px",
                                    borderRadius:"50%",
                                    backgroundColor: Colors.blueBlack,
                                    right:15,
                                    bottom:15,
                                    display:"flex",
                                    flexDirection:"column",
                                    alignItems:"center",
                                    justifyContent:"center"
                                }} onClick={() => navigate(`courseitem/${data.id}`)}>
                                    <IoIosArrowForward
                                        color='#FFFFFF'
                                        size={"30px"}
                                    />
                                </div>
                            }
                            <div style={{
                                backgroundColor: Colors.grey,
                                position:"absolute",
                                top:"10px",
                                left:"10px",
                                padding:'3px',
                                borderRadius:"5px",
                                display:"flex",
                                flexDirection:"row",
                                alignItems:"center"
                            }}>
                                <HiVideoCamera
                                    color='#FFFFFF'
                                />
                                <label style={{
                                    fontFamily:"Light",
                                    color:"#FFFFFF",
                                    marginLeft:"5px"
                                }}>
                                    {extraData?.chapters?.length} Videos
                                </label>
                            </div>
                            <img
                                src={color.svg}
                                style={{
                                    width:"200px",
                                    height:"100px",
                                    position:"absolute",
                                    right:-1,
                                    top:1
                                }}
                                alt="vector"
                            />
                            <div style={{
                                height:"52%",
                                padding:"10px"
                            }}>
                                <label style={{
                                    fontFamily:"Bold",
                                    fontSize:"14px",
                                    color: Colors.blueBlack
                                }}>
                                    {extraData?.chapters[0]?.title}
                                </label>

                                <div style={{
                                    marginTop:"10px",
                                    display:"grid",
                                    gridTemplateColumns: "repeat(2, 150px)",
                                }}>
                                    {
                                      data?.summary?.map((item, index) => 
                                        <div style={{
                                            display:"flex",
                                            flexDirection:"row",
                                            alignItems:"center",
                                            margin:"2px"
                                        }} key={index}>
                                            <div style={{
                                                background: color.background,
                                                width:"5px",
                                                height:"5px"
                                            }}/>
                                            <label
                                                style={{
                                                    marginLeft:"5px",
                                                    fontFamily:"Light",
                                                    fontSize:"13px",
                                                    color: Colors.blueBlack
                                                }}
                                            >
                                                {item}
                                            </label>
                                        </div>
                                      )  
                                    }
                                </div>
                                
                            </div>
                        </div>
                    </div>
                )
                :
                (
                    <div
                        style={{
                            width:"350px",
                            height:"200px",
                            backgroundColor: Colors.grey,
                            borderRadius:"20px",
                            margin:!isBrowser ? "20px" : "0px"
                        }}
                        className="placholder"
                    />
                )
            }
        </>
    );
}

export default CourseItem;