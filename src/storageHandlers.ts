import { AwsClient } from "aws4fetch";

// const r2 = new AwsClient({
//   accessKeyId: "",
//   secretAccessKey: "",
// });

interface Manifest {
    schemaVersion: number;
    mediaType: string;
    config: object;
    layers: Array<object>;
}

interface BlobUploadInitiationResult {
    uploadUrl: string;
    range: string;
}

// Interface for the storage handlers module

// Function to check if a blob exists
export async function checkBlobExists(namespace: string, repo: string, digest: string): Promise<boolean> {
    // Dummy implementation - replace with actual storage logic
    return false; // Assuming the blob does not exist
}

// Function to get a manifest
export async function getManifest(namespace: string, repo: string, tag: string): Promise<Manifest | null> {
    // Dummy implementation - replace with actual storage logic
    return null; // Assuming the manifest does not exist
}

// Function to store a manifest
export async function storeManifest(namespace: string, repo: string, tag: string, manifestData: any): Promise<void> {
    // Dummy implementation - replace with actual storage logic
}

// Function to initiate a blob upload
export async function initiateBlobUpload(namespace: string, repo: string, env: Env): Promise<BlobUploadInitiationResult> {
    // Dummy implementation - replace with actual storage logic

    const bucketName = "";
    const accountId = "";

    const url = new URL(
      `https://4b3171ff71e3ae92baef4bbf32e769ff.r2.cloudflarestorage.com/navarchos-preview`
    );

    // preserve the original path
    url.pathname = `${namespace}/${repo}/blobs/uploads`;

    // Specify a custom expiry for the presigned URL, in seconds
    url.searchParams.set("X-Amz-Expires", "60");

    const signed = await r2.sign(
      new Request(url, {
        method: "PUT",
      }),
      {
        aws: { signQuery: true },
      }
    );

    return {
        uploadUrl: signed.url,
        range: '0-1023'
    };
}

// Function to store a chunk of a blob
export async function storeBlobChunk(sessionId: string, data: ArrayBuffer): Promise<number> {
    // Dummy implementation - replace with actual storage logic
    return 0; // Assuming no data is stored
}
