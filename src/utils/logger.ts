export default function logger(msg: string) {
  const el: HTMLDivElement = document.querySelector(".logger")!;
  el.innerText = msg + "\n" + el.innerText;
}
