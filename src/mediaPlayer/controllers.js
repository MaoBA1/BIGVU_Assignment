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
         if(chapterIndex != -1) {
            chaptersHistory[chapterIndex].timeStamp = time;
            localStorage.setItem("chaptersHistory", JSON.stringify(chaptersHistory));
         } else {
            chaptersHistory.push({
                chapterId: chapterId,
                timeStamp: time
            })
            localStorage.setItem("chaptersHistory", JSON.stringify(chaptersHistory));
         }
    } else {
        localStorage.setItem("chaptersHistory", JSON.stringify([
            {
                chapterId: chapterId,
                timeStamp: time
            }
        ]));
    }
}

export const getCurrentTime = (chapterId) => {
    let chaptersHistory = localStorage.getItem("chaptersHistory");
    chaptersHistory = chaptersHistory ? JSON.parse(chaptersHistory) : null;
    if(chaptersHistory) {
        let chapterIndex = chaptersHistory.findIndex(chapter => chapter.chapterId === chapterId);
        if(chapterIndex != -1) {
           return chaptersHistory[chapterIndex].timeStamp;
        } 
   }

}