
function extractData(callback = (linkToExtract) => {}){
    const userInfos = JSON.parse(localStorage.localUser)
    const roomCode = userInfos.room
    const urlGetActivityID = `https://api.socrative.com/rooms/api/current-activity/${roomCode}`
    fetch(urlGetActivityID )
    .then(response => response.json())
    .then((data) => {
        const quizCode = data.activity_id;
        callback(`https://teacher.socrative.com/quizzes/${quizCode}/student?room=${roomCode}`)
    });
}
chrome.runtime.onMessage.addListener(function(request, data = null) {
    if (request === "EXTRACT_DATA") {
        setTimeout(function() {
            extractData((linkToExtract) => {
                chrome.extension.sendRequest({ type: "LINK_EXTRACT", payload: linkToExtract });
            })
        }, 1000);
    }
});
