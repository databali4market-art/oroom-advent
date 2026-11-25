import type { Door } from './types';

/**
 * OBSAH KALENDÁŘE – všech 24 okének podle tabulky „Mobil Maják – adventní kalendář 2026“
 * (list „Okénka“, sloupce „Nadpis okénka“, „Copy“ a „Pro Davida“; stav všech okének: Schváleno).
 * Okénko se odemyká o půlnoci českého času (Europe/Prague).
 *
 * Texty: prázdný řádek = nový odstavec, jinak řádky zůstávají pod sebou.
 * Fotky jsou v public/img (názvy souborů záměrně neprozrazují odpovědi her).
 */
export const YEAR = 2026;

export const BASE = import.meta.env.BASE_URL;
export const SHOP = 'https://www.brno.oroom.cz/';
export const SERVICE = 'https://servismajak.cz/';
export const BRANCHES_URL = SERVICE + 'pobocky/';
export const BATTERY_URL = SERVICE + 'zarizeni/mobilni-telefony';
const IMG = BASE + 'img/';

/** Provozovatel kalendáře a pořadatel soutěží */
export const OPERATOR = {
  // TODO: doplnit údaje provozovatele OROOM Brno
  name: 'DOPLNIT NÁZEV S.R.O.',
  address: 'DOPLNIT ADRESU',
  ico: 'DOPLNIT',
  dic: 'DOPLNIT',
  email: 'doplnit@oroom.cz',
  phone: 'DOPLNIT',
};
export const RULES_URL = '?pravidla';
export const PRIVACY_URL = 'https://www.brno.oroom.cz/'; // TODO: odkaz na zásady ochrany osobních údajů
export const PHONE = 'DOPLNIT'; // TODO: telefon OROOM Brno

export const CONTEST_DAYS = [5, 13, 19];

const branches = { url: BRANCHES_URL, urlLabel: 'Najít pobočku' };

