const button_container = document.querySelector(".button-container");
const [buo, phu, duing, drung] = document.querySelectorAll("button");

duing.addEventListener("mouseover", event => {
    const duration_time = 500;
    let index = Array.from(button_container.children).indexOf(duing);
    let transforming = [
        {transform: "translateY(0px)"},
        {transform: "translateY(-96px)"},
    ]
    if (index === 0) {
        transforming[1]["transform"] = "translateY(288px)"
    }
    duing.animate(transforming, {
        duration: duration_time,
        easing: "ease-in-out"
    });
    setTimeout(() => {
        button_container.insertBefore(duing, button_container.children[index - 1]);
    }, duration_time);
});

urls = [
    "https://baike.baidu.com/item/%E6%B3%A2%E5%B0%94%E5%B8%83%E7%89%B9/2795984?fromModule=lemma_search-box",
    "https://baike.baidu.com/item/%E5%BC%97%E6%8B%89%E5%9F%BA%E7%B1%B3%E5%B0%94%C2%B7%E5%BC%97%E6%8B%89%E5%9F%BA%E7%B1%B3%E7%BD%97%E7%BB%B4%E5%A5%87%C2%B7%E6%99%AE%E4%BA%AC/1156718?fromModule=lemma_search-box&fromtitle=%E6%99%AE%E4%BA%AC&fromid=589294",
    "https://baike.baidu.com/pic/%E7%BA%A6%E7%91%9F%E5%A4%AB%C2%B7%E6%8B%9C%E7%99%BB/5363618/0/8601a18b87d6277f9e2fe69c346a0830e924b899564e?fr=lemma&fromModule=lemma_content-image&ct=single#aid=0&pic=0df431adcbef76094b363cafe58cb4cc7cd98d1030fb",
    "https://baike.baidu.com/item/%E5%BC%A0%E7%8C%AE%E5%BF%A0/849777?fr=aladdin",
]

for (let index = 0; index < button_container.children.length; ++index) {
    button_container.children[index].addEventListener("click", event => {
        window.open(urls[index], "_blank");
    });
}
