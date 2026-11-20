"use strict";

const kSchemePrefix = "bazarish://";
const kMainSite = "https://bazarish.org/";
const kI2pSite = "http://bazarish.i2p/";
const kDownloadAnchor = "#download";
const kDefaultLanguage = "en";
const kChosenLanguageKey = "language";
const kRightToLeft = new Set(["ar"]);
// The challenge's freshness window, docs-main api/SignInWithKey.md section 2.
const kLoginWindowSeconds = 300;
const kFingerprintGroup = 4;
const kMillisPerSecond = 1000;

const kText = {
    en: {
        language: "English",
        homeTitle: "Bazarish messenger",
        homeLead: "bazari.sh links open internal links in it.",
        download: "Download Bazarish",
        open: "Open in Bazarish",
        note: "Everything in the link after # stays in the browser and is not sent to the server.",
        inviteTitle: "Invitation to Bazarish",
        serverTitle: "Bazarish server",
        pairTitle: "Device pairing",
        pairLead: "Open this link on the new device. The code is shown on the device where the account is already open.",
        gatewayTitle: "External gateway",
        gatewayAddress: "Address",
        gatewayPath: "Path",
        key: "Key",
        signTitle: "Sign-in with a key",
        fingerprint: "Fingerprint",
        entryPoints: "Entry points",
        addresses: "Addresses",
        role: "Role",
        validUntil: "Valid until",
        challengeAddress: "Challenge address",
        destination: "I2P destination",
        reseeds: "Reseeds",
        nonce: "Nonce",
        issued: "Issued",
        tag: "Tag",
        callback: "Callback",
        unknown: "This is not a Bazarish link.",
        broken: "This link is incomplete or damaged.",
    },
    ru: {
        language: "Русский",
        homeTitle: "Мессенджер Bazarish",
        homeLead: "Ссылки bazari.sh открывают в нём внутренние ссылки.",
        download: "Скачать Bazarish",
        open: "Открыть в Bazarish",
        note: "Всё в ссылке после # остаётся в браузере и не отправляется на сервер.",
        inviteTitle: "Приглашение в Bazarish",
        serverTitle: "Сервер Bazarish",
        pairTitle: "Подключение устройства",
        pairLead: "Откройте ссылку на новом устройстве. Код показан на устройстве, где аккаунт уже открыт.",
        gatewayTitle: "Внешний шлюз",
        gatewayAddress: "Адрес",
        gatewayPath: "Путь",
        key: "Ключ",
        signTitle: "Вход с ключом",
        fingerprint: "Отпечаток",
        entryPoints: "Точки входа",
        addresses: "Адреса",
        role: "Роль",
        validUntil: "Действует до",
        challengeAddress: "Адрес запроса",
        destination: "Назначение I2P",
        reseeds: "Ресиды",
        nonce: "Одноразовый номер",
        issued: "Выдан",
        tag: "Метка",
        callback: "Адрес ответа",
        unknown: "Это не ссылка Bazarish.",
        broken: "Ссылка неполная или повреждена.",
    },
    es: {
        language: "Español",
        homeTitle: "Mensajero Bazarish",
        homeLead: "Los enlaces de bazari.sh abren en él enlaces internos.",
        download: "Descargar Bazarish",
        open: "Abrir en Bazarish",
        note: "Todo lo que va después de # en el enlace se queda en el navegador y no se envía al servidor.",
        inviteTitle: "Invitación a Bazarish",
        serverTitle: "Servidor de Bazarish",
        pairTitle: "Vinculación de dispositivo",
        pairLead: "Abre este enlace en el dispositivo nuevo. El código aparece en el dispositivo donde la cuenta ya está abierta.",
        gatewayTitle: "Pasarela externa",
        gatewayAddress: "Dirección",
        gatewayPath: "Ruta",
        key: "Clave",
        signTitle: "Inicio de sesión con clave",
        fingerprint: "Huella",
        entryPoints: "Puntos de entrada",
        addresses: "Direcciones",
        role: "Rol",
        validUntil: "Válido hasta",
        challengeAddress: "Dirección de la solicitud",
        destination: "Destino I2P",
        reseeds: "Reseeds",
        nonce: "Nonce",
        issued: "Emitido",
        tag: "Etiqueta",
        callback: "Dirección de respuesta",
        unknown: "Esto no es un enlace de Bazarish.",
        broken: "El enlace está incompleto o dañado.",
    },
    zh: {
        language: "中文",
        homeTitle: "Bazarish 即时通讯",
        homeLead: "bazari.sh 链接在其中打开内部链接。",
        download: "下载 Bazarish",
        open: "在 Bazarish 中打开",
        note: "链接中 # 之后的内容只留在浏览器中，不会发送到服务器。",
        inviteTitle: "Bazarish 邀请",
        serverTitle: "Bazarish 服务器",
        pairTitle: "设备配对",
        pairLead: "请在新设备上打开此链接。验证码显示在已打开该账户的设备上。",
        gatewayTitle: "外部网关",
        gatewayAddress: "地址",
        gatewayPath: "路径",
        key: "密钥",
        signTitle: "使用密钥登录",
        fingerprint: "指纹",
        entryPoints: "入口",
        addresses: "地址",
        role: "角色",
        validUntil: "有效期至",
        challengeAddress: "请求地址",
        destination: "I2P 目的地",
        reseeds: "Reseed 地址",
        nonce: "随机数",
        issued: "签发时间",
        tag: "标签",
        callback: "回调地址",
        unknown: "这不是 Bazarish 链接。",
        broken: "此链接不完整或已损坏。",
    },
    ar: {
        language: "العربية",
        homeTitle: "تطبيق المراسلة Bazarish",
        homeLead: "تفتح روابط bazari.sh فيه روابط داخلية.",
        download: "تنزيل Bazarish",
        open: "فتح في Bazarish",
        note: "يبقى كل ما بعد # في الرابط داخل المتصفح ولا يُرسل إلى الخادم.",
        inviteTitle: "دعوة إلى Bazarish",
        serverTitle: "خادم Bazarish",
        pairTitle: "ربط جهاز",
        pairLead: "افتح هذا الرابط على الجهاز الجديد. يظهر الرمز على الجهاز الذي فُتح عليه الحساب.",
        gatewayTitle: "بوابة خارجية",
        gatewayAddress: "العنوان",
        gatewayPath: "المسار",
        key: "المفتاح",
        signTitle: "تسجيل الدخول بالمفتاح",
        fingerprint: "البصمة",
        entryPoints: "نقاط الدخول",
        addresses: "العناوين",
        role: "الدور",
        validUntil: "صالح حتى",
        challengeAddress: "عنوان الطلب",
        destination: "وجهة I2P",
        reseeds: "مصادر البذر",
        nonce: "الرقم العشوائي",
        issued: "صدر في",
        tag: "الوسم",
        callback: "عنوان الرد",
        unknown: "هذا ليس رابط Bazarish.",
        broken: "هذا الرابط ناقص أو تالف.",
    },
};

