
setTimeout(() => {
    document.querySelector('#saveDocument').addEventListener('click', () => {
        window.print();
    })
    main();
}, 2000)
function main(){
    document.title = socrativeData.name
    document.querySelector('#examTitle').innerText = socrativeData.name
    document.querySelector('#questionsInject').innerHTML = renderizeData(socrativeData.questions);
}


function renderizeData(questions){
    let questionsHTML = '';

    questions.forEach((questionData, iQ) => {
        let answersHTML = '';
        if (questionData.answers === undefined){
            answersHTML = '<i>This question do not have alternatives</i>'
        }else{
            questionData.answers.forEach((answer, iA) => {
                const answerHTML = `
                <alt name="${String.fromCharCode(iA + 64 + 1)}">
                        ${answer.text}
                </alt>
                `;
                answersHTML += answerHTML;
            })
        }
        

        answersHTML = '<alternatives>' + answersHTML + '</alternatives>';



        const questionHTML = `
            <question>
                <data>Question ${iQ + 1}</data>
                <description>${questionData.question_text}</description>
                ${answersHTML}
            </question>
        `;
        questionsHTML += questionHTML;
    })

    return questionsHTML;
}