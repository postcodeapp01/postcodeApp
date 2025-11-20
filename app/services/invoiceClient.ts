// // services/invoiceClient.ts
// import { Platform, PermissionsAndroid, Alert } from 'react-native';
// import RNFS from 'react-native-fs';
// import Share from 'react-native-share';
// import axiosInstance from '../../config/Api';

// type GenerateResp = {
//   success: boolean;
//   data?: {
//     fileName?: string;
//     fileUrl?: string;
//     fileBase64?: string;
//     savedPath?: string;
//   };
//   message?: string;
// };

// /**
//  * Request invoice generation from backend.
//  * Expects backend route: GET /api/invoices/generate/:orderId OR POST /api/invoices/generate { orderId }
//  */
// export async function requestInvoiceFromServer(orderId: string | number): Promise<GenerateResp> {
//   // choose GET or POST depending on your backend; I'm using GET /api/invoices/generate/:orderId
//   const resp = await axiosInstance.get<GenerateResp>(`/invoices/generate/${encodeURIComponent(String(orderId))}`);
//   return resp.data;
// }

// /**
//  * Ensure Android WRITE permission (for downloads on older Android versions).
//  */
// async function ensureAndroidWritePermission(): Promise<boolean> {
//   if (Platform.OS !== 'android') return true;
//   if (Platform.Version && Platform.Version >= 30) {
//     // Android 11+ uses scoped storage; RNFS Download path may still work. No runtime permission required for Downloads via RNFS on many setups.
//     return true;
//   }
//   try {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//       {
//         title: 'Storage permission required',
//         message: 'The app needs storage permission to save invoice PDF',
//         buttonPositive: 'OK',
//         buttonNegative: 'Cancel',
//       },
//     );
//     return granted === PermissionsAndroid.RESULTS.GRANTED;
//   } catch (err) {
//     console.warn('Permission error', err);
//     return false;
//   }
// }

// /**
//  * Save base64 PDF to device and return local path.
//  * If androidSaveToDownloads = true, attempt to write to Downloads; else Documents dir.
//  */
// export async function saveBase64PdfToDevice(base64: string, filename = 'invoice.pdf', androidSaveToDownloads = true): Promise<string> {
//   const canWrite = await ensureAndroidWritePermission();
//   if (!canWrite) throw new Error('Storage permission not granted');

//   const safeFileName = filename.replace(/[^a-zA-Z0-9_.-]/g, '_');

//   let targetPath: string;
//   if (Platform.OS === 'android' && androidSaveToDownloads) {
//     targetPath = `${RNFS.DownloadDirectoryPath}/${safeFileName}`;
//   } else {
//     targetPath = `${RNFS.DocumentDirectoryPath}/${safeFileName}`;
//   }

//   // Write base64 file (overwrites if exists)
//   await RNFS.writeFile(targetPath, base64, 'base64');

//   // On Android you might want to scan the file so it appears in Downloads apps:
//   if (Platform.OS === 'android' && RNFS.scanFile) {
//     try { await RNFS.scanFile(targetPath); } catch (e) { /* non-fatal */ }
//   }

//   return targetPath;
// }

// /**
//  * Download file from a public URL to device and return local path.
//  */
// export async function downloadFileToDevice(fileUrl: string, filename = 'invoice.pdf'): Promise<string> {
//   const canWrite = await ensureAndroidWritePermission();
//   if (!canWrite) throw new Error('Storage permission not granted');

//   const safeFileName = filename.replace(/[^a-zA-Z0-9_.-]/g, '_');
//   const destPath = Platform.OS === 'android' ? `${RNFS.DownloadDirectoryPath}/${safeFileName}` : `${RNFS.DocumentDirectoryPath}/${safeFileName}`;

//   const options = {
//     fromUrl: fileUrl,
//     toFile: destPath,
//     // optional: progress callback
//     // background: true,
//     // discretionary: true,
//   };

//   const dl = RNFS.downloadFile(options);
//   const result = await dl.promise;

//   if (result.statusCode && result.statusCode >= 400) {
//     throw new Error(`Download failed with status ${result.statusCode}`);
//   }

//   // scan on android
//   if (Platform.OS === 'android' && RNFS.scanFile) {
//     try { await RNFS.scanFile(destPath); } catch (_) {}
//   }

//   return destPath;
// }

// /**
//  * Share or open the file using react-native-share
//  */
// export async function openAndShareFile(localFilePath: string) {
//   const shareOptions = {
//     title: 'Invoice',
//     url: Platform.OS === 'android' ? `file://${localFilePath}` : localFilePath,
//     type: 'application/pdf',
//     failOnCancel: false,
//   };
//   await Share.open(shareOptions);
// }

