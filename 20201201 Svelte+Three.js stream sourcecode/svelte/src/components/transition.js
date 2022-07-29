import gsap from 'gsap';
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(SplitText);

export function customtransition(node, { speed = 50 }) {

    let tl = gsap.timeline();
    let duration =  600;
    let chars = new SplitText(node, {type:"chars"}); 
    tl.from(chars.chars,{
        duration: duration/1000,
        rotate: 90,
        opacity: 0,
        y: 10,
        stagger: 0.1
    })

    return {
        duration,
        tick: t => {
            tl.progress(t);
        }
    };
}