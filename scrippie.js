const info = document.getElementsByClassName('info-unit')[0];
let quizUnits;
let quizDone = false;

const shuffle = (array) => {
    let currentIndex = array.length;
    let randomIndex;

    while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
};

const explore = () => {
    [...document.getElementsByTagName('path')].forEach((pathElement) => {
        pathElement.addEventListener('click', () => {
            const content = pathElement.getAttribute('data-info').split(':');

            const country = content[1].split('</div>')[0].trim();
            const capital = content[2].split('</div>')[0].trim();

            [...document.getElementsByClassName('active-country')].forEach((element) => {
                element.classList.remove('active-country');
            })

            pathElement.classList.add('active-country');

            info.innerHTML = `<div>${country}</div><div>${capital}</div>`;
        });
    });
};

const initQuizUnits = () => {
    const countriesAndCapitals = [...document.getElementsByTagName('path')].reduce((total, pathElement) => {
        const dataInfo = pathElement.getAttribute('data-info');

        if (!dataInfo) {
            return total;
        }

        const content = dataInfo.split(':');

        const country = content[1].split('</div>')[0].trim();
        const capital = content[2].split('</div>')[0].trim();

        return [...total, country, capital];
    }, []);

    shuffle(countriesAndCapitals);

    quizUnits = countriesAndCapitals;
};

const setQuizInfo = (question, good, bad, left) => {
    const template = `
        <div>Click:</div>
        <div>${question}</div>
        <div class="good-bad">
            <span>Goed: <b>${good}</b></span>
            <span>Bad: <b>${bad}</b></span>
            <span>Left: <b>${left}</b></span>
        </div>
    `;

    info.innerHTML = template;
};

const flash = (good) => {
    if (good) {
        document.body.style.backgroundColor = 'green';
    } else {
        document.body.style.backgroundColor = 'red';
    }

    setTimeout(() => {
        document.body.style.backgroundColor = '#e27100';
    }, 250);
};

const quiz = () => {
    initQuizUnits();

    const total = quizUnits.length;
    let good = 0;
    let bad = 0;

    let next = quizUnits.pop();

    setQuizInfo(next, good, bad, `${total - quizUnits.length}/${total}`);

    [...document.getElementsByTagName('path')].forEach((pathElement) => {
        pathElement.addEventListener('click', () => {
            if (quizDone) {
                return;
            }

            const content = pathElement.getAttribute('data-info').split(':');

            const country = content[1].split('</div>')[0].trim();
            const capital = content[2].split('</div>')[0].trim();

            if (next === country || next === capital) {
                good++;
                flash(true);
            } else {
                flash();
                bad++;
            }

            next = quizUnits.pop();

            if (next) {
                setQuizInfo(next, good, bad, `${quizUnits.length}/${total}`);
            } else {
                // done
                setQuizInfo('Done!', good, bad, `${quizUnits.length}/${total}`);
                info.children[0].remove();
                quizDone = true;
            }
        });
    });
};

const isQuiz = window.location.href.includes('quiz');

if (isQuiz) {
    quiz();
} else {
    explore();
}