// /**
//  * High-level helper: request invoice, save it and return local path.
//  * It will prefer server-provided fileBase64; fallback to fileUrl.
//  */
// export async function generateAndDownloadInvoice(orderId: string | number, opts?: { preferBase64?: boolean }) : Promise<{ localPath: string; fileName?: string }> {
//   const resp = await requestInvoiceFromServer(orderId);
//   if (!resp || !resp.success || !resp.data) {
//     throw new Error(resp?.message ?? 'Invoice generation failed');
//   }

//   const fileName = resp.data.fileName ?? `invoice_${orderId}.pdf`;

//   if (resp.data.fileBase64) {
//     // server returned base64; write to disk
//     const localPath = await saveBase64PdfToDevice(resp.data.fileBase64, fileName);
//     return { localPath, fileName };
//   }

//   if (resp.data.fileUrl) {
//     const localPath = await downloadFileToDevice(resp.data.fileUrl, fileName);
//     return { localPath, fileName };
//   }

//   // If server saved file and returned savedPath on same host and we can fetch it, try fileUrl again:
//   if (resp.data.savedPath) {
//     // savedPath may be server absolute; try to construct URL if needed (not always possible)
//     throw new Error('Server returned savedPath but no public URL/base64. Please return fileUrl or fileBase64 from backend.');
//   }

//   throw new Error('No file returned by server');
// }
// services/invoiceClient.ts
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { Platform, PermissionsAndroid } from 'react-native';
import axiosInstance from '../../config/Api';

async function ensureAndroidWritePermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;
  if (Platform.Version && Platform.Version >= 30) return true;
  const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

function bufferToBase64(buffer: ArrayBuffer) {
  // browser-like conversion
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.slice(i, i + chunkSize)));
  }
  return global.btoa ? global.btoa(binary) : Buffer.from(binary, 'binary').toString('base64');
}

async function writeBase64ToFile(base64: string, filename: string) {
  await ensureAndroidWritePermission();
  const safe = filename.replace(/[^a-zA-Z0-9_.-]/g, '_');
  const path = Platform.OS === 'android' ? `${RNFS.DownloadDirectoryPath}/${safe}` : `${RNFS.DocumentDirectoryPath}/${safe}`;
  await RNFS.writeFile(path, base64, 'base64');
  return path;
}

/**
 * Try to download fileUrl as binary (axios responseType arraybuffer) and save.
 * Will throw if 4xx/5xx.
 */
async function downloadUrlAsFile(fileUrl: string, filename: string) {
  // ensure absolute URL - if server returned relative path, prefix with your API base
  const url = fileUrl.startsWith('http') ? fileUrl : `${axiosInstance.defaults.baseURL?.replace(/\/+$/, '')}${fileUrl.startsWith('/') ? '' : '/'}${fileUrl}`;
  const resp = await axiosInstance.get(url, { responseType: 'arraybuffer' });
  const base64 = bufferToBase64(resp.data);
  return writeBase64ToFile(base64, filename);
}

/**
 * High-level function used by UI:
 * - Calls /invoices/generate/:orderId
 * - If backend returns fileBase64 -> save
 * - If backend returns fileUrl -> download (tries direct then authenticated fallback)
 */
export async function requestAndSaveInvoice(orderId: string | number) {
  const gen = await axiosInstance.get(`/invoices/generate/${encodeURIComponent(String(orderId))}`);
  if (!gen?.data?.success) throw new Error(gen?.data?.message || 'Generation failed');

  const { fileBase64, fileUrl, fileName } = gen.data.data || {};
  const name = fileName || `invoice_${orderId}.pdf`;

  if (fileBase64) {
    const local = await writeBase64ToFile(fileBase64, name);
    return { localPath: local };
  }

  if (fileUrl) {
    try {
      const local = await downloadUrlAsFile(fileUrl, name);
      return { localPath: local };
    } catch (err: any) {
      // if direct fileUrl failed with 404 or 403, attempt authenticated streaming endpoint
      console.warn('Download direct failed, trying authenticated stream fallback:', err?.message ?? err);
      // backend fallback: GET /invoices/download/:filename (requires auth cookie/headers via axiosInstance)
      try {
        const filename = fileUrl.split('/').pop() ?? name;
        const fallbackResp = await axiosInstance.get(`/invoices/download/${encodeURIComponent(filename)}`, { responseType: 'arraybuffer' });
        const base64 = bufferToBase64(fallbackResp.data);
        const local = await writeBase64ToFile(base64, name);
        return { localPath: local };
      } catch (err2) {
        console.error('Fallback download failed', err2);
        throw err; // rethrow original
      }
    }
  }

  throw new Error('Server returned no file data (no fileUrl or fileBase64).');
}

export async function openFile(localPath: string) {
  await Share.open({
    title: 'Invoice',
    url: Platform.OS === 'android' ? `file://${localPath}` : localPath,
    type: 'application/pdf',
  });
}
