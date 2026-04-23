
import BaseGameScene from './BaseGameScene.js';
import { CustomButton } from '../../UI/Button.js';
import { CustomPanel, CustomFailPanel, QuestionPanel, QuestionPanel_7 } from '../../UI/Panel.js';
import GameManager from '../GameManager.js';

export class GameScene_7 extends BaseGameScene {
    constructor() {
        super('GameScene_7');
    }

    preload() {

        const path = 'assets/images/Game_7/';

        this.load.image('game7_npc_box_win', `${path}game7_npc_box1.png`);
        this.load.image('game7_npc_box_tryagain', `${path}game7_npc_box2.png`);

        this.load.video('game_success', `${path}game7_success_bg.mp4`);
        this.load.video('game_fail', `${path}game7_fail_bg.mp4`);

        // UI buttons
        this.load.image('game7_confirm_button', `${path}game7_confirm_button.png`);
        this.load.image('game7_confirm_button_select', `${path}game7_confirm_button_select.png`);
        this.load.image('game7_bg', `${path}game7_bg.png`);
        this.load.image('game7_final_preview', `${path}game7_final_preview.png`);

        for (let i = 1; i <= 3; i++) {
            this.load.image(`game7_q${i}`, `${path}game7_q${i}.png`);
            this.load.image(`game7_q${i}_a_button`, `${path}game7_q${i}_a_button.png`);
            this.load.image(`game7_q${i}_b_button`, `${path}game7_q${i}_b_button.png`);
            this.load.image(`game7_q${i}_a_button_select`, `${path}game7_q${i}_a_button_select.png`);
            this.load.image(`game7_q${i}_b_button_select`, `${path}game7_q${i}_b_button_select.png`);
        }
    }

    create() {

        // Pass null for bgKey since using video background
        this.initGame('game7_bg', null, true, true, {
            targetRounds: 3,
            roundPerSeconds: 600,
            isAllowRoundFail: false,
            isContinuousTimer: true,
            sceneIndex: 7
        });
    }

    setupGameObjects() {
        if (this.questionPanel) {
            this.questionPanel.destroy();
            this.questionPanel = null;
        }

        const allQuestions = [
            {
                content: 'game7_q1',
                options: ['game7_q1_a_button', 'game7_q1_b_button'],
                answer: 1,

            },
            {
                content: 'game7_q2',
                options: ['game7_q2_a_button', 'game7_q2_b_button'],
                answer: 1,

            },
            {
                content: 'game7_q3',
                options: ['game7_q3_a_button', 'game7_q3_b_button'],
                answer: 1,

            }
        ]

        this.questionPanel = new QuestionPanel_7(this, allQuestions, () => {
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
    onWinBubbleClose() {
        this.questionPanel.setVisible(false);
        this.showWinGamePreview();
    }

    showWinGamePreview() {
        const preview = new CustomPanel(this, 'game7_final_preview', null, null, true);
        preview.setDepth(560);
        preview.show();
        preview.setCloseCallBack(() => {
            preview.destroy();
            this.time.delayedCall(
                2000, () => {
                    console.log("Game 7 completed, switching to Game Result Scene");
                    GameManager.switchToGameScene('GameResultScene');
                });
        });
    }
}
