import BaseGameScene from './BaseGameScene.js';
import { CustomButton } from '../../UI/Button.js';
import { CustomPanel, CustomFailPanel } from '../../UI/Panel.js';
import GameManager from '../GameManager.js';


export class GameScene_6 extends BaseGameScene {
    constructor() {
        super('GameScene_6');
    }

    preload() {
        const path = 'assets/images/Game_6/';
        const player = JSON.parse(localStorage.getItem('player') || '{"gender":"M"}');
        this.genderKey = player.gender === 'M' ? 'boy' : 'girl';

        if (this.genderKey === 'boy') {
            this.load.image(`game6_bg`, `assets/images/Game_6/game6_bg_boy.png`);
            this.load.image('game6_progress_icon', `${path}game6_progress_bar_boy.png`);
        } else {
            this.load.image(`game6_bg`, `assets/images/Game_6/game6_bg_girl.png`);
            this.load.image('game6_progress_icon', `${path}game6_progress_bar_girl.png`);
        }

        this.load.image('game6_npc_box_mainstreet', `${path}game6_npc_box1.png`);
        this.load.image('game6_npc_box_intro', `${path}game6_npc_box1.png`);
        this.load.image('game6_npc_box_win', `${path}game6_npc_box2.png`);
        this.load.image('game6_npc_box_win_01', `${path}game6_npc_box3.png`);
        this.load.image('game6_npc_box_tryagain', `${path}game6_npc_box4.png`);

        this.load.image('game6_npc_box_anim_01', `${path}game6_npc_box5.png`);
        this.load.image('game6_npc_box_anim_02', `${path}game6_npc_box6.png`);
        this.load.image('game6_npc_box_anim_03', `${path}game6_npc_box7.png`);


        // Buttons
        this.load.image('game6_arrow_blue', `${path}game6_arrow_blue.png`);
        this.load.image('game6_arrow_green', `${path}game6_arrow_green.png`);
        this.load.image('game6_arrow_red', `${path}game6_arrow_red.png`);
        this.load.image('game6_arrow_yellow', `${path}game6_arrow_yellow.png`);

        // Arrows
        this.load.image('game6_bar_arrow_blue', `${path}game6_bar_arrow_blue.png`);
        this.load.image('game6_bar_arrow_green', `${path}game6_bar_arrow_green.png`);
        this.load.image('game6_bar_arrow_red', `${path}game6_bar_arrow_red.png`);
        this.load.image('game6_bar_arrow_yellow', `${path}game6_bar_arrow_yellow.png`);


        // Other UI
        this.load.image('game6_bar_bg', `${path}game6_bar_bg.png`);
        this.load.image('game6_progress_bar', `${path}game6_progress_bar.png`);
        this.load.image('game6_progress_bar_fail', `${path}game6_progress_bar_fail.png`);
        this.load.image('game6_progress_bar_success', `${path}game6_progress_bar_success.png`);

        this.load.image('game6_hit_point', `${path}game6_hit_point.png`);
        this.load.image('game6_hit_button', `${path}game6_hit_button.png`);
        this.load.image('game6_hit_button_select', `${path}game6_hit_button_select.png`);
        this.load.video('game6_success_bg', `${path}game6_success_bg.mp4`, 'loadeddata', false, true);

    }

    create() {
        // Initialize dimensions
        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;

        this.barBG = this.add.image(960, 540, 'game6_bar_bg').setDepth(20);
        this.progressBar = this.add.image(960, 950, 'game6_progress_bar').setDepth(21);
        this.progressIcon = this.add.image(960, 950, 'game6_progress_icon').setDepth(24);

        this.initGame('game6_bg', 'game6_description', false, false, {
            targetRounds: 3,
            roundPerSeconds: 2000,
            isAllowRoundFail: false,
            isContinuousTimer: true,
            sceneIndex: 6
        });

    }

    setupGameObjects() {
        this.canSpawn = false;
        this.spawnHitPoint = false;
        this.isHitPointValid = false;
        this.isWin = false;
        this.spawnSpeed = 5;
        this.currentIndex = 0;
        this.fallingArrows = [];

        if (this.buttonGroup) {
            if (this.buttonGroup.scene) {
                this.buttonGroup.destroy(true);
            }
        }
        if (this.arrowGroup) {
            if (this.arrowGroup.scene) {
                this.arrowGroup.destroy(true);
            }
        }

        this.buttonGroup = this.add.group();
        this.arrowGroup = this.add.group();
        const colors = ['blue', 'green', 'red', 'yellow'];
        for (let i = 0; i < 4; i++) {
            const button = new CustomButton(this, 520 + i * 300, 780, `game6_arrow_${colors[i]}`, `game6_arrow_${colors[i]}`,
                () => {
                    this.handleArrowClick(i);
                }).setDepth(25);
            this.buttonGroup.add(button);
        }

        for (let i = 0; i < colors.length; i++) {
            const arrow = this.add.image(960, -100, `game6_bar_arrow_${colors[i]}`).setDepth(23);
            this.arrowGroup.add(arrow);
        }

    }
    update() {
        if (this.canSpawn) {
            if (!this.fallingArrows || this.fallingArrows.length < 2) {
                this.spawnArrow();
            }

            if (!this.fallingArrows) return;


            if (!this.spawnHitPoint) {
                this.time.delayedCall(1500, () => {
                    if (this.canSpawn && !this.spawnHitPoint) {
                        this.spawnHitPoint = true;
                        this.showHitPoint();
                    }
                });
            }
            // console.log('Hit point valid:', this.isHitPointValid);

            for (let i = this.fallingArrows.length - 1; i >= 0; i--) {
                const arrow = this.fallingArrows[i];
                arrow.x -= this.spawnSpeed;
                if (arrow.x < 200) {
                    arrow.destroy();
                    this.fallingArrows.splice(i, 1);
                }
            }

        }
    }

