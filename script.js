// =====================================================================
// 編集ゾーン：問題を追加・修正するときはここだけを編集
// =====================================================================

const LESSON_TITLE = "Lesson 12　不定詞③（SVO＋不定詞）";

// 学習記録：スプレッドシートの「Lesson」列に記録する名前
const LESSON_ID = "Lesson 12";

// 学習記録の送信先（Google Apps Script のウェブアプリ URL を "" の中に貼る）。空のままなら記録は送らない
const LOG_URL = "https://script.google.com/macros/s/AKfycbzmgGcLSJc50ijxHDKUCTmUPB8dhkbjAKqpgby6tvqltto-PMfC2qTDAHjoYE36-NHI/exec";

// 最初に選べる問題数（収録問題数を超える数は「全問」の数に置きかえて表示）
const COUNT_OPTIONS = [10, 20, 30];

// 指示文：問題の inst（なければ type）で選ばれる
const INSTRUCTIONS = {
  form:         "日本語に合うように，［ ］の語を使って英文を完成させるとき，（ ）に入る語の組み合わせを選びなさい。",
  translate:    "次の英文を日本語にするとき，（ ）に入る語句を選びなさい。",
  blanks:       "日本語に合うように，（　）に入る語を選びなさい。動詞は枠内の語群から選ぶこと。",
  order:        "日本語，または【状況】に合うように，語句を並べかえなさい。",
  orderMeaning: "意味の通る英文になるように，語句を並べかえなさい。"
};

// 語群（box：枠内に表示する文字，choices：語群から選ぶ空欄の選択肢）
const BOX_5 = { box: "carry / open / help / stop / know / move", choices: ["carry", "open", "help", "stop", "know", "move"] };

// type: "form"   … template の {} に入る語の組み合わせを3択で選ぶ（answer と dummies 2つ，いずれも {} の数と同じ長さの配列）
// type: "order"  … chunks（語群）を並べかえ（answer が正しい順番）。文頭チャンクは小文字で保存し表示時に大文字化
// type: "blanks" … template の {} ごとに選択。verb: true の空欄は語群（words の choices）から，それ以外は answer＋dummies の3択
// verb: ［ ］内に示す語句，words: 語群，ja: 問題文の日本語／状況（英文和訳では英文），trans: 答え合わせ後に表示する訳，note: 答え合わせ後に表示する解説
// 文頭の {} に入る語は小文字で保存（表示時に大文字化）

