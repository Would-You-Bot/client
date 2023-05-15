import Canvas from '@napi-rs/canvas';
import path from 'path';

Canvas.GlobalFonts.registerFromPath(
  path.join(__dirname, '..', 'data', 'Fonts', 'OpenSans-Bold.ttf'),
  'OpenSans'
);

interface User {
  icon: string;
}

class Either {
  rowOne?: User[];
  rowTwo?: User[];
  language?: string;
  text1?: string;
  text2?: string;

  constructor() {
    this.rowOne = undefined;
    this.rowTwo = undefined;
    this.language = undefined;
    this.text1 = undefined;
    this.text2 = undefined;
  }

  /**
   * Set both rows of users
   * @param rowOne The first row of users
   * @param rowTwo The second row of users
   * @returns The Either class
   */
  setVotes(rowOne: User[], rowTwo: User[]) {
    if (!Array.isArray(rowOne && rowTwo)) {
      throw new Error(
        `Expected rows array instead got ${typeof rowOne || typeof rowTwo}`
      );
    }
    this.rowOne = rowOne;
    this.rowTwo = rowTwo;
    return this;
  }

  /**
   * The guildDb.language
   * @param language The language
   * @returns The Either class
   */
  setLanguage(language?: string) {
    if (!language) {
      throw new Error(`Expected language instead got ${typeof language}`);
    }
    this.language = language;
    return this;
  }

  /**
   * Add the first text
   * @param text1 The first text
   * @returns The Either class
   */
  addFirstText(text1: string) {
    this.text1 = text1;
    return this;
  }

  /**
   * Add the second text
   * @param text2 The second text
   * @returns The Either class
   */
  addSecondText(text2: string) {
    this.text2 = text2;
    return this;
  }

  /**
   * Set both texts
   * @param text1 The first text
   * @param text2 The second text
   * @returns The Either class
   */
  setTexts(text1: string, text2: string) {
    this.text1 = text1;
    this.text2 = text2;
    return this;
  }

  /**
   * This function builds the canvas
   * @returns The canvas
   */
  async build(): Promise<Buffer | undefined> {
    if (!this.rowOne || !this.rowTwo || !this.text1 || !this.text2) return;

    const canvas = Canvas.createCanvas(600, 300);
    const ctx = canvas.getContext('2d');

    const image = await Canvas.loadImage('./src/constants/images/template.png');
    ctx.drawImage(image, 0, 0, 600, 300);

    let imageFile = './src/constants/images/rather-en.png';
    switch (this.language) {
      case 'de_DE':
        imageFile = './src/constants/images/rather-de.png';
        break;
      case 'en_EN':
        imageFile = './src/constants/images/rather-en.png';
        break;
      case 'es_ES':
        imageFile = './src/constants/images/rather-es.png';
        break;
      default: {
        imageFile = './src/constants/images/rather-en.png';
      }
    }
    const translation = await Canvas.loadImage(imageFile);
    ctx.drawImage(translation, 0, 0, 600, 300);

    function calcFontSize(
      textLength: number,
      fontSize: number,
      maxLength: number
    ) {
      let size = fontSize;
      while (textLength > maxLength) size -= 1;
      return size;
    }

    const fontsize1 = calcFontSize(ctx.measureText(this.text1).width, 15, 180);
    const fontsize2 = calcFontSize(ctx.measureText(this.text2).width, 15, 180);

    ctx.font = `${fontsize1 || '25'}px OpenSans`;
    ctx.fillStyle = '#000000';
    ctx.fillText(this.text1, 140, 158);

    ctx.font = `${fontsize2 || '25'}px OpenSans`;
    ctx.fillStyle = '#000000';
    ctx.fillText(this.text2, 140, 242);

    const rad = 15;

    const sliced = this.rowOne.slice(0, 3);

    let pos = rad * sliced.length + 430;
    const yPos = 162;
    sliced.reverse();

    for (let i = 0; i < sliced.length; i += 1) {
      ctx.beginPath();
      const user = sliced[i];

      const a = Canvas.createCanvas(rad * 2, rad * 2);
      const context = a.getContext('2d');

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

    let pos1 = rad * sliced2.length + 430;
    const yPos1 = 248;
    sliced2.reverse();

    for (let i = 0; i < sliced2.length; i += 1) {
      ctx.beginPath();
      const user = sliced2[i];

      const a = Canvas.createCanvas(rad * 2, rad * 2);
      const context = a.getContext('2d');

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

    return canvas.encode('png');
  }
}

export default Either;