let language = chooseLanguage();

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("lang").hidden = false;
    for (const button of document.querySelectorAll("[data-lang]")) {
        button.addEventListener("click", () => {
            setLanguage(button.dataset.lang);
            button.closest("details").open = false;
        });
    }
    render();
});
addEventListener("hashchange", render);

function storedLanguage() {
    try {
        return localStorage.getItem(kChosenLanguageKey);
    } catch (error) {
        return null;
    }
}

function chooseLanguage() {
    const stored = storedLanguage();
    if (stored in kText) {
        return stored;
    }
    for (const wanted of navigator.languages || []) {
        const code = wanted.toLowerCase().split("-")[0];
        if (code in kText) {
            return code;
        }
    }
    return kDefaultLanguage;
}

function storeLanguage(code) {
    try {
        localStorage.setItem(kChosenLanguageKey, code);
    } catch (error) {
        return false;
    }
    return true;
}

function setLanguage(code) {
    language = code;
    storeLanguage(code);
    render();
}

function t(key) {
    return kText[language][key];
}

function sitePage(site) {
    return language === kDefaultLanguage ? site : `${site}${language}/`;
}

function mainSitePage() {
    return sitePage(kMainSite);
}

function tail() {
    return location.hash.slice(1);
}

function queryOf(text) {
    const fields = new Map();
    for (const pair of text.split("&")) {
        const eq = pair.indexOf("=");
        if (eq <= 0) {
            continue;
        }
        const key = pair.slice(0, eq);
        const value = decodeURIComponent(pair.slice(eq + 1));
        fields.set(key, (fields.get(key) || []).concat(value));
    }
    return fields;
}

function first(fields, key) {
    const values = fields.get(key);
    return values ? values[0] : "";
}

function groupedFingerprint(fingerprint) {
    const groups = [];
    for (let i = 0; i < fingerprint.length; i += kFingerprintGroup) {
        groups.push(fingerprint.slice(i, i + kFingerprintGroup));
    }
    return groups.join(" ");
}

