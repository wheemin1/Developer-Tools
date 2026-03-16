export class DetectionUtils {
  static detectURLEncoding(text: string): "encode" | "decode" {
    if (!text) return "encode"

    const hasEncodedChars = /%[0-9A-Fa-f]{2}/.test(text)
    const isPlainText = /^[a-zA-Z0-9\s\-._~:/?#[\]@!$&'()*+,;=]*$/.test(text)

    if (hasEncodedChars) {
      return "decode"
    } else if (isPlainText && text.includes(" ")) {
      return "encode"
    }

    return "encode"
  }

  static detectBase64(text: string): "encode" | "decode" {
    if (!text) return "encode"

    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/
    const isBase64Like = base64Regex.test(text) && text.length % 4 === 0 && text.length > 4

    return isBase64Like ? "decode" : "encode"
  }

  static detectTextCase(text: string): string {
    if (!text) return ""

    if (/^[a-z]+([A-Z][a-z]*)*$/.test(text)) return "camelCase"
    if (/^[A-Z][a-z]*([A-Z][a-z]*)*$/.test(text)) return "PascalCase"
    if (/^[a-z]+(_[a-z]+)*$/.test(text)) return "snake_case"
    if (/^[a-z]+(-[a-z]+)*$/.test(text)) return "kebab-case"
    if (/^[A-Z]+(_[A-Z]+)*$/.test(text)) return "UPPER_CASE"
    if (/^[a-z\s]+$/.test(text)) return "lowercase"
    if (/^[A-Z\s]+$/.test(text)) return "UPPERCASE"
    if (/^[A-Z][a-z]*(\s[A-Z][a-z]*)*$/.test(text)) return "Title Case"

    return ""
  }
}
