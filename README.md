# AAClient

`aa-client` is a TypeScript library designed for interacting with the AA (Account Aggregator) ecosystem. It provides functionality for managing consents, handling financial information requests, and verifying signatures using JSON Web Tokens (JWTs) with RS256 algorithms.

## What is the difference between v1 and v2?
In version `v2`, the underlying `jose` package has been updated to the latest version. The latest version of the package implements a much stricter check while verifying the `x-jws-signature`. Apart from this, there is no breaking change in the current implementation of the package. You can use both the version, owever the jose package in `v1` will be frozen to previous version to avoid any breaking change for you until you are ready to migrate to `v2`.

## Features

- **Consent Management**: Raise and retrieve consents by handle or ID.
- **Financial Information Requests**: Raise and fetch financial information requests.
- **Signature Verification**: Generate and verify JWT signatures.
- **Heartbeat Check**: Perform a heartbeat check to ensure the service is operational.

## Installation

To install `aa-client`, use npm or yarn:

```bash
npm install aa-client
```

or

```bash
yarn add aa-client
```

## Usage

### Creating an Instance

Use the `createAAClient` function to create an instance of the `AAClient`:

```typescript
import { createAAClient } from 'aa-client';
import { JWK } from 'jose';

// Define your JWK private key
const privateKey = JWK.asKey({ /* Your JWK private key here */ }, 'RS256');

// Create an instance of AAClient with a specific logging level
const client = createAAClient(privateKey, 'debug'); // Logging level can be 'error' or 'debug'
```

### Example Usage

```typescript
// Example: Raise consent
client.raiseConsent('https://api.example.com', 'your-api-key', { /* consent details */ }, "aapublickey")
  .then(response => {
    console.log('Consent raised:', response);
  })
  .catch(error => {
    console.error('Error raising consent:', error);
  });

// Example: Fetch financial information
client.fetchFI('https://api.example.com', 'your-api-key', { /* request details */ },"aapublickey")
  .then(response => {
    console.log('Financial Information:', response);
  })
  .catch(error => {
    console.error('Error fetching financial information:', error);
  });
```

## API Reference

### `createAAClient`

```typescript
createAAClient(privateKey: JWK, level?: 'error' | 'debug'): AAClient
```

- **Parameters**:
  - `privateKey` (JWK): JSON Web Key used for signing JWTs.
  - `level` (string, optional): Logging level, can be `'error'` or `'debug'`. Defaults to `'error'`.
- **Returns**: An instance of `AAClient`.
- **Description**: Creates and returns an instance of `AAClient` with the specified logging level.

### `AAClient`

#### Methods

- **`generateDetachedJWS(payload: Record<string, any>)`**

  ```typescript
  client.generateDetachedJWS(payload: Record<string, any>): Promise<string>
  ```

  - **Parameters**:
    - `payload` (object): Data to be signed.
  - **Returns**: `Promise<string>` - The generated detached JWT signature.
  - **Description**: Generates a detached JSON Web Signature (JWS) for the given payload.

- **`verifySignature(payload: Record<string, any>, signature: string, publicKey: JWK)`**

  ```typescript
  client.verifySignature(payload: Record<string, any>, signature: string, publicKey: JWK): Promise<{ isVerified: boolean; message?: string }>
  ```

  - **Parameters**:
    - `payload` (object): Data that was signed.
    - `signature` (string): JWT signature to verify.
    - `publicKey` (JWK): JSON Web Key used for verification.
  - **Returns**: `Promise<{ isVerified: boolean; message?: string }>` - Verification result.
  - **Description**: Verifies the signature of a given payload.

- **`raiseConsent(baseUrl: string, token: string, consentDetail: ConsentTypes.IConstentDetail, publicKey: JWK)`**

  ```typescript
  client.raiseConsent(baseUrl: string, token: string, consentDetail: ConsentTypes.IConstentDetail): Promise<IResponse<ConsentTypes.IConsentResponse>>
  ```

  - **Parameters**:
    - `baseUrl` (string): Base URL for the API.
    - `token` (string): API key or token.
    - `consentDetail` (ConsentTypes.IConstentDetail): Details of the consent to be raised.
    - `publicKey` (JWK): The public Key of the AA. This is required to verify the response signature
  - **Returns**: `Promise<IResponse<ConsentTypes.IConsentResponse>>` - Response from the API.
  - **Description**: Raises a consent request with the provided details.

