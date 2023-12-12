package com.companycamvibecheck

import android.app.ActivityManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import android.content.Context
import android.os.PowerManager

class CompanycamVibeCheckModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  val powerManager = reactContext.getSystemService(Context.POWER_SERVICE) as PowerManager
  val activityManager = reactContext.getSystemService(Context.ACTIVITY_SERVICE) as ActivityManager
  
  override fun getName(): String {
    return NAME
  }

  fun normalizeAndroidThermalState(thermalState: Int): String {
    return when (thermalState) {
      0, 1 -> "nominal"
      2 -> "fair"
      3 -> "serious"
      4, 5, 6 -> "critical"
      else -> "unknown"
    }
  }

  @ReactMethod
  fun getMemoryInfo(promise: Promise) {
    val memoryInfo = ActivityManager.MemoryInfo()
    activityManager.getMemoryInfo(memoryInfo)
    val availMem = memoryInfo.totalMem - memoryInfo.availMem;
    promise.resolve(availMem.toString())
  }

  @ReactMethod
  fun getThermalState(promise: Promise) {
    // let osVer = android.os.Build.VERSION.SDK_INT;
    // if (osVer >= 29) {
    //   promise.resolve(normalizeAndroidThermalState(powerManager.currentThermalStatus));
    // }
    promise.resolve(normalizeAndroidThermalState(-1))
  }

  companion object {
    const val NAME = "CompanycamVibeCheck"
  }
}
