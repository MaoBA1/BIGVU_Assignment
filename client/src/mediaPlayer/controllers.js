export const getFormattedTimeStampOrDuraiton = (time) => {
    let minutes = Math.floor(time / 60);
    let remainingSeconds = time % 60;
    remainingSeconds = remainingSeconds.toFixed();
    let formattedTime = `${minutes}:${remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds}`
    return formattedTime;
}

// This method works whenever video time updated
export const saveVideoTimeStempInLocalstorage = (time, chapterId) => {
    let chaptersHistory = localStorage.getItem("chaptersHistory");
    chaptersHistory = chaptersHistory ? JSON.parse(chaptersHistory) : null;
    // in case the user watched any chapter from his device
    if(chaptersHistory) {
        // check if the current chapter was saved already in the chapters list
        let chapterIndex = chaptersHistory.findIndex(chapter => chapter.chapterId === chapterId);
        // in case the current chapter is already in the chapters list
        if(chapterIndex !== -1) {
            // update the current time stamp
            chaptersHistory[chapterIndex].timeStamp = time;
            // if current time stamp bigger than 10 seconds, the current chapter updatded as watched
            chaptersHistory[chapterIndex].watched = !chaptersHistory[chapterIndex].watched && time >= 10 ? time >= 10 : chaptersHistory[chapterIndex].watched ;
            localStorage.setItem("chaptersHistory", JSON.stringify(chaptersHistory));
        } 
        // in case the current chapter wasn't saved yet in the chapters list
        else {
            chaptersHistory.push({
                chapterId: chapterId,
                timeStamp: time,
                watched: false
            })
            localStorage.setItem("chaptersHistory", JSON.stringify(chaptersHistory));
        }
    // in case the user didn't watched any chapter from his device
    } else {
        localStorage.setItem("chaptersHistory", JSON.stringify([
            {
                chapterId: chapterId,
                timeStamp: time,
                watched: false
            }
        ]));
    }
}

// This method works whenever new video is loaded
export const getCurrentTime = (chapterId) => {
    let chaptersHistory = localStorage.getItem("chaptersHistory");
    chaptersHistory = chaptersHistory ? JSON.parse(chaptersHistory) : null;
    if(chaptersHistory) {
        let chapterIndex = chaptersHistory.findIndex(chapter => chapter.chapterId === chapterId);
        // in case the current chapter was saved already in the chapters list we return the last time stamp position of it
        if(chapterIndex !== -1) {
           return chaptersHistory[chapterIndex].timeStamp;
        } 
    }
    return 0;
}

// This method works whenever course screen is loaded
export const reorderChaptersBylocalStorageData = (chapters, setChapters) => {
    let chaptersHistory = localStorage.getItem("chaptersHistory");
    chaptersHistory = chaptersHistory ? JSON.parse(chaptersHistory) : null;
    // in case the user watched any chapter from his device
    if(chaptersHistory) {
        // we check for every chapter in the original course chapters list if it's found on the user history chapter list
        // and if it is found we update the chapter watched property to what appear in the history list
        chapters.map((chapter) => {
            let index = chaptersHistory.findIndex(c => c.chapterId === chapter.id);
            chapter.watched = chaptersHistory[index]?.watched || false;
            return chapter
        })
        setChapters(chapters);
    // in case the user didn't watched any chapter from his device
    // we add the watched property to any chapter in the original chapters list and set it as false
    } else {
        chapters.map(chapter => {
            chapter.watched = false;
            return chapter;
        })
        setChapters(chapters);
    }
}