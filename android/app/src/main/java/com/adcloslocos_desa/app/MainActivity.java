package com.adcloslocos_desa.app;

import android.graphics.Color;
import android.os.Bundle;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // 🚀 RECUPERAMOS LA VELOCIDAD: Sin el (WebView) redundante
    WebView webView = this.getBridge().getWebView();

    // 🎨 Forzamos que el contenedor base sea transparente
    webView.setBackgroundColor(Color.TRANSPARENT);
  }
}