const QUESTIONS = [
  // ---- 1 ----
  { src: "1 ⑴", type: "form", ja: "先生はみんなに落ち着くように言った。", verb: "calm",
    template: "The teacher {} everyone {} {} down.",
    answer: ["told", "to", "calm"], dummies: [["said", "to", "calm"], ["told", "to", "calming"]],
    note: "〈tell＋人＋to＋動詞の原形〉で「（人）に～するように言う」。The teacher told everyone to calm down で「先生はみんなに落ち着くように言った」。\nsay は say to＋人 の形で使い，say＋人＋to ～ とはしない。calm down は「落ち着く」。" },
  { src: "1 ⑵", type: "form", ja: "あなたは私に何をしてほしいのですか。", verb: "do",
    template: "What do you {} {} {} {}?",
    answer: ["want", "me", "to", "do"], dummies: [["want", "I", "to", "do"], ["want", "to", "me", "do"]],
    note: "〈want＋人＋to＋動詞の原形〉で「（人）に～してほしい」。What do you want me to do? で「あなたは私に何をしてほしいのですか」。\nwant のあとの「人」は目的格なので，I ではなく me。「人」は want と to の間に置く。" },
  { src: "1 ⑶", type: "form", ja: "私は彼に，そのドアを開けないように頼んだ。", verb: "open",
    template: "I {} him {} {} {} the door.",
    answer: ["asked", "not", "to", "open"], dummies: [["asked", "to", "not", "open"], ["said", "not", "to", "open"]],
    note: "〈ask＋人＋to＋動詞の原形〉で「（人）に～するように頼む」。「～しないように」と頼むときは，to の直前に not を置いて ask＋人＋not to ～ とする。\nnot の位置（to の前）に注意。" },
  { src: "1 ⑷", type: "form", ja: "両親は私がネットの動画を見てほしくない。", verb: "watch",
    template: "My parents don’t {} me {} {} online videos.",
    answer: ["want", "to", "watch"], dummies: [["wants", "to", "watch"], ["want", "to", "watching"]],
    note: "〈want＋人＋to＋動詞の原形〉「（人）に～してほしい」の否定文。don’t のあとなので want は原形（wants は誤り）。\nto のあとは原形 watch。online videos は「ネットの動画」。" },

  // ---- 2 ----
  { src: "2 ⑴", type: "order", inst: "orderMeaning",
    before: "You are", after: "ball in this park.",
    chunks: ["play", "not", "to", "allowed"],
    answer: ["not", "allowed", "to", "play"],
    trans: "この公園でボール遊びすることは許されていない。",
    note: "〈allow＋人＋to＋動詞の原形〉「（人）が～するのを許す」の受動態は，〈人＋be allowed to＋動詞の原形〉「～することを許されている」。否定の not は allowed の前に置いて are not allowed to play とする。\nplay ball は「ボール遊びをする」。" },
  { src: "2 ⑵", type: "order", inst: "orderMeaning",
    before: "No one", after: "during the examination.",
    chunks: ["speak", "permitted", "is", "to"],
    answer: ["is", "permitted", "to", "speak"],
    trans: "試験中にしゃべることはだれも許されていない。",
    note: "〈permit＋人＋to＋動詞の原形〉「（人）が～するのを許可する」の受動態〈be permitted to ～〉。No one is permitted to speak で「だれもしゃべることを許されていない」。\nNo one（だれも～ない）は単数扱いなので is。" },
  { src: "2 ⑶", type: "order", inst: "orderMeaning",
    before: "Hard work", after: "her dream university.",
    chunks: ["enabled", "to", "her", "enter"],
    answer: ["enabled", "her", "to", "enter"],
    trans: "一生懸命努力したおかげで，彼女は夢の大学に入学することができた。",
    note: "〈enable＋人＋to＋動詞の原形〉で「（人）が～することを可能にする」。Hard work enabled her to enter ～ は，直訳すると「一生懸命な努力が，彼女が～に入学することを可能にした」。\nenter は「（学校）に入学する」。" },
  { src: "2 ⑷", type: "order", inst: "orderMeaning",
    before: "I", after: "my English essay.",
    chunks: ["Tom", "check", "to", "got"],
    answer: ["got", "Tom", "to", "check"],
    trans: "トムに私の英作文を確認してもらった。",
    note: "〈get＋人＋to＋動詞の原形〉で「（人）に～してもらう」。got Tom to check my English essay で「トムに英作文を確認してもらった」。\n同じ意味の〈have＋人＋動詞の原形〉とちがい，get のときは to が必要。" },

  // ---- 3 ----
  { src: "3 ⑴", type: "order", ja: "妹は私に宿題を手伝ってほしがった。",
    before: "My sister", after: "with her homework.",
    chunks: ["me", "to", "wanted", "her", "help"],
    answer: ["wanted", "me", "to", "help", "her"],
    note: "〈want＋人＋to＋動詞の原形〉「（人）に～してほしい」。wanted me to help her で「私に彼女を手伝ってほしがった」。\nhelp A with B は「A の B を手伝う」。" },
  { src: "3 ⑵", type: "order", ja: "医者は彼に，食べ過ぎないようにアドバイスした。",
    before: "The doctor", after: "too much.",
    chunks: ["eat", "him", "to", "advised", "not"],
    answer: ["advised", "him", "not", "to", "eat"],
    note: "〈advise＋人＋to＋動詞の原形〉で「（人）に～するように忠告する」。「～しないように」は to の直前に not を置いて advised him not to eat とする。\neat too much は「食べすぎる」。" },
  { src: "3 ⑶", type: "order", ja: "その男の子は，1 か月の間毎日，皿洗いをするように言われた。",
    before: "The boy", after: "every day for a month.",
    chunks: ["wash", "told", "to", "the dishes", "was"],
    answer: ["was", "told", "to", "wash", "the dishes"],
    note: "〈tell＋人＋to＋動詞の原形〉「（人）に～するように言う」の受動態は，〈人＋be told to＋動詞の原形〉「～するように言われる」。was told to wash the dishes で「皿洗いをするように言われた」。\nwash the dishes は「皿洗いをする」。" },
  { src: "3 ⑷", type: "order", ja: "【状況】駅への行き方がわからず困っている旅行者がいたので，声をかけました。",
    before: "“Would you", after: "the way to the station?”",
    chunks: ["to", "like", "you", "me", "show"],
    answer: ["like", "me", "to", "show", "you"],
    trans: "「駅への行き方をご案内しましょうか」",
    note: "〈would like＋人＋to＋動詞の原形〉で「（人）に～してほしい」（want よりていねいな言い方）。Would you like me to ～? で「私が～しましょうか」という申し出になる。\nshow A the way to ～ は「A に～への道を案内する」。" },
  { src: "3 ⑸", type: "order", ja: "【状況】部外者立ち入り禁止の部屋にうっかり入ったら，中にいた人にどなられました。",
    before: "“Who", after: "? Get out!”",
    chunks: ["come", "allowed", "in", "you", "to"],
    answer: ["allowed", "you", "to", "come", "in"],
    trans: "「だれが入っていいと許可したんだ？ 出ていけ！」",
    note: "〈allow＋人＋to＋動詞の原形〉「（人）が～するのを許す」。Who allowed you to come in? で「だれがあなたが入ることを許したのか」。Who が主語なので，そのあとにそのまま動詞 allowed を続ける。\ncome in は「入る」。" },

  // ---- 5 ----
  { src: "5 ⑴", type: "blanks", words: BOX_5, ja: "あなたの新しい住所をすぐ私に知らせてください。",
    template: "Please {} me {} your new address at once.",
    blanks: [ { answer: "let", dummies: ["tell", "allow"] }, { answer: "know", verb: true } ],
    note: "〈let＋人＋動詞の原形〉で「（人）に～させてやる」。let me know で「私に知らせる」。let のあとは to のない動詞の原形。\ntell や allow は〈人＋to＋動詞の原形〉の形をとるので，to のない know とはつながらない。at once は「すぐに」。" },
  { src: "5 ⑵", type: "blanks", words: BOX_5, ja: "警官はその男にスーツケースを開けさせた。",
    template: "The police officer {} the man {} his suitcase.",
    blanks: [ { answer: "made", dummies: ["told", "wanted"] }, { answer: "open", verb: true } ],
    note: "〈make＋人＋動詞の原形〉で「（人）に（無理に）～させる」。made the man open his suitcase で「その男にスーツケースを開けさせた」。make のあとは to のない原形。\ntell や want は〈人＋to＋動詞の原形〉の形をとるので，ここには合わない。" },
  { src: "5 ⑶", type: "blanks", words: BOX_5, ja: "だれかにこれらの箱を全部，下の階に運んでもらいます。",
    template: "I’ll {} someone {} all these boxes downstairs.",
    blanks: [ { answer: "have", dummies: ["want", "ask"] }, { answer: "carry", verb: true } ],
    note: "〈have＋人＋動詞の原形〉で「（人）に～してもらう」。have someone carry ～ で「だれかに～を運んでもらう」。\nwant や ask は〈人＋to＋動詞の原形〉の形をとる。downstairs は「下の階へ」という意味なので，to はつけない。" },
  { src: "5 ⑷", type: "blanks", words: BOX_5, ja: "彼女は，家の前で１台のタクシーが止まるのを見た。",
    template: "She {} a taxi {} in front of her house.",
    blanks: [ { answer: "saw", dummies: ["looked", "showed"] }, { answer: "stop", verb: true } ],
    note: "〈see＋人・もの＋動詞の原形〉で「（人・もの）が～するのを見る」。saw a taxi stop で「タクシーが止まるのを見た」。see のあとは to のない原形。\nlook は look at ～ の形で使うので，ここでは使えない。" },
  { src: "5 ⑸", type: "blanks", words: BOX_5, ja: "クリスは父親の仕事を手伝わされた。",
    template: "Chris was {} {} {} his father with his work.",
    blanks: [ { answer: "made", dummies: ["make", "making"] }, { answer: "to", dummies: ["for", "of"] }, { answer: "help", verb: true } ],
    note: "〈make＋人＋動詞の原形〉「（人）に～させる」を受動態にすると，〈人＋be made to＋動詞の原形〉「～させられる」となり，to が必要になる。was made to help で「手伝わされた」。\nhelp A with B は「A の B を手伝う」。" },
  { src: "5 ⑹", type: "blanks", words: BOX_5, ja: "私たちはユキが新しいアパートに引っ越すのを手伝った。",
    template: "We helped {} {} into her new apartment.",
    blanks: [ { answer: "Yuki", dummies: ["for", "of"] }, { answer: "move", verb: true } ],
    note: "〈help＋人＋動詞の原形〉で「（人）が～するのを手伝う」（help＋人＋to＋動詞の原形 でもよい）。helped Yuki move into ～ で「ユキが～に引っ越すのを手伝った」。\nmove into ～ は「～に引っ越す」。" },

  // ---- 6 ----
  { src: "6 ⑴", type: "form", inst: "translate", ja: "It’s pleasant to be sitting here with you.",
    template: "ここであなたと（{}）。",
    answer: ["座っているのは楽しい"], dummies: [["座っていたのは楽しかった"], ["座るのは楽しいだろう"]],
    note: "〈to be＋～ing〉は不定詞の進行形で，「（今）～していること」を表す。It’s pleasant to be sitting here with you. は「ここであなたと（今）座っているのは楽しい」。\nIt’s（= It is）は現在の文なので，「楽しかった」（過去）や「楽しいだろう」（未来）にはならない。" },
  { src: "6 ⑵", type: "form", inst: "translate", ja: "I don’t like to be talked to when I’m studying.",
    template: "私は勉強中に（{}）。",
    answer: ["話しかけられるのが好きではない"], dummies: [["話しかけるのが好きではない"], ["話しかけられたことがない"]],
    note: "〈to be＋過去分詞〉は不定詞の受動態で，「～されること」を表す。to be talked to で「話しかけられること」。don’t like は「好きではない」。\nto talk to なら「話しかけること」になる。when I’m studying は「勉強しているとき」。" },
  { src: "6 ⑶", type: "form", inst: "translate", ja: "She seems to have forgotten my name.",
    template: "彼女は（{}）。",
    answer: ["私の名前を忘れてしまったようだ"], dummies: [["私の名前を忘れているように見えた"], ["私の名前を忘れそうだ"]],
    note: "〈seem to have＋過去分詞〉は「～したようだ」と，前にしたことについて今そう見えることを表す。seems to have forgotten で「（前に）忘れてしまったようだ」。\nseems は現在なので「見えた」ではなく「ようだ」。seem to forget なら「忘れるようだ」になる。" },

  // ---- 7 ----
  { src: "7 ⑴", type: "order", ja: "彼女はいつも家の裏庭で，イヌを自由に走らせている。",
    before: "She always", after: "the backyard of her house.",
    chunks: ["her dog", "run freely", "in", "lets"],
    answer: ["lets", "her dog", "run freely", "in"],
    note: "〈let＋人・もの＋動詞の原形〉で「（人・もの）に（自由に）～させてやる」。lets her dog run freely で「イヌを自由に走らせている」。let のあとは to のない原形。\nShe が主語で現在の文なので lets。" },
  { src: "7 ⑵", type: "order", ja: "私はレイが失敗について文句を言うのを聞いたことがない。",
    before: "I’ve", after: "her failures.",
    chunks: ["complain", "Rei", "heard", "about", "never"],
    answer: ["never", "heard", "Rei", "complain", "about"],
    note: "〈hear＋人＋動詞の原形〉で「（人）が～するのを聞く」。I’ve never heard Rei complain about ～ で「レイが～について文句を言うのを聞いたことがない」。\nnever は have と過去分詞の間に置く。complain about ～ は「～について不満を言う」。" },
  { src: "7 ⑶", type: "order", ja: "ダンは，何かほかのことを考えているようだ。",
    before: "Dan", after: "something else.",
    chunks: ["thinking", "to", "of", "seems", "be"],
    answer: ["seems", "to", "be", "thinking", "of"],
    note: "〈seem to＋動詞の原形〉で「～するようだ」。進行形を入れて seem to be ～ing にすると，「（今）～しているようだ」になる。seems to be thinking of ～ で「～のことを考えているようだ」。\nthink of ～ は「～について考える」。" },
  { src: "7 ⑷", type: "order", ja: "【状況】迷っていた友人がとうとう留学する決心をしたので，理由をたずねました。",
    before: "What", after: "abroad?",
    chunks: ["you", "made", "to", "decide", "study"],
    answer: ["made", "you", "decide", "to", "study"],
    trans: "何があなたに留学を決意させたのですか。",
    note: "〈make＋人＋動詞の原形〉「（人）に～させる」。What made you decide ～? は，直訳すると「何があなたに～を決意させたのか」。What が主語なので，そのあとにそのまま made を続ける。\ndecide to study abroad は「留学することを決める」。" }
];

