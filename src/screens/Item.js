import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import '../utilities/item.css';
import fetchData from '../FetchData';
import Colors from '../utilities/Colors';
import { getCurrentTime, getFormattedTimeStampOrDuraiton, reorderChaptersBylocalStorageData, saveVideoTimeStempInLocalstorage } from '../mediaPlayer/controllers';
import { isBrowser } from 'react-device-detect';
import Scrollbars from 'react-custom-scrollbars-2';
import { TfiMedallAlt } from 'react-icons/tfi';
import { AiOutlinePlayCircle, AiOutlinePauseCircle } from 'react-icons/ai';
import { MdDone } from 'react-icons/md';

const { width } = window.screen;


function Item() {
    const params = useParams();
    const { id } = params;
    const Baseurl = `https://interviews.bigvu.tv/course/${id}`;
    const [ itemData, setItemData ] = useState(null);
    const [ windowSize, setWindowSize ] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });
    const [ chapters, setChapters ] = useState([]);
    const [chapterIndex, setChapterIndex] = useState(0);
    const videoElement = useRef(null);
    const [ playing, setPlaying ] = useState(true);
    

    const initiateComponent = useCallback(async () => {
        let data = await fetchData(Baseurl);
        if(data) {
            let currentVideo = localStorage.getItem("currentVideo");
            currentVideo = currentVideo ? JSON.parse(currentVideo) : null;
            setChapterIndex(currentVideo?.index || 0);
            reorderChaptersBylocalStorageData(data.chapters, setChapters);
            setItemData(data);
        }
    },[Baseurl])
    
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
        
    }, [initiateComponent, itemData])

    const handelPicChapter = (item, index) => {
        if(index === chapterIndex) {
            if(playing) {
                videoElement?.current?.pause();
            } else {
                videoElement?.current?.play();
            }
        } else {
            videoElement?.current?.pause();
            setChapterIndex(index);
            localStorage.setItem("currentVideo", JSON.stringify({
                id: item.id,
                index: index
            }))
            videoElement?.current?.play()
            .then(() => {
                console.log("play");
            })
            .catch(error => {
                // console.log(error.message);
                // play when another video is loading
            })
        }
    }

    return (  
        <div className= {isBrowser ? "item-container-browser" : "item-container-mobile"} style={{ height: windowSize.height }}>
            {
                itemData ?
                (
                    <div className={isBrowser ? 'body-container-browser' : "body-container-mobile"} >
                        <video
                            ref={videoElement}
                            src={chapters[chapterIndex]?.asset?.resource?.stream?.url}
                            onTimeUpdate={(event) => {
                                // save video time stamp in local storage
                                saveVideoTimeStempInLocalstorage(event.currentTarget.currentTime, chapters[chapterIndex].id);

                                if(!playing) {
                                    setPlaying(true);
                                }

                                // if chapter finished, swipe to next one in the list
                                if(event.currentTarget.currentTime === chapters[chapterIndex]?.asset?.resource?.duration) {
                                    setChapterIndex((chapterIndex + 1)  % chapters.length);
                                    localStorage.setItem("currentVideo", JSON.stringify({
                                        id: id,
                                        index: (chapterIndex + 1)  % chapters.length
                                    }))
                                    videoElement.current.src = (chapterIndex + 1)  % chapters.length;
                                }

                                // if current chapter time stamp is bigger than 10 seconds, the chapter sign as watched
                                if(event.currentTarget.currentTime >=10) {
                                    let formattedChapters = chapters;
                                    formattedChapters[chapterIndex].watched = true;
                                    setChapters(formattedChapters);
                                }

                                // If all chapters in the course have been viewed, the course is marked as fully viewed
                                if(chapters?.filter(chapter => chapter?.watched)?.length === chapters?.length) {
                                    let completedCourse = localStorage.getItem("completedCourse");
                                    if(completedCourse) {
                                        completedCourse = JSON.parse(completedCourse);
                                        localStorage.setItem("completedCourse", JSON.stringify([ {id: id} ]));
                                    } else {
                                        completedCourse?.push({id: id})
                                        localStorage.setItem("completedCourse", JSON.stringify(completedCourse));
                                    }
                                }
                            }}
                            onLoadedData={(event) => {
                                // when the video is loaded the video time stamp is set to the record in local storage
                                if(getCurrentTime(chapters[chapterIndex].id)) {
                                    videoElement.current.currentTime = getCurrentTime(chapters[chapterIndex].id);
                                }
                            }}
                            onPause={() => setPlaying(false)}
                            controls
                            poster={chapters[chapterIndex]?.asset?.resource?.thumbnail?.url}
                            autoPlay={true}
                            playsInline
                            muted
                            style={{
                                width: !isBrowser ? "350px" : `${width * (50/100)}px`,
                                border: `1px solid ${Colors.grey}`,
                                borderRadius:"10px"
                            }}
                        />
                        <div  style={{ margin:"10px" }}/>
                        <div className={ isBrowser ? 'chapters-container-browser' : "chapters-container-mobile"}
                            style={{ width: isBrowser &&  `${width * (35/100)}px`}}
                        >
                            <div style={{
                                display:"flex",
                                flexDirection:"row",
                                alignItems:"center",
                            }}>
                                {
                                    chapters?.filter(chapter => chapter?.watched)?.length === chapters?.length
                                    &&
                                    <MdDone
                                        color={Colors.greenBold}
                                        style={{
                                            marginRight:"10px"
                                        }}
                                        size={"25px"}
                                    />
                                }
                                <label style={{
                                    fontFamily:"Bold",
                                    fontSize:"20px",
                                    color: Colors.blueBlack,
                                }}>
                                    {itemData.headline}
                                </label>

                                <div style={{
                                    display:"flex",
                                    flexDirection:"row",
                                    marginLeft:"20px",
                                    alignItems:"center"
                                }}>
                                    <TfiMedallAlt
                                        color={Colors.blueBlack}
                                    />
                                    <label style={{
                                        fontFamily:"Bold",
                                        fontSize:"12px",
                                        marginLeft:"5px",
                                        color: Colors.blueBlack
                                    }}>
                                        {chapters?.filter(chapter => chapter?.watched)?.length + " / " + chapters.length}
                                    </label>
                                </div>        
                            </div>
                            <Scrollbars style={{
                                display:"flex",
                                flexDirection:"column",
                                marginTop:"20px",
                                border: `2px solid ${Colors.grey}`,
                                borderRadius:"20px"
                            }}>
                                {
                                    chapters?.map((item, index) => 
                                        <div onClick={() => handelPicChapter(item, index)} key={item.id} className='chapter-list-item'>
                                            <div style={{
                                                display:"flex",
                                                flexDirection:"row",
                                                alignItems:"center"
                                            }}>
                                                {
                                                    chapters[index].watched === false && (index !== chapterIndex)
                                                    &&
                                                    (
                                                        <AiOutlinePlayCircle
                                                            color={chapterIndex === index ? Colors.blueBlack : Colors.grey}
                                                        />
                                                    )
                                                }
                                                {
                                                    chapterIndex === index &&
                                                    (
                                                        <>
                                                        {
                                                            playing ?
                                                            (
                                                                <AiOutlinePauseCircle
                                                                    color={chapterIndex === index ? Colors.blueBlack : Colors.grey}
                                                                />
                                                            )
                                                            :
                                                            (
                                                                <AiOutlinePlayCircle
                                                                    color={chapterIndex === index ? Colors.blueBlack : Colors.grey}
                                                                />
                                                            )
                                                        }
                                                        </>
                                                    )
                                                }
                                                {
                                                    chapters[index].watched && chapterIndex !== index &&
                                                    (
                                                        <MdDone
                                                            color={Colors.greenBold}
                                                        />
                                                    )
                                                }
                                                <label style={{
                                                    fontFamily:"Bold",
                                                    fontSize: "13px",
                                                    color: chapterIndex === index ? Colors.blueBlack : Colors.grey,
                                                    marginLeft:"5px"
                                                }}>
                                                    {index + 1}.
                                                </label>
                                                <label style={{
                                                    fontFamily:"Bold",
                                                    fontSize: "13px",
                                                    color: chapterIndex === index ? Colors.blueBlack : Colors.grey,
                                                    marginLeft:"5px",
                                                }}>
                                                    {isBrowser ? item?.title?.slice(0,50) : item?.title?.slice(0,35)}
                                                    {isBrowser && item?.title?.length > 50 && "...."}
                                                    {!isBrowser && item?.title?.length > 35 && "...."}
                                                </label>
                                            </div>
                                            <label style={{
                                                fontFamily:"Bold",
                                                fontSize: "13px",
                                                color: chapterIndex === index ? Colors.blueBlack : Colors.grey,
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