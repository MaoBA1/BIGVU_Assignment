export const getFormattedTimeStampOrDuraiton = (time) => {
    let minutes = Math.floor(time / 60);
    let remainingSeconds = time % 60;
    remainingSeconds = remainingSeconds.toFixed();
    let formattedTime = `${minutes}:${remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds}`
    return formattedTime;
}

export const saveVideoTimeStempInLocalstorage = (time, chapterId) => {
    let chaptersHistory = localStorage.getItem("chaptersHistory");
    chaptersHistory = chaptersHistory ? JSON.parse(chaptersHistory) : null;
    if(chaptersHistory) {
        let chapterIndex = chaptersHistory.findIndex(chapter => chapter.chapterId === chapterId);
         if(chapterIndex !== -1) {
            chaptersHistory[chapterIndex].timeStamp = time;
            chaptersHistory[chapterIndex].watched = !chaptersHistory[chapterIndex].watched && time >= 10 ? time >= 10 : chaptersHistory[chapterIndex].watched ;
            localStorage.setItem("chaptersHistory", JSON.stringify(chaptersHistory));
         } else {
            chaptersHistory.push({
                chapterId: chapterId,
                timeStamp: time,
                watched: false
            })
            localStorage.setItem("chaptersHistory", JSON.stringify(chaptersHistory));
         }
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

export const getCurrentTime = (chapterId) => {
    let chaptersHistory = localStorage.getItem("chaptersHistory");
    chaptersHistory = chaptersHistory ? JSON.parse(chaptersHistory) : null;
    if(chaptersHistory) {
        let chapterIndex = chaptersHistory.findIndex(chapter => chapter.chapterId === chapterId);
        if(chapterIndex !== -1) {
           return chaptersHistory[chapterIndex].timeStamp;
        } 
   }
}


export const reorderChaptersBylocalStorageData = (chapters, setChapters) => {
    let chaptersHistory = localStorage.getItem("chaptersHistory");
    chaptersHistory = chaptersHistory ? JSON.parse(chaptersHistory) : null;
    if(chaptersHistory) {
        chapters.map((chapter) => {
            let index = chaptersHistory.findIndex(c => c.chapterId === chapter.id);
            chapter.watched = chaptersHistory[index]?.watched || false;
            return chapter
        })
        setChapters(chapters);
    } else {
        chapters.map(chapter => {
            chapter.watched = false;
            return chapter;
        })
        setChapters(chapters);
    }
}