// 全体共通の語群（問題ごとの words がないときに使う）
const VERB_BOX = "";
const VERB_CHOICES = [];

// =====================================================================
// ここから下はロジック（通常は編集不要）
// =====================================================================

// 旧形式（before / answer / after）の form 問題を template 形式にそろえる
QUESTIONS.forEach(q => {
  if (q.type === "form" && !q.template) {
    q.template = [q.before, "{}", q.after].filter(Boolean).join(" ");
    q.answer = [q.answer];
    q.dummies = q.dummies.map(d => [d]);
  }
});

const app = document.getElementById("app");
const progressEl = document.getElementById("progress");

let queue = [];    // 出題する問題（QUESTIONS のインデックス）
let records = [];  // 各問の解答状態 { result, choice, sels, picked, pool }
let pos = 0;
let studentId = "";
let sessionLabel = "";  // 記録用：出題数（例：「10問」「復習5問」）

// ---------- 学籍番号の保存（この端末のブラウザに記憶） ----------
function loadId() {
  try { return localStorage.getItem("studentId") || ""; } catch (e) { return ""; }
}
function saveId(id) {
  try { localStorage.setItem("studentId", id); } catch (e) {}
}

// ---------- 学習記録の送信 ----------
const RESULT_LABELS = { correct: "正解", wrong: "不正解", skipped: "とばした" };

