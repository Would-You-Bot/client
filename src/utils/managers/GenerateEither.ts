import Canvas from '@napi-rs/canvas';
import path from 'path';

Canvas.GlobalFonts.registerFromPath(
  path.join(__dirname, '..', 'data', 'Fonts', 'OpenSans-Bold.ttf'),
  'OpenSans'
);

interface User {
  icon: string;
}

/**
 * The Either class.
 */
class Either {
  private rowOne?: User[];
  private rowTwo?: User[];
  private language?: string;
  private text1?: string;
  private text2?: string;

  /**
   * Create a new Either instance.
   */
  public constructor() {
    this.rowOne = undefined;
    this.rowTwo = undefined;
    this.language = undefined;
    this.text1 = undefined;
    this.text2 = undefined;
  }

  /**
   * Set both rows of users.
   * @param rowOne The first row of users.
   * @param rowTwo The second row of users.
   * @returns The Either class.
   */
  public setVotes(rowOne?: User[], rowTwo?: User[]): this {
    if (!Array.isArray(rowOne && rowTwo)) {
      throw new Error(
        `Expected rows array instead got ${typeof rowOne} and ${typeof rowTwo}`
      );
    }
    this.rowOne = rowOne;
    this.rowTwo = rowTwo;
    return this;
  }

  /**
   * The guildDb.language.
   * @param language The language.
   * @returns The Either class.
   */
  public setLanguage(language?: string): this {
    if (!language) {
      throw new Error(`Expected language instead got ${typeof language}`);
    }
    this.language = language;
    return this;
  }

  /**
   * Add the first text.
   * @param text1 The first text.
   * @returns The Either class.
   */
  public addFirstText(text1: string): this {
    this.text1 = text1;
    return this;
  }

  /**
   * Add the second text.
   * @param text2 The second text.
   * @returns The Either class.
   */
  public addSecondText(text2: string): this {
    this.text2 = text2;
    return this;
  }

  /**
   * Set both texts.
   * @param text1 The first text.
   * @param text2 The second text.
   * @returns The Either class.
   */
  public setTexts(text1: string, text2: string): this {
    this.text1 = text1;
    this.text2 = text2;
    return this;
  }

  /**
   * This function builds the canvas.
   * @returns The canvas.
   */
  public async build(): Promise<Buffer | undefined> {
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

    /**
     * Calculate the font size.
     * @param textLength The length of the text.
     * @param fontSize The font size.
     * @param maxLength The max length of the text.
     * @returns The font size.
     */
    function calcFontSize(
      textLength: number,
      fontSize: number,
      maxLength: number
    ): number {
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

    for (const user of sliced) {
      ctx.beginPath();

      const avatarCanvas = Canvas.createCanvas(rad * 2, rad * 2);
      const context = avatarCanvas.getContext('2d');

      context.beginPath();
      context.arc(rad, rad, rad, 0, Math.PI * 2, true);
      context.closePath();
      context.clip();

      const avatar = await Canvas.loadImage(user.icon);
      context.drawImage(avatar, 0, 0, rad * 2, rad * 2);

      ctx.drawImage(avatarCanvas, pos, yPos);

      ctx.closePath();
      pos -= rad;
    }

    const sliced2 = this.rowTwo.slice(0, 3);

    let pos1 = rad * sliced2.length + 430;
    const yPos1 = 248;
    sliced2.reverse();

    for (const user of sliced2) {
      ctx.beginPath();

      const avatarCanvas = Canvas.createCanvas(rad * 2, rad * 2);
      const context = avatarCanvas.getContext('2d');

      context.beginPath();
      context.arc(rad, rad, rad, 0, Math.PI * 2, true);
      context.closePath();
      context.clip();

      const avatar = await Canvas.loadImage(user.icon);
      context.drawImage(avatar, 0, 0, rad * 2, rad * 2);

      ctx.drawImage(avatarCanvas, pos1, yPos1);

      ctx.closePath();
      pos1 -= rad;
    }

    return canvas.encode('png');
  }
}

export default Either;