function decodeBase64Url(text) {
    const padded = text.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(padded + "=".repeat((4 - padded.length % 4) % 4));
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

function describe(link) {
    try {
        return describeKind(link);
    } catch (error) {
        return { title: t("broken") };
    }
}

function describeKind(link) {
    const query = link.indexOf("?");
    if (query < 0) {
        return { title: t("unknown") };
    }
    const kind = link.slice(0, query);
    const fields = queryOf(link.slice(query + 1));
    if (kind === "invite") {
        if (!first(fields, "fp") || !first(fields, "dest")) {
            return { title: t("broken") };
        }
        const name = first(fields, "name");
        return {
            kind: name ? t("inviteTitle") : "",
            title: name || t("inviteTitle"),
            rows: rowsOf(fields),
            openable: true,
        };
    }
    if (kind === "server") {
        if (!first(fields, "fp") || !fields.has("facade")) {
            return { title: t("broken") };
        }
        return { title: t("serverTitle"), rows: rowsOf(fields), openable: true };
    }
    if (kind === "pair") {
        if (!first(fields, "dest")) {
            return { title: t("broken") };
        }
        return { title: t("pairTitle"), lead: t("pairLead"), rows: rowsOf(fields), openable: true };
    }
    if (kind === "gateway") {
        const url = first(fields, "url");
        if (!url || !first(fields, "fp")) {
            return { title: t("broken") };
        }
        return {
            title: t("gatewayTitle"),
            rows: [
                [t("gatewayAddress"), new URL(url).host, true],
                [t("gatewayPath"), new URL(url).pathname, true],
                [t("key"), first(fields, "fp"), true],
            ],
            openable: true,
        };
    }
    if (kind === "sign") {
        return describeSign(fields);
    }
    return { title: t("unknown") };
}

const kShownElsewhere = new Set(["v", "name"]);

const kFieldLabels = {
    fp: "fingerprint",
    dest: "destination",
    key: "key",
    facade: "entryPoints",
    reseed: "reseeds",
};

function rowsOf(fields) {
    const rows = [];
    for (const [key, values] of fields) {
        if (kShownElsewhere.has(key)) {
            continue;
        }
        const label = key in kFieldLabels ? t(kFieldLabels[key]) : key;
        const shown = key === "fp" ? values.map(groupedFingerprint) : values;
        rows.push([label, shown.join("\n"), true]);
    }
    return rows;
}

function describeSign(fields) {
    const at = first(fields, "at");
    if (at) {
        return {
            title: t("signTitle"),
            rows: [[t("challengeAddress"), `http://${at}`, true]],
            openable: true,
        };
    }
    const envelope = JSON.parse(decodeBase64Url(first(fields, "c")));
    const consumer = envelope.consumer;
    if (!consumer || typeof consumer.name !== "string" || !Array.isArray(consumer.place)
        || typeof consumer.role !== "string" || !Number.isInteger(envelope.ts)) {
        return { title: t("broken") };
    }
    const when = (seconds) => new Date(seconds * kMillisPerSecond).toLocaleString(language);
    const rows = [
        [t("addresses"), consumer.place.join("\n"), true],
        [t("role"), consumer.role, false],
        [t("issued"), when(envelope.ts), false],
        [t("validUntil"), when(envelope.ts + kLoginWindowSeconds), false],
        [t("nonce"), String(envelope.nonce), true],
        [t("tag"), String(envelope.tag), true],
    ];
    if (envelope.callback) {
        rows.push([t("callback"), String(envelope.callback), true]);
    }
    const shown = new Set(["v", "nonce", "ts", "consumer", "tag", "callback"]);
    for (const [key, value] of Object.entries(envelope)) {
        if (!shown.has(key)) {
            rows.push([key, JSON.stringify(value), true]);
        }
    }
    return { kind: t("signTitle"), title: consumer.name, rows, openable: true };
}

function render() {
    const root = document.documentElement;
    root.lang = language;
    root.dir = kRightToLeft.has(language) ? "rtl" : "ltr";
    document.getElementById("lang-current").textContent = t("language");
    for (const button of document.querySelectorAll("[data-lang]")) {
        button.setAttribute("aria-current", String(button.dataset.lang === language));
    }
    document.getElementById("home").href = mainSitePage();
    document.getElementById("foot-site").href = mainSitePage();
    document.getElementById("foot-i2p").href = sitePage(kI2pSite);

    const link = tail();
    const view = link ? describe(link) : { title: t("homeTitle"), lead: t("homeLead") };
    const kind = document.getElementById("kind");
    kind.hidden = !view.kind;
    kind.textContent = view.kind || "";
    document.getElementById("title").textContent = view.title;
    const lead = document.getElementById("lead");
    lead.hidden = !view.lead;
    lead.textContent = view.lead || "";
    fillRows(view.rows || []);

    const open = document.getElementById("open");
    open.hidden = !view.openable;
    open.textContent = t("open");
    if (view.openable) {
        open.href = kSchemePrefix + link;
    } else {
        open.removeAttribute("href");
    }

    for (const id of ["download", "download-also"]) {
        const download = document.getElementById(id);
        download.textContent = t("download");
        download.href = mainSitePage() + kDownloadAnchor;
    }
    document.getElementById("download").hidden = Boolean(view.openable);
    document.getElementById("download-also").hidden = !view.openable;

    document.getElementById("note").textContent = t("note");
}

function fillRows(rows) {
    const list = document.getElementById("fields");
    list.replaceChildren();
    for (const [label, value, mono] of rows) {
        const term = document.createElement("dt");
        term.textContent = label;
        const detail = document.createElement("dd");
        const text = document.createElement("bdi");
        text.textContent = value;
        if (mono) {
            detail.className = "mono";
        }
        detail.append(text);
        list.append(term, detail);
    }
    list.hidden = rows.length === 0;
}