function chosenText(q, rec) {
  if (rec.result === "skipped") return "";
  if (q.type === "form") return optionLabel(q, rec.options[rec.choice]);
  if (q.type === "blanks") return rec.sels.join(" / ");
  return rec.picked.map(pi => rec.pool[pi]).join(" ");
}

function sendLog(q, rec) {
  if (!LOG_URL) return;
  const body = JSON.stringify({
    student: studentId,
    lesson: LESSON_ID,
    question: q.src,
    result: RESULT_LABELS[rec.result],
    choice: chosenText(q, rec),
    count: sessionLabel
  });
  try {
    fetch(LOG_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body })
      .catch(() => {});
  } catch (e) {}
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

function esc(s) {
  return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function joinSentence(parts) {
  return parts.filter(Boolean).join(" ").replace(/ ([.,?!])/g, "$1");
}

function fullAnswer(q) {
  if (q.type === "form") return fillTemplate(q.template, q.answer);
  if (q.type === "order") return cap(joinSentence([q.before, ...q.answer, q.after]));
  return fillTemplate(q.template, q.blanks.map(b => b.answer));
}

function fillTemplate(template, words) {
  let i = 0;
  return cap(template.replace(/\{\}/g, () => words[i++]));
}

// 選択肢の表示：隣り合う空所はスペース，離れた空所は「…」でつなぐ
function optionLabel(q, words) {
  const parts = q.template.split("{}");
  const atStart = q.template.startsWith("{}");
  return words.map((w, k) => (k === 0 && atStart ? cap(w) : w) +
    (k < words.length - 1 ? (parts[k + 1].trim() === "" ? " " : " … ") : "")).join("");
}

// 文頭にくる語句だけ大文字で表示
function displayChunk(q, text, isFirst) {
  return isFirst && !q.before ? cap(text) : text;
}

// 答え合わせ済み、またはとばした問題は解答を確定（解説を表示）
function isChecked(rec) { return !!rec.result; }

// 練習を始めたときに1行送る（sessions シート用）
function sendSession() {
  if (!LOG_URL) return;
  const body = JSON.stringify({ type: "session", student: studentId, lesson: LESSON_ID, count: sessionLabel });
  try {
    fetch(LOG_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body })
      .catch(() => {});
  } catch (e) {}
}

