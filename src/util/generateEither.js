const Canvas = require("@napi-rs/canvas");
module.exports = class Either {
  constructor(client) {
    this.c = client;
  }

  /**
   *
   * @param {Array} rowOne
   * @param {Array} rowTwo
   * @returns {Either}
   */

  setVotes(rowOne, rowTwo) {
    if (!Array.isArray(rowOne && rowTwo)) {
      throw new Error("Expected rows array instead got " + typeof song);
    }
    this.rowOne = rowOne;
    this.rowTwo = rowTwo
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
  }

  /**
   *
   * @param {String} text1
   * @param {String} text2
   * @returns {Either}
   */

  addText(text1, text2) {
    if (!text1 || typeof text1 !== "string") {
      throw new TypeError("Expected text1 string instead got " + typeof text1);
    }
    if (!text2 || typeof text2 !== "string") {
      throw new TypeError(
        "Expected text string instead got " + typeof background
      );
    }
    this.text1 = text1;
    this.text2 = text2;
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

    ctx.font = `bold ${fontsize1 || "25"}px sans-serif`;
    ctx.fillStyle = "#000000";
    ctx.fillText(text1, 140, 156);

    ctx.font = `bold ${fontsize2 || "25"}px sans-serif`;
    ctx.fillStyle = "#000000";
    ctx.fillText(text2, 140, 240);

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

      const avatar = await Canvas.loadImage(user);
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

      const avatar = await Canvas.loadImage(user);
      context.drawImage(avatar, 0, 0, rad * 2, rad * 2);

      ctx.drawImage(a, pos1, yPos1);

      ctx.closePath();
      pos1 -= rad;
    }

    return canvasObject.encode("png");
  }
}
