import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import '../utilities/item.css';
import fetchData from '../FetchData';
import Colors from '../utilities/Colors';
import { getCurrentTime, getFormattedTimeStampOrDuraiton, saveVideoTimeStempInLocalstorage } from '../mediaPlayer/controllers';
import { isBrowser } from 'react-device-detect';
import Scrollbars from 'react-custom-scrollbars-2';

function Item() {
    const params = useParams();
    const { id } = params;
    const Baseurl = `https://interviews.bigvu.tv/course/${id}`;
    const [ itemData, setItemData ] = useState(null);
    const [ windowSize, setWindowSize ] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });
    const chapters = itemData?.chapters;
    const videoElement = useRef(null);
    const [ muted, setMuted ] = useState(false);


    const initiateComponent = async () => {
        let data = await fetchData(Baseurl);
        if(data) {
            setItemData(data);
            
        }
    }
    
    useEffect(() => {
        const handelResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }
        window.addEventListener('resize', handelResize);

        if(!itemData) {
            initiateComponent();
        }
    }, [])
    return (  
        <div className= {isBrowser ? "item-container-browser" : "item-container-mobile"} style={{ height: windowSize.height }}>
            {
                itemData ?
                (
                    <div className={isBrowser ? 'body-container-browser' : "body-container-mobile"} >
                        <video
                            ref={videoElement}
                            src={chapters[0]?.asset?.resource?.stream?.url}
                            onTimeUpdate={(event) => {
                                saveVideoTimeStempInLocalstorage(event.currentTarget.currentTime, id);
                                console.log(videoElement.current.volume);
                            }}
                            onLoadedData={(event) => {
                                videoElement.current.currentTime = getCurrentTime(id);
                            }}
                            controls
                            poster={chapters[0]?.asset?.resource?.thumbnail?.url}
                            autoPlay={true}
                            muted
                            style={{
                                width: !isBrowser ? "350px" : "520px",
                            }}
                        />
                        <div className={ isBrowser ? 'chapters-container-browser' : "chapters-container-mobile"}>
                            <label style={{
                                fontFamily:"Bold",
                                fontSize:"20px",
                                color: Colors.blueBlack,
                            }}>
                                {itemData.headline}
                            </label>
                            <Scrollbars style={{
                                display:"flex",
                                flexDirection:"column",
                                marginTop:"20px",
                                border: `2px solid ${Colors.grey}`,
                                borderRadius:"20px"
                            }}>
                                {
                                    chapters?.map((item, index) => 
                                        <div key={item.id} className='chapter-list-item'>
                                            <div>
                                                <label style={{
                                                    fontFamily:"Light",
                                                    fontSize: isBrowser ? "15px" : "13px",
                                                    color: Colors.grey,
                                                }}>
                                                    {index + 1}.
                                                </label>
                                                <label style={{
                                                    fontFamily:"Light",
                                                    fontSize: isBrowser ? "15px" : "13px",
                                                    color: Colors.grey,
                                                    marginLeft:"5px",
                                                    width:"7000px"
                                                }}>
                                                    {isBrowser ? item?.title?.slice(0,50) : item?.title?.slice(0,40)}
                                                    {isBrowser && item?.title?.length > 50 && "...."}
                                                    {!isBrowser && item?.title?.length > 40 && "...."}
                                                </label>
                                            </div>
                                            <label style={{
                                                fontFamily:"Light",
                                                fontSize: isBrowser ? "15px" : "13px",
                                                color: Colors.grey,
                                            }}>
                                                {getFormattedTimeStampOrDuraiton(item?.asset?.resource?.duration)}
                                            </label>
                                        </div>
                                    )
                                }
                            </Scrollbars>
                        </div>
                    </div>
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

export default Item;