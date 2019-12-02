class Parser {
  cursor = -1;

  error = false;

  xmlString = "";

  json = {};

  constructor(xmlString) {
    this.xmlString = xmlString;
  }

  doParse() {
    this.readDeclaration();
    this.json = Object.assign({}, this.readNode());
    return this;
  }

  readDeclaration() {
    this.cursor = this.xmlString.indexOf("?>");
    if (this.xmlString.includes("<!DOCTYPE")) {
      this.cursor = this.xmlString.indexOf("]>") + 2;
    }
    this.next();
  }

  next() {
    const index = this.xmlString.indexOf("<", this.cursor);
    this.cursor =
      this.xmlString.indexOf("<![CDATA[", index) === 0
        ? this.cursor
        : index + 1;
  }

  readNode(sibling) {
    const node = {};
    const nextTest = /^[\s\n]*<(?!\/|!\[CDATA\[)/;
    const openTagStop = this.xmlString.indexOf(">", this.cursor);
    const openTag = this.readTag(
      this.xmlString.substring(this.cursor, openTagStop)
    );

    Object.assign(node, openTag.nodeAttr);

    const parent = { [openTag.nodeName]: node };

    this.cursor = openTagStop + 1;

    // not closed
    if (this.xmlString.indexOf("/>", this.cursor - 2) !== this.cursor - 2) {
      // child
      if (
        nextTest.test(this.xmlString.substring(this.cursor, this.cursor + 1024))
      ) {
        this.next();
        Object.assign(node, this.readNode());
      }

      const text = this.readText(openTag.nodeName);
      if (!!text && !/^\s+$/.test(text)) {
        node.content = text;
      }
    }

    if (
      nextTest.test(this.xmlString.substring(this.cursor, this.cursor + 1024))
    ) {
      this.next();
      this.addChildren(sibling || parent, this.readNode(sibling || parent));
    }

    if (
      Object.keys(node).length === 0 || // <tag></tag>
      (Object.keys(node).length === 1 && typeof node.content === "string") // <tag>content text</tag>
      // <tag foo="bar"></tag> => length => 1  but content => undefined
      // <tag foo="bar">content text</tag> => length => 2 content => string
    ) {
      parent[openTag.nodeName] = node.content || "";
    }

    return parent;
  }

  addChildren(parent, child) {
    Object.keys(child).forEach(key => {
      if (!!parent[key]) {
        if (!Array.isArray(parent[key])) {
          parent[key] = [parent[key]];
        }
        parent[key].push(child[key]);
      } else {
        parent[key] = child[key];
      }
    });
  }

  readText(nodeName) {
    let text = "";
    let start = this.cursor;
    let end = this.xmlString.indexOf("</" + nodeName + ">", start);
    let cdStart = -1;
    let cdEnd;
    if (end < 0) {
      return text;
    }
    while (
      (cdStart = this.xmlString.indexOf("<![CDATA[", start)) > -1 &&
      cdStart < end
    ) {
      text += transEntities(this.xmlString.substring(start, cdStart));
      cdEnd = this.xmlString.indexOf("]]>", cdStart);
      text += this.xmlString.substring(cdStart + 9, cdEnd);
      start = cdEnd + 3;
      end = this.xmlString.indexOf("</" + nodeName + ">", start);
    }
    text += transEntities(this.xmlString.substring(start, end));
    this.cursor = end + nodeName.length + 3;
    return text;
  }

  readTag(tag) {
    const nodeName = tag.split(/\s+/)[0];
    const nodeAttr = {};
    let result = null;
    const patt = /([^\s]+)=(['"])([^"']+?)(\2)|([^\s]+)=([^\s"']+)/g;
    while ((result = patt.exec(tag)) !== null) {
      if (!!result[1]) {
        nodeAttr[result[1]] = transEntities(result[3]);
      } else if (!!result[5]) {
        nodeAttr[result[5]] = transEntities(result[6]);
      }
    }
    return { nodeName, nodeAttr };
  }
}

const transEntities = str => {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
};

const xml2json = xmlString => {
  var result = new Parser(xmlString).doParse();
  if (!result.error) {
    return result.json;
  } else {
    throw new Error(result.error);
  }
};
export { xml2json };
