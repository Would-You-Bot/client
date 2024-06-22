import { SlashCommandBuilder } from "discord.js";
import { ChatInputCommand } from "../../interfaces";
import { wyrModel } from "../../util/Models/questionModel";

const command: ChatInputCommand = {
  requireGuild: true,
  data: new SlashCommandBuilder()
    .setName("migrate")
    .setDescription("So some funky database migration stuff")
    .setDMPermission(false),

  /**
   * @param {CommandInteraction} interaction
   * @param {WouldYou} client
   * @param {guildModel} guildDb
   */
  execute: async (interaction, client, guildDb) => {
    const questions = [
      {
        _id: "cada623d-c0cb-4d81-a61e-60079f4411af",
        value: "Preferisci accettare un aiuto o occuparti delle cose da solo?",
      },
      {
        _id: "67b8344e-c2f2-4363-b9e6-210abbb8131f",
        value:
          "Preferiresti che tutti i dispositivi elettrici smettessero misteriosamente di funzionare (forse per sempre) o che i governi del mondo fossero gestiti solo da persone in piena pubertà?",
      },
      {
        _id: "23e99861-5515-46e3-9cab-94f0b950a689",
        value:
          "Preferisci avere sempre la sensazione che qualcuno ti segua, ma non c'è nessuno, o avere sempre la sensazione che qualcuno ti osservi, anche se non c'è nessuno?",
      },
      {
        _id: "79be3603-8545-4966-8ad5-340f08029dbd",
        value:
          "Preferiresti avere sempre un corpo fantastico per tutta la vita ma un'intelligenza leggermente inferiore alla media o avere un corpo mediocre per tutta la vita ma un'intelligenza leggermente superiore alla media?",
      },
      {
        _id: "246e98c7-4872-4ffd-bdb8-73d04a51cca4",
        value:
          "Preferiresti avere sempre un taglio di capelli mullet o un taglio di capelli a coda di cavallo?",
      },
      {
        _id: "52ed1c27-6290-4a83-aeb7-79a014efd7ad",
        value:
          "Preferiresti sapere sempre esattamente che ora è o sapere sempre in che direzione sei rivolto?",
      },
      {
        _id: "b64ff7fd-ced9-4ef2-b7c7-540ffe54b051",
        value:
          "Preferiresti vivere sempre a 15 km da dove sei nato o non poterti mai stabilire in un posto per più di un anno?",
      },
      {
        _id: "5080976d-4062-4ce5-9da8-c0e05f0b605c",
        value: "Preferiresti essere un campione di bowling o di curling?",
      },
      {
        _id: "89c0543d-11d0-4223-906e-cd21f6b03257",
        value: "Preferiresti essere un artista o un fotografo famoso?",
      },
      {
        _id: "2d6d80f5-636c-48a8-89e6-c2e108ec16fd",
        value:
          "Preferiresti essere un famoso astronauta o un famoso scienziato?",
      },
      {
        _id: "49acb13e-de52-4355-8b0a-16bada4f3912",
        value: "Preferiresti essere un famoso astronomo o un famoso fisico?",
      },
      {
        _id: "3a8be7d0-0797-4644-b1c0-82379fd44d1d",
        value: "Preferiresti essere un atleta famoso o un allenatore famoso?",
      },
      {
        _id: "33080cd8-2313-40e0-95a7-768de2e91b5a",
        value: "Preferiresti essere un famoso atleta o un famoso politico?",
      },
      {
        _id: "80f1eedc-477e-4312-a60b-e2944b2671ea",
        value: "Preferiresti essere un famoso chef o un famoso cantante?",
      },
      {
        _id: "3d1a5c8b-2262-46f1-b9f6-6aef3300dae7",
        value: "Preferiresti essere un famoso chef o un famoso scrittore?",
      },
      {
        _id: "cf4cdc0c-80a9-4074-ac55-8db3860f510f",
        value: "Preferiresti essere un famoso comico o un famoso mago?",
      },
      {
        _id: "cc674309-fa87-42ed-9761-041f7e61b97f",
        value:
          "Preferiresti essere una famosa ballerina o una famosa ginnasta?",
      },
      {
        _id: "df33f80b-5a3c-4189-86b1-065b449ec4c1",
        value:
          "Preferiresti essere un famoso esploratore o un famoso archeologo?",
      },
      {
        _id: "a84bb55f-a81f-41a2-926e-fcca1d75b17e",
        value:
          "Preferiresti essere un famoso stilista o un famoso parrucchiere?",
      },
      {
        _id: "1d5f1fd9-49cc-4305-bbe7-06d42e8f559a",
        value:
          "Preferiresti essere un famoso stilista di moda o un famoso designer di interni?",
      },
      {
        _id: "11f4e3ce-9323-4cde-bad8-dfb6a1ae657b",
        value: "Preferiresti essere un famoso inventore o un famoso ingegnere?",
      },
      {
        _id: "07845cbb-4834-40fd-a095-c22c43021014",
        value: "Preferiresti essere un famoso musicista o un famoso DJ?",
      },
      {
        _id: "2883bf07-6011-42cf-9af1-3e9459fa118f",
        value: "Preferiresti essere un musicista famoso o un attore famoso?",
      },
      {
        _id: "3b572305-a12c-4eda-baea-cc898982b9a2",
        value: "Preferiresti essere un famoso poeta o un famoso drammaturgo?",
      },
      {
        _id: "fd329764-f869-4ec1-94fd-67f6902e4d63",
        value:
          "Preferiresti essere un famoso pilota di auto da corsa o un famoso pilota acrobatico?",
      },
      {
        _id: "e92714a5-4385-4f43-95aa-d941a5193772",
        value:
          "Preferiresti essere un famoso scrittore o un famoso illustratore?",
      },
      {
        _id: "d58aa8ed-229e-4815-8921-327f5eafde60",
        value: "Preferiresti essere un re o un cavaliere?",
      },
      {
        _id: "746c2db1-67c7-446b-bc70-5bdbe67bd30f",
        value:
          "Preferiresti essere un medico praticante o un ricercatore medico?",
      },
      {
        _id: "728cb5ec-3be1-43e3-8691-a5f5a3d6a14a",
        value:
          "Preferiresti essere un atleta professionista o un artista professionista?",
      },
      {
        _id: "694b47b6-e9ed-4bae-8653-8511a4152705",
        value: "Preferisci essere un supereroe o un supercattivo?",
      },
      {
        _id: "0c8db3a3-431c-4bd0-b5b7-73f14c6dc52e",
        value: "Preferisci essere un supereroe o un mago?",
      },
      {
        _id: "69039a93-2633-4b3d-8c3b-8898fd845d6b",
        value:
          "Preferiresti essere un supereroe con super intelligenza o super agilità?",
      },
      {
        _id: "72461b51-e3d0-4202-b3da-00dcbb936551",
        value:
          "Preferiresti essere un supereroe con la capacità di controllare il fuoco o la capacità di controllare il ghiaccio?",
      },
      {
        _id: "a15adb9a-76de-4f1a-81e1-c52301435950",
        value:
          "Preferiresti essere un supereroe con la capacità di controllare il tempo o la capacità di controllare lo spazio?",
      },
      {
        _id: "8e9b59cc-52bf-4013-b24d-0385858ab72f",
        value:
          "Preferiresti essere un supereroe con il potere del volo o con il potere dell'invisibilità?",
      },
      {
        _id: "67e4ad2a-8e7e-465d-8bd9-433894f0c9dc",
        value:
          "Preferiresti essere un supereroe con il potere del superudito o con il potere della supervista?",
      },
      {
        _id: "dbddb074-b194-4442-98e7-93e1c1310afd",
        value:
          "Preferiresti essere un supereroe con il potere della super intelligenza o con quello della telepatia?",
      },
      {
        _id: "36bdaf56-0b5e-46f9-8460-02f4b9fba25f",
        value:
          "Preferiresti essere un supereroe con il potere della supervelocità o della superforza?",
      },
      {
        _id: "4c0d9331-1385-4ad4-8ce0-da7d02e1ca33",
        value:
          "Preferiresti essere un supereroe con il potere della superforza o della supervelocità?",
      },
      {
        _id: "1457340e-f70a-44cb-814a-d266b9baedf4",
        value:
          "Preferiresti essere un supereroe con il potere del teletrasporto o con quello della telecinesi?",
      },
      {
        _id: "8075e394-1ec5-4980-96b2-0bf0a445e3e3",
        value:
          "Preferiresti poter respirare sott'acqua o camminare sulla lava?",
      },
      {
        _id: "a3eab416-06a6-4b7c-840a-94c9a949eeac",
        value:
          "Preferiresti essere in grado di controllare gli animali (ma non gli esseri umani) con la tua mente o di controllare l'elettronica con la tua mente?",
      },
      {
        _id: "bb6a50d9-a15c-4a19-91f1-8ae98754aa07",
        value:
          "Preferiresti essere in grado di schivare qualsiasi cosa, indipendentemente dalla velocità con cui si muove, o poter fare tre domande qualsiasi e ricevere una risposta precisa?",
      },
      {
        _id: "39df7f29-11af-4d80-bd78-2a4c6b43883b",
        value: "Preferiresti poter volare o essere invisibile?",
      },
      {
        _id: "315b968c-673d-4786-a682-79c98b67921a",
        value:
          "Preferiresti poter andare gratis in qualsiasi parco a tema del mondo per il resto della tua vita o mangiare gratis in qualsiasi ristorante drive-through per il resto della tua vita?",
      },
      {
        _id: "1dd112ce-228c-4c36-b37c-e1db347aff1a",
        value:
          "Preferiresti essere in grado di vedere 10 minuti nel tuo futuro o 10 minuti nel futuro di chiunque altro?",
      },
      {
        _id: "30b56ae8-cb83-44c6-8ac8-42f54e17af53",
        value:
          "Preferiresti poter rallentare il tempo del 10% o saltare tre volte più in alto di adesso?",
      },
      {
        _id: "f5554194-dc91-4134-a51b-8c75dd25a5a9",
        value:
          "Preferiresti essere in grado di leggere velocemente o di parlare a una velocità incredibile?",
      },
      {
        _id: "cb9d6a35-e056-4d16-8882-4050ff307e33",
        value:
          "Preferiresti essere in grado di teletrasportarti ovunque o di leggere nel pensiero?",
      },
      {
        _id: "577e8c33-7b77-422b-aa8a-0755265bd143",
        value: "Preferiresti poterti teletrasportare o viaggiare nel tempo?",
      },
      {
        _id: "2bee21c0-57b9-48a4-9492-e6f1790d6398",
        value:
          "Preferiresti essere un pittore straordinario o un brillante matematico?",
      },
      {
        _id: "2a12d734-36cc-4ffe-b394-e6922b7b6cb3",
        value:
          "Preferiresti essere un personaggio poco importante nell'ultimo film che hai visto o un personaggio poco importante nell'ultimo libro che hai letto?",
      },
      {
        _id: "8b65ecc2-1f3a-4c72-b4e8-bdb7ee972346",
        value:
          "Preferiresti essere un centauro al contrario o una sirena/uomo al contrario?",
      },
      {
        _id: "776bc842-0cd5-485b-9d28-b25b9de1d0e2",
        value:
          "Preferiresti rinascere nello stesso paese o in un altro a tua scelta?",
      },
      {
        _id: "5e737bb1-d069-48c4-8ce2-2d1fb2749c51",
        value: "Preferiresti essere ricoperto di pelliccia o di squame?",
      },
      {
        _id: "a84108ae-400d-4447-b9e7-4c217c2a3546",
        value:
          "Preferiresti essere famoso quando sei vivo e dimenticato quando muori o sconosciuto quando sei vivo ma famoso dopo la morte?",
      },
      {
        _id: "5fc69cd2-aaaf-4ca4-8b86-98f731583ec7",
        value:
          "Preferiresti essere fantastico nell'andare a cavallo o fantastico nel guidare le moto da cross?",
      },
      {
        _id: "674ed6d5-fdd6-4036-ad9b-473dcd2578c8",
        value: "Preferisci essere temuto da tutti o amato da tutti?",
      },
      {
        _id: "12c10a5f-a0b0-4f71-8fcb-bc9007cefc42",
        value:
          "Preferiresti parlare correntemente in legalese o correntemente in francese?",
      },
      {
        _id: "7eb7f55c-5280-4823-8541-24d2845bda38",
        value:
          "Preferiresti essere costretto a mangiare solo cibo piccante o solo cibo incredibilmente insipido?",
      },
      {
        _id: "42f738dd-b144-4b20-9a8c-1098f8d88846",
        value:
          "Preferiresti essere costretto a parlare con un unico accento diverso non scelto da te per sempre o parlare con un accento diverso a caso ogni volta che ti svegli per un anno?",
      },
      {
        _id: "26acd127-0321-420e-a7e3-024a3d069a52",
        value:
          "Preferiresti ricevere un PC da gioco di alto livello o un computer Apple di alto livello? Entrambi hanno lo stesso prezzo.",
      },
      {
        _id: "5c146703-7d0c-4bb7-bf1e-5cb918a7b123",
        value:
          "Preferiresti essere insultato da Gordon Ramsay per 10 secondi o ricevere messaggi illimitati da Donald Trump per 10 giorni?",
      },
      {
        _id: "24606972-7bca-4829-9ec3-66d714d3b324",
        value:
          "Preferiresti essere chiuso in una stanza costantemente buia per una settimana o in una stanza costantemente luminosa per una settimana?",
      },
      {
        _id: "b0b6b291-ea4d-48e1-91ac-e728f4c86896",
        value:
          "Preferiresti essere perso nei boschi di una montagna per un anno o bloccato su un'isola tropicale per un anno?",
      },
      {
        _id: "a337899b-0e7e-4927-9d55-606e8c94a0a9",
        value:
          "Preferiresti essere sposato con un 10 con una pessima personalità o con un 6 con una personalità straordinaria?",
      },
      {
        _id: "28de312d-c891-4e47-b35a-1e9bcd6192a6",
        value:
          "Preferiresti essere povero e fare un lavoro che ami o ricco e fare un lavoro che odi?",
      },
      {
        _id: "499af6fb-4681-4d6e-bd61-84a8eb6d3cf9",
        value:
          "Preferiresti essere rinchiuso in un carcere federale di massima sicurezza con i criminali più duri per un anno o in un carcere relativamente rilassato dove sono detenuti i tipi di Wall Street per dieci anni?",
      },
      {
        _id: "8d5a0ec5-66f5-4a21-a257-edeaea16d594",
        value:
          "Preferiresti essere colpito in faccia da un pesce o essere preso a pernacchie?",
      },
      {
        _id: "dd5dffde-f5d5-49c4-a4ff-5f6df840a1ff",
        value:
          "Preferiresti avere così tanta paura delle altezze da non poter andare al secondo piano di un edificio o avere così tanta paura del sole da poter uscire di casa solo nei giorni di pioggia?",
      },
      {
        _id: "a771a66c-842a-49b0-ae47-d94ad258af10",
        value: "Preferiresti essere la migliore attrice o cantante del mondo?",
      },
      {
        _id: "b34138b1-a19f-4546-9029-8afb7235d89c",
        value:
          "Preferiresti essere trasportato per sempre 500 anni nel futuro o 500 anni nel passato?",
      },
      {
        _id: "c8acfcde-40b4-4a02-8d15-50265eb92f50",
        value:
          "Preferiresti diventare due volte più forte quando hai entrambe le dita nelle orecchie o strisciare due volte più velocemente di quanto riesci a correre?",
      },
      {
        _id: "8394f683-1bd5-46e1-8dfe-e98306ddb1a5",
        value:
          "Preferiresti sbattere le palpebre al doppio della velocità normale o non poterle sbattere per 5 minuti e doverle chiudere per 10 secondi ogni 5 minuti?",
      },
      {
        _id: "3fe03d8b-7394-4e42-9501-48ba01a9cd50",
        value:
          "Preferiresti fare qualcosa che ami e guadagnare quanto basta per tirare avanti o fare qualcosa che odi ma guadagnare miliardi di dollari?",
      },
      {
        _id: "d209a892-adc6-4217-9b5d-dc15c65196a9",
        value: "Preferiresti mangiare un piccione morto o una colomba morta?",
      },
      {
        _id: "b1e51e9a-9bfb-43bb-aca0-88da107ba5e8",
        value:
          "Preferisci mangiare un panino al ketchup o un panino alla Siracha?",
      },
      {
        _id: "e733ba9a-4fa9-46a3-960e-e843e8278f43",
        value: "Preferiresti mangiare un verme vivo o un verme morto?",
      },
      {
        _id: "8ecfbfae-ad4d-442f-951e-8c1dd06e3750",
        value:
          "Preferiresti mangiare un uovo con dentro un pollo mezzo formato o mangiare dieci cavallette cotte?",
      },
      {
        _id: "2230e59f-80e1-43c6-876a-e3671dfff2f6",
        value:
          "Preferiresti che ogni camicia che indossi fosse un po' pruriginosa o che potessi usare solo carta igienica a 1 velo?",
      },
      {
        _id: "dd5d6288-a2f4-4bff-a833-9ae6c0e5234d",
        value:
          "Preferiresti che ogni terzo pensiero che hai fosse ad alta voce o che non fossi mai solo, qualunque cosa tu stia facendo?",
      },
      {
        _id: "0a04c1a7-0bc6-4974-8079-73ce7ec58e09",
        value:
          "Preferiresti che tutti ascoltassero musica e podcast senza cuffie o che tutti fossero irragionevolmente orgogliosi della loro flatulenza e del loro odore corporeo?",
      },
      {
        _id: "6c696131-6a76-46d4-84c8-66abb22d794a",
        value:
          "Preferiresti che tutto ciò che sogni ogni notte si avverasse al tuo risveglio o che tutto ciò che una persona scelta a caso sogna ogni notte si avverasse al suo risveglio?",
      },
      {
        _id: "2dbfae8a-6364-4881-986a-a10777360bf7",
        value:
          "Preferiresti lottare per una causa in cui credi, ma che dubiti possa avere successo, o lottare per una causa in cui credi solo in parte, ma che ha un'alta probabilità di successo?",
      },
      {
        _id: "85f328c1-f7c0-465d-94a9-ab3522ce8460",
        value:
          "Preferiresti trovare il vero amore per un anno o vivere una relazione stantia per 100 anni?",
      },
      {
        _id: "8f85a289-6ec9-4632-9bed-a732e4b9beff",
        value:
          "Preferiresti ricevere una valigia con 10.000 dollari o una valigia con il 50/50 di possibilità di avere 1.000 o 50.000 dollari?",
      },
      {
        _id: "bfe7cdd3-bd29-4894-9b90-bb898ef5dc15",
        value:
          "Preferiresti avere un biglietto aereo internazionale di andata e ritorno gratuito ogni anno o poter volare gratis in qualsiasi momento sul territorio nazionale?",
      },
      {
        _id: "ca7329bb-ce05-45db-b589-eed6e8cfd7c6",
        value:
          "Preferiresti farti estrarre il dente del giudizio o farti fare un piercing alle chiappe?",
      },
      {
        _id: "c4fb5cac-1988-4623-9450-124b653cb0e8",
        value:
          "Preferiresti rinunciare a tutte le bevande, tranne l'acqua, o rinunciare a mangiare qualsiasi cosa sia stata cotta in un forno?",
      },
      {
        _id: "8e02d10e-0186-4420-903c-ef261a8b687b",
        value:
          "Preferiresti tornare all'età di 5 anni con tutto quello che sai ora o sapere ora tutto quello che imparerà il tuo futuro?",
      },
      {
        _id: "364daab4-dc3c-4f66-b5ce-f88a10e9c8a4",
        value:
          "Preferiresti andare nel passato e incontrare i tuoi antenati o andare nel futuro e incontrare i tuoi trisnipoti?",
      },
      {
        _id: "ec904555-a20a-4a08-98c1-f18963ba089a",
        value:
          "Preferisci andare in un bar, in un club, a una festa in casa per divertirti o rimanere a casa per una tranquilla cena in TV?",
      },
      {
        _id: "087ca6f5-8fbf-46c8-828f-a8e83eff10a5",
        value:
          "Preferiresti andare in prigione per 4 anni per qualcosa che non hai fatto o farla franca per qualcosa di orribile che hai fatto ma vivere sempre nella paura di essere scoperto?",
      },
      {
        _id: "a3579187-9604-4034-a8cc-e4a02cb46dea",
        value:
          "Preferiresti avere una scatola di Lego senza fondo o un serbatoio di benzina senza fondo?",
      },
      {
        _id: "9fb93064-bd2c-4a17-be01-23f7fd8c2f19",
        value:
          "Preferiresti avere una casa completamente automatizzata o un'auto a guida autonoma?",
      },
      {
        _id: "6e896109-92cb-4093-a1da-4bfb302153b6",
        value:
          "Preferiresti avere un sistema di giustizia penale che funzioni davvero e sia equo o un ramo amministrativo privo di corruzione?",
      },
      {
        _id: "66249bbd-7159-4d96-970f-faa14d92e37c",
        value:
          "Preferiresti avere un'orribile memoria a breve termine o un'orribile memoria a lungo termine?",
      },
      {
        _id: "dacbd63a-6a33-4316-8091-0ce3166e67fb",
        value: "Preferiresti avere una coda di cavallo o un corno di unicorno?",
      },
      {
        _id: "b0005e4b-2e2b-41f2-99f3-4052dbf04214",
        value: "Preferiresti avere un giardino magico o una foresta magica?",
      },
      {
        _id: "f95d4c48-7dfb-4201-9cc1-679818927fd6",
        value: "Preferiresti avere una villa o uno yacht?",
      },
      {
        _id: "c6015f1a-ccbe-4ba4-881c-77778042e91c",
        value:
          "Preferiresti avere una mappa che ti mostra la posizione di qualsiasi cosa tu voglia trovare e che può essere utilizzata più volte, ma con un margine di errore fino a cinque miglia, oppure un dispositivo che ti permette di trovare la posizione di qualsiasi cosa tu voglia con una precisione incredibile, ma che può essere utilizzato solo tre volte?",
      },
      {
        _id: "f02e1cca-43fd-49d6-a0d1-1bf797f4f0d0",
        value:
          "Preferiresti avere un nuovo paio di scarpe costose o un paio di occhiali da sole costosi?",
      },
      {
        _id: "d10b3870-f99b-42bb-b5be-f645b04ae7dd",
        value:
          "Preferiresti avere una bicicletta da un centesimo o un monociclo come unica forma di trasporto oltre a camminare?",
      },
      {
        _id: "8e020daf-15b8-4077-bfe4-f92d2419826e",
        value: "Preferiresti avere un orso domestico o un lupo domestico?",
      },
      {
        _id: "84533fde-795e-41c5-9cff-34145c5e4b7f",
        value: "Preferiresti avere un gatto o un cane da compagnia?",
      },
      {
        _id: "b1c71f63-6907-4d51-823f-0e68fd9ccb52",
        value: "Preferiresti avere un cervo o un alce da compagnia?",
      },
      {
        _id: "9a3becca-1467-4669-9640-219126b53d69",
        value:
          "Preferiresti avere un dinosauro da compagnia o uno pterodattilo da compagnia?",
      },
      {
        _id: "5e2e2021-2b05-42ca-80ac-ac3915db9725",
        value:
          "Preferiresti avere un drago da compagnia o un unicorno da compagnia?",
      },
      {
        _id: "8ec786e6-882a-4d3f-bab0-b80f4deb5a90",
        value: "Preferiresti avere una libellula o una farfalla da compagnia?",
      },
      {
        _id: "6e043afb-bf8e-47d6-a130-ad9080224482",
        value:
          "Preferiresti avere un elefante da compagnia o una giraffa da compagnia?",
      },
      {
        _id: "3f686199-ef98-4ef7-81f3-549b25c9b8d7",
        value: "Preferiresti avere un furetto o un riccio da compagnia?",
      },
      {
        _id: "41d449dd-8d66-4665-81c9-8c661818cf2f",
        value:
          "Preferiresti avere un pesce da compagnia o una tartaruga da compagnia?",
      },
      {
        _id: "a20fc6f5-98e7-4cfa-9b7e-618decfb7cc5",
        value: "Preferiresti avere un fenicottero o un pavone da compagnia?",
      },
      {
        _id: "4072c409-ef01-4233-a937-c16343d69cfe",
        value:
          "Preferiresti avere un'oca da compagnia o un'anatra da compagnia?",
      },
      {
        _id: "d2b4c18b-4ebf-4c51-ba62-d9f31dfd6a72",
        value: "Preferiresti avere un cavallo o una mucca da compagnia?",
      },
      {
        _id: "c64e88b6-76af-426b-b00f-0fc661c5f62e",
        value: "Preferiresti avere un canguro o un koala da compagnia?",
      },
      {
        _id: "ef944863-85ec-4e71-b066-443c1c8192ae",
        value: "Preferiresti avere un leone o una tigre da compagnia?",
      },
      {
        _id: "bd88b77c-3a56-42c0-9673-cfdc907c1483",
        value: "Preferiresti avere una scimmia o un pappagallo da compagnia?",
      },
      {
        _id: "95231326-988e-4411-88a1-92d3624e267a",
        value: "Preferiresti avere una lontra o un castoro da compagnia?",
      },
      {
        _id: "50eb4471-b1ea-413c-8a4a-d61b5fb77d15",
        value:
          "Preferiresti avere un gufo da compagnia o un falco da compagnia?",
      },
      {
        _id: "eb05f050-ac75-42d0-bb4f-1aee0b0dc624",
        value:
          "Preferiresti avere un pappagallo da compagnia o un'ara da compagnia?",
      },
      {
        _id: "115bc538-6fbc-49b5-8af5-0f3ad9cb5118",
        value:
          "Preferiresti avere un pinguino da compagnia o una foca da compagnia?",
      },
      {
        _id: "242c067b-2870-4771-98fe-e85490a6c066",
        value:
          "Preferiresti avere un coniglio domestico o un criceto domestico?",
      },
      {
        _id: "8056bc6e-875b-4959-bdc8-529f7c6ee13e",
        value:
          "Preferiresti avere uno squalo da compagnia o un delfino da compagnia?",
      },
      {
        _id: "69948adc-d00f-401c-a3a7-f723cadf4ef4",
        value:
          "Preferiresti avere una puzzola che ti spruzza una volta al mese o un porcospino che ti punge una volta al mese?",
      },
      {
        _id: "2ecba7bd-a363-4e90-9391-d90fb69856c2",
        value: "Preferiresti avere un serpente o una lucertola da compagnia?",
      },
      {
        _id: "c723d3d0-3968-44ae-9cbc-6e41b7216b08",
        value: "Preferiresti avere un serpente o un ragno da compagnia?",
      },
      {
        _id: "27ca37d3-7404-4091-bc1c-553e673d74c3",
        value:
          "Preferiresti avere uno scoiattolo domestico o uno scoiattolo domestico?",
      },
      {
        _id: "0e3e6930-1d38-4886-8053-6b4c55c7ff19",
        value:
          "Preferiresti avere un superpotere in grado di controllare il fuoco o l'acqua?",
      },
      {
        _id: "957b5cd4-1266-468d-9d8f-27260d266b98",
        value:
          "Preferiresti avere un superpotere di superforza o di supervelocità?",
      },
      {
        _id: "fc6988df-57c8-421f-a0cc-f8bdc359cd42",
        value:
          "Preferiresti che tutti i cani cercassero di attaccarti quando ti vedono o che tutti gli uccelli cercassero di attaccarti quando ti vedono?",
      },
      {
        _id: "1d184758-fc04-4632-8e18-46aa62d90f80",
        value:
          "Preferiresti che tutti i semafori a cui ti avvicini fossero verdi o che non dovessi mai più fare la fila?",
      },
      {
        _id: "62bb658a-6e44-45c1-a811-1ac039804ba1",
        value:
          "Preferiresti che tutti i tuoi vestiti calzassero alla perfezione o avere il cuscino, le coperte e le lenzuola più comode che esistano?",
      },
      {
        _id: "6837ba08-d1b0-4bf8-9a30-5daba3d04ec4",
        value: "Preferiresti avere un dito in più o un dito in più?",
      },
      {
        _id: "27cc722a-0518-490c-855b-0ab4838312cc",
        value:
          "Preferiresti avere un naso dalla forma strana o delle orecchie dalla forma strana?",
      },
      {
        _id: "50018ee9-f1d2-4f50-8a46-69bb607dc41a",
        value:
          "Preferiresti avere labbra screpolate che non guariscono mai o una terribile forfora che non può essere curata?",
      },
      {
        _id: "4b61d20c-a78f-4b92-a2ff-b4f6359ac575",
        value:
          "Preferiresti avere capelli di spaghetti commestibili che ricrescono ogni notte o sudore (non dolce) di sciroppo d'acero?",
      },
      {
        _id: "fe32c2ac-0778-4806-a557-a7c15ac824f1",
        value:
          "Preferiresti che tutto quello che c'è sul tuo telefono in questo momento (cronologia di navigazione, foto, ecc.) fosse reso pubblico a chiunque cerchi il tuo nome o non usare mai più un telefono cellulare?",
      },
      {
        _id: "84f1b5a9-2afe-46a1-a615-dd8bf94b08e8",
        value:
          "Preferiresti che tutto ciò che mangi fosse troppo salato o che non fosse abbastanza salato, indipendentemente dalla quantità di sale che aggiungi?",
      },
      {
        _id: "4239f089-6e5d-4ce1-85c7-3e7285754b93",
        value: "Preferisci avere buoni voti o essere bravo nello sport?",
      },
      {
        _id: "37b45dae-4bea-43bd-a74f-0bcc9a01ace1",
        value:
          "Preferiresti avere una visione a infrarossi che puoi attivare/disattivare a piacimento o una visione telescopica 20x normale?",
      },
      {
        _id: "82059161-4743-41e3-9eeb-c4d01d143dac",
        value:
          "Preferiresti avere peli del corpo fuori controllo o un odore corporeo forte e pungente?",
      },
      {
        _id: "7704873c-78a6-496a-8826-efc9f9bcbc00",
        value:
          "Preferiresti avere una pelle che cambia colore in base alle tue emozioni o dei tatuaggi che appaiono su tutto il corpo e che raffigurano ciò che hai fatto ieri?",
      },
      {
        _id: "37e5bc5e-f1b4-4569-b4d2-218ff77c5c93",
        value:
          "Preferiresti che qualcuno si spacciasse per te e facesse cose davvero straordinarie di cui ti prendi il merito o che trovassi ogni giorno dei soldi nascosti in posti strani in tutta la tua casa, senza riuscire a capire da dove provengano o come facciano ad arrivare lì?",
      },
      {
        _id: "d969903a-4839-44b3-8233-3b2fc951da69",
        value:
          "Preferiresti avere la capacità di comunicare con gli animali o la capacità di parlare fluentemente qualsiasi lingua?",
      },
      {
        _id: "b5efa876-27e4-4d89-9819-ae3db9f152e9",
        value:
          "Preferiresti avere la capacità di diventare invisibile o quella di diventare intangibile?",
      },
      {
        _id: "6c142a56-3615-4bca-bec7-76e0e58c8973",
        value:
          "Preferiresti avere l'olfatto di un cane o vedere più colori nello spettro elettromagnetico come una mantide?",
      },
      {
        _id: "47e77ded-eb13-4301-a363-0590f5343140",
        value:
          "Preferiresti che l'unica bevanda che puoi bere sia l'acqua o che l'unico cibo che puoi mangiare sia un'insalata?",
      },
      {
        _id: "c012addb-9a70-49b6-a6b3-d52b1f29d030",
        value:
          "Preferiresti avere il potere di controllare la natura o il potere di controllare il tempo?",
      },
      {
        _id: "92cd6bbe-891b-403b-958b-5e995119b1c9",
        value:
          "Preferiresti avere il potere di creare qualsiasi cosa con la tua immaginazione o il potere di dare vita a oggetti inanimati?",
      },
      {
        _id: "f5266837-ef68-4441-b441-5fd9c6294286",
        value:
          "Preferiresti avere il potere di parlare con i morti o quello di parlare con gli animali?",
      },
      {
        _id: "9a8d967e-62a3-4b13-858b-f68afc6c1c37",
        value:
          "Preferiresti dover mangiare un barattolo di marmellata al giorno per 10 anni o non poter più mangiare pane per 20 anni?",
      },
      {
        _id: "eccc1b3f-4462-4e38-b5ee-da89a9c613a2",
        value:
          "Preferiresti dover leggere ad alta voce ogni parola che leggi o cantare tutto ciò che dici ad alta voce?",
      },
      {
        _id: "4fc26613-7799-466e-a44b-1e8a67feefcd",
        value:
          "Preferiresti avere a disposizione quantità illimitate di qualsiasi materiale per costruire una casa, ma doverla costruire da solo, oppure affidare a un famoso architetto la progettazione e la costruzione di una casa modesta?",
      },
      {
        _id: "32ba64c6-3ad0-4cd1-8206-c7b83e103d15",
        value:
          "Preferisci che qualsiasi cosa tu stia pensando appaia sopra la tua testa perché tutti la vedano o che tutto ciò che fai venga trasmesso in diretta streaming perché tutti lo vedano?",
      },
      {
        _id: "8d781015-9780-403e-8455-5e839119be85",
        value:
          "Preferiresti avere la casa completamente rivestita di moquette o completamente piastrellata?",
      },
      {
        _id: "adc79434-da7b-4aaf-975e-26a66571ef1f",
        value:
          "Preferiresti ereditare 20 milioni di dollari al compimento dei 18 anni o passare il tempo a guadagnarne 50 con il tuo duro lavoro?",
      },
      {
        _id: "08a0054c-9bed-47c2-9c9f-6d8255dc2b91",
        value:
          "Preferiresti che fosse impossibile svegliarti per 11 ore di fila ogni giorno, ma che ti svegliassi sentendoti benissimo, oppure che ti svegliassi normalmente ma non ti sentissi mai completamente riposato?",
      },
      {
        _id: "fa5e5560-0740-44ed-848e-1ac6c47672ee",
        value: "Preferisci che piovano marshmallow o birilli?",
      },
      {
        _id: "35ec80a4-990b-407e-8a1f-4621f1ba6139",
        value:
          "Preferiresti sapere quanto sei al di sopra o al di sotto della media in tutto o sapere quanto le persone sono al di sopra o al di sotto della media in un'abilità/talento solo guardandole?",
      },
      {
        _id: "47a00f8b-0ee8-4ced-aefa-ad51fe41d441",
        value:
          "Preferisci conoscere i segreti del mondo o vivere nell'ignoranza per sempre?",
      },
      {
        _id: "21f1bda2-d18e-47d0-88ed-305add107940",
        value:
          "Preferiresti sapere quando morirai o come morirai? (Non puoi cambiare l'ora o il metodo della tua morte).",
      },
      {
        _id: "91c5ee06-33fe-42ef-9c44-b7863c83ac85",
        value: "Preferiresti vivere a New York o a Londra?",
      },
      {
        _id: "2db5a59a-bfc9-4020-9921-30273d23b9b4",
        value: "Preferiresti vivere in una grotta o in una casa sull'albero?",
      },
      {
        _id: "239f3706-59b2-49c1-9232-ec1b12fde94f",
        value:
          "Preferiresti vivere in un paese con più regole e aspettative sociali, più sicuro e organizzato, o in un paese con meno regole e aspettative sociali, più pericoloso e caotico?",
      },
      {
        _id: "df03328f-3a36-4169-8ce8-fbb67da30c3e",
        value:
          "Preferiresti vivere in una casa incredibilmente unica e bella ma semplice all'interno o in una casa incredibilmente unica e bella all'interno ma semplice all'esterno?",
      },
      {
        _id: "ab88fd33-2177-498c-ac56-7a6e1fb9f243",
        value:
          "Preferiresti vivere in una casa con pareti trasparenti in città o nella stessa casa trasparente ma nel mezzo di una foresta lontana dalla civiltà?",
      },
      {
        _id: "877fe692-4caf-4102-8377-dfd1baf77efd",
        value:
          "Preferiresti vivere in una bella casa in una città noiosa o in una casa malfamata in una città eccitante?",
      },
      {
        _id: "cd2c9478-e52c-467a-9a6f-54e8a33127a6",
        value:
          "Preferiresti vivere in una vera casa stregata o nel bel mezzo di un dolce?",
      },
      {
        _id: "d293e121-ba8e-4eb8-ab65-dab8071b695d",
        value: "Preferiresti vivere in una casa sull'albero o in un castello?",
      },
      {
        _id: "d80ad7e4-3179-47eb-86ff-b9407e972a11",
        value:
          "Preferiresti vivere in un'utopia come persona normale o in una distopia in cui sei il sovrano supremo?",
      },
      {
        _id: "072bd7e3-ba05-4a10-ab78-89da223142cc",
        value:
          "Preferiresti vivere in un mondo di curve morbide senza angoli acuti o in un mondo di soli angoli acuti e nessuna curva? Supponendo che gli esseri umani mantengano la forma attuale.",
      },
      {
        _id: "d649d7ec-a419-46cd-a289-67c660650cdb",
        value:
          "Preferiresti vivere in un mondo in cui tutti fossero sempre onesti o in un mondo in cui tutti fossero sempre gentili?",
      },
      {
        _id: "df3a264c-844e-49a5-a5f4-9ec5b5835ba4",
        value:
          "Preferiresti vivere in un mondo in cui tutto è sempre prevedibile o in un mondo in cui tutto può accadere?",
      },
      {
        _id: "c4c03c9e-e16d-459b-b77f-868607acbea4",
        value:
          "Preferiresti vivere in un mondo in cui puoi avere qualsiasi lavoro tu voglia o in un mondo in cui puoi vivere ovunque tu voglia?",
      },
      {
        _id: "a930bd25-cfea-4ba8-8734-20cdb001d8a9",
        value:
          "Preferiresti vivere in un mondo in cui puoi vedere il futuro o in un mondo in cui puoi viaggiare indietro nel tempo?",
      },
      {
        _id: "e2142a84-4d86-44bd-b861-ab9acb3b2f69",
        value:
          "Preferiresti vivere in un mondo con istruzione gratuita per tutti o con assistenza sanitaria gratuita per tutti?",
      },
      {
        _id: "41fa0cd5-868a-4f36-8789-f2cd36920952",
        value:
          "Preferiresti vivere in un mondo con la magia o in un mondo con la tecnologia avanzata?",
      },
      {
        _id: "2427611f-bad0-450b-94d1-e6127eced307",
        value:
          "Preferiresti vivere in un mondo senza dolore o in un mondo senza paura?",
      },
      {
        _id: "3ae70ed3-2716-4101-b09a-2cfb5969602f",
        value:
          "Preferiresti vivere in un mondo senza segreti o in un mondo senza bugie?",
      },
      {
        _id: "4d984cda-630e-4414-828a-ff6a6095d3f4",
        value:
          "Preferiresti vivere in un mondo senza guerre o in un mondo senza povertà?",
      },
      {
        _id: "c521ff94-c293-41aa-949b-82aec3a2b187",
        value:
          "Preferiresti vivere in un mondo in cui i robot fanno tutti i lavori o in un mondo senza alcuna tecnologia?",
      },
      {
        _id: "4c616d08-5578-4390-b0fe-b1b762f607dd",
        value:
          "Preferiresti vivere in un mondo con i robot o in un mondo con gli alieni?",
      },
      {
        _id: "c8afa70f-df04-4741-8e6e-16c5ea57a3fe",
        value:
          "Preferiresti vivere in un mondo con cibo illimitato o con acqua pulita illimitata?",
      },
      {
        _id: "f5d4e5b1-131c-45c8-a42e-da4126bfa7ad",
        value: "Preferiresti vivere in un mondo con cibo o acqua illimitati?",
      },
      {
        _id: "e64c3652-9085-47d2-8fc5-2c54979342be",
        value:
          "Preferiresti vivere in un mondo con felicità illimitata o con conoscenza illimitata?",
      },
      {
        _id: "f9d7ac97-7bc4-4739-a42c-420131062592",
        value: "Preferiresti vivere in un mondo con denaro o tempo illimitati?",
      },
      {
        _id: "774e214f-04af-4cb4-a872-0e7f3faa2a7b",
        value:
          "Preferiresti vivere in un mondo senza libri o in un mondo senza musica?",
      },
      {
        _id: "2d145297-0856-46ef-b466-a8d2c8025395",
        value:
          "Preferiresti vivere in un mondo senza auto o in un mondo senza aerei?",
      },
      {
        _id: "cfb84d2c-bab7-4632-a7f6-e77c5cd831f8",
        value:
          "Preferiresti vivere in un mondo senza auto o in un mondo senza treni?",
      },
      {
        _id: "19189d28-2a7e-4711-9aca-473a92619524",
        value:
          "Preferiresti vivere in un mondo senza cioccolato o in un mondo senza gelato?",
      },
      {
        _id: "c6e5d0be-215d-41f5-87f0-ab5bf18631c2",
        value:
          "Preferiresti vivere in un mondo senza elettricità o in un mondo senza gas e petrolio?",
      },
      {
        _id: "4376142f-e5d7-4f7d-a578-b9bf1300f443",
        value:
          "Preferiresti vivere in un mondo senza internet o in un mondo senza elettricità?",
      },
      {
        _id: "c3b1d28e-e282-4238-bc47-3cb634ea3c08",
        value:
          "Preferiresti vivere in un mondo senza carne o in un mondo senza zucchero?",
      },
      {
        _id: "e800ef8c-1362-4ca8-9846-bbccce47f793",
        value:
          "Preferiresti vivere in un mondo senza soldi o in un mondo senza leggi?",
      },
      {
        _id: "c9ce9766-191b-42af-80b0-ce56077976f4",
        value:
          "Preferiresti vivere in un mondo senza musica o in un mondo senza film?",
      },
      {
        _id: "03599964-82e7-4759-ba5f-472ff98538f1",
        value:
          "Preferiresti vivere in un mondo senza dolore o in un mondo senza tristezza?",
      },
      {
        _id: "859c4b5d-994b-4518-9111-f3f55ed04a7a",
        value:
          "Preferiresti vivere in un mondo senza telefoni o in un mondo senza TV?",
      },
      {
        _id: "45727d7c-cf62-4b10-9887-d726bc6fabee",
        value:
          "Preferiresti vivere in un mondo senza pizza o in un mondo senza hamburger?",
      },
      {
        _id: "83d860b6-9787-4c5b-9df4-041313420b5d",
        value:
          "Preferiresti vivere in un mondo senza inquinamento o in un mondo senza criminalità?",
      },
      {
        _id: "a2f9c842-fc91-4715-93c3-751f16eab929",
        value:
          "Preferiresti vivere in un mondo senza social media o in un mondo senza email?",
      },
      {
        _id: "e2d0aea5-991f-4aec-8b93-7d75a9b8438b",
        value:
          "Preferiresti vivere in un mondo senza tecnologia o in un mondo senza libri?",
      },
      {
        _id: "bf60e8db-cabf-44c0-8399-6264fe699a02",
        value:
          "Preferiresti vivere in un mondo senza traffico o in un mondo senza code?",
      },
      {
        _id: "68ed6b03-42a9-4adb-8a64-1295136b94a0",
        value:
          "Preferiresti vivere in un mondo senza traffico o in un mondo senza inquinamento?",
      },
      {
        _id: "2551b5db-4711-4203-aee9-dd32cd209a0a",
        value:
          "Preferiresti vivere in un mondo senza armi o in un mondo senza carceri?",
      },
      {
        _id: "dc9d8a87-3e34-45c2-939e-1d014df52e2d",
        value:
          "Preferiresti vivere in un mondo senza inverno o in un mondo senza estate?",
      },
      {
        _id: "edc8310b-8845-4e22-a3d2-8047183df01a",
        value:
          "Preferiresti vivere nella natura selvaggia lontano dalla civiltà senza alcun contatto umano o vivere per le strade di una città come un senzatetto?",
      },
      {
        _id: "e5420b7c-c95e-4328-b132-3a408ac2e4b1",
        value:
          "Preferiresti vivere fino a 200 anni ma avere l'aspetto di chi ne ha 200 per tutto il tempo anche se sei in salute o avere l'aspetto di chi ne ha 25 fino alla morte a 65 anni?",
      },
      {
        _id: "d07003c5-ec8b-435d-a11e-502b3f9afc21",
        value:
          "Preferiresti vivere senza acqua calda per docce/bagni o senza lavatrice?",
      },
      {
        _id: "491f069a-1550-4c4b-8754-93753c9b2357",
        value:
          "Preferiresti vivere tutta la tua vita in una realtà virtuale dove tutti i tuoi desideri vengono esauditi o nel normale mondo reale?",
      },
      {
        _id: "cf89607d-f17d-4e66-9d1f-9a0312aa3fa6",
        value:
          "Preferiresti perdere tutti i soldi che hai guadagnato quest'anno o perdere tutti i ricordi che hai acquisito quest'anno?",
      },
      {
        _id: "8a06547a-182f-47e0-8b9b-c850a68060b8",
        value:
          "Preferiresti perdere tutti i tuoi soldi e i tuoi oggetti di valore o tutte le foto che hai scattato?",
      },
      {
        _id: "7c7702e5-e56b-4361-8529-7ea4b35ea1eb",
        value:
          "Preferiresti perdere i tre beni che ti sono più cari o perdere tutto il resto tranne quei tre beni?",
      },
      {
        _id: "4e87f17b-fb2c-4034-b07b-65af7684c288",
        value:
          "Preferiresti padroneggiare uno strumento musicale o avere una memoria fotografica?",
      },
      {
        _id: "6f1f27ba-68d1-4e02-b92a-6c700ecc0c85",
        value: "Preferiresti non poter più bere acqua o poterla bere soltanto?",
      },
      {
        _id: "091f935f-a806-49f7-b8a7-bf0512dd660a",
        value:
          "Preferiresti non poter mai mangiare carne o non poter mai mangiare verdure?",
      },
      {
        _id: "c5010b3b-e0a9-41e4-8caf-872a0ae71b15",
        value:
          "Preferiresti non tagliarti mai più con la carta o non incastrare mai più qualcosa tra i denti?",
      },
      {
        _id: "ee78bcd5-f82c-4a35-aa88-a43427bce68f",
        value: "Preferiresti non arrabbiarti mai o non essere mai invidioso?",
      },
      {
        _id: "ce9c57e7-25b4-4b96-842a-3b096016f443",
        value:
          "Preferiresti non dover più pulire il bagno o non dover più lavare i piatti?",
      },
      {
        _id: "ef802fc2-020f-4ebd-a483-64115c4f4f23",
        value:
          "Preferiresti non dover mai più lavorare o non dover mai più dormire (non ti sentirai stanco e non avrai effetti negativi sulla salute)?",
      },
      {
        _id: "e1f0f57f-7cb7-448c-8aad-8bce81d2a088",
        value:
          "Preferiresti non poter aprire nessuna porta chiusa (bloccata o non bloccata) o non poter chiudere nessuna porta aperta?",
      },
      {
        _id: "d1540504-3d56-48b7-8834-bfcc1252dd31",
        value: "Preferiresti poter avere un solo figlio o doverne avere sette?",
      },
      {
        _id: "6bc6f0c9-0bb9-4538-84a4-874c69902f2e",
        value:
          "Preferiresti poter indossare solo scarpe da clown o non poter indossare nessuna scarpa?",
      },
      {
        _id: "93064c8f-ad51-4181-9e4e-49bee80611ba",
        value:
          "Preferiresti essere in debito con qualcuno di un sacco di soldi o di un grosso favore?",
      },
      {
        _id: "3616862c-9c0d-4caa-8e86-667c95d22c38",
        value:
          "Preferiresti viaggiare a caso nel tempo di +/- 20 anni ogni volta che scoreggi o teletrasportarti in un luogo diverso della terra (sulla terra, non sull'acqua) ogni volta che starnutisci?",
      },
      {
        _id: "b428dfd9-6c0f-4984-8c63-09b70570f7a1",
        value:
          "Preferiresti ricordare ogni singola cosa accaduta negli ultimi 10 anni della tua vita o sapere cosa farai nei prossimi 10 mesi senza poterlo cambiare?",
      },
      {
        _id: "75e379e6-61d0-4e47-b27f-128d6b129754",
        value:
          "Preferiresti vedere cosa c'è dietro ogni porta chiusa o essere in grado di indovinare la combinazione di ogni cassaforte al primo tentativo?",
      },
      {
        _id: "ad350178-bb4d-4e90-846c-be68a6100c6d",
        value:
          "Preferisci risolvere i problemi del mondo o vivere la tua vita senza preoccuparti dei problemi del mondo?",
      },
      {
        _id: "5ea76080-9d4f-4581-ac9c-5ea1c680f843",
        value:
          "Preferiresti passare due anni con la tua anima gemella per poi vederla morire e non amarla mai più o passare la tua vita con una persona carina per la quale ti sei accontentato?",
      },
      {
        _id: "f76f398b-4cab-4256-b741-703aecde2646",
        value:
          "Preferiresti stare in una di quelle vasche di deprivazione sensoriale per un giorno o in una stanza progettata per la sovrastimolazione per un giorno?",
      },
      {
        _id: "80396822-015e-4911-854c-da346d9151ed",
        value:
          "Preferiresti essere eletto improvvisamente senatore o diventare improvvisamente amministratore delegato di una grande azienda? (Non avrai più conoscenze su come svolgere l'uno o l'altro lavoro rispetto a quelle che hai adesso).",
      },
      {
        _id: "4a45782b-c6ae-4263-ad8c-f1c5d383c8a7",
        value:
          "Preferiresti un gusto super sensibile o un udito super sensibile?",
      },
      {
        _id: "15b6678c-618f-4aad-a7ee-96560d5e90d2",
        value:
          "Preferiresti fare una vacanza da sogno pagata ogni anno per un mese o avere il lavoro dei tuoi sogni?",
      },
      {
        _id: "0ff852ce-d3d8-450b-b2d3-88f6d2320d60",
        value:
          "Preferiresti parlare come Yoda o respirare come Darth Vader per il resto della tua vita?",
      },
      {
        _id: "84556c04-3b6f-4225-bfbd-531e5645b2c1",
        value:
          "Preferisci usare l'acqua bollente come collirio o fare i gargarismi con il latte acido?",
      },
      {
        _id: "fcf48c76-d83a-42c6-81f0-cd2c3034e245",
        value:
          "Preferiresti vomitare in modo incontrollato per un minuto ogni volta che senti la canzone di buon compleanno o avere un mal di testa che dura per il resto della giornata ogni volta che vedi un uccello (anche in foto o in un video)?",
      },
      {
        _id: "ba0a4740-c3e4-4f6b-b71b-57f4f7bab769",
        value:
          "Preferiresti svegliarti come una nuova persona a caso ogni anno e averne il pieno controllo per tutto l'anno o una volta a settimana passare un giorno dentro uno sconosciuto senza averne il controllo?",
      },
      {
        _id: "4f3feb2c-989b-48e8-b86b-bf155c265942",
        value:
          "Preferiresti svegliarti nel bel mezzo di un deserto sconosciuto o svegliarti in una barca a remi su uno specchio d'acqua sconosciuto?",
      },
      {
        _id: "b57af0b5-2278-48b5-ba8b-f19c3d3fb0a7",
        value:
          "Preferiresti guardare un film senza snack o bevande o avere tutto quello che vuoi ma il volume del film è sempre un po' troppo basso o un po' troppo alto?",
      },
      {
        _id: "fb370587-7c5b-44e8-a277-3007c1ab0c48",
        value:
          "Preferisci indossare solo scarpe scomode ogni volta che esci o scarpe comode sempre (anche a letto)?",
      },
      {
        _id: "3723052a-2912-4411-9dc5-5c7ca12073e4",
        value:
          "Preferiresti indossare pantaloni di 3 taglie in più o scarpe di 3 taglie in meno?",
      },
      {
        _id: "fc1a45cb-cde6-4b13-8e2e-95d27b4df21a",
        value:
          "Preferiresti fare un lavoro moralmente discutibile ma che fa guadagnare molti soldi o un lavoro che aiuta molte persone ma non fa guadagnare molto?",
      },
      {
        _id: "f0ede983-277f-4d2b-bf1e-4f7037392847",
        value:
          "Preferiresti lavorare più ore al giorno, ma avere più weekend o lavorare meno ore al giorno con più giorni lavorativi?",
      },
      {
        _id: "1ef47fd6-1a1c-4679-8cdf-cd7c2772be97",
        value:
          "Preferiresti scrivere un romanzo che sarà considerato da tutti il libro più importante degli ultimi 200 anni, ma tu e il libro sarete apprezzati solo dopo la tua morte, oppure essere lo scrittore erotico più famoso della tua generazione?",
      },
      {
        _id: "9bab68f4-fd56-4cc0-bb8e-05360e5a706a",
        value:
          "Preferiresti che il tuo unico mezzo di trasporto fosse un asino o una giraffa?",
      },
      {
        _id: "72a90ce7-9763-40e0-bd86-161442907c7d",
        value:
          "Preferiresti che il tuo unico mezzo di trasporto fosse un cavallo o un cammello?",
      },
      {
        _id: "4ec84bc1-13b5-4478-a986-bcfbb96ed84c",
        value:
          "Preferiresti dover mangiare un cucchiaio di wasabi ogni mattina a colazione o indossare calzini bagnati tutto il giorno?",
      },
      {
        _id: "69a30a9c-36e6-444c-a5ec-f804741ec0ba",
        value:
          "Preferiresti poter volare, ma solo a una velocità massima di 5 miglia all'ora, o essere invisibile, ma solo quando nessuno ti guarda?",
      },
      {
        _id: "fcb3f592-3965-4b96-bdf7-4a20493e820d",
        value:
          "Preferiresti avere la capacità di parlare e capire fluentemente qualsiasi lingua del mondo, ma non potrai mai più parlare la tua lingua madre, oppure avere il potere di leggere nel pensiero, ma non poterlo disattivare?",
      },
      {
        _id: "801da033-86b5-4d57-ad13-6f96615863a7",
        value:
          "Preferiresti sapere sempre la scomoda verità su qualsiasi situazione o essere beatamente ignorante ma costantemente sbugiardato?",
      },
      {
        _id: "cce246a2-79a4-471d-afd1-e55d83fbb04f",
        value:
          "Preferiresti avere un tasto rewind per la tua vita, che ti permetta di rifare qualsiasi momento passato, o un tasto fast forward per saltare avanti nel tempo e vedere il tuo futuro?",
      },
      {
        _id: "c9e2576c-eb76-45ac-b6e5-ff4b02d523f8",
        value:
          "Preferiresti vivere in un mondo in cui non smette mai di piovere o in un mondo in cui non smette mai di nevicare?",
      },
      {
        _id: "c43e1d21-061f-4963-9314-7477b2cc9eeb",
        value:
          "Preferiresti avere la possibilità di teletrasportarti in qualsiasi parte del mondo, ma solo una volta all'anno, oppure poter viaggiare nel tempo, ma senza poter controllare quando o dove finisci?",
      },
      {
        _id: "2b123445-8a70-4e04-85f1-9731c529e1c7",
        value:
          "Preferiresti avere un drago domestico che obbedisce a ogni tuo comando o un gatto parlante con una conoscenza infinita?",
      },
      {
        _id: "ef4b7032-237b-4c25-a682-81557a0b6535",
        value:
          "Preferiresti avere sempre un tempo perfetto per i tuoi progetti all'aperto ma poter indossare un solo colore per il resto della tua vita, oppure avere un guardaroba pieno di colori ma affrontare sempre un tempo imprevedibile?",
      },
      {
        _id: "a8f42d94-d56c-4484-8a0c-07118ec1222f",
        value:
          "Preferiresti poter mangiare solo il tuo cibo preferito per il resto della tua vita e non provare mai nulla di nuovo, oppure avere la possibilità di assaggiare e gustare qualsiasi cucina del mondo ma non mangiare mai più il tuo cibo preferito?",
      },
      {
        _id: "3395d027-800a-4c4a-95a6-aa2abb48e45e",
        value:
          "Preferiresti avere la capacità di parlare con gli animali ma non capire il linguaggio umano, o avere la capacità di capire qualsiasi lingua ma non essere in grado di parlare con gli animali?",
      },
      {
        _id: "48bf7328-6b02-430f-86e2-17efe2ba7f13",
        value:
          "Preferiresti essere un attore famoso che interpreta sempre il cattivo o un attore sconosciuto che interpreta sempre l'eroe?",
      },
      {
        _id: "3d8e0343-ce30-4d4d-9f83-f2dbd6b6698f",
        value:
          "Preferiresti avere una macchina del tempo che va solo nel passato o una macchina del tempo che va solo nel futuro?",
      },
      {
        _id: "0528e367-106c-48d4-acdb-032cc3eefc76",
        value:
          "Preferiresti avere un cuoco personale che sa cucinare solo un piatto ma è il tuo preferito, o un personal trainer che ti fa fare solo un esercizio ma ti mette in perfetta forma?",
      },
      {
        _id: "f2bb3fa1-e37c-4535-b3d0-cb52caa2ecd1",
        value:
          "Preferiresti avere un tasto rewind per la tua bocca per rimangiarti le cose che hai detto o un tasto fast-forward per la tua vita per saltare i momenti noiosi?",
      },
      {
        _id: "457bc74e-40cb-4ce8-b522-97c4632c95df",
        value:
          "Preferiresti essere un atleta professionista con una carriera breve ma dalla fama immensa o avere una carriera lunga e di successo in una professione meno affascinante?",
      },
      {
        _id: "0064911e-64ff-4862-abed-c63f0106b5c8",
        value:
          "Preferisci dover sempre saltellare su un piede solo o gattonare come un bambino quando ti muovi?",
      },
      {
        _id: "1ffefed4-a08e-406b-8005-37b93fc3096e",
        value:
          "Preferiresti vivere in una casa sull'albero in mezzo a una foresta o in una casa galleggiante in mezzo a un lago sereno?",
      },
      {
        _id: "cbb887b8-a3b6-4e24-ae3d-c2a0cb70bd10",
        value:
          "Preferiresti avere la possibilità di controllare il tempo atmosferico ma che sia sempre l'opposto di quello che vuoi, o avere la capacità di prevedere il futuro ma solo per eventi banali?",
      },
      {
        _id: "b8e84d28-3994-4867-b0c7-ec940a729d77",
        value:
          "Preferiresti avere il potere di guarire qualsiasi malattia o ferita con un tocco, ma perdere un anno della tua vita ogni volta che lo usi, oppure essere immortale ma non poter guarire nessuno?",
      },
      {
        _id: "0b190095-71c7-4387-bdf6-10a7b82ce174",
        value:
          "Preferiresti avere il potere della telecinesi ma solo per gli oggetti di peso inferiore ai 5 chili o la capacità di teletrasportarti ma solo in luoghi in cui sei già stato?",
      },
      {
        _id: "28867470-92e8-4345-82f3-a723b1afdf87",
        value:
          "Preferiresti vivere in un mondo senza internet o in un mondo senza musica?",
      },
      {
        _id: "35896c2c-2293-4711-8773-28f44e641d2c",
        value:
          "Preferiresti essere la persona più intelligente del mondo ma sempre sola, oppure avere un gruppo di amici affiatato ma un'intelligenza inferiore alla media?",
      },
      {
        _id: "f3257ad8-3b05-44f5-92e6-110fb9ab2298",
        value:
          "Preferiresti poter parlare con le macchine e far loro eseguire i tuoi ordini o parlare con gli animali e capire i loro pensieri?",
      },
      {
        _id: "ac1977ca-f02e-46cd-ac8e-19afccd0fbe0",
        value:
          "Preferiresti avere la possibilità di imparare e padroneggiare istantaneamente qualsiasi abilità o avere la possibilità di viaggiare ovunque nel mondo in un batter d'occhio?",
      },
      {
        _id: "34531ec0-5a30-470f-aabc-0837f4db2af2",
        value:
          "Preferiresti avere una scorta a vita del tuo cibo preferito ma non poter mangiare nient'altro, oppure avere la capacità di evocare qualsiasi cibo tu voglia ma solo in piccole quantità?",
      },
      {
        _id: "cd7e1314-6ff6-430f-9d58-977e3c12ba89",
        value:
          "Preferiresti avere il potere di cambiare il tuo aspetto a piacimento o di leggere i pensieri delle persone su di te?",
      },
      {
        _id: "981916dc-46ab-4675-be1d-7143dc7bf49a",
        value:
          "Preferiresti dover dire sempre la verità o non poter più parlare?",
      },
      {
        _id: "a4f0bdb4-00c6-4e3c-83d5-603f4b4c6d03",
        value:
          "Preferiresti vivere in un mondo in cui tutti possono leggere nel pensiero o in un mondo in cui tutti sono sempre completamente onesti?",
      },
      {
        _id: "554af800-ac0a-43ee-b7e5-3e1cb0acb1ec",
        value:
          "Preferiresti avere la capacità di controllare il fuoco o di controllare l'acqua?",
      },
      {
        _id: "5d316df3-aa96-458b-96bf-b488c519d550",
        value:
          "Preferiresti dover sempre cantare invece di parlare o ballare invece di camminare?",
      },
      {
        _id: "b33c5d27-e31a-4995-b151-ec9887e6a75e",
        value:
          "Preferiresti avere un'astronave personale ma non lasciare mai la Terra o poter viaggiare su qualsiasi pianeta ma solo a piedi?",
      },
      {
        _id: "843a4532-64c6-40d1-8860-20996aed57ca",
        value:
          "Preferiresti essere la persona più famosa del mondo ma costantemente inseguita dai paparazzi o vivere una vita tranquilla e anonima?",
      },
      {
        _id: "8cf377a6-83fd-4b0e-b454-b527ced26d98",
        value:
          "Preferiresti avere il potere di fermare il tempo ma solo per 5 secondi alla volta o essere in grado di vedere 5 minuti nel futuro ma non di cambiarlo?",
      },
      {
        _id: "1dcca749-a937-449e-b304-8772469d4643",
        value:
          "Preferiresti vivere in una casa senza finestre o in una casa senza porte?",
      },
      {
        _id: "63c3ccde-296b-40f7-9abf-ce549d731bbb",
        value:
          "Preferiresti avere un drago domestico sempre affamato o un unicorno domestico sempre dispettoso?",
      },
      {
        _id: "2dac1875-b37f-4450-a443-05eab3e4a37f",
        value:
          "Preferiresti poter comunicare con le piante e farle crescere più velocemente o comunicare con gli animali e capire le loro esigenze?",
      },
      {
        _id: "c3907f4d-a7cd-4804-817a-622c2e82b1f0",
        value:
          "Preferiresti avere la capacità di imparare istantaneamente qualsiasi strumento musicale o di parlare fluentemente qualsiasi lingua?",
      },
      {
        _id: "d2243523-de9e-49e6-81aa-437284b3bf15",
        value:
          "Preferiresti essere il più grande detective del mondo ma non essere mai riconosciuto per il tuo lavoro o la più famosa mente criminale del mondo ma sempre un passo avanti alla legge?",
      },
      {
        _id: "1667dfa7-cc2b-42df-b24f-bb22d1191a77",
        value:
          "Preferiresti avere il potere di controllare le emozioni delle persone o di controllare il tempo?",
      },
      {
        _id: "181b316c-329e-42a8-9e17-d735bf7d0254",
        value:
          "Preferiresti essere in grado di respirare sott'acqua ma non di nuotare o avere la capacità di volare ma solo a velocità di marcia?",
      },
      {
        _id: "b8174c3d-821e-4adc-bc4e-b3ca751da17b",
        value:
          "Preferiresti essere un autore famoso ma i cui libri vengono sempre stroncati dalla critica o un autore sconosciuto con una piccola ma devota fanbase?",
      },
      {
        _id: "53ef3558-0cf1-4c58-914e-17fa85244c85",
        value:
          "Preferiresti avere la capacità di imparare istantaneamente qualsiasi arte marziale o avere la forza di dieci uomini?",
      },
      {
        _id: "f1520450-4104-4716-9107-e4d3b569cbec",
        value:
          "Preferiresti avere il potere di pulire e organizzare all'istante qualsiasi spazio o quello di cucinare piatti da gourmet con qualsiasi ingrediente a portata di mano?",
      },
      {
        _id: "6e04d9ff-2233-4a02-be6d-a69993f758fd",
        value:
          "Preferiresti poter viaggiare indietro nel tempo e cambiare un momento del tuo passato o viaggiare nel futuro e vedere un momento del tuo futuro?",
      },
      {
        _id: "6e3356ec-c112-4b75-ba0d-c6578c0aec48",
        value:
          "Preferiresti vivere in un mondo in cui il denaro non esiste o in un mondo in cui la tecnologia è talmente avanzata che i robot fanno tutto il lavoro e gli uomini non hanno nulla da fare?",
      },
      {
        _id: "de87a280-de90-4f31-9566-a0d2bb872691",
        value:
          "Preferiresti avere un amico che ha sempre ragione ma non sorride mai o un amico che è sempre allegro ma spesso si sbaglia?",
      },
      {
        _id: "e7bba34e-731c-4c14-95d9-c024170ee89a",
        value:
          "Preferiresti avere la capacità di parlare con i defunti ma che questi non possano mai risponderti o avere la capacità di riportare in vita i morti ma solo per un giorno?",
      },
      {
        _id: "2ef23dfb-5559-4f61-b65c-11c3735d4a0d",
        value:
          "Preferiresti avere sempre capelli perfetti ma un pessimo senso della moda o una moda impeccabile ma giornate di capelli perennemente sbagliate?",
      },
      {
        _id: "3b065274-dcf5-4eb1-a710-b7f3b68598e0",
        value:
          "Preferiresti essere in grado di controllare i tuoi sogni e avere sogni lucidi ogni notte o non dover mai dormire ma anche non sognare mai più?",
      },
      {
        _id: "fc80578f-ce7f-4edf-ba64-74f845b94ef8",
        value:
          "Preferiresti avere la capacità di far innamorare chiunque di te ma non provare mai il vero amore o trovare il vero amore ma non avere mai il potere di far innamorare qualcun altro?",
      },
      {
        _id: "dcc9a9c3-df11-412d-8992-09c8839c1fdb",
        value:
          "Preferiresti avere la possibilità di teletrasportarti in qualsiasi mondo immaginario dei libri o dei film o portare in vita personaggi immaginari nel mondo reale?",
      },
      {
        _id: "d0b77f46-2f14-4099-a32a-960cd607503b",
        value:
          "Preferiresti vivere in un mondo in cui tutti possono leggere i tuoi pensieri o in un mondo in cui puoi ascoltare i pensieri degli altri?",
      },
      {
        _id: "7552ac0d-93b3-4388-8126-b647fc85c2cb",
        value:
          "Preferiresti avere un armadio che ha sempre l'abito perfetto per ogni occasione o un garage che ha sempre il veicolo perfetto per ogni viaggio?",
      },
      {
        _id: "83d7f150-de8a-42d7-b9c8-e7afece02a6b",
        value:
          "Preferiresti essere un supereroe con poteri incredibili ma sempre con un'arcinemesi formidabile o una persona normale con una vita tranquilla ma senza abilità straordinarie?",
      },
      {
        _id: "dfbb0120-1f0e-4fde-997b-5e099de5f6b8",
        value:
          "Preferisci avere la possibilità di parlare al passato o al futuro, ma puoi inviare un solo messaggio a una sola persona?",
      },
      {
        _id: "c06b8821-e7a0-4b1d-8008-b14363d3df33",
        value:
          "Preferiresti avere il potere di pulire istantaneamente qualsiasi disordine o il potere di guarire istantaneamente qualsiasi lesione fisica?",
      },
      {
        _id: "1dfe8f59-b364-4927-b6b9-da8e7a636183",
        value:
          "Preferiresti vivere in un mondo in cui puoi scaricare istantaneamente qualsiasi abilità o conoscenza nel tuo cervello o in un mondo in cui puoi trasferire la tua coscienza in corpi diversi?",
      },
      {
        _id: "d4c4e72e-30ce-4f94-baa4-6f56578b3a6f",
        value:
          "Preferiresti essere in grado di capire e comunicare con gli insetti o avere la possibilità di controllare il tempo per un'ora al giorno?",
      },
      {
        _id: "c39ee152-93b9-4234-b408-6c23216225db",
        value:
          "Preferiresti avere la capacità di far ridere qualcuno con le tue battute o di far piangere qualcuno con le tue storie tristi?",
      },
      {
        _id: "124fbc1e-319e-46b6-abb5-9df448a9cf07",
        value:
          "Preferiresti avere una biblioteca personale con tutti i libri mai scritti ma senza accesso a internet o un accesso illimitato a internet ma senza libri fisici?",
      },
      {
        _id: "00385679-2b1d-4a9b-ad64-b0947636d6c2",
        value:
          "Preferiresti avere il potere di curare qualsiasi malattia, ma questo accorcia la tua durata di vita, o avere il potere di prevenire le guerre, ma questo ti obbliga a vivere in costante isolamento?",
      },
      {
        _id: "f10529d2-af99-4751-96e2-1fbe62ccac9d",
        value:
          "Preferiresti essere un pittore famoso ma con un solo capolavoro o un artista sconosciuto con una vita di lavori creativi?",
      },
      {
        _id: "feb880d0-f79d-4e8a-851b-487faf8c55ae",
        value:
          "Preferiresti avere la capacità di diventare invisibile a piacimento o di teletrasportarti solo in luoghi in cui sei già stato?",
      },
      {
        _id: "9f610050-1715-4f4f-8fa8-e6357cd72de1",
        value:
          "Preferiresti avere un lavoro che ami ma che ti paga poco o un lavoro che odi ma che ti rende incredibilmente ricco?",
      },
      {
        _id: "fcb0cd6e-8803-4e42-96c5-9074795d35c1",
        value:
          "Preferiresti vivere in un mondo in cui tutti sono sempre felici ma non sperimentano mai una crescita personale o in un mondo in cui tutti affrontano sfide e difficoltà ma possono crescere e imparare da esse?",
      },
      {
        _id: "0b394ae2-aafe-4a59-9f9f-c569abf795c2",
        value:
          "Preferiresti avere la capacità di cambiare il passato senza conoscerne le conseguenze o la capacità di vedere il futuro senza poterlo cambiare?",
      },
      {
        _id: "0deb4cf7-db96-4f3d-8650-89d819acf62f",
        value:
          "Preferiresti avere il potere di controllare gli animali o di controllare la tecnologia con la mente?",
      },
      {
        _id: "e6b70645-a16a-44be-939f-58638132e98e",
        value:
          "Preferiresti essere un musicista famoso ma capace di suonare solo una canzone o un musicista esperto con un repertorio vario ma senza riconoscimenti?",
      },
      {
        _id: "86ff4fd5-33e6-4c85-9634-0f6ef7756d55",
        value:
          "Preferiresti avere la capacità di parlare tutte le lingue del mondo ma non essere mai in grado di comunicare attraverso la scrittura o essere un maestro della scrittura ma non parlare mai più a voce?",
      },
      {
        _id: "7d817c94-3586-4ced-83be-64efe4c4d821",
        value:
          "Preferiresti avere il potere di pulire istantaneamente qualsiasi ambiente o la capacità di cucinare istantaneamente qualsiasi piatto alla perfezione?",
      },
      {
        _id: "d3603e7b-6af5-4f55-88ce-d354bf655f76",
        value:
          "Preferiresti vivere in un mondo in cui tutti i trasporti avvengono sulle montagne russe o in un mondo in cui tutti viaggiano in mongolfiera?",
      },
      {
        _id: "e8b94f13-c15f-494d-b372-ac6370252570",
        value:
          "Preferiresti avere un amico in grado di prevedere il futuro ma che non condivide mai le informazioni con te o un amico in grado di leggere nel pensiero ma che non sa mantenere un segreto?",
      },
      {
        _id: "18428bf0-62d4-4d74-a1eb-2e1a8a0c2677",
        value:
          "Preferiresti avere il potere di viaggiare nel tempo ma non controllare dove finisci o il potere di teletrasportarti ma non controllare quando arrivi?",
      },
      {
        _id: "ba3c7450-724f-43e7-a7aa-bafe12f2bd19",
        value:
          "Preferiresti avere la capacità di cancellare i ricordi dolorosi del tuo passato o di vedere nel futuro per evitare di commettere errori?",
      },
      {
        _id: "f418e45c-b403-499f-85dd-90c4a9000ede",
        value:
          "Preferiresti avere il potere di controllare il comportamento degli animali o di controllare i pensieri degli esseri umani?",
      },
      {
        _id: "a8e6b619-4045-4615-9003-1f5ad35900cc",
        value:
          "Preferiresti avere la capacità di imparare istantaneamente qualsiasi stile di danza o di suonare perfettamente qualsiasi strumento musicale?",
      },
      {
        _id: "4d864c98-497e-4692-bca1-251f4ec0c2f7",
        value:
          "Preferiresti essere uno scienziato brillante senza abilità sociali o un influencer carismatico senza conoscenze scientifiche?",
      },
      {
        _id: "5550ff21-324d-42af-9b0a-6c9d54feb3fb",
        value:
          "Preferiresti avere il potere di controllare la mente degli altri ma sentire le loro emozioni come fossero le tue o avere la capacità di leggere i pensieri delle persone ma non di influenzarle?",
      },
      {
        _id: "0b91abed-50bd-4365-ab85-deca1e5831a2",
        value:
          "Preferiresti vivere in un mondo in cui tutti indossano sempre delle maschere o in un mondo in cui tutti sono completamente trasparenti e i loro pensieri sono visibili agli altri?",
      },
      {
        _id: "3e3f96aa-5824-47be-a7fc-86a92846de1b",
        value:
          "Preferiresti avere il potere di far addormentare qualcuno all'istante o di svegliarlo dal sonno all'istante?",
      },
      {
        _id: "fa53add0-fb43-4fad-b978-fa7c6782c162",
        value:
          "Preferiresti avere la capacità di viaggiare in qualsiasi punto della storia ma solo di osservare o di viaggiare in qualsiasi punto del futuro ma senza tornare al presente?",
      },
      {
        _id: "f1edf8ad-9647-4c96-ad47-f87ffa268bf7",
        value:
          "Preferiresti avere il potere di imparare istantaneamente qualsiasi argomento o quello di ispirare gli altri a raggiungere la grandezza?",
      },
      {
        _id: "34ad42f4-4dcb-4d31-bd53-395f7d143ada",
        value:
          "Preferiresti vivere in un mondo in cui il denaro non ha valore o in un mondo in cui la tecnologia è avanzata fino a raggiungere l'immortalità?",
      },
      {
        _id: "440a7536-7f3b-4712-95c3-1403244099d5",
        value:
          "Preferiresti avere un amico che può teletrasportare gli oggetti ma spesso li perde o un amico che può duplicare gli oggetti ma sono sempre leggermente imperfetti?",
      },
      {
        _id: "8531612e-6c47-4c33-927c-706b3b593a5f",
        value:
          "Preferiresti avere il potere di far crescere rapidamente le piante o di controllare il tempo per un'ora al giorno?",
      },
      {
        _id: "2878946a-d162-4ac8-bfe9-6b453768aab6",
        value:
          "Preferiresti avere la capacità di trasformare qualsiasi oggetto in oro, ma non può mai tornare indietro, oppure avere il potere di guarire qualsiasi ferita, ma ogni volta ti toglie un anno di vita?",
      },
      {
        _id: "606a5a55-a9cd-4b01-8b6a-fa99a1e5ebd4",
        value:
          "Preferiresti essere uno chef famoso ma in grado di cucinare solo un piatto o uno scienziato rinomato ma in grado di fare ricerche solo su un argomento?",
      },
      {
        _id: "77e188e1-1a8c-4164-a0cf-d6b4cf5c40e3",
        value:
          "Preferiresti avere la capacità di controllare il fuoco ma che lascia sempre un segno evidente o avere il potere di controllare l'acqua ma solo in piccole quantità?",
      },
      {
        _id: "7869e235-5db9-47e9-be5f-0e113811576d",
        value:
          "Preferiresti vivere in un mondo in cui tutti hanno una memoria perfetta ma non riescono a dimenticare nulla o in un mondo in cui tutti possono dimenticare all'istante qualsiasi ricordo doloroso?",
      },
      {
        _id: "c568d5a1-7915-4441-b7db-131a50a15044",
        value:
          "Preferiresti avere il potere di cambiare il tuo aspetto a piacimento ma perdere la tua identità originale o avere la capacità di viaggiare nel tempo ma non controllare la destinazione?",
      },
      {
        _id: "20caf3dd-d641-443b-824c-4ac0c903bb9c",
        value:
          "Preferiresti conoscere sempre la risposta a qualsiasi domanda ma non essere mai in grado di comunicarla o avere sempre la capacità di comunicare efficacemente ma non conoscere mai le risposte?",
      },
      {
        _id: "764ead36-ec73-428c-9fa1-40850018c0c3",
        value:
          "Preferiresti essere un musicista famoso ma in grado di esibirsi solo in un genere o un artista affermato in più generi ma che non raggiunge mai la fama?",
      },
      {
        _id: "c815a368-5551-4b09-8f56-74beb39ff83e",
        value:
          "Preferiresti avere la capacità di parlare e comprendere qualsiasi lingua animale ma non essere in grado di comunicare con gli esseri umani o avere il potere di comprendere tutte le lingue umane ma non essere in grado di parlare con gli animali?",
      },
      {
        _id: "f0330627-0a3a-497e-9ad3-6818da261b77",
        value:
          "Preferiresti avere un amico che sa prevedere il futuro ma non te lo dice mai o un amico che sa leggere nel pensiero ma interrompe costantemente i tuoi pensieri?",
      },
      {
        _id: "0425c24b-987b-462e-ae0e-881a85acedfd",
        value:
          "Preferiresti avere il potere di cambiare il tempo ma che sia sempre l'opposto di quello che vuoi o avere il potere di prevedere il futuro ma solo per eventi banali?",
      },
      {
        _id: "39cc3710-a67f-4ddc-81ce-be1aafa8e6fc",
        value:
          "Preferiresti vivere in un mondo in cui la tecnologia è bandita e le persone si affidano alla natura o in un mondo in cui la tecnologia controlla ogni aspetto della vita?",
      },
      {
        _id: "ee738c87-ec68-498f-908b-613553a6dca9",
        value:
          "Preferiresti avere una biblioteca personale con tutti i libri mai scritti ma non poterli mai leggere o un accesso illimitato a internet ma solo per un'ora al giorno?",
      },
      {
        _id: "46ecd643-208c-4d9b-bb91-422997a12bb6",
        value:
          "Preferiresti avere il potere di curare qualsiasi malattia, ma questo accorcia la tua vita, o avere il potere di prevenire tutti i disastri naturali, ma questo ti obbliga a vivere in isolamento?",
      },
      {
        _id: "5322e8f1-3b6e-4a40-86c2-eae4fd711705",
        value:
          "Preferiresti avere il potere di pulire all'istante qualsiasi pasticcio o di cucinare all'istante piatti da gourmet con qualsiasi ingrediente a portata di mano?",
      },
      {
        _id: "882bf1f3-974a-4481-abbb-b0b8475a5f55",
        value:
          "Preferiresti vivere in un mondo in cui puoi cambiare il passato senza conoscerne le conseguenze o vedere il futuro senza poterlo cambiare?",
      },
      {
        _id: "74a1c49f-33f1-49c3-bf7a-1e9afe8b6f18",
        value:
          "Preferiresti avere il potere di pulire istantaneamente qualsiasi ambiente o di cucinare istantaneamente qualsiasi piatto alla perfezione?",
      },
      {
        _id: "94ed38f5-eaf3-49dc-b78a-139ed88f6057",
        value:
          "Preferiresti vivere in un mondo in cui tutti i trasporti avvengono sulle montagne russe o tutti viaggiano in mongolfiera?",
      },
    ];

    let i = 0;
    for (const question of questions) {
      console.log(i);
      await wyrModel.findOneAndUpdate(
        { id: question._id },
        { ["translations.it"]: question.value },
      );
      i++;
    }
  },
};

export default command;
