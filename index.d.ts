/**
 * Type definitions for stake-crash-predictor SHA utilities
 * A modernized and lightweight TypeScript interface for SHA-256 / SHA-224
 * used within the Stake Crash Predictor & Stake Mines Predictor tools.
 *
 * Repo: https://github.com/stake-mines/stake-crash-predictor
 * License: MIT
 */

type StakeMessage = string | number[] | ArrayBuffer | Uint8Array;

/**
 * Represents an active hashing instance for incremental updates.
 */
interface StakeHasher {
  /**
   * Continues hashing with additional message data.
   * @param message Input message for the current hash process.
   */
  update(message: StakeMessage): StakeHasher;

  /** Finalizes and returns the resulting hash as a lowercase hexadecimal string. */
  hex(): string;

  /** Alias of `hex()` for convenience. */
  toString(): string;

  /** Returns the hash as a raw ArrayBuffer. */
  arrayBuffer(): ArrayBuffer;

  /** Returns the hash result as an array of 32-bit integers. */
  digest(): number[];

  /** Returns the hash as an integer array (alias of digest). */
  array(): number[];
}

/**
 * Hash-based Message Authentication Code (HMAC) operations
 * using SHA-256 or SHA-224 algorithms.
 */
interface StakeHmac {
  (secretKey: StakeMessage, message: StakeMessage): string;

  /** Initializes an HMAC instance using the given secret key. */
  create(secretKey: StakeMessage): StakeHasher;

  /** Updates and returns a running HMAC instance. */
  update(secretKey: StakeMessage, message: StakeMessage): StakeHasher;

  /** Computes an HMAC and returns a hex string. */
  hex(secretKey: StakeMessage, message: StakeMessage): string;

  /** Computes an HMAC and returns the ArrayBuffer result. */
  arrayBuffer(secretKey: StakeMessage, message: StakeMessage): ArrayBuffer;

  /** Computes an HMAC and returns the numeric digest array. */
  digest(secretKey: StakeMessage, message: StakeMessage): number[];

  /** Computes an HMAC and returns it as a numeric array (alias of digest). */
  array(secretKey: StakeMessage, message: StakeMessage): number[];
}

/**
 * Primary hashing interface for SHA-256 / SHA-224 algorithms.
 */
interface StakeHash {
  (message: StakeMessage): string;

  /** Creates a new hasher for streaming updates. */
  create(): StakeHasher;

  /** Initializes a hasher and begins updating with a message. */
  update(message: StakeMessage): StakeHasher;

  /** Returns a hexadecimal string hash. */
  hex(message: StakeMessage): string;

  /** Returns an ArrayBuffer hash output. */
  arrayBuffer(message: StakeMessage): ArrayBuffer;

  /** Returns the hash as a numeric digest array. */
  digest(message: StakeMessage): number[];

  /** Returns the hash as an array (alias of digest). */
  array(message: StakeMessage): number[];

  /** Provides access to the HMAC API. */
  hmac: StakeHmac;
}

/** SHA-256 instance for the stake-crash-predictor project. */
export var sha256: StakeHash;

/** SHA-224 instance for compatibility and extended hashing. */
export var sha224: StakeHash;