// ---------- 画面：問題数の選択 ----------
function renderHome() {
  progressEl.textContent = "";
  const counts = [...new Set(COUNT_OPTIONS.map(n => Math.min(n, QUESTIONS.length)))];
  let html = `<p class="ja">学籍番号（4桁）</p>`;
  html += `<p><input type="text" id="sid" inputmode="numeric" maxlength="4" autocomplete="off" value="${esc(studentId || loadId())}"></p>`;
  html += `<p class="ja">問題数を選んでください（全${QUESTIONS.length}問から出題）</p><div class="actions">`;
  html += counts.map(n => `<button class="primary count" data-n="${n}">${n}問</button>`).join("");
  html += `</div>`;
  app.innerHTML = html;

  const sid = document.getElementById("sid");
  const buttons = app.querySelectorAll("button.count");
  const update = () => {
    sid.value = sid.value.replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0))
                         .replace(/\D/g, "").slice(0, 4);
    buttons.forEach(b => b.disabled = !/^\d{4}$/.test(sid.value));
  };
  sid.addEventListener("input", update);
  update();

  buttons.forEach(b => b.addEventListener("click", () => {
    studentId = sid.value;
    saveId(studentId);
    start(shuffle(QUESTIONS.map((_, i) => i)).slice(0, Number(b.dataset.n)), `${b.dataset.n}問`);
  }));
}

