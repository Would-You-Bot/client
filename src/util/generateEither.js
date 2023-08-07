const Canvas = require("@napi-rs/canvas");
const { join } = require("path");
Canvas.GlobalFonts.registerFromPath(
  join(__dirname, "..", "data", "Fonts", "OpenSans-Bold.ttf"),
  "OpenSans",
);

class Either {
  constructor() {}

  /**
   *
   * @param {Array} rowOne
   * @param {Array} rowTwo
   * @returns {Either}
   */
  setVotes(rowOne, rowTwo) {
    if (!Array.isArray(rowOne && rowTwo)) {
      throw new Error(
        "Expected rows array instead got " + typeof rowOne || typeof rowTwo,
      );
    }
    this.rowOne = rowOne;
    this.rowTwo = rowTwo;
    return this;
  }

  /**
   * The guildDb.language
   * @param {language} language
   * @returns {Either}
   */
  setLanguage(language) {
    if (!language) {
      throw new Error("Expected language instead got " + typeof language);
    }
    this.language = language;
    return this;
  }

  /**
   *
   * @param {String} text1
   * @returns {Either}
   */
  addFirstText(text1) {
    this.text1 = text1;
    return this;
  }

  /**
   *
   * @param {String} text2
   * @returns {Either}
   */
  addSecondText(text2) {
    this.text2 = text2;
    return this;
  }

  /**
   *
   * @param {String} text1
   * @param {String} text2
   * @returns {Either}
   */
  setTexts(text1, text2) {
    this.text1 = text1;
    this.text2 = text2;
    return this;
  }

  /**
   * This function builds the canvas
   * @returns {Promise<Buffer>}
   */
  async build() {
    const canvas = Canvas.createCanvas(600, 300);
    const ctx = canvas.getContext("2d");

    const image = await Canvas.loadImage("./src/data/images/template.png");
    await ctx.drawImage(image, 0, 0, 600, 300);

    let imageFile = "./src/data/images/rather-en.png";
    switch (this.language) {
      case "de_DE":
        imageFile = "./src/data/images/rather-de.png";
        break;
      case "en_EN":
        imageFile = "./src/data/images/rather-en.png";
        break;
      case "es_ES":
        imageFile = "./src/data/images/rather-es.png";
        break;
    }
    const translation = await Canvas.loadImage(imageFile);
    ctx.drawImage(translation, 0, 0, 600, 300);

    function calcFontSize(textLength, fontSize, maxLength) {
      let size = fontSize;
      while (textLength > maxLength) {
        size--;
        return size;
      }
    }

    const fontsize1 = calcFontSize(ctx.measureText(this.text1).width, 15, 180);
    const fontsize2 = calcFontSize(ctx.measureText(this.text2).width, 15, 180);

    ctx.font = `${fontsize1 || "25"}px OpenSans`;
    ctx.fillStyle = "#000000";
    ctx.fillText(this.text1, 140, 158);

    ctx.font = `${fontsize2 || "25"}px OpenSans`;
    ctx.fillStyle = "#000000";
    ctx.fillText(this.text2, 140, 242);

    var rad = 15;

    const sliced = this.rowOne.slice(0, 3);

    var pos = rad * sliced.length + 430;
    var yPos = 162;
    sliced.reverse();

    for (let i = 0; i < sliced.length; i++) {
      ctx.beginPath();
      let user = sliced[i];

      const a = Canvas.createCanvas(rad * 2, rad * 2);
      const context = a.getContext("2d");

      context.beginPath();
      context.arc(rad, rad, rad, 0, Math.PI * 2, true);
      context.closePath();
      context.clip();

      const avatar = await Canvas.loadImage(user.icon);
      context.drawImage(avatar, 0, 0, rad * 2, rad * 2);

      ctx.drawImage(a, pos, yPos);

      ctx.closePath();
      pos -= rad;
    }

    const sliced2 = this.rowTwo.slice(0, 3);

    var pos1 = rad * sliced2.length + 430;
    var yPos1 = 248;
    sliced2.reverse();

    for (let i = 0; i < sliced2.length; i++) {
      ctx.beginPath();
      let user = sliced2[i];

      const a = Canvas.createCanvas(rad * 2, rad * 2);
      const context = a.getContext("2d");

      context.beginPath();
      context.arc(rad, rad, rad, 0, Math.PI * 2, true);
      context.closePath();
      context.clip();

      const avatar = await Canvas.loadImage(user.icon);
      context.drawImage(avatar, 0, 0, rad * 2, rad * 2);

      ctx.drawImage(a, pos1, yPos1);

      ctx.closePath();
      pos1 -= rad;
    }

    return canvas.encode("png");
  }
}

module.exports = Either;
