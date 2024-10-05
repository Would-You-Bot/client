import {
  ActionRowBuilder,
  type AutocompleteInteraction,
  type Interaction,
  type ModalActionRowComponentBuilder,
  ModalBuilder,
  type ModalSubmitInteraction,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";

export type ModalCompatibleInteraction = Exclude<
  Interaction,
  AutocompleteInteraction | ModalSubmitInteraction
>;

export type ArrayOfOneToFiveItems<T> =
  | [T]
  | [T, T]
  | [T, T, T]
  | [T, T, T, T]
  | [T, T, T, T, T];

export interface ModalFieldData {
  customId: string;
  style: "line" | "paragraph";
  label: string;
  minLen?: number;
  maxLen?: number;
  required?: boolean;
  prefill?: string;
  placeholder?: string;
}

export interface ModalData {
  customId: string;
  title: string;
  fields: ArrayOfOneToFiveItems<ModalFieldData>;
}

/**
 * Handles a modal from it's creation to retrieving it's data.
 * @author sans._.
 */
export class Modal {
  constructor(public data: ModalData) {}

  /**
   * Checks to see if passed modal data respects discord API limits. Does not include type checks.
   */
  public static isValidModalData(
    data: ModalData,
  ): { valid: true; data: ModalData } | { valid: false; reason: string } {
    const idsToCheck = [data.customId, ...data.fields.map((f) => f.customId)];

    // Matches any string of letters (upper/small case) + numbers + _- between 1-100 characters
    const r = /^[a-zA-Z0-9_-]{1,100}$/;

    if (idsToCheck.some((id) => !r.test(id))) {
      return {
        valid: false,
        reason: `At least 1 customId doesn't match ${r}`,
      };
    }

    const inRange = (n: number, min: number, max: number) =>
      n >= min && n <= max;

    const titlesToCheck = [data.title, ...data.fields.map((f) => f.label)];

    if (titlesToCheck.some((title) => !inRange(title.length, 1, 45))) {
      return {
        valid: false,
        reason: "At least 1 title or label length is out of range (1, 45)",
      };
    }

    // Typescript handles this, not sure why I bothered
    // const invalidStyles = data.fields.some(
    //   (field) => !["line", "paragraph"].includes(field.style),
    // );

    // if (invalidStyles) {
    //   return {
    //     valid: false,
    //     reason: "At least 1 field style is invalid.",
    //   };
    // }

    const invalidMinLens = data.fields.some((field) => {
      const minLen = field.minLen;

      return minLen === undefined ? false : !inRange(minLen, 0, 4000);
    });

    if (invalidMinLens) {
      return {
        valid: false,
        reason: `At least 1 field's minLen property is out of range (0, 4000)`,
      };
    }

    const invalidMaxLens = data.fields.some((field) => {
      const maxLen = field.maxLen;

      return maxLen === undefined ? false : !inRange(maxLen, 1, 4000);
    });

    if (invalidMaxLens) {
      return {
        valid: false,
        reason: `At least 1 field's maxLen property is out of range (1, 4000)`,
      };
    }

    const invalidPlaceholders = data.fields.some((field) => {
      const placeholder = field.placeholder;

      return placeholder === undefined
        ? false
        : !inRange(placeholder.length, 1, 100);
    });

    if (invalidPlaceholders) {
      return {
        valid: false,
        reason: `At least 1 field's placeholder length is out of range (1, 100)`,
      };
    }

    const invalidPrefills = data.fields.some((field) => {
      const prefill = field.prefill;

      return prefill === undefined ? false : !inRange(prefill.length, 1, 4000);
    });

    if (invalidPrefills) {
      return {
        valid: false,
        reason: `At least 1 field's prefill length is out of range (1, 4000)`,
      };
    }

    return { valid: true, data };
  }

  private async show(
    interaction: ModalCompatibleInteraction,
  ): Promise<{ success: true } | { success: false; reason: string }> {
    if (interaction.deferred) {
      return {
        success: false,
        reason: "Modals cannot be shown to deferred interactions",
      };
    }

    const validationResult = Modal.isValidModalData(this.data);

    if (!validationResult.valid)
      return { success: false, reason: validationResult.reason };

    const modalBuilder = new ModalBuilder()
      .setCustomId(this.data.customId)
      .setTitle(this.data.title);

    const fields: TextInputBuilder[] = [];

    for (const field of this.data.fields) {
      const textInput = new TextInputBuilder()
        .setCustomId(field.customId)
        .setLabel(field.label)
        .setStyle(
          field.style === "line"
            ? TextInputStyle.Short
            : TextInputStyle.Paragraph,
        )
        .setRequired(field.required);

      if (field.minLen !== undefined) textInput.setMinLength(field.minLen);

      if (field.maxLen !== undefined) textInput.setMaxLength(field.maxLen);

      if (field.placeholder !== undefined)
        textInput.setPlaceholder(field.placeholder);

      if (field.prefill !== undefined) textInput.setValue(field.prefill);

      fields.push(textInput);
    }

    modalBuilder.addComponents(
      fields.map((f) =>
        new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(f),
      ),
    );

    const result = await interaction
      .showModal(modalBuilder)
      .catch((err: Error) => `Unhandled error occured: ${err}`);

    return typeof result === "string"
      ? { success: false, reason: result }
      : { success: true };
  }

  /**
   * Shows the modal to an interaction and returns the data sent by the user or any errors.
   */
  public async getData(
    /**
     * The interaction to show the modal to and get data from.
     */
    interaction: ModalCompatibleInteraction,
    /**
     * Time in ms to wait for a submit before rejecting. Defaults to 1 minute.
     */
    time = 60_000,
  ) {
    const showResult = await this.show(interaction);

    if (!showResult.success) {
      return { success: false, err: showResult.reason };
    }

    const submitResult = await interaction
      .awaitModalSubmit({ time })
      .then((modalSubmitInteraction) => modalSubmitInteraction)
      .catch((err) => `${err}`);

    if (typeof submitResult === "string") {
      return { success: false, err: submitResult };
    }

    return {
      success: true,
      data: {
        modal: submitResult,
        fieldValues: Array.from(
          submitResult.fields.fields
            .map((field) => ({ customId: field.customId, value: field.value }))
            .values(),
        ) as ArrayOfOneToFiveItems<{ customId: string; value: string }>,
      },
    };
  }
}