function start(indices, label) {
  sessionLabel = label;
  sendSession();
  queue = shuffle(indices);
  records = queue.map(() => ({}));
  pos = 0;
  renderQuestion();
}

// ---------- 画面：問題 ----------
function renderQuestion() {
  const q = QUESTIONS[queue[pos]];
  const rec = records[pos];
  const checked = isChecked(rec);
  progressEl.textContent = `${studentId}｜${pos + 1} / ${queue.length}`;

  let html = `<p class="source">EXERCISES ${esc(q.src)}</p>`;
  html += `<p class="instruction">${INSTRUCTIONS[q.inst || q.type]}</p>`;
  if (q.ja) html += `<p class="ja">${esc(q.ja)}</p>`;

  if (q.type === "form") {
    if (!rec.options) rec.options = shuffle([q.answer, ...q.dummies]);
    const fills = rec.choice === undefined ? null : rec.options[rec.choice];
    const atStart = q.template.startsWith("{}");
    let i = 0;
    const body = esc(q.template).replace(/\{\}/g, () => {
      const k = i++;
      return `<span class="slot">${fills ? esc(k === 0 && atStart ? cap(fills[k]) : fills[k]) : "&nbsp;"}</span>`;
    });
    if (q.verb) html += `<p class="hint">［ ${esc(q.verb)} ］</p>`;
    html += `<p class="sentence">${body}</p>`;
    html += `<div class="pool" id="options">` + rec.options.map((o, oi) =>
      `<button class="chunk${oi === rec.choice ? " selected" : ""}" data-i="${oi}" ${checked ? "disabled" : ""}>${esc(optionLabel(q, o))}</button>`
    ).join("") + `</div>`;
  }

  if (q.type === "blanks") {
    if (!rec.sels) rec.sels = q.blanks.map(() => "");
    if (!rec.opts) rec.opts = q.blanks.map(b => b.verb ? (q.words ? q.words.choices : VERB_CHOICES) : shuffle([b.answer, ...b.dummies]));
    const atStart = q.template.startsWith("{}");
    let i = 0;
    const body = esc(q.template).replace(/\{\}/g, () => {
      const k = i++;
      const opts = rec.opts[k].map(o =>
        `<option value="${esc(o)}" ${o === rec.sels[k] ? "selected" : ""}>${esc(k === 0 && atStart ? cap(o) : o)}</option>`
      ).join("");
      return `<select data-k="${k}" ${checked ? "disabled" : ""}><option value="">―</option>${opts}</select>`;
    });
    const box = q.words ? q.words.box : VERB_BOX;
    if (box) html += `<div class="verbs">${esc(box)}</div>`;
    html += `<p class="sentence">${body}</p>`;
  }

  if (q.type === "order") {
    if (!rec.pool) {
      do { rec.pool = shuffle(q.chunks); } while (rec.pool.join(" ") === q.answer.join(" "));
      rec.picked = [];
    }
    html += `<p class="sentence" id="line"></p><div class="pool" id="pool"></div>`;
  }

  html += `<div class="actions">`;
  html += `<button id="back" ${pos === 0 ? "disabled" : ""}>もどる</button>`;
  if (!checked) html += `<button id="skip">とばす</button>`;
  html += `<button class="primary" id="main">${checked ? (pos + 1 < queue.length ? "次へ" : "結果を見る") : "答え合わせ"}</button>`;
  html += `</div><div id="fb"></div>`;
  app.innerHTML = html;

  document.getElementById("back").addEventListener("click", () => { pos--; renderQuestion(); });
  if (!checked) document.getElementById("skip").addEventListener("click", onSkip);
  document.getElementById("main").addEventListener("click", onMain);

  if (q.type === "form" && !checked) {
    app.querySelectorAll("#options button").forEach(b => b.addEventListener("click", () => {
      rec.choice = Number(b.dataset.i);
      renderQuestion();
    }));
  }
  if (q.type === "blanks" && !checked) {
    app.querySelectorAll("select").forEach(el => el.addEventListener("change", () => {
      rec.sels[Number(el.dataset.k)] = el.value;
      updateMain(q, rec);
    }));
  }
  if (q.type === "order") renderOrder(q, rec, checked);

  if (checked) renderFeedback(q, rec.result);
  else updateMain(q, rec);
}

