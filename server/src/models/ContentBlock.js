export class ContentBlock {
  constructor(id, type, content, index) {
    this.id = id;
    this.type = type;
    this.content = content;
    this.index = index;
  }

  serialize() {
    return {
      id: this.id,
      type: this.type,
      content: this.content,
      index: this.index,
    };
  }

  static fromJson(json) {
    return new ContentBlock(json.id, json.type, json.content, json.index);
  }

  static fromJsonArray(jsonArray) {
    return jsonArray.map((json) => ContentBlock.fromJson(json));
  }
}
