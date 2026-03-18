export interface JWTParts {
  header: string
  payload: string
  signature: string
  headerDecoded: Record<string, unknown>
  payloadDecoded: Record<string, unknown>
}

export interface JWTValidationResult {
  isValid: boolean
  parts?: JWTParts
  warnings: string[]
  error?: string
}

export class JWTUtils {
  private static parseBase64Json(part: string): Record<string, unknown> {
    const normalized = part.replace(/-/g, "+").replace(/_/g, "/")
    const parsed = JSON.parse(atob(normalized))

    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      throw new Error("Invalid JWT JSON payload")
    }

    return parsed as Record<string, unknown>
  }

  private static getNumericClaim(obj: Record<string, unknown>, key: string): number | null {
    const value = obj[key]
    return typeof value === "number" ? value : null
  }

  static decode(token: string): JWTValidationResult {
    if (!token.trim()) {
      return {
        isValid: false,
        warnings: [],
        error: "Token is empty",
      }
    }

    try {
      const parts = token.split(".")
      if (parts.length !== 3) {
        throw new Error("JWT must have exactly 3 parts separated by dots")
      }

      const [headerB64, payloadB64, signature] = parts

      // Decode header and payload
      const headerDecoded = this.parseBase64Json(headerB64)
      const payloadDecoded = this.parseBase64Json(payloadB64)

      const jwtParts: JWTParts = {
        header: headerB64,
        payload: payloadB64,
        signature,
        headerDecoded,
        payloadDecoded,
      }

      const warnings = this.validateToken(headerDecoded, payloadDecoded)

      return {
        isValid: true,
        parts: jwtParts,
        warnings,
      }
    } catch (error) {
      return {
        isValid: false,
        warnings: [],
        error: error instanceof Error ? error.message : "Invalid JWT token",
      }
    }
  }

  private static validateToken(header: Record<string, unknown>, payload: Record<string, unknown>): string[] {
    const warnings: string[] = []

    // Check expiration
    const exp = this.getNumericClaim(payload, "exp")
    if (exp !== null) {
      const expDate = new Date(exp * 1000)
      if (expDate < new Date()) {
        warnings.push("Token has expired")
      }
    }

    // Check not before
    const nbf = this.getNumericClaim(payload, "nbf")
    if (nbf !== null) {
      const nbfDate = new Date(nbf * 1000)
      if (nbfDate > new Date()) {
        warnings.push("Token is not yet valid (nbf)")
      }
    }

    // Check algorithm
    if (header.alg === "none") {
      warnings.push("Token uses 'none' algorithm (not secure)")
    }

    return warnings
  }

  static formatTimestamp(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleString()
  }
}