function renderOrder(q, rec, checked) {
  const line = document.getElementById("line");
  const poolEl = document.getElementById("pool");

  const chosen = rec.picked.map((pi, k) =>
    `<button class="chunk" data-k="${k}" ${checked ? "disabled" : ""}>${esc(displayChunk(q, rec.pool[pi], k === 0))}</button>`
  ).join(" ");
  const slots = rec.picked.length < rec.pool.length ? ` <span class="slot">&nbsp;</span>` : "";
  line.innerHTML = joinSentence([esc(q.before), chosen + slots, esc(q.after)]);

  poolEl.innerHTML = rec.pool.map((text, pi) =>
    rec.picked.includes(pi) ? "" : `<button class="chunk" data-pi="${pi}" ${checked ? "disabled" : ""}>${esc(text)}</button>`
  ).join("");

  if (checked) return;
  line.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
    rec.picked.splice(Number(b.dataset.k), 1);
    renderOrder(q, rec, false);
  }));
  poolEl.querySelectorAll("button").forEach(b => b.addEventListener("click", () => {
    rec.picked.push(Number(b.dataset.pi));
    renderOrder(q, rec, false);
  }));
  updateMain(q, rec);
}

function isReady(q, rec) {
  if (q.type === "form") return rec.choice !== undefined;
  if (q.type === "blanks") return rec.sels.every(v => v);
  return rec.picked.length === rec.pool.length;
}

