export class TextProcessor {
  static encodeURL(text: string): string {
    return encodeURIComponent(text)
  }

  static decodeURL(text: string): string {
    return decodeURIComponent(text)
  }

  static encodeBase64(text: string): string {
    return btoa(unescape(encodeURIComponent(text)))
  }

  static decodeBase64(text: string): string {
    return decodeURIComponent(escape(atob(text)))
  }

  static formatJSON(text: string): string {
    const parsed = JSON.parse(text)
    return JSON.stringify(parsed, null, 2)
  }

  static minifyJSON(text: string): string {
    const parsed = JSON.parse(text)
    return JSON.stringify(parsed)
  }

  static validateJSON(text: string): { isValid: boolean; error?: string } {
    try {
      JSON.parse(text)
      return { isValid: true }
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : "Invalid JSON",
      }
    }
  }
}

export class CaseConverter {
  static toCamelCase(text: string): string {
    return text
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase()
      })
      .replace(/\s+/g, "")
  }

  static toPascalCase(text: string): string {
    return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase()).replace(/\s+/g, "")
  }

  static toSnakeCase(text: string): string {
    return text
      .replace(/\W+/g, " ")
      .split(/ |\B(?=[A-Z])/)
      .map((word) => word.toLowerCase())
      .join("_")
  }

  static toKebabCase(text: string): string {
    return text
      .replace(/\W+/g, " ")
      .split(/ |\B(?=[A-Z])/)
      .map((word) => word.toLowerCase())
      .join("-")
  }

  static toUpperCase(text: string): string {
    return text
      .replace(/\W+/g, " ")
      .split(/ |\B(?=[A-Z])/)
      .map((word) => word.toUpperCase())
      .join("_")
  }

  static toLowerCase(text: string): string {
    return text.toLowerCase()
  }

  static toUpperCaseAll(text: string): string {
    return text.toUpperCase()
  }

  static toTitleCase(text: string): string {
    return text.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
  }

  static toSentenceCase(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
  }

  static convert(text: string, caseType: string): string {
    switch (caseType) {
      case "camel":
        return this.toCamelCase(text)
      case "pascal":
        return this.toPascalCase(text)
      case "snake":
        return this.toSnakeCase(text)
      case "kebab":
        return this.toKebabCase(text)
      case "upper":
        return this.toUpperCase(text)
      case "lower":
        return this.toLowerCase(text)
      case "upperall":
        return this.toUpperCaseAll(text)
      case "title":
        return this.toTitleCase(text)
      case "sentence":
        return this.toSentenceCase(text)
      default:
        return text
    }
  }
}

export class WhitespaceProcessor {
  static trimOnly(text: string): string {
    return text.trim()
  }

  static removeLineBreaks(text: string): string {
    return text.replace(/\r?\n/g, " ").trim()
  }

  static removeExtraSpaces(text: string): string {
    return text.replace(/\s+/g, " ").trim()
  }

  static removeTabs(text: string): string {
    return text.replace(/\t/g, " ").trim()
  }

  static convertToSingleSpace(text: string): string {
    return text.replace(/\s+/g, " ").trim()
  }
  
  static removeAllWhitespace(text: string): string {
    return text.replace(/\s/g, "")
  }

  static clean(
    text: string,
    options: {
      trimOnly?: boolean
      removeLineBreaks?: boolean
      removeExtraSpaces?: boolean
      removeTabs?: boolean
      convertToSingleSpace?: boolean
      removeAllWhitespace?: boolean
    },
  ): string {
    if (!text) return ""

    // Special case: remove all whitespace completely
    if (options.removeAllWhitespace) {
      return this.removeAllWhitespace(text)
    }

    // If trimOnly is true, only trim the text and ignore other options
    if (options.trimOnly) {
      return this.trimOnly(text)
    }

    let result = text

    // Process options in a logical order
    if (options.removeTabs) {
      result = result.replace(/\t/g, " ")
    }

    if (options.removeLineBreaks) {
      result = result.replace(/\r?\n/g, " ")
    }

    // Handle both removeExtraSpaces and convertToSingleSpace with one operation
    // since they do essentially the same thing
    if (options.removeExtraSpaces || options.convertToSingleSpace) {
      result = result.replace(/\s+/g, " ")
    }

    // Always trim the result at the end
    return result.trim()
  }
}
