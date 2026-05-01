
import BaseGameScene from './BaseGameScene.js';
import { CustomButton } from '../../UI/Button.js';
import { CustomPanel, CustomFailPanel, QuestionPanel } from '../../UI/Panel.js';
import GameManager from '../GameManager.js';

export class GameScene_1 extends BaseGameScene {
    constructor() {
        super('GameScene_1');
    }

    preload() {

        const path = 'assets/images/Game_1/';

        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2

        this.load.image('game1_confirm_button', `${path}game1_confirm_button.png`);
        this.load.image('game1_confirm_button_select', `${path}game1_confirm_button_select.png`);

        this.load.image('game1_npc_box_mainstreet_01', `${path}game1_npc_box1.png`);
        this.load.image('game1_npc_box_mainstreet_boy', `${path}game1_npc_box2_boy.png`);
        this.load.image('game1_npc_box_mainstreet_girl', `${path}game1_npc_box2_girl.png`);

        for (let i = 3; i <= 7; i++) {
            this.load.image(`game1_npc_box${i}`, `${path}game1_npc_box${i}.png`);
        }

        this.load.image('game1_npc_box_win', `${path}game1_npc_box8.png`);
        this.load.image('game1_npc_box_tryagain', `${path}game1_npc_box9.png`);

        this.load.image(`game1_select_area`, `${path}game1_select_area.png`);
        this.load.image('game1_object_description', `${path}game1_object_description.png`);

        for (let i = 1; i <= 5; i++) {
            this.load.image(`game1_q${i}`, `${path}game1_q${i}.png`);
            this.load.image(`game1_q${i}_correct_answer1`, `${path}game1_q${i}_correct_answer1.png`);
            this.load.image(`game1_q${i}_fail_answer2`, `${path}game1_q${i}_fail_answer2.png`);
            this.load.image(`game1_q${i}_fail_answer3`, `${path}game1_q${i}_fail_answer3.png`);
            this.load.image(`game1_q${i}_fail_answer4`, `${path}game1_q${i}_fail_answer4.png`);
            this.load.image(`game1_q${i}_fill_answer1`, `${path}game1_q${i}_fill_answer1.png`);
            this.load.image(`game1_q${i}_fill_answer2`, `${path}game1_q${i}_fill_answer2.png`);
            this.load.image(`game1_q${i}_fill_answer3`, `${path}game1_q${i}_fill_answer3.png`);
            this.load.image(`game1_q${i}_fill_answer4`, `${path}game1_q${i}_fill_answer4.png`);

        }
    }
    create() {
        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;


        this.spawnPositions = [
            { x: this.centerX - 800, y: this.centerY - 100 },
            { x: this.centerX + 800, y: this.centerY - 100 },
            { x: this.centerX - 800, y: this.centerY + 100 },
            { x: this.centerX + 800, y: this.centerY + 100 },
        ];

        this.spawnPositions_q2 = [
            { x: this.centerX - 800, y: this.centerY - 200 },
            { x: this.centerX + 800, y: this.centerY - 200 },
            { x: this.centerX - 800, y: this.centerY + 200 },
            { x: this.centerX + 800, y: this.centerY + 200 },
            { x: this.centerX - 800, y: this.centerY },
            { x: this.centerX + 800, y: this.centerY }
        ];

        this.questionOrder = Phaser.Utils.Array.Shuffle([1, 2, 3, 4, 5]).slice(0, 3);
        console.log('Shuffled question order:', this.questionOrder);
        this.currentIndex = 0;

        // Now call initGame which will call setupGameObjects
        this.initGame('game1_bg', 'game1_description', true, false, {
            targetRounds: 3,
            roundPerSeconds: 60,
            isAllowRoundFail: false,
            isContinuousTimer: true,
            sceneIndex: 1
        });

        // this.gameUI.descriptionPanel.setVisible(false);

    }

