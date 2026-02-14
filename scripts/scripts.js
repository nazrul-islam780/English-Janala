const createElements = (arr) => {
    const htmlElements = arr.map((el) => `<span class="btn border-[1px] border-[#D7E4EF] bg-[#EDF7FF] mt-2 mr-4">${el}</span>`);
    return (htmlElements.join(""))
}

function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const manageSpinner = status => {
    if (status) {
        document.getElementById('spinner').classList.remove('hidden');
        document.getElementById('word-container').classList.add('hidden');
    } else {
        document.getElementById('spinner').classList.add('hidden');
        document.getElementById('word-container').classList.remove('hidden');
    }
}

const loadLessons = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all')
        .then((res) => res.json())
        .then(data => displayLessons(data.data))


}

const removeActive = () => {
    const lessonButtons = document.querySelectorAll('.lesson-btn')
    lessonButtons.forEach(btn => btn.classList.remove('active'))

}

const loadWordDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`
    // fetch(url)
    // .then(res => res.json())
    // .then(data => console.log(data.data))
    const res = await fetch(url);
    const details = await res.json()
    displayWordDetails(details.data)
}

// loadLessons()
const loadLevelWord = (id) => {
    manageSpinner(true)
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    // console.log(url);
    fetch(url)
        .then(res => res.json())
        .then(data => {
            const clickBtn = document.getElementById(`lesson-btn-${id}`)
            removeActive()
            clickBtn.classList.add('active');
            displayLoadWord(data.data)
        });


    // return url;
}

const displayWordDetails = word => {
    // console.log(word)
    const detailsBox = document.getElementById('details-container');
    detailsBox.innerHTML = `<div class="">
                        <h2 class="text-2xl md:text-4xl font-semibold">${word.word} (<i class="fa-solid fa-microphone"></i> : ${word.pronunciation})</h2>
                    </div>
                    <div class="">
                        <h2 class="text-xl md:text-2xl font-semibold mb-2">Meaning</h2>
                        <p class="font-bangla text-2xl font-medium">${word.meaning ? word.meaning : "No meaning found"}</p>
                    </div>
                    <div class="">
                        <h2 class="text-xl md:text-2xl font-semibold mb-2">Example</h2>
                        <p class="text-xl md:text-2xl font-medium">${word.sentence}</p>
                    </div>
                    <div class="">
                        <h2 class="text-xl md:text-2xl font-medium font-bangla mb-2">সমার্থক শব্দ গুলো</h2>
                        <div class="">${createElements(word.synonyms)}</div>
                    </div>`;
    document.getElementById('word_modal').showModal();
}

const displayLoadWord = (words) => {
    const cardContainer = document.getElementById('word-container')
    // console.log(cardContainer)
    // cardContainer.innerHTML = '<h1>hello world</a>';    
    cardContainer.innerHTML = '';

    if (words.length == 0) {
        cardContainer.innerHTML = `
        <div class="text-center col-span-full my-6">

                <img class="mx-auto" src="assets/alert-error.png" alt="alert">
                <p class="text-[#79716B] font-bangla text-m">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h2 class="text-[#292524] font-bangla text-3xl mt-3">নেক্সট Lesson এ যান</h2>
            </div>
        `
    }

    // console.log(words);
    for (let word of words) {
        // console.log(word)
        const cardDiv = document.createElement('div')
        cardDiv.innerHTML = `<div class="shadow-sm bg-white w-auto text-center py-10 px-7 rounded-xl">
                 <h2 class="text-3xl font-bold">${word.word ? word.word : "শব্দ পাওয়া যায়নি "}</h2>
                 <p class="my-2 md:my-6 font-medium text-[20px]">Meaning/ Pronounciation</p>
                 <h2 class="text-[30px] font-medium text-[#18181B]">"${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"}/ ${word.pronunciation ? word.pronunciation : "Pronunciation পাওয়া যায়নি "}"</h2>
                 <div class="flex justify-between mt-5 md:mt-12">
                    <button class="btn bg-[#1A91FF1A] text-xl" onclick="loadWordDetail(${word.id})"><i class="fa-solid fa-circle-info"></i></button>
                    <button class="btn bg-[#1A91FF1A] text-xl" onclick="pronounceWord('${word.word}')"><i class="fa-solid fa-volume-high"></i></button>
                 </div>
             </div>`;
        cardContainer.append(cardDiv)
    }
    manageSpinner(false)
}

const displayLessons = (lessons) => {
    // console.log(lesson)
    // 1. get the container @ empty
    const lessonsContainer = document.getElementById('level-container')

    // 2. get into every lessons
    //     3. create Element
    //     4. append into container

    lessonsContainer.innerHTML = '';
    for (let lesson of lessons) {
        // console.log('Hello world')
        // const {level_no} = lesson
        const lessonBtn = document.createElement("div");
        lessonBtn.innerHTML = `<a id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="lesson-btn text-[11px] md:text-sm btn bg-transparent border-[#422AD5] text-[#422AD5] hover:bg-[#422AD5] hover:text-white "><i class="fa-solid fa-book-open"></i> Lesson -${lesson.level_no}</a>`;
        lessonsContainer.append(lessonBtn)
    }

}

loadLessons()

document.getElementById('btn-search').addEventListener("click", () => {
    removeActive()
    const input = document.getElementById('input-search');
    const searchValue = input.value.trim().toLowerCase();
    console.log(searchValue)
    fetch('https://openapi.programming-hero.com/api/words/all')
        .then(res => res.json())
        .then((data) => {
            const allWords = data.data;
            console.log(allWords);
            const filterWords = allWords.filter((word) => 
                word.word.toLowerCase().includes(searchValue)
            );
            displayLoadWord(filterWords)
        })
})