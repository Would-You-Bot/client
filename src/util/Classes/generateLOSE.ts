import Canvas from "@napi-rs/canvas";
import path from "path";
import { UserModel } from "../Models/userModel";

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

export default class LOSE {
  private game: any;

  constructor() {}

  /**
   *
   * @param {Object} game
   * @returns {void}
   */

  setGame(game: any) {
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

  async build(score: number) {
    const user = await UserModel.findOne({ userID: this.game.creator });

    if (user && score > user.higherlower.highscore) {
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
