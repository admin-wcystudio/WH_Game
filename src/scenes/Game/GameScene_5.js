
import BaseGameScene from './BaseGameScene.js';
import { CustomButton } from '../../UI/Button.js';
import { CustomPanel, CustomFailPanel, QuestionPanel } from '../../UI/Panel.js';
import GameManager from '../GameManager.js';

export class GameScene_5 extends BaseGameScene {
    constructor() {
        super('GameScene_5');
    }

    preload() {

        const path = 'assets/images/Game_5/';

        this.load.image('game5_npc_box_win', `${path}game5_npc_box4.png`);
        this.load.image('game5_npc_box_tryagain', `${path}game5_npc_box5.png`);

        // UI buttons
        this.load.image('game5_confirm_button', `${path}game5_confirm_button.png`);
        this.load.image('game5_confirm_button_select', `${path}game5_confirm_button_select.png`);

        for (let i = 1; i <= 3; i++) {
            this.load.image(`game5_q${i}`, `${path}game5_question${i}.png`);
            this.load.image(`game5_q${i}_a_button`, `${path}game5_q${i}_a_button.png`);
            this.load.image(`game5_q${i}_b_button`, `${path}game5_q${i}_b_button.png`);
            this.load.image(`game5_q${i}_a_button_select`, `${path}game5_q${i}_a_button_click.png`);
            this.load.image(`game5_q${i}_b_button_select`, `${path}game5_q${i}_b_button_click.png`);
        }
    }

    create() {

        // Pass null for bgKey since using video background
        this.initGame('game5_bg', 'game5_description', true, false, {
            targetRounds: 3,
            roundPerSeconds: 60,
            isAllowRoundFail: false,
            isContinuousTimer: true,
            sceneIndex: 5
        });
    }

    setupGameObjects() {
        if (this.questionPanel) {
            this.questionPanel.destroy();
            this.questionPanel = null;
        }

        const allQuestions = [
            {
                content: 'game5_q1',
                options: ['game5_q1_a_button', 'game5_q1_b_button'],
                answer: 1,

            },
            {
                content: 'game5_q2',
                options: ['game5_q2_a_button', 'game5_q2_b_button'],
                answer: 1,

            },
            {
                content: 'game5_q3',
                options: ['game5_q3_a_button', 'game5_q3_b_button'],
                answer: 1,

            }
        ]

        this.questionPanel = new QuestionPanel(this, allQuestions, () => {
        });
        this.questionPanel.setDepth(559).setVisible(false);
    }

    enableGameInteraction(enable) {
        if (this.questionPanel) {
            this.questionPanel.setVisible(enable);
        }
    }

    resetForNewRound() {
        if (this.questionPanel) {
            this.questionPanel.destroy();
        }
        this.setupGameObjects(); // 重新抽題並建立 Panel
        this.questionPanel.setVisible(true);
    }

    showWin() {
        this.questionPanel.setVisible(false);
        this.time.delayedCall(1500, () => {
            // GameManager.backToMainStreet(this);
        });
    }


}