export const doors: Door[] = [
  {
    day: 1, type: 'offer', title: 'Vítejte v adventu s Mobil Majákem',
    text: `Až do Štědrého dne na vás tady každý den čeká nové okénko. Dárky, hry, soutěže a praktické tipy, se kterými váš telefon přečká Vánoce v perfektní kondici.

A hned na začátek máme dárek: základní čištění telefonu zdarma. Běžně stojí 300 Kč.

Stačí přijít na kteroukoli z našich šesti poboček a ukázat toto okénko u pultu. Technik vyčistí konektory, mikrofon i reproduktory a telefon vám vrátí jako nový.

Pozor, dárek platí jen pro prvních 30 zákazníků na každé pobočce. Uplatnit ho můžete do 31. 12.

Všechno, co otevřete, najdete i později v sekci „Moje dárky“. Další okénko se odemyká vždy o půlnoci.`,
    coupon: { code: 'MAJAK-01', value: 'Základní čištění telefonu zdarma (běžně 300 Kč)', valid: 'Pro prvních 30 zákazníků na každé pobočce, platí do 31. 12.' },
    ...branches,
  },
  {
    day: 2, type: 'game', title: 'Poznáte telefon podle fotoaparátu?',
    text: `Fotoaparáty dnešních telefonů jsou skoro jako otisky prstů. Každý vypadá trochu jinak.

Připravili jsme čtyři detaily zadní strany telefonu. Poznáte, který model se za nimi skrývá?`,
    game: {
      kind: 'quiz',
      hideAnswers: true,
      reward: 'Výborně, máte oko! K nákupu na pobočce od nás dostanete čisticí hadřík zdarma. Stačí ukázat tuto obrazovku u pultu. Platí do 31. 12.',
      fail: 'Tentokrát vedle. Zkuste to znovu.',
      questions: [
        { q: 'Který telefon to je?', image: { src: IMG + 'hra2-foto1.jpg', alt: 'Detail fotoaparátu na zadní straně telefonu č. 1' }, options: ['iPhone 16', 'iPhone 16 Pro', 'Samsung Galaxy S24 Ultra', 'Xiaomi 14'], answer: 1 },
        { q: 'Který telefon to je?', image: { src: IMG + 'hra2-foto2.jpg', alt: 'Detail fotoaparátu na zadní straně telefonu č. 2' }, options: ['Samsung Galaxy S24 Ultra', 'Samsung Galaxy A55', 'Google Pixel 8 Pro', 'iPhone 16 Pro'], answer: 0 },
        { q: 'Který telefon to je?', image: { src: IMG + 'hra2-foto3.jpg', alt: 'Detail fotoaparátu na zadní straně telefonu č. 3' }, options: ['Nothing Phone (2)', 'Samsung Galaxy S24 Ultra', 'Google Pixel 8 Pro', 'iPhone 16'], answer: 2 },
        { q: 'Který telefon to je?', image: { src: IMG + 'hra2-foto4.jpg', alt: 'Detail fotoaparátu na zadní straně telefonu č. 4' }, options: ['iPhone 15', 'Google Pixel 8 Pro', 'iPhone 16 Pro', 'iPhone 16'], answer: 3 },
      ],
    },
  },
  {
    day: 3, type: 'tip', title: '4 znaky, že vám dochází baterie',
    text: 'Baterie většinou neodejde ze dne na den. Dává o sobě vědět dlouho dopředu. Tady jsou čtyři nejčastější signály:',
    list: [
      'Telefon se sám vypne, i když ukazuje kolem 20 %.',
      'Bez nabíječky ho nezapnete, přestože byl nedávno nabitý.',
      'Nabíjí se podezřele rychle. Například z nuly na 25 % za minutu.',
      'Nevydrží celý den, i když ho používáte stejně jako dřív.',
    ],
    more: `Kde zjistíte stav baterie?
iPhone: Nastavení > Baterie > Stav baterie.
Samsung: Nastavení > Péče o baterii a zařízení.
U ostatních telefonů se řiďte hlavně příznaky výše.

Poznáváte svůj telefon? Výměnu baterie zvládneme na kterékoli pobočce. A zítra se sem vyplatí zase podívat.`,
    url: BATTERY_URL, urlLabel: 'Výměna baterie',
  },
  {
    day: 4, type: 'offer', title: 'Výměna baterie + diagnostika zdarma',
    text: `Včera jsme si ukázali, jak poznat unavenou baterii. Dnes ji vyměníme a přidáme bonus.

K výměně baterie vám zdarma uděláme diagnostiku celého telefonu. Zkontrolujeme, že je v pořádku i všechno ostatní, abyste měli jistotu, že vám telefon vydrží další roky.

Cena výměny se liší podle modelu, přesnou cenu vám řekneme na pobočce.

Nabídka platí jen 48 hodin, do soboty 5. 12. do půlnoci.`,
    coupon: { code: 'MAJAK-04', value: 'Diagnostika celého telefonu zdarma k výměně baterie', valid: 'Platí 48 hodin, do soboty 5. 12. do půlnoci' },
    url: BATTERY_URL, urlLabel: 'Výměna baterie',
  },
  {
    day: 5, type: 'contest', title: 'Soutěž o sluchátka Marshall',
    text: `Mikuláš letos nadělí i pořádný zvuk.

Soutěžíme o bezdrátová sluchátka Marshall Major V. Stačí vyplnit svůj e-mail a jste ve hře.

Výherce vylosujeme na Štědrý den 24. 12. a ozveme se mu e-mailem.

Držíme palce!`,
    contest: {
      kind: 'email',
      prize: 'Bezdrátová sluchátka Marshall Major V (černá)',
      rules: 'Zapojit se můžete do 23. 12. 2026 do 23:59. Výherce vylosujeme 24. 12. a pošleme mu e-mail.',
      until: '2026-12-23T23:59:59+01:00',
    },
    url: SHOP + 'Nahlavni-bezdratova-sluchatka-Marshall-Major-V-cerna', urlLabel: 'Sluchátka v e-shopu',
  },
  {
    day: 6, type: 'game', title: 'Jak dobře znáte svůj mobil?',
    text: 'Telefon máte v ruce každý den. Ale jak dobře ho opravdu znáte? Pět otázek, žádný stres.',
    game: {
      kind: 'quiz',
      verdicts: [
        { min: 5, text: 'Výborně, svůj telefon znáte jako technik.' },
        { min: 3, text: 'Skvělý výsledek. Pár triků vám ještě ukážeme.' },
        { min: 0, text: 'Nevadí. Hlavně telefon nikdy nedávejte do rýže.' },
      ],
      questions: [
        { q: 'Co baterii škodí nejvíc?', options: ['Krátký pobyt v mrazu', 'Horko, například telefon na slunci v autě', 'Nabíjení přes noc'], answer: 1, explain: 'Vysoké teploty urychlují opotřebení baterie. Nabíjení přes noc si moderní telefony hlídají samy.' },
        { q: 'V jakém rozmezí nabití se baterii daří nejlépe?', options: ['Vybít na 0 % a nabít na 100 %', 'Zhruba mezi 20 a 80 %', 'Držet ji stále na 100 %'], answer: 1, explain: 'Úplné vybití i trvalých 100 % baterii zbytečně zatěžují.' },
        { q: 'Co znamená označení IP68?', options: ['Odolnost proti prachu a vodě', 'Typ displeje', 'Rychlost nabíjení'], answer: 0, explain: 'Pozor, odolnost časem slábne, například s opotřebením těsnění.' },
        { q: 'Telefon vám spadl do vody. Co uděláte?', options: ['Dám ho do rýže', 'Vypnu ho, nenabíjím ho a co nejdřív ho přinesu do servisu', 'Vysuším ho fénem'], answer: 1, explain: 'Rýže vlhkost zevnitř nevytáhne a její prach se může dostat do konektorů. Fén telefon zase přehřeje.' },
        { q: 'Telefon se seká a zamrzá. Co zkusíte jako první?', options: ['Restart', 'Koupím nový', 'Dám ho na chvíli do mrazáku'], answer: 0, explain: 'Obyčejný restart vyřeší víc potíží, než by se zdálo.' },
      ],
    },
  },
  {
    day: 7, type: 'offer', title: 'Tvrzené sklo s nalepením a čištěním zdarma',
    text: `Displej je nejdražší díl telefonu a zároveň ten, který nejčastěji praskne. Nejjednodušší ochrana? Tvrzené sklo.

Kupte si u nás tvrzené sklo a nalepení i vyčištění telefonu máte zdarma. Bez bublin a bez prachu pod sklem.

Ukažte toto okénko na pobočce. Platí do 31. 12.`,
    coupon: { code: 'MAJAK-07', value: 'Nalepení a čištění telefonu zdarma ke tvrzenému sklu', valid: 'Platí do 31. 12.' },
    ...branches,
  },
  {
    day: 8, type: 'tip', title: 'Telefon pro babičku, puberťáka i tátu',
    text: 'Vybrat telefon jako dárek není jednoduché. Proto jsme vybrali za vás.',
    links: [
      { label: 'Pro babičku a dědu: Aligator Senior A830', url: SHOP + 'Aligator-Senior-A830-cerveny', note: 'Velká tlačítka, hlasitý zvuk a jednoduché ovládání.' },
      { label: 'Pro puberťáka: iPhone 16e, použitý ve stavu A', url: SHOP + 'Apple-iPhone-16e-128GB-cerny-pouzity-A-151983', note: 'Moderní iPhone za rozumnou cenu.' },
      { label: 'Pro tátu: Samsung Galaxy A17', url: SHOP + 'Samsung-Galaxy-A17-4GB-128GB-Black', note: 'Spolehlivý telefon s dobrou výdrží na všechno, co během dne potřebuje.' },
    ],
    more: 'Nevíte si rady? Na pobočce vám rádi poradíme.',
  },
  {
    day: 9, type: 'offer', title: 'Dezinfekční čištění + hydrogelová fólie',
    text: `Telefon nosíte všude s sebou, a tak se na něm drží víc nečistot, než by se zdálo. Dnes mu dopřejeme pořádnou očistu.

Dezinfekční čištění telefonu a k tomu hydrogelová fólie za 600 Kč. Platíte jen čištění, fólii i s nalepením máte od nás.

Ukažte toto okénko na pobočce. Platí do 31. 12.`,
    coupon: { code: 'MAJAK-09', value: 'Dezinfekční čištění + hydrogelová fólie s nalepením za 600 Kč', valid: 'Platí do 31. 12.' },
    ...branches,
  },
  {
    day: 10, type: 'tip', title: 'Telefon pro dítě: 5 nastavení, než ho zabalíte',
    text: 'Nový telefon pod stromečkem udělá velkou radost. Aby vydržela i po Vánocích, nastavte tyto věci ještě před zabalením:',
    list: [
      'Rodičovská kontrola. U iPhonu ji najdete v Nastavení > Čas u obrazovky, u Androidu v aplikaci Google Family Link.',
      'Limity aplikací. Kolik času denně stráví dítě u her a sociálních sítí, rozhodnete vy.',
      'Zákaz nákupů. Ať vás v lednu nepřekvapí účet za placené aplikace.',
      'Sdílení polohy. Pro klid, když dítě není doma.',
      'Bezpečné heslo nebo PIN. Které znáte i vy.',
    ],
    more: 'Nechcete to nastavovat sami? Přineste telefon na pobočku a nastavíme ho za vás.',
    ...branches,
  },
  {
    day: 11, type: 'offer', title: '2 hydrogelové fólie za cenu 1',
    text: `Jednu pro sebe a druhou jako dárek.

Kupte si hydrogelovou fólii a druhou dostanete zdarma. Fólie stojí 699 Kč včetně nalepení, nebo 499 Kč bez nalepení.

Ukažte toto okénko na pobočce. Platí do 31. 12.`,
    coupon: { code: 'MAJAK-11', value: '2 hydrogelové fólie za cenu 1 (s nalepením i bez)', valid: 'Platí do 31. 12.' },
    ...branches,
  },
  {
    day: 12, type: 'tip', title: 'Než darujete nový telefon: záloha a přenos dat',
    text: `Nový telefon je radost. Ztracené fotky, kontakty a zprávy už méně.

Než starý telefon uložíte do šuplíku, zálohujte si ho:
iPhone: Nastavení > vaše jméno > iCloud > Záloha na iCloud.
Android: Nastavení > Google > Záloha.`,
    more: 'Nechcete to řešit sami? Na pobočce vám data ze starého telefonu přeneseme do nového. Fotky, kontakty i aplikace za 499 Kč.',
    ...branches,
  },
  {
    day: 13, type: 'contest', title: 'Kolik telefonů jsme letos opravili?',
    text: `Rozbité displeje, unavené baterie, telefony, které se nechtějí nabíjet. Letos jsme toho na servisu viděli opravdu hodně.

Zkuste odhadnout, kolik telefonů jsme v roce 2026 opravili. Kdo se trefí nejblíž, vyhraje poukaz na servis v hodnotě 1 000 Kč.

Zadejte svůj tip a e-mail. Tipy můžete posílat do pátku 18. 12. Výherce vyhlásíme v pondělí 21. 12. a ozveme se mu e-mailem.`,
    contest: {
      kind: 'number', placeholder: 'Váš tip (celé číslo)',
      prize: 'Poukaz na servis v hodnotě 1 000 Kč',
      rules: 'Tipy můžete posílat do 18. 12. 2026 do 23:59. Vyhrává nejbližší tip, při shodě ten dříve odeslaný. Výherce vyhlásíme 21. 12.',
      until: '2026-12-18T23:59:59+01:00',
    },
  },
  {
    day: 14, type: 'offer', title: 'K obalu hydrogelová fólie zdarma',
    text: `Nový obal ochrání záda telefonu. O displej se postará fólie, a tu dnes máte od nás.

Kupte si u nás obal a hydrogelovou fólii vám dáme zdarma i s nalepením.

Ukažte toto okénko na pobočce. Platí do 31. 12.`,
    coupon: { code: 'MAJAK-14', value: 'Hydrogelová fólie s nalepením zdarma k obalu', valid: 'Platí do 31. 12.' },
    ...branches,
  },
  {
    day: 15, type: 'tip', title: 'Jak vyfotit vánoční světýlka mobilem',
    text: 'Naživo vypadají světýlka kouzelně, na fotce často jako rozmazané skvrny. Pár jednoduchých triků to změní:',
    list: [
      'Otřete čočku. Fotoaparát v kapse sbírá prach a otisky víc, než si myslíte.',
      'Vypněte blesk. Přebije světýlka a zkazí atmosféru.',
      { text: 'Ťukněte na světýlka a stáhněte jas. Fotka bude tmavší, ale světla krásně vyniknou.', image: { src: IMG + 'tip15-svetylka-stromek.jpg', alt: 'Rozsvícený vánoční strom v noci, vyfocený se staženým jasem', caption: 'Stažený jas: tmavé okolí, světla krásně vyniknou.' } },
      'Zapněte noční režim a vydržte. Telefon opřete o něco pevného, ať se snímek nerozmaže.',
      { text: 'Vyzkoušejte portrétní režim. Světýlka v pozadí se rozostří do měkkých koleček.', image: { src: IMG + 'tip15-svetylka-portret.jpg', alt: 'Světelný řetěz na jehličí, světla v pozadí rozostřená do měkkých kroužků', caption: 'Portrétní režim: světla v pozadí jako měkká kolečka.' } },
    ],
    more: 'Tak hurá ke stromečku fotit.',
  },
  {
    day: 16, type: 'game', title: 'Seřaďte telefony podle roku vydání',
    text: 'Od hada na Nokii po Face ID. Pamatujete si, jak šel čas?',
    game: {
      kind: 'order',
      prompt: 'Seřaďte tyto telefony od nejstaršího po nejnovější. Karty přetáhněte, nebo je posouvejte šipkami.',
      win: 'Výborně, jste skutečný znalec.',
      lose: 'Nevadí. Hada na Nokii jsme stejně hráli všichni.',
      items: [
        { label: 'Nokia 3310', year: 2000, image: IMG + 'hra16-nokia-3310.jpg' },
        { label: 'Motorola RAZR V3', year: 2004, image: IMG + 'hra16-motorola-razr-v3.jpg' },
        { label: 'první iPhone', year: 2007, image: IMG + 'hra16-prvni-iphone.jpg' },
        { label: 'Samsung Galaxy S', year: 2010, image: IMG + 'hra16-samsung-galaxy-s.jpg' },
        { label: 'iPhone X', year: 2017, image: IMG + 'hra16-iphone-x.jpg' },
      ],
    },
  },
  {
    day: 17, type: 'offer', title: 'Tajný kupón jen pro pobočky',
    text: `Dnešní okénko je jen pro ty, kdo k nám dorazí osobně.

Ukažte tento tajný kupón u pultu na kterékoli naší pobočce a dostanete malý dárek. Čisticí hadřík nebo kabel.

Bez nákupu. Platí do 24. 12.`,
    coupon: { value: 'Malý dárek bez nákupu: čisticí hadřík nebo kabel', valid: 'Platí do 24. 12.' },
    ...branches,
  },
  {
    day: 18, type: 'offer', title: 'K opravě tvrzené sklo zdarma',
    text: `Opravený telefon si zaslouží zůstat celý co nejdéle.

Ke každé opravě vám dáme tvrzené sklo i s nalepením zdarma. Běžně stojí 499 až 599 Kč.

Ukažte toto okénko na pobočce. Platí do 31. 12.`,
    coupon: { code: 'MAJAK-18', value: 'Tvrzené sklo i s nalepením zdarma ke každé opravě', valid: 'Platí do 31. 12.' },
    ...branches,
  },
  {
    day: 19, type: 'contest', title: 'Soutěž o nejhůř rozbitý displej',
    text: `Pavučina, mozaika, nebo displej, na kterém už nic nepřečtete? Tentokrát se to vyplatí.

Vyfoťte svůj rozbitý displej a pošlete nám ho. Majitel toho nejhůř rozbitého vyhraje opravu zdarma až do 3 000 Kč.

Fotky můžete posílat do úterý 22. 12., výherce vyhlásíme ve středu 23. 12.

Čím hůř, tím líp.`,
    contest: {
      kind: 'photo',
      prize: 'Oprava telefonu zdarma až do 3 000 Kč',
      rules: 'Fotky můžete posílat do 22. 12. 2026 do 23:59. Fotka musí být vlastní a neupravená. Výherce vyhlásíme 23. 12.',
      until: '2026-12-22T23:59:59+01:00',
    },
  },
  {
    day: 20, type: 'game', title: 'Jaký jste typ mobilního uživatele?',
    text: 'Někdo telefon jen nosí v kapse, jiný ho nepustí z ruky. Čtyři otázky a víme, jaký typ jste vy.',
    game: {
      kind: 'persona',
      // body: Fotograf 1A 2A 3A 4A · Milovník zábavy 2B 3B 4B · Cestovatel 1B 2C 3C · Nešika 1C 4C
      // (podle návrhu v tabulce, zbylé odpovědi „podle logiky“; při shodě vyhrává typ, který je v results dřív)
      questions: [
        { q: 'Kolikrát vám už spadl telefon?', options: [{ t: 'Nikdy, dávám na něj pozor', r: 'photo' }, { t: 'Občas', r: 'travel' }, { t: 'Přestal/a jsem počítat', r: 'clumsy' }] },
        { q: 'Na co telefon používáte nejvíc?', options: [{ t: 'Fotky a videa', r: 'photo' }, { t: 'Hudba, seriály a hry', r: 'fun' }, { t: 'Mapy, volání a cestování', r: 'travel' }] },
        { q: 'Kolik máte večer baterie?', options: [{ t: 'Dost, nabíjím pravidelně', r: 'photo' }, { t: 'Bojuji o každé procento', r: 'fun' }, { t: 'Telefon to vzdá dřív než já', r: 'travel' }] },
        { q: 'Kde je váš telefon nejčastěji?', options: [{ t: 'V ruce', r: 'photo' }, { t: 'Na nabíječce', r: 'fun' }, { t: 'Někde na dně tašky', r: 'clumsy' }] },
      ],
      results: {
        clumsy: { title: 'Nešika', text: 'Pády jsou vaše disciplína. Doporučujeme odolný obal a tvrzené sklo.', links: [{ label: 'Pouzdra a kryty', url: SHOP + 'Pouzdra-a-kryty-10163/' }, { label: 'Skla a fólie', url: SHOP + 'Skla-a-folie-10164/' }] },
        travel: { title: 'Cestovatel', text: 'Pořád v pohybu a baterie na hraně. Doporučujeme powerbanku a držák do auta.', links: [{ label: 'Powerbanky', url: SHOP + 'Powerbanky/' }, { label: 'Do auta', url: SHOP + 'Do-auta/' }] },
        fun: { title: 'Milovník zábavy', text: 'Telefon je vaše kino i koncertní sál. Doporučujeme bezdrátová sluchátka.', links: [{ label: 'Bezdrátová sluchátka', url: SHOP + 'Bezdratova-15258/' }] },
        photo: { title: 'Fotograf', text: 'Na ostré fotky potřebujete čistou čočku a celý displej. Doporučujeme tvrzené sklo a čisticí hadřík.', links: [{ label: 'Skla a fólie', url: SHOP + 'Skla-a-folie-10164/' }] },
      },
    },
  },
  {
    day: 21, type: 'offer', title: 'Balíček „Jako z krabice“',
    text: `Nový obal, nové sklo a telefon čistý jako v den, kdy jste ho vybalili.

Kupte si u nás tvrzené sklo a obal a čištění telefonu máte zdarma.

Ukažte toto okénko na pobočce. Platí do 31. 12.`,
    coupon: { code: 'MAJAK-21', value: 'Čištění telefonu zdarma ke tvrzenému sklu a obalu', valid: 'Platí do 31. 12.' },
    ...branches,
  },
  {
    day: 22, type: 'tip', title: 'Rozbitý mobil před Vánoci?',
    text: `Telefon spadl při zdobení stromečku? Nic se neděje.

Většinu oprav zvládneme na počkání. A pokud oprava potrvá déle, půjčíme vám zdarma náhradní telefon, abyste o svátcích nezůstali bez spojení.`,
    more: `Otevírací doba o svátcích:
24. 12.: do 12:00
25.–26. 12.: zavřeno
27.–30. 12.: běžná otevírací doba
31. 12.: do 18:00

V neděli 27. 12. je pobočka Olomouc Senimo zavřená a pobočka Vsetín má otevřeno do 17:00.`,
    url: BRANCHES_URL, urlLabel: 'Pobočky a otevírací doba',
  },
  {
    day: 23, type: 'offer', title: 'Bonus za váš starý telefon',
    text: `Starý telefon v šuplíku vám nic nepřinese. U nás ano.

Kupte si nový telefon, ten starý nám prodejte a k výkupní ceně dostanete bonus 100 Kč. S věrnostní kartou až 500 Kč, které utratíte u nás na pobočce.

Platí do 24. 12.`,
    coupon: { code: 'MAJAK-23', value: 'Bonus 100 Kč k výkupu, s věrnostní kartou až 500 Kč na nákup na pobočce', valid: 'Při koupi nového telefonu, platí do 24. 12.' },
    ...branches,
  },
  {
    day: 24, type: 'finale', title: 'Krásné Vánoce od Mobil Majáku',
    text: `Děkujeme, že jste s námi otevírali adventní okénka.

Dnes losujeme výherce sluchátek Marshall Major V. Výherci pošleme e-mail ještě dnes.

A protože k Vánocům patří dárky pro všechny, máme jeden i pro vás: povánoční kontrolu telefonu zdarma. Stačí přijít s telefonem na kteroukoli pobočku do 31. 1. 2027.`,
    coupon: { code: 'MAJAK-24', value: 'Povánoční kontrola telefonu zdarma', valid: 'Platí do 31. 1. 2027' },
    more: `Krásné Vánoce a ať vám telefon slouží celý příští rok. A kdyby ne, víte, kde nás najdete.

Váš Mobil Maják`,
    ...branches,
  },
];

/** soutěž je ještě otevřená (v náhledu vždy) */
export const contestOpen = (until: string, now = Date.now()) => now <= Date.parse(until);

export function availableDay(now = new Date()): number {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Prague', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const get = (n: string) => Number(parts.find((x) => x.type === n)?.value);
  const y = get('year'), m = get('month'), d = get('day');
  if (y < YEAR || (y === YEAR && m < 12)) return 0;
  if (y > YEAR) return 24;
  return Math.min(24, d);
}
