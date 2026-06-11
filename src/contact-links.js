import { CONTACT_CONTENT, getContactActionHref, getContactHref } from "./shared/contact-content.js";

function createEmailLink() {
  const link = document.createElement("a");
  link.href = getContactHref();
  link.textContent = CONTACT_CONTENT.email;
  return link;
}

function appendContactPart(container, part) {
  if (typeof part === "string") {
    container.append(document.createTextNode(part));
    return;
  }

  if (part?.type === "email") {
    container.append(createEmailLink());
  }
}

function renderContactBlock(element, blockId) {
  const parts = CONTACT_CONTENT.blocks[blockId];
  if (!parts) return;

  element.replaceChildren();
  parts.forEach((part) => appendContactPart(element, part));
}

document.querySelectorAll("[data-contact-block]").forEach((element) => {
  renderContactBlock(element, element.getAttribute("data-contact-block"));
});

document.querySelectorAll("[data-contact-email]").forEach((element) => {
  if (!(element instanceof HTMLAnchorElement)) return;
  element.href = getContactHref();
  element.textContent = CONTACT_CONTENT.email;
});

document.querySelectorAll("[data-contact-action]").forEach((element) => {
  if (!(element instanceof HTMLAnchorElement)) return;
  element.href = getContactActionHref(element.getAttribute("data-contact-action"));
});
