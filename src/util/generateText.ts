import type WouldYou from "./wouldYou";

interface GuildDB {
	language: string;
}

export function generateWYR(client: WouldYou, text: string, id: string, guilddb: GuildDB): object {
	const wyrRegexes: Record<string, RegExp> = {
		en_EN: /^(?!.*(?:would you rather)).*$/i,
		de_DE: /^(?!.*(?:würdest du eher|wuerdest du eher)).*$/i,
		es_ES: /^(?!.*(?:preferirías|preferirias)).*$/i,
		fr_FR: /^(?!.*(?:préfères-tu|preferes-tu)).*$/i,
		it_IT: /^(?!.*(?:preferiresti)).*$/i,
	};

	const wyrMap: Record<string, string> = {
		en_EN: "Would you rather",
		de_DE: "Würdest du eher",
		es_ES: "Preferirías",
		fr_FR: "Préfères-tu",
		it_IT: "Preferiresti",
	};

	const guildLanguage = guilddb.language as string;
	const wyrRegexPattern = wyrRegexes[guildLanguage];
	const responsePhrase = wyrMap[guildLanguage];

	if (wyrRegexPattern.test(text.toLowerCase())) {
		client.customAdd.set(id, {
			type: "wouldyourather",
			text: `${responsePhrase} ${text}`,
			original: text,
		});
		return {
			value: false,
			type: "wouldyourather",
			text: `${responsePhrase} ${text}`,
		};
	}
	return { value: true, type: "wouldyourather", text: text };
}

export function generateWWYD(client: WouldYou, text: string, id: string, guilddb: GuildDB): object {
	const languageRegex: Record<string, RegExp> = {
		en_EN: /^(?!.*(?:what would you do)).*$/i,
		de_DE: /^(?!.*(?:was würdest du tun|was wuerdest du tun)).*$/i,
		es_ES: /^(?!.*(?:qué harías|que harias)).*$/i,
		fr_FR: /^(?!.*(?:que ferais-tu)).*$/i,
		it_IT: /^(?!.*(?:cosa faresti)).*$/i,
	};

	const languageMap: Record<string, string> = {
		en_EN: "What would you do",
		de_DE: "Was würdest du tun",
		es_ES: "Qué harías",
		fr_FR: "Que ferais-tu",
		it_IT: "Cosa faresti",
	};

	const guildLanguage = guilddb.language as string;
	const languageRegexPattern = languageRegex[guildLanguage];
	const responsePhrase = languageMap[guildLanguage];
	if (languageRegexPattern.test(text.toLowerCase())) {
		client.customAdd.set(id, {
			type: "wwyd",
			text: `${responsePhrase} ${text}`,
			original: text,
		});
		return {
			value: false,
			type: "wwyd",
			text: `${responsePhrase} ${text}`,
		};
	}
	return { value: true, type: "wwyd", text: text };
}

export function generateNHIE(client: WouldYou, text: string, id: string, guilddb: GuildDB): object {
	const nhieRegexes: Record<string, RegExp> = {
		en_EN: /^(?!.*(?:never have i ever)).*$/i,
		de_DE: /^(?!.*(?:niemals habe ich)).*$/i,
		es_ES: /^(?!.*(?:nunca he)).*$/i,
		fr_FR: /^(?!.*(?:jamais je)).*$/i,
		it_IT: /^(?!.*(?:non ho mai)).*$/i,
	};

	const nhieMap: Record<string, string> = {
		en_EN: "Never have I ever",
		de_DE: "Niemals habe ich",
		es_ES: "Nunca he",
		fr_FR: "Jamais je",
		it_IT: "Non ho mai",
	};

	const guildLanguage = guilddb.language as string;
	const nhieRegexPattern = nhieRegexes[guildLanguage];
	const responsePhrase = nhieMap[guildLanguage];

	if (nhieRegexPattern.test(text.toLowerCase())) {
		client.customAdd.set(id, {
			type: "neverhaveiever",
			text: `${responsePhrase} ${text}`,
			original: text,
		});
		return {
			value: false,
			type: "neverhaveiever",
			text: `${responsePhrase} ${text}`,
		};
	}
	return { value: true, type: "neverhaveiever", text: text };
}
