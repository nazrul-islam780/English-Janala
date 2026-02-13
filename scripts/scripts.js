const loadLessons = () => {
    fetch('https://openapi.programming-hero.com/api/levels/all')
        .then((res) => res.json())
        .then(data => displayLessons(data.data))


}

const removeActive = () =>{
    const lessonButtons = document.querySelectorAll('.lesson-btn')
    lessonButtons.forEach(btn => btn.classList.remove('active'))
    
}

// loadLessons()
const loadLevelWord = (id) => {
    // console.log(id);
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

const displayLoadWord = (words) => {
    const cardContainer = document.getElementById('word-container')
    // console.log(cardContainer)
    // cardContainer.innerHTML = '<h1>hello world</a>';    
    cardContainer.innerHTML = '';

    if(words.length == 0){
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
                 <p class="my-6 font-medium text-[20px]">Meaning/ Pronounciation</p>
                 <h2 class="text-[30px] font-medium text-[#18181B]">"${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"}/ ${word.pronunciation? word.pronunciation : "Pronunciation পাওয়া যায়নি "}"</h2>
                 <div class="flex justify-between mt-12">
                    <button class="btn bg-[#1A91FF1A] text-xl"><i class="fa-solid fa-circle-info"></i></button>
                    <button class="btn bg-[#1A91FF1A] text-xl"><i class="fa-solid fa-volume-high"></i></button>
                 </div>
             </div>`;
        cardContainer.append(cardDiv)
    }
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
        lessonBtn.innerHTML = `<a id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="lesson-btn btn bg-transparent border-[#422AD5] text-[#422AD5] hover:bg-[#422AD5] hover:text-white"><i class="fa-solid fa-book-open"></i> Lesson -${lesson.level_no}</a>`;
        lessonsContainer.append(lessonBtn)
    }

}

loadLessons()
