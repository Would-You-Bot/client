const Canvas = require("@napi-rs/canvas");
const path = require("path");
const userModel = require("../Models/userModel");

// Import font
Canvas.GlobalFonts.registerFromPath(
  path.join(__dirname, "..", "..", "data", "fonts", "Poppins-Black.ttf"),
  "Poppins-Black",
);

Canvas.GlobalFonts.registerFromPath(
  path.join(__dirname, "..", "..", "data", "fonts", "Poppins-Bold.ttf"),
  "Poppins-Bold",
);

Canvas.GlobalFonts.registerFromPath(
  path.join(__dirname, "..", "..", "data", "fonts", "Poppins-SemiBold.ttf"),
  "Poppins-SemiBold",
);

Canvas.GlobalFonts.registerFromPath(
  path.join(__dirname, "..", "..", "data", "fonts", "Poppins-Medium.ttf"),
  "Poppins-Medium",
);

class LOSE {
  constructor() {}

  /**
   *
   * @param {Object} game
   * @returns {void}
   */

  setGame(game) {
    if (typeof game !== "object") {
      throw new TypeError("Expected game object instead got " + typeof game);
    }
    this.game = game;
  }

  /**
   * This function builds the canvas
   * @param {Number} score
   * @returns {Promise<Buffer>}
   */

  async build(score) {
    const user = await userModel.findOne({ userID: this.game.creator });

    if (score > user.higherlower.highscore) {
      user.higherlower.highscore = score;
      await user.save();
    }

    // Create canvas
    const canvasObject = Canvas.createCanvas(1424, 512);
    const ctx = canvasObject.getContext("2d");

    // Background
    const [image1] = await Promise.all([
      Canvas.loadImage("https://cdn.wouldyoubot.gg/higherlower/lose.png"),
    ]);

    ctx.drawImage(image1, 0, 0, 1424, 512);

    // Stats
    ctx.beginPath();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#ffffff";
    ctx.font = "50px Poppins-SemiBold";
    ctx.textAlign = "center";
    ctx.fillText(`Score: ${score}`, 712, 280);
    ctx.closePath();

    return canvasObject.encode("png");
  }
}

module.exports = LOSE;
