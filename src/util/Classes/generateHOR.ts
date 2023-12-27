import Canvas from "@napi-rs/canvas";
import path from "path";
import { formatNumber } from "../Functions/number";

// Import font
Canvas.GlobalFonts.registerFromPath(
  path.join(__dirname, "..", "..", "data", "Fonts", "Poppins-Black.ttf"),
  "Poppins-Black",
);

Canvas.GlobalFonts.registerFromPath(
  path.join(__dirname, "..", "..", "data", "Fonts", "Poppins-Bold.ttf"),
  "Poppins-Bold",
);

Canvas.GlobalFonts.registerFromPath(
  path.join(__dirname, "..", "..", "data", "Fonts", "Poppins-SemiBold.ttf"),
  "Poppins-SemiBold",
);

Canvas.GlobalFonts.registerFromPath(
  path.join(__dirname, "..", "..", "data", "Fonts", "Poppins-Medium.ttf"),
  "Poppins-Medium",
);

export default class HOR {
  private game: any;
  private images: any;
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
   *
   * @param {Array<String>} images
   * @returns {void}
   */

  setImages(images: any) {
    if (!Array.isArray(images)) {
      throw new TypeError("Expected images array instead got " + typeof images);
    }
    this.images = images;
    return this;
  }

  /**
   * This function builds the canvas
   * @param {Number} score
   * @returns {Promise<Buffer>}
   */

  async build(score: any) {
    const { images } = this;

    // Create canvas
    const canvasObject = Canvas.createCanvas(1424, 512);
    const ctx = canvasObject.getContext("2d");

    // Background
    const [image1, image2] = await Promise.all([
      Canvas.loadImage(images[0]).catch((e) =>
        Canvas.loadImage("https://cdn.wouldyoubot.gg/higherlower/error.png"),
      ),
      Canvas.loadImage(images[1]).catch((e) =>
        Canvas.loadImage("https://cdn.wouldyoubot.gg/higherlower/error.png"),
      ),
    ]);

    ctx.drawImage(image1, 0, 0, 712, 512);
    ctx.drawImage(image2, 712, 0, 712, 512);

    ctx.beginPath();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 1424, 512);
    ctx.closePath();

    // Circle
    ctx.beginPath();
    ctx.globalAlpha = 0.9;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#000000";
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 1;
    ctx.arc(712, 256, 55, 0, Math.PI * 2, true);
    ctx.fillStyle = "#0F0F0F";
    ctx.fill();
    ctx.closePath();

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.fillStyle = "#ffffff";
    ctx.font = "40px Poppins-Bold";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("VS", 712, 258);
    ctx.closePath();

    // Title
    // ctx.beginPath();
    // ctx.shadowBlur = 0;
    // ctx.globalAlpha = 1;
    // ctx.fillStyle = "#ffffff";
    // ctx.font = "45px Poppins-SemiBold";
    // ctx.textAlign = "center";
    // ctx.fillText("Higher or Lower?", 712, 75);
    // ctx.closePath();

    // Text 1
    ctx.beginPath();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#ffffff";
    ctx.font = "50px Poppins-Bold";
    ctx.textAlign = "center";
    ctx.fillText(
      `"${
        this.game.items.history[this.game.items.history.length - 1].keyword
      }"`,
      356,
      170,
    );

    ctx.beginPath();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#ECECEC";
    ctx.font = "30px Poppins-Medium";
    ctx.textAlign = "center";
    ctx.fillText("has", 356, 220);

    ctx.beginPath();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#FCFF5B";
    ctx.font = "80px Poppins-Black";
    ctx.textAlign = "center";
    ctx.fillText(
      `${formatNumber(
        this.game.items.history[this.game.items.history.length - 1].value,
      )}`,
      356,
      285,
    );

    ctx.beginPath();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#ECECEC";
    ctx.font = "30px Poppins-Medium";
    ctx.textAlign = "center";
    ctx.fillText("average montly searches", 356, 350);

    // Text 2
    ctx.beginPath();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#ffffff";
    ctx.font = "50px Poppins-Bold";
    ctx.textAlign = "center";
    ctx.fillText(
      `"${this.game.items.current.keyword.slice(0, 17)}"`,
      1068,
      258,
    );

    // Stats
    ctx.beginPath();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#ffffff";
    ctx.font = "31px Poppins-SemiBold";
    ctx.textAlign = "center";
    ctx.fillText(`Score: ${score}`, 712, 50);
    ctx.closePath();

    const img = await canvasObject.encode("png");
    Canvas.clearAllCache();

    return img;
  }
}