- **`getConsentByHandle(baseUrl: string, token: string, handle: string, publicKey: JWK)`**

  ```typescript
  client.getConsentByHandle(baseUrl: string, token: string, handle: string): Promise<IResponse<ConsentTypes.IConsentByHandleResponse>>
  ```

  - **Parameters**:
    - `baseUrl` (string): Base URL for the API.
    - `token` (string): API key or token.
    - `handle` (string): Consent handle.
    - `publicKey` (JWK): The public Key of the AA. This is required to verify the response signature
  - **Returns**: `Promise<IResponse<ConsentTypes.IConsentByHandleResponse>>` - Response from the API.
  - **Description**: Retrieves consent details by handle.

- **`getConsentById(baseUrl: string, token: string, id: string, publicKey: JWK)`**

  ```typescript
  client.getConsentById(baseUrl: string, token: string, id: string): Promise<IResponse<ConsentTypes.IConsentByIdResponse>>
  ```

  - **Parameters**:
    - `baseUrl` (string): Base URL for the API.
    - `token` (string): API key or token.
    - `id` (string): Consent ID.
    - `publicKey` (JWK): The public Key of the AA. This is required to verify the response signature
  - **Returns**: `Promise<IResponse<ConsentTypes.IConsentByIdResponse>>` - Response from the API.
  - **Description**: Retrieves consent details by ID.

- **`raiseFIRequest(baseUrl: string, token: string, body: FITypes.IFIRequest, keys: FITypes.IKeys, publicKey: JWK)`**

  ```typescript
  client.raiseFIRequest(baseUrl: string, token: string, body: FITypes.IFIRequest, keys: FITypes.IKeys): Promise<{ keys: FITypes.IKeys; response: IResponse<FITypes.IFIRequestResponse> }>
  ```

  - **Parameters**:
    - `baseUrl` (string): Base URL for the API.
    - `token` (string): API key or token.
    - `body` (FITypes.IFIRequest): Request body.
    - `keys` (FITypes.IKeys): Keys for the request.
    - `publicKey` (JWK): The public Key of the AA. This is required to verify the response signature
  - **Returns**: `Promise<{ keys: FITypes.IKeys; response: IResponse<FITypes.IFIRequestResponse> }>` - Response from the API and keys.
  - **Description**: Raises a financial information request.

- **`fetchFI(baseUrl: string, token: string, body: FITypes.IFIFetchRequest, publicKey: JWK)`**

  ```typescript
  client.fetchFI(baseUrl: string, token: string, body: FITypes.IFIFetchRequest): Promise<{ response: IResponse<FITypes.IFIFetchResponse>; FIData?: Array<Record<string, any>> }>
  ```

  - **Parameters**:
    - `baseUrl` (string): Base URL for the API.
    - `token` (string): API key or token.
    - `body` (FITypes.IFIFetchRequest): Fetch request body.
    - `publicKey` (JWK): The public Key of the AA. This is required to verify the response signature
  - **Returns**: `Promise<{ response: IResponse<FITypes.IFIFetchResponse>; FIData?: Array<Record<string, any>> }>` - Response from the API and optionally, fetched financial data.
  - **Description**: Fetches financial information.

- **`getHeartBeat(baseUrl: string)`**

  ```typescript
  client.getHeartBeat(baseUrl: string): Promise<IResponse<ConsentTypes.IHeartbeat>>
  ```

  - **Parameters**:
    - `baseUrl` (string): Base URL for the API.
  - **Returns**: `Promise<IResponse<ConsentTypes.IHeartbeat>>` - Response from the API.
  - **Description**: Performs a heartbeat check to ensure the service is operational.

## Configuration

You need to provide the following configuration when creating an instance of `AAClient`:

```typescript
import { createAAClient } from 'aa-client';
import { JWK } from 'jose';

// Define your JWK private key
const privateKey = JWK.asKey({ /* Your JWK private key here */ }, 'RS256');

// Create an instance of AAClient with a specific logging level
const client = createAAClient(privateKey, 'debug'); // Logging level can be 'error' or 'debug'
```

## License

`aa-client` is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please open an issue on GitHub or contact us at [contact@s25.digital](mailto:contact@s25.digital).
