import { CustomButton } from "../UI/Button.js";
import { CustomPanel } from "../UI/Panel.js";
import UIHelper from "../UI/UIHelper.js";
import GameManager from "./GameManager.js";

export class GameResultScene extends Phaser.Scene {
    constructor() {
        super('GameResultScene');
    }

    preload() {
        const path = 'assets/images/GameEnd/';

        this.allResults = GameManager.loadGameResult();

        // Background
        this.load.image('finishpage_bg', `${path}finishpage_bg.png`);

        // Character Bars
        this.load.image('finishpage_bar_boy', `${path}finishpage_bar_boy.png`);
        this.load.image('finishpage_bar_girl', `${path}finishpage_bar_girl.png`);

        // UI Elements
        this.load.image('finishpage_box', `${path}finishpage_box.png`);

        // Buttons
        this.load.image('finishpage_close_button', `${path}finishpage_close_button.png`);
        this.load.image('finishpage_close_button_select', `${path}finishpage_close_button_select.png`);

        this.load.image('finishpage_item_button', `${path}finishpage_item_button.png`);
        this.load.image('finishpage_item_button_select', `${path}finishpage_item_button_select.png`);

        this.load.image('left_arrow_button', `${path}left_arrow_button.png`);
        this.load.image('left_arrow_button_click', `${path}left_arrow_button_click.png`);

        this.load.image('right_arrow_button', `${path}right_arrow_button.png`);
        this.load.image('right_arrow_button_click', `${path}right_arrow_button_click.png`);

        // Information Pages
        this.load.image('finishpage_information1', `${path}finishpage_information_p1.png`);
        this.load.image('finishpage_information2', `${path}finishpage_information_p2.png`);
        this.load.image('program_information_p3', `${path}program_information_p3.png`);
        this.load.image('program_information_p4', `${path}program_information_p4.png`);

        this.load.image('dialogue', `assets/images/Game_7/game7_npc_box1.png`);
        this.load.image('popup_01', `assets/images/Game_7/game7_popup1.png`);
        this.load.image('popup_02', `assets/images/Game_7/game7_popup2.png`);
        this.load.image('receive_button', `assets/images/Game_7/game7_receive_button.png`);
        this.load.image('receive_button_select', `assets/images/Game_7/game7_receive_button_select.png`);


        // Items (1-10)
        for (let i = 1; i <= 10; i++) {
            this.load.image(`finishpage_items${i}`, `${path}finishpage_items${i}.png`);
        }
    }

    create() {
        // allResults is an array of { game, isFinished, seconds }
        const game7 = this.allResults.find(r => r.game === 7);
        this.isGame7Completed = game7 ? !!game7.isFinished : false;

        console.log("Game 7 completed status:", this.isGame7Completed);

        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;


        this.ui = UIHelper.createResultCommonUI(this);
        this.haveItem = false;

        // Background
        this.add.image(centerX, centerY, 'finishpage_bg');

        this.playerInfo = localStorage.getItem('player') ? JSON.parse(localStorage.getItem('player')) : null;
        this.gameResults = GameManager.loadGameResult();

        this.resultGroup = this.add.group();
        this.result = this.add.image(centerX, centerY, 'finishpage_box').setDepth(10);
        this.resultGroup.add(this.result);

        this.resultContent = this.getResultContent();

        this.button = new CustomButton(this, centerX, centerY + 150, 'finishpage_item_button', 'finishpage_item_button_select',
            () => {
                this.button.setVisible(false);
                if (!this.haveItem) {
                    const itemKey = this.getRandomItem();
                    this.itemImage = this.add.image(centerX, centerY + 200, itemKey).setDepth(11);
                    this.haveItem = true;
                    this.resultGroup.add(this.itemImage);
                }

                if (!this.isGame7Completed) {
                    this.showDialogue();
                }

            }).setDepth(11);
        this.resultGroup.add(this.button);


        this.closeButton = new CustomButton(this, 1600, 200, 'finishpage_close_button'
            , 'finishpage_close_button_select', () => {
                if (this.itemImage == null) return; // Ensure the item has been revealed before allowing to close

                this.takeScreenshot();

                this.time.delayedCall(5000, () => {
                    this.resultGroup.setVisible(false);
                    this.ui.descriptionPanel.setVisible(true);

                    this.ui.descriptionPanel.closeBtn.on('pointerdown', () => {
                        this.ui.descriptionPanel.setVisible(false);
                        GameManager.switchToGameScene(this, 'GameStartScene');
                    });

                    this.time.delayedCall(20000, () => {
                        this.ui.descriptionPanel.setVisible(false);
                        GameManager.switchToGameScene(this, 'GameStartScene');
                    });

                });

            }).setDepth(11).setVisible(true);
        this.resultGroup.add(this.closeButton);

    }

    showDialogue() {

        const dialogY = this.cameras.main.height * 0.85;
        this.dialogue = this.add.image(960, dialogY, 'dialogue').setDepth(20).setInteractive({ useHandCursor: true });

        this.dialogue.on('pointerdown', () => {
            this.dialogue.destroy();
            this.showGame7Popup(this.isGame7Completed);
        });
    }

    takeScreenshot() {
        const playerName = this.playerInfo ? this.playerInfo.name : "玩家 1";
        this.game.renderer.snapshot((image) => {
            const link = document.createElement('a');
            link.setAttribute('download', `為學_${playerName}_${new Date().getTime()}.png`);
            link.setAttribute('href', image.src);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    getResultContent() {
        let playerName = this.playerInfo ? this.playerInfo.name : "玩家 1";
        let gender = this.playerInfo ? this.playerInfo.gender : "M";
        let usedSeconds = 0;

        for (const gameId in this.gameResults) {
            const result = this.gameResults[gameId];
            usedSeconds += result.seconds;
        }
        console.log("Total Used Seconds:", usedSeconds);

        const minutes = Math.floor(usedSeconds / 60);
        const seconds = usedSeconds % 60;
        const timeString = `${minutes}分${seconds}秒`;

        let charBar;
        if (gender === 'M') {
            charBar = this.add.image(960, 400, 'finishpage_bar_boy').setDepth(11);
        } else {
            charBar = this.add.image(960, 400, 'finishpage_bar_girl').setDepth(11);
        }
        const nameText = this.add.text(900, 360, `${playerName}`).setDepth(11)
            .setFontSize(40).setColor('#000000').setFontStyle('bold');

        const timeText = this.add.text(1300, 360, timeString)
            .setDepth(11).setFontSize(40).setColor('#000000').setFontStyle('bold');

        if (this.resultGroup) {
            this.resultGroup.add(charBar);
            this.resultGroup.add(nameText);
            this.resultGroup.add(timeText);
        }

        return `恭喜你，${playerName}！\n你已完成所有遊戲！\n總共花費了 ${timeString}！`;
    }


    getRandomItem() {
        const itemIndex = Phaser.Math.Between(1, 10);
        return `finishpage_items${itemIndex}`;
    }

    showGame7Popup(isCompleted) {
        const popup = this.add.image(960, 540, 'popup_01').setDepth(20);
        const receiveButton =
            new CustomButton(this, 960, 750, 'receive_button', 'receive_button_select',
                () => {
                    this.time.delayedCall(
                        2000, () => {
                            popup.destroy();
                            receiveButton.destroy();
                            console.log("Game 7 not completed, returning to Game Scene 7");
                            GameManager.switchToGameScene(this, 'GameScene_7');
                        });
                });
        receiveButton.setDepth(21);

    }

}