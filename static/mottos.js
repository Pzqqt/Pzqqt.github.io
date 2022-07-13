let mottos = [
    '大喜大悲看清自己，大起大落看清朋友，没有一个足够宽容的心，就看不到一个春光明媚的世界。 | 沈从文',
    '不考虑明天是对的；但为了不去考虑明天，只有一个办法：就是每刻都提醒自己，我是否完成了此日、此时、此刻应做的事。 | 托尔斯泰',
    '我选择沉默的主要原因之一：从话语中，你很少能学到人性，从沉默中却能。假如还想学得更多，那就要继续一声不吭 。 | 王小波『沉默的大多数』',
    '生命之伟大，除了家庭和亲人，什么都不值得我们牺牲。',
    '♥ Do have faith in what you\'re doing. | V2EX',
    '不要虚掷你的黄金时代，不要去倾听枯燥乏味的东西，不要设法挽留无望的失败，不要把你的生命献给无知、平庸和低俗。 | 王尔德',
    '生命中一定要有所热爱。不见得我们能够将自己所热爱的事情作为职业，但一定要有一件事，它是我们在所有其他人、事、物上付出时间与心力的充分理由，是我们作出任何努力的发心所在，也是我们整个生命之流的导归之处。若没有它，我们将活得漫无目的，鸡零狗碎。 | 扎西拉姆·多多『小蓝本』',

];
function get_random_motto() { return mottos[Math.floor(Math.random()*mottos.length)]; };
let p_motto = document.getElementById("motto");
while (1) {
    let motto_text = get_random_motto();
    // 不要在窄屏上显示太长的motto
    if (window.innerWidth < 768 && motto_text.length >= 70) continue;
    p_motto.innerHTML = motto_text;
    break;
}