    setupGameObjects() {
        this.input.removeAllListeners('drag');
        this.input.removeAllListeners('dragend');

        const currentQuestionId = this.questionOrder[this.currentIndex];
        this.questionImage = this.add.image(this.centerX,
            this.centerY + 50, `game1_q${currentQuestionId}`).setDepth(200);

        this.confirmBtn = new CustomButton(this, this.centerX, this.centerY + 450,
            'game1_confirm_button', 'game1_confirm_button_select', () => {
                this.checkAnswer();
            });
        this.confirmBtn.setDepth(200).setVisible(true);

        this.choices = [
            {
                q: 1,
                answers: [
                    'game1_q1_correct_answer1',
                    'game1_q1_fail_answer2', 'game1_q1_fail_answer3',
                    'game1_q1_fail_answer4'
                ],
                fillAnswers: [
                    'game1_q1_fill_answer1',
                    'game1_q1_fill_answer2', 'game1_q1_fill_answer3',
                    'game1_q1_fill_answer4'
                ]
            },
            {
                q: 2,
                answers: [
                    'game1_q2_correct_answer1',
                    'game1_q2_fail_answer2', 'game1_q2_fail_answer3',
                    'game1_q2_fail_answer4',
                    'game1_q2_correct_answer1', 'game1_q2_fail_answer3',
                ],
                fillAnswers: [
                    'game1_q2_fill_answer1',
                    'game1_q2_fill_answer2', 'game1_q2_fill_answer3',
                    'game1_q2_fill_answer4',
                    'game1_q2_fill_answer1', 'game1_q2_fill_answer3',
                ]
            },
            {
                q: 3,
                answers: [
                    'game1_q3_correct_answer1',
                    'game1_q3_fail_answer2', 'game1_q3_fail_answer3',
                    'game1_q3_fail_answer4'
                ],
                fillAnswers: [
                    'game1_q3_fill_answer1',
                    'game1_q3_fill_answer2', 'game1_q3_fill_answer3',
                    'game1_q3_fill_answer4'
                ]
            },
            {
                q: 4,
                answers: [
                    'game1_q4_correct_answer1',
                    'game1_q4_fail_answer2', 'game1_q4_fail_answer3',
                    'game1_q4_fail_answer4'
                ],
                fillAnswers: [
                    'game1_q4_fill_answer1',
                    'game1_q4_fill_answer2', 'game1_q4_fill_answer3',
                    'game1_q4_fill_answer4'
                ]
            },
            {
                q: 5,
                answers: [
                    'game1_q5_correct_answer1',
                    'game1_q5_fail_answer2', 'game1_q5_fail_answer3',
                    'game1_q5_fail_answer4'
                ],
                fillAnswers: [
                    'game1_q5_fill_answer1',
                    'game1_q5_fill_answer2', 'game1_q5_fill_answer3',
                    'game1_q5_fill_answer4'
                ]
            }
        ];

        this.targetContents = [
            {
                q: 1,
                fillPositions: [
                    { x: 1110, y: 575, targetKey: 'game1_q1_correct_answer1' }
                ],
                descriptionDialog: 'game1_npc_box3'
            },
            {
                q: 2,
                fillPositions: [
                    { x: 740, y: 565, targetKey: 'game1_q2_correct_answer1' },
                    { x: 1335, y: 565, targetKey: 'game1_q2_correct_answer1' }
                ],
                descriptionDialog: 'game1_npc_box4'
            },
            {
                q: 3,
                fillPositions: [
                    { x: 1055, y: 575, targetKey: 'game1_q3_correct_answer1' }
                ],
                descriptionDialog: 'game1_npc_box5'
            },
            {
                q: 4,
                fillPositions: [
                    { x: 670, y: 575, targetKey: 'game1_q4_correct_answer1' },
                ],
                descriptionDialog: 'game1_npc_box6'
            },
            {
                q: 5,
                fillPositions: [
                    { x: 1335, y: 575, targetKey: 'game1_q5_correct_answer1' }
                ],
                descriptionDialog: 'game1_npc_box7'
            }
        ];

        const currentFillPositions = this.targetContents.find(c => c.q === currentQuestionId).fillPositions;

        // // Debug graphics for fill positions
        // if (!this.fillDebugGraphics) {
        //     this.fillDebugGraphics = this.add.graphics();
        // }
        // this.fillDebugGraphics.clear();
        // this.fillDebugGraphics.setDepth(250);
        // this.fillDebugGraphics.lineStyle(3, 0x00ff00, 1); // Green border
        // this.fillDebugGraphics.fillStyle(0x00ff00, 0.3); // Semi-transparent green fill

        // currentFillPositions.forEach((slot, index) => {
        //     const radius = 30;
        //     this.fillDebugGraphics.strokeCircle(slot.x, slot.y, radius);
        //     this.fillDebugGraphics.fillCircle(slot.x, slot.y, radius);
        // });

        // Build answerKey → fillAnswerKey lookup
        const choice = this.choices.find(c => c.q === currentQuestionId);
        const answerToFillMap = {};
        choice.answers.forEach((key, i) => { answerToFillMap[key] = choice.fillAnswers[i]; });

        // Build fill slots with invisible hint images
        const snapTolerance = 100;
        this.fillSlots = currentFillPositions.map(slot => ({
            x: slot.x,
            y: slot.y,
            targetKey: slot.targetKey,
            occupiedBy: null,
            hintImage: this.add.image(slot.x, slot.y, 'game1_select_area')
                .setDepth(199).setAlpha(0),
            snapImage: null
        }));

        // Spawn answers at shuffled positions
        const spawnPool = currentQuestionId === 2 ? this.spawnPositions_q2 : this.spawnPositions;
        const shuffledPositions = Phaser.Utils.Array.Shuffle([...spawnPool]);
        this.answerImages = [];
        choice.answers.forEach((answerKey, index) => {
            const pos = shuffledPositions[index];
            const fillKey = answerToFillMap[answerKey];
            const img = this.add.image(pos.x, pos.y, answerKey)
                .setDepth(200)
                .setInteractive({ draggable: true, useHandCursor: true });
            img.setData({ answerKey, fillKey, originX: pos.x, originY: pos.y });
            this.answerImages.push(img);
        });

        // Drag: move image and show hint on nearby empty slots
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.setPosition(dragX, dragY).setDepth(300);
            const fillKey = gameObject.getData('fillKey');
            this.fillSlots.forEach(slot => {
                if (slot.occupiedBy) return;
                const dist = Phaser.Math.Distance.Between(dragX, dragY, slot.x, slot.y);
                if (dist < snapTolerance) {
                    slot.hintImage.setTexture(fillKey).setAlpha(0.6);
                } else {
                    slot.hintImage.setAlpha(0);
                }
            });
        });

        // Drag end: snap to nearest slot or return to origin
        this.input.on('dragend', (pointer, gameObject) => {
            this.fillSlots.forEach(slot => slot.hintImage.setAlpha(0));

            const answerKey = gameObject.getData('answerKey');
            const fillKey = gameObject.getData('fillKey');

            let nearest = null;
            let nearestDist = snapTolerance;
            this.fillSlots.forEach(slot => {
                if (slot.occupiedBy) return;
                const dist = Phaser.Math.Distance.Between(gameObject.x, gameObject.y, slot.x, slot.y);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearest = slot;
                }
            });

            if (nearest) {
                nearest.occupiedBy = answerKey;
                nearest.snapImage = this.add.image(nearest.x, nearest.y, fillKey)
                    .setDepth(200)
                    .setInteractive({ useHandCursor: true });

                // Store reference to original image for later restoration
                nearest.originalImage = gameObject;
                gameObject.setVisible(false).disableInteractive();

                // Click on placed answer to remove it and restore original
                nearest.snapImage.once('pointerdown', () => {
                    // Restore original image to spawn position
                    gameObject.setVisible(true);
                    gameObject.setInteractive({ draggable: true, useHandCursor: true });
                    gameObject.setPosition(
                        gameObject.getData('originX'),
                        gameObject.getData('originY')
                    ).setDepth(200);

                    // Clear slot
                    nearest.snapImage.destroy();
                    nearest.snapImage = null;
                    nearest.occupiedBy = null;
                    nearest.originalImage = null;
                });
            } else {
                gameObject.setPosition(
                    gameObject.getData('originX'),
                    gameObject.getData('originY')
                ).setDepth(200);
            }
        });
    }


    checkAnswer() {
        const allCorrect = this.fillSlots.every(slot => slot.occupiedBy === slot.targetKey);
        if (allCorrect) {
            this.onRoundWin();
        } else {
            this.handleLose();
        }
    }

    onRoundWin() {
        if (!this.isGameActive || this.gameState === 'gameWin') return;

        let isFinalWin = (this.currentIndex + 1 >= this.targetRounds);
        this.gameState = isFinalWin ? 'gameWin' : 'roundWin';



        if (isFinalWin) {
            this.roundIndex = this.currentIndex;
            this.gameTimer.stop();
            this._calculateTiming(isFinalWin);
            this.enableGameInteraction(false);
            this.showFeedbackLabel(true);
            this.showBubble('win');
        } else {
            this.gameTimer.stop();
            this.enableGameInteraction(false);
            this.showDescriptionDialog();
            this.currentIndex++;
            this.roundIndex = this.currentIndex - 1;

        }
        this.updateRoundUI(true);
    }

    enableGameInteraction(enabled) {
        if (!this.answerImages) return;
        this.answerImages.forEach(img => {
            if (!img.active) return;
            if (enabled) {
                img.setInteractive({ draggable: true, useHandCursor: true });
            } else {
                img.disableInteractive();
            }
        });

        this.confirmBtn.setVisible(enabled);
    }

    resetForNewRound() {
        // Reset currentIndex and shuffle questions on full game restart (restartGame sets gameState to 'init')
        if (this.gameState === 'init') {
            this.currentIndex = 0;
            this.questionOrder = Phaser.Utils.Array.Shuffle([1, 2, 3, 4, 5]).slice(0, 3);
            console.log('Shuffled question order:', this.questionOrder);
        }

        // Keep roundIndex aligned with current active question
        this.roundIndex = this.currentIndex;

        // Destroy question image
        if (this.questionImage) { this.questionImage.destroy(); this.questionImage = null; }

        // Destroy confirm button
        if (this.confirmBtn) { this.confirmBtn.destroy(); this.confirmBtn = null; }

        // Destroy answer images
        if (this.answerImages) {
            this.answerImages.forEach(img => img.destroy());
            this.answerImages = [];
        }

        // Destroy fill slot hint/snap images
        if (this.fillSlots) {
            this.fillSlots.forEach(slot => {
                if (slot.hintImage) slot.hintImage.destroy();
                if (slot.snapImage) slot.snapImage.destroy();
            });
            this.fillSlots = [];
        }

        this.setupGameObjects();

        // Reset game state for new round
        this.gameState = 'playing';
        this.isGameActive = true;
        this.gameTimer.start();
        this.enableGameInteraction(true);

    }
    showWin() {
        this.showObjectPanel();
    }

    showDescriptionDialog() {
        const currentQuestionId = this.questionOrder[this.currentIndex];
        const targetContent = this.targetContents.find(c => c.q === currentQuestionId);

        this.descriptionDialog = this.add.image(
            this.centerX, this.cameras.main.height * 0.8,
            targetContent?.descriptionDialog)
            .setDepth(300)
            .setInteractive({ useHandCursor: true });

        this.descriptionDialog.once('pointerdown', () => {
            this.descriptionDialog.destroy();

            this.resetForNewRound();
        });

    }

    showObjectPanel() {
        const objectPanel = new CustomPanel(this, 960, 600, [{
            content: 'game1_object_description',
            closeBtn: 'close_btn',
            closeBtnClick: 'close_btn_click'
        }]);
        objectPanel.setDepth(1000);
        objectPanel.show();
        objectPanel.setCloseCallBack(() => GameManager.backToMainStreet(this));
    }


}
