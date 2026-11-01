package com.masrofy.app;

import android.app.DownloadManager;
import android.content.ContentValues;
import android.content.Context;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

@CapacitorPlugin(name = "NativeDownloader")
public class NativeDownloaderPlugin extends Plugin {

    @PluginMethod
    public void downloadFile(PluginCall call) {
        String filename = call.getString("filename", "Masrofy_Export.csv");
        String content = call.getString("content", "");
        String mimeType = call.getString("mimeType", "text/csv");

        Context context = getContext();
        if (context == null) {
            call.reject("Context is null");
            return;
        }

        try {
            Uri fileUri = null;

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                ContentValues values = new ContentValues();
                values.put(MediaStore.MediaColumns.DISPLAY_NAME, filename);
                values.put(MediaStore.MediaColumns.MIME_TYPE, mimeType);
                values.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS);

                fileUri = context.getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
                if (fileUri != null) {
                    try (OutputStream os = context.getContentResolver().openOutputStream(fileUri)) {
                        if (os != null) {
                            os.write(content.getBytes(StandardCharsets.UTF_8));
                            os.flush();
                        }
                    }
                }
            } else {
                File downloadsDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
                if (!downloadsDir.exists()) {
                    //noinspection ResultOfMethodCallIgnored
                    downloadsDir.mkdirs();
                }
                File file = new File(downloadsDir, filename);
                try (FileOutputStream fos = new FileOutputStream(file)) {
                    fos.write(content.getBytes(StandardCharsets.UTF_8));
                    fos.flush();
                }
                fileUri = Uri.fromFile(file);

                DownloadManager dm = (DownloadManager) context.getSystemService(Context.DOWNLOAD_SERVICE);
                if (dm != null) {
                    dm.addCompletedDownload(filename, "Masrofy exported file", true, mimeType, file.getAbsolutePath(), file.length(), true);
                }
            }

            if (fileUri != null) {
                JSObject ret = new JSObject();
                ret.put("success", true);
                ret.put("uri", fileUri.toString());
                call.resolve(ret);
            } else {
                call.reject("Failed to create file URI in Downloads");
            }
        } catch (Exception e) {
            call.reject("Native download failed: " + e.getMessage(), e);
        }
    }
}
