import WouldYou from "./wouldYou";
export function generateWYR(client: WouldYou, text: string, id: string): object {
  const wyr = /^(?!.*(?:would you rather)).*$/i;

  if (wyr.test(text)) {
    client.customAdd.set(id, { type: "wouldyourather", text: `Would you rather ${text}` })
    return { value: false, type: "wouldyourather", text: `Would you rather ${text}` };
  } else {
    return { value: true, type: "wouldyourather", text: text };
  }
}

export function generateWWYD(client: WouldYou, text: string, id: string): object {
  const wwyd = /^(?!.*(?:what would you do)).*$/i;

  if (wwyd.test(text)) {
    client.customAdd.set(id, { type: "wwyd", text: `What would you do ${text}` })
    return { value: false, type: "wwyd", text: `What would you do ${text}` };
  } else {
    return { value: true, type: "wwyd", text: text };
  }
}

export function generateNHIE(client: WouldYou, text: string, id: string): object {
  const nhie = /^(?!.*(?:never have i ever)).*$/i;

  if (nhie.test(text)) {
    client.customAdd.set(id, { type: "neverhaveiever", text: `Never have I ever ${text}` })
    return { value: false, type: "neverhaveiever", text: `Never have I ever ${text}` };
  } else {
    return { value: true, type: "neverhaveiever", text: text };
  }
}