    enableGameInteraction(enable) {

        if (this.buttonGroup) {
            this.buttonGroup.setVisible(enable);
            this.buttonGroup.getChildren().forEach(button => {
                if (enable) {
                    button.setInteractive();
                } else {
                    button.disableInteractive();
                }
            });
        }
        if (this.barBG)
            this.barBG.setVisible(enable);

        if (this.hitPoint)
            this.hitPoint.setVisible(enable);

    }

    showHitPoint() {
        if (this.isWin) return;

        this.hitPoint = this.add.image(1000, 520, 'game6_hit_point').setDepth(30);
        this.hitPoint.setScale(0);
        this.isHitPointValid = true;
        this.tweens.add({
            targets: this.hitPoint,
            scale: 1,
            duration: 500,
            ease: 'Back.out'
        });


        this.time.delayedCall(2500, () => {
            if (this.hitPoint) {
                this.tweens.add({
                    targets: this.hitPoint,
                    scale: 0,
                    duration: 500,
                    ease: 'Back.in',
                });;
            }
            this.isHitPointValid = false
        });

        this.time.delayedCall(2000, () => {
            this.spawnHitPoint = false;
        });
    }

    spawnArrow() {
        if (!this.fallingArrows) this.fallingArrows = [];

        const colors = ['blue', 'green', 'red', 'yellow'];
        const gap = 200;
        let startX = 1620;

        if (this.fallingArrows.length > 0) {
            const rightMostArrow = this.fallingArrows.reduce((
                max, arrow) => arrow.x > max.x ? arrow : max, this.fallingArrows[0]);
            startX = Math.max(rightMostArrow.x, 1920);
        }

        console.log('Spawning ');

        for (let i = 1; i <= 12; i++) {
            const randomIndex = Phaser.Math.Between(0, colors.length - 1);
            const color = colors[randomIndex];
            const arrow = this.add.image(startX + (i * gap), 540, `game6_bar_arrow_${color}`).setDepth(24);
            arrow.colorIndex = randomIndex;
            this.fallingArrows.push(arrow);
        }

    }

    handleArrowClick(index) {
        if (!this.fallingArrows || this.fallingArrows.length === 0) return;

        // Find any arrow that matches the color and is within the hit zone
        const hitIndex = this.fallingArrows.findIndex(arrow =>
            arrow.x >= 900 && arrow.x <= 1100 && arrow.colorIndex === index
        );
        let winRound = false;

        if (hitIndex !== -1 && this.isHitPointValid) {
            const arrow = this.fallingArrows[hitIndex];
            console.log('Hit matching arrow index:', hitIndex, 'Position:', arrow.x);
            winRound = true;
        } else {
            console.log("No matching arrow in hit zone / or hit point not valid");
        }

        // Common cleanup: destroy arrows, hitPoint, and hide barBG
        for (let i = 0; i < this.fallingArrows.length; i++) {
            this.fallingArrows[i].destroy();
        }
        this.fallingArrows = [];
        this.canSpawn = false;
        this.spawnHitPoint = false;
        this.isHitPointValid = false;
        this.enableGameInteraction(false);

        if (winRound) {
            this.currentIndex++;

            this.onRoundWin();
        } else {
            this.handleLose();
        }
        this.updateProgressBar(true);
    }

    updateProgressBar(showFail = false) {
        if (!this.progressFail) {
            this.progressFail = this.add.image(960, 950, 'game6_progress_bar_fail').setDepth(22).setScrollFactor(0);
        }
        if (!this.progressSuccess) {
            this.progressSuccess = this.add.image(960, 950, 'game6_progress_bar_success').setDepth(23).setScrollFactor(0);
        }

        if (!this.progressWidth) {
            this.progressWidth = this.progressFail.displayWidth || this.progressFail.width || 1;
        }

        const successWidth = Math.floor(this.progressWidth * Math.min(1, this.currentIndex / this.targetRounds));
        this.progressSuccess.setCrop(0, 0, successWidth, this.progressSuccess.height);
        this.progressFail.setCrop(0, 0, showFail ? this.progressWidth : 0, this.progressFail.height);
    }


    onRoundWin() {
        if (!this.isGameActive || this.gameState === 'gameWin') return;

        let isFinalWin = (this.roundIndex >= this.targetRounds);
        this.gameState = isFinalWin ? 'gameWin' : 'roundWin';
        this.gameTimer.stop();
        this.enableGameInteraction(false);

        if (isFinalWin) {
            this.showBubble('win');
            this.showFeedbackLabel(true);
        } else {
            this.roundIndex = this.currentIndex;
            this.canSpawn = true;
            this.enableGameInteraction(true);
        }

        this.updateRoundUI(true);
    }



    onIntroBubbleClose() {
        this.canSpawn = true;
    }

    showWin() {

    }


    resetForNewRound() {

    }
}

