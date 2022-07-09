var audio = new Audio('../../resources/audio/theme.mp4')
localStorage.setItem("audio", 'theme.mp4');

function startAudio(offset = 0) {
    audio.volume = 0.5;
    audio.currentTime = offset;
    audio.loop = true;
    setInterval(() => {
        localStorage.setItem("audio_time", audio.currentTime);
    }, 100);

}

function isAutoPlayChaged(){
    if('autoplay' in localStorage && localStorage.getItem('autoplay') === 'true'){ 
        audio.play();
    }if(('autoplay' in localStorage) && (localStorage.getItem('autoplay')) == 'false'){ 
        audio.pause();
    }if(!('autoplay' in localStorage)){
        localStorage.setItem('autoplay', true)
        audio.play();
    }
}

function playStopMusic() {
    $(document).on('click', '.music-button', function () {
        audio.paused == false ? audio.pause() : audio.play();
        audio.paused == false ? localStorage.setItem("autoplay", true) : localStorage.setItem("autoplay", false);
    });
}

function isMusicRecording() {
    let soundON = '<i class="fa fa-volume-high"></i>';
    let soundOff = '<i class="fa fa-volume-xmark"></i>';
    audio.onplay = (event) => {
        $('button[class="music-button"]').empty();
        $('button[class="music-button"]').append(soundON);
    };
    audio.onpause = (event) => {
        $('button[class="music-button"]').empty();
        $('button[class="music-button"]').append(soundOff);
    };
}

function play(){
    "audio" in localStorage ? startAudio(localStorage.getItem("audio_time")) : localStorage.setItem("audio", 'theme.mp4');  
}

export function checkAllMusicParams(){
    isAutoPlayChaged();
    play();
    isMusicRecording();
    playStopMusic();
}