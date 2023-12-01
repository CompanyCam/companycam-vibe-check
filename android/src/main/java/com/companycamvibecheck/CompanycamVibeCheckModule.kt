package com.companycamvibecheck

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import android.content.Context
import android.os.PowerManager

class CompanycamVibeCheckModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  val powerManager = reactContext.getSystemService(Context.POWER_SERVICE) as PowerManager
  
  override fun getName(): String {
    return NAME
  }

  fun normalizeAndroidThermalState(thermalState: Int): String {
    return when (thermalState) {
      0, 1 -> "nominal"
      2 -> "fair"
      3 -> "serious"
      4, 5, 6 -> "critical"
      else -> "nominal"
    }
  }
  @ReactMethod
  fun getThermalState(promise: Promise) {
    promise.resolve(normalizeAndroidThermalState(powerManager.currentThermalStatus));
  }

  companion object {
    const val NAME = "CompanycamVibeCheck"
  }
}
