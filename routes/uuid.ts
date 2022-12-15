import { v4 } from "uuid";

const id = v4();

export function render() {
  const html = String.raw;
  return html/*html*/ `
    <div>
      <h1>Hello Vite!</h1>
      ${id}
    </div>
  `;
}
