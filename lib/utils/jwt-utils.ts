export interface JWTParts {
  header: string
  payload: string
  signature: string
  headerDecoded: any
  payloadDecoded: any
}

export interface JWTValidationResult {
  isValid: boolean
  parts?: JWTParts
  warnings: string[]
  error?: string
}

export class JWTUtils {
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
      const headerDecoded = JSON.parse(atob(headerB64.replace(/-/g, "+").replace(/_/g, "/")))
      const payloadDecoded = JSON.parse(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")))

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

  private static validateToken(header: any, payload: any): string[] {
    const warnings: string[] = []

    // Check expiration
    if (payload.exp) {
      const expDate = new Date(payload.exp * 1000)
      if (expDate < new Date()) {
        warnings.push("Token has expired")
      }
    }

    // Check not before
    if (payload.nbf) {
      const nbfDate = new Date(payload.nbf * 1000)
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
