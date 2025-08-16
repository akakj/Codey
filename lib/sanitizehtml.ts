import sanitizeHtml from "sanitize-html";

export function sanitizeProblemHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "div", "span", "code", "sup", "sub"
    ]),
    allowedAttributes: {
      div: ["class"],
      span: ["class"],
      code: [],
      sup: [],
      sub: [],
    },
  });
}