function updateMain(q, rec) {
  document.getElementById("main").disabled = !isReady(q, rec);
}

function judge(q, rec) {
  if (q.type === "form") return rec.options[rec.choice].join(" ") === q.answer.join(" ");
  if (q.type === "blanks") return q.blanks.every((b, i) => rec.sels[i] === b.answer);
  return rec.picked.map(pi => rec.pool[pi]).join(" ") === q.answer.join(" ");
}

function renderFeedback(q, result) {
  const marks = {
    correct: `<p class="mark ok">○ 正解</p>`,
    wrong:   `<p class="mark ng">× 不正解</p>`,
    skipped: `<p class="mark">とばした問題</p>`
  };
  let fb = `<div class="feedback">`;
  fb += marks[result];
  fb += `<p class="answer">${esc(fullAnswer(q))}</p>`;
  if (q.trans) fb += `<p>${esc(q.trans)}</p>`;
  if (q.note) fb += `<p class="note">${esc(q.note).replace(/\n/g, "<br>")}</p>`;
  fb += `</div>`;
  document.getElementById("fb").innerHTML = fb;
}

function onMain() {
  const q = QUESTIONS[queue[pos]];
  const rec = records[pos];
  if (isChecked(rec)) { next(); return; }
  rec.result = judge(q, rec) ? "correct" : "wrong";
  sendLog(q, rec);
  renderQuestion();
  document.getElementById("main").focus();
}

function onSkip() {
  records[pos].result = "skipped";
  sendLog(QUESTIONS[queue[pos]], records[pos]);
  renderQuestion();
  document.getElementById("main").focus();
}

function next() {
  pos++;
  if (pos < queue.length) renderQuestion();
  else renderResult();
}

// ---------- 画面：結果 ----------
function renderResult() {
  progressEl.textContent = "";
  const score = records.filter(r => r.result === "correct").length;
  const skipped = records.filter(r => r.result === "skipped").length;
  const missed = queue.filter((_, i) => records[i].result !== "correct");

  let html = `<p class="result">${score} / ${queue.length} 問正解</p>`;
  if (skipped) html += `<p class="ja">とばした問題：${skipped}問</p>`;
  html += `<div class="actions">`;
  if (missed.length) html += `<button class="primary" id="retryWrong">間違えた・とばした問題（${missed.length}問）</button>`;
  html += `<button id="home">問題数を選び直す</button></div>`;
  app.innerHTML = html;

  if (missed.length) document.getElementById("retryWrong").addEventListener("click", () => start(missed, `復習${missed.length}問`));
  document.getElementById("home").addEventListener("click", renderHome);
}

document.getElementById("title").textContent = LESSON_TITLE;
renderHome();
