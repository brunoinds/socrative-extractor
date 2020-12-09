document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('button').addEventListener('click', () => {
        extractData();
    })
});

chrome.extension.onRequest.addListener(function(message,sender,sendResponse){
    if (message.type === "LINK_EXTRACT") {
        console.log(message.payload)
        getQuizData(message.payload, (data) => {
            openDocument(data);
            //downloadFile('Socrative Quiz.json', JSON.stringify(data, null, 4))
        })
    }
});

function extractData(){
    chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, "EXTRACT_DATA");
    });
}

function getQuizData(linkExtract, callback = () => {}){
    fetch(linkExtract)
        .then(response => response.json())
        .then((data) => {
            console.log(data)
            callback(data)
        });
}

function downloadFile(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function openDocument(documentData){
    render();
    function render(){
        chrome.runtime.getPackageDirectoryEntry(function(root) {
            root.getFile("model.html", {}, function(fileEntry) {
                fileEntry.file(function(file) {
                    let reader = new FileReader();
                    reader.onloadend = function(e) {
                        load(this.result);
                    };
                reader.readAsText(file);
                }, (error) => {
                    console.error(error)
                });
            }, (error) => {
                console.error(error)
            });
        });


        function load(htmlText){
            console.log('There')
            htmlText = htmlText.replace('#socrativeDataInsertion', JSON.stringify(documentData))
            console.log(htmlText)
            const previewDocument = open('url');
            previewDocument.document.write(htmlText);

            previewDocument.socrativeData = documentData;
        }
    }
}