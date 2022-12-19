class PlayButton {
    constructor(button_id, sound_container, logic) {
        this.id = button_id;
        this.sound_container = sound_container;
        this.play_btn = document.querySelector(button_id);
        this.logic = logic;
        this.play_btn.addEventListener('click', () => this.play());
        this.sound_container.question_sound.addEventListener("ended", () => this.logic.after_play(), false);
        this.sound_container.answer_sound.addEventListener("ended", () => this.logic.after_play(), false);
        this.sound_container.question_sound.addEventListener("ended", () => this.logic.after_question(), false);
    }
    play() {
        if (this.logic.can_play()) {
            this.logic.before_play();
            this.sound_container.choiceSound().play();
        }
    }
}

class PlayButtonLogic {
    constructor() {
        this.click_cnt = 0;
        this.answer_mode = false;
        this.playing = false; // 排他制御用、再生中はtrue
    }
    // もう片方のボタン
    set_other(other) {
        this.other_btn_logic = other;
    }
    can_play() {
        if (this.playing) {
            console.log("再生中のため新規再生停止");
            return false;
        }
        if (this.other_btn_logic.playing) {
            console.log("再生中のため新規再生停止");
            return false;
        }
        this.click_cnt++;
        var res;
        // 初回なら音が聞ける
        if (this.click_cnt == 1) {
            res = true;
            // もう片方のボタンも聞いている場合は回答するので聞ける（正解音/失敗音）
        } else if (this.other_btn_logic.click_cnt > 0) {
            this.answer_mode = true;
            res = true;
        } else {
            alert('一度しか聞けないよ');
            res = false;
        }
        return res;
    }
    before_play() {
        this.playing = true;
    }
    after_play() {
        this.playing = false;
    }
    after_question() {
        // もう片方のボタンも聞いている場合は回答するので聞ける（正解音/失敗音）
        if (this.other_btn_logic.click_cnt > 0) {
            alert("正解をクリックしてね！");
        }
    }
}

class SoundContainer {
    constructor(play_btn_logic, question_sound, answer_sound) {
        this.play_btn_logic = play_btn_logic;
        this.question_sound = question_sound;
        this.answer_sound = answer_sound;
    }
    choiceSound() {
        if (this.play_btn_logic.answer_mode) {
            return this.answer_sound;
        } else {
            return this.question_sound;
        }
    }
}

// HTML要素が読み込まれてから実行する（DOMContentLoaded）
window.addEventListener('DOMContentLoaded', (event) => {
    let sound_eru = new Audio("./比較素材/300m先右です/migi_eru.wav");
    let sound_tik = new Audio("./比較素材/300m先右です/migi_tik.wav");
    let sound_ok = new Audio("./効果音/8bit6_4_1.mp3");
    let sound_ng = new Audio("./効果音/8bit6_3.mp3");

    var leftLogic = new PlayButtonLogic();
    var rightLogic = new PlayButtonLogic();
    leftLogic.set_other(rightLogic);
    rightLogic.set_other(leftLogic);

    var left_sound;
    var right_sound;
    var correct_index = Math.floor(Math.random() * 2);
    if (correct_index == 0) {
        left_sound = new SoundContainer(leftLogic, sound_eru, sound_ok);
        right_sound = new SoundContainer(rightLogic, sound_tik, sound_ng);
    } else {
        left_sound = new SoundContainer(leftLogic, sound_tik, sound_ng);
        right_sound = new SoundContainer(rightLogic, sound_eru, sound_ok);
    }

    var play_btn_list = [];
    play_btn_list.push(new PlayButton('#soundsBtn1', left_sound, leftLogic));
    play_btn_list.push(new PlayButton('#soundsBtn2', right_sound, rightLogic));
});