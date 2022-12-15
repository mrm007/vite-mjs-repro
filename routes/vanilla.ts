import { mockAdapter, setAdapter } from "@vanilla-extract/css/adapter";

setAdapter(mockAdapter);

export function render() {
  const html = String.raw;
  return html/*html*/ `
    <div>
      <h1>Hello Vite!</h1>
    </div>
  `;
}
