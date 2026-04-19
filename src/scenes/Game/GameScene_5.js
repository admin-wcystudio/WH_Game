
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

        this.load.video('game_success', `${path}game5_success_bg.mp4`);
        this.load.video('game_fail', `${path}game5_fail_bg.mp4`);

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
        this.video?.destroy();
    }

    showWin() {
        this.questionPanel.setVisible(false);

    }

    onRoundWin() {
        if (!this.isGameActive || this.gameState === 'gameWin') return;

        let isFinalWin = (this.roundIndex + 1 >= this.targetRounds) || this.isAllowRoundFail;
        this.gameState = isFinalWin ? 'gameWin' : 'roundWin';

        this.gameTimer.stop();
        this._calculateTiming(isFinalWin);
        this.enableGameInteraction(false);
        this.updateRoundUI(true);
        this.showFeedbackLabel(true);

        this.video = this.add.video(960, 540, 'game_success')
            .setDepth(560)
            .setVisible(true);
        this.video.setMute(false);
        this.video.play(true);

        this.time.delayedCall(
            2000, () => {
                this.showBubble('win', this.playerGender);
            });


    }
    handleLose() {
        // Prevent multiple entries
        if (this.gameState === 'gameLose') return;

        this.currentFailCount = (this.currentFailCount || 0) + 1; // Increment fail count

        // Standard Logic
        this.isGameActive = false;
        this.gameState = 'lose';

        this.label = this.add.image(1650, 350, 'game_fail_label').setDepth(555);
        if (this.gameTimer) this.gameTimer.stop();
        this.enableGameInteraction(false);
        this.updateRoundUI(false);


        this.video = this.add.video(960, 540, 'game_fail')
            .setDepth(560)
            .setVisible(true);
        this.video.setMute(false);
        this.video.play(true);

        this.time.delayedCall(
            2000, () => {
                this.showBubble('tryagain');
            });
    }
}
