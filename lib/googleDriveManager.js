import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const CREDENTIALS_PATH = path.join(__dirname, '../credentials.json');

let authClient = null;

async function authorize() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.warn('⚠️  Google Drive: credentials.json not found.');
    return null;
  }

  try {
    const content = fs.readFileSync(CREDENTIALS_PATH, 'utf8');
    const credentials = JSON.parse(content);

    const auth = new google.auth.GoogleAuth({
      credentials: credentials,
      scopes: ['https://www.googleapis.com/auth/drive.file']
    });

    return auth;
  } catch (err) {
    console.error('Google Drive auth error:', err.message);
    return null;
  }
}

export async function initGoogleDrive() {
  authClient = await authorize();
  return authClient !== null;
}

export async function uploadToGoogleDrive(filePath, fileName, folderId) {
  if (!authClient) {
    console.warn('⚠️  Google Drive not authorized');
    return null;
  }

  try {
    const drive = google.drive({ version: 'v3', auth: authClient });

    const fileMetadata = {
      name: fileName,
      parents: folderId ? [folderId] : []
    };

    const media = {
      mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      body: fs.createReadStream(filePath)
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, webViewLink'
    });

    return {
      fileId: file.data.id,
      webLink: file.data.webViewLink,
      fileName: fileName
    };
  } catch (error) {
    console.error('Google Drive upload error:', error.message);
    return null;
  }
}

export async function uploadPDFToGoogleDrive(filePath, fileName, folderId) {
  if (!authClient) {
    console.warn('⚠️  Google Drive not authorized');
    return null;
  }

  try {
    const drive = google.drive({ version: 'v3', auth: authClient });

    const fileMetadata = {
      name: fileName,
      parents: folderId ? [folderId] : []
    };

    const media = {
      mimeType: 'application/pdf',
      body: fs.createReadStream(filePath)
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, webViewLink'
    });

    return {
      fileId: file.data.id,
      webLink: file.data.webViewLink,
      fileName: fileName
    };
  } catch (error) {
    console.error('Google Drive upload error:', error.message);
    return null;
  }
}

export function isGoogleDriveAvailable() {
  return authClient !== null;
}
