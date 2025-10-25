import { useEffect, useRef } from "react";

const SplitText = ({
                       text = "",
                       className = "",
                       delay = 0.05, // seconds between letters
                       tag = "h1",
                       textAlign = "center",
                       style = {}, // <-- accept style prop
                   }) => {
    const ref = useRef(null);

    useEffect(() => {
        if (!ref.current) return;

        const element = ref.current;
        element.innerHTML = ""; // clear existing content

        const letters = text.split("").map((char) => {
            const span = document.createElement("span");
            span.textContent = char === " " ? "\u00A0" : char; // preserve spaces
            span.style.opacity = 0;
            span.style.display = "inline-block";
            span.style.transform = "translateY(20px)";
            if (style.color) span.style.color = style.color; // <-- apply color
            element.appendChild(span);
            return span;
        });

        letters.forEach((span, i) => {
            setTimeout(() => {
                span.style.transition = "all 0.5s ease";
                span.style.opacity = 1;
                span.style.transform = "translateY(0)";
            }, i * delay * 1000);
        });
    }, [text, delay, style.color]); // add style.color to dependency

    const Tag = tag;
    return (
        <Tag
            ref={ref}
            className={className}
            style={{ display: "inline-block", textAlign, ...style }}
        />
    );
};

export default SplitText;